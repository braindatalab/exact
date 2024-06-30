# Use official python image as parent image
FROM python:3.10

# Set the working directory to /app
WORKDIR /worker

# Install any needed packages specified in requirements.txt
RUN pip install torch==2.1.1
RUN pip install torchmetrics
RUN pip install captum==0.6.0
RUN pip install scikit-learn==1.3.2
RUN pip install pandas==1.5.3
RUN pip install matplotlib==3.4.3
RUN pip install numpy==1.26.0
RUN pip install requests==2.31.0
RUN pip install pot==0.9.3
# Copy the current directory contents in the container at /worker
COPY . /worker/


# Run app.py when the container launches
# When instantiating worker containers from backend, use this
CMD ["python", "emd.py"]

# temporary solution, given that we only need one working
# up and running along the platform.
# command to execute evaluation script from within the container
# docker exec -it evalxai-worker-1 python evaluate.py
#CMD ["sleep", "infinity"]