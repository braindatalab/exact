import logging
import docker
import re
import os
import tempfile
import time
import signal
from .models import Challenge
from .security import SecurityValidator

logger = logging.getLogger(__name__)

# Security settings
CONTAINER_TIMEOUT = 300  # 5 minutes max
MEMORY_LIMIT = "512m"    # 512MB RAM limit
CPU_LIMIT = "1.0"        # 1 CPU core limit
NETWORK_MODE = "none"    # No network access

class SecureWorkerManager:
    """Secure worker container management"""
    
    def __init__(self):
        self.client = docker.from_env()
        self.active_containers = {}
    
    def cleanup_container(self, container_id):
        """Force cleanup of container"""
        try:
            container = self.client.containers.get(container_id)
            container.kill()
            container.remove(force=True)
            logger.info(f"Forcefully cleaned up container {container_id}")
        except Exception as e:
            logger.warning(f"Could not cleanup container {container_id}: {e}")
    
    def create_secure_environment(self, worker_id, challenge_id, xai_method, model_filename, data_filename):
        """Create secure isolated environment for code execution"""
        return {
            'worker_id': worker_id,
            'challenge_id': challenge_id,
            'xai_method': xai_method,
            'MODEL_FILE': model_filename,
            'DATA_FILE': data_filename,
            'PYTHONPATH': '/worker',
            'TMPDIR': '/tmp/worker',
            'HOME': '/tmp/worker',
            'DEBIAN_FRONTEND': 'noninteractive',
            # Disable potentially dangerous environment variables
            'TERM': 'dumb',
            'PATH': '/usr/local/bin:/usr/bin:/bin',
        }
    
    def run_secure_container(self, image_id, command, environment, timeout=CONTAINER_TIMEOUT):
        """Run container with strict security settings"""
        container_name = f"worker_{int(time.time())}"
        
        try:
            # Create container with security restrictions
            container = self.client.containers.create(
                image=image_id,
                command=command,
                environment=environment,
                name=container_name,
                detach=True,
                # Security settings
                user="worker",  # Run as non-root user
                network_mode=NETWORK_MODE,  # No network access
                mem_limit=MEMORY_LIMIT,  # Memory limit
                cpu_quota=int(float(CPU_LIMIT) * 100000),  # CPU limit
                cpu_period=100000,
                # Additional security
                cap_drop=["ALL"],  # Drop all capabilities
                security_opt=["no-new-privileges:true"],  # Prevent privilege escalation
                read_only=True,  # Read-only filesystem
                tmpfs={'/tmp': 'noexec,nosuid,size=100m'},  # Secure temp directory
                # Prevent dangerous mounts
                volumes={},
                privileged=False,
                # Resource limits
                pids_limit=50,  # Limit number of processes
            )
            
            # Start container
            container.start()
            container_id = container.id
            self.active_containers[container_id] = container
            
            logger.info(f"Started secure container {container_name} ({container_id[:12]})")
            
            # Wait for completion with timeout
            try:
                result = container.wait(timeout=timeout)
                logs = container.logs().decode('utf-8', errors='replace')
                
                # Clean up
                container.remove()
                if container_id in self.active_containers:
                    del self.active_containers[container_id]
                
                logger.info(f"Container {container_name} completed with status {result['StatusCode']}")
                
                if result['StatusCode'] == 0:
                    return self.parse_scores_from_logs(logs)
                else:
                    logger.error(f"Container {container_name} failed with status {result['StatusCode']}")
                    logger.error(f"Error logs: {logs}")
                    return {'mean': None, 'std': None}
                    
            except docker.errors.APIError as e:
                logger.error(f"Container {container_name} timed out or failed: {e}")
                self.cleanup_container(container_id)
                return {'mean': None, 'std': None}
                
        except Exception as e:
            logger.error(f"Failed to create/run secure container: {e}")
            return {'mean': None, 'std': None}
    
    def parse_scores_from_logs(self, logs):
        """Parse scores from container logs (same as before but with added validation)"""
        scores = {'mean': None, 'std': None}
        
        # Validate log size to prevent log bombing
        if len(logs) > 10000:  # 10KB max logs
            logs = logs[:10000]
            logger.warning("Container logs truncated due to size limit")
        
        mean_match = re.search(r'(?:EMD|IMA) Mean:\s*([0-9.]+)', logs)
        if mean_match:
            try:
                scores['mean'] = float(mean_match.group(1))
            except ValueError:
                logger.warning("Invalid mean score format in logs")
        
        std_match = re.search(r'(?:EMD|IMA) Std:\s*([0-9.]+)', logs)
        if std_match:
            try:
                scores['std'] = float(std_match.group(1))
            except ValueError:
                logger.warning("Invalid std score format in logs")
        
        if scores['mean'] is None:
            final_score_match = re.search(r'FINAL_SCORE:([0-9.]+)', logs)
            if final_score_match:
                try:
                    scores['mean'] = float(final_score_match.group(1))
                except ValueError:
                    logger.warning("Invalid final score format in logs")
        
        return scores
    
    def emergency_cleanup(self):
        """Emergency cleanup of all active containers"""
        for container_id, container in self.active_containers.items():
            try:
                container.kill()
                container.remove(force=True)
                logger.info(f"Emergency cleanup of container {container_id}")
            except Exception as e:
                logger.error(f"Failed to emergency cleanup {container_id}: {e}")
        self.active_containers.clear()

