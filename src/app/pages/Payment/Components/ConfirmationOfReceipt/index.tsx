import { Box, Grid, Typography } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatDate } from 'utils/helpers';
import React, { useMemo, useEffect } from 'react';
import moment from 'moment';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import dayjs from 'dayjs';
import { TypePayment } from 'types/Enum';

import { usePaymentSlice } from '../../Receipts/slice';
import { ApproveReceiptRequest } from '../../Receipts/slice/types';
import { selectReceipt } from '../../Receipts/slice/selectors';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  dialogTitle: string;
  receiptId: string;
  description: string;
  handleCloseDialog: () => void;
}

export const ConfirmationOfReceipt = (props: SimpleDialogType) => {
  const {
    handleClose,
    handleCloseDialog,
    open,
    dialogTitle,
    receiptId,
    description,
  } = props;
  const dispatch = useDispatch();
  const { actions: paymentAction } = usePaymentSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { receiptInformation } = useSelector(selectReceipt);

  function toDateWithOutTimeZone(date: any) {
    const tempTime = date.split(':');
    const seconds = +tempTime[0] * 60 * 60 + +tempTime[1] * 60;
    return seconds * 1000;
  }

  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      id: receiptId,
      totalPrice: 0,
      receivedDate: new Date().toISOString(),
      receivedTime: dayjs(),
      contentPayment: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    dispatch(paymentAction.fetchReceiptInformation(receiptId));
  }, [receiptId]);

  const renderType = (type: string) => {
    if (type === 'RESERVATION') {
      return 'giữ chỗ';
    } else {
      return 'đặt cọc';
    }
  };

  useEffect(() => {
    if (receiptInformation) {
      setValue(
        'totalPrice',
        receiptInformation.bookingAmountReservation -
          receiptInformation.amountPaid,
      );
      setValue(
        'contentPayment',
        `${receiptInformation?.customer?.name} thanh toán tiền ${renderType(
          receiptInformation?.type,
        )} căn hộ ${receiptInformation?.ticket?.project?.name || '--'}`,
      );
    }
  }, [receiptInformation]);

  const transactionMethodOptions = useMemo(
    () => [
      { id: 0, key: 'Chuyển khoản', value: TypePayment.TRANSFER },
      { id: 1, key: 'Tiền mặt', value: TypePayment.CASH },
      { id: 2, key: 'Thanh toán thẻ Visa', value: TypePayment.VISA },
      { id: 3, key: 'Đã thu CĐT', value: TypePayment.CDT },
      { id: 4, key: 'Đã thu ĐVBH', value: TypePayment.DVBH },
    ],
    [],
  );

  const onSubmit = (data: ApproveReceiptRequest) => {
    const formData = { ...data };
    if (formData.receivedDate) {
      formData.receivedDate = formatDate(formData.receivedDate);
    } else {
      delete formData.receivedDate;
    }

    if (formData.receivedTime) {
      if (!formData.receivedDate) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng nhập ngày nhận tiền',
            type: 'error',
          }),
        );
        return;
      }

      formData.receivedTime = moment(new Date(formData.receivedTime)).format(
        'HH:mm',
      );
    } else {
      delete formData.receivedTime;
    }

    dispatch(
      paymentAction.approveReceiptFormData(formData, (err?: any) => {
        if (err.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi thông tin thành công',
              type: 'success',
            }),
          );
          handleClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: err.message || 'Thay đổi thông tin không thành công',
              type: 'error',
            }),
          );
          // handleClose();
        }
      }),
    );
  };

  return (
    <Dialog fullWidth maxWidth={'sm'} open={open} onClose={handleCloseDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: '#1E1E1E',
          }}
          variant="h4"
        >
          {dialogTitle}
        </DialogTitle>
        <Box
          sx={{
            position: 'absolute',
            right: '16px',
            top: '10px',
            cursor: 'pointer',
          }}
        >
          <Icon
            icon="mdi:remove"
            color="#d9d9d9"
            width="18"
            height="28"
            onClick={handleCloseDialog}
          />
        </Box>
        <DialogContent sx={{ padding: '10px 24px' }}>
          <Box>
            <Box sx={{ margin: '0 90px', textAlign: 'center' }}>
              <Typography>
                {`${description} `}{' '}
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '29px',
                    textAlign: 'center',
                    color: '#1E1E1E',
                  }}
                >
                  {receiptInformation?.code}
                </span>
                {` này không?`}
              </Typography>
            </Box>
            <Box
              sx={{
                margin: '16px 0',
                background: '#475160',
                borderRadius: '8px',
                padding: '17px 20px',
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{ fontSize: '14px', lineHeight: '24px', color: '#FFFFFF' }}
              >
                <Grid
                  item
                  md={3}
                  sx={{ background: '#475160', fontWeight: 400 }}
                >
                  Người nộp tiền:
                </Grid>
                <Grid item md={9} sx={{ fontWeight: 700 }}>
                  {receiptInformation?.customer?.name}
                </Grid>
                <Grid
                  item
                  md={3}
                  sx={{ background: '#475160', fontWeight: 400 }}
                >
                  Số tiền:
                </Grid>
                <Grid item md={9} sx={{ fontWeight: 700 }}>
                  {`${formatCurrency(
                    receiptInformation?.bookingAmountReservation! -
                      receiptInformation?.amountPaid! || '0',
                  )} VND`}
                </Grid>
              </Grid>
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Số chứng từ"
                placeholder="Số chứng từ"
                name="receiptNumber"
                control={control}
                errors={errors}
                type="text"
              />
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Số tiền thực nhận"
                placeholder="Số tiền thực nhận"
                name="totalPrice"
                control={control}
                errors={errors}
                type={'currency'}
                endAdornment={<Typography>VNĐ</Typography>}
              />
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Nội dung thanh toán"
                placeholder="Nội dung thanh toán"
                name="contentPayment"
                control={control}
                errors={errors}
                type="text"
              />
            </Box>
            <Box mt={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#222222',
                }}
              >
                Thời gian nhận tiền
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} mt={3}>
                <TextFieldCustom
                  label="Ngày nhận tiền"
                  placeholder="Ngày nhận tiền"
                  name="receivedDate"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={6} md={6} mt={3}>
                <TextFieldCustom
                  label="Giờ nhận tiền"
                  placeholder="Giờ nhận tiền"
                  name="receivedTime"
                  type="time"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#222222',
                }}
              >
                Phương thức thanh toán
              </Typography>
            </Box>
            <Box mt={2}>
              <TextFieldCustom
                name="typePayment"
                type="radio"
                options={transactionMethodOptions}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Box>
            <Box mt={6}>
              <TextFieldCustom
                label="Ghi chú"
                name="note"
                type="textarea2"
                control={control}
                errors={errors}
                setError={setError}
                rows={4}
                placeholder={'Nhập nội dung ghi chú'}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <CustomButton
            title="Hủy"
            handleClick={handleCloseDialog}
            sxProps={{
              background: '#FFFFFF',
              border: '1px solid #D6465F',
              borderRadius: '8px',
              width: '128px',
            }}
            sxPropsText={{ color: '#1E1E1E' }}
          />
          <CustomButton
            title="Xác nhận"
            typeButton="submit"
            sxProps={{
              background: '#D45B7A',
              borderRadius: '8px',
              width: '128px',
            }}
            sxPropsText={{ color: '#FFFFFF' }}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
