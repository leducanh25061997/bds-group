import { Box, Button, Typography } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import UPLOAD_FILE_ICON from 'assets/background/upload-file-icon.svg';
import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import documentService from 'services/api/document';
import palette from 'styles/theme/palette';

interface Props {
  hanldeAttachment: (files: any) => void;
  name: any;
  fileMax?: number;
  formControl: any;
  disabled?: boolean;
}

export default function UploadFile(props: Props) {
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();

  const drop = useRef<null | HTMLDivElement>(null);

  const {
    hanldeAttachment,
    name,
    fileMax = 5,
    formControl,
    disabled = false,
  } = props;
  const {
    formState: { errors },
    setValue,
  } = formControl;

  const onDrop = useCallback(async acceptedFiles => {
    if (!disabled) {
      if (acceptedFiles?.length) {
        const messageReturn = handleCheckCapacityFile(acceptedFiles, fileMax);
        if (messageReturn) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: messageReturn,
              type: 'error',
            }),
          );
          return;
        } else {
          hanldeAttachment(acceptedFiles);
          const filesId = await documentService.uploadFile(acceptedFiles);
          setValue(name, filesId);
        }
      }
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Khách hàng đang trong quá trình duyệt!',
          type: 'error',
        }),
      );
      return;
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCheckCapacityFile = (files: File[], numberFile: number) => {
    let messageError = '';
    if (!files.length) return;
    if (files.length > numberFile) {
      messageError = `Tối đa chỉ được tải lên ${numberFile} tệp!`;
      return messageError;
    }
    let totalSize = 0;
    files?.forEach((e: File) => {
      if (e.size > 10000000) {
        messageError = 'Mỗi tệp tải lên phải không quá 10MB!';
        return messageError;
      } else {
        totalSize += e.size;
      }
    });
    if (totalSize > 25000000) {
      messageError = 'Tổng dung lượng tệp tải lên phải không quá 25MB!';
      return messageError;
    }
  };

  return (
    <Box
      ref={drop}
      sx={{
        mt: 2,
        p: '15px 10px',
        width: '100%',
        border: `1px dashed ${palette.button.btnUnActive}`,
        borderRadius: '12px',
        color: palette.primary.hint,
        fontFamily: 'Inter',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '>img': {
          width: '62px',
        },
        '& .MuiButtonBase-root': {
          mt: '9px',
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: '16px',
          color: palette.primary.darkRed,
          borderColor: palette.primary.darkRed,
        },
      }}
      {...getRootProps()}
    >
      <Box
        onDrop={onDrop}
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
      <img src={UPLOAD_FILE_ICON} alt="" />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          textAlign: 'center',
        }}
      >
        Kéo thả tài liệu hoặc nhấn vào nút bên dưới để tải file lên
      </Typography>
      {fileMax === 100 ? (
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Tải không giới hạn file, mỗi file không quá 10MB, tổng dung lượng
          không quá 25MB
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Tải tối đa {fileMax} file, mỗi file không quá 10MB, tổng dung lượng
          không quá 25MB
        </Typography>
      )}

      <Button size="small" variant="outlined">
        Tải lên
      </Button>
    </Box>
  );
}
