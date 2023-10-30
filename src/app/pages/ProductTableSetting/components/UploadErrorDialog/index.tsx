import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  styled,
  TableCellProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import React from 'react';

import UPLOAD_ERROR from 'assets/background/upload-error.svg';
import CustomButton from 'app/components/Button';

export interface ProductError {
  line: number;
  erorr: string;
}

interface UploadErrorDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  err: ProductError[];
}

const UploadErrorDialog: React.FC<UploadErrorDialogProps> = ({
  isOpen,
  onClose,
  err,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth={'md'}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src={UPLOAD_ERROR} alt="upload fail img" />
          <Typography
            textAlign="center"
            sx={{
              fontSize: '1.5rem',
              lineHeight: '1.875rem',
              fontWeight: 700,
              mt: 2.75,
            }}
          >
            Tải lên bảng hàng lỗi
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1',
              mt: 2,
            }}
          >
            File tải lên đang bị lỗi, vui lòng kiểm tra lại
          </Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            mt: 2.25,
            border: '1px solid #C8CBCF',
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <CustomCell>Stt</CustomCell>
                <CustomCell>Số dòng</CustomCell>
                <CustomCell>Nguyên nhân</CustomCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {err.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <CustomCell>{String(idx + 1).padStart(3, '0')}</CustomCell>
                  <CustomCell>Dòng {row.line}</CustomCell>
                  <CustomCell>{row.erorr}</CustomCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <CustomButton
          variant="outlined"
          title="Đóng"
          sxProps={{
            borderRadius: 1,
            minWidth: '125px',
          }}
          sxPropsText={{
            fontWeight: 400,
          }}
          handleClick={() => handleClose()}
        />
      </DialogActions>
    </Dialog>
  );
};

const CustomCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  paddingTop: 12,
  paddingBottom: 12,
  borderBottom: '1px solid #C8CBCF',
}));

export default UploadErrorDialog;
