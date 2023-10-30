import { Fragment, useState, useEffect, useMemo } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';

import TextFieldCustom from 'app/components/TextFieldCustom';
import palette from 'styles/theme/palette';
import CustomButton from 'app/components/Button';

import EDIT_ICON from 'assets/background/edit-icon.svg';
import ICON_DELETE from 'assets/background/icon-delete-file-light.svg';
import TYPE_CONTENT from 'assets/background/icon-type-content.svg';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { snackbarActions } from 'app/components/Snackbar/slice';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { LoadingScreen } from 'app/components/Table';
import { isEmpty, isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import { ItemTextField } from '../TemplateEmail';
import { TitleFragment } from '../..';
import TemplateProjectDialog from '../TemplateProjectDialog';
import { selectManagementTemplate } from '../../slice/selectors';
import { useManagementTemplateSlice } from '../../slice';
import {
  TemplateTypeEnum,
  TemplateStatusEnum,
  PayloadCreateTemplateEmailAndSms,
} from '../../slice/types';
import DialogEditor from '../DialogEditor';

interface PopupSettingSMSProps {
  isOpen: boolean;
  isEdit?: boolean;
}
interface PopupDeleteProps {
  isOpen: boolean;
  itemSelect?: PayloadCreateTemplateEmailAndSms | null;
}

export const TYPE_SMS_OPTIONS = [
  {
    id: 1,
    key: 'Đặt chỗ thành công',
    value: TemplateStatusEnum.APPROVED_TICKET,
  },
  {
    id: 2,
    key: 'Đặt cọc thành công',
    value: TemplateStatusEnum.APPROVED_DEPOSIT,
  },
];

export default function TemplateMessageSMS() {
  const method = useForm({ mode: 'onChange' });
  const { control, watch, setValue, handleSubmit } = method;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { templateSMSManagement, listProviderSMS } = useSelector(
    selectManagementTemplate,
  );
  const [isOpenContent, setIsOpenContent] = useState<boolean>(false);
  const [templateDetail, setTemplateDetail] =
    useState<PayloadCreateTemplateEmailAndSms>();
  const [showPopupDelete, setShowPopupDelete] = useState<PopupDeleteProps>({
    isOpen: false,
    itemSelect: null,
  });
  const { actions } = useManagementTemplateSlice();

  const [isOpenSettingSMS, setIsOpenSettingSMS] =
    useState<PopupSettingSMSProps>({
      isOpen: false,
      isEdit: undefined,
    });
  const [isResetData, setIsResetData] = useState(false);
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

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const handleClosePopup = () => {
    setIsOpenSettingSMS({
      isOpen: false,
      isEdit: undefined,
    });
  };

  const remainingSMSTemplateOptions = useMemo(() => {
    if (!templateSMSManagement || isEmpty(templateSMSManagement.data))
      return TYPE_SMS_OPTIONS;
    return TYPE_SMS_OPTIONS.filter(
      type =>
        !templateSMSManagement.data.some(
          template => template.status === type.value,
        ),
    );
  }, [templateSMSManagement]);

  const templateName = useMemo(() => {
    return {
      [TemplateStatusEnum.APPROVED_DEPOSIT]: 'Giao dịch đặt cọc thành công',
      [TemplateStatusEnum.APPROVED_TICKET]: 'Giao dịch đặt chỗ thành công',
      [TemplateStatusEnum.EVENT_SALE_SEND_MAIL_END_PHASE]:
        'Xác nhận kết thúc giao dịch',
    };
  }, []);

  useEffect(() => {
    dispatch(
      actions.fetchListProviderSMS({
        limit: 1000,
        page: 1,
        groupType: 'DAILY',
      }),
    );
  }, []);
  useEffect(() => {
    if (isResetData && (watch('content') || watch('typeSMS'))) {
      setValue('content', '');
      setValue('typeSMS', '');
      setValue('providerSMS', '');
    } else {
      setIsResetData(false);
    }
  }, [isResetData, watch('content'), watch('typeSMS'), watch('providerSMS')]);

  const onError = () => {};

  const handleCreateTemplate = (data: any) => {
    const payload: any = {
      type: TemplateTypeEnum.SMS,
      projectId: id,
      content: data.content,
      status: data.typeSMS,
      smsBranchNameId: data.providerSMS,
    };
    if (!data.content) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng nhập nội dung SMS',
          type: 'error',
        }),
      );
      return;
    }
    dispatch(
      actions.createTemplateEmailAndSMS(payload, (err?: any) => {
        if (err?.success) {
          setIsResetData(true);
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Tạo mẫu sms thành công',
              type: 'success',
            }),
          );
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.SMS,
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
              message: message || 'Tạo mẫu sms không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };
  const handleSubmitUpdate = (payload: any) => {
    const formData: PayloadCreateTemplateEmailAndSms = {
      id: templateDetail?.id,
      type: TemplateTypeEnum.SMS,
      projectId: id,
      content: payload.valueEditor,
      status: payload.typeSms,
      smsBranchNameId: payload.providerSMS,
    };
    dispatch(
      actions.updateTemplateEmailAndSMS(formData, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhập mẫu sms thành công',
              type: 'success',
            }),
          );
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.SMS,
              projectID: id,
            }),
          );
          setIsOpenSettingSMS({
            isOpen: false,
            isEdit: undefined,
          });
        } else {
          let message = err?.response?.data?.message;
          if (err?.code === 500) {
            message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
          }
          dispatch(
            snackbarActions.updateSnackbar({
              message: message || 'Cập nhập mẫu sms không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleDelete = (data?: string) => {
    const payload: PayloadCreateTemplateEmailAndSms = {
      id: data,
    };
    dispatch(
      actions.deleteTemplateEmailAndSms(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Xóa mẫu sms thành công',
              type: 'success',
            }),
          );
          handleClosePopupDeleteTemplateSMS();
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.SMS,
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
              message: message || 'Xóa mẫu sms không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleCloseContent = () => {
    setIsOpenContent(false);
  };

  const handleSubmitContent = () => {
    setIsOpenContent(false);
  };

  useEffect(() => {
    dispatch(
      actions.fetchListTemplateEmailAndSms({
        page: 1,
        limit: 1000,
        type: TemplateTypeEnum.SMS,
        projectID: id,
      }),
    );
  }, []);

  const handleClosePopupDeleteTemplateSMS = () => {
    setShowPopupDelete({
      isOpen: false,
      itemSelect: null,
    });
  };
  const handleConfirmDeleteTemplateSMS = () => {
    if (showPopupDelete?.itemSelect?.id) {
      handleDelete(showPopupDelete?.itemSelect?.id);
    }
  };

  return (
    <Fragment>
      <TitleFragment sx={{ mt: 4 }}>
        <Typography sx={{ fontWeight: 700 }}>{'Mẫu tin nhắn SMS'}</Typography>
      </TitleFragment>
      {canEdit && (
        <form onSubmit={handleSubmit(handleCreateTemplate, onError)}>
          <Box sx={{ mt: 1, display: 'flex' }}>
            <Box sx={{ width: '26%', mr: 2 }}>
              <TextFieldCustom
                control={control}
                type="select"
                label="Loại tin nhắn SMS"
                isRequired
                placeholder="Chọn loại tin nhắn SMS"
                name="typeSMS"
                options={remainingSMSTemplateOptions}
                handleDeleted={() => {
                  setValue('typeSMS', '');
                }}
              />
            </Box>
            <Box sx={{ width: '26%', mr: 2 }}>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: '17px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setIsOpenContent(true);
              }}
            >
              <img width="22px" height="22px" src={TYPE_CONTENT} alt="" />
              <Typography sx={{ ml: '6px' }}>soạn nội dung</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: palette.primary.darkRed,
                '& .MuiButtonBase-root': { borderRadius: '8px' },
                width: '160px',
              }}
            >
              <CustomButton
                title="Thêm SMS"
                variant="outlined"
                buttonMode="create"
                typeButton={'submit'}
                isIcon
                iconNode={<AddIcon sx={{ color: palette.primary.darkRed }} />}
                sxPropsText={{
                  color: palette.primary.darkRed,
                  fontWeight: 400,
                }}
                // handleClick={handleCreateTemplate}
              />
            </Box>
          </Box>
        </form>
      )}
      <Box
        sx={{
          mt: 1,
          p: 2,
          background: '#F4F5F6',
          borderRadius: '8px',
          maxHeight: '62vh',
          overflow: 'auto',
        }}
      >
        {isEmpty(templateSMSManagement?.data) ? (
          <Box>
            {isUndefined(templateSMSManagement?.data) ? (
              <LoadingScreen>
                <img
                  src="/static/loader/spinner.svg"
                  alt=""
                  width={100}
                  height={100}
                />
              </LoadingScreen>
            ) : (
              <Typography
                ml={'16px'}
                fontSize={'14px'}
                fontWeight={'400'}
                lineHeight={'28px'}
              >
                {t(translations.common.nodata)}
              </Typography>
            )}
          </Box>
        ) : (
          templateSMSManagement?.data?.map((template, index) => (
            <Grid
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', width: '90%' }}>
                <Grid sx={{ width: '30%' }}>
                  <ItemTextField>
                    {templateName[template.status as keyof typeof templateName]}
                  </ItemTextField>
                </Grid>
                <Grid sx={{ width: '30%' }}>
                  <ItemTextField>{template?.smsBranchName?.name}</ItemTextField>
                </Grid>
                <Grid sx={{ width: '40%' }}>
                  <ItemTextField sx={{ maxWidth: '100% !important' }}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: template?.content ? template?.content : '',
                      }}
                    />
                  </ItemTextField>
                </Grid>
              </Box>
              {canEdit && (
                <Box sx={{ display: 'flex', width: '10%' }}>
                  <IconButton
                    sx={{ ml: 2 }}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      setIsOpenSettingSMS({
                        isOpen: true,
                        isEdit: true,
                      });
                      setTemplateDetail(template);
                    }}
                  >
                    <img alt="edit icon" src={EDIT_ICON} />
                  </IconButton>
                  <IconButton
                    sx={{ ml: 2 }}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      // template?.id && handleDelete(template.id);
                      setShowPopupDelete({
                        isOpen: true,
                        itemSelect: template,
                      });
                    }}
                  >
                    <img alt="delete icon" src={ICON_DELETE} />
                  </IconButton>
                </Box>
              )}
            </Grid>
          ))
        )}
      </Box>
      <TemplateProjectDialog
        isOpen={isOpenSettingSMS.isOpen}
        isEdit={isOpenSettingSMS.isEdit}
        title={'Chỉnh sửa nội dung tin nhắn SMS'}
        handleClose={handleClosePopup}
        handleSubmit={handleSubmitUpdate}
        type={'sms'}
        maxWidth="md"
        data={templateDetail}
      />
      <DialogEditor
        isOpen={isOpenContent}
        title={'Soạn nội dung tin nhắn SMS'}
        handleClose={handleCloseContent}
        handleSubmit={handleSubmitContent}
        maxWidth="md"
        method={method}
        name="content"
        placeholder="Nhập nội dung tin nhắn SMS"
        actionName="Tạo"
      />
      <ConfirmDialog
        isOpen={showPopupDelete.isOpen}
        handleClose={handleClosePopupDeleteTemplateSMS}
        handleSubmit={handleConfirmDeleteTemplateSMS}
        buttonMode="unset"
        actionName="Xác nhận"
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
              mb: '16px',
            }}
          >
            Xóa mẫu tin nhắn SMS
          </Typography>
          <span>Bạn có chắc chắn muốn xóa mẫu tin nhắn SMS này hay không?</span>
        </Box>
      </ConfirmDialog>
    </Fragment>
  );
}
