import { Job } from '@/app/dashboard/page';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@material-ui/core';
import moment from 'moment';
import { useState } from 'react';
import { IoExpandOutline } from 'react-icons/io5';
import { MdAccessTimeFilled } from 'react-icons/md';
import ReadLengthHistogram from './read-histogram';

export function JobStatusTableBam({ jobs }: { jobs: Job[] }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleOpenModal = (title: string, content: string | Record<string, number> | undefined) => {
    setModalTitle(title);
    setModalContent(content);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <TableContainer component={Paper} className="mt-8">
        <Box className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold text-green-600">
            Aligned Sequence Data: BAM
          </h2>
        </Box>
        <Table aria-label="job status table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Reads</TableCell>
              <TableCell>Average GC%</TableCell>
              <TableCell>Average AT%</TableCell>
              <TableCell>Average Quality</TableCell>
              <TableCell>Average Read Length</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Histogram</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job: Job) => (
              <TableRow key={job.id}>
                <TableCell component="th" scope="row">
                  <span>{job.id}</span>
                </TableCell>
                <TableCell>
                  {job.status === 'Processing' ? (
                    <span className="ml-2 rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-green-800">
                      Processing...
                      <CircularProgress
                        size={10}
                        className="ml-2 text-green-500"
                      />
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-800">
                      {job.status}
                    </span>
                  )}
                </TableCell>
                <TableCell>{job.bamAnalysisResult?.total_reads}</TableCell>
                <TableCell>{job.bamAnalysisResult?.average_gc_content}%</TableCell>
                <TableCell>{job.bamAnalysisResult?.average_at_content}%</TableCell>
                <TableCell>{job.bamAnalysisResult?.average_quality}</TableCell>
                <TableCell>{job.bamAnalysisResult?.average_read_length}</TableCell>
                <TableCell>{job.fileType}</TableCell>
                <TableCell>
                  <Tooltip
                    title={moment(job.uploadedAt).format('LLLL')}
                    placement="bottom"
                    arrow
                  >
                    <div className="flex items-center space-x-1">
                      <MdAccessTimeFilled className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {moment(job.uploadedAt).fromNow()}
                      </span>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={'View Histogram'}>
                    <IconButton
                      disabled={job.status === 'Processing'}
                      onClick={() =>
                        handleOpenModal('Histogram', job.bamAnalysisResult?.read_length_distribution)
                      }
                    >
                      <IoExpandOutline />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        maxWidth="md"
      >
        <DialogTitle id="modal-title">{modalTitle}</DialogTitle>
        <DialogContent style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 'inherit', overflowY: 'auto' }}>
          {modalTitle === 'Histogram' && typeof modalContent !== 'string' ? (
            <ReadLengthHistogram readLengthDistribution={modalContent} />
          ) : (
            <div>{modalContent}</div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
}
