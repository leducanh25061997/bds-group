import React from 'react';
import { Box, Dialog, DialogTitle, Grid, Stack, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import deleteIcon from 'assets/background/close-icon.svg';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useCustomerSlice } from '../../slice';
import { ErrorType } from 'types/Option';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleCancel?: () => void;
  actionName: string;
  actionCancel?: string;
  customerId?: string;
}

export default function CreateActivityDialog(props: Props) {
  const { actions } = useCustomerSlice();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const theme = useTheme();

  const { isOpen, handleClose, handleCancel, actionName, customerId } = props;

  const FormControl = useForm({
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = FormControl;

  const { t } = useTranslation();

  const onSubmit = (items: any) => {
    const payload = items;
    payload.customerId = customerId;
    dispatch(
      actions.createActivityCustomer(payload, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thành công',
                type: 'success',
              }),
            );
            handleClose();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật không thành công',
                type: 'error',
              }),
            );
            const errors: ErrorType[] = res?.response?.data?.errors;
            if (errors?.length) {
              for (let i = 0; i < errors.length; i++) {
                setError(`${errors[i].at}`, {
                  message: errors[i].message,
                });
              }
            }
          }
        }
      }),
    );
  };

  const onError: SubmitErrorHandler<any> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: t(translations.common.errorMessage),
          type: 'error',
        }),
      );
    }
  };

  return (
    <Dialog maxWidth="md" open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          height: 'max-content',
          padding: '25px 32px 25px 32px',
          minWidth: { md: '645px' },
        }}
      >
        <img
          src={deleteIcon}
          alt="delete-icon"
          className="cursor-pointer absolute top-4 right-4"
          onClick={handleClose}
          height={20}
          width={20}
        />
        <DialogTitle 
          sx={{
            textAlign: 'center',
            p: 0,
            "&.MuiDialogTitle-root.MuiTypography-root": {
              fontSize: 24,
              fontWeight: "bold",
              color: '#1E1E1E',
            }
          }}
        >
          Thêm mới lịch sử chăm sóc khách hàng
        </DialogTitle>
        <Box>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Stack flexDirection={'row'} mt={3} width={'100%'}>
              <Box width={'50%'}>
                <TextFieldCustom
                  placeholder="Chọn thời gian"
                  label="Ngày gặp gỡ - trao đổi"
                  isRequired
                  name="meetingAt"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px',
                      height: '44px',
                      background: theme.palette.common.white,
                      color: theme.palette.primary.light,
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                    },
                  }}
                />
              </Box>
              <Box ml={2} width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập hình thức gặp gỡ"
                  label="Hình thức gặp gỡ"
                  isRequired
                  name="meetingForm"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
            </Stack>
            <Stack flexDirection={'row'} mt={2} width={'100%'}>
              <Box width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập tỉ lệ hài lòng"
                  label="Tỉ lệ hài lòng"
                  isRequired
                  max={100}
                  name="satisfactionRate"
                  control={control}
                  format="number"
                  errors={errors}
                  setError={setError}
                  endAdornment={'%'}
                />
              </Box>
              <Box ml={2} width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập tỉ lệ chốt deal"
                  label="Tỉ lệ chốt deal"
                  isRequired
                  name="purchaseRate"
                  control={control}
                  format="number"
                  errors={errors}
                  setError={setError}
                  endAdornment={'%'}
                  max={100}
                />
              </Box>
            </Stack>
            <Stack flexDirection={'row'} mt={2} width={'100%'}>
              <Box width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập thông tin trao đổi với KH"
                  label="Thông tin trao đổi"
                  isRequired
                  name="informationExchanged"
                  type="textarea2"
                  rows={2}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
              <Box ml={2} width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập nội dung feedback"
                  label="Feedback của khách hàng"
                  isRequired
                  name="feedback"
                  type="textarea2"
                  rows={2}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
            </Stack>
            <Stack flexDirection={'row'} mt={2} width={'100%'}>
              <Box width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập mô tả chân dung chi tiết KH..."
                  label="Chân dung khách hàng"
                  isRequired
                  name="description"
                  type="textarea2"
                  rows={2}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
              <Box ml={2} width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập kế hoạch - đề xuất..."
                  label="Kế hoạch - Đề xuất"
                  isRequired
                  name="proposedSolutions"
                  type="textarea2"
                  rows={2}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
            </Stack>
            <Stack flexDirection={'row'} mt={2} width={'100%'}>
              <Box width={'100%'}>
                <TextFieldCustom
                  label="Ghi chú"
                  name="note"
                  type="textarea2"
                  control={control}
                  errors={errors}
                  setError={setError}
                  rows={4}
                  placeholder={'Nhập nội dung ghi chú (nếu có)...'}
                />
              </Box>
            </Stack>

            <Box mt={4} style={{ textAlign: 'center' }}>
              <CustomButton
                title={'Đóng'}
                variant="outlined"
                handleClick={handleCancel || handleClose}
                sxProps={{ borderRadius: '8px', width: { md: '126px' } }}
              />
              <CustomButton
                typeButton={'submit'}
                title={actionName || t(translations.common.save)}
                sxProps={{
                  borderRadius: '8px',
                  width: { md: '126px' },
                  ml: '12px',
                }}
                handleClick={handleSubmit}
                light
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
}
