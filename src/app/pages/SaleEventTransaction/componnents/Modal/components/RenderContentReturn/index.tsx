import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { StatusProductEnum } from 'types/Enum';
import { Product } from 'types/ProductTable';
import { UpdateStatusTableProductParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { useProfile } from 'app/hooks';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';
import { SignProductParams } from 'types/Project';

export const RenderContentReturn = ({
  onClose,
  product,
}: {
  onClose: (v?: boolean) => void;
  product: Product;
}) => {
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: saleEventTransactionActions } = useSaleEventTransactionSlice();
  const userInfo = useProfile();

  const handleReturn = (id: string) => {
    if (userInfo && userInfo.staffId) {
      const param: SignProductParams = {
        productId: id,
        staffId: userInfo.staffId,
      };
      dispatch(
        saleEventTransactionActions.returnProduct(
          param,
          (status?: any) => {
            if (status.success) {
              onClose(true);
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Trả sản phẩm thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: status.message || 'Trả sản phẩm không thành công',
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
        Bạn có chắc chắn trả sản phẩm{' '}
        <span style={{ fontWeight: 700 }}>{product?.code}</span> này về rổ hàng
        không?
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
          title="Trả về"
          handleClick={() => handleReturn(product.id)}
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
