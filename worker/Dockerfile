# Use official python image as parent image
FROM python:3.10

# Set the working directory to /app
WORKDIR /worker

# Install any needed packages specified in requirements.txt
RUN pip install torch==2.3.1
# RUN pip install torchmetrics
RUN pip install captum==0.7.0
# RUN pip install scikit-learn==1.3.2
# RUN pip install pandas==1.5.3
RUN pip install matplotlib==3.9.1
RUN pip install numpy==2.0.0
RUN pip install requests==2.31.0
RUN pip install pot==0.9.4
RUN pip install scipy==1.14.0
# Copy the current directory contents in the container at /worker
COPY . /worker/


# Run emd.py when the container launches
CMD ["python", "emd.py"]
