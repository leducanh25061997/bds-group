import { Box, Divider, Typography, Grid } from '@mui/material';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Province } from 'types/User';
import { TYPEIdentification, TypePayment } from 'types/Enum';
import documentService from 'services/api/document';
import { FilterParams } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import { formatCurrency, renderBackgroundColorTable } from 'utils/helpers';
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
import { CreateReservation } from 'app/pages/TransactionManagement/components/reservationManagement/create';
import CountdownTimer from 'app/pages/SaleEventTransaction/componnents/CountdownTimer';
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
        alignItems: 'end',
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

export const RenderContentEnterCustomerInformation = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { tableProductInformation, filterDatatable } = useSelector(selectApartmentInformation);
  const { apartmentInformation } = useSelector(layoutsSelector);
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const params = useParams();
  const { actions: saleEventTransactionAction } = useSaleEventTransactionSlice();
  const { actions: layoutActions } = useLayoutsSlice();
  const [time, setTime] = useState<number>(0);
  const [startCountDown, setSetCountDown] = useState<boolean>(false);

  useEffect(() => {
    if (
      tableProductInformation &&
      tableProductInformation.signUpAt &&
      tableProductInformation.project.projectSetting.registerTime
    ) {
      const date = new Date(tableProductInformation.signUpAt);
      const signUpTime = date.getTime();
      const currentTime = new Date().getTime();
      const REGISTER_TIME_DAYS_IN_MS =
        tableProductInformation.project.projectSetting.registerTime * 60 * 1000;
      const timer = currentTime - Number(signUpTime);
      if (currentTime - Number(signUpTime) <= REGISTER_TIME_DAYS_IN_MS) {
        setTime(currentTime + REGISTER_TIME_DAYS_IN_MS - timer);
        setSetCountDown(true);
      }
    }
  }, [tableProductInformation]);

  const handleCallbackData = (data: any) => {
    if (tableProductInformation?.id) {
      const formRequest = {
        productId: tableProductInformation.id,
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
              if (filterDatatable?.idProject) {
                dispatch(
                  apartmentInformationsAction.fetchDatatable(filterDatatable),
                );
              }
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
                  message: 'Đăng ký thông tin thành công',
                  type: 'success',
                }),
              );
              onClose();
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
      {apartmentInformation &&
        (typeof apartmentInformation.apartmentId === 'string' ? (
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '20px', color: '#D6465F' }}
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
              <Box sx={{ flex: 2, background: '#475160', paddingLeft: '25px' }}>
                {RenderKeyValue(
                  'Đơn giá (chưa VAT)',
                  <Typography sx={{ fontSize: '14px' }}>
                    {`${
                      formatCurrency(tableProductInformation?.unitPrice) || 0
                    } vnđ/m`}
                    <sup>2</sup>
                  </Typography>,
                )}
                {RenderKeyValue(
                  'Đơn giá (VAT)',
                  <Typography>
                    {`${
                      formatCurrency(tableProductInformation?.unitPriceVat) || 0
                    } vnđ/m`}
                    <sup>2</sup>
                  </Typography>,
                )}
                {RenderKeyValue(
                  'Tổng giá trị SP (VAT)',
                  <Typography sx={{ fontSize: '14px' }}>
                    {`${tableProductInformation?.priceVat || 0} vnđ`}
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
      {tableProductInformation && (
        <CreateReservation
          isPopup
          isTable
          projectId={tableProductInformation.projectId}
          handleCallbackData={handleCallbackData}
          onClose={onClose}
        />
      )}
    </Box>
  );
};
