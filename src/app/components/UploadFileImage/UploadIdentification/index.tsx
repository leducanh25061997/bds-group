import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Dialog,
} from '@mui/material';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Control, Controller } from 'react-hook-form';
import UPLOAD_ICON from 'assets/background/upload-image-icon.svg';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { useDropzone } from 'react-dropzone';

import { returnFileType } from 'utils/helpers';
import palette from 'styles/theme/palette';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
interface Props {
  buttonName: string;
  warningMessage: string;
  name: string;
  control?: Control<any>;
  isRequired?: boolean;
  errors?: any;
  defaultValue?: any;
  handleSelectFile?: (file: File) => void;
  handleRemove?: () => void;
  urlDefault?: any;
  bgImage?: any;
}

export default function UploadFile(props: Props) {
  const {
    isRequired,
    buttonName,
    warningMessage,
    name,
    control,
    errors,
    handleSelectFile,
    defaultValue,
    urlDefault,
    bgImage,
    handleRemove,
  } = props;
  const [files, setFiles] = useState<any>(null);
  const drop = React.useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (urlDefault) {
      const url = process.env.REACT_APP_API_URL + '/' + urlDefault;
      console.log('urlDefault', url);

      setFiles(url);
    }
  }, [urlDefault]);

  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const theme = useTheme();

  const onDrop = useCallback(acceptedFiles => {
    const urlImage = URL.createObjectURL(acceptedFiles[0]);
    const typeFile = acceptedFiles[0]?.type.split('/') || '';
    if (
      typeFile[1] === 'jpg' ||
      typeFile[1] === 'jpeg' ||
      typeFile[1] === 'png'
    ) {
      handleSelectFile?.(acceptedFiles[0]);
      setFiles(urlImage);
    } else {
      setFiles('');
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'File không đúng định dạng',
          type: 'error',
        }),
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = () => {
    setFiles('');
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
        {isRequired && <span>*</span>}
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
              <Box
                ref={drop}
                style={{ borderStyle: 'dashed' }}
                sx={{
                  flexDirection: 'column',
                  display: 'flex',
                  borderRadius: 1,
                  p: '0px 60px',
                  color: theme.palette.primary.light,
                  border: `1px solid #C8CBCF`,
                  width: { md: '190px' },
                  height: { md: '112px' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundImage: `url(${files || bgImage});`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  cursor: 'pointer',
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
                    accept="image*"
                    max-file-size="5120"
                  />
                </Box>
              </Box>
              <Typography mt={1} textAlign={'center'} fontSize={'12px'}>
                {buttonName}
              </Typography>
            </Fragment>
          );
        }}
      />
    </Box>
  );
}
