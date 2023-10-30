import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { StatusProductEnum, CustomerProductStatusEnum } from 'types/Enum';
import { Product } from 'types/ProductTable';
import { UpdateStatusProductCustomerParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';

export const RenderContentConfirmSignUp = ({
  onClose,
  product,
}: {
  onClose: (v?: boolean) => void;
  product: Product;
}) => {
  const dispatch = useDispatch();
  const { actions: layoutActions } = useLayoutsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();

  const handleConfirm = (id: string) => {
    if (product.customerProduct.id) {
      const param: UpdateStatusProductCustomerParams = {
        id: product.customerProduct.id,
        status: CustomerProductStatusEnum.ACCEPT,
      };
      dispatch(
        apartmentInformationsAction.updateStatusProductCustomer(
          param,
          (status?: any) => {
            if (status.success) {
              onClose(true);
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Xác nhận thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: status.message || 'Xác nhận không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
  };

  return (
    <Box mb={2}>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          textAlign: 'center',
          padding: '0 48px',
        }}
      >
        Bạn có chắc chắn xác nhận sản phẩm{' '}
        <span style={{ fontWeight: 700 }}>{product?.code}</span> này không?
      </Typography>
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <CustomButton
          title="Hủy"
          handleClick={() => onClose()}
          sxProps={{
            background: '#FFFFFF',
            border: '1px solid #D6465F',
            borderRadius: '8px',
            width: '128px',
            marginRight: '42px',
          }}
          sxPropsText={{ color: '#1E1E1E' }}
        />
        <CustomButton
          title="Xác nhận"
          handleClick={() => handleConfirm(product.id)}
          sxProps={{
            background: '#D45B7A',
            borderRadius: '8px',
            width: '128px',
          }}
          sxPropsText={{ color: '#FFFFFF' }}
        />
      </Box>
    </Box>
  );
};
