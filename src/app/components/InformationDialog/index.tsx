import {
  Avatar,
  Box,
  Dialog,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useProfile } from 'app/hooks';
import { renderFile } from 'utils/helpers';
import { useForm } from 'react-hook-form';
import document from 'services/api/document';

import { AccountType } from 'types/Enum';

import { useComisstionSlice } from 'app/pages/Comisstion/slice';

import { useDispatch } from 'react-redux';
import { useAuthSlice } from 'app/pages/Auth/slice';

import UploadAvatar from '../UploadAvatar';
import TextFieldCustom from '../TextFieldCustom';
import { useSnackbarSlice } from '../Snackbar/slice';

interface Props {
  isOpen: boolean;
  isEditInformation: boolean;
  handleClose: () => void;
  setIsEditInformation: (newValue: boolean) => void;
}

export default function InformationDialog(props: Props) {
  const theme = useTheme();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    mode: 'onSubmit',
  });
  const { isOpen, handleClose, isEditInformation, setIsEditInformation } =
    props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useProfile();
  const { actions } = useComisstionSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: authActions } = useAuthSlice();

  useEffect(() => {}, [setValue]);

  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setValue('avt', imageId[0]);
  };

  const redirectToEditStatus = () => setIsEditInformation(true);
  const onSubmit = (data: any) => {
    dispatch(
      actions.updateDataAdmin(data, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật thành công',
              type: 'success',
            }),
          );
          dispatch(authActions.getUserInfo());
          handleClose?.();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                err?.response?.data?.message || 'Cập nhật không thành công',
              type: 'error',
            }),
          );
          if (
            err?.response?.data?.message === 'Số điện thoại đã được sử dụng'
          ) {
            setError('phone', {
              type: 'error',
              message: err?.response?.data?.message,
            });
          }
        }
      }),
    );
  };

  const handleRemove = () => {
    setValue('avt', null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        '&.MuiDialog-root': {
          backdropFilter: 'blur(0.5rem)',
        },
      }}
    >
      <Grid
        sx={{
          height: 'max-content',
          minWidth: '523px',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box p={'12px 24px'} bgcolor={theme.palette.primary.lighter}>
            <Typography
              fontSize="16px"
              fontWeight={600}
              lineHeight="20px"
              color={theme.palette.grey[0]}
            >
              {t(translations.common.accountInformation)}
            </Typography>
          </Box>
          <Box
            p="12px 24px"
            maxHeight="60vh"
            sx={{
              overflow: 'scroll',
            }}
          >
            {!isEditInformation && (
              <Fragment>
                <Box mt={4}>
                  <Typography
                    fontSize="14px"
                    fontWeight={600}
                    lineHeight="16px"
                    color={theme.palette.primary.light}
                  >
                    {t(translations.common.avatar)}
                  </Typography>
                  <Avatar
                    src={renderFile(userInfo?.id)}
                    sx={{
                      width: '100px',
                      height: '100px',
                      mt: 2,
                    }}
                  />
                </Box>
                <Box mt={2}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.companyName)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.taxCode)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.email)}
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography
                        fontSize="14px"
                        lineHeight="17px"
                        color={theme.palette.primary.light}
                      >
                        {userInfo?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.address)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Giấy phép hoạt động
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography
                        fontSize="14px"
                        lineHeight="17px"
                        color={theme.palette.primary.light}
                      >
                        {userInfo}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Số điện thoại
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography
                        fontSize="14px"
                        lineHeight="17px"
                        color={theme.palette.primary.light}
                      >
                        {userInfo?.staff?.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{ color: theme.palette.primary.light, mt: '12px' }}
                />
                <Box mt={3}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Fax
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Fragment>
            )}
            {isEditInformation && (
              <Fragment>
                <Box mt={2}>
                  <UploadAvatar
                    titleUpload={'Ảnh đại diện'}
                    buttonName={'Tải ảnh lên'}
                    name="avatar"
                    warningMessage={
                      '* Định dạng jpg, jpeg, png. Kích thước không quá 5Mb.'
                    }
                    control={control}
                    errors={errors}
                    handleSelectFile={handleSelectFile}
                    defaultValue={userInfo && renderFile(userInfo?.id)}
                    handleRemove={handleRemove}
                  />
                </Box>
                <Box mt={2}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.companyName)} *
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="name"
                        control={control}
                        errors={errors}
                        isRequired
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.taxCode)} *
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="taxCode"
                        control={control}
                        errors={errors}
                        isRequired
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.email)}
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="email"
                        control={control}
                        errors={errors}
                        defaultValue={userInfo?.email}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        {t(translations.userInformation.address)} *
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="address"
                        control={control}
                        errors={errors}
                        type="textarea"
                        isRequired
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Giấy phép hoạt động *
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="license"
                        control={control}
                        errors={errors}
                        isRequired
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Số điện thoại *
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="phone"
                        control={control}
                        errors={errors}
                        isRequired
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={1}>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        lineHeight="16px"
                        color={theme.palette.primary.light}
                      >
                        Fax
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextFieldCustom
                        placeholder="Nhập"
                        name="fax"
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fragment>
            )}
          </Box>
          <Box p="24px" display="flex" justifyContent="flex-end">
            <CustomButton
              title={t(translations.common.cancel)}
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
                mr: 2,
              }}
              variant="outlined"
              handleClick={handleClose}
            />
            {!isEditInformation && (
              <CustomButton
                title={t(translations.common.edit)}
                light
                isIcon
                buttonMode={'edit'}
                sxProps={{
                  background: theme.palette.primary.lighter,
                }}
                handleClick={redirectToEditStatus}
              />
            )}
            {isEditInformation && (
              <CustomButton
                title={t(translations.common.save)}
                isIcon
                buttonMode={'create-click'}
                sxProps={{
                  background: theme.palette.primary.lighter,
                }}
                typeButton="submit"
                light
              />
            )}
          </Box>
        </form>
      </Grid>
    </Dialog>
  );
}
