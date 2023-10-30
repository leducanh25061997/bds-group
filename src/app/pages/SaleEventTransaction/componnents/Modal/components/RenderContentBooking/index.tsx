import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { UpdateStatusTableProductParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useSelector, useDispatch } from 'react-redux';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { Product } from 'types/ProductTable';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useParams } from 'react-router';

export const RenderContentBooking = ({ onClose, product, salesProgramId }: { onClose: (v?: boolean) => void; product: Product; salesProgramId?: string }) => {
  const dispatch = useDispatch();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const params = useParams();
  const { id: saleId, projectId } = params;

  const handleConfirm = (id: string) => {
    const param: UpdateStatusTableProductParams = {
      ids: [id],
      status: 3,
      settingSalesProgramId: salesProgramId,
    };
    dispatch(
      apartmentInformationsAction.updateStatusTableProduct(
        param,
        (status?: any) => {
          if (status.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            onClose(true);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: status.message || 'Thay đổi thông tin không thành công',
                type: 'error',
              }),
            );
          }
        },
      ),
    );
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
        Bạn có chắc chắn xác nhận giao dịch sản phẩm{' '}
        <span style={{ fontWeight: 700 }}>{product?.code}</span>{' '}
        này không?
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
            width: 'max-content',
          }}
          sxPropsText={{ color: '#FFFFFF' }}
        />
      </Box>
    </Box>
  );
};
