import { Box } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TiDelete } from 'react-icons/ti';

export function FileUpload({ onRunAnalysis }: { onRunAnalysis: () => void }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      fileRejections.forEach((rejection) => {
        if (rejection.errors[0].code === 'file-too-large') {
          setError('File is too large. Maximum size is 500MB.');
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a .fasta, .sam, or .bam, file.');
        } else if (rejection.errors[0].code === 'too-many-files') {
          setError('Multiple files not allowed. Please upload one file at a time, or use batch processing.');
        }
        else {
          setError('An error occurred with the file upload.');
        }
      });
      return;
    }

    const file = acceptedFiles[0];
    setUploadedFile(file);


    const formData = new FormData();


    formData.append("file", file);
    fetch('http://localhost:8000/api/upload/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        onRunAnalysis(data.id);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while uploading the file.');
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.fasta', '.sam'],
      'application/octet-stream': ['.bam'],
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024,
  });

  const handleCancelUpload = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div>
      <div className="mb-4 text-left">
        <h2 className="text-lg font-semibold text-green-600">
          Simplified BAM & FASTA File Management
        </h2>
      </div>

      <div className="flex w-full flex-col items-center justify-center font-sans">
        <Box
          {...getRootProps()}
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-300 bg-white hover:bg-green-100"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">{isDragActive ? "Drop the file here..." : "Drag or click to upload a file (Max size: 500MB)"}</p>
        </Box>

        {error && (
          <div className="mt-2 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {uploadedFile && (
          <div className="mt-3 flex items-center text-sm font-medium text-green-700">
            Uploaded File: <span className="text-green-800 ml-2">{uploadedFile.name}</span> (size: {
              uploadedFile.size < 1024 * 1024 ?
                `${(uploadedFile.size / 1024).toFixed(2)} KB` :
                `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
            })
            <button
              onClick={handleCancelUpload}
              className="ml-2"
              aria-label="Cancel upload"
            >
              <TiDelete className="cursor-pointer text-red-500 hover:text-red-600" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}