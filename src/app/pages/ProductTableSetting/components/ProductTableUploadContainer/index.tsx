import { Box, Typography, Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';

import UPLOAD_FILE_ICON from 'assets/background/upload-file-icon.svg';

import palette from 'styles/theme/palette';
import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import ProductTable from 'services/api/productTable';
import { ProjectTypeEnum } from 'types/Project';

import UploadErrorDialog, { ProductError } from '../UploadErrorDialog';
import { useProductTableActionsSlice } from '../../slice';

interface ProductTableUploadContainerProps {
  onUploadStateChange: (val: boolean) => void;
  onChangeFile: (file: File | null) => void;
  projectType: ProjectTypeEnum;
  onError: (err: ProductError[]) => void;
  onOpenError: (open: boolean) => void;
}

const ProductTableUploadContainer: React.FC<ProductTableUploadContainerProps> =
  ({ onUploadStateChange, onChangeFile }) => {
    const dispatch = useDispatch();

    const { actions } = useProductTableActionsSlice();
    const { actions: snackbarActions } = useSnackbarSlice();
    const { id } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<ProductError[]>([]);

    const onDrop = useCallback(
      async (acceptedFiles, fileRejections) => {
        if (fileRejections.length)
          return dispatch(
            snackbarActions.updateSnackbar({
              message: 'File không đúng định dạng',
              type: 'error',
            }),
          );

        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('sheetName', 'Sheet1');
        formData.append('firstRow', '2');
        formData.append('projectId', id || '');

        dispatch(
          actions.checkFileUpload({ id, formData }, (res?: any) => {
            if (res?.success) {
              //   const data = await ProductTable.checkFileUpload(formData);
              // dispatch(
              //   snackbarActions.updateSnackbar({
              //     message: data.message,
              //     type: 'success',
              //   }),
              // );
              if (
                res.response &&
                res.response.data.error &&
                res.response.data.error.length > 0
              ) {
                const errList: any[] = res.response.data.error;
                setError(errList);
                setIsOpen(true);
              }

              onUploadStateChange(true);
            } else {
              // dispatch(
              //   snackbarActions.updateSnackbar({
              //     message: 'Tải file lên không thành công',
              //     type: 'error',
              //   }),
              // );

              onUploadStateChange(false);
            }
          }),
        );
      },

      [dispatch, snackbarActions, id, onUploadStateChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
      },
      maxFiles: 1,
    });

    const handleCloseDialog = () => {
      setIsOpen(false);
    };

    return (
      <>
        {/* <Button onClick={() => setIsOpen(true)}>Open dialog</Button> */}
        <Box
          sx={{
            height: '100%',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          {...getRootProps()}
        >
          <Box component="label">
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
              mb: 2,
              mt: 1.75,
            }}
          >
            Kéo thả file hoặc nhấn vào nút <b>Tải lên bảng hàng</b> để tải file
            bảng hàng lên
          </Typography>
        </Box>
      </>
    );
  };

export default ProductTableUploadContainer;
