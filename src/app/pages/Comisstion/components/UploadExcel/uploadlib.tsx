import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useState } from 'react';
import FileUpload from 'react-material-file-upload';
import { useDispatch } from 'react-redux';
import document from 'services/api/document';
import palette from 'styles/theme/palette';
interface Props {
  onchangeStatusSpending: () => void;
  callbackFileUpload: (fileId: any) => void;
}

function DragDrop(props: Props) {
  const { onchangeStatusSpending, callbackFileUpload } = props;
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const handleChange = (file: any) => {
    setFiles(file);
    UploadFile(file);
  };

  const UploadFile = async (fileUpload: any) => {
    try {
      const fileId = await document.uploadFileTransaction(fileUpload[0]);
      if (fileId) {
        callbackFileUpload(fileId);
        onchangeStatusSpending();
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload thành công',
            type: 'success',
          }),
        );
      } else {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload không thành công',
            type: 'error',
          }),
        );
      }
    } catch (error) {}
  };

  return (
    <FileUpload
      accept={
        '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      }
      sx={{
        '& .MuiButtonBase-root': {
          backgroundColor: 'white',
          borderWidth: 0,
          textTransform: 'unset',
          borderRadius: '8px',
          border: `1px solid ${palette.primary.button}`,
          color: palette.primary.button,
          width: '127px',
          height: '44px',
          fontSize: '16px',
          boxShadow: 'none',
          p: '0px 8px',
          mt: '10px',
        },
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        width: '65%',
        border: `1px dashed #A8ADB4`,
        p: '15px 0px 12px',
        borderRadius: '12px',
        '& .MuiTypography-root': {
          fontSize: '16px',

          fontWeight: 400,
          lineHeight: '20px',
          color: palette.primary.hint,
        },
        '& .MuiSvgIcon-root': {
          color: ['#F7D5E6', '#EA6E92', '!important'],
        },
      }}
      buttonText="Tải lên"
      title="Kéo thả tài liệu hoặc nhấn vào nút bên dưới để tải file lên"
      value={files}
      onChange={handleChange}
      maxSize={5000000}
    />
  );
}

export default DragDrop;
