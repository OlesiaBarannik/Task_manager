# syntax=docker/dockerfile:1
FROM python:3.11

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Copy only the requirements file initially to leverage Docker cache
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . /app/

# Expose port
EXPOSE 8000

# Command to run the server
CMD ["python", "./task_manager/manage.py", "runserver", "0.0.0.0:8000", "--noreload"]
