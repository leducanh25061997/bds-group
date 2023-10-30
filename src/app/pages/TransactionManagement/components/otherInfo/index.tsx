import { Box, Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TextFieldCustom from 'app/components/TextFieldCustom';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UseFormReturn } from 'react-hook-form';
import styled from 'styled-components';
import palette from 'styles/theme/palette';
import UPLOAD_FILE_ICON from 'assets/background/upload-file-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useDropzone } from 'react-dropzone';
import { default as document } from 'services/api/document';
import REMOVE_ICON from 'assets/icons/remove-icon.svg';

import { selectTransactionManagement } from '../../slice/selector';

interface OtherInfoProps {
  formControl: UseFormReturn;
  isCopy?: boolean;
  isPopup?: boolean;
}

const TitleQuestion = styled(Typography)({
  fontSize: '14px',
  fontWeight: 400,
  color: '#1E1E1E',
  fontFamily: 'Inter',
});

export function OtherInfo(props: OtherInfoProps) {
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { bookingDetail } = useSelector(selectTransactionManagement);
  const { formControl, isCopy, isPopup } = props;
  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
    getValues,
  } = formControl;
  const drop = useRef<null | HTMLDivElement>(null);

  const listQuestionCustomer = useMemo(
    () => [
      {
        label: 'Khách hàng có nhu cầu vay ngân hàng không?',
        name: 'bankLoanNeeds',
      },
      {
        label: 'Dự án quan tâm khác',
        name: 'otherProjects',
      },
      // {
      //   label: 'Dự án quan tâm khác',
      //   name: 'question3',
      // },
    ],
    [],
  );
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    listQuestionCustomer?.forEach((e: any) => {
      if (!watch(e?.name)) {
        setValue(`${e.name}`, 0);
      }
    });
  }, [listQuestionCustomer]);

  const optimisticUpdateFile = (file: any) => {
    return {
      file: {
        id: file.id,
        path: file.path,
      },
    };
  };

  useEffect(() => {
    if (!isCopy && bookingDetail?.files && bookingDetail?.files?.length) {
      setAttachments(
        bookingDetail?.files.map(e => {
          return optimisticUpdateFile(e.file);
        }) || [],
      );
      const listId: any[] = [];
      bookingDetail?.files.forEach(e => {
        if (e?.file?.id) {
          listId.push(e?.file?.id);
        }
      });
      setValue('files', listId);
    }
  }, [bookingDetail, isCopy]);

  const handleCheckCapacityFile = (files: File[]) => {
    let messageError = '';
    if (!files.length) return;
    if (
      files.length > 5 ||
      (attachments && attachments.length > 5) ||
      files.length + attachments.length > 5
    ) {
      messageError = 'Tối đa chỉ được tải lên 5 tệp!';
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

  const handleDeleteFile = (file: any) => {
    // console.log('file', file);
    const {
      file: { id },
    } = file;

    const listIds: string[] = getValues('files') || [];
    setValue(
      'files',
      listIds.filter(fileId => fileId !== id),
    );

    setAttachments(prev =>
      prev.filter(item => item.id !== id && item.file.id !== id),
    );
  };

  const onDrop = useCallback(
    async acceptedFiles => {
      if (acceptedFiles?.length) {
        const messageReturn = handleCheckCapacityFile(acceptedFiles);
        if (messageReturn) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: messageReturn,
              type: 'error',
            }),
          );
          return;
        } else {
          const filesId = await document.uploadFilesPath(acceptedFiles);
          const newAttachments = [
            ...attachments,
            ...filesId.map((f: any) => {
              return optimisticUpdateFile(f);
            }),
          ];
          setAttachments(newAttachments);

          const listId: string[] = filesId.map((e: any) => e.id);
          setValue('files', [...(getValues('files') || []), ...listId]);
        }
      }
    },
    [attachments, handleCheckCapacityFile],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const renderYesNoQuestion = (question: { label: string; name: string }) => {
    return (
      <Grid
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TitleQuestion>{question?.label}</TitleQuestion>
        <Box
          sx={{
            '& .MuiFormControl-root .MuiFormGroup-root .MuiFormControlLabel-root':
              {
                mr: '38px',
              },
          }}
        >
          <TextFieldCustom
            name={question.name}
            type="radio"
            options={[
              { id: 0, value: 0, key: 'Không' },
              { id: 1, value: 1, key: 'Có' },
            ]}
            control={control}
            errors={errors}
            setError={setError}
          />
        </Box>
      </Grid>
    );
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

  const renderFileAttachment = () => {
    if (!attachments?.length) return;
    // const listFileIds = watch('files');

    return (
      <>
        {attachments?.map((e: any, index: number) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MuiLink
              key={index}
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#006EE6',
                cursor: 'pointer',
                width: 'fit-content',
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
            <Box
              component={'img'}
              src={REMOVE_ICON}
              sx={{
                width: 16,
                ml: 0.75,
                mt: '2px',
                cursor: 'pointer',
              }}
              onClick={() => handleDeleteFile(e)}
            />
          </Box>
        ))}
      </>
    );
  };

  return (
    <Fragment>
      <Grid container mt="24px">
        <Box sx={{ width: '100%' }}>
          <Typography
            fontWeight={700}
            fontSize={'16px'}
            color={palette.primary.darkRed}
          >
            {'Thông tin khác'}
          </Typography>
        </Box>
        <Grid
          container
          sx={{
            display: 'flex',
            mt: '20px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
              {'Khảo sát nhu cầu khách hàng'}
            </Typography>
          </Box>
          {listQuestionCustomer.map((survey, index) => (
            <Fragment key={index}>{renderYesNoQuestion(survey)}</Fragment>
          ))}
        </Grid>
        <Grid container>
          <Box sx={{ width: '100%', mt: 1 }}>
            <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
              {'Ghi chú thêm'}
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 2,
              width: '100%',
              '& .MuiFormControl-root .MuiInputBase-root': { width: '100%' },
            }}
          >
            <TextFieldCustom
              placeholder="Nhập nội dung ghi chú..."
              label="Ghi chú"
              name="note"
              type="text"
              control={control}
              errors={errors}
              setError={setError}
            />
          </Box>
        </Grid>
        <Grid container>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
              {'Chứng từ liên quan (nếu có)'}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>{renderFileAttachment()}</Box>
          {(!watch('files') || watch('files')?.length <= 5) && (
            <Box
              ref={drop}
              sx={{
                mt: 2,
                py: '15px',
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
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 400,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                Tải tối đa 5 file, mỗi file không quá 10MB, tổng dung lượng
                không quá 25MB
              </Typography>
              <Button size="medium" variant="outlined">
                Tải lên
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
}
