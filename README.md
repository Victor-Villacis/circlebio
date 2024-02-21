# Plasmid Sequence Analysis Tool

## Prerequisites

Before you begin, please install Docker on your system.

- Docker: The backend service runs inside a Docker container, so you must have Docker installed on your machine.

## Backend

### 1. Build the Image

`cd circlebio/backend` and run the following commands

```
docker build -t circlebio_image .
```

### 2. Start the Container

```
docker run -it -p 8000:8000 --name circlebio_container -v "$(pwd):/home/circlebio" circlebio_image
```

## Frontend

### 1. Install && Start the Server

`cd circlebio/frontend` and then install modules and start server with `yarn install && yarn dev`.

## Description
