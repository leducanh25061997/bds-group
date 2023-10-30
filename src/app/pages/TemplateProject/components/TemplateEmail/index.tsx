import { Fragment, useState, useEffect, useMemo } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';

import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import TYPE_CONTENT from 'assets/background/icon-type-content.svg';
import CustomButton from 'app/components/Button';
import { useDispatch, useSelector } from 'react-redux';

import palette from 'styles/theme/palette';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';

import EDIT_ICON from 'assets/background/edit-icon.svg';
import ICON_DELETE from 'assets/background/icon-delete-file-light.svg';
import { useParams } from 'react-router-dom';
import { snackbarActions } from 'app/components/Snackbar/slice';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { LoadingScreen } from 'app/components/Table';
import { isEmpty, isUndefined } from 'lodash';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import { selectManagementTemplate } from '../../slice/selectors';
import { TitleFragment } from '../..';
import TemplateProjectDialog from '../TemplateProjectDialog';
import { useManagementTemplateSlice } from '../../slice';
import {
  TemplateTypeEnum,
  TemplateStatusEnum,
  PayloadCreateTemplateEmailAndSms,
} from '../../slice/types';
import DialogEditor from '../DialogEditor';

export const ItemTextField = styled(Box)({
  padding: '12px 20px',
  marginRight: '16px',
  marginTop: '8px',
  maxWidth: '430px',
  fontWeight: 400,
  fontFamily: 'Inter',
  fontSize: '14px',
  background: palette.background.light,
  borderRadius: '8px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

interface PopupSettingEmailProps {
  isOpen: boolean;
  isEdit?: boolean;
}
interface PopupDeleteProps {
  isOpen: boolean;
  itemSelect?: PayloadCreateTemplateEmailAndSms | null;
}

export const TYPE_EMAIL_OPTIONS = [
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
  {
    id: 3,
    key: 'Gửi email XN kết thúc giao dịch',
    value: TemplateStatusEnum.EVENT_SALE_SEND_MAIL_END_PHASE,
  },
];

export default function TemplateEmail() {
  const method = useForm({
    mode: 'onSubmit',
  });
  const { control, watch, setValue, handleSubmit } = method;
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { templateEmailManagement } = useSelector(selectManagementTemplate);
  const { actions } = useManagementTemplateSlice();
  const [isOpenContent, setIsOpenContent] = useState<boolean>(false);
  const [templateDetail, setTemplateDetail] =
    useState<PayloadCreateTemplateEmailAndSms>();
  const [isOpenSettingEmail, setIsOpenSettingEmail] =
    useState<PopupSettingEmailProps>({
      isOpen: false,
      isEdit: false,
    });
  const [showPopupDelete, setShowPopupDelete] = useState<PopupDeleteProps>({
    isOpen: false,
    itemSelect: null,
  });
  const [isResetData, setIsResetData] = useState(false);

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const handleClosePopup = () => {
    setIsOpenSettingEmail({
      isOpen: false,
      isEdit: undefined,
    });
  };

  const remainingEmailTemplateOptions = useMemo(() => {
    if (!templateEmailManagement || isEmpty(templateEmailManagement.data))
      return TYPE_EMAIL_OPTIONS;
    return TYPE_EMAIL_OPTIONS.filter(
      type =>
        !templateEmailManagement.data.some(
          template => template.status === type.value,
        ),
    );
  }, [templateEmailManagement]);

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
      actions.fetchListTemplateEmailAndSms({
        page: 1,
        limit: 1000,
        type: TemplateTypeEnum.EMAIL,
        projectID: id,
      }),
    );
  }, [id]);

  const onError = () => {};

  useEffect(() => {
    if (
      isResetData &&
      (watch('content') || watch('titleEmail') || watch('typeEmail'))
    ) {
      setValue('content', '');
      setValue('titleEmail', '');
      setValue('typeEmail', '');
    } else {
      setIsResetData(false);
    }
  }, [isResetData, watch('content'), watch('titleEmail'), watch('typeEmail')]);

  const handleCreateTemplate = (data: any) => {
    const payload: any = {
      type: TemplateTypeEnum.EMAIL,
      projectId: id,
      title: data?.titleEmail, //watch('titleEmail'),
      content: data?.content, //watch('content'),
      status: data?.typeEmail, //watch('typeEmail'),
    };
    if (!data?.content) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng nhập nội dung email',
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
              message: 'Tạo mẫu email thành công',
              type: 'success',
            }),
          );
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.EMAIL,
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
              message: message || 'Tạo mẫu email không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };
  const handleSubmitEdit = (payload: any) => {
    const formData: PayloadCreateTemplateEmailAndSms = {
      id: templateDetail?.id,
      type: TemplateTypeEnum.EMAIL,
      projectId: id,
      title: payload.titleEmail,
      content: payload.valueEditor,
      status: payload.typeEmail,
    };
    dispatch(
      actions.updateTemplateEmailAndSMS(formData, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật mẫu email thành công',
              type: 'success',
            }),
          );
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.EMAIL,
              projectID: id,
            }),
          );
          setIsOpenSettingEmail({
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
              message: message || 'Cập nhập mẫu email không thành công',
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
              message: 'Xóa mẫu email thành công',
              type: 'success',
            }),
          );
          handleClosePopupDeleteTemplateSMS();
          dispatch(
            actions.fetchListTemplateEmailAndSms({
              page: 1,
              limit: 1000,
              type: TemplateTypeEnum.EMAIL,
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
              message: message || 'Xóa mẫu email không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleCloseContent = () => {
    // setValue('content', null);
    setIsOpenContent(false);
  };

  const handleSubmitContent = () => {
    setIsOpenContent(false);
  };

  const handleDeleteTypeEmail = () => {
    setValue('typeEmail', '');
  };

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
      <TitleFragment>
        <Typography sx={{ fontWeight: 700 }}>{'Mẫu email'}</Typography>
      </TitleFragment>
      {canEdit && (
        <form onSubmit={handleSubmit(handleCreateTemplate, onError)}>
          <Box sx={{ mt: 1, display: 'flex' }}>
            <Box sx={{ width: '26%', mr: 2 }}>
              <TextFieldCustom
                control={control}
                isRequired
                type="select"
                label="Loại Email"
                placeholder="Chọn loại email"
                name="typeEmail"
                options={remainingEmailTemplateOptions}
                handleDeleted={handleDeleteTypeEmail}
              />
            </Box>
            <Box sx={{ width: '26%', mr: 2 }}>
              <TextFieldCustom
                control={control}
                isRequired
                // type="text"
                label="Tiêu đề Email"
                placeholder="Nhập tiêu đề Email"
                name="titleEmail"
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
                title="Thêm Email"
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
        {isEmpty(templateEmailManagement?.data) ? (
          <Box>
            {isUndefined(templateEmailManagement?.data) ? (
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
          templateEmailManagement?.data?.map((template, index) => (
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
                  <ItemTextField>{template.title}</ItemTextField>
                </Grid>
                <Grid
                  sx={{
                    width: '40%',
                    '& .MuiBox-root': {
                      whiteSpace: 'unset',
                    },
                  }}
                >
                  <ItemTextField>
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
                      setIsOpenSettingEmail({
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
        isOpen={isOpenSettingEmail.isOpen}
        isEdit={isOpenSettingEmail.isEdit}
        title={'Chỉnh sửa nội dung Email'}
        handleClose={handleClosePopup}
        handleSubmit={handleSubmitEdit}
        type={'email'}
        maxWidth="md"
        method={method}
        data={templateDetail}
      />
      <DialogEditor
        isOpen={isOpenContent}
        title={'Soạn nội dung email mẫu'}
        handleClose={handleCloseContent}
        handleSubmit={handleSubmitContent}
        maxWidth="md"
        method={method}
        name="content"
        placeholder="Nhập nội dung email"
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
            Xóa mẫu email
          </Typography>
          <span>Bạn có chắc chắn muốn xóa mẫu email này hay không?</span>
        </Box>
      </ConfirmDialog>
    </Fragment>
  );
}
