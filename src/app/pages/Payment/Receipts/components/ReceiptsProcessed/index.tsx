import { Box, CircularProgress, IconButton, Paper } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { snackbarActions } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useProfile } from 'app/hooks';
import { ConfirmationOfReceipt } from 'app/pages/Payment/Components/ConfirmationOfReceipt';
import { ReceiptInformation } from 'app/pages/Payment/Components/ReceiptInformation';
import { RejectionOfVotes } from 'app/pages/Payment/Components/RejectionOfVotes';
import BookingDetail from 'app/pages/TransactionManagement/components/BookingDetail';
import PRINT_ICON from 'assets/icons/print-icon-red.svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import DocumentServices from 'services/api/document';
import { FilterParams, TableHeaderProps } from 'types';
import { ReceiptsStatus, RefundEnum } from 'types/Enum';
import { PermissionKeyEnum } from 'types/Permission';
import {
  checkPermissionExist,
  formatCurrency,
  getLocalTime,
} from 'utils/helpers';

import { DialogConfirmTicket } from 'app/pages/TransactionManagement/component/DialogConfirmTicket';
import { usePaymentSlice } from '../../slice';
import { selectReceipt } from '../../slice/selectors';
import { ReceiptsResponse } from '../../slice/types';
import { BookingDetailDialog } from '../ReceiptsAwaitingApproval';

const initialFilter = {
  page: 1,
  limit: 10,
  status: ReceiptsStatus.APPROVED,
};

