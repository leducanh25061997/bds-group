import { Icon } from '@iconify/react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { TypePayment } from 'types/Enum';
import { formatCurrency, formatDate } from 'utils/helpers';
import { useRefundSlice } from '../../Refunds/slice';
import { selectRefund } from '../../Refunds/slice/selectors';
import { ApproveRefundRequest } from '../../Refunds/slice/types';
import dayjs from 'dayjs';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  dialogTitle: string;
  refundId: string;
  description: string;
  handleCloseDialog: () => void;
}

export const ConfirmationOfRefund = (props: SimpleDialogType) => {
  const {
    handleClose,
    handleCloseDialog,
    open,
    dialogTitle,
    refundId,
    description,
  } = props;
  const dispatch = useDispatch();
  const { actions: refundAction } = useRefundSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { refundInformation } = useSelector(selectRefund);

  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      id: refundId,
      amountPaid: 0,
      receivedDate: new Date().toISOString(),
      receivedTime: dayjs(),
      contentPayment: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    dispatch(refundAction.fetchRefundInformation(refundId));
  }, [refundId]);

  useEffect(() => {
    if (refundInformation) {
      setValue('amountPaid', refundInformation.amountPaid);
      setValue(
        'contentPayment',
        `Hoàn tiền cho khách hàng ${
          refundInformation?.customer?.name
        } sản phẩm ${refundInformation?.ticket?.product?.code || '--'}`,
      );
      // setValue('receivedDate', new Date().toISOString());
      // setValue('receivedTime', moment(new Date()).format('YYYY-MM-DD hh:mm'));
    }
  }, [refundInformation]);

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

  const onSubmit = (data: ApproveRefundRequest) => {
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
            message: 'Vui lòng nhập ngày hoàn tiền',
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
      refundAction.approveRefundFormData(formData, (err?: any) => {
        if (err.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Duyệt phiếu hoàn tiền thành công',
              type: 'success',
            }),
          );
          handleClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: err.message || 'Duyệt phiếu hoàn tiền không thành công',
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
            fontSize: '24px',
            lineHeight: '29px',
            color: '#1E1E1E',
          }}
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
            <Box sx={{ margin: '0 100px', textAlign: 'center' }}>
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
                  {refundInformation?.code}
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
                  Người nhận tiền:
                </Grid>
                <Grid item md={9} sx={{ fontWeight: 700 }}>
                  {refundInformation?.customer?.name}
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
                    refundInformation?.amountPaid || '0',
                  )} VND`}
                </Grid>
              </Grid>
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Số chứng từ"
                placeholder="Số chứng từ"
                name="refundNumber"
                control={control}
                errors={errors}
                type="text"
              />
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Số tiền chi"
                placeholder="Số tiền chi"
                name="amountPaid"
                control={control}
                errors={errors}
                type={'currency'}
                disabled
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
                Thời gian hoàn tiền
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} mt={3}>
                <TextFieldCustom
                  label="Ngày hoàn tiền"
                  placeholder="Ngày hoàn tiền"
                  name="receivedDate"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={6} md={6} mt={3}>
                <TextFieldCustom
                  label="Giờ hoàn tiền"
                  placeholder="Giờ hoàn tiền"
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
