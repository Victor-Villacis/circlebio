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

import { Job } from '@/app/dashboard/page';
import moment from 'moment';
import { useState } from 'react';
import { IoExpandOutline } from 'react-icons/io5';
import { MdAccessTimeFilled } from 'react-icons/md';

export function JobStatusTableFasta({ jobs }: { jobs: Job[] }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleOpenModal = (title: string, content: string) => {
    setModalTitle(title);
    if (title === 'Sequence' || title === 'Reverse Complement') {
      setModalContent(colorizeSequence(content));
    } else {
      setModalContent(content);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  function colorizeSequence(sequence: string) {
    const colors = {
      A: '#00A86B',
      T: '#DC143C',
      C: '#007BA7',
      G: '#F28500',
    };

    return sequence.split('').map((nucleotide, index) => (
      <span key={index} style={{
        backgroundColor: (colors as { [key: string]: string })[nucleotide] || '#000000',
        color: '#FFFFFF',
        padding: '0 2px',
        marginRight: '1px',
      }}>
        {nucleotide}
      </span>
    ));
  }

  return (
    <>
      <TableContainer component={Paper} className="mt-8">
        <Box className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold text-green-600">
            Genomic Sequences: FASTA
          </h2>
        </Box>
        <Table aria-label="job status table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>GC%</TableCell>
              <TableCell>AT%</TableCell>
              <TableCell>Sequence</TableCell>
              <TableCell>Reverse <br />Complement</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Uploaded</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job: Job) => (
              <TableRow key={job.id}>
                <TableCell component="th" scope="row">
                  <Tooltip title={job.sequences?.[0]?.id ?? 'No Sequence'}>
                    <span>{job.id}</span>
                  </Tooltip>
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
                <TableCell>{job.sequences?.[0].length}</TableCell>
                <TableCell>{job.sequences?.[0].gc_content}</TableCell>
                <TableCell>{job.sequences?.[0].at_content}</TableCell>
                <TableCell>
                  <Tooltip title={'View Sequences'}>
                    <IconButton
                      disabled={job.status === 'Processing'}
                      onClick={() =>
                        handleOpenModal('Sequence', job.sequences?.[0]?.sequence ?? 'No sequence available')
                      }
                    >
                      <IoExpandOutline />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={'View Reverse Complement'}>
                    <IconButton
                      disabled={job.status === 'Processing'}
                      onClick={() =>
                        handleOpenModal('Reverse Complement', job.sequences?.[0]?.reverse_complement ?? 'No reverse complement available')
                      }
                    >
                      <IoExpandOutline />
                    </IconButton>
                  </Tooltip>
                </TableCell>
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
        maxWidth="lg"
        fullWidth={true}
      >

        <DialogTitle id="modal-title">{modalTitle}</DialogTitle>
        <DialogContent style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 'inherit', overflowY: 'auto' }}>
          {modalContent}
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
