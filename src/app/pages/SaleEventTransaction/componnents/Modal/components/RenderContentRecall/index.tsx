import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { Product } from 'types/ProductTable';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { MoveProductToSaleProgramParams, UpdateStatusTableProductParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useParams } from 'react-router';

export const RenderContentRecall = ({ onClose, product }: { onClose: (v?: boolean) => void; product: Product; }) => {
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const params = useParams();

  const handleRecal = (id: string) => {
    if (params.projectId) {
      const param: MoveProductToSaleProgramParams = {
        id: params.projectId,
        productIds: [id],
      };
      dispatch(
        apartmentInformationsAction.removeProductToSaleProgram(
          param,
          (err?: any) => {
            if (err.success) {
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
                  message: 'Thay đổi thông tin không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      )
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
        Bạn có chắc chắn muốn thu hồi sản phẩm{' '}
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
          title="Thu hồi"
          handleClick={() => handleRecal(product.id)}
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
