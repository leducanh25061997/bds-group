import React, { useEffect } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { usePaymentSlice } from '../../Receipts/slice';
import { selectReceipt } from '../../Receipts/slice/selectors';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useForm } from 'react-hook-form';
import { CancelReceiptRequest } from '../../Receipts/slice/types';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  receiptId: string;
}

export const RejectionOfVotes = (props: SimpleDialogType) => {
  const { handleClose, open, receiptId } = props;
  const dispatch = useDispatch();
  const { actions: paymentAction } = usePaymentSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      id: receiptId
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    dispatch(paymentAction.fetchReceiptInformation(receiptId));
  }, [receiptId]);


  const onSubmit = (data: CancelReceiptRequest) => {
    const formData = {...data};
    dispatch(
      paymentAction.cancelReceiptFormData(
        formData,
        (err?: any) => {
          if (err.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            handleClose()
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin không thành công',
                type: 'error',
              }),
            );
          }
        },
      ),
    );
  };

  return (
    <Dialog fullWidth maxWidth={'sm'} open={open} onClose={handleClose}>
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
          {`Từ chối phiếu thu`}
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
            onClick={handleClose}
          />
        </Box>
        <DialogContent sx={{ padding: '10px 24px' }}>
          <Box>
            <Box sx={{ margin: '0 100px', textAlign: 'center' }}>
              <Typography>
                {`Vui lòng nhập lý do từ chối cho phiếu thu này`}
              </Typography>
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Lý do từ chối"
                placeholder="Nhập lý do"
                name="reason"
                control={control}
                isRequired
                errors={errors}
                type="text"
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
            handleClick={handleClose}
            title="Hủy"
            sxProps={{
              background: '#FFFFFF',
              border: '1px solid #D6465F',
              borderRadius: '8px',
              width: '128px'
            }}
            sxPropsText={{ color: '#1E1E1E' }}
          />
          <CustomButton
            title="Xác nhận"
            typeButton="submit"
            sxProps={{
              background: '#D45B7A',
              borderRadius: '8px',
              width: '128px'
            }}
            sxPropsText={{ color: '#FFFFFF' }}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
