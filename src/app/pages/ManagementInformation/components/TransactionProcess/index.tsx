import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';
import { useFormContext } from 'react-hook-form';
import palette from 'styles/theme/palette';
import { useSelector } from 'react-redux';
import TextFieldCustom from 'app/components/TextFieldCustom';

import { selectManagementInformation } from '../../slice/selectors';

const initials = [
  {
    id: 'TPHN',
    name: 'Thành phố Hà Nội',
  },
  {
    id: 'THG',
    name: 'Tỉnh Hà Giang',
  },
  {
    id: 'TBC',
    name: 'Tỉnh Bắc Kạn',
  },
  {
    id: 'TTN',
    name: 'Tỉnh Thái Nguyên"',
  },
  {
    id: 'TQN',
    name: 'Tỉnh Quảng Ninh',
  },
];

const TransactionProcess: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  const {
    control,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useFormContext();
  const { transactionProcess } = useSelector(selectManagementInformation);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} mb={1}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            color: palette.primary.button,
          }}
        >
          Quy trình giao dịch
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <TextFieldCustom
          placeholder="Quy trình giữ chỗ"
          label="Quy trình giữ chỗ"
          type="select"
          isRequired
          options={transactionProcess.reservation}
          disabled={!canEdit}
          name="reservationProcessId"
          control={control}
          errors={errors}
          setError={setError}
          handleDeleted={() => {
            setValue('reservationProcessId', null);
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextFieldCustom
          placeholder="Quy trình đặt cọc"
          label="Quy trình đặt cọc"
          type="select"
          isRequired
          options={transactionProcess.deposit}
          disabled={!canEdit}
          name="depositProcessId"
          control={control}
          errors={errors}
          setError={setError}
          handleDeleted={() => {
            setValue('depositProcessId', null);
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextFieldCustom
          placeholder="Quy trình huỷ chỗ - hoàn tiền"
          label="Quy trình huỷ chỗ - hoàn tiền"
          type="select"
          isRequired
          options={transactionProcess.canceledTicket}
          disabled={!canEdit}
          name="reservationRefundProcessId"
          control={control}
          errors={errors}
          setError={setError}
          handleDeleted={() => {
            setValue('reservationRefundProcessId', null);
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextFieldCustom
          placeholder="Quy trình tạo hợp đồng"
          label="Quy trình tạo hợp đồng"
          type="select"
          // isRequired
          options={transactionProcess.contract}
          disabled={!canEdit}
          name="contactCreationProcessId"
          control={control}
          // errors={errors}
          // setError={setError}
          handleDeleted={() => {
            setValue('contactCreationProcessId', null);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TransactionProcess;
