import { Box, Typography, useTheme } from '@mui/material';
import BreadCrumb from 'app/components/BreadCrumb';
import CustomButton from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { EnumObject } from 'types';
import { TitleEnum } from 'types/Enum';

import { useCategorySlice } from '../slice';
import { selectCategory } from '../slice/selector';

import { PayloadCreateCategory } from '../slice/types';

interface Props {
  isEdit?: boolean;
  isDetail?: boolean;
}

const CreatCategory: FC<Props> = ({ isEdit, isDetail }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useCategorySlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { isLoading, categoryDetail } = useSelector(selectCategory);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (isDetail || isEdit) {
      reset({
        name: categoryDetail?.name,
        description: categoryDetail?.description,
        type: categoryDetail?.type,
      });
    }
  }, [
    categoryDetail?.description,
    categoryDetail?.name,
    categoryDetail?.type,
    isDetail,
    isEdit,
    reset,
  ]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };
  const breadCrumbList = useMemo(() => {
    if (isEdit) {
      return [
        {
          label: t(translations.listManagement.managementCategory),
          path: path.reports,
        },
        {
          label: t(translations.listManagement.editCategory),
          path: `/category/edit/${id}`,
          isActive: true,
        },
      ];
    } else if (isDetail) {
      return [
        {
          label: t(translations.listManagement.managementCategory),
          path: path.reports,
        },
        {
          label: t(translations.listManagement.detailCatgory),
          path: `/category/detail/${id}`,
          isActive: true,
        },
      ];
    } else {
      return [
        {
          label: t(translations.listManagement.managementCategory),
          path: path.reports,
        },
        {
          label: t(translations.listManagement.createCategory),
          path: path.ComisstionRules,
          isActive: true,
        },
      ];
    }
  }, [t, isEdit, isDetail, id]);

  const handleCancel = () => navigate(-1);
  const { enumList } = useSelector(selectAuth);

  const onSubmit = (data: PayloadCreateCategory) => {
    if (isEdit && id) {
      const _data = {
        ...data,
        id,
      };
      delete _data.type;
      dispatch(
        actions.editCategory(_data, (responseData?: any) => {
          if (responseData?.success) {
            navigate(-1);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa danh mục thành công',
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa danh mục không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    } else {
      dispatch(
        actions.createCategory(data, (responseData?: any) => {
          if (responseData?.success) {
            navigate(-1);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo danh mục thành công',
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo danh mục không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };
  const categoryType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.CategoryType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const onError: SubmitErrorHandler<PayloadCreateCategory> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const handleSubmitDialog = () => {
    if (id) {
      dispatch(
        actions.updateStatusCategory({ id }, (responseData?: any) => {
          if (responseData?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `${
                  categoryDetail?.status
                    ? 'Khóa danh mục thành công'
                    : 'Mở khóa danh mục thành công'
                }`,
                type: 'success',
              }),
            );
            handleCloseDialog();
            dispatch(actions.getDetailCategory({ id }));
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `${
                  categoryDetail?.status
                    ? 'Khóa danh mục không thành công'
                    : 'Mở khóa danh mục không thành công'
                }`,
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  const handleNavigate = () => {
    navigate(`/category/edit/${id}`);
  };

  return (
    <Box
      sx={{
        paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
        paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
      }}
    >
      <Box display={'flex'} justifyContent={'flex-start'}>
        <BreadCrumb list={breadCrumbList} />
      </Box>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Box mt={3} display={'flex'} justifyContent={'flex-end'}>
          {isDetail ? (
            <CustomButton
              title={
                categoryDetail?.status
                  ? t(translations.common.lock)
                  : t(translations.common.unlock)
              }
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
                marginRight: '24px',
              }}
              variant="outlined"
              isIcon
              buttonMode="lock"
              handleClick={handleOpenDialog}
            />
          ) : (
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
          )}
          {isDetail ? (
            <CustomButton
              title={t(translations.common.edit)}
              variant="contained"
              isIcon
              buttonMode="create-click"
              handleClick={handleNavigate}
              light
            />
          ) : (
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
          )}
        </Box>
        <Box
          height={'240px'}
          width={'100%'}
          marginTop={'30px'}
          bgcolor={theme.palette.grey[0]}
          padding={'30px 24px 30px 24px'}
          sx={{
            height: { xs: '415px', sm: '240px' },
            '& .Mui-disabled': {
              cursor: 'not-allowed',
              background: `${theme.palette.secondary.dark} !important`,
            },
          }}
        >
          <Typography
            fontSize={'16px'}
            lineHeight={'20px'}
            fontWeight={'600'}
            color={theme.palette.primary.lighter}
          >
            {t(translations.listManagement.inforTypeRealEstate)}
          </Typography>
          <Box
            marginTop={'16px'}
            display={'flex'}
            justifyContent={'space-between'}
            gap={'25px'}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box width={'100%'}>
              <TextFieldCustom
                type="text"
                placeholder="Nhập"
                label="Tên loại BĐS"
                isRequired
                name="name"
                control={control}
                errors={errors}
                disabled={isDetail}
              />
              <Box>
                <TextFieldCustom
                  type="select"
                  placeholder="--Chọn loại danh mục--"
                  label="Loại danh mục"
                  isRequired
                  options={categoryType}
                  name="type"
                  control={control}
                  errors={errors}
                  disabled={isEdit || isDetail}
                />
              </Box>
            </Box>
            <Box width={'100%'}>
              <TextFieldCustom
                type="textarea"
                placeholder="Nhập"
                label="Mô tả"
                isRequired
                rows={4}
                name="description"
                control={control}
                errors={errors}
                disabled={isDetail}
              />
            </Box>
          </Box>
        </Box>
      </form>
      {isOpenDialog && (
        <ConfirmDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={
            categoryDetail?.status
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
            {categoryDetail?.status
              ? t(translations.category.confirmLock)
              : t(translations.category.confirmUnlock)}
          </Typography>
        </ConfirmDialog>
      )}
    </Box>
  );
};

export default CreatCategory;
