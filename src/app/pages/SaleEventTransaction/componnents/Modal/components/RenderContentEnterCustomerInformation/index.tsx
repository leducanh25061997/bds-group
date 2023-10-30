import { Box, Divider, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { TypePayment } from 'types/Enum';
import { useDispatch } from 'react-redux';
import { formatCurrency, renderBackgroundColorTable } from 'utils/helpers';
import { Product } from 'types/ProductTable';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { CreateReservation } from 'app/pages/TransactionManagement/components/reservationManagement/create';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';
import CountdownTimer from 'app/pages/SaleEventTransaction/componnents/CountdownTimer';

const RenderKeyValue = (key: string, value: any) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        mt: 1,
        alignItems: 'end',
      }}
    >
      <Typography sx={{ color: '#FFFFFF', mr: 1, fontSize: '14px', mb: '2px' }}>
        {`${key}: `}
      </Typography>
      {value}
    </Box>
  );
};

export const RenderContentEnterCustomerInformation = ({
  onClose,
  product,
}: {
  onClose: (v?: boolean) => void;
  product: Product;
}) => {
  console.log(product, 'product');
  const dispatch = useDispatch();
  const { actions: saleEventTransactionAction } =
    useSaleEventTransactionSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const [startCountDown, setSetCountDown] = useState<boolean>(false);

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (product.signUpAt && product.project.projectSetting.registerTime) {
      const date = new Date(product.signUpAt);
      const signUpTime = date.getTime();
      const currentTime = new Date().getTime();
      const REGISTER_TIME_DAYS_IN_MS =
        product.project.projectSetting.registerTime * 60 * 1000;
      const timer = currentTime - Number(signUpTime);
      if (currentTime - Number(signUpTime) <= REGISTER_TIME_DAYS_IN_MS) {
        setTime(currentTime + REGISTER_TIME_DAYS_IN_MS - timer);
        setSetCountDown(true);
      }
      // setTime()
    }
  }, [product]);

  const handleCallbackData = (data: any) => {
    if (product.id) {
      const formRequest = {
        productId: product.id,
        staffId: data.staffId,
        ticketReservateId: data.ticketId,
        payments: TypePayment.TRANSFER,
        taxCode: data.tax,
        bank: data.bank,
        accountNumber: data.accountNumber,
        files: data.files,
        customers: data.listCustomers,
      };
      dispatch(
        saleEventTransactionAction.creteProductCustomer(
          formRequest,
          (status?: any) => {
            if (status.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Đăng ký thông tin thành công',
                  type: 'success',
                }),
              );
              onClose(true);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Đăng ký thông tin không thành công',
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
    <Box sx={{ margin: '0 16px 16px 16px' }}>
      <Box>
        <Typography
          sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '20px' }}
        >
          Thông tin sản phẩm
        </Typography>
        <Box
          sx={{
            color: '#FFFFFF',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            mt: 2,
          }}
        >
          <Box
            sx={{
              flex: 3,
              background: '#636B78',
              display: 'flex',
              flexDirection: 'column',
              padding: '21px 25px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '24px',
                  height: '20px',
                  background: renderBackgroundColorTable(product?.status),
                  borderRadius: '2px',
                }}
              ></Box>
              <Box
                sx={{
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '20px',
                  ml: 1,
                }}
              >
                {product?.code}
              </Box>
              <Box
                sx={{
                  background: '#A8ADB4',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  padding: '2px 11px',
                  ml: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '11px',
                    lineHeight: '20px',
                    color: '#FFEB99',
                  }}
                >
                  {product?.status}
                </Typography>
              </Box>
              <CountdownTimer
                targetDate={time}
                onClose={onClose}
                startCountDown={startCountDown}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                mt: 2,
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              <Box>{product?.block}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                  background: '#FFFFFF',
                  margin: '2px 16px',
                  width: '2px',
                }}
              />
              <Box>{`Tầng ${product?.floor}`}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                  background: '#FFFFFF',
                  margin: '2px 16px',
                  width: '2px',
                }}
              />
              <Box>{`${product?.bedRoom} PN`}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                  background: '#FFFFFF',
                  margin: '2px 16px',
                  width: '2px',
                }}
              />
              <Box>{product?.direction}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                  background: '#FFFFFF',
                  margin: '2px 16px',
                  width: '2px',
                }}
              />
              <Box>{product?.subcription}</Box>
            </Box>
            <Box>
              {RenderKeyValue(
                'Diện tích tim tường',
                <Typography sx={{ fontWeight: '700' }}>
                  {`${product?.builtUpArea} m`}
                  <sup>2</sup>
                </Typography>,
              )}
              {RenderKeyValue(
                'Diện tích thông thủy',
                <Typography sx={{ fontWeight: '700' }}>
                  {`${product?.carpetArea || 0} m`}
                  <sup>2</sup>
                </Typography>,
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 2,
              background: '#475160',
              paddingLeft: '16px',
              minWidth: '280px',
            }}
          >
            <Box sx={{ height: 48 }}></Box>
            {RenderKeyValue(
              'Đơn giá (chưa VAT)',
              <Typography sx={{ fontWeight: '700' }}>
                {`${formatCurrency(product?.unitPrice) || 0} vnđ/m`}
                <sup>2</sup>
              </Typography>,
            )}
            {RenderKeyValue(
              'Đơn giá (VAT)',
              product?.unitPriceVat ? (
                <Typography sx={{ fontWeight: '700' }}>
                  {`${formatCurrency(product?.unitPriceVat)} vnđ/m`}
                  <sup>2</sup>
                </Typography>
              ) : (
                <Typography>{`-`}</Typography>
              ),
            )}
            {RenderKeyValue(
              'Tổng giá trị SP (VAT)',
              product?.priceVat ? (
                <Typography sx={{ fontWeight: '700' }}>
                  {`${formatCurrency(product?.priceVat)} vnđ`}
                </Typography>
              ) : (
                <Typography>{`-`}</Typography>
              ),
            )}
          </Box>
        </Box>
      </Box>

      <CreateReservation
        isPopup
        projectId={product.projectId}
        handleCallbackData={handleCallbackData}
      />
    </Box>
  );
};
