FROM continuumio/miniconda3

RUN conda install mamba -n base -c conda-forge
RUN mamba update -n base mamba -c conda-forge

WORKDIR /home/circlebio

COPY environment.yml ./environment.yml
COPY main.py ./main.py

RUN mamba env create -f environment.yml

SHELL ["conda", "run", "-n", "circlebio", "/bin/bash", "-c"]

EXPOSE 8000

ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "circlebio", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
