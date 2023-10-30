import { Box, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useSelector } from 'react-redux';
import { selectApartmentInformation } from '../../../slice/selectors';
import { RenderListCode } from '../../RenderListCode';

export const RenderContentCreateContract = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { apartmentInformation } = useSelector(layoutsSelector);
  const { tableProductInformation } = useSelector(selectApartmentInformation);

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
            Bạn có chắc chắn xác muốn tạo hợp đồng cho giao dịch sản phẩm{' '}
            <span style={{ fontWeight: 700 }}>
              {tableProductInformation?.code}
            </span>{' '}
            này không?
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
              {`Bạn có chắc chắn xác muốn tạo hợp đồng cho giao dịch ${
                apartmentInformation &&
                Array.isArray(apartmentInformation.apartmentId)
                  ? apartmentInformation.apartmentId.length
                  : ''
              } sản phẩm này không?`}
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
          title="Tạo hợp đồng"
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
