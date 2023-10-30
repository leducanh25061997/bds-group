import { CircularProgress, IconButton, Paper } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { snackbarActions } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { ConfirmationOfRefund } from 'app/pages/Payment/Components/ConfirmationOfRefund';
import { RefundInformation } from 'app/pages/Payment/Components/RefundInformation';
import { RejectionRefund } from 'app/pages/Payment/Components/RejectRefund';
import PRINT_ICON from 'assets/icons/print-icon-red.svg';
import { get } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DocumentServices from 'services/api/document';
import { FilterParams, TableHeaderProps } from 'types';
import { RefundEnum, RefundsStatus } from 'types/Enum';
import { formatCurrency, formatDateTime3 } from 'utils/helpers';

import { DialogConfirmTicket } from 'app/pages/TransactionManagement/component/DialogConfirmTicket';
import { useRefundSlice } from '../../slice';
import { selectRefund } from '../../slice/selectors';
import { RefundsResponse } from '../../slice/types';

const initialFilter = {
  page: 1,
  limit: 10,
  status: RefundsStatus.WAITING,
};

export const RefundAwaitingApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useRefundSlice();
  const { refundsWaitting, isLoading, paramsSearch } =
    useSelector(selectRefund);
  const [refundId, setRefundId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [typeConfirm, setTypeConfirm] = useState<string>('Approve');
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [openDialogCancel, setOpenDialogCancel] = useState(false);
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [refundSelect, setRefundSelect] = useState<RefundsResponse>();
  const [isOpenDialogConfirmTicket, setOpenDialogConfirmTicket] =
  useState(false);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [idLoading, setIdLoading] = useState('');
  const [filterParams, setFilterParams] = useState<FilterParams>(
    useCallback(() => initialFilter, []),
  );
  const fetchDataForPage = useCallback(
    (params: FilterParams) => {
      dispatch(actions.fetchRefundWaiting(params));
    },
    [actions, dispatch],
  );

  // const { filter, onFilterToQueryString } = useFilter({
  //   onFetchData: (params: FilterParams) => {
  //     fetchDataForPage(params);
  //   },
  //   defaultFilter: initialFilter,
  // });

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

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 100,
      },
      {
        id: 'code',
        label: 'Mã phiếu hoàn',
        align: 'left',
        width: 200,
      },
      {
        id: 'customerName',
        label: 'Mã GC/HĐ',
        width: 200,
        align: 'left',
      },
      {
        id: 'type',
        label: 'Loại phiếu hoàn',
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
        id: 'bookingAmountReservation',
        label: 'Số tiền',
        width: 200,
        align: 'left',
      },
      {
        id: 'totalPrice',
        label: 'Ngày tạo',
        width: 200,
        align: 'left',
      },
      {
        id: 'totalPrice',
        label: 'Ngày cập nhật',
        width: 200,
        align: 'left',
      },
      {
        id: 'totalPrice',
        label: 'Trạng thái',
        width: 200,
        align: 'left',
      },
      {
        id: 'options',
        label: '',
        width: 100,
        align: 'left',
      },
    ],
    [],
  );

  const handleSelectRow = (data: RefundsResponse) => {
    setRefundId(data.id);
    setOpen(true);
  };

  const hanldeOpenDialogConfirmTicket = (item: RefundsResponse) => {
    setRefundSelect(item);
    setOpenDialogConfirmTicket(true);
  };

  const renderItem = (item: RefundsResponse, index: number) => {
    return [
      <div>{index + 1}</div>,
      <EllipsisText
        text={`${item.code}`}
        line={1}
        color={'#007aff'}
        handleClick={event => {
          event.stopPropagation();
          handleSelectRow(item);
        }}
      />,
      <EllipsisText
        text={`${item.ticket.code}`}
        line={1}
        color={'#007aff'}
        handleClick={event => {
          event.stopPropagation();
          navigate(`/project/transaction-management/${item.ticket.projectId}`, {
            state: {
              tabActive: 3,
              tickId: item.ticket.id,
            },
          });
        }}
      />,
      <EllipsisText text={`${'Hủy chỗ - hoàn tiền'}`} line={1} />,
      <EllipsisText text={`${item.ticket.project.name}`} line={1} />,
      <EllipsisText text={`${item?.ticket?.product?.code || ''}`} line={1} />,
      <EllipsisText text={`${item?.customer?.name || ''}`} line={1} />,
      <EllipsisText
        text={`${item?.ticket?.staff?.orgChart?.name || ''}`}
        line={1}
      />,
      <EllipsisText
        text={`${formatCurrency(item.amountPaid || '0')}`}
        line={1}
      />,
      <EllipsisText
        text={`${formatDateTime3(item.createdAt || '')}`}
        line={1}
      />,
      <EllipsisText
        text={`${formatDateTime3(item.updatedAt || '')}`}
        line={1}
      />,
      <EllipsisText text={`${get(RefundEnum, item.status)}`} line={1} />,
      <div style={{ display: 'flex' }}>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            hanldeOpenDialogConfirmTicket(item);
          }}
        >
          {isLoadingPrint && idLoading === item?.ticket?.id ? (
            <CircularProgress size={16} />
          ) : (
            <img src={PRINT_ICON} alt="Print Icon" />
          )}
        </IconButton>
      </div>,
    ];
  };
  const onPageChange = (page: number) => {
    setFilterParams({ ...filterParams, page });
  };

  const onPageSizeChange = (limit: number) => {
    setFilterParams({ ...filterParams, page: 1, limit });
  };

  const handleClose = () => {
    dispatch(actions.fetchRefundWaiting(filterParams));
    setOpen(false);
  };

  const handleOpenDialogConfirm = () => {
    setOpenDialogConfirm(true);
  };

  const handleOpenDialogCancel = () => {
    setOpenDialogCancel(true);
  };

  const handleCloseDialogConfirm = () => {
    setOpen(true);
    setOpenDialogConfirm(false);
    dispatch(actions.fetchRefundWaiting(filterParams));
  };

  const handleCloseDialogCancel = () => {
    setOpen(true);
    setOpenDialogCancel(false);
  };

  const handlePrintTicket = () => async(ticketType: string) => {
    if (!refundSelect?.ticket?.id) return;
    setIsLoadingPrint(true);
    setIdLoading(refundSelect?.ticket?.id);
    try {
      setIsPrintingTicket(true);
      const data: { url: string } = await DocumentServices.printTicket(refundSelect?.ticket?.id, ticketType);

      const documentUrl = `${process.env.REACT_APP_API_URL}/${data.url}`;
      window.open(documentUrl, '_blank');
      setIsLoadingPrint(false);
      setIdLoading('');
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'In phiếu thành công',
          type: 'success',
        }),
      );
    } catch (error) {
      setIsLoadingPrint(false);
      setIdLoading('');
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'In phiếu không thành công',
          type: 'error',
        }),
      );
    } finally {
      setIsPrintingTicket(false);
    }
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        padding: '14px 16px 0px 16px',
      }}
    >
      <Table
        headers={header}
        renderItem={renderItem}
        items={refundsWaitting?.data || []}
        pageNumber={filterParams.page}
        totalElements={refundsWaitting?.total || 0}
        limitElement={filterParams.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
      {isOpenDialogConfirmTicket && (
        <DialogConfirmTicket
          type={'canceled'}
          projectId={refundSelect?.ticket.projectId || ''}
          isOpenDialog={isOpenDialogConfirmTicket}
          title="In phiếu"
          actionName="In"
          description="Vui lòng chọn mẫu in phù hợp để thực hiện in phiếu."
          handleSubmit={handlePrintTicket()}
          setIsOpenDialog={setOpenDialogConfirmTicket}
        />
      )}
      {open && refundId && (
        <RefundInformation
          open={open}
          handleClose={handleClose}
          id={refundId}
          handleOpenDialogConfirm={handleOpenDialogConfirm}
          setTypeConfirm={setTypeConfirm}
          handleOpenDialogCancel={handleOpenDialogCancel}
        />
      )}
      {openDialogConfirm && refundId && (
        <ConfirmationOfRefund
          open={openDialogConfirm}
          handleClose={handleCloseDialogConfirm}
          handleCloseDialog={() => setOpenDialogConfirm(false)}
          dialogTitle={typeConfirm === 'Approve' ? 'Xác nhận hoàn tiền' : ''}
          description={
            typeConfirm === 'Approve'
              ? 'Bạn có chắc chắn xác nhận duyệt phiếu hoàn tiền'
              : ''
          }
          refundId={refundId}
        />
      )}
      {openDialogCancel && refundId && (
        <RejectionRefund
          open={openDialogCancel}
          handleClose={handleCloseDialogCancel}
          refundId={refundId}
        />
      )}
    </Paper>
  );
};
