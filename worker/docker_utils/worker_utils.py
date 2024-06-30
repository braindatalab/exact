import docker
from pathlib import Path
from logging import getLogger

logger = getLogger("docker_utils")

# not used in current implementation
def spawn_container(worker_id: int) -> bool:
    try:
        # Path to your Dockerfile and the context directory
        # TODO: fix paths
        breakpoint()
        worker_folder = Path(__file__).parent / "../"
        dockerfile_path = Path(__file__).parent / "worker/Dockerfile"

        # Docker client
        client = docker.from_env()

        # Build Docker image
        image, build_logs = client.images.build(
            path=str(worker_folder),
            dockerfile=str(dockerfile_path),
            tag='worker'
        )

        # Print build logs
        for log in build_logs:
            logger.info(log)

        # Run Docker container
        container = client.containers.run(
            "worker",
            detach=True,
            environment={"worker_id": worker_id},
        )

        return True

    except Exception as e:
        logger.error(e)
        return False
