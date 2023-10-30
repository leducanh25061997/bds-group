import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import ICON_CHECKED from 'assets/background/icon-checked.svg';
import ICON_DELETE from 'assets/background/icon-delete-file.svg';
import ICON_FILE_WORD from 'assets/background/icon-file-word.svg';
import UPLOAD_FILE from 'assets/background/upload-file-template-icon.svg';
import { get } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { default as document } from 'services/api/document';
import palette from 'styles/theme/palette';
import { ApplicableStatus, TransferTextApplicableStatus } from 'types/Enum';

import { selectManagementTemplate } from '../../slice/selectors';
import {
  PayloadCreateTemplateEmailAndSms,
  fileDocumentitem,
} from '../../slice/types';
import { ChipItemSelect } from '../DocumentPrinted';
import { EditorMessage } from '../EditorMessage/EditorMessage';
import { TYPE_EMAIL_OPTIONS } from '../TemplateEmail';
import { TYPE_SMS_OPTIONS } from '../TemplateMessageSMS';

interface TemplateProjectDialogProps {
  isOpen: boolean;
  isEdit?: boolean;
  title: string;
  itemSelect?: fileDocumentitem | null;
  handleClose: () => void;
  handleSubmit: (payload: any) => void;
  type: 'document' | 'email' | 'sms';
  maxWidth?: 'md' | 'xs' | 'sm' | 'lg' | 'xl';
  method?: any;
  data?: PayloadCreateTemplateEmailAndSms;
}
interface StatusUploadFile {
  id: number;
  label: string;
  value: string;
}
export default function TemplateProjectDialog(
  props: TemplateProjectDialogProps,
) {
  const {
    isOpen,
    title,
    handleClose,
    handleSubmit,
    maxWidth,
    type,
    isEdit,
    itemSelect,
    data,
  } = props;
  const { listProviderSMS, documentManagement } = useSelector(
    selectManagementTemplate,
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { actions: snackbarActions } = useSnackbarSlice();
  const drop = useRef<null | HTMLDivElement>(null);

  const { control, setValue, watch } = useForm({
    mode: 'onSubmit',
  });
  const statusOptions = useMemo(
    () => [
      {
        id: 1,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.CREATE_TICKET,
        ),
        value: ApplicableStatus.CREATE_TICKET,
      },
      {
        id: 2,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.WAIT_APPROVE_TICKET,
        ),
        value: ApplicableStatus.WAIT_APPROVE_TICKET,
      },
      {
        id: 3,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.APPROVED_TICKET,
        ),
        value: ApplicableStatus.APPROVED_TICKET,
      },
      {
        id: 4,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.REFUSE_TICKET,
        ),
        value: ApplicableStatus.REFUSE_TICKET,
      },
      {
        id: 5,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.CREATE_DEPOSIT,
        ),
        value: ApplicableStatus.CREATE_DEPOSIT,
      },
      {
        id: 6,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.WAIT_APPROVE_DEPOSIT,
        ),
        value: ApplicableStatus.WAIT_APPROVE_DEPOSIT,
      },
      {
        id: 7,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.APPROVED_DEPOSIT,
        ),
        value: ApplicableStatus.APPROVED_DEPOSIT,
      },
      {
        id: 8,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.REFUSE_DEPOSIT,
        ),
        value: ApplicableStatus.REFUSE_DEPOSIT,
      },
      {
        id: 9,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.CREATE_CANCELED,
        ),
        value: ApplicableStatus.CREATE_CANCELED,
      },
      {
        id: 10,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.WAIT_APPROVE_CANCELED,
        ),
        value: ApplicableStatus.WAIT_APPROVE_CANCELED,
      },
      {
        id: 11,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.APPROVED_CANCELED,
        ),
        value: ApplicableStatus.APPROVED_CANCELED,
      },
      {
        id: 12,
        label: get(
          TransferTextApplicableStatus,
          ApplicableStatus.REFUSE_CANCELED,
        ),
        value: ApplicableStatus.REFUSE_CANCELED,
      },
    ],
    [],
  );

  const optionStatusDisabled = useMemo(() => {
    if (!documentManagement?.data) return [];
    const tempOptions: any[] = [];
    documentManagement?.data?.forEach(e => {
      statusOptions?.forEach(option => {
        if (e?.applicableStatus.includes(option.value)) {
          tempOptions.push(option);
        }
      });
    });
    return tempOptions;
  }, [documentManagement?.data, statusOptions]);

  const optionsProviderSMS = useMemo(() => {
    if (listProviderSMS) {
      if (listProviderSMS?.data?.length < 1) return [];
      const listProviderTemp: any[] = [];
      listProviderSMS?.data?.map(e => {
        listProviderTemp.push({
          id: e?.id,
          name: e?.name,
          key: e?.name,
        });
      });
      return listProviderTemp;
    } else {
      return [];
    }
  }, [listProviderSMS]);

  const [errorValidateEditor, setErrorValidateEditor] = useState<string>('');
  const [messageEditor, setMessageEditor] = useState<string>('');

  //document print state
  const [attachments, setAttachments] = useState<any>();
  const [statusSelected, setStatusSelected] = useState<StatusUploadFile[]>([]);
  const [fileId, setFileId] = useState<string>();

  const onDrop = useCallback(async acceptedFiles => {
    if (acceptedFiles?.length > 1) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tối đa chỉ được tải lên 1 file!',
          type: 'error',
        }),
      );
      return;
    }
    if (acceptedFiles?.length) {
      setAttachments(acceptedFiles[0]);
      const arrFilesIds = await document.uploadFileTemplates(acceptedFiles);
      if (arrFilesIds?.length) {
        setFileId(arrFilesIds[0]);
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (itemSelect) {
      setFileId(itemSelect.fileId);
      setAttachments(itemSelect.image);
      const listOptionsSelect = statusOptions.filter(e =>
        itemSelect?.applicableStatus.includes(e.value),
      );
      setStatusSelected(listOptionsSelect);
    }
  }, [itemSelect]);

  useEffect(() => {
    if (data && isOpen) {
      setValue('typeEmail', data.status);
      setValue('titleEmail', data.title);
      // setValue('valueEditor', data.content);
      setValue('typeSms', data.status);
      setMessageEditor(data.content ?? '');
      setValue('providerSMS', data.smsBranchNameId);
    }
  }, [data]);

  const renderListFileUpload = () => {
    return (
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '8px',
          mx: '20px',
          background: '#F4F5F6',
          borderRadius: '4px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '> img ': { mr: '11px' },
          }}
        >
          <img src={ICON_FILE_WORD} alt="file" />
          <Typography
            sx={{
              mr: '32px',
              fontSize: '12px',
              textAlign: 'left',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '13.5rem'
            }}
          >
            {attachments?.path}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '& > img:first-child': { mr: '11px' },
            pr: '16px',
          }}
        >
          <img width="16px" height="16px" src={ICON_CHECKED} alt="checked" />
          <img
            width="16px"
            height="16px"
            src={ICON_DELETE}
            alt="delete"
            onClick={() => {
              setAttachments(null);
              setFileId('');
            }}
          />
        </Box>
      </Grid>
    );
  };
  const renderStatusSelected = (itemSelect: StatusUploadFile) => {
    return (
      <ChipItemSelect>
        <Typography sx={{ mr: '10px' }}>
          {get(TransferTextApplicableStatus, itemSelect.value)}
        </Typography>
        <CloseIcon
          sx={{
            width: '16px',
            height: '16px',
            color: palette.primary.darkRed,
            cursor: 'pointer',
          }}
          onClick={() => handleDeleteItemSelected(itemSelect)}
        />
      </ChipItemSelect>
    );
  };

  const handleChangeStatusUploadFile = (event: any, value: any) => {
    setStatusSelected(value);
  };
  const handleDeleteItemSelected = (itemSelect: StatusUploadFile) => {
    const listStatusRest = statusSelected?.filter(e => e !== itemSelect);
    setStatusSelected(listStatusRest);
  };

  const renderEditDocument = () => {
    return (
      <Grid
        container
        xs={12}
        sx={{ py: '16px', border: '1px solid #ECECEE', borderRadius: '8px' }}
      >
        <Grid
          item
          xs={6}
          sx={{
            borderRight: 'dashed 1px #C8CBCF',
            // ml: '20px',
          }}
        >
          <Box
            ref={drop}
            sx={{
              display: 'flex',
              '& .MuiButtonBase-root': {
                borderRadius: '8px',
                minWidth: '120px',
                mr: '20px',
                '& .MuiTypography-root': {
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: palette.primary.darkRed,
                },
              },
              '> img': {
                mx: '20px',
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
            <img src={UPLOAD_FILE} alt="upload" />
            <Typography sx={{ mr: '4px', fontSize: '14px', textAlign: 'left' }}>
              Kéo thả file hoặc nhấn vào nút kế bên để tải file lên
            </Typography>
            <CustomButton title={'Tải file lên'} variant="outlined" />
          </Box>
          {attachments && <Box mt="26px">{renderListFileUpload()}</Box>}
        </Grid>
        <Grid item xs={6} sx={{ px: '28px' }}>
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              '& .MuiAutocomplete-root .MuiFormControl-root .MuiInputBase-root':
                {
                  height: '60px',
                  overflow: 'auto',
                  border: errorValidateEditor.trim()
                    ? `1px solid ${theme.palette.error.lighter}`
                    : 'solid 1px #C8CBCF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'unset !important',
                    borderColor: 'unset !important',
                    borderWidth: 'unset !important',
                  },
                },
            }}
          >
            <Autocomplete
              multiple
              limitTags={1}
              value={statusSelected.length ? statusSelected : []}
              options={statusOptions}
              // getOptionDisabled={option =>
              //   optionStatusDisabled.includes(option) &&
              //   !statusSelected.includes(option)
              // }
              disableCloseOnSelect
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField {...params} placeholder="Chọn trạng thái" />
              )}
              renderOption={(props, option, { selected }) => (
                <li
                  style={{
                    background: selected ? palette.primary.lightRed : 'unset',
                    fontWeight: selected ? 600 : 400,
                  }}
                  {...props}
                >
                  {option.label}
                </li>
              )}
              sx={{ width: '500px' }}
              onChange={handleChangeStatusUploadFile}
            />
            <Typography
              color={theme.palette.primary.light}
              fontSize={'14px'}
              fontWeight={500}
              sx={{
                '& span': {
                  color: theme.palette.primary.lighter,
                },
                position: 'absolute',
                zIndex: 999,
                background: theme.palette.common.white,
                p: '0px 8px',
                ml: '12px',
                mt: '-6px',
              }}
            >
              Trạng thái áp dụng
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {statusSelected?.map(e => renderStatusSelected(e))}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const handleDeletedTypeEmail = () => {
    setValue('typeEmail', '');
  };
  const handleDeletedTypeSMS = () => {
    setValue('typeSms', '');
  };

  const handleOnChangeEditor = (content: string) => {
    if (!content || content === '<p><br></p>') {
      setErrorValidateEditor('Vui lòng nhập nội dung');
      setMessageEditor('');
    } else {
      setErrorValidateEditor('');
      setMessageEditor(content);
    }

    const regex = /(https?:\/\/.*\.(?:png|jpg))/i;
    if (regex.test(content)) {
      setErrorValidateEditor('Không được nhập tệp hình ảnh');
    } else {
      setMessageEditor(content);
    }
  };

  const renderSettingEmail = () => {
    return (
      <Grid>
        {!!isEdit && (
          <Grid sx={{ display: 'flex', mb: '20px' }}>
            <Box sx={{ mr: 1, minWidth: '350px' }}>
              <TextFieldCustom
                control={control}
                isRequired
                placeholder="chọn loại email"
                label="Loại Email"
                name="typeEmail"
                type="select"
                options={TYPE_EMAIL_OPTIONS}
                handleDeleted={handleDeletedTypeEmail}
                disabled={!!isEdit}
              />
            </Box>
            <Box sx={{ ml: 1, minWidth: '350px' }}>
              <TextFieldCustom
                control={control}
                placeholder="nhập tiêu đề email"
                label="Tiêu đề Email"
                name="titleEmail"
                type="text"
                isRequired
                rules={{
                  validate: {
                    isEmpty: (value: string) =>
                      value.trim() || 'Vui lòng nhập tiêu đề',
                  },
                }}
              />
            </Box>
          </Grid>
        )}
        <Grid>
          <Box
            sx={{
              marginLeft: { xs: '12px', sm: '18px', lg: '0px' },
              marginRight: { xs: '12px', sm: '18px', lg: '0px' },
            }}
          >
            <Controller
              name="valueEditor"
              control={control}
              rules={{
                required: `${'Vui lòng nhập nội dung'}`,
              }}
              render={({ field, fieldState }) => {
                return (
                  <EditorMessage
                    value={messageEditor}
                    placeholder={'Nhập câu nội dung'}
                    onChangeEdit={handleOnChangeEditor}
                  />
                );
              }}
            />
            {errorValidateEditor.trim() ? (
              <FormHelperText
                sx={{
                  fontSize: '12px',
                  color: theme.palette.error.light,
                  marginLeft: '10px',
                }}
              >
                {errorValidateEditor}
              </FormHelperText>
            ) : (
              <></>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderSettingSMS = () => {
    return (
      <Grid>
        {!!isEdit && (
          <Grid sx={{ display: 'flex', mb: '20px' }}>
            <Box sx={{ mr: 1, minWidth: '350px' }}>
              <TextFieldCustom
                control={control}
                label="Loại tin nhắn SMS"
                placeholder="Chọn loại tin nhắn SMS"
                name="typeSms"
                type="select"
                isRequired
                options={TYPE_SMS_OPTIONS}
                handleDeleted={handleDeletedTypeSMS}
                disabled={!!isEdit}
              />
            </Box>
            <Box sx={{ ml: 1, minWidth: '350px' }}>
              <TextFieldCustom
                control={control}
                type="select"
                label="Nhà cung cấp"
                isRequired
                placeholder="Chọn nhà cung cấp"
                name="providerSMS"
                options={optionsProviderSMS}
                handleDeleted={() => {
                  setValue('providerSMS', '');
                }}
              />
            </Box>
          </Grid>
        )}
        <Grid>
          <Box
            sx={{
              marginLeft: { xs: '12px', sm: '18px', lg: '0px' },
              marginRight: { xs: '12px', sm: '18px', lg: '0px' },
            }}
          >
            <Controller
              name="valueEditor"
              control={control}
              rules={{
                required: `${'Vui lòng nhập câu trả lời'}`,
              }}
              render={({ field, fieldState }) => {
                return (
                  <EditorMessage
                    value={messageEditor}
                    placeholder={'Nhập câu nội dung'}
                    onChangeEdit={handleOnChangeEditor}
                  />
                );
              }}
            />
            {errorValidateEditor.trim() ? (
              <FormHelperText
                sx={{
                  fontSize: '12px',
                  color: theme.palette.error.light,
                  marginLeft: '10px',
                }}
              >
                {errorValidateEditor}
              </FormHelperText>
            ) : (
              <></>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const handleSubmitFormPopup = () => {
    if (type === 'document') {
      if (!fileId) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Tối thiểu phải có tải lên 1 file!',
            type: 'error',
          }),
        );
        return;
      }
      if (statusSelected?.length <= 0) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng chọn trạng thái!',
            type: 'error',
          }),
        );
        return;
      }
      if (itemSelect?.id && fileId && id) {
        const listEnumApplicableStatus: ApplicableStatus[] = [];
        statusSelected?.map(e =>
          listEnumApplicableStatus.push(e.value as ApplicableStatus),
        );
        if (!listEnumApplicableStatus?.length) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Trạng thái của tài liệu in phải có...!',
              type: 'error',
            }),
          );
          return;
        }
        const payload = {
          fileId,
          projectId: id,
          applicableStatus: listEnumApplicableStatus,
        };
        handleSubmit?.({ id: itemSelect?.id, payload });
      }
    } else if (type === 'email') {
      const payload = {
        typeEmail: watch('typeEmail'),
        titleEmail: watch('titleEmail'),
        valueEditor: messageEditor,
      };
      if (!watch('typeEmail')) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng chọn loại email',
            type: 'error',
          }),
        );
        return;
      }
      if (!watch('titleEmail') || watch('titleEmail').trim() === '') {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng nhập tiêu đề email',
            type: 'error',
          }),
        );
        return;
      }
      if (!messageEditor) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng nhập nội dung email',
            type: 'error',
          }),
        );
        return;
      }
      handleSubmit?.(payload);
    } else {
      const payload = {
        typeSms: watch('typeSms'),
        providerSMS: watch('providerSMS'),
        valueEditor: messageEditor,
      };
      if (!watch('typeSms')) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng chọn loại SMS',
            type: 'error',
          }),
        );
        return;
      }
      if (!watch('providerSMS')) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng chọn nhà cung cấp',
            type: 'error',
          }),
        );
        return;
      }
      if (!messageEditor) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng nhập nội dung SMS',
            type: 'error',
          }),
        );
        return;
      }
      handleSubmit?.(payload);
    }
  };

  const renderDialogContent = () => {
    if (type === 'document') return renderEditDocument();
    else if (type === 'email') return renderSettingEmail();
    else if (type === 'sms') return renderSettingSMS();
    else return <></>;
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      handleClose={handleClose}
      handleSubmit={handleSubmitFormPopup}
      buttonMode="unset"
      actionName="Lưu cập nhật"
      maxWidth={maxWidth}
    >
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 400,
          mb: '16px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '24px',
            mb: '24px',
          }}
        >
          {title}
        </Typography>
        {renderDialogContent()}
      </Box>
    </ConfirmDialog>
  );
}
