import { Box, Divider, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { renderBackgroundColorTable } from 'utils/helpers';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useProfile } from 'app/hooks';
import { Product } from 'types/ProductTable';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';
import { SignProductParams } from 'types/Project';

const RenderKeyValue = (key: string, value: any) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        mt: 2,
        alignItems: 'start',
      }}
    >
      <Typography
        sx={{ color: '#FFFFFF', mr: 1, fontSize: '16px' }}
      >{`${key}: `}</Typography>
      {/* value can be Typography, should not use Typography inside Typography */}
      <Box sx={{ color: '#FFFFFF', fontSize: '14px' }}>{value}</Box>
    </Box>
  );
};

export const RenderContentRegister = ({
  onClose,
  product,
}: {
  onClose: (v?: boolean) => void;
  product: Product;
}) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();

  const userInfo = useProfile();

  const handleOpenRegister = (id: string, projectID: string) => {
    if (userInfo && userInfo.staffId) {
      const param: SignProductParams = {
        productId: id,
        projectId: projectID,
        staffId: userInfo.staffId,
      };
      dispatch(
        saleEventTransactionActions.signProduct(param, (status?: any) => {
          if (status.success) {
            onClose(true);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Đăng kí sản phẩm thành công',
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: status.message || 'Đăng kí sản phẩm không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn không có quyền đăng kí sản phẩm',
          type: 'error',
        }),
      );
    }
  };

  const onSubmit = (data: any) => {};

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              <Box sx={{ display: 'flex' }}>
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
                <Box
                  sx={{
                    color: '#1E1E1E',
                    background: '#FFFFFF',
                    borderRadius: '4px',
                    ml: 1,
                    padding: '0px 5px',
                  }}
                >
                  {Math.floor(product.project.projectSetting.registerTime / 60)}
                </Box>
                <Box sx={{ ml: 1 }}>{`:`}</Box>
                <Box
                  sx={{
                    color: '#1E1E1E',
                    background: '#FFFFFF',
                    borderRadius: '4px',
                    ml: 1,
                    padding: '0px 5px',
                  }}
                >
                  {Math.floor(product.project.projectSetting.registerTime % 60)}
                </Box>
                <Box sx={{ ml: 1 }}>{`:`}</Box>
                <Box
                  sx={{
                    color: '#1E1E1E',
                    background: '#FFFFFF',
                    borderRadius: '4px',
                    ml: 1,
                    padding: '0px 5px',
                  }}
                >{`00`}</Box>
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
                  <Typography>
                    {`${product?.builtUpArea} m`}
                    <sup>2</sup>
                  </Typography>,
                )}
                {RenderKeyValue(
                  'Diện tích thông thủy',
                  <Typography>
                    {`${product?.carpetArea || 0} vnđ/m`}
                    <sup>2</sup>
                  </Typography>,
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 2, background: '#475160', paddingLeft: '25px' }}>
              {RenderKeyValue(
                'Đơn giá (chưa VAT)',
                <Typography sx={{ fontSize: '14px' }}>
                  {`${product?.unitPrice || 0} vnđ/m`}
                  <sup>2</sup>
                </Typography>,
              )}
              {RenderKeyValue(
                'Đơn giá (VAT)',
                <Typography sx={{ fontSize: '14px' }}>
                  {`${product?.unitPriceVat || 0} vnđ/m`}
                  <sup>2</sup>
                </Typography>,
              )}
              {RenderKeyValue(
                'Tổng giá trị SP (VAT)',
                <Typography sx={{ fontSize: '14px' }}>
                  {`${product?.priceVat || 0} vnđ`}
                </Typography>,
              )}
            </Box>
          </Box>
        </Box>

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
            title="Đăng ký"
            handleClick={() =>
              handleOpenRegister(product.id, product.projectId)
            }
            sxProps={{
              background: '#D45B7A',
              borderRadius: '8px',
              width: '128px',
            }}
            sxPropsText={{ color: '#FFFFFF' }}
          />
        </Box>
      </Box>
    </form>
  );
};
