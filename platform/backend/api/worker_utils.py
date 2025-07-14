import logging
import docker
import re
import os
from .models import Challenge

logger = logging.getLogger(__name__)

def parse_scores_from_logs(logs: str):
    scores = {'mean': None, 'std': None}
    mean_match = re.search(r'(?:EMD|IMA) Mean:\s*([0-9.]+)', logs)
    if mean_match:
        scores['mean'] = float(mean_match.group(1))
    std_match = re.search(r'(?:EMD|IMA) Std:\s*([0-9.]+)', logs)
    if std_match:
        scores['std'] = float(std_match.group(1))
    if scores['mean'] is None:
        final_score_match = re.search(r'FINAL_SCORE:([0-9.]+)', logs)
        if final_score_match:
            scores['mean'] = float(final_score_match.group(1))
    return scores

def run_metric_in_container(client: docker.DockerClient, worker_image_id: str, command: list, environment: dict):
    try:
        container = client.containers.run(
            image=worker_image_id,
            command=command,
            environment=environment,
            detach=True
        )
        result = container.wait(timeout=300)
        logs = container.logs().decode('utf-8')
        container.remove()
        
        logger.info(f"Container logs for '{' '.join(command)}':\n{logs}")

        if result['StatusCode'] == 0:
            return parse_scores_from_logs(logs)
        else:
            logger.error(f"Container for command '{' '.join(command)}' failed with status code {result['StatusCode']}.")
            return {'mean': None, 'std': None}
    except Exception as e:
        logger.error(f"An unexpected error occurred during '{' '.join(command)}': {e}")
        return {'mean': None, 'std': None}

def spawn_worker_container(worker_id: str, challenge_id: str, xai_method: str):
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    final_scores = {'emd_score': None, 'emd_std': None, 'ima_score': None, 'ima_std': None}
    
    try:
        #  loading challenge data from the database
        try:
            challenge = Challenge.objects.get(challenge_id=challenge_id)
            model_filename = os.path.basename(challenge.mlmodel.name)
            data_filename = os.path.basename(challenge.dataset.name)
            logger.info(f"Challenge {challenge_id}: Using model '{model_filename}' and data '{data_filename}'")
        except Challenge.DoesNotExist:
            logger.error(f"FATAL: Challenge with ID {challenge_id} not found in database.")
            return ("error: Challenge not found.", final_scores)
        except Exception as e:
            logger.error(f"FATAL: Could not get model/data for challenge {challenge_id}. Error: {e}")
            return (f"error: Could not get challenge files. {e}", final_scores)

        client = docker.from_env()
        worker_image = client.images.get("exact-worker")

        #  datanames as dynamic environment variables
        base_environment = {
            'worker_id': worker_id,
            'challenge_id': challenge_id,
            'xai_method': xai_method,
            'MODEL_FILE': model_filename,
            'DATA_FILE': data_filename,
        }
        
        # emd calculation
        emd_command = ["python", "emd.py"]
        emd_results = run_metric_in_container(client, worker_image.id, emd_command, base_environment)
        if emd_results:
            final_scores['emd_score'] = emd_results.get('mean')
            final_scores['emd_std'] = emd_results.get('std')
        
        # ima calculation
        ima_command = ["python", "ima.py"]
        ima_results = run_metric_in_container(client, worker_image.id, ima_command, base_environment)
        if ima_results:
            final_scores['ima_score'] = ima_results.get('mean')
            final_scores['ima_std'] = ima_results.get('std')
        
        if final_scores['emd_score'] is not None or final_scores['ima_score'] is not None:
            return ("success", final_scores)
        else:
            return ("error: No valid scores could be calculated.", final_scores)
            
    except docker.errors.DockerException as e:
        logger.error(f"Docker client error: {e}")
        return (f"error: Docker service not available. {e}", final_scores)
    except Exception as e:
        logger.error(f"Critical error in spawn_worker_container: {e}")
        return (f"error: {e}", final_scores)
