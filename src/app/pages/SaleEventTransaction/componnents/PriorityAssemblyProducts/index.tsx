/* eslint-disable eqeqeq */
import { Box, Button, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { TableHeaderProps } from 'types';
import { formatCurrency, renderBackgroundColorTable } from 'utils/helpers';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { Priorities, Product } from 'types/ProductTable';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import {
  EventStatusEnum,
  PhaseStatusEnum,
  StatusProductEnum,
  PriorityStatusEnum,
  DialogProtype,
} from 'types/Enum';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import CustomButton from 'app/components/Button';
import CHECKED from 'assets/icons/checked.svg';
import { SaleControlEnum } from 'app/pages/SaleEventControl/slice/types';

import MoreMenu from '../MoreMenu/index';
import { Modal } from '../Modal';

import { selectSaleEventTransaction } from '../../slice/selector';
import { useSaleEventTransactionSlice } from '../../slice';
import { CompleteProfileForm, TransactionParams } from '../../slice/types';

import { HeaderTable } from './Header';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';

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

export const PriorityAssemblyProducts = ({
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
  // const { saleEventTransaction, isLoading } = useSelector(
  //   selectSaleEventTransaction,
  // );
  const {
    saleEventTransactionPriority,
    isLoadingPriority,
    permissionEventSale,
  } = useSelector(selectSaleEventTransaction);
  const userInfo = useProfile();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã sản phẩm',
        align: 'left',
        width: 125,
      },
      {
        id: 'paymentCode',
        label: 'Block',
        align: 'left',
        width: 105,
      },
      {
        id: 'customerName',
        label: 'Tầng',
        width: 95,
        align: 'left',
      },
      {
        id: 'phone',
        label: 'Giá (chưa VAT)',
        width: 170,
        align: 'left',
      },
      {
        id: 'phone1',
        label: 'Giá (VAT)',
        width: 170,
        align: 'left',
      },
      {
        id: 'idperson',
        label: 'Ưu tiên 1',
        width: 180,
        align: 'left',
      },
      {
        id: 'exchanges',
        label: 'Ưu tiên 2',
        width: 180,
        align: 'left',
      },
      {
        id: 'bussinesStaff',
        label: 'Ưu tiên 3',
        width: 180,
        align: 'left',
      },
      {
        id: 'createAt',
        label: 'Trạng thái',
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Ngày cập nhật',
        width: 200,
        align: 'left',
      },
      {
        id: 'createBy',
        label: 'Ghi chú',
        width: 200,
        align: 'left',
      },
      {
        id: 'action',
        label: '',
        // width: 250,
        align: 'right',
        isFixed: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const hideStatus = [
    EventStatusEnum.ENDED,
    EventStatusEnum.NOT_START,
    PhaseStatusEnum.START_PHASE2,
    PhaseStatusEnum.END_PHASE1,
    PhaseStatusEnum.END_PHASE2,
    PhaseStatusEnum.START_PHASE2,
    PriorityStatusEnum.END_PRIORITY1,
    PriorityStatusEnum.END_PRIORITY2,
    PriorityStatusEnum.END_PRIORITY3,
  ];

  const isHideActionButton =
    saleEventTransactionPriority &&
    (hideStatus.includes(saleEventTransactionPriority.eventSales.status) ||
      hideStatus.includes(
        saleEventTransactionPriority.eventSales.currentPhase,
      ));

  const renderColor = (
    current: Priorities | null,
    priority1: Priorities | null,
    priority2: Priorities | null,
    status: PriorityStatusEnum,
  ) => {
    if (
      saleEventTransactionPriority?.eventSales.currentPriority === status ||
      current?.ticket?.status === 'APPROVED_DEPOSIT'
    ) {
      if (
        priority1?.ticket?.status === 'APPROVED_DEPOSIT' ||
        priority2?.ticket?.status === 'APPROVED_DEPOSIT'
      ) {
        return '#AFAFAF';
      } else return '#1E1E1E';
    }
    return '#AFAFAF';
  };

  const renderItem = (item: Product, index: number) => {
    let order = 0;
    switch (saleEventTransactionPriority?.eventSales?.currentPriority) {
      case SaleControlEnum.START_PRIORITY1:
        order = 1;
        break;
      case SaleControlEnum.START_PRIORITY2:
        order = 2;
        break;
      case SaleControlEnum.START_PRIORITY3:
        order = 3;
        break;

      default:
        break;
    }
    const priority1 =
      (item &&
        item.priorities &&
        item.priorities.filter(item => item.order === 1)[0]) ||
      null;
    const priority2 =
      (item &&
        item.priorities &&
        item.priorities.filter(item => item.order === 2)[0]) ||
      null;
    const priority3 =
      (item &&
        item.priorities &&
        item.priorities.filter(item => item.order === 3)[0]) ||
      null;

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
          // border: '1px solid #C8CBCF',
        }}
      >
        {item.code}
      </Box>,
      <EllipsisText text={`${item?.block || ''}`} line={1} color={'#1E1E1E'} />,
      <EllipsisText text={`${item?.floor || ''}`} line={1} color={'#1E1E1E'} />,
      <Box sx={{ display: 'flex' }}>
        {item.price ? (
          <Fragment>
            <EllipsisText
              text={`${formatCurrency(item.price) || 0}`}
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
              text={`${formatCurrency(item.priceVat) || 0}`}
              line={1}
            />
            <sup>đ</sup>
          </Fragment>
        ) : (
          '-'
        )}
      </Box>,
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color:
            saleEventTransactionPriority?.eventSales.currentPriority ===
              PriorityStatusEnum.START_PRIORITY1 ||
            priority1?.ticket?.status === 'APPROVED_DEPOSIT'
              ? '#1E1E1E'
              : '#AFAFAF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(priority1?.ticket?.status === 'APPROVED_DEPOSIT' ||
            (order === 1 &&
              (item?.status === StatusProductEnum.BOOKING ||
                item?.status === StatusProductEnum.WAIT_FILE))) && (
            <img
              style={{ marginRight: '5px' }}
              src={CHECKED}
              alt="More icon nav"
            />
          )}
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority1 && priority1?.ticket?.customers.length > 0
              ? priority1?.ticket.customers[0].mainCustomer.name
              : priority1?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority1?.ticket?.staff?.orgChart?.name || priority1?.saleUnitName}
        </Typography>
      </Box>,
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: renderColor(
            priority2,
            priority1,
            priority3,
            PriorityStatusEnum.START_PRIORITY2,
          ),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(priority2?.ticket?.status === 'APPROVED_DEPOSIT' ||
            (order === 2 &&
              (item?.status === StatusProductEnum.BOOKING ||
                item?.status === StatusProductEnum.WAIT_FILE))) && (
            <img
              style={{ marginRight: '5px' }}
              src={CHECKED}
              alt="More icon nav"
            />
          )}
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority2 && priority2?.ticket?.customers.length > 0
              ? priority2?.ticket?.customers[0].mainCustomer.name
              : priority2?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority2?.ticket?.staff?.orgChart?.name || priority2?.saleUnitName}
        </Typography>
      </Box>,
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: renderColor(
            priority3,
            priority2,
            priority1,
            PriorityStatusEnum.START_PRIORITY3,
          ),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(priority3?.ticket?.status === 'APPROVED_DEPOSIT' ||
            (order === 3 &&
              (item?.status === StatusProductEnum.BOOKING ||
                item?.status === StatusProductEnum.WAIT_FILE))) && (
            <img
              style={{ marginRight: '5px' }}
              src={CHECKED}
              alt="More icon nav"
            />
          )}
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority3 && priority3?.ticket?.customers.length > 0
              ? priority3?.ticket?.customers[0].mainCustomer.name
              : priority3?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority3?.ticket?.staff?.orgChart?.name || priority3?.saleUnitName}
        </Typography>
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
      <Box sx={{ display: 'flex' }}>
        {!isHideActionButton ? (
          <>
            {RenderButton(item)}
            {saleEventTransactionPriority?.eventSales.status ===
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

  const handleAddProfile = (id: string) => {
    if (saleEventTransactionPriority?.eventSales?.id) {
      const param: CompleteProfileForm = {
        id: saleEventTransactionPriority?.eventSales?.id,
        productId: id,
      };
      dispatch(
        saleEventTransactionActions.addProfile(param, (status?: any) => {
          if (status.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
            fetchData(saleEventTransactionPriority?.eventSales?.salesProgramId);
            handleCloseModal(true);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  const productAction = (status: DialogProtype, data: Product) => {
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

  const hanldeOpenModal = (status: DialogProtype, data: Product) => {
    setOpenModal({
      type: status,
      isOpen: true,
      data,
    });
  };

  const handleCompleteProfile = (id: string) => {
    if (saleEventTransactionPriority?.eventSales?.id) {
      const param: CompleteProfileForm = {
        id: saleEventTransactionPriority?.eventSales?.id,
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
            fetchData(saleEventTransactionPriority?.eventSales?.salesProgramId);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  const fetchData = (id: string) => {
    const priorityParams: TransactionParams = {
      id,
      isPriority: true,
    };
    dispatch(
      saleEventTransactionActions.fetchSaleEventTransaction(priorityParams),
    );
  };

  const RenderButton = (product: Product) => {
    switch (product.status) {
      case StatusProductEnum.OPEN:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_CONFIRM,
              userInfo,
            ) &&
              permissionEventSale?.salesUnit.isManager && (
                <CustomButton
                  title="ĐVBH Xác nhận"
                  handleClick={() =>
                    hanldeOpenModal(DialogProtype.BOOKING, product)
                  }
                  sxProps={{
                    borderRadius: '4px',
                    width: 'max-content',
                    border: '1px solid #31DAFF',
                    background: '#7CE7FF',
                  }}
                  sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
                />
              )}
          </Box>
        );
      case StatusProductEnum.BOOKING:
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
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
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #E42B2C',
                  background: '#FFBBBD',
                  marginLeft: '10px',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            )}
          </Box>
        );
      case StatusProductEnum.WAIT_FILE:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
            {checkPermissionExist(
              PermissionKeyEnum.EVENT_SALES_COMPLETED,
              userInfo,
            ) && (
              <CustomButton
                title="Hoàn tất HS"
                handleClick={() => handleCompleteProfile(product.id)}
                sxProps={{
                  borderRadius: '4px',
                  width: 'max-content',
                  border: '1px solid #E42B2C',
                  background: '#FFBBBD',
                }}
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            )}
          </Box>
        );
      default:
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}
          ></Box>
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
      {saleEventTransactionPriority?.statistics && (
        <HeaderTable
          handleRefresh={handleRefresh}
          handleCollapse={handleCollapse}
          data={saleEventTransactionPriority.statistics}
        />
      )}
      {height > 0 && (
        <Box>
          <Table
            headers={header}
            renderItem={renderItem}
            // items={Array(12).fill(dataExample)}
            items={saleEventTransactionPriority?.data || []}
            headerBackgroundColor="#FFFFFF"
            hidePagination
            setHeight={`${isFullHeight ? height : height / 2 - 60}px`}
            minHeight={`${(isFullHeight ? height : height / 2) - 60}px`}
            isLoading={isLoadingPriority}
          />
        </Box>
      )}
      {openModal.isOpen && openModal.type && openModal.data && (
        <Modal
          onClose={handleCloseModal}
          open={openModal.isOpen}
          type={openModal.type}
          product={openModal.data}
          salesProgramId={
            saleEventTransactionPriority?.eventSales.salesProgramId
          }
        />
      )}
    </Box>
  );
};
