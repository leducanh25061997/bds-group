import { Box, TextField, Typography, Link as MuiLink } from '@mui/material';
import { borderColor } from '@mui/system';
import ConfirmDialog from 'app/components/ConfirmDialog';
import TextFieldCustom from 'app/components/TextFieldCustom';
import UploadFile from 'app/pages/CustomerPotential/components/UploadFile';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import palette from 'styles/theme/palette';
import AttachFileIcon from '@mui/icons-material/AttachFile';
interface Props {
  isOpenDialogSendRequest: boolean;
  setIsOpenDialogSendRequest: (isOpenDialogSendRequest: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  actionName: string;
  handleSubmit?: (reason?: string, files?: any) => void;
  isReject?: boolean;
  isApprove?: boolean;
}

export function ActionDialog(props: Props) {
  const {
    isOpenDialogSendRequest,
    setIsOpenDialogSendRequest,
    title,
    description,
    actionName,
    handleSubmit,
    isReject,
    isApprove,
  } = props;

  const FormControl = useForm<{ reason: string; files: any }>({
    mode: 'onBlur',
    defaultValues: {
      reason: '',
    },
  });

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = FormControl;

  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  const handleCloseDialogSendRequest = () => {
    setIsOpenDialogSendRequest(false);
    setValue('reason', '');
    setValue('files', null);
  };

  const handleSend = () => {
    if (isReject) {
      handleFormSubmit(data => {
        handleSubmit?.(data.reason);
      })();
    } else {
      handleFormSubmit(data => {
        handleSubmit?.(data.reason, data?.files);
      })();
    }
  };

  const getlinkAttacment = (file: any) => {
    if (!file) return;
    if (!file?.name) {
      return process.env.REACT_APP_API_URL + `/${file?.file?.path}`;
    }
    if (file?.name) {
      const url = URL.createObjectURL(file);
      return url;
    }
  };

  const hanldeAttachment = (files: any) => {
    setAttachments(files);
  };

  const renderFileAttachment = (attachments: any[]) => {
    if (!attachments?.length) return;
    return (
      <>
        {attachments?.map((e: any, index: number) => (
          <MuiLink
            key={index}
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#006EE6',
              cursor: 'pointer',
              width: '85%',
              maxWidth: '40vw',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
            href={getlinkAttacment(e)}
            target="_blank"
          >
            <AttachFileIcon
              sx={{
                width: '1.25rem',
                height: '1.25rem',
                mr: 0.5,
                transform: 'rotate(45deg) scaleY(-1)',
              }}
            />
            <span>{e?.name || e?.file?.path}</span>
          </MuiLink>
        ))}
      </>
    );
  };

  return (
    <ConfirmDialog
      isOpen={isOpenDialogSendRequest}
      handleClose={handleCloseDialogSendRequest}
      handleSubmit={handleSend}
      isIcon={false}
      actionName={actionName}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          fontSize={'24px'}
          fontWeight={700}
          width={400}
          color={palette.primary.text}
          mx="auto"
          mb={2}
          mt={2}
          textAlign={'center'}
        >
          {title}
        </Typography>
        <Typography
          fontSize={'16px'}
          fontWeight={400}
          color={palette.primary.text}
          mb={5}
          textAlign={'center'}
        >
          {description}
        </Typography>
        {isReject && (
          <Box
            component="form"
            sx={{
              mt: '-20px',
              mb: '20px',
            }}
            onSubmit={e => e.preventDefault()}
          >
            <TextFieldCustom
              name="reason"
              label="Lý do từ chối"
              placeholder="Nhập lý do từ chối"
              isRequired
              control={control}
              errors={errors}
              sxProps={{}}
            />
            {/* <TextField
              sx={{
                mb: 2,
                '& label.Mui-focused': {
                  color: palette.primary.text,
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: `#D3D3D3 !important`,
                  },
              }}
              label="Lý do từ chối"
              placeholder="Nhập lý do từ chối"
              focused
              fullWidth
            /> */}
          </Box>
        )}
        {isApprove && (
          <>
            <Box
              component="form"
              sx={{
                mt: '-20px',
                mb: '20px',
              }}
              onSubmit={e => e.preventDefault()}
            >
              <TextFieldCustom
                name="reason"
                label="Bình luận"
                placeholder="Nhập bình luận"
                control={control}
                errors={errors}
              />
              {(!watch('files') || watch('files')?.length <= 5) && (
                <UploadFile
                  formControl={FormControl}
                  fileMax={5}
                  name="files"
                  hanldeAttachment={hanldeAttachment}
                />
              )}
              <Box sx={{ mt: 2 }}>{renderFileAttachment(attachments)}</Box>
            </Box>
          </>
        )}
      </div>
    </ConfirmDialog>
  );
}
