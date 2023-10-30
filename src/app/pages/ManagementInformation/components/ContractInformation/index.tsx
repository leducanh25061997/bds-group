import { Grid, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const ContractInformation: React.FC<{ canEdit: boolean }> = ({
  canEdit,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const cashCollectionAccountant = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Tính theo ngày làm việc',
        value: '1',
      },
    ];
  }, []);

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
          Thông tin hợp đồng
        </Typography>
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian ra hợp đồng"
          placeholder="Thời gian ra hợp đồng"
          name="contractIssuanceTime"
          control={control}
          format="number"
          endAdornment={<Typography>Ngày</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        mt={1}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '20px',
            color: '#E42B2C',
          }}
        >
          *Tính từ ngày chuyển cọc thành công
        </Typography>
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian nhắc nợ lần 1"
          placeholder="Thời gian nhắc nợ lần 1"
          name="debtReminderTime1"
          control={control}
          format="number"
          endAdornment={<Typography>Ngày</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Thời gian nhắc nợ lần 2"
          placeholder="Thời gian nhắc nợ lần 2"
          name="debtReminderTime2"
          control={control}
          format="number"
          endAdornment={<Typography>Ngày</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Lãi chậm thanh toán/ ngày"
          placeholder="Lãi chậm thanh toán/ ngày"
          name="latePaymentInterest"
          control={control}
          format="float_number"
          endAdornment={<Typography>%</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Số ngày/ năm"
          placeholder="Số ngày/ năm"
          name="numberOfDays"
          control={control}
          format="number"
          endAdornment={<Typography>Ngày</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <TextFieldCustom
          label="Số ngày tính lãi"
          placeholder="Số ngày tính lãi"
          name="interestCalculationDays"
          control={control}
          format="number"
          endAdornment={<Typography>Ngày</Typography>}
          disabled={!canEdit}
        />
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        mt={1}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <TextFieldCustom
          name="calculatedByWorkingDays"
          control={control}
          type="checkbox"
          options={cashCollectionAccountant}
          disabled={!canEdit}
        />
      </Grid>
    </Grid>
  );
};
