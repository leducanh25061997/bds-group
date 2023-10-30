import { Drawer, Box, Typography, Divider, Grid } from '@mui/material';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';

import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import {
  checkPermissionExist,
  formatCurrency,
  renderBackgroundColorTable,
} from 'utils/helpers';
import {
  DialogProtype,
  StatusProductEnum,
  CustomerProductStatusEnum,
  ApplicableStatus,
} from 'types/Enum';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { SimpleDialog } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/components/Dialog';
import {
  ApartmentInformationSParams,
  SubDataProtype,
  TableProductInformation,
  UpdateStatusTableProductParams,
} from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useParams } from 'react-router';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';

import { Product } from 'types/ProductTable';
import CustomButton from '../Button';
import { TicketApprove } from '../../../types/ProductTable';
import { EllipsisText } from '../EllipsisText/index';
import { selectSaleEventControl } from 'app/pages/SaleEventControl/slice/selector';
import { useSaleEventControlSlice } from 'app/pages/SaleEventControl/slice';
import { CompleteProfileForm } from 'app/pages/SaleEventTransaction/slice/types';
import { useSaleEventTransactionSlice } from 'app/pages/SaleEventTransaction/slice';

export const RightBar = () => {
  const { apartmentInformation } = useSelector(layoutsSelector);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { tableProductInformation, filterDatatable } = useSelector(
    selectApartmentInformation,
  );
  const params = useParams();
  const { id: idParam } = params;
  const [typeDialog, setTypeDialog] = React.useState<DialogProtype>();
  const [dataMultipleSelect, setDataMultipleSelect] = React.useState<
    SubDataProtype[]
  >([]);
  const userInfo = useProfile();
  const [isShowPriority, setIsShowPriority] = useState<boolean>(false);
  const { permission, eventSale } = useSelector(selectSaleEventControl);
  const { actions: saleEventControlActions } = useSaleEventControlSlice();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const isApartment = tableProductInformation?.type === 'Căn hộ';

  useEffect(() => {
    if (tableProductInformation) {
      if (
        tableProductInformation.status === StatusProductEnum.SIGN_UP ||
        tableProductInformation.status === StatusProductEnum.WAIT_FILE ||
        tableProductInformation.status === StatusProductEnum.BOOKING
      ) {
        setIsShowPriority(false);
      } else {
        setIsShowPriority(true);
      }
    }
  }, [tableProductInformation]);

  useEffect(() => {
    if (filterDatatable?.saleId) {
      dispatch(
        saleEventControlActions.fetchEventSalesInfo({
          id: filterDatatable?.saleId,
        }),
      );
    }
  }, [filterDatatable]);

  useEffect(() => {
    if (apartmentInformation) {
      if (
        apartmentInformation?.apartmentId &&
        typeof apartmentInformation?.apartmentId === 'string'
      ) {
        dispatch(
          apartmentInformationsAction.fetchTableProductInformation(
            apartmentInformation?.apartmentId,
          ),
        );
      } else {
        if (Array.isArray(apartmentInformation?.apartmentId)) {
          setDataMultipleSelect(apartmentInformation?.apartmentId);
        }
      }
    }
  }, [apartmentInformation]);

  const onCloseSidebar = () => {
    setOpen(false);
    // dispatch(
    //   apartmentInformationsAction.handleClearDataTableProductInformation(),
    // );

    dispatch(
      actions.handleShowBunble(
        typeof apartmentInformation?.apartmentId !== 'string',
      ),
    );
    dispatch(
      actions.showRightBar({
        isShowRightBar: false,
        status: apartmentInformation?.status,
        apartmentId:
          typeof apartmentInformation?.apartmentId === 'string'
            ? ''
            : dataMultipleSelect,
      }),
    );
  };

  const handleClickOpen = (value: DialogProtype) => {
    setTypeDialog(value);
    setOpen(true);
  };

  const handleRemove = (id: string) => {
    const _dataMultipleSelect: SubDataProtype[] = dataMultipleSelect.filter(
      item => item.id !== id,
    );
    setDataMultipleSelect(_dataMultipleSelect);
    dispatch(
      actions.showRightBar({
        ...apartmentInformation,
        apartmentId: _dataMultipleSelect,
      }),
    );
  };

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
          sx={{ color: '#A8ADB4', mr: 1, minWidth: 'max-content' }}
        >{`${key}: `}</Typography>
        <EllipsisText
          text={value}
          color={'#FFFFFF'}
          line={1}
          fontWeight={600}
        />
        {/* <Typography sx={{ color: '#FFFFFF' }}>{value}</Typography> */}
      </Box>
    );
  };

  const handleCompleteProfile = (id: string, eventSaleId: string) => {
    const param: CompleteProfileForm = {
      id: eventSaleId,
      productId: id,
    };
    dispatch(
      saleEventTransactionActions.completeProfile(param, (status?: any) => {
        if (status.success) {
          if (filterDatatable?.idProject) {
            dispatch(
              apartmentInformationsAction.fetchDatatable(filterDatatable),
            );
          }
          onCloseSidebar();
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi thông tin thành công',
              type: 'success',
            }),
          );
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: status.message || 'Thay đổi thông tin không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleAddProfile = (id: any) => {
    const ids: string[] =
      typeof id === 'string' ? [] : id.map((item: any) => item.id);
    if (typeof id === 'string') {
      ids.push(id);
    }
    const param: UpdateStatusTableProductParams = {
      ids: ids,
      status: 4,
      settingSalesProgramId: filterDatatable?.saleId || '',
      projectId: filterDatatable?.idProject || '',
    };
    dispatch(
      apartmentInformationsAction.updateStatusTableProduct(
        param,
        (status?: any) => {
          if (status.success) {
            if (filterDatatable?.idProject) {
              dispatch(
                apartmentInformationsAction.fetchDatatable(filterDatatable),
              );
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: status.message || 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            onCloseSidebar;
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
    );
  };

  const renderButtonSignUp = (product: TableProductInformation) => {
    if (product?.customerProduct) {
      if (product?.customerProduct.status === CustomerProductStatusEnum.NONE) {
        return (
          <>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_REQUEST,
              userInfo,
            ) && (
              <CustomButton
                title="Gửi yêu cầu"
                handleClick={() => handleClickOpen(DialogProtype.SEND_REQUIRE)}
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  border: '1px solid #31DAFF',
                  background: '#7CE7FF',
                  marginRight: '5px',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            )}
          </>
        );
      }
      if (
        product.customerProduct.status === CustomerProductStatusEnum.REQUEST
      ) {
        return (
          <>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_CONFIRM,
              userInfo,
            ) &&
              permission?.salesUnit.isManager && (
                <CustomButton
                  title="Đơn vị bán hàng xác nhận"
                  handleClick={() =>
                    handleClickOpen(DialogProtype.CONFIRM_SIGN_UP)
                  }
                  sxProps={{
                    borderRadius: '4px',
                    width: 'max-content',
                    border: '1px solid #31DAFF',
                    background: '#7CE7FF',
                    marginRight: '5px',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              )}
          </>
        );
      }
    } else {
      return (
        <>
          {checkPermissionExist(
            PermissionKeyEnum.EVENT_SALES_INFOR_CUSTOMER,
            userInfo,
          ) && (
            <CustomButton
              title="Nhập TTKH"
              handleClick={() =>
                handleClickOpen(DialogProtype.ENTER_CUSTOMER_INFORMATION)
              }
              sxProps={{
                borderRadius: '4px',
                width: '100%',
                background: '#54E0FF',
              }}
              sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
            />
          )}
        </>
      );
    }
  };

  const RenderButton = (status: StatusProductEnum) => {
    switch (status) {
      case StatusProductEnum.SIGN_UP:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {tableProductInformation &&
                renderButtonSignUp(tableProductInformation)}
              {/* <CustomButton
                title="Nhập TTKH"
                handleClick={() =>
                  handleClickOpen(DialogProtype.ENTER_CUSTOMER_INFORMATION)
                }
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#54E0FF',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              /> */}
            </Grid>
            {!(
              tableProductInformation?.customerProduct?.status ===
              CustomerProductStatusEnum.REQUEST
            ) && (
              <>
                {checkPermissionExist(
                  PermissionKeyEnum.EVENT_SALES_RETURN,
                  userInfo,
                ) && (
                  <Grid item xs={6}>
                    <CustomButton
                      title="Trả về"
                      handleClick={() => handleClickOpen(DialogProtype.RETURN)}
                      sxProps={{
                        borderRadius: '4px',
                        width: '100%',
                        background: '#EEDA89',
                      }}
                      sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        );
      case StatusProductEnum.LOCK:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomButton
                title="Mở khóa"
                handleClick={() => handleClickOpen(DialogProtype.UN_LOCK)}
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#636B78',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            </Grid>
          </Grid>
        );
      case StatusProductEnum.WAIT_FILE:
        return (
          <Grid container spacing={2}>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_COMPLETED,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Hoàn tất HS"
                  handleClick={() => {
                    if (tableProductInformation && eventSale) {
                      handleCompleteProfile(
                        tableProductInformation.id,
                        eventSale?.id,
                      );
                    }
                  }}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#FF595C',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <CustomButton
                title="Ghi chú"
                handleClick={() =>
                  handleClickOpen(DialogProtype.TRANSACTION_NOTES)
                }
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#2B3748',
                  border: '1px solid #A8ADB4',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            </Grid>
          </Grid>
        );
      case StatusProductEnum.WARE_HOUSE:
        return (
          <Grid container spacing={2}>
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_MOVE, userInfo) && (
              <Grid item xs={12}>
                <CustomButton
                  title="Chuyển SP"
                  handleClick={() =>
                    handleClickOpen(
                      DialogProtype.TRANSFER_PRODUCT_TO_SALE_PROGRAM,
                    )
                  }
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#0062CC',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
          </Grid>
        );
      case StatusProductEnum.BOOKING:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomButton
                title="Ghi chú"
                handleClick={() =>
                  handleClickOpen(DialogProtype.TRANSACTION_NOTES)
                }
                sxProps={{
                  borderRadius: '4px',
                  border: '1px solid #A8ADB4',
                  background: '#2B3748',
                  width: '100%',
                }}
                sxPropsText={{ fontSize: '14px', color: '#FFF' }}
              />
            </Grid>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_ADD_PROFILE,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="BSHS"
                  handleClick={() => {
                    if (
                      apartmentInformation &&
                      apartmentInformation.apartmentId
                    ) {
                      handleAddProfile(apartmentInformation.apartmentId);
                    }
                  }}
                  isDisable={
                    !(
                      tableProductInformation?.customerProduct?.tiket
                        ?.status === ApplicableStatus.APPROVED_DEPOSIT ||
                      tableProductInformation?.customerProduct?.tiket
                        ?.status === ApplicableStatus.APPROVED_TICKET
                    )
                      ? true
                      : false
                  }
                  sxProps={{
                    borderRadius: '4px',
                    border: '1px solid #FF7A00',
                    background: '#FFB168',
                    width: '100%',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              </Grid>
            )}
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_COMPLETED,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Hoàn tất HS"
                  handleClick={() => {
                    if (tableProductInformation && eventSale) {
                      handleCompleteProfile(
                        tableProductInformation.id,
                        eventSale?.id,
                      );
                    }
                  }}
                  isDisable={
                    !(
                      tableProductInformation?.customerProduct?.tiket
                        ?.status === ApplicableStatus.APPROVED_DEPOSIT ||
                      tableProductInformation?.customerProduct?.tiket
                        ?.status === ApplicableStatus.APPROVED_TICKET
                    )
                      ? true
                      : false
                  }
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    border: '1px solid #E42B2C',
                    background: '#FFBBBD',
                    color: '#1E1E1E',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              </Grid>
            )}
            {/* <Grid item xs={12}>
              <CustomButton
                title="Đơn vị bán hàng xác nhận"
                handleClick={() => handleClickOpen(DialogProtype.BOOKING)}
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#54E0FF',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            </Grid> */}
          </Grid>
        );
      case StatusProductEnum.SOLD_OUT:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomButton
                title="Tạo hợp đồng"
                handleClick={() =>
                  handleClickOpen(DialogProtype.CREATE_CONTRACT)
                }
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#F7ACD5',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomButton
                title="Ghi chú"
                handleClick={() =>
                  handleClickOpen(DialogProtype.TRANSACTION_NOTES)
                }
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#2B3748',
                  border: '1px solid #A8ADB4',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            </Grid>
          </Grid>
        );
      case StatusProductEnum.OPEN:
        return (
          <Grid container spacing={2}>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_REGISTER,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Đăng ký SP"
                  handleClick={() => handleClickOpen(DialogProtype.REGISTER)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#D687F2',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}

            {checkPermissionExist(PermissionKeyEnum.PRODUCT_MOVE, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Chuyển SP"
                  handleClick={() => handleClickOpen(DialogProtype.TRANFER)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#0062CC',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_REGAIN_PRODUCT,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Thu hồi"
                  handleClick={() => handleClickOpen(DialogProtype.RECALL)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#636B78',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_LOCK, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Khoá"
                  handleClick={() => handleClickOpen(DialogProtype.LOCK_UP)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#A8ADB4',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
          </Grid>
        );
      case StatusProductEnum.CLOSE:
        return (
          <Grid container spacing={2}>
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_SALE, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Mở bán"
                  handleClick={() => handleClickOpen(DialogProtype.OPEN_SELL)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#EEDA89',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              </Grid>
            )}
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_REGAIN_PRODUCT,
              userInfo,
            ) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Thu hồi"
                  handleClick={() => handleClickOpen(DialogProtype.RECALL)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#636B78',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_LOCK, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Khoá"
                  handleClick={() => handleClickOpen(DialogProtype.LOCK_UP)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#A8ADB4',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_MOVE, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Chuyển SP"
                  handleClick={() => handleClickOpen(DialogProtype.TRANFER)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#0062CC',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
          </Grid>
        );
      default:
        return (
          <Grid container spacing={2}>
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_SALE, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Mở bán"
                  handleClick={() => handleClickOpen(DialogProtype.OPEN_SELL)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#EEDA89',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              </Grid>
            )}
            {checkPermissionExist(PermissionKeyEnum.PRODUCT_MOVE, userInfo) && (
              <Grid item xs={6}>
                <CustomButton
                  title="Chuyển SP"
                  handleClick={() => handleClickOpen(DialogProtype.TRANFER)}
                  sxProps={{
                    borderRadius: '4px',
                    width: '100%',
                    background: '#0062CC',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              </Grid>
            )}
          </Grid>
        );
    }
  };

  const renderStatus = (status: StatusProductEnum) => {
    if (status === StatusProductEnum.WAIT_FILE) {
      return 'Đã cọc, chờ BSHS';
    }
    return status;
  };

  return (
    <Drawer
      anchor="right"
      open={apartmentInformation?.isShowRightBar}
      // onClose={onCloseSidebar}
      PaperProps={{
        sx: {
          background: '#1C293D',
          opacity: 0.97,
          boxShadow: '-4px 0px 8px rgba(0, 0, 0, 0.15)',
          minWidth: '330px',
          padding: '44px 16px',
          maxWidth: '350px',
        },
      }}
      sx={{
        zIndex: 1250,
      }}
    >
      {apartmentInformation?.apartmentId &&
      typeof apartmentInformation?.apartmentId === 'string' ? (
        <Box sx={{ color: '#FFFFFF', maxWidth: '350px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}>
              CHI TIẾT SẢN PHẨM
            </Box>
            <Box onClick={onCloseSidebar} sx={{ cursor: 'pointer' }}>
              <Icon icon="ph:x-bold" color="#d9d9d9" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', mt: 1 }}>
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
                margin: '0 16px',
              }}
            >
              {tableProductInformation?.code}
            </Box>
            <Box
              sx={{
                background: '#475160',
                borderRadius: '4px',
                color: '#FFFFFF',
                padding: '2px 11px',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '20px',
                  color: renderBackgroundColorTable(
                    tableProductInformation?.status,
                  ),
                }}
              >
                {tableProductInformation?.status &&
                  renderStatus(tableProductInformation.status)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              background: '#475160',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 12px',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '20px',
              margin: '16px 0',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box>{tableProductInformation?.block}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ background: '#FFFFFF', margin: '2px 16px', width: '2px' }}
              />
              <Box>
                {isApartment
                  ? `Tầng ${tableProductInformation?.floor}`
                  : `Lô góc: ${tableProductInformation?.corner}`}
              </Box>
              {isApartment && (
                <>
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
                </>
              )}
            </Box>
            <Box mt={1} sx={{ display: 'flex' }}>
              <Box>{tableProductInformation?.direction}</Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ background: '#FFFFFF', margin: '2px 16px', width: '2px' }}
              />
              <Box>{`View ${tableProductInformation?.subscription}`}</Box>
            </Box>
          </Box>
          {!(
            tableProductInformation?.status === StatusProductEnum.SOLD_OUT ||
            tableProductInformation?.status === StatusProductEnum.WAIT_FILE
          )
            ? RenderKeyValue(
                'Đơn vị bán hàng',
                <Typography fontWeight={700}>
                  {`${tableProductInformation?.orgChart?.name || '-'}`}
                </Typography>,
              )
            : null}
          {RenderKeyValue(
            'Diện tích tim tường',
            <Typography fontWeight={700}>
              {`${tableProductInformation?.builtUpArea} m`}
              <sup>2</sup>
            </Typography>,
          )}
          {RenderKeyValue(
            'Diện tích thông thủy',
            <Typography fontWeight={700}>
              {`${tableProductInformation?.carpetArea} m`}
              <sup>2</sup>
            </Typography>,
          )}
          {RenderKeyValue(
            'Đơn giá (chưa VAT)',
            tableProductInformation?.unitPrice ? (
              <Typography fontWeight={700}>
                {`${formatCurrency(tableProductInformation?.unitPrice)}vnđ/m`}
                <sup>2</sup>
              </Typography>
            ) : (
              <Typography>{`-`}</Typography>
            ),
          )}
          {RenderKeyValue(
            'Đơn giá',
            tableProductInformation?.unitPriceVat ? (
              <Typography fontWeight={700}>
                {`${formatCurrency(
                  tableProductInformation?.unitPriceVat,
                )}vnđ/m`}
                <sup>2</sup>
              </Typography>
            ) : (
              <Typography>{`-`}</Typography>
            ),
          )}
          {RenderKeyValue('Trạng thái', tableProductInformation?.status)}
          {tableProductInformation &&
          tableProductInformation.priorities?.length &&
          tableProductInformation.priorities.filter(
            item => item.order === 1 && item.ticket !== null,
          )[0] ? (
            <>
              {isShowPriority
                ? RenderKeyValue(
                    'Ưu tiên 1',
                    tableProductInformation.priorities.filter(
                      item => item.order === 1 && item.ticket !== null,
                    )[0]?.ticket.code,
                  )
                : null}
            </>
          ) : null}
          {tableProductInformation &&
          tableProductInformation.priorities?.length &&
          tableProductInformation.priorities.filter(
            item => item.order === 2 && item.ticket !== null,
          )[0] ? (
            <>
              {isShowPriority
                ? RenderKeyValue(
                    'Ưu tiên 2',
                    tableProductInformation.priorities.filter(
                      item => item.order === 2 && item.ticket !== null,
                    )[0]?.ticket.code,
                  )
                : null}
            </>
          ) : null}
          {tableProductInformation &&
          tableProductInformation.priorities?.length &&
          tableProductInformation.priorities.filter(
            item => item.order === 3 && item.ticket !== null,
          )[0] ? (
            <>
              {isShowPriority
                ? RenderKeyValue(
                    'Ưu tiên 3',
                    tableProductInformation.priorities.filter(
                      item => item.order === 3 && item.ticket !== null,
                    )[0]?.ticket.code,
                  )
                : null}
            </>
          ) : null}
          {tableProductInformation?.customerProduct?.owner?.name
            ? RenderKeyValue(
                'Khách hàng',
                <Typography fontWeight={700}>
                  {`${tableProductInformation?.customerProduct?.owner?.name}`}
                </Typography>,
              )
            : null}
          {tableProductInformation?.customerProduct?.staff?.fullName
            ? RenderKeyValue(
                'Nhân viên tư vấn',
                <Typography fontWeight={700}>
                  {`${tableProductInformation?.customerProduct?.staff?.fullName}`}
                </Typography>,
              )
            : null}
          {tableProductInformation?.customerProduct?.staff?.orgChart?.name
            ? RenderKeyValue(
                'Đơn vị bán hàng',
                <Typography fontWeight={700}>
                  {`${tableProductInformation?.customerProduct?.staff?.orgChart?.name}`}
                </Typography>,
              )
            : null}
          {RenderKeyValue('Ghi chú', tableProductInformation?.note)}
          <Box sx={{ margin: '24px 0' }}>
            <Divider />
          </Box>
          {tableProductInformation?.status &&
            RenderButton(tableProductInformation.status)}
        </Box>
      ) : (
        <Box
          sx={{
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}>
              SẢN PHẨM ĐÃ CHỌN
            </Box>
            <Box onClick={onCloseSidebar} sx={{ cursor: 'pointer' }}>
              <Icon icon="ph:x-bold" color="#d9d9d9" />
            </Box>
          </Box>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '20px',
              color: '#FFCC00',
            }}
          >
            {`Có ${
              apartmentInformation?.apartmentId?.length || 0
            } sản phẩm được chọn`}
          </Typography>
          <Box sx={{ display: 'flex', margin: '10px 0' }}>
            <Box
              sx={{
                width: '24px',
                height: '20px',
                background: renderBackgroundColorTable(
                  apartmentInformation?.status,
                ),
                borderRadius: '2px',
              }}
            ></Box>
            <Box
              sx={{
                fontWeight: 400,
                fontSize: '11px',
                lineHeight: '20px',
                color: '#FFFFFF',
                ml: 2,
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0px 12px',
              }}
            >
              {apartmentInformation?.status}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: 'calc(100% - 200px)',
              overflow: 'auto',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
            }}
          >
            {dataMultipleSelect.map((item: SubDataProtype, index: number) => (
              <Box key={item.id} sx={{ maxHeight: '56px', width: '48%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '12px',
                    justifyContent: 'space-around',
                    background: '#FBD5EA',
                    borderRadius: '23px',
                    marginRight: index % 2 === 0 ? '8px' : '0',
                    marginLeft: index % 2 === 0 ? '0' : '8px',
                  }}
                >
                  <Box sx={{ color: '#1E1E1E' }}>{item.code}</Box>
                  <Box
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemove(item.id)}
                  >
                    <Icon
                      icon="ph:x-bold"
                      color="#d6465f"
                      width="12"
                      height="12"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <Box sx={{ margin: '24px 0' }}>
              <Divider />
            </Box>
            {apartmentInformation?.status &&
              RenderButton(apartmentInformation.status)}
          </Box>
        </Box>
      )}
      {open && typeDialog && (
        <SimpleDialog open={open} onClose={onCloseSidebar} type={typeDialog} />
      )}
    </Drawer>
  );
};
