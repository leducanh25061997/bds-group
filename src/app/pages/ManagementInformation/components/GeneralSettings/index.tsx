import { Grid, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NUMBER_REGEX } from 'utils/helpers/regex';

export const GeneralSettings: React.FC<{ canEdit: boolean }> = ({
  canEdit,
}) => {
  const {
    control,
    setError,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            color: '#D6465F',
          }}
        >
          Thiết lập chung
        </Typography>
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Ngày mở bán"
          placeholder="Chọn ngày mở bán"
          name="startDate"
          type="date"
          control={control}
          errors={errors}
          setError={setError}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian bắt đầu"
          placeholder="Chọn thời gian bắt đầu"
          name="startTime"
          type="time"
          control={control}
          errors={errors}
          setError={setError}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Ngày kết thúc"
          placeholder="Chọn ngày kết thúc"
          name="endDate"
          type="date"
          control={control}
          errors={errors}
          setError={setError}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian kết thúc"
          placeholder="Chọn thời gian kết thúc"
          name="endTime"
          type="time"
          control={control}
          errors={errors}
          setError={setError}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian đăng ký"
          placeholder="Nhập thời gian đăng ký"
          isRequired
          name="registerTime"
          control={control}
          errors={errors}
          setError={setError}
          format="number"
          type="text"
          disabled={!canEdit}
          rules={{
            required: 'Vui lòng nhập thời gian đăng ký!' as string,
            pattern: {
              value: NUMBER_REGEX,
              message: 'Vui lòng nhập kiểu số',
            },
          }}
          endAdornment={<Typography>Phút</Typography>}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Số SP đăng ký cùng lúc/ TK"
          placeholder="Nhập số SP đăng ký cùng lúc/ TK"
          isRequired
          name="productCount"
          control={control}
          errors={errors}
          setError={setError}
          format="number"
          type="text"
          disabled={!canEdit}
          rules={{
            required: 'Vui lòng nhập Số SP đăng ký!' as string,
            pattern: {
              value: NUMBER_REGEX,
              message: 'Vui lòng nhập kiểu số',
            },
          }}
          endAdornment={<Typography>Sản phẩm</Typography>}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Số tiền đăng ký giữ chỗ"
          placeholder="Nhập số tiền đăng ký giữ chỗ"
          isRequired
          allowNegative={false}
          name="bookingAmountReservation"
          control={control}
          errors={errors}
          type={'currency'}
          disabled={!canEdit}
          rules={{
            required: 'Vui lòng nhập giá trị' as string,
          }}
          endAdornment={<Typography>VNĐ</Typography>}
        />
      </Grid>
      {/* <Grid
        item
        xs={6}
        md={6}
        mt={1}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <TextFieldCustom
          name="cashCollectionAccountant"
          control={control}
          errors={errors}
          type="checkbox"
          options={cashCollectionAccountant}
        />
      </Grid> */}
    </Grid>
  );
};