def secure_spawn_worker_container(worker_id: str, challenge_id: str, xai_method: str):
    """Secure version of spawn_worker_container with comprehensive security"""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    final_scores = {'emd_score': None, 'emd_std': None, 'ima_score': None, 'ima_std': None}
    
    # Validate XAI method code first
    try:
        SecurityValidator.validate_python_code(xai_method)
    except Exception as e:
        logger.error(f"XAI method failed security validation: {e}")
        return (f"Security error: {e}", final_scores)
    
    worker_manager = SecureWorkerManager()
    
    try:
        # Load challenge data
        try:
            challenge = Challenge.objects.get(challenge_id=challenge_id)
            model_filename = os.path.basename(challenge.mlmodel.name)
            data_filename = os.path.basename(challenge.dataset.name)
            logger.info(f"Challenge {challenge_id}: Using model '{model_filename}' and data '{data_filename}'")
        except Challenge.DoesNotExist:
            logger.error(f"Challenge with ID {challenge_id} not found")
            return ("error: Challenge not found.", final_scores)
        except Exception as e:
            logger.error(f"Could not load challenge {challenge_id}: {e}")
            return (f"error: Could not load challenge. {e}", final_scores)

        try:
            worker_image = worker_manager.client.images.get("exact-worker-secure")
        except docker.errors.ImageNotFound:
            logger.error("Secure worker image not found. Please build exact-worker-secure image.")
            return ("error: Secure worker image not available.", final_scores)

        # Create secure environment
        base_environment = worker_manager.create_secure_environment(
            worker_id, challenge_id, xai_method, model_filename, data_filename
        )
        
        # Run EMD calculation
        emd_command = ["python", "emd.py"]
        emd_results = worker_manager.run_secure_container(
            worker_image.id, emd_command, base_environment
        )
        if emd_results:
            final_scores['emd_score'] = emd_results.get('mean')
            final_scores['emd_std'] = emd_results.get('std')
        
        # Run IMA calculation
        ima_command = ["python", "ima.py"]
        ima_results = worker_manager.run_secure_container(
            worker_image.id, ima_command, base_environment
        )
        if ima_results:
            final_scores['ima_score'] = ima_results.get('mean')
            final_scores['ima_std'] = ima_results.get('std')
        
        if final_scores['emd_score'] is not None or final_scores['ima_score'] is not None:
            return ("success", final_scores)
        else:
            return ("error: No valid scores could be calculated.", final_scores)
            
    except docker.errors.DockerException as e:
        logger.error(f"Docker error: {e}")
        return (f"error: Docker service error. {e}", final_scores)
    except Exception as e:
        logger.error(f"Critical error in secure worker: {e}")
        return (f"error: {e}", final_scores)
    finally:
        # Ensure cleanup
        worker_manager.emergency_cleanup()