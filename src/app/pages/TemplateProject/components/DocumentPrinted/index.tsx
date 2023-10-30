import AddIcon from '@mui/icons-material/Add';
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
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useProfile } from 'app/hooks';
import ICON_CHECKED from 'assets/background/icon-checked.svg';
import ICON_DELETE from 'assets/background/icon-delete-file.svg';
import ICON_FILE_WORD from 'assets/background/icon-file-word.svg';
import UPLOAD_FILE from 'assets/background/upload-file-template-icon.svg';
import { get } from 'lodash';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { default as document } from 'services/api/document';
import styled from 'styled-components';
import palette from 'styles/theme/palette';
import { ApplicableStatus, TransferTextApplicableStatus } from 'types/Enum';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';

import { TitleFragment } from '../..';
import { useManagementTemplateSlice } from '../../slice';
import { selectManagementTemplate } from '../../slice/selectors';
import TableStatusApply from '../TableStatusApply';

export const ChipItemSelect = styled(Grid)({
  display: 'flex',
  padding: '7px 10px',
  marginRight: '4px',
  marginTop: '8px',
  alignItems: 'center',
  width: 'fit-content',
  background: palette.primary.lightRed,
  borderRadius: '4px',
});
interface StatusUploadFile {
  id: number;
  label: string;
  value: string;
}

export default function DocumentPrinted() {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useManagementTemplateSlice();

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

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
  const drop = useRef<null | HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<any>();
  const [statusSelected, setStatusSelected] = useState<StatusUploadFile[]>([]);
  const [fileId, setFileId] = useState<string>();
  const [errorValidateEditor, setErrorValidateEditor] = useState<string>('');
  const { documentManagement } = useSelector(selectManagementTemplate);

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

  const handleChangeStatusUploadFile = (event: any, value: any) => {
    setStatusSelected(value);
    setErrorValidateEditor('');
  };
  const handleDeleteItemSelected = (itemSelect: StatusUploadFile) => {
    const listStatusRest = statusSelected?.filter(e => e !== itemSelect);
    setStatusSelected(listStatusRest);
  };

  const handleCreateFileDocument = () => {
    if (id && fileId) {
      const listEnumApplicableStatus: ApplicableStatus[] = [];
      statusSelected?.map(e =>
        listEnumApplicableStatus.push(e.value as ApplicableStatus),
      );
      if (listEnumApplicableStatus?.length <= 0) {
        setErrorValidateEditor('Vui lòng chọn trạng thái');
        return;
      }
      const payload = {
        fileId,
        projectId: id,
        applicableStatus: listEnumApplicableStatus,
      };
      dispatch(
        actions.createTemplateDocument(payload, (err?: any) => {
          if (err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo tài liệu in thành công',
                type: 'success',
              }),
            );
            setFileId('');
            setAttachments(null);
            setStatusSelected([]);
            dispatch(
              actions.fetchListTemplateDocument({
                page: 1,
                limit: 20,
                projectID: id,
              }),
            );
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: message || 'Tạo tài liệu in không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    } else {
      if (!fileId) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng tải lên mẫu tài liệu in',
            type: 'error',
          }),
        );
      }
    }
  };

  const renderListFileUpload = () => {
    return (
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '8px',
          mr: '20px',

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
          <Typography sx={{ mr: '32px', fontSize: '12px' }}>
            {attachments?.name || attachments?.path}
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
        <Typography sx={{ mr: '10px' }}>{itemSelect.label}</Typography>
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
  return (
    <Fragment>
      <TitleFragment>
        <Typography sx={{ fontWeight: 700 }}>{'Tài liệu in'}</Typography>
      </TitleFragment>
      {canEdit && (
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            border: 'solid 1px #ECECEE',
            borderRadius: '8px',
            p: '20px',
          }}
        >
          <Grid
            item
            xs={7}
            md={4.5}
            sx={{
              borderRight: 'dashed 1px #C8CBCF',
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
                  mr: '14px',
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
              <Typography sx={{ mr: '14px', fontSize: '14px' }}>
                Kéo thả file hoặc nhấn vào nút kế bên để tải file lên
              </Typography>
              <CustomButton title={'Tải file lên'} variant="outlined" />
            </Box>
            {(attachments?.name || attachments?.path) && (
              <Box mt="26px">{renderListFileUpload()}</Box>
            )}
          </Grid>
          <Grid
            item
            xs={5}
            md={5}
            sx={{
              px: '28px',
              borderRight: 'solid 1px #C8CBCF',
            }}
          >
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
                value={statusSelected?.length ? statusSelected : []}
                options={statusOptions}
                // getOptionDisabled={option =>
                //   optionStatusDisabled.includes(option)
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
            {errorValidateEditor.trim() && (
              <FormHelperText
                sx={{
                  fontSize: '12px',
                  color: theme.palette.error.light,
                  marginLeft: '10px',
                }}
              >
                {errorValidateEditor}
              </FormHelperText>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {statusSelected?.map(e => renderStatusSelected(e))}
            </Box>
          </Grid>
          <Grid
            item
            sx={{
              pl: '27px',
              '& .MuiButtonBase-root': {
                borderRadius: '8px',
                '& .MuiTypography-root': {
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400,
                },
              },
            }}
          >
            <CustomButton
              title={'Thêm template'}
              isIcon
              buttonMode="create"
              iconNode={<AddIcon />}
              handleClick={handleCreateFileDocument}
            />
          </Grid>
        </Grid>
      )}
      <TableStatusApply />
    </Fragment>
  );
}
