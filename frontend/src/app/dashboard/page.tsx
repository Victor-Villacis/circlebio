'use client';
import { FileUpload } from '@/app/ui/dashboard/file-upload ';
import { JobStatusTableBam } from '@/app/ui/dashboard/job-process-bam';
import { JobStatusTableFasta } from '@/app/ui/dashboard/job-process-fasta';
import { useState } from 'react';

export type SequenceDetail = {
  id: string;
  length: number;
  description: string;
  sequence?: string | undefined;
  gc_content: string;
  at_content: string;
  reverse_complement: string;
};

export type BamAnalysisResult = {
  total_reads: number;
  average_read_length: number;
  average_quality: number;
  average_gc_content: number;
  average_at_content: number;
  read_length_distribution: Record<string, number>;
};

export type Job = {
  id: number;
  status: string;
  uploadedAt: string;
  sequences?: SequenceDetail[] | undefined;
  bamAnalysisResult?: BamAnalysisResult;
  fileType: 'FASTA' | 'BAM' | 'SAM' | null;
};

export default function Page() {
  const [jobStatus, setJobStatus] = useState<Job[]>([]);
  let jobIdCounter = 0;

  const handleRunAnalysis = async (fileId: string) => {
    const newJobId = ++jobIdCounter;

    const newJob: Job = {
      id: newJobId,
      status: 'Processing',
      uploadedAt: new Date().toISOString(),
      fileType: null,
    };

    setJobStatus((prevJobs) => [...prevJobs, newJob]);

    try {
      const resultsResponse = await fetch(`http://localhost:8000/api/results/${fileId}`);
      if (!resultsResponse.ok) {
        throw new Error('Failed to fetch results');
      }
      const resultsData = await resultsResponse.json();

      setJobStatus((currentStatus) =>
        currentStatus.map((job) =>
          job.id === newJobId ? {
            ...job,
            status: 'Done',
            ...(resultsData.fileType === 'FASTA' ? { sequences: resultsData.sequences } : { bamAnalysisResult: resultsData }),
            fileType: resultsData.fileType,
          } : job,
        ),
      );
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      setJobStatus((prevJobs) =>
        prevJobs.map((job) =>
          job.id === newJobId ? { ...job, status: 'Error' } : job
        )
      );
    }
  };

  const fastaJobs = jobStatus.filter(job => job.fileType === 'FASTA');
  const bamJobs = jobStatus.filter(job => job.fileType === 'BAM' || job.fileType === 'SAM');

  return (
    <>
      <FileUpload onRunAnalysis={handleRunAnalysis} />
      {fastaJobs.length > 0 && <JobStatusTableFasta jobs={fastaJobs} />}
      {bamJobs.length > 0 && <JobStatusTableBam jobs={bamJobs} />}
    </>
  );
}