import { Box, Typography, Button } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import React, { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';

import UPLOAD_ICON from 'assets/background/upload-image-icon.svg';

import palette from 'styles/theme/palette';

interface GroundImageUploaderProps {
  onFileChange: (file: FileWithPath) => void;
}

const GroundImageUploader: React.FC<GroundImageUploaderProps> = ({
  onFileChange,
}) => {
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length)
        return dispatch(
          snackbarActions.updateSnackbar({
            message: 'File không đúng định dạng',
            type: 'error',
          }),
        );

      if (!!onFileChange && acceptedFiles.length > 0)
        onFileChange(acceptedFiles[0]);
    },

    [dispatch, snackbarActions, onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg', '.png'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '70vh',
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
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          textAlign: 'center',
          mb: 2,
        }}
      >
        Chưa có ảnh mặt bằng tổng thể
      </Typography>
      <img src={UPLOAD_ICON} alt="" />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          textAlign: 'center',
          mb: 2,
          mt: 1.75,
        }}
      >
        Kéo thả file hoặc nhấn vào nút bên dưới để tải ảnh lên
      </Typography>
      <Button
        size="medium"
        variant="outlined"
        sx={{
          color: palette.primary.button,
          border: `1px solid ${palette.primary.button}`,
          textTransform: 'none',
          '&:hover': {
            border: `1px solid ${palette.primary.button}`,
          },
        }}
      >
        Tải file lên
      </Button>
    </Box>
  );
};

export default GroundImageUploader;
