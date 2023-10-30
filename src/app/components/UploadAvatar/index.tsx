import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Control, Controller } from 'react-hook-form';
import DEFAULT_AVATAR from 'assets/background/default-avatar-upload.svg';
import UPLOAD_ICON from 'assets/background/upload-icon.svg';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { useSnackbarSlice } from '../Snackbar/slice';

interface Props {
  titleUpload?: string;
  buttonName: string;
  warningMessage: string;
  name: string;
  control?: Control<any>;
  isRequired?: boolean;
  errors?: any;
  handleSelectFile?: (file: File) => void;
  defaultValue?: any;
  handleRemove?: () => void;
}

export default function UploadAvatar(props: Props) {
  const {
    titleUpload,
    isRequired,
    buttonName,
    warningMessage,
    name,
    control,
    errors,
    handleSelectFile,
    defaultValue,
    handleRemove,
  } = props;
  const [avatar, setAvatar] = useState<string | null>(null);
  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const theme = useTheme();
  const renderImageUrl = () => {
    if (avatar) {
      return avatar;
    } else {
      return DEFAULT_AVATAR;
    }
  };

  useEffect(() => {
    return () => {
      setAvatar(null);
    };
  }, []);

  useEffect(() => {
    defaultValue && setAvatar(defaultValue);
  }, [defaultValue]);

  const removeFile = () => {
    setAvatar(null);
    handleRemove?.();
  };

  return (
    <Box>
      <Typography
        color={theme.palette.primary.light}
        fontSize={'14px'}
        fontWeight={600}
        sx={{
          '& span': {
            ml: 0.5,
            color: theme.palette.primary.lighter,
          },
        }}
      >
        {titleUpload}
        {isRequired && titleUpload && <span>*</span>}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? 'Trường này là bắt buộc' : '',
        }}
        render={({ field, fieldState }) => {
          return (
            <Fragment>
              <Box position="relative" width="max-content">
                <Avatar
                  src={renderImageUrl()}
                  sx={{
                    width: '100px',
                    height: '100px',
                    mt: '15px',
                  }}
                />
                {avatar && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-35px',
                      stroke: 'aliceblue',
                    }}
                    onClick={removeFile}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                )}
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 0,
                    fontSize: '14px',
                    p: '0px 8px',
                    textTransform: 'unset',
                    color: theme.palette.primary.light,
                    border: `1px solid ${theme.palette.primary.lighter}`,
                    mt: 2,
                  }}
                  component="label"
                  startIcon={<img src={UPLOAD_ICON} alt="icon table" />}
                >
                  {buttonName}
                  <input
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.target.files?.length) {
                        const imageFile = event.target.files[0];
                        const urlImage = URL.createObjectURL(imageFile);
                        setAvatar(urlImage);
                        field.onChange(imageFile);
                        event.target.value = '';
                        const typeFile = imageFile?.type.split('/') || '';
                        if (typeFile[1] === 'webp' || typeFile[1] === 'jfjf') {
                          setAvatar(null);
                          dispatch(
                            snackbarActions.updateSnackbar({
                              message: 'File không đúng định dạng',
                              type: 'error',
                            }),
                          );
                        }
                        handleSelectFile?.(imageFile);
                      }
                    }}
                    hidden
                    accept="image/*"
                    type="file"
                    name={name}
                  />
                </Button>
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.error.lighter}
                  mt={2}
                  ml={2}
                >
                  {errors[field.name]?.message || ''}
                </Typography>
              </Box>
            </Fragment>
          );
        }}
      />
      <Typography
        fontStyle="italic"
        mt={1}
        fontSize={'14px'}
        color={theme.palette.primary.light}
      >
        {warningMessage}
      </Typography>
    </Box>
  );
}
