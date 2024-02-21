from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pysam
from collections import Counter
from tempfile import NamedTemporaryFile
from Bio.Seq import Seq
from Bio import SeqIO
import shutil
import os
import uuid

app = FastAPI()

# CORS setup
allowed_origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary storage for demonstration purposes
processed_data_store = {}


@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        suffix = (
            ".bam"
            if file.filename.endswith(".bam")
            else ".sam" if file.filename.endswith(".sam") else ".fasta"
        )
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        unique_id = str(uuid.uuid4())
        processed_data_store[unique_id] = process_file(tmp_path)

        return {"id": unique_id, "message": "File processed successfully"}
    finally:
        file.file.close()
        os.remove(tmp_path)


@app.get("/api/results/{id}")
async def get_results(id: str):
    if id not in processed_data_store:
        raise HTTPException(status_code=404, detail="Results not found")
    return processed_data_store[id]


def process_file(file_path: str):
    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension in [".bam", ".sam"]:
        file_type = "BAM" if file_extension == ".bam" else "SAM"
        response = process_bam_file(file_path)
    elif file_extension == ".fasta" or file_extension == ".fa":
        file_type = "FASTA"
        response = process_fasta_file(file_path, file_type)
    else:
        return {"error": f"Unsupported file format: {file_extension}"}

    if "fileType" not in response:
        response["fileType"] = file_type

    return response


def calculate_gc_at_content(sequence: str):
    gc_count = sequence.count("G") + sequence.count("C")
    at_count = sequence.count("A") + sequence.count("T")
    total_bases = gc_count + at_count
    if total_bases == 0:
        return 0, 0
    gc_content_percentage = (gc_count / total_bases) * 100
    at_content_percentage = (at_count / total_bases) * 100
    return round(gc_content_percentage, 2), round(at_content_percentage, 2)


def process_fasta_file(fasta_file_path: str, file_type: str):
    try:
        sequences = list(SeqIO.parse(fasta_file_path, "fasta"))
        sequence_info = []
        for seq_record in sequences:
            sequence_str = str(seq_record.seq)
            sequence_length = len(sequence_str)

            # Calculate both GC and AT content
            gc_content_percentage, at_content_percentage = calculate_gc_at_content(
                sequence_str
            )

            reverse_complement = str(seq_record.seq.reverse_complement())

            sequence_info.append(
                {
                    "id": seq_record.id,
                    "length": sequence_length,
                    "description": seq_record.description,
                    "sequence": sequence_str,
                    "gc_content": f"{gc_content_percentage:.2f}%",
                    "at_content": f"{at_content_percentage:.2f}%",
                    "reverse_complement": reverse_complement,
                }
            )

        return {
            "sequences": sequence_info,
            "fileType": file_type,
            "message": "File processed successfully",
        }
    except Exception as e:
        return {"error": f"Error processing FASTA file: {e}", "fileType": file_type}


def process_bam_file(bam_file_path: str):
    try:
        if not pysam.index(bam_file_path):
            pysam.index(bam_file_path)
        bam = pysam.AlignmentFile(bam_file_path, "rb")
    except Exception as e:
        return {"error": f"Error opening BAM file: {e}"}

    total_reads = 0
    total_quality = 0
    read_lengths = []
    gc_contents = []
    at_contents = []

    for read in bam.fetch():
        if not read.is_unmapped and read.query_length and read.query_qualities:
            total_reads += 1
            sequence = read.query_sequence
            read_lengths.append(read.query_length)
            quality_scores = read.query_qualities
            total_quality += (
                sum(quality_scores) / len(quality_scores) if quality_scores else 0
            )
            gc_content, at_content = calculate_gc_at_content(sequence)
            gc_contents.append(gc_content)
            at_contents.append(at_content)

    average_read_length = sum(read_lengths) / total_reads if total_reads else 0
    average_quality = total_quality / total_reads if total_reads else 0
    average_gc_content = sum(gc_contents) / len(gc_contents) if gc_contents else 0
    average_at_content = sum(at_contents) / len(at_contents) if at_contents else 0
    read_length_histogram = dict(Counter(read_lengths))

    bam.close()

    return {
        "fileType": "BAM",
        "total_reads": total_reads,
        "average_read_length": round(average_read_length, 1),
        "average_quality": round(average_quality, 1),
        "average_gc_content": round(average_gc_content, 1),
        "average_at_content": round(average_at_content, 1),
        "read_length_distribution": read_length_histogram,
    }
