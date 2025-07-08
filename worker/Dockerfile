# Use official python image as parent image
FROM python:3.10-slim

# Create non-root user
RUN groupadd -r worker && useradd -r -g worker worker

# Set the working directory
WORKDIR /worker

# Install system dependencies as root
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir \
    torch==2.3.1 \
    captum==0.7.0 \
    matplotlib==3.9.1 \
    numpy==2.0.0 \
    pot==0.9.4 \
    scipy==1.14.0

# Copy application files
COPY --chown=worker:worker . /worker/

# Create restricted directories
RUN mkdir -p /tmp/worker && chown worker:worker /tmp/worker
RUN mkdir -p /worker/output && chown worker:worker /worker/output

# Switch to non-root user
USER worker

# Set environment variables for security
ENV PYTHONPATH=/worker
ENV TMPDIR=/tmp/worker
ENV HOME=/tmp/worker

# Disable network access (will be overridden by docker run if needed)
ENV NO_PROXY=*

# Resource limits will be set by docker run
LABEL security.limits.memory="512m"
LABEL security.limits.cpu="1"
LABEL security.timeout="300"

# Default command
CMD ["python", "emd.py"]
