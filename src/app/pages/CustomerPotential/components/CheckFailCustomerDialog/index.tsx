import { Box, Typography } from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CheckFailCustomerDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: (reason?: string) => void;
  itemSelect?: any;
}
export default function CheckFailCustomerDialog(
  props: CheckFailCustomerDialogProps,
) {
  const { isOpen, handleClose, handleConfirm, itemSelect } = props;

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ reason: string }>({
    mode: 'onBlur',
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  const handleSubmitConfirm = () => {
    handleFormSubmit(data => {
      handleConfirm?.(data.reason);
    })();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      handleClose={handleClose}
      handleSubmit={handleSubmitConfirm}
      buttonMode="unset"
      actionName="Xác nhận"
    >
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 400,
          mb: '16px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '24px',
            mb: '16px',
          }}
        >
          Đánh giá không đạt
        </Typography>
        <span>
          Bạn có chắc chắn muốn đánh giá không đạt với{' '}
          <strong>{itemSelect?.code}</strong> này hay không?
        </span>
        <Box
          component="form"
          sx={{
            mt: '10px',
            mb: '20px',
          }}
          onSubmit={e => e.preventDefault()}
        >
          <TextFieldCustom
            name="reason"
            label="Lý do"
            placeholder="Nhập lý do"
            control={control}
            errors={errors}
            sxProps={{}}
          />
        </Box>
      </Box>
    </ConfirmDialog>
  );
}
