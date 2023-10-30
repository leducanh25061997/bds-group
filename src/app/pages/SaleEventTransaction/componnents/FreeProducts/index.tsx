import { Box, Button, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { TableHeaderProps } from 'types';
import {
  formatCurrency,
  renderBackgroundColorTable,
  checkPermissionExist,
} from 'utils/helpers';
import { useMemo, useState, Fragment } from 'react';
import TRANFER_ICON from 'assets/icons/tranfer-red.svg';
import { useTranslation } from 'react-i18next';
import {
  ApplicableStatus,
  CustomerProductStatusEnum,
  DialogProtype,
  EventStatusEnum,
  PhaseStatusEnum,
  StatusProductEnum,
} from 'types/Enum';
import CustomButton from 'app/components/Button';
import { Product } from 'types/ProductTable';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { UpdateStatusTableProductParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import CHECKED from 'assets/icons/checked.svg';
import { useParams } from 'react-router';
import { selectSaleEventTransaction } from '../../slice/selector';
import { useSaleEventTransactionSlice } from '../../slice';
import { CompleteProfileForm, TransactionParams } from '../../slice/types';

import MoreMenu from '../MoreMenu/index';
import { Modal } from '../Modal';

import { HeaderTable } from './Header';
import { useProfile } from 'app/hooks';
import { PermissionKeyEnum } from 'types/Permission';
interface ModalType {
  type: DialogProtype | null;
  isOpen: boolean;
  data: Product | null;
}

const initialModal = {
  type: null,
  isOpen: false,
  data: null,
};

export const FreeProducts = ({
  height,
  handleRefresh,
  handleCollapse,
  isFullHeight,
}: {
  height: number;
  handleRefresh: (v?: string) => void;
  handleCollapse?: (v: string) => void;
  isFullHeight: boolean;
}) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<ModalType>(initialModal);
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const { saleEventTransactionFree, isLoadingFree, permissionEventSale } =
    useSelector(selectSaleEventTransaction);
  const userInfo = useProfile();
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã sản phẩm',
        align: 'left',
        width: 140,
      },
      {
        id: 'paymentCode',
        label: 'Block',
        align: 'left',
        width: 110,
      },
      {
        id: 'customerName',
        label: 'Tầng',
        width: 100,
        align: 'left',
      },
      {
        id: 'phone',
        label: 'Giá (chưa VAT)',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone2',
        label: 'Giá (VAT)',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone1',
        label: 'Khách hàng',
        width: 220,
        align: 'left',
      },
      {
        id: 'createAt',
        label: 'Trạng thái',
        width: 140,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Ngày cập nhật',
        width: 150,
        align: 'left',
      },
      {
        id: 'createBy',
        label: 'Ghi chú',
        width: 120,
        align: 'left',
      },
      {
        id: 'action',
        label: '',
        width: 260,
        align: 'right',
        isFixed: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );
  const params = useParams();
  const { id: saleId, projectId } = params;

  const hideStatus = [
    EventStatusEnum.ENDED,
    EventStatusEnum.NOT_START,
    // PhaseStatusEnum.END_PHASE1,
    PhaseStatusEnum.END_PHASE2,
  ];

  const isHideActionButton =
    saleEventTransactionFree &&
    (hideStatus.includes(saleEventTransactionFree.eventSales.status) ||
      hideStatus.includes(saleEventTransactionFree.eventSales.currentPhase));

  const renderItem = (item: Product) => {
    const items = [
      {
        name: `Chuyển sản phẩm`,
        // icon: 'fluent:print-48-filled',
        link: '',
        itemComponent: Button,
        onClick: () => productAction(DialogProtype.TRANFER, item),
      },
      {
        name: `Thu hồi sản phẩm`,
        // icon: 'fluent:print-48-filled',
        link: '',
        itemComponent: Button,
        onClick: () => productAction(DialogProtype.RECALL, item),
      },
    ];
    const itemsBooking = [
      {
        name: `Ghi chú`,
        // icon: 'fluent:print-48-filled',
        link: '',
        itemComponent: Button,
        onClick: () => productAction(DialogProtype.TRANSACTION_NOTES, item),
      },
    ];

    return [
      <Box
        sx={{
          background: item.status
            ? renderBackgroundColorTable(item.status)
            : '#FFEB99',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          width: 'max-content',
          position: 'relative',
          // border: '1px solid #C8CBCF',
        }}
      >
        {(item.status === StatusProductEnum.WAIT_FILE ||
          item.status === StatusProductEnum.BOOKING) &&
          !(
            item?.customerProduct?.tiket?.status ===
              ApplicableStatus.APPROVED_DEPOSIT ||
            item?.customerProduct?.tiket?.status ===
              ApplicableStatus.APPROVED_TICKET
          ) && (
            <Box sx={{ position: 'absolute', top: '-5px', right: '-5px' }}>
              <img src={TRANFER_ICON} alt="Icon" />
            </Box>
          )}
        {item.code}
      </Box>,
      <EllipsisText text={`${item?.block || ''}`} line={1} color={'#1E1E1E'} />,
      <EllipsisText text={`${item?.floor || ''}`} line={1} color={'#1E1E1E'} />,
      <Box sx={{ display: 'flex' }}>
        {item.price ? (
          <Fragment>
            <EllipsisText
              text={`${formatCurrency(item.unitPriceVat) || 0}`}
              line={1}
            />
            <sup>đ</sup>
          </Fragment>
        ) : (
          '-'
        )}
      </Box>,
      <Box sx={{ display: 'flex' }}>
        {item.price ? (
          <Fragment>
            <EllipsisText
              text={`${formatCurrency(item.unitPrice) || 0}`}
              line={1}
            />
            <sup>đ</sup>
          </Fragment>
        ) : (
          '-'
        )}
      </Box>,
      <Box>
        {item?.customerProduct?.owner?.name ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {(item.status === StatusProductEnum.BOOKING ||
                item.status === StatusProductEnum.WAIT_FILE ||
                item.status === StatusProductEnum.SOLD_OUT) && (
                <img
                  style={{ marginRight: '5px' }}
                  src={CHECKED}
                  alt="More icon nav"
                />
              )}
              <EllipsisText
                text={`${item?.customerProduct?.owner?.name || ''}`}
                line={1}
                fontWeight={600}
                sx={{ fontSize: '14px' }}
                color={'#1E1E1E'}
              />
            </Box>
            <EllipsisText
              text={item?.customerProduct?.tiket?.staff?.orgChart?.name}
              line={1}
              fontWeight={400}
              sx={{ fontSize: '14px' }}
              color={'#1E1E1E'}
            />
          </Box>
        ) : (
          <Box>{'--'}</Box>
        )}
      </Box>,
      <EllipsisText
        text={`${item?.status || ''}`}
        line={1}
        color={'#1E1E1E'}
      />,
      <EllipsisText
        text={`${dayjs(item?.updatedAt).format('HH:mm DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText
        text={`${item?.note || '---'}`}
        line={1}
        color={'#1E1E1E'}
      />,
      <Box sx={{ display: 'flex', width: '100%' }}>
        {!isHideActionButton ? (
          <>
            {RenderButton(item)}
            {saleEventTransactionFree?.eventSales.status ===
              EventStatusEnum.STARTING &&
              item.status !== StatusProductEnum.SOLD_OUT && (
                <MoreMenu
                  items={
                    item.status === StatusProductEnum.BOOKING ||
                    item.status === StatusProductEnum.WAIT_FILE
                      ? itemsBooking
                      : items
                  }
                />
              )}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </Box>,
    ];
  };

  const hanldeOpenModal = (status: DialogProtype, data: Product) => {
    setOpenModal({
      type: status,
      isOpen: true,
      data,
    });
  };

  const handleCloseModal = (v?: boolean) => {
    if (v) {
      handleRefresh();
    }

    setOpenModal(initialModal);
  };

  const productAction = (status: DialogProtype, data: Product) => {
    setOpenModal({
      type: status,
      isOpen: true,
      data,
    });
  };

  const fetchData = (id: string) => {
    const params: TransactionParams = {
      id,
      isPriority: false,
    };
    dispatch(saleEventTransactionActions.fetchSaleEventTransaction(params));
  };

  const handleAddProfile = (id: string) => {
    const param: UpdateStatusTableProductParams = {
      ids: [id],
      status: 4,
      settingSalesProgramId: saleId,
      projectId: projectId,
    };
    dispatch(
      apartmentInformationsAction.updateStatusTableProduct(
        param,
        (status?: any) => {
          if (status.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: status.message || 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            handleCloseModal(true);
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

  const RenderButton = (product: Product) => {
    switch (product.status) {
      case StatusProductEnum.OPEN:
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_REGISTER,
              userInfo,
            ) && (
              <CustomButton
                title="Đăng ký"
                handleClick={() =>
                  hanldeOpenModal(DialogProtype.REGISTER, product)
                }
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #D687F2',
                  background: '#F4D6FF',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            )}
          </Box>
        );
      case StatusProductEnum.SIGN_UP:
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {renderButtonSignUp(product)}
            {!(
              product?.customerProduct?.status ===
              CustomerProductStatusEnum.REQUEST
            ) && (
              <>
                {checkPermissionExist(
                  PermissionKeyEnum.EVENT_SALES_RETURN,
                  userInfo,
                ) && (
                  <CustomButton
                    title="Trả về"
                    handleClick={() =>
                      hanldeOpenModal(DialogProtype.RETURN, product)
                    }
                    sxProps={{
                      borderRadius: '4px',
                      width: 'max-content',
                      border: '1px solid #AFAFAF',
                      marginLeft: '5px',
                      background: '#FFF4C6',
                    }}
                    sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                  />
                )}
              </>
            )}
          </Box>
        );
      case StatusProductEnum.BOOKING:
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_ADD_PROFILE,
              userInfo,
            ) && (
              <CustomButton
                title="BSHS"
                handleClick={() => handleAddProfile(product.id)}
                isDisable={
                  !(
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_DEPOSIT ||
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_TICKET
                  )
                }
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #FF7A00',
                  background: '#FFC786',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            )}
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_COMPLETED,
              userInfo,
            ) && (
              <CustomButton
                title="Hoàn tất HS"
                handleClick={() => handleCompleteProfile(product.id)}
                isDisable={
                  !(
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_DEPOSIT ||
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_TICKET
                  )
                }
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #E42B2C',
                  background: '#FFBBBD',
                  color: '#1E1E1E',
                  marginLeft: '10px',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            )}
          </Box>
        );
      case StatusProductEnum.WAIT_FILE:
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_COMPLETED,
              userInfo,
            ) && (
              <CustomButton
                title="Hoàn tất HS"
                handleClick={() => handleCompleteProfile(product.id)}
                isDisable={
                  !(
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_DEPOSIT ||
                    product?.customerProduct?.tiket?.status ===
                      ApplicableStatus.APPROVED_TICKET
                  )
                }
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #E42B2C',
                  background: '#FFBBBD',
                  color: '#1E1E1E',
                  marginLeft: '10px',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            )}
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
            {/* <CustomButton
              title="Hoàn tất HS"
              handleClick={() => console.log()}
              sxProps={{
                borderRadius: '4px',
                width: 'max-content',
                border: '1px solid #E42B2C',
                background: '#FFBBBD',
              }}
              sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
            /> */}
          </Box>
        );
    }
  };

  const renderButtonSignUp = (product: Product) => {
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
                handleClick={() =>
                  hanldeOpenModal(DialogProtype.SEND_REQUIRE, product)
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
      if (
        product.customerProduct.status === CustomerProductStatusEnum.REQUEST
      ) {
        return (
          <>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_CONFIRM,
              userInfo,
            ) &&
              permissionEventSale?.salesUnit.isManager && (
                <CustomButton
                  title="Xác nhận"
                  handleClick={() =>
                    hanldeOpenModal(DialogProtype.CONFIRM_SIGN_UP, product)
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
                hanldeOpenModal(
                  DialogProtype.ENTER_CUSTOMER_INFORMATION,
                  product,
                )
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
  };

  const handleCompleteProfile = (id: string) => {
    if (saleEventTransactionFree?.eventSales?.id) {
      const param: CompleteProfileForm = {
        id: saleEventTransactionFree?.eventSales?.id,
        productId: id,
      };
      dispatch(
        saleEventTransactionActions.completeProfile(param, (status?: any) => {
          if (status.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            fetchData(saleEventTransactionFree?.eventSales?.salesProgramId);
            handleCloseModal(true);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  status.message || 'Thay đổi thông tin không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '20px',
        background: '#FFF',
        overflow: 'hidden',
        marginTop: '16px',
        // height: `${height - 60}px`,
      }}
    >
      {saleEventTransactionFree?.statistics && (
        <HeaderTable
          handleCollapse={handleCollapse}
          handleRefresh={handleRefresh}
          data={saleEventTransactionFree.statistics}
        />
      )}
      {height > 0 && (
        <Box>
          <Table
            headers={header}
            renderItem={renderItem}
            // items={Array(20).fill(dataExample)}
            items={saleEventTransactionFree?.data || []}
            headerBackgroundColor="#FFFFFF"
            hidePagination
            setHeight={`${isFullHeight ? height - 70 : height / 2 - 60}px`}
            minHeight={`${(isFullHeight ? height : height / 2) - 60}px`}
            isLoading={isLoadingFree}
          />
        </Box>
      )}

      {openModal.isOpen && openModal.type && openModal.data && (
        <Modal
          onClose={handleCloseModal}
          open={openModal.isOpen}
          type={openModal.type}
          product={openModal.data}
          salesProgramId={saleEventTransactionFree?.eventSales.salesProgramId}
        />
      )}
    </Box>
  );
};
