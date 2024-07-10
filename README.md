# Task Manager

## Overview

Task Manager is a Django-based project designed to help manage tasks and projects efficiently. This repository contains all the necessary files to build and run the project using Docker.

## Project Structure

The main components of the project are organized as follows:

```
Task_manager/
│
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Dockerfile for building the project image
├── README.md              # Project README file
├── requirements.txt       # Python dependencies
└── task_manager/          # Main Django project directory
    ├── manage.py          # Django management script
    ├── projects/          # Django app for managing projects
    ├── task_manager/      # Django project settings and configuration
    └── tasks/             # Django app for managing tasks
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

### Installation

1. **Clone the repository:**

    ```sh
    git clone <repository_url>
    cd Task_manager
    ```

2. **Build and run the Docker containers:**

    ```sh
    docker-compose up --build
    ```

    This command will build the Docker image and start the containers defined in `docker-compose.yml`.


### Accessing the Application

Once the containers are up and running, you can access the application at:
The project will operate at the address
```
http://127.0.0.1:8000/projects/
```

### Stopping the Application

To stop the running containers, use:

```sh
docker-compose down
```

## Project Dependencies

All Python dependencies are listed in the `requirements.txt` file. These are installed automatically when you build the Docker image.

