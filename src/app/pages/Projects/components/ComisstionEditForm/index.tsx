/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Grid, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import UploadAvatar from 'app/components/UploadAvatar';
import { useProfile } from 'app/hooks';
import { translations } from 'locales/translations';
import React, { useMemo, useState } from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import document from 'services/api/document';
import { renderFile } from 'utils/helpers';

import SignatureAccount from '../signature-account';

interface Props {
  control: Control<any>;
  errors?: any;
  setValue: any;
  watch: (value: string) => string;
}

export default function ComisstionEditForm(props: Props) {
  const theme = useTheme();
  const [isOpenSignature, setIsOpenSignature] = useState(false);
  const userInfo = useProfile();
  const { t } = useTranslation();
  const { control, errors, setValue, watch } = props;
  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setValue('avt', imageId[0]);
  };
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

  const handleSignaturing = () => {
    setIsOpenSignature(true);
  };

  const closeDialogSignature = () => {
    setIsOpenSignature(false);
  };

  const handleSignatureSuccess = (idSignature: number) => {
    setValue('signatrueImage', idSignature);
  };

  const handleRemove = () => {
    setValue('avt', null);
  };

  return (
    <Box bgcolor={theme.palette.grey[0]} p="60px">
      <Typography
        fontSize="24px"
        lineHeight="29px"
        fontWeight={600}
        color={theme.palette.primary.lighter}
        mb={5}
      >
        {t(translations.common.accountInformation)}
      </Typography>
      <UploadAvatar
        buttonName={'Tải ảnh lên'}
        name="avatar"
        warningMessage={'* Định dạng jpg, jpeg, png. Kích thước không quá 5Mb.'}
        control={control}
        errors={errors}
        handleSelectFile={handleSelectFile}
        defaultValue={userInfo && renderFile(userInfo?.id)}
        handleRemove={handleRemove}
      />
      <Grid container mt={3} justifyContent="space-between">
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Họ và tên nhân viên"
            isRequired
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="fullName"
          />
        </Grid>
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Số điện thoại"
            isRequired
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="phone"
          />
        </Grid>
      </Grid>
      <Grid container mt={2} justifyContent="space-between">
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Giới tính"
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="gender"
            type="radio"
            options={gennerList}
          />
          <TextFieldCustom
            label="Ngày sinh"
            isRequired
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="dob"
            type="date"
            isHiddenFeatureDay
          />
        </Grid>
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Địa chỉ"
            isRequired
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="address"
            type="textarea"
            rows={4}
          />
        </Grid>
      </Grid>
      <Grid container mt={2} justifyContent="space-between">
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Email"
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="email"
            disabled
          />
        </Grid>
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Số thẻ thẩm định viên"
            placeholder="Nhập số thẻ thẩm định viên"
            control={control}
            errors={errors}
            name="license"
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Typography
          color={theme.palette.primary.light}
          fontSize={'14px'}
          fontWeight={600}
          sx={{
            '& span': {
              ml: 0.5,
              color: theme.palette.primary.lighter,
            },
          }}
        >
          Chữ ký <span>*</span>
        </Typography>
      </Box>
      <SignatureAccount
        isOpen={isOpenSignature}
        handleClose={closeDialogSignature}
        handleSignatureSuccess={handleSignatureSuccess}
      />
    </Box>
  );
}
