import { Box, Grid, Typography, useTheme } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import UploadAvatar from 'app/components/UploadAvatar';
import { useProfile } from 'app/hooks';
import { translations } from 'locales/translations';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import document from 'services/api/document';
import { renderFile } from 'utils/helpers';

interface Props {
  control: Control<any>;
  errors?: any;
  setValue: any;
}

export default function CustomerPersonal(props: Props) {
  const theme = useTheme();
  const userInfo = useProfile();
  const { t } = useTranslation();
  const { control, errors, setValue } = props;
  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setValue('avt', imageId[0]);
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
            label="Họ và tên khách hàng"
            isRequired
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="name"
          />
        </Grid>
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Ngày sinh"
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="dob"
            type="date"
            isHiddenFeatureDay
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
          <Box mt={3}>
            <TextFieldCustom
              label="Số CMND/CCCD"
              placeholder="Nhập"
              control={control}
              errors={errors}
              name="identity"
              isRequired
            />
          </Box>
        </Grid>
        <Grid item sm={5.8}>
          <TextFieldCustom
            label="Địa chỉ"
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
            label="Số điện thoại"
            placeholder="Nhập"
            control={control}
            errors={errors}
            name="phone"
            isRequired
          />
        </Grid>
      </Grid>
    </Box>
  );
}
