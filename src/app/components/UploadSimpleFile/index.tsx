import {
  Box,
  FormHelperText,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import document from 'services/api/document';
import UPLOAD_ICON from 'assets/background/upload-icon.svg';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { returnFileType } from 'utils/helpers';

interface State {
  file: string;
  loading: boolean;
}

const initState = {
  file: '',
  loading: false,
};

interface Props {
  handleFilesCallback: (fileId: number, field: any) => void;
  removeFile: (field?: any) => void;
  validateFiles?: (files: File, field: any) => void;
  field?: any;
  acceptFile: string;
  error?: string;
  warningMessage: string;
  buttonName: string;
  defaultValue?: string;
}

const UploadSimpleFile = (props: Props) => {
  const {
    handleFilesCallback,
    removeFile,
    validateFiles,
    field,
    acceptFile,
    error,
    warningMessage,
    buttonName,
    defaultValue,
  } = props;
  const theme = useTheme();
  const [state, setState] = React.useState<State>(initState);
  const { file, loading } = state;

  React.useEffect(() => {
    if (defaultValue) {
      setState({
        ...state,
        file: defaultValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const elm = e.target;
    if (!elm.files) return;
    const { files } = elm;

    const error = validateFiles ? validateFiles(files[0], field) : null;
    if (error) {
      return;
    }
    UploadFile(files[0]);
  };

  const UploadFile = async (fileUpload: File) => {
    setState({
      ...state,
      loading: true,
    });
    try {
      const fileId = await document.uploadSimpleFile(fileUpload);
      if (fileId.length > 0) {
        handleFilesCallback(fileId[0], field);
        setState({
          ...state,
          loading: false,
          file: fileUpload.name,
        });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false,
      });
    }
  };

  const onRemoveFile = () => {
    setState({
      ...state,
      file: '',
    });
    removeFile(field);
  };

  const renderUpload = React.useMemo(() => {
    if (loading) {
      return <Skeleton variant="rectangular" animation="wave" />;
    }
    if (file) {
      return (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            border: `1px solid ${theme.palette.primary.light}`,
            width: 'fit-content',
            padding: '2px 4px',
            marginBottom: '16px',
          }}
        >
          <img width="18px" src={returnFileType(file)} alt="file-icon" />
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              color: theme.palette.primary.light,
              marginLeft: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {file}
          </Typography>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{ padding: '0', marginLeft: '4px' }}
            onClick={onRemoveFile}
          >
            <img src={CLOSE_ICON} alt="delete-icon" />
          </IconButton>
        </Box>
      );
    }
    return (
      <IconButton
        sx={{
          borderRadius: 0,
          fontSize: '14px',
          p: '0px 8px',
          textTransform: 'unset',
          color: theme.palette.primary.light,
          border: `1px solid ${theme.palette.primary.lighter}`,
          width: 'fit-content',
        }}
        component="label"
      >
        <input hidden type="file" onChange={onChange} accept={acceptFile} />
        <img alt="upload-file" src={UPLOAD_ICON} width="30px" height="30px" />
        {buttonName}
      </IconButton>
    );
  }, [file, loading, defaultValue]);

  const renderError = React.useMemo(() => {
    if (error) {
      return (
        <FormHelperText
          color={theme.palette.error.lighter}
          sx={{
            mt: 1,
            fontSize: 12,
          }}
          error
        >
          {error}
        </FormHelperText>
      );
    }
    return null;
  }, [error, theme.palette.error.lighter]);

  return (
    <Box mr={2} mt={2}>
      {renderUpload}
      {renderError}
      <Typography
        mt={1}
        fontSize={'14px'}
        color={theme.palette.primary.light}
        fontStyle={'italic'}
      >
        {warningMessage}
      </Typography>
    </Box>
  );
};

export default UploadSimpleFile;
