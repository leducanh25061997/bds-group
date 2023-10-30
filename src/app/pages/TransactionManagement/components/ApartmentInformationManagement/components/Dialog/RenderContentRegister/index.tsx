import { Box, Divider, Typography, Grid } from '@mui/material';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Province } from 'types/User';
import { TYPEIdentification } from 'types/Enum';
import documentService from 'services/api/document';
import { FilterParams } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import { renderBackgroundColorTable, formatCurrency } from 'utils/helpers';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { RenderListCode } from '../../RenderListCode';
import { useParams } from 'react-router';
import { StatusProductEnum } from 'types/Enum';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useApartmentInformationsSlice } from '../../../slice';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import {
  ApartmentInformationSParams,
  UpdateStatusTableProductParams,
} from '../../../slice/types';
import { useProfile } from 'app/hooks';
import { SignProductParams } from 'types/Project';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';

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
      <Typography sx={{ color: '#FFFFFF', fontSize: '14px' }}>
        {value}
      </Typography>
    </Box>
  );
};

export const RenderContentRegister = ({ onClose }: { onClose: () => void }) => {
  const methods = useForm();
  const { tableProductInformation, filterDatatable } = useSelector(
    selectApartmentInformation,
  );
  const { apartmentInformation } = useSelector(layoutsSelector);
  const dispatch = useDispatch();
  const { actions: layoutActions } = useLayoutsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const params = useParams();
  const { id } = params;
  const userInfo = useProfile();

  const handleOpenRegister = (idUpdate: any) => {
    if (userInfo && userInfo.staffId) {
      if (tableProductInformation?.id && tableProductInformation?.projectId) {
        const param: SignProductParams = {
          productId: tableProductInformation.id,
          projectId: tableProductInformation.projectId,
          staffId: userInfo.staffId,
        };
        dispatch(
          saleEventTransactionActions.signProduct(param, (status?: any) => {
            if (status.success) {
              if (filterDatatable?.idProject) {
                dispatch(
                  apartmentInformationsAction.fetchDatatable(filterDatatable),
                );
              }
              onClose();
              dispatch(layoutActions.handleShowBunble(false));
              dispatch(
                layoutActions.showRightBar({
                  isShowRightBar: false,
                  apartmentId: '',
                  status: '',
                }),
              );
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Đăng kí sản phẩm thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    status.message || 'Đăng kí sản phẩm không thành công',
                  type: 'error',
                }),
              );
            }
          }),
        );
      }
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
        {apartmentInformation &&
          (typeof apartmentInformation.apartmentId === 'string' &&
          tableProductInformation ? (
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
                        background: renderBackgroundColorTable(
                          tableProductInformation?.status,
                        ),
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
                      {tableProductInformation?.code}
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
                        {tableProductInformation?.status}
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
                      {Math.floor(
                        tableProductInformation?.project?.projectSetting
                          ?.registerTime / 60,
                      )}
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
                      {Math.floor(
                        tableProductInformation?.project?.projectSetting
                          ?.registerTime % 60,
                      )}
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
                    <Box>{tableProductInformation?.block}</Box>
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
                    <Box>{`Tầng ${tableProductInformation?.floor}`}</Box>
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
                    <Box>{`${tableProductInformation?.bedRoom} PN`}</Box>
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
                    <Box>{tableProductInformation?.direction}</Box>
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
                    <Box>{tableProductInformation?.subcription}</Box>
                  </Box>
                  <Box>
                    {RenderKeyValue(
                      'Diện tích tim tường',
                      <Typography>
                        {`${tableProductInformation?.builtUpArea} m`}
                        <sup>2</sup>
                      </Typography>,
                    )}
                    {RenderKeyValue(
                      'Diện tích thông thủy',
                      <Typography>
                        {`${tableProductInformation?.carpetArea || 0} m`}
                        <sup>2</sup>
                      </Typography>,
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{ flex: 2, background: '#475160', paddingLeft: '25px' }}
                >
                  {RenderKeyValue(
                    'Đơn giá (chưa VAT)',
                    <Typography sx={{ fontSize: '14px' }}>
                      {`${
                        formatCurrency(tableProductInformation?.unitPrice) ||
                        0
                      } vnđ/m`}
                      <sup>2</sup>
                    </Typography>,
                  )}
                  {RenderKeyValue(
                    'Đơn giá (VAT)',
                    <Typography sx={{ fontSize: '14px' }}>
                      {`${
                        formatCurrency(tableProductInformation?.unitPriceVat) || 0
                      } vnđ/m`}
                      <sup>2</sup>
                    </Typography>,
                  )}
                  {RenderKeyValue(
                    'Tổng giá trị SP (VAT)',
                    <Typography sx={{ fontSize: '14px' }}>
                      {`${
                        formatCurrency(tableProductInformation?.priceVat) || 0
                      } vnđ`}
                    </Typography>,
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '20px' }}
              >
                Thông tin sản phẩm
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
            title="Đăng ký"
            handleClick={() => {
              if (apartmentInformation?.apartmentId) {
                handleOpenRegister(apartmentInformation.apartmentId);
              }
            }}
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
