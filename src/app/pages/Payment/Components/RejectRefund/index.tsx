import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useRefundSlice } from '../../Refunds/slice';
import { CancelRefundRequest } from '../../Refunds/slice/types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { Icon } from '@iconify/react';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  refundId: string;
}

export const RejectionRefund = (props: SimpleDialogType) => {
  const { handleClose, open, refundId } = props;
  const dispatch = useDispatch();
  const { actions: refundAction } = useRefundSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      id: refundId,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    dispatch(refundAction.fetchRefundInformation(refundId));
  }, [refundId]);

  const onSubmit = (data: CancelRefundRequest) => {
    const formData = { ...data };
    dispatch(
      refundAction.cancelRefundFormData(formData, (err?: any) => {
        if (err.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Từ chối phiếu hoàn tiền thành công',
              type: 'success',
            }),
          );
          handleClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Từ chối phiếu hoàn tiền không thành công',
              type: 'error',
            }),
          );
        }
      }),
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
          {`Từ chối hoàn tiền`}
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
                {`Vui lòng nhập lý do từ chối cho phiếu hoàn tiền này`}
              </Typography>
            </Box>
            <Box mt={4}>
              <TextFieldCustom
                label="Lý do từ chối"
                placeholder="Nhập lý do"
                name="reason"
                control={control}
                errors={errors}
                type="text"
                isRequired
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
