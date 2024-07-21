import logging
import io
import tarfile
import docker
import logging

# Define the maximum number of running containers
MAX_RUNNING_CONTAINERS = 3

logger = logging.getLogger("utils")

def spawn_worker_container(worker_id: str, challenge_id: str, xai_method: str):
    # logger
    logging.basicConfig(filename="utils.log", filemode="w", format="%(asctime)s - %(levelname)s - %(message)s")
    logger = logging.getLogger("utils")
    file_handler = logging.FileHandler('logs.log')
    logger.addHandler(file_handler)

    # use logger.warning() to print to log file
    logger.warning(f'worker_id:{worker_id}')
    # to copy the log file into your exact folder use: "docker cp exact-backend-1:/app/logs.log logs.log" AFTER you terminated the backend container

    score = None # Initilize score

    try:
        
        # Docker client
        client = docker.from_env()

        # Check if there is capacity for an additional worker
        running_containers = client.containers.list(filters={"ancestor": "exact-worker"})
        logger.warning(f'CURRENTLY RUNNING CONTAINERS: {len(running_containers)}')

        if len(running_containers) >= MAX_RUNNING_CONTAINERS:
            return ("Worker limit reached, try again later.", score)

        # Building the Docker image requires docker buildkit
        # Build Docker image (needed?)
        # dockerfile_path = './worker'
        # image, build_logs = client.images.build(path=dockerfile_path, tag='exact-worker')

        # Run Docker container
        container = client.containers.run(
            image = "exact-worker",
            detach=True,
            name = worker_id,
            environment={'worker_id':worker_id, 'challenge_id':challenge_id, 'xai_method':xai_method} # pass important data as env variables
        )
        
        container.wait()        

        # Print container logs
        logs = container.logs().decode('utf-8')
        logger.warning(logs)

        # Get final score from the container's logs
        score_lines = [ line for line in logs.splitlines() if 'FINAL_SCORE:' in line ]
        if (len(score_lines) > 0):
            score = float(score_lines[0].split(':')[1])

        container.remove()

        return ("success", score)

    except Exception as e:
        logger.error(e)
        return ("error: {e}", score)
    