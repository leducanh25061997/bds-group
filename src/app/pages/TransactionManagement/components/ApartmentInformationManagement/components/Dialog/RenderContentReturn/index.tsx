import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { selectApartmentInformation } from '../../../slice/selectors';
import { RenderListCode } from '../../RenderListCode';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateStatusTableProductParams, ApartmentInformationSParams } from '../../../slice/types';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useApartmentInformationsSlice } from '../../../slice';
import { StatusProductEnum } from "types/Enum";
import { SignProductParams } from 'types/Project';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';
import { useProfile } from 'app/hooks';

export const RenderContentReturn = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const { apartmentInformation } = useSelector(layoutsSelector);
  const { tableProductInformation, filterDatatable } = useSelector(selectApartmentInformation);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: saleEventTransactionActions } = useSaleEventTransactionSlice();
  const userInfo = useProfile();
  const { actions: apartmentInformationsAction } = useApartmentInformationsSlice();

  const handleReturn = (id?: string) => {
    if (userInfo && userInfo.staffId && id) {
      const param: SignProductParams = {
        productId: id,
        staffId: userInfo.staffId,
      };

      dispatch(
        saleEventTransactionActions.returnProduct(
          param,
          (status?: any) => {
            if (status.success) {
              if (filterDatatable?.idProject) {
                dispatch(apartmentInformationsAction.fetchDatatable(filterDatatable));
              }
              onClose();
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
  }

  return (
    <Box mb={2}>
      {apartmentInformation &&
        (typeof apartmentInformation.apartmentId === 'string' ? (
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
            <span style={{ fontWeight: 700 }}>
              {tableProductInformation?.code}
            </span>{' '}
            này về rổ hàng không?
          </Typography>
        ) : (
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
              }}
            >
              {`Bạn có chắc chắn trả ${
                apartmentInformation &&
                Array.isArray(apartmentInformation.apartmentId)
                  ? apartmentInformation.apartmentId.length
                  : ''
              } này về rổ hàng không?`}
            </Typography>
            <RenderListCode />
          </Box>
        ))}
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
          handleClick={() => tableProductInformation && handleReturn(tableProductInformation.id)}
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