export const ReceiptsProcessed = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = usePaymentSlice();
  const userInfo = useProfile();
  const { receiptsApprove, isLoading, paramsSearch } =
    useSelector(selectReceipt);
  const [open, setOpen] = useState(false);
  const [typeConfirm, setTypeConfirm] = useState<string>('Approve');
  const [receiptSelect, setReceiptSelect] = useState<ReceiptsResponse>();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [openDialogCancel, setOpenDialogCancel] = useState(false);
  const [receiptId, setReceiptId] = useState<string>('');
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [idLoading, setIdLoading] = useState('');
  const [filterParams, setFilterParams] = useState<FilterParams>(
    useCallback(() => initialFilter, []),
  );
  const [isOpenDialogConfirmTicket, setOpenDialogConfirmTicket] =
  useState(false);
  const [openBookingDetail, setOpenBookingDetail] =
    useState<BookingDetailDialog>({
      isOpen: false,
      rowId: '',
      type: 'reservation',
    });

  useEffect(() => {
    return () => {
      dispatch(actions.clearDataReceiptApprove());
    };
  }, [actions, dispatch]);

  const fetchDataForPage = useCallback(
    (params: FilterParams) => {
      dispatch(actions.fetchReceiptsApprove(params));
    },
    [actions, dispatch],
  );

  useEffect(() => {
    fetchDataForPage(filterParams);
  }, [filterParams, fetchDataForPage]);

  useEffect(() => {
    if (paramsSearch) {
      setFilterParams(prev => {
        return {
          ...prev,
          ...paramsSearch,
        };
      });
    }
  }, [paramsSearch]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialogConfirm = () => {
    setOpenDialogConfirm(true);
  };

  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false);
  };

  const handleOpenDialogCancel = () => {
    setOpenDialogCancel(true);
  };

  const handleCloseDialogCancel = () => {
    setOpenDialogCancel(false);
  };

  const handleOpenBookingDetail = (
    id: string,
    type: 'reservation' | 'deposit' = 'reservation',
  ) => {
    setOpenBookingDetail({ isOpen: true, rowId: id, type });
  };

  const handleCloseBookingDetail = () => {
    setOpenBookingDetail({ isOpen: false, rowId: '', type: 'reservation' });
  };

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 100,
      },
      {
        id: 'voucherCode',
        label: 'Mã phiếu thu',
        align: 'left',
        width: 200,
      },
      {
        id: 'customerName',
        label: 'Mã YC/HĐ',
        width: 200,
        align: 'left',
      },
      {
        id: 'typeOfReceipt',
        label: 'Loại phiếu thu',
        width: 170,
        align: 'left',
      },
      {
        id: 'project',
        label: 'Dự án',
        width: 170,
        align: 'left',
      },
      {
        id: 'productCode',
        label: 'Mã sản phẩm',
        width: 130,
        align: 'left',
      },
      {
        id: 'customer',
        label: 'Khách hàng',
        width: 160,
        align: 'left',
      },
      {
        id: 'unit',
        label: 'Đơn vị',
        width: 200,
        align: 'left',
      },
      {
        id: 'money',
        label: 'Số tiền',
        width: 200,
        align: 'left',
      },
      {
        id: 'createAt',
        label: 'Ngày tạo',
        width: 200,
        align: 'left',
      },
      {
        id: 'updateAt',
        label: 'Ngày cập nhật',
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Trạng thái',
        width: 200,
        align: 'left',
      },
      {
        id: 'note',
        label: 'Ghi chú',
        width: 150,
        align: 'left',
      },
      {
        id: 'options',
        label: '',
        width: 150,
        align: 'left',
      },
    ],
    [t],
  );

  const handlePrintTicket = () => async (ticketType: string) => {
    if (!receiptSelect?.ticket.id) return;
    setIsLoadingPrint(true);
    setOpenDialogConfirmTicket(false)

    try {
      const data: { url: string } = await DocumentServices.printReceiptTicket(
        receiptSelect?.ticket.id,
        ticketType
      );

      const documentUrl = `${process.env.REACT_APP_API_URL}/${data.url}`;
      window.open(documentUrl, '_blank');
      setIsLoadingPrint(false);
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'In phiếu thành công',
          type: 'success',
        }),
      );
    } catch (error) {
      setIsLoadingPrint(false);
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'In phiếu không thành công',
          type: 'error',
        }),
      );
    } finally {
      // setIsPrintingTicket(false);
    }
  };


  const hanldeOpenDialogConfirmTicket = (item: ReceiptsResponse) => {
    setReceiptSelect(item);
    setOpenDialogConfirmTicket(true);
  };

  const renderItem = (item: ReceiptsResponse, index: number) => {
    return [
      <div>{index + 1}</div>,
      <Box sx={{ cursor: 'pointer' }} onClick={() => handleSelectRow(item)}>
        <EllipsisText text={`${item.code || ''}`} line={1} color={'#007aff'} />
      </Box>,

      <EllipsisText
        text={`${
          item.type === 'DEPOSIT'
            ? item.ticket?.depositCode
            : item.ticket?.code || ''
        }`}
        line={1}
        color={'#007aff'}
        handleClick={event => {
          event.stopPropagation();
          if (
            checkPermissionExist(PermissionKeyEnum.TICKET_VIEW_ALL, userInfo) ||
            checkPermissionExist(PermissionKeyEnum.TICKET_APPROVE, userInfo) ||
            item?.staff.id === userInfo?.staff.id
          ) {
            const type = item.type === 'DEPOSIT' ? 'deposit' : 'reservation';
            handleOpenBookingDetail(item.ticket.id, type);
          } else return;
        }}
      />,

      <EllipsisText
        text={`${item.type === 'DEPOSIT' ? 'Phiếu đặt cọc' : 'Phiếu giữ chỗ'}`}
        line={1}
      />,
      <EllipsisText text={`${item.ticket?.project?.name || ''}`} line={1} />,
      <EllipsisText text={`${item?.ticket?.product?.code || ''}`} line={1} />,
      <EllipsisText text={`${item?.customer?.name || ''}`} line={1} />,
      <EllipsisText
        text={`${item?.ticket?.staff?.orgChart?.name || ''}`}
        line={1}
      />,
      <EllipsisText
        text={`${formatCurrency(item.totalPrice) || 0}`}
        line={1}
      />,
      <EllipsisText
        text={`${getLocalTime(item?.createdAt, 'HH:mm DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText
        text={`${getLocalTime(item?.updatedAt, 'HH:mm DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText
        text={`${RefundEnum[item.status as keyof typeof RefundEnum] || '---'}`}
        line={1}
      />,
      <EllipsisText text={`${item.note || '---'}`} line={1} />,
      <div style={{ display: 'flex' }}>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            hanldeOpenDialogConfirmTicket(item);
          }}
        >
          {isLoadingPrint && idLoading === item.id ? (
            <CircularProgress size={16} />
          ) : (
            <img src={PRINT_ICON} alt="Print Icon" />
          )}
        </IconButton>
      </div>,
    ];
  };

  const handleSelectRow = (data: ReceiptsResponse) => {
    setReceiptId(data.id);
    setOpen(true);
  };

  const onPageChange = (page: number) => {
    setFilterParams({ ...filterParams, page });
  };

  const onPageSizeChange = (limit: number) => {
    setFilterParams({ ...filterParams, page: 1, limit });
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        padding: '14px 16px 0px 16px',
        borderRadius: '20px',
      }}
    >
      <Table
        headers={header}
        renderItem={renderItem}
        items={receiptsApprove ? receiptsApprove?.data || [] : undefined}
        pageNumber={filterParams.page}
        totalElements={receiptsApprove?.total}
        limitElement={filterParams.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
      {open && receiptId && (
        <ReceiptInformation
          open={open}
          handleClose={handleClose}
          id={receiptId}
          handleOpenDialogConfirm={handleOpenDialogConfirm}
          setTypeConfirm={setTypeConfirm}
          handleOpenDialogCancel={handleOpenDialogCancel}
        />
      )}
      {openDialogConfirm && receiptId && (
        <ConfirmationOfReceipt
          open={openDialogConfirm}
          handleClose={handleCloseDialogConfirm}
          handleCloseDialog={() => setOpenDialogConfirm(false)}
          dialogTitle={
            typeConfirm === 'Approve'
              ? 'Xác nhận duyệt phiếu thu'
              : 'Nạp tiền cho phiếu thu'
          }
          description={
            typeConfirm === 'Approve'
              ? 'Bạn có chắc chắn xác nhận duyệt phiếu'
              : 'Bạn có chắc chắn muốn ghi nhận nạp tiền cho phiếu thu'
          }
          receiptId={receiptId}
        />
      )}
       {isOpenDialogConfirmTicket && (
        <DialogConfirmTicket
          type={'reservation'}
          projectId={receiptSelect?.ticket.projectId || ''}
          isOpenDialog={isOpenDialogConfirmTicket}
          title="In phiếu"
          actionName="In"
          description="Vui lòng chọn mẫu in phù hợp để thực hiện in phiếu."
          handleSubmit={handlePrintTicket()}
          setIsOpenDialog={setOpenDialogConfirmTicket}
        />
      )}

      {openDialogCancel && receiptId && (
        <RejectionOfVotes
          open={openDialogCancel}
          handleClose={handleCloseDialogCancel}
          receiptId={receiptId}
        />
      )}

      {openBookingDetail.isOpen && (
        <BookingDetail
          type={openBookingDetail.type}
          isOpen={openBookingDetail.isOpen}
          bookingId={openBookingDetail.rowId}
          onClose={() => handleCloseBookingDetail()}
        />
      )}
    </Paper>
  );
};
