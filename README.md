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

## Instructions

![circlebio](https://i.ibb.co/sw93rpn/Screenshot-2024-02-21-115447.png)

- Log in.
- Drag and drop or click to upload FASTA or BAM files. The maximum file size is 500 MB.

### What It Does With DNA Data

Depending on the type of file uploaded, the tool can figure out the length of the DNA sequence, how much of it is made up of certain genetic materials (G/C content), and even flip the sequence into its reverse complement. For more complex files, it can show how many different pieces of data were stitched together to make up the sequence and provide a visual representation in a form of a histogram.
