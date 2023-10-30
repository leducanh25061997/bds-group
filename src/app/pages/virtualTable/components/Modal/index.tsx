import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Product, ProductTableParams } from 'types/ProductTable';
import { useForm } from 'react-hook-form';
import { ControlledSelectColor } from '../ControlledSelectColor';
import { StatusProductCorlorEnum, StatusProductEnum } from 'types/Enum';
import { renderBackgroundColorTable } from 'utils/helpers';
import CustomButton from 'app/components/Button';
import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useVirtualTableSlice } from '../../slice/index';
import { UpdateVirtualStatusParams } from 'app/pages/virtualTable/slice/types';
import { useParams } from 'react-router';
export interface SimpleDialogProps {
  open: boolean;
  onClose: (v?: boolean) => void;
  product: Product | Product[];
}

const colors = [
  {
    color: StatusProductCorlorEnum.OPEN,
    name: StatusProductEnum.OPEN,
    value: 2,
  },
  {
    color: StatusProductCorlorEnum.BOOKING,
    name: StatusProductEnum.BOOKING,
    value: 3,
  },
  {
    color: StatusProductCorlorEnum.WAIT_FILE,
    name: StatusProductEnum.WAIT_FILE,
    value: 4,
  },
  {
    color: StatusProductCorlorEnum.SOLD_OUT,
    name: StatusProductEnum.SOLD_OUT,
    value: 5,
  },
  {
    color: StatusProductCorlorEnum.SIGN_UP,
    name: StatusProductEnum.SIGN_UP,
    value: 6,
  },
];

export function Modal(props: SimpleDialogProps) {
  const { onClose, open, product } = props;
  const methods = useForm();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: virtualTableActions } = useVirtualTableSlice();
  const params = useParams();
  const { id, projectId } = params;

  const handleClose = () => {
    onClose();
  };

  const getValueStatus = (name: StatusProductEnum) => {
    const data = colors.filter(item => item.name === name);
    if (data.length > 0) {
      return data[0].value;
    }
  };

  const onSubmit = (data: any) => {
    const keyStatus = getValueStatus(data.status);
    if (keyStatus && product) {
      let productIds = [];
      if (!Array.isArray(product)) {
        productIds = [product.id];
      } else {
        productIds = product.map(item => item.id);
      }
      const params: UpdateVirtualStatusParams = {
        status: keyStatus,
        ids: productIds,
      };
      dispatch(
        virtualTableActions.updateVirtualStatus(params, (status?: any) => {
          if (status.success) {
            onClose(true);
            if (id && projectId) {
              const params: ProductTableParams = {
                idProject: projectId,
                isPriority: false,
                saleId: id,
                isVirtual: true,
              };
              dispatch(virtualTableActions.fetchDatatable(params));
              dispatch(virtualTableActions.fetchSettingTableProduct(params));
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xác nhận giao dịch thành công',
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  status.message || 'Xác nhận giao dịch không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '29px',
          color: '#1E1E1E',
        }}
      >
        {`Đổi trạng thái sản phẩm`}
      </DialogTitle>
      <Box
        sx={{
          position: 'absolute',
          right: '16px',
          top: '10px',
          cursor: 'pointer',
        }}
      >
        <Icon
          icon="mdi:remove"
          color="#d9d9d9"
          width="18"
          height="28"
          onClick={handleClose}
        />
      </Box>
      <DialogContent sx={{ padding: '0px 24px 10px 24px' }}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {Array.isArray(product) ? (
            <Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  padding: '0 48px',
                }}
              >
                Có <span style={{ color: '#D45B7A' }}>{product.length}</span>{' '}
                sản phẩm được chọn.
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  padding: '0 48px',
                }}
              >
                Vui lòng chọn trạng thái sản phẩm bạn muốn đổi để hiển thị trên
                bảng hàng ảo.
              </Typography>
              <Box
                mt={2}
                sx={{
                  background: '#555E6C',
                  borderRadius: '8px',
                  padding: '14px',
                  maxHeight: '250px',
                  overflowY: 'scroll',
                }}
              >
                {product.map((item: Product, index: number) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: index > 0 ? 1 : 0,

                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          background: renderBackgroundColorTable(
                            item.virtualStatus,
                          ),
                          borderRadius: '4px',
                          width: '16px',
                          height: '16px',
                          mr: 2,
                        }}
                      ></Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#FFF',
                        }}
                      >
                        {item?.code}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#FFF',
                        }}
                      >
                        {item?.virtualStatus}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  padding: '0 48px',
                }}
              >
                Vui lòng chọn trạng thái sản phẩm bạn muốn đổi để hiển thị trên
                bảng hàng ảo
              </Typography>
              <Box
                mt={2}
                sx={{
                  background: '#555E6C',
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      background: renderBackgroundColorTable(
                        product.virtualStatus,
                      ),
                      borderRadius: '2px',
                      width: '16px',
                      height: '16px',
                      mr: 2,
                    }}
                  ></Box>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: '16px', color: '#FFF' }}
                  >
                    {product?.code}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: '#FFF',
                    display: 'flex',
                    flexDirection: 'row',
                    mt: 1,
                    fontWeight: 600,
                  }}
                >
                  <Box>Trạng thái hiện tại:</Box>
                  <Box ml={2}>{product.virtualStatus}</Box>
                </Box>
              </Box>
            </Box>
          )}
          <Box mt={1}>
            <ControlledSelectColor
              placeholder="Chọn trạng thái sản phẩm đổi"
              label="Trạng thái sản phẩm đổi"
              control={methods.control}
              name="status"
              options={colors || []}
            />
          </Box>
          <Box mt={3} mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomButton
              title="Hủy"
              handleClick={() => onClose()}
              sxProps={{
                background: '#FFFFFF',
                border: '1px solid #D6465F',
                borderRadius: '8px',
                width: '148px',
                marginRight: '32px',
              }}
              sxPropsText={{ color: '#1E1E1E' }}
            />
            <CustomButton
              title="Đổi trạng thái"
              typeButton="submit"
              sxProps={{
                background: '#D45B7A',
                borderRadius: '8px',
                width: '148px',
              }}
              sxPropsText={{ color: '#FFFFFF' }}
            />
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
