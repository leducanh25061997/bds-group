/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Grid, Typography, useTheme } from '@mui/material';
import BreadCrumb from 'app/components/BreadCrumb';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import UploadAvatar from 'app/components/UploadAvatar';
import UploadSimpleFile from 'app/components/UploadSimpleFile';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import authentication from 'services/api/authentication';
import documentService from 'services/api/document';
import { Option } from 'types/Option';
import { FILE_ERROR_MESSAGES, MAX_FILE_SIZE } from 'utils/helpers';

import { useComisstionSlice } from '../slice';
import { selectComisstion } from '../slice/selector';
import { PayloadCreateComisstion } from '../slice/types';

interface Props {
  isEdit?: boolean;
}

export default function CreateComisstion(props: Props) {
  const { isEdit } = props;
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

  useEffect(() => {
    !isEdit && dispatch(actions.fetchRoleList());
  }, [actions, dispatch, isEdit]);

  useEffect(() => {
    return () => {
      dispatch(actions.clearDataComisstion());
    };
  }, [actions, dispatch]);

  const breadCrumbList = useMemo(() => {
    if (isEdit) {
      return [
        {
          label: t(translations.Comisstion.ComisstionAccount),
          path: path.ComisstionsAccount,
        },
        {
          label: t(translations.common.edit),
          path: `/Comisstions-account/edit/${id}`,
          isActive: true,
        },
      ];
    } else {
      return [
        {
          label: t(translations.Comisstion.ComisstionAccount),
          path: path.ComisstionsAccount,
        },
        {
          label: t(translations.Comisstion.createAccount),
          path: path.ComisstionRules,
          isActive: true,
        },
      ];
    }
  }, [t, isEdit, id]);

  useEffect(() => {
    if (isEdit) {
      // const id = ComisstionDetail?.licenseImage?.id;
      // let isPaper: boolean = false;
      // if (id && ComisstionDetail?.license) {
      //   setIsCheckedPaper(true);
      //   isPaper = true;
      // }
      // reset({
      //   fullName: ComisstionDetail?.fullName,
      //   gender: ComisstionDetail?.gender,
      //   phone: ComisstionDetail?.phone,
      //   accTypeId: ComisstionDetail?.user?.userRoles[0]?.role?.id,
      //   address: ComisstionDetail?.address,
      //   staffCode: ComisstionDetail?.staffCode,
      //   email: ComisstionDetail?.user?.email,
      //   dob: ComisstionDetail?.dob,
      //   avt: ComisstionDetail?.user?.avt?.id,
      //   licenseImage: id,
      //   license: ComisstionDetail?.license as string,
      //   paper: isPaper,
      //   additionalFiles: ComisstionDetail?.additionalFiles?.map(item => item.id),
      // });
    }
  }, [
    // ComisstionDetail?.address,
    // ComisstionDetail?.dob,
    // ComisstionDetail?.fullName,
    // ComisstionDetail?.gender,
    // ComisstionDetail?.phone,
    // ComisstionDetail?.staffCode,
    // ComisstionDetail?.user?.avt?.id,
    // ComisstionDetail?.user?.email,
    // ComisstionDetail?.user?.userRoles,
    // ComisstionDetail?.licenseImage?.id,
    // ComisstionDetail?.license,
    // ComisstionDetail?.additionalFiles,
    isEdit,
    reset,
  ]);

  useEffect(() => {
    if (!isEdit) {
      getRandomPassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const getRandomPassword = async () => {
    const randomData = await authentication.randomPassword();
    !!randomData && setValue('password', randomData);
  };

  const [isCheckedPaper, setIsCheckedPaper] = useState(false);
  const handleCancel = () => navigate(-1);
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

  const accountType = useMemo(() => {
    if (roleList?.length) {
      const overrideRole = [...roleList];
      const roles: Option[] = [];
      overrideRole?.forEach(item => {
        if (item?.name !== 'Admin' && item.name !== 'Customer') {
          const role = {
            id: item.id,
            key: convertText(item.name),
            value: item.id,
          };
          roles.push(role);
        }
      });
      return roles;
    }
    return [];
  }, [roleList]);

  const gennerList = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Nam',
        value: 'MALE',
      },
      {
        id: 2,
        key: 'Nữ',
        value: 'FEMALE',
      },
    ];
  }, []);

  const validateFiles = (file: File, field: any) => {
    let message = '';
    clearErrors();
    if (file?.size > MAX_FILE_SIZE) {
      message = FILE_ERROR_MESSAGES.oversize;
      setError(field.name, {
        message,
      });
      return message;
    }
    if (file?.type.includes('image') || file?.type.includes('pdf')) {
      return message;
    }
    if (
      !file?.type.includes('image') ||
      !file?.type.includes('application/pdf')
    ) {
      message = FILE_ERROR_MESSAGES.invalid('File');
      setError(field.name, {
        message,
      });
      return message;
    }
  };

  const handleFilesCallback = (fileId: number, field?: any) => {
    field.onChange(fileId);
  };

  const removeFile = (field?: any) => {};

  const submit = async (data: PayloadCreateComisstion) => {
    // setIsLoading(true);
    // const fileIds =
    //   (await documentService.uploadFile(Array.from(filesAttachment))) || [];
    // if (isEdit) {
    //   const arrayIds: number[] =
    //     ComisstionDetail?.additionalFiles?.map(item => item.id) || [];
    //   const requestPayload = {
    //     ...data,
    //     status: get(Status, ComisstionDetail?.user?.status || ''),
    //     id,
    //   };
    //   requestPayload.additionalFiles = arrayIds.concat(fileIds);
    //   delete requestPayload.email;
    //   delete requestPayload.avatar;
    //   dispatch(
    //     actions.updateDataComisstion(requestPayload, (err?: any) => {
    //       if (err?.success) {
    //         dispatch(
    //           snackbarActions.updateSnackbar({
    //             message: 'Cập nhật thành công',
    //             type: 'success',
    //           }),
    //         );
    //         navigate(path.ComisstionsAccount);
    //       } else {
    //         dispatch(
    //           snackbarActions.updateSnackbar({
    //             message: 'Cập nhật không thành công',
    //             type: 'error',
    //           }),
    //         );
    //         const errors: ErrorType[] = err?.response?.data?.errors;
    //         if (errors?.length) {
    //           for (let i = 0; i < errors.length; i++) {
    //             setError(`${errors[i].at}`, {
    //               message: errors[i].message,
    //             });
    //           }
    //         }
    //       }
    //       setIsLoading(false);
    //     }),
    //   );
    // } else {
    //   data.additionalFiles = fileIds;
    //   dispatch(
    //     actions.createComisstion(data, (err?: any) => {
    //       if (err?.success) {
    //         dispatch(
    //           snackbarActions.updateSnackbar({
    //             message: 'Tạo thành công',
    //             type: 'success',
    //           }),
    //         );
    //         navigate(path.ComisstionsAccount);
    //       } else {
    //         dispatch(
    //           snackbarActions.updateSnackbar({
    //             message: 'Tạo không thành công',
    //             type: 'error',
    //           }),
    //         );
    //         const errors: ErrorType[] = err?.response?.data?.errors;
    //         if (errors?.length) {
    //           for (let i = 0; i < errors.length; i++) {
    //             setError(`${errors[i].at}`, {
    //               message: errors[i].message,
    //             });
    //           }
    //         }
    //       }
    //       setIsLoading(false);
    //     }),
    //   );
    // }
  };

  const handleSelectFile = async (file: File) => {
    const imageId = await documentService.uploadAvatar(file);
    imageId?.length && setValue('avt', imageId[0]);
  };

  const handleChecked = (checked: boolean) => {
    setIsCheckedPaper(checked);
  };

  const handleSubmitDialog = () => {
    const payload = {
      // id: ComisstionDetail?.user?.id || '',
      // status:
      //   ComisstionDetail?.user?.status === Status.ACTIVE
      //     ? Status.INACTIVE
      //     : Status.ACTIVE,
    };
    // dispatch(
    //   actions.updateStatusComisstion(payload, (err?: any) => {
    //     if (err?.success) {
    //       dispatch(
    //         snackbarActions.updateSnackbar({
    //           message:
    //             ComisstionDetail?.user?.status === Status.ACTIVE
    //               ? t(translations.common.lockedAccount)
    //               : t(translations.common.unlockedAccount),
    //           type: 'success',
    //         }),
    //       );
    //       id && dispatch(actions.getDetailComisstion({ id }));
    //     } else {
    //       dispatch(
    //         snackbarActions.updateSnackbar({
    //           message: t(translations.common.errorOccurred),
    //           type: 'error',
    //         }),
    //       );
    //     }
    //   }),
    // );
  };

  const handleUploadMultipleFiles = async () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', '');
    fileSelector.click();
    fileSelector.addEventListener('change', async (event: any) => {
      if (event.target.files?.length) {
        for (let i = 0; i < event.target.files?.length; i++) {
          const indexDot = event.target.files[i]?.name?.indexOf('.');
          const typeFile = event.target.files[i]?.name?.slice(
            indexDot + 1,
            event.target.files[i]?.name?.length,
          );
          if (!['png', 'pdf', 'jpg', 'jpeg']?.includes(typeFile)) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Không hỗ trợ tải lên file có định dạng ${typeFile}`,
                type: 'error',
              }),
            );
            return;
          }
        }
        // if (
        //   (event.target.files?.length || 0) +
        //     (filesAttachment?.length || 0) +
        //     (ComisstionDetail?.additionalFiles?.length || 0) >
        //   5
        // ) {
        //   dispatch(
        //     snackbarActions.updateSnackbar({
        //       message: 'Không được tải lên quá 5 tệp',
        //       type: 'error',
        //     }),
        //   );
        //   return;
        // }
        const newFiles = filesAttachment.concat(Array.from(event.target.files));
        let isValidateStorage: boolean = false;
        if (newFiles?.length) {
          for (let i = 0; i < newFiles?.length; i++) {
            if (newFiles[i].size > 5000000) {
              isValidateStorage = true;
              break;
            }
          }
        }
        if (isValidateStorage) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Không được tải lên file có dung lượng quá 5MB',
              type: 'error',
            }),
          );
          return;
        }
        setFilesAttachment(newFiles);
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Tải lên thành công',
            type: 'success',
          }),
        );
      }
    });
  };

  const handleRemoveFile = () => {
    setValue('avt', undefined);
    if (isEdit) {
      setValue('avt', null);
    }
  };

  const handleRemoveFileImport = (fileIndex: number) => {
    setFilesAttachment(
      filesAttachment?.filter((item, _index) => _index !== fileIndex),
    );
  };

  const removeFileEdit = (fileId: number) => {
    // const additionalFiles = ComisstionDetail?.additionalFiles?.filter(
    //   _x => _x.id !== fileId,
    // );
    // const ComisstionNew = {
    //   ...ComisstionDetail,
    //   additionalFiles,
    // };
    // dispatch(actions.removeFileAttachment(ComisstionNew));
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
    <Box pb={'43px'}>
      <form onSubmit={handleSubmit(submit, onError)}>
        <Box
          mt={3}
          display={'flex'}
          justifyContent="space-between"
          position="fixed"
          right="24px"
          bgcolor={theme.palette.grey[300]}
          width="100%"
          zIndex={3}
          p="16px 0px"
          top="55px"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'none' },
            marginTop: { xs: '0px', sm: '24px' },
            right: { xs: '0px' },
            top: { xs: '55px', sm: '40px', lg: '55px' },
          }}
        >
          <Box
            sx={{
              marginLeft: {
                xs: '10px',
                sm: '15px',
                lg: !isShowSidebar ? '90px' : '295px',
                xl: !isShowSidebar ? '105px' : '295px',
              },
              marginBottom: { xs: '15px', sm: '0px' },
            }}
          >
            <BreadCrumb list={breadCrumbList} />
          </Box>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            sx={{
              marginLeft: { xs: '12px', sm: '0px' },
              marginRight: { xs: '0px', sm: '24px' },
              marginTop: { xs: '0px', sm: '24px' },
              marginBottom: { xs: '0px', sm: '12px' },
            }}
          >
            <CustomButton
              title={t(translations.common.cancel)}
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
                mr: 3,
              }}
              variant="outlined"
              handleClick={handleCancel}
            />
            <CustomButton
              title={
                isEdit
                  ? t(translations.common.save)
                  : t(translations.common.create)
              }
              variant="contained"
              isIcon
              buttonMode="create-click"
              typeButton={'submit'}
              isDisable={isLoading}
              light
            />
          </Box>
        </Box>
        <Box
          mt={'80px'}
          sx={{
            paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
            paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
          }}
        >
          <Grid container justifyContent={'space-between'}>
            <Grid
              item
              xs={12}
              sm={12}
              md={5.9}
              bgcolor={theme.palette.grey[0]}
              p={3}
              sx={{ marginBottom: { xs: '24px', md: '0px' } }}
            >
              <Typography
                fontSize={'16px'}
                fontWeight={600}
                color={theme.palette.primary.lighter}
              >
                Thông tin đăng nhập
              </Typography>
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
                  handleRemove={handleRemoveFile}
                  handleSelectFile={handleSelectFile}
                  // defaultValue={
                  //   isEdit &&
                  //   ComisstionDetail?.user?.avt &&
                  //   renderFile(ComisstionDetail?.user?.avt?.id)
                  // }
                />
              </Box>
              <Box mt={2}>
                <TextFieldCustom
                  placeholder="Nhập họ và tên nhân viên"
                  label="Họ và tên nhân viên"
                  isRequired
                  name="fullName"
                  control={control}
                  errors={errors}
                />
              </Box>
              <Box mt={2}>
                <TextFieldCustom
                  placeholder="Nhập email"
                  label="Email"
                  isRequired
                  name="email"
                  control={control}
                  errors={errors}
                  disabled={isEdit || false}
                  setError={setError}
                  format="email"
                />
              </Box>
              <Box mt={2}>
                <TextFieldCustom
                  label="Mật khẩu"
                  name="password"
                  control={control}
                  errors={errors}
                  warningMessage="* Mật khẩu được tạo tự động và không thể chỉnh sửa"
                  disabled
                  type={isEdit ? 'password' : 'text'}
                />
              </Box>
              <Box mt={2}>
                <TextFieldCustom
                  placeholder="Nhập loại tài khoản"
                  label="Loại tài khoản"
                  isRequired
                  name="accTypeId"
                  control={control}
                  type="select"
                  options={accountType}
                  errors={errors}
                />
              </Box>
              <Box mt={2}>
                <TextFieldCustom
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  isRequired
                  name="phone"
                  control={control}
                  errors={errors}
                  format="number"
                  setError={setError}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={5.9}>
              <Grid
                item
                sm={12}
                bgcolor={theme.palette.grey[0]}
                p={3}
                height={'fit-content'}
              >
                <Typography
                  fontSize={'16px'}
                  fontWeight={600}
                  color={theme.palette.primary.lighter}
                >
                  Thông tin người dùng
                </Typography>
                <Box mt={2}>
                  <TextFieldCustom
                    placeholder="Nhập giới tính"
                    label="Giới tính"
                    name="gender"
                    control={control}
                    type="radio"
                    options={gennerList}
                    errors={errors}
                    mlRadio={2}
                  />
                </Box>
                <Box mt={2}>
                  <TextFieldCustom
                    placeholder="Nhập ngày sinh"
                    label="Ngày sinh"
                    name="dob"
                    control={control}
                    errors={errors}
                    type="date"
                    isHiddenFeatureDay
                  />
                </Box>
                <Box mt={2}>
                  <TextFieldCustom
                    placeholder="Nhập địa chỉ"
                    label="Địa chỉ"
                    type="textarea"
                    rows={3}
                    name="address"
                    control={control}
                    errors={errors}
                  />
                </Box>
                <Box mt={2}>
                  <TextFieldCustom
                    placeholder="Nhập mã nhân viên"
                    label="Mã nhân viên"
                    name="staffCode"
                    control={control}
                    errors={errors}
                  />
                </Box>
              </Grid>
              <Grid
                item
                sm={12}
                bgcolor={theme.palette.grey[0]}
                p={3}
                mt={3}
                height={'fit-content'}
              >
                <Typography
                  fontSize={'16px'}
                  fontWeight={600}
                  color={theme.palette.primary.lighter}
                >
                  Thông tin giấy phép
                </Typography>
                <TextFieldCustom
                  name="paper"
                  control={control}
                  errors={errors}
                  type="checkbox"
                  options={[
                    {
                      id: 1,
                      key: 'Nhân viên có giấy phép hành nghề.',
                      value: 'STAFF',
                    },
                  ]}
                  onChecked={handleChecked}
                />
                <Box mt={2}>
                  <TextFieldCustom
                    placeholder="Nhập số thẻ thẩm định viên"
                    label="Số thẻ thẩm định viên"
                    isRequired={isCheckedPaper}
                    name="license"
                    control={control}
                    errors={errors}
                    disabled={!isCheckedPaper}
                  />
                </Box>
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  color={theme.palette.primary.light}
                  mt={3}
                >
                  Ảnh chụp giấy phép {isCheckedPaper ? '*' : ''}
                </Typography>
                <Box mt={2}>
                  <Controller
                    name="licenseImage"
                    control={control}
                    rules={{
                      required: isCheckedPaper ? 'Trường này là bắt buộc' : '',
                    }}
                    render={({ field }) => {
                      return (
                        <UploadSimpleFile
                          buttonName="Tải tệp lên"
                          warningMessage="* Định dạng jpg, jpeg, png, pdf. Kích thước không quá 5Mb."
                          acceptFile="image/*,.pdf"
                          handleFilesCallback={handleFilesCallback}
                          removeFile={removeFile}
                          validateFiles={validateFiles}
                          field={field}
                          error={errors?.licenseImage?.message}
                          // defaultValue={ComisstionDetail?.licenseImage?.filename}
                        />
                      );
                    }}
                  />
                </Box>
              </Grid>
              {isEdit && (
                <Grid
                  item
                  sm={12}
                  bgcolor={theme.palette.grey[0]}
                  p={3}
                  mt={3}
                  height={'fit-content'}
                >
                  <Typography
                    fontSize={'16px'}
                    fontWeight={600}
                    color={theme.palette.primary.lighter}
                  >
                    Tình trạng tài khoản
                  </Typography>
                  <Typography
                    fontSize={'14px'}
                    fontWeight={600}
                    color={theme.palette.primary.light}
                    mt={2}
                    sx={{
                      '& span': {
                        ml: 0.5,
                        fontWeight: 400,
                      },
                    }}
                  >
                    Tình trạng tài khoản:
                    {/* <span>
                      {get(
                        TransferTextStatus,
                        ComisstionDetail?.user?.status || '',
                      )}
                    </span> */}
                  </Typography>
                  {/* <CustomButton
                    title={
                      ComisstionDetail?.user?.status === Status.ACTIVE
                        ? t(translations.common.lock)
                        : t(translations.common.unlock)
                    }
                    sxProps={{
                      border: `1px solid ${theme.palette.primary.lighter}`,
                      color: theme.palette.primary.light,
                      mt: 2,
                    }}
                    variant="outlined"
                    isIcon
                    buttonMode="lock"
                    handleClick={handleOpenDialog}
                  /> */}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container justifyContent={'space-between'} mt={3}>
            <Grid
              item
              xs={12}
              sm={12}
              md={5.9}
              bgcolor={theme.palette.grey[0]}
              p={3}
            >
              <Typography
                fontSize={'16px'}
                fontWeight={600}
                color={theme.palette.primary.lighter}
              >
                Đính kèm thông tin
              </Typography>
              <Box mt={2}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  color={theme.palette.primary.light}
                  mt={3}
                >
                  File đính kèm
                </Typography>
                <CustomButton
                  title="Tải tệp lên"
                  isIcon
                  buttonMode="upload"
                  variant="outlined"
                  sxProps={{
                    border: `1px solid ${theme.palette.primary.lighter}`,
                    padding: '4.5px 8px',
                    height: '34px',
                    mt: 1,
                    '& .MuiTypography-root': {
                      fontSize: '12px',
                    },
                  }}
                  handleClick={handleUploadMultipleFiles}
                />
                <Typography
                  mt={1}
                  fontSize={'14px'}
                  color={theme.palette.primary.light}
                  fontStyle={'italic'}
                >
                  * Định dạng jpg, jpeg, png, pdf. Kích thước không quá 5Mb.
                  <br />
                  Số lượng tệp đính kèm không vượt quá 5
                </Typography>
              </Box>
              {/* <Box mt={2}>
                {ComisstionDetail?.additionalFiles?.map(file => (
                  <Box key={file.id} display="flex" mb={1}>
                    <img
                      alt="image file"
                      src={returnFileType(file.filename)}
                      width="18px"
                    />
                    <Typography ml={1} fontSize="14px">
                      {file.filename}
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{ padding: '0', marginLeft: '4px' }}
                      onClick={() => removeFileEdit(file.id)}
                    >
                      <img src={CLOSE_ICON} alt="delete-icon" />
                    </IconButton>
                  </Box>
                ))}
                {filesAttachment?.map((file, index) => (
                  <Box key={file.type} display="flex" mb={1}>
                    <img
                      alt="image file"
                      src={returnFileType(file.name)}
                      width="18px"
                    />
                    <Typography ml={1} fontSize="14px">
                      {file.name}
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{ padding: '0', marginLeft: '4px' }}
                      onClick={() => handleRemoveFileImport(index)}
                    >
                      <img src={CLOSE_ICON} alt="delete-icon" />
                    </IconButton>
                  </Box>
                ))}
              </Box> */}
            </Grid>
          </Grid>
        </Box>
      </form>
      {/* {isOpenDialog && (
        <ConfirmDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={
            ComisstionDetail?.user?.status === Status.ACTIVE
              ? t(translations.common.lock)
              : t(translations.common.unlock)
          }
        >
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            color={theme.palette.primary.light}
            mb={5}
          >
            {ComisstionDetail?.user?.status === Status.ACTIVE
              ? t(translations.confirmMessage.unlock)
              : t(translations.confirmMessage.lock)}
          </Typography>
        </ConfirmDialog>
      )} */}
    </Box>
  );
}
