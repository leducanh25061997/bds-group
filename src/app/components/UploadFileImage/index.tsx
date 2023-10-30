import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  SxProps,
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
import UPLOADVIDEO_ICON from 'assets/background/upload-video-icon.svg';
import { useDropzone } from 'react-dropzone';

import { returnFileType } from 'utils/helpers';

import palette from 'styles/theme/palette';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch } from 'react-redux';

import CustomButton from '../Button';
import { useSnackbarSlice } from '../Snackbar/slice';
import { TabMediaTypeEnum } from 'types/Enum';
import { IMAGE_REGEX, VIDEO_REGEX } from 'utils/helpers/regex';
interface Props {
  buttonName: string;
  warningMessage: string;
  name: string;
  control?: Control<any>;
  isRequired?: boolean;
  isHideImage?: boolean;
  errors?: any;
  defaultValue?: any;
  handleSelectFile?: (file: File) => void;
  handleRemove?: () => void;
  urlDefault: any;
  sx?: SxProps;
  uploadType?: TabMediaTypeEnum;
}

export default function UploadFile(props: Props) {
  const {
    isRequired,
    buttonName,
    warningMessage,
    name,
    control,
    isHideImage,
    handleSelectFile,
    defaultValue,
    urlDefault,
    uploadType,
    sx,
    handleRemove,
  } = props;
  const [files, setFiles] = useState<string>('');
  const drop = React.useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (urlDefault) {
      const url = process.env.REACT_APP_API_URL + '/' + urlDefault;
      setFiles(url);
    }
  }, [urlDefault]);

  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const theme = useTheme();

  const onDrop = useCallback(acceptedFiles => {
    const urlImage = URL.createObjectURL(acceptedFiles[0]);
    const typeFile = acceptedFiles[0]?.type.split('/') || '';
    console.log('typeFile', acceptedFiles[0]);

    if (uploadType === TabMediaTypeEnum.VIDEO) {
      if (VIDEO_REGEX.test(typeFile[1])) {
        handleSelectFile?.(acceptedFiles[0]);
        if (!isHideImage) {
          setFiles(urlImage);
        }
      } else {
        setFiles('');
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'File không đúng định dạng',
            type: 'error',
          }),
        );
      }
    } else {
      if (IMAGE_REGEX.test(typeFile[1]) || typeFile[1] === 'svg+xml') {
        handleSelectFile?.(acceptedFiles[0]);
        if (!isHideImage) {
          setFiles(urlImage);
        }
      } else {
        setFiles('');
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'File không đúng định dạng',
            type: 'error',
          }),
        );
      }
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
      <Fragment>
        <Box
          ref={drop}
          sx={{
            display: 'flex',
            borderRadius: 1,
            color: theme.palette.primary.light,
            border: `1px solid #C8CBCF`,
            width: '100%',
            height: '45vh',
            backgroundImage: `url(${files});`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            cursor: 'pointer',
            borderStyle: 'dashed',
            ...sx,
          }}
          {...getRootProps()}
        >
          {files ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <IconButton
                  sx={{
                    stroke: 'aliceblue',
                    zIndex: 1,
                  }}
                  onClick={removeFile}
                >
                  <HighlightOffIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                width: '100%',
                padding: '25px',
              }}
            >
              <>
                {uploadType === TabMediaTypeEnum.VIDEO ? (
                  <Box component={'img'} src={UPLOADVIDEO_ICON} />
                ) : (
                  <Box component={'img'} src={UPLOAD_ICON} />
                )}
                <Typography
                  fontSize={'14px'}
                  color={palette.common.black}
                  mt={2}
                >
                  Kéo thả ảnh hoặc nhấn vào nút bên dưới để tải ảnh lên
                </Typography>
                <Button
                  disabled
                  sx={{
                    width: { md: '108px' },
                    height: '40px',
                    textTransform: 'none',
                    p: 0,
                    mt: 2,
                    border: `1px solid ${palette.primary.button}`,
                  }}
                  onDrop={onDrop}
                  onDragOver={(e: any) => {
                    e.preventDefault();
                  }}
                  onDragEnter={(e: any) => {
                    e.preventDefault();
                  }}
                  component="label"
                >
                  <Typography fontSize={'14px'} color={palette.primary.button}>
                    {buttonName}
                  </Typography>
                  <input
                    {...getInputProps()}
                    id="upload"
                    hidden
                    type="file"
                    accept="image*"
                    max-file-size="5120"
                  />
                </Button>
              </>
            </Box>
          )}
        </Box>
      </Fragment>
    </Box>
  );
}
