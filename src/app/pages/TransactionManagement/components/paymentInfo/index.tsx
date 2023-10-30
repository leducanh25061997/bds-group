import { Box, Grid, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { Fragment, SetStateAction, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import documentService from 'services/api/document';
import { BankInfo } from 'types';

import { PaymentsInfo, PaymentMethods } from '../../slice/type';

interface PaymentInfoProps {
  formControl: UseFormReturn;
}

export function PaymentInfo(props: PaymentInfoProps) {
  const { formControl } = props;
  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
    getValues,
  } = formControl;
  const paymentInfoOption = useMemo(
    () => [
      { id: 0, value: PaymentsInfo.TRANSFER, key: 'Chuyển khoản' },
      { id: 1, value: PaymentsInfo.CASH, key: 'Tiền mặt' },
    ],
    [],
  );
  const paymentInfoMethods = useMemo(
    () => [
      { id: 0, value: PaymentMethods.FAST, key: 'PTTT nhanh' },
      { id: 1, value: PaymentMethods.STANDARD, key: 'PTTT chuẩn' },
      { id: 2, value: PaymentMethods.BORROW, key: 'PTTT vay ngân hàng' },
    ],
    [],
  );
  const [listBanks, setListBanks] = useState<any[]>([]);
  const getListBank = async () => {
    const getListBanks = await documentService.getListBanks();
    if (getListBanks?.data?.length) {
      const tempListBank: any[] = [];
      getListBanks?.data?.forEach((e: BankInfo) => {
        tempListBank.push({ ...e, value: e.shortName, key: e.shortName });
      });
      setListBanks(tempListBank);
    }
  };
  useEffect(() => {
    if (!watch('payments')) {
      setValue('payments', PaymentsInfo.TRANSFER);
    }
    if (!watch('paymentMethod')) {
      setValue('paymentMethod', PaymentMethods.FAST);
    }
    getListBank();
  }, []);
  const handleDeleted = () => {
    setValue('bank', null);
  };
  return (
    <Fragment>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Thông tin thanh toán'}
        </Typography>
        <Grid container>
          <Box
            sx={{
              '& .MuiFormControl-root .MuiFormGroup-root .MuiFormControlLabel-root':
                {
                  mr: '113px',
                },
            }}
          >
            <TextFieldCustom
              name="payments"
              control={control}
              type="radio"
              options={paymentInfoOption}
              errors={errors}
              setError={setError}
            />
          </Box>
        </Grid>
        {getValues('payments') === PaymentsInfo.TRANSFER && (
          <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Nhập mã số thuế"
                label="Mã số thuế"
                name="tax"
                type="text"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Chọn ngân hàng"
                label="Ngân hàng"
                type="select"
                options={listBanks}
                name="bank"
                control={control}
                errors={errors}
                handleDeleted={handleDeleted}
                setError={setError}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Nhập số tài khoản ngân hàng"
                label="Số tài khoản ngân hàng"
                type="text"
                isRequired={!!watch('bank')}
                name="accountNumber"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Phương thức thanh toán'}
        </Typography>
        <Grid container mt={1}>
          <Box
            sx={{
              '& .MuiFormControl-root .MuiFormGroup-root .MuiFormControlLabel-root':
                {
                  mr: '80px',
                },
            }}
          >
            <TextFieldCustom
              name="paymentMethod"
              control={control}
              type="radio"
              options={paymentInfoMethods}
              errors={errors}
              setError={setError}
            />
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}
