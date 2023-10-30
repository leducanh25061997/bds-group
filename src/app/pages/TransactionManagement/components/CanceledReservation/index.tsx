import { Box, Dialog, DialogTitle, Grid, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import ICON_FILE_EXCEL from 'assets/background/excel_icon.svg';
import ICON_CHECKED from 'assets/background/icon-checked.svg';
import ICON_DELETE from 'assets/background/icon-delete-file.svg';
import UPLOAD_FILE from 'assets/background/upload-file-template-icon.svg';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { default as document } from 'services/api/document';
import palette from 'styles/theme/palette';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useTransactionManagementSlice } from '../../slice';
import { CanceledRequest } from '../../slice/type';

interface CanceledProps {
  isOpen: boolean;
  onClose?: () => void;
  ticketId?: string;
  title?: string;
  fileId: string[];
  setFileId: Dispatch<SetStateAction<string[]>>;
  handleSubmit: () => void;
}

type FileInfo = {
  path: string;
  id: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CanceledReservation: React.FC<CanceledProps> = props => {
  const { isOpen, onClose, ticketId, title, fileId, setFileId, handleSubmit } =
    props;
  const dispatch = useDispatch();
  const { actions } = useTransactionManagementSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const drop = useRef<null | HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<FileInfo[]>([]);
  // const [fileId, setFileId] = useState<string[]>();

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'File không hợp lệ',
            type: 'error',
          }),
        );
      }
      if (
        acceptedFiles?.length > 5 ||
        attachments.length + acceptedFiles.length > 5
      ) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Tối đa chỉ được tải lên 5 file!',
            type: 'error',
          }),
        );
        return;
      }
      if (acceptedFiles?.length) {
        const arrFilesIds: FileInfo[] = await document.uploadFilesPath(
          acceptedFiles,
        );
        setAttachments(prev => [...prev, ...arrFilesIds]);

        if (arrFilesIds?.length) {
          const ids = arrFilesIds.map(item => item.id);
          setFileId(prev => [...prev, ...ids]);
        }
      }
    },
    [attachments.length, setFileId],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'image/*': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
  });

  const handleDeleteFile = (id: string) => {
    setAttachments(prev => prev.filter(item => item.id !== id));
    setFileId(prev => prev.filter(item => item !== id));
  };

  const renderListFileUpload = () => {
    return attachments.map((attachment: any) => (
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '8px',
          mx: '20px',

          background: '#F4F5F6',
          borderRadius: '4px',
        }}
        key={attachment.id}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '> img ': { mr: '11px' },
          }}
        >
          <AttachFileIcon
            sx={{
              width: '1.25rem',
              height: '1.25rem',
              mr: 0.5,
              transform: 'rotate(45deg) scaleY(-1)',
            }}
          />
          <Typography sx={{ mr: '32px', fontSize: '12px', textAlign: 'left' }}>
            {attachment?.path}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '& > img:first-child': { mr: '11px' },
            pr: '16px',
          }}
        >
          <img width="16px" height="16px" src={ICON_CHECKED} alt="checked" />
          <Box
            component={'img'}
            width="16px"
            height="16px"
            src={ICON_DELETE}
            alt="delete"
            onClick={() => handleDeleteFile(attachment.id)}
            sx={{
              cursor: 'pointer',
            }}
          />
        </Box>
      </Grid>
    ));
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth={'md'}
      // onClose={onClose}
      scroll={'paper'}
    >
      <DialogTitle
        sx={{
          m: 0,
          py: 2,
          px: 3.5,
          pt: '40px',
          textAlign: 'center',
          color: '#1E1E1E',
        }}
        variant="h4"
      >
        Gửi yêu cầu hủy chỗ, hoàn tiền
      </DialogTitle>
      <Box sx={{ px: 18, textAlign: 'center' }}>
        <Typography>
          Để gửi yêu cầu hủy chỗ - hoàn tiền cho phiếu giữ chỗ{' '}
          <strong>{title}</strong> này, vui lòng upload tài liệu yêu cầu hủy
          chỗ.
        </Typography>
      </Box>
      <Box
        ref={drop}
        sx={{
          border: '1px solid var(--ink-ink-14, #C8CBCF)',
          mx: 2.5,
          mt: 5,
          py: 2.5,
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiButtonBase-root': {
              borderRadius: '8px',
              minWidth: '120px',
              mr: '20px',
              '& .MuiTypography-root': {
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 400,
                color: palette.primary.darkRed,
              },
            },
            '> img': {
              mx: '20px',
            },
          }}
          {...getRootProps()}
        >
          <Box
            onDragOver={(e: any) => {
              e.preventDefault();
            }}
            onDragEnter={(e: any) => {
              e.preventDefault();
            }}
            component="label"
          >
            <input
              {...getInputProps()}
              id="upload"
              hidden
              type="file"
              accept="*"
              max-file-size="5120"
            />
          </Box>
          <img src={UPLOAD_FILE} alt="upload" />
          <Typography sx={{ fontSize: '14px', my: '12px' }}>
            Kéo thả file hoặc nhấn vào nút kế bên để tải file lên
          </Typography>
          <CustomButton title={'Tải file lên'} variant="outlined" />
        </Box>
      </Box>
      {attachments && <Box mt="6px">{renderListFileUpload()}</Box>}
      <Box sx={{ mx: 3, mt: '16px' }}>
        <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
          <span style={{ color: '#E42B2C' }}>*</span>Lưu ý
        </Typography>
        <Box sx={{ mx: 3, fontWeight: 400, fontSize: '14px', mt: '6px' }}>
          <ul>
            <li>Upload tối đa 5 file</li>
            <li>Dung lượng: Tối đa 5MB/file</li>
            <li>Định dạng: .xlsx; .doc; .docx; .pdf; .png; .jpeg; .jpg</li>
          </ul>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          my: '24px',
        }}
      >
        <CustomButton
          title="Hủy"
          variant="outlined"
          sxProps={{ borderRadius: '8px', mr: '5px' }}
          handleClick={onClose}
        />
        <CustomButton
          title="Gửi yêu cầu"
          sxProps={{ borderRadius: '8px', ml: '5px' }}
          handleClick={handleSubmit}
        />
      </Box>
    </Dialog>
  );
};

export default CanceledReservation;
