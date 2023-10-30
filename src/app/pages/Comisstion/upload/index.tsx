/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import path from 'app/routes/path';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import documentService from 'services/api/document';

import UploadComisstions from '../components/UploadExcel';
import { useComisstionSlice } from '../slice';
import { selectComisstion } from '../slice/selector';
import { PayloadCreateComisstion } from '../slice/types';

export default function UploadComisstion() {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { roleList, ComisstionDetail } = useSelector(selectComisstion);
  const { isShowSidebar } = useSelector(layoutsSelector);
  const { actions } = useComisstionSlice();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onSubmit',
  });
  const { t } = useTranslation();
  const { actions: snackbarActions } = useSnackbarSlice();
  const navigate = useNavigate();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [filesAttachment, setFilesAttachment] = useState<File[]>([]);
  const handleCancel = () => navigate(path.ComisstionsAccount);

  useEffect(() => {
    return () => {
      dispatch(actions.clearDataComisstion());
    };
  }, [actions, dispatch]);

  const [isCheckedPaper, setIsCheckedPaper] = useState(false);
  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const convertText = (text: string) => {
    switch (text) {
      case 'Manager1':
        return 'Nhân viên quản lý cấp 1';
      case 'Manager2':
        return 'Nhân viên quản lý cấp 2';
      case 'Staff':
        return 'Thẩm định viên';
      default:
        return '';
    }
  };

  const handleFilesCallback = (fileId: number, field?: any) => {
    field.onChange(fileId);
  };

  const removeFile = (field?: any) => {};

  const handleSelectFile = async (file: File) => {
    const imageId = await documentService.uploadAvatar(file);
    imageId?.length && setValue('avt', imageId[0]);
  };

  const handleChecked = (checked: boolean) => {
    setIsCheckedPaper(checked);
  };

  // const handleSubmitDialog = () => {
  //   const payload = {
  //     id: ComisstionDetail?.user?.id || '',
  //     status:
  //       ComisstionDetail?.user?.status === Status.ACTIVE
  //         ? Status.INACTIVE
  //         : Status.ACTIVE,
  //   };
  //   dispatch(
  //     actions.updateStatusComisstion(payload, (err?: any) => {
  //       if (err?.success) {
  //         dispatch(
  //           snackbarActions.updateSnackbar({
  //             message:
  //               ComisstionDetail?.user?.status === Status.ACTIVE
  //                 ? t(translations.common.lockedAccount)
  //                 : t(translations.common.unlockedAccount),
  //             type: 'success',
  //           }),
  //         );
  //         id && dispatch(actions.getDetailComisstion({ id }));
  //       } else {
  //         dispatch(
  //           snackbarActions.updateSnackbar({
  //             message: t(translations.common.errorOccurred),
  //             type: 'error',
  //           }),
  //         );
  //       }
  //     }),
  //   );
  // };

  // const handleUploadMultipleFiles = async () => {
  //   const fileSelector = document.createElement('input');
  //   fileSelector.setAttribute('type', 'file');
  //   fileSelector.setAttribute('multiple', '');
  //   fileSelector.click();
  //   fileSelector.addEventListener('change', async (event: any) => {
  //     if (event.target.files?.length) {
  //       for (let i = 0; i < event.target.files?.length; i++) {
  //         const indexDot = event.target.files[i]?.name?.indexOf('.');
  //         const typeFile = event.target.files[i]?.name?.slice(
  //           indexDot + 1,
  //           event.target.files[i]?.name?.length,
  //         );
  //         if (!['png', 'pdf', 'jpg', 'jpeg']?.includes(typeFile)) {
  //           dispatch(
  //             snackbarActions.updateSnackbar({
  //               message: `Không hỗ trợ tải lên file có định dạng ${typeFile}`,
  //               type: 'error',
  //             }),
  //           );
  //           return;
  //         }
  //       }
  //       if (
  //         (event.target.files?.length || 0) +
  //           (filesAttachment?.length || 0) +
  //           (ComisstionDetail?.additionalFiles?.length || 0) >
  //         5
  //       ) {
  //         dispatch(
  //           snackbarActions.updateSnackbar({
  //             message: 'Không được tải lên quá 5 tệp',
  //             type: 'error',
  //           }),
  //         );
  //         return;
  //       }
  //       const newFiles = filesAttachment.concat(Array.from(event.target.files));
  //       let isValidateStorage: boolean = false;
  //       if (newFiles?.length) {
  //         for (let i = 0; i < newFiles?.length; i++) {
  //           if (newFiles[i].size > 5000000) {
  //             isValidateStorage = true;
  //             break;
  //           }
  //         }
  //       }
  //       if (isValidateStorage) {
  //         dispatch(
  //           snackbarActions.updateSnackbar({
  //             message: 'Không được tải lên file có dung lượng quá 5MB',
  //             type: 'error',
  //           }),
  //         );
  //         return;
  //       }
  //       setFilesAttachment(newFiles);
  //       dispatch(
  //         snackbarActions.updateSnackbar({
  //           message: 'Tải lên thành công',
  //           type: 'success',
  //         }),
  //       );
  //     }
  //   });
  // };

  const handleRemoveFileImport = (fileIndex: number) => {
    setFilesAttachment(
      filesAttachment?.filter((item, _index) => _index !== fileIndex),
    );
  };

  const onError: SubmitErrorHandler<PayloadCreateComisstion> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  return (
    <Box pb={'50px'} mt={'-10px'}>
      <Box
        sx={{
          paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
          paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
          borderRadius: 8,
        }}
      >
        <Grid container justifyContent={'space-between'}>
          <Grid
            item
            xs={12}
            sm={12}
            bgcolor={theme.palette.grey[0]}
            p={3}
            sx={{ marginBottom: { xs: '24px', md: '0px' }, borderRadius: 3 }}
          >
            <Box display={'flex'} sx={{ alignItems: 'center' }}>
              <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
                <img src={BACK_ICON} onClick={handleCancel} />
              </Box>
              <Typography
                fontSize={'20px'}
                fontWeight={700}
                lineHeight={'24px'}
              >
                {t(translations.Comisstion.createAccount)}
              </Typography>
            </Box>
            <UploadComisstions />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
