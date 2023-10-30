import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useProfile } from 'app/hooks';
import COPY_ICON from 'assets/background/copy-icon-table.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import SEND_ICON from 'assets/background/send-icon-table.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams, TableHeaderProps } from 'types';

import RenderStatus from 'app/components/RenderStatus';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CustomerInReservation,
  ReceiptsItem,
  ReservationItem,
  StatusReservation,
} from 'types/Transaction';
import { checkPermissionExist, getLocalTime } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { EventSocketListen } from 'types/Enum';
import SocketManager, { EventSocket } from 'app/components/Socket';

import { useTransactionManagementSlice } from '../../slice';
import { selectTransactionManagement } from '../../slice/selector';
import {
  CanceledRequest,
  StatusTicketCanceled,
  StatusTicketReservation,
} from '../../slice/type';
import BookingDetail from '../BookingDetail';
import CanceledReservation from '../CanceledReservation';

export interface TypePopupActionTicket {
  isOpen: boolean;
  rowSelected?: ReservationItem | null;
}
interface StateLocationProps {
  tabActive: number | string;
  tickId: string;
}
interface ReservationTableProps {}

export default function ReservationTable(props: ReservationTableProps) {
  const { actions } = useTransactionManagementSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useProfile();
  const { state } = useLocation();
  const [isRedirectToReceipt, setIsRedirectToReceipt] =
    useState<boolean>(false);
  const locationProps = state as StateLocationProps;
  const { reservationManagement, isLoading, paramsSearch } = useSelector(
    selectTransactionManagement,
  );
  const [fileId, setFileId] = useState<string[]>([]);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      status: 'RESERVATION',
      checkStatus: true,
      projectId: id,
    };
  }, [id]);
  const [filterParams, setFilterParams] = useState<FilterParams>(
    useCallback(() => initialFilter, [initialFilter]),
  );
  // const interval = useRef<any>();
  const showBtnEdit = checkPermissionExist(
    PermissionKeyEnum.TICKET_UPDATE,
    userInfo,
  );
  const [showPopupConfirm, setShowPopupConfirm] =
    useState<TypePopupActionTicket>({
      isOpen: false,
      rowSelected: null,
    });
  const [openBookingDetail, setOpenBookingDetail] = useState({
    isOpen: false,
    rowId: '',
  });
  const [openCanceled, setOpenCanceled] = useState({
    isOpen: false,
    ticketId: '',
    title: '',
  });
  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_TICKET_RESERVATE,
        handler: (data: any) => {
          if (
            !data?.projectId ||
            (filterParams?.projectId &&
              data?.projectId === filterParams?.projectId)
          ) {
            fetchDataForPage({ ...filterParams, skipLoading: true });
          }
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );

  useEffect(() => {
    if (locationProps && locationProps.tickId) {
      setIsRedirectToReceipt(true);
      setOpenBookingDetail({
        isOpen: true,
        rowId: locationProps.tickId,
      });
    }
  }, [locationProps]);

  useEffect(() => {
    if (paramsSearch) {
      setFilterParams({ ...filterParams, ...paramsSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSearch]);

  useEffect(() => {
    dispatch(actions.updateParamsSearch(initialFilter));
    return () => {
      dispatch(actions.clearListReservation());
      // dispatch(actions.clearParamsSearch());
      // clearInterval(interval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã giữ chỗ',
        align: 'left',
        width: 200,
      },
      {
        id: 'paymentCode',
        label: 'Mã thanh toán',
        align: 'left',
        width: 200,
      },
      {
        id: 'id_product',
        label: 'Mã sản phẩm',
        width: 200,
        align: 'left',
      },
      {
        id: 'customerName',
        label: 'Khách hàng',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone',
        label: 'Điện thoại',
        width: 200,
        align: 'left',
      },
      {
        id: 'idperson',
        label: 'CMND/CCCD',
        width: 200,
        align: 'left',
      },
      {
        id: 'exchanges',
        label: 'Đơn vị',
        width: 200,
        align: 'left',
      },
      {
        id: 'bussinesStaff',
        label: 'NV kinh doanh',
        width: 250,
        align: 'left',
      },
      {
        id: 'createAt',
        label: 'Thời gian',
        width: 200,
        align: 'left',
      },
      {
        id: 'createBy',
        label: 'Người tạo',
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
        id: 'options',
        label: '',
        width: 150,
        align: 'left',
      },
    ],
    [t],
  );

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListReservation(params));
  };

  useEffect(() => {
    fetchDataForPage(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  const getStatusItem = (status: string) => {
    if (!status) return '';
    switch (status) {
      case StatusTicketReservation.CREATE_TICKET:
        return StatusTicketReservation.CREATE_TICKET;
      case StatusTicketReservation.APPROVED_TICKET:
        return StatusTicketReservation.APPROVED_TICKET;
      case StatusTicketReservation.WAIT_APPROVE_TICKET:
        return StatusTicketReservation.WAIT_APPROVE_TICKET;
      case StatusTicketReservation.REFUSE_TICKET:
        return StatusTicketReservation.REFUSE_TICKET;
      case StatusTicketCanceled.APPROVED_CANCELED:
        return StatusTicketCanceled.APPROVED_CANCELED;
      case StatusTicketCanceled.CREATE_CANCELED:
        return StatusTicketCanceled.CREATE_CANCELED;
      case StatusTicketCanceled.REFUSE_CANCELED:
        return StatusTicketCanceled.REFUSE_CANCELED;
      case StatusTicketCanceled.WAIT_APPROVE_CANCELED:
        return StatusTicketCanceled.WAIT_APPROVE_CANCELED;
      default:
        if (status.includes('DEPOSIT')) {
          return StatusTicketReservation.APPROVED_TICKET;
        }
        return '';
    }
  };

  const renderReceiptsCode = (listReceipt: ReceiptsItem[]) => {
    if (listReceipt.length > 0) {
      return listReceipt.map(item => (
        <EllipsisText text={`${item?.code}`} line={1} />
      ));
    } else {
      return '-';
    }
  };

  const renderItem = (item: ReservationItem, index: number) => {
    const mainCustomerFilter = item?.customers?.filter(
      (customer: CustomerInReservation) => customer?.mainCustomer != null,
    );
    return [
      <EllipsisText
        text={`${item?.code}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
          if (
            checkPermissionExist(PermissionKeyEnum.TICKET_VIEW_ALL, userInfo) ||
            checkPermissionExist(PermissionKeyEnum.TICKET_APPROVE, userInfo) ||
            item?.user.id === userInfo?.id ||
            item?.staff.id === userInfo?.staff.id
          ) {
            handleSelectRow(item);
          } else return;
        }}
      />,
      renderReceiptsCode(item?.receipts),
      <EllipsisText text={`${item?.product?.code || '-'}`} line={1} />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.name || ''}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.phoneNumber || ''}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.identityNumber || ''}`}
        line={1}
      />,
      <EllipsisText text={`${item?.exchanges?.name || '--'}`} line={1} />,
      <EllipsisText text={`${item?.staff?.fullName || ''}`} line={1} />,
      <EllipsisText
        text={`${getLocalTime(item?.createdAt, 'HH:mm DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText text={`${item?.user?.staff?.fullName || ''}`} line={1} />,
      <RenderStatus
        isAsset
        status={
          getStatusItem(item.status) || StatusTicketReservation.CREATE_TICKET
        }
        pre_suf_fix={item.nodeName}
      />,

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {item?.status === StatusReservation.RESERVATION &&
          userInfo?.id === item?.createdBy && (
            <Tooltip title={'Gửi'}>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  setShowPopupConfirm({
                    isOpen: true,
                    rowSelected: item,
                  });
                }}
              >
                <img src={SEND_ICON} alt="icon send" />
              </IconButton>
            </Tooltip>
          )}
        {showBtnEdit &&
          userInfo?.id === item?.createdBy &&
          item?.status === StatusReservation.RESERVATION && (
            <Tooltip title={'Chỉnh sửa'}>
              <IconButton
                sx={{ ml: 2 }}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  navigate(
                    `/project/transaction-management/${id}/reservation/${item.id}/edit`,
                    {
                      state: {
                        typeCreate: StatusReservation.RESERVATION,
                      },
                    },
                  );
                }}
              >
                <img alt="edit icon" src={EDIT_ICON} />
              </IconButton>
            </Tooltip>
          )}
        {checkPermissionExist(PermissionKeyEnum.TICKET_CREATE, userInfo) && (
          <Tooltip title={'Sao chép'}>
            <IconButton
              sx={{ ml: 2 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                navigate(
                  `/project/transaction-management/${id}/reservation/${item.id}/copy`,
                  {
                    state: {
                      typeCreate: StatusReservation.RESERVATION,
                    },
                  },
                );
              }}
            >
              <img alt="copy icon" src={COPY_ICON} />
            </IconButton>
          </Tooltip>
        )}
      </div>,
    ];
  };

  const onPageChange = (page: number) => {
    // onFilterToQueryString({
    //   ...filter,
    //   page,
    // });
    setFilterParams({ ...filterParams, page });
  };

  const onPageSizeChange = (limit: number) => {
    // onFilterToQueryString({
    //   ...filter,
    //   page: 1,
    //   limit,
    // });
    setFilterParams({ ...filterParams, page: 1, limit });
  };

  const handleCloseConfirmPopup = () => {
    setShowPopupConfirm({
      isOpen: false,
      rowSelected: null,
    });
  };
  const handleConfirm = () => {
    if (showPopupConfirm.rowSelected?.id) {
      const payload = {
        ticketId: showPopupConfirm.rowSelected?.id,
      };
      dispatch(
        actions.sendTicketReservation(payload, (err?: any) => {
          if (err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Đã gửi yêu cầu duyệt phiếu giữ chỗ',
                type: 'success',
              }),
            );
            dispatch(
              actions.fetchListReservation(
                //   {
                //   ...filter,
                //   status: 'RESERVATION',
                //   projectId: id,
                // }
                filterParams,
              ),
            );
            setOpenCanceled({
              isOpen: false,
              ticketId: '',
              title: '',
            });
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  message || 'Gửi yêu cầu duyệt phiếu giữ chỗ không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
    handleCloseConfirmPopup();
  };

  const handleSelectRow = (data: ReservationItem) => {
    setOpenBookingDetail({
      isOpen: true,
      rowId: data.id,
    });
    setOpenCanceled({
      isOpen: false,
      ticketId: data.id,
      title: data.code,
    });
  };

  const handleClosePopupBookingDetail = () => {
    // navigate('.', { replace: false });
    setOpenBookingDetail({
      isOpen: false,
      rowId: '',
    });
    setIsRedirectToReceipt(false);
  };

  const handleCanceledReservation = () => {
    setOpenCanceled({
      ...openCanceled,
      isOpen: true,
    });
    handleClosePopupBookingDetail();
  };

  const handleCanceled = () => {
    const payload: CanceledRequest = {
      ticketId: openCanceled.ticketId || '',
      files: fileId || [],
    };
    dispatch(
      actions.doCanceledReservation(payload, (error?: any) => {
        if (error.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Yêu cầu hủy chỗ - hoàn tiền đã được gửi đi',
              type: 'success',
            }),
          );
          navigate(`/project/transaction-management/${id}`, {
            state: {
              tabActive: 3,
            },
          });
          dispatch(
            actions.fetchListReservation(
              //   {
              //   ...filter,
              //   status: 'RESERVATION',
              //   projectId: id,
              // }
              filterParams,
            ),
          );
          setOpenCanceled({
            isOpen: false,
            ticketId: '',
            title: '',
          });
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                error?.message === 'Internal server error'
                  ? 'Yêu cầu hủy chỗ - hoàn tiền không thành công'
                  : error?.message,
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        padding: '14px 16px 0px 16px',
      }}
    >
      <SocketManager events={events} />
      <Table
        headers={header}
        renderItem={renderItem}
        // onClickRow={handleSelectRow}
        items={reservationManagement?.data}
        pageNumber={filterParams.page}
        totalElements={reservationManagement?.total}
        sort={filterParams.orderBy}
        limitElement={filterParams.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        // isLoading={fetchListReservationLoading}
        isLoading={isLoading[actions.fetchListReservation.type]}
      />

      <ConfirmDialog
        isOpen={showPopupConfirm.isOpen}
        handleClose={handleCloseConfirmPopup}
        handleSubmit={handleConfirm}
        buttonMode="unset"
        actionName="Gửi duyệt"
      >
        <Box
          sx={{
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400,
            mb: '16px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '24px',
              mb: '16px',
            }}
          >
            Gửi yêu cầu duyệt phiếu giữ chỗ
          </Typography>
          <span>
            Bạn có chắc chắn muốn gửi yêu cầu duyệt phiếu giữ chỗ{' '}
            <strong>{showPopupConfirm.rowSelected?.code}</strong> này hay không?
          </span>
        </Box>
      </ConfirmDialog>

      {openBookingDetail.isOpen && (
        <BookingDetail
          type="reservation"
          isRedirectToReceipt={isRedirectToReceipt}
          isOpen={openBookingDetail.isOpen}
          bookingId={openBookingDetail.rowId}
          filterParams={
            // { ...filter, status: 'RESERVATION', projectId: id }
            filterParams
          }
          onClose={() => handleClosePopupBookingDetail()}
          onCanceledReservation={() => handleCanceledReservation()}
        />
      )}
      {openCanceled.ticketId && (
        <CanceledReservation
          isOpen={openCanceled.isOpen}
          ticketId={openCanceled.ticketId}
          title={openCanceled.title}
          onClose={() =>
            setOpenCanceled({
              isOpen: false,
              ticketId: '',
              title: '',
            })
          }
          fileId={fileId || []}
          setFileId={setFileId}
          handleSubmit={handleCanceled}
        />
      )}
    </Paper>
  );
}
