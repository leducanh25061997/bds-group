import {
  Box,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
  DialogTitle,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from 'app/components/Button';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import COPY_ICON from 'assets/background/copy-icon.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import SEND_ICON from 'assets/background/send-icon-green.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';
import { FilterParams, TableHeaderProps } from 'types';
import {
  CustomerInReservation,
  DepositItem,
  ReceiptsItem,
  ReservationItem,
  StatusReservation,
} from 'types/Transaction';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import CloseIcon from '@mui/icons-material/Close';

import BookingDetail from 'app/pages/TransactionManagement/components/BookingDetail';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RenderStatus from 'app/components/RenderStatus';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import EditProcess from 'app/pages/ProcessManagement/edit';
import {
  checkPermissionExist,
  formatCurrency,
  getLocalTime,
} from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import { EventSocketListen, WorkFlowTypeEnum } from 'types/Enum';
import SocketManager, { EventSocket } from 'app/components/Socket';

import { useTransactionManagementSlice } from '../../slice';
import { DialogRequest } from '../../component/DialogRequest';
import { selectTransactionManagement } from '../../slice/selector';
import { TypePopupActionTicket } from '../reservationTable';
import { StatusTicketDeposit } from '../../slice/type';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StateLocationProps {
  tabActive: number | string;
  tickId: string;
}

export default function ListDeposit() {
  const { t } = useTranslation();
  const { actions } = useTransactionManagementSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { depositManagement, isLoading, paramsSearch } = useSelector(
    selectTransactionManagement,
  );
  const { workFlowInformation } = useSelector(selectManagementInformation);
  const userInfo = useProfile();
  const showBtnEdit = useMemo(() => {
    //user have permission edit
    if (userInfo?.role == null) return false;
    const display = userInfo?.role?.permissions.findIndex(
      e => e.key === 'ticket.update',
    );
    if (display !== undefined && display >= 0) return true;
    return false;
  }, [userInfo?.role]);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      checkStatus: true,
      status: 'DEPOSIT',
      projectId: id,
    };
  }, [id]);
  const [filterParams, setFilterParams] = useState<FilterParams>(
    useCallback(() => initialFilter, [initialFilter]),
  );
  // const interval = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogSendRequest, setDialogSendRequest] =
    useState<TypePopupActionTicket>({
      isOpen: false,
      rowSelected: null,
    });
  const [isRedirectToReceipt, setIsRedirectToReceipt] =
    useState<boolean>(false);
  const { state } = useLocation();

  const locationProps = state as StateLocationProps;

  const [openBookingDetail, setOpenBookingDetail] = useState({
    isOpen: false,
    rowId: '',
  });

  const [openReservationDetail, setOpenReservationDetail] = useState({
    isOpen: false,
    id: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(
        projectSettingActions.fetchWorkFlowTree({
          id,
          type: WorkFlowTypeEnum.DEPOSIT,
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    if (locationProps && locationProps.tickId) {
      setIsRedirectToReceipt(true);
      setOpenBookingDetail({
        isOpen: true,
        rowId: locationProps.tickId,
      });
    }
  }, [locationProps]);

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_TICKET_DEPOSITE,
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

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id_deposit',
        label: 'Mã đặt cọc',
        align: 'left',
        width: 200,
      },
      {
        id: 'id_reservation',
        label: 'Mã giữ chỗ',
        align: 'left',
        width: 200,
      },
      {
        id: 'id_payment',
        label: 'Mã thanh toán',
        width: 200,
        align: 'left',
      },
      // {
      //   id: 'id_contract',
      //   label: 'Mã hợp đồng',
      //   width: 200,
      //   align: 'left',
      // },
      {
        id: 'id_product',
        label: 'Mã sản phẩm',
        width: 200,
        align: 'left',
      },
      {
        id: 'price',
        label: 'Số tiền',
        width: 200,
        align: 'left',
      },
      {
        id: 'customer',
        label: 'Khách hàng',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone_number',
        label: 'Điện thoại',
        width: 200,
        align: 'left',
      },
      {
        id: 'identity_card',
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
    dispatch(
      actions.fetchListDeposit({
        ...params,
        status: 'DEPOSIT',
        projectId: id,
      }),
    );
  };

  useEffect(() => {
    if (paramsSearch) {
      setFilterParams({ ...filterParams, ...paramsSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSearch]);

  useEffect(() => {
    dispatch(actions.updateParamsSearch(initialFilter));
    return () => {
      dispatch(actions.clearListDeposit());
      // dispatch(actions.clearParamsSearch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDataForPage(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  const TabPanel = (props: TabPanelProps) => {
    const { children, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        // hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {/* {value === index && ( */}
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
        {/* )} */}
      </div>
    );
  };

  const getStatusItem = (status: string) => {
    if (!status) return '';
    switch (status) {
      case StatusTicketDeposit.CREATE_DEPOSIT:
        return StatusTicketDeposit.CREATE_DEPOSIT;
      case StatusTicketDeposit.APPROVED_DEPOSIT:
        return StatusTicketDeposit.APPROVED_DEPOSIT;
      case StatusTicketDeposit.WAIT_APPROVE_DEPOSIT:
        return StatusTicketDeposit.WAIT_APPROVE_DEPOSIT;
      case StatusTicketDeposit.REFUSE_DEPOSIT:
        return StatusTicketDeposit.REFUSE_DEPOSIT;
      default:
        return '';
    }
  };

  const renderReceiptsCode = (listReceipt: ReceiptsItem[]) => {
    if (listReceipt.length > 0) {
      return listReceipt.map(item => (
        <EllipsisText text={`${item?.code}`} line={1} />
      ));
    } else {
      return '--';
    }
  };

  const renderItem = (item: DepositItem, index: number) => {
    const mainCustomerFilter = item?.customers?.filter(
      (customer: CustomerInReservation) => customer?.mainCustomer != null,
    );
    const totalPriceSum = item?.receipts?.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );
    return [
      <EllipsisText
        text={`${item.depositCode ? item.depositCode : '-'}`}
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
      <EllipsisText
        text={`${item?.code ?? ''}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          // event.stopPropagation();
          // if (item.code) {
          //   navigate(`/project/transaction-management/${item.projectId}`, {
          //     state: {
          //       tabActive: 1,
          //       tickId: item.id,
          //     },
          //   });
          // }
          event.stopPropagation();
          if (
            checkPermissionExist(PermissionKeyEnum.TICKET_VIEW_ALL, userInfo) ||
            checkPermissionExist(PermissionKeyEnum.TICKET_APPROVE, userInfo) ||
            item?.user.id === userInfo?.id ||
            item?.staff.id === userInfo?.staff.id
          ) {
            if (item.code) {
              handleSelectReservation(item.id);
            }
          } else return;
        }}
      />,
      renderReceiptsCode(item?.receipts),
      <EllipsisText text={`${item?.product?.code || '-'}`} line={1} />,
      <EllipsisText
        text={`${formatCurrency(totalPriceSum) || '-'}đ`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.name}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.phoneNumber}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.identityNumber}`}
        line={1}
      />,
      <EllipsisText text={`${item?.exchanges?.name}`} line={1} />,
      <EllipsisText text={`${item?.staff?.fullName || ''}`} line={1} />,
      <EllipsisText
        text={`${getLocalTime(item?.createdAt, 'HH:mm DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText text={`${item?.user?.staff?.fullName || ''}`} line={1} />,
      <RenderStatus
        isAsset
        pre_suf_fix={item.nodeName}
        status={
          getStatusItem(item.status) || StatusTicketDeposit.CREATE_DEPOSIT
        }
      />,
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {item?.status === StatusReservation.DEPOSIT &&
          userInfo?.id === item?.createdBy && (
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setDialogSendRequest({
                  isOpen: true,
                  rowSelected: item,
                });
              }}
            >
              <Tooltip title="Gửi">
                <img src={SEND_ICON} alt="send icon" />
              </Tooltip>
            </IconButton>
          )}
        {(showBtnEdit || userInfo?.id === item?.createdBy) &&
          item?.status === StatusReservation.DEPOSIT && (
            <IconButton
              sx={{ ml: 1 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                navigate(
                  `/project/transaction-management/${id}/reservation/${item.id}/edit`,
                  {
                    state: {
                      typeCreate: StatusReservation.DEPOSIT,
                    },
                  },
                );
              }}
            >
              <Tooltip title="Chỉnh sửa">
                <img alt="edit icon" src={EDIT_ICON} />
              </Tooltip>
            </IconButton>
          )}
        {checkPermissionExist(PermissionKeyEnum.TICKET_CREATE, userInfo) && (
          <IconButton
            sx={{ ml: 1 }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              navigate(
                `/project/transaction-management/${id}/reservation/${item.id}/copy`,
                {
                  state: {
                    typeCreate: StatusReservation.DEPOSIT,
                  },
                },
              );
            }}
          >
            <Tooltip title="Copy">
              <img alt="copy icon" src={COPY_ICON} />
            </Tooltip>
          </IconButton>
        )}
      </div>,
    ];
  };

  const handleRequestSort = (event: any, property: string) => {
    // onFilterToQueryString({
    //   ...filter,
    //   sortByName: filter?.sortByName === 'true' ? 'false' : 'true',
    // });
    setFilterParams({
      ...filterParams,
      sortByName: filterParams?.sortByName === 'true' ? 'false' : 'true',
    });
  };

  const onPageChange = (page: number) => {
    // onFilterToQueryString({
    //   ...filter,
    //   page,
    // });
    setFilterParams({
      ...filterParams,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    // onFilterToQueryString({
    //   ...filter,
    //   page: 1,
    //   limit,
    // });
    setFilterParams({
      ...filterParams,
      page: 1,
      limit,
    });
  };

  const handleSelectRow = (data: ReservationItem) => {
    setOpenBookingDetail({
      isOpen: true,
      rowId: data.id,
    });
  };

  const handleSelectReservation = (id: string) => {
    setOpenReservationDetail({
      isOpen: true,
      id,
    });
  };
  const handleSendRequest = () => {
    if (dialogSendRequest.rowSelected?.id) {
      const payload = {
        ticketId: dialogSendRequest.rowSelected?.id,
      };
      dispatch(
        actions.sendTicketReservation(payload, (err?: any) => {
          if (err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Đã gửi yêu cầu duyệt phiếu đặt cọc',
                type: 'success',
              }),
            );
            dispatch(
              actions.fetchListReservation(
                //   {
                //   ...filter,
                //   status: 'DEPOSIT',
                //   projectId: id,
                // }
                filterParams,
              ),
            );
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  message || 'Gửi yêu cầu duyệt phiếu đặt cọc không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
      setDialogSendRequest({ isOpen: false, rowSelected: null });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        overflow: 'hidden',
      }}
    >
      <SocketManager events={events} />
      <Box
        sx={{
          background: '#E0E1E4',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            background: '#475160',
            height: '40px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: '14px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Inter',
              mr: '5px',
            }}
          >
            Phiếu ĐC:
          </Typography>
          <Typography
            sx={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Inter' }}
          >
            {depositManagement?.totalStatistic ?? 0}
          </Typography>
          {/* <p>Phiếu ĐC:</p>
          <p style={{ fontWeight: 700, marginLeft: '10px' }}>
            {depositManagement?.totalStatistic ?? 0}
          </p> */}
        </Box>
        <CustomButton
          title="Quy trình duyệt đặt cọc"
          variant="outlined"
          isIcon
          buttonMode="process"
          sxProps={{
            borderRadius: '0 20px 0 0',
            background: '#E0E1E4',
            color: palette.primary.button,
            height: '40px',
            borderColor: 'transparent',
          }}
          handleClick={() => {
            if (workFlowInformation?.id) {
              setIsOpen(true);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    'Không xem được thiết lập dự án. Vui lòng kiểm tra lại!',
                  type: 'error',
                }),
              );
            }
          }}
          sxPropsText={{ fontSize: '14px' }}
        />
      </Box>
      {/* <TabPanel value={0} index={0}> */}
      <Box
        sx={{
          padding: '14px 16px 0px 16px',
        }}
      >
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={depositManagement?.data}
          pageNumber={filterParams.page}
          totalElements={depositManagement?.total}
          sort={filterParams.orderBy}
          limitElement={filterParams.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // isLoading={isFetchListDepositLoading}
          isLoading={isLoading[actions.fetchListDeposit.type]}
          dataType={'DepositManagement'}
          // onSelectRow={handleSelectRow}
        />
      </Box>
      {/* </TabPanel> */}
      <DialogRequest
        isOpenDialogSendRequest={dialogSendRequest.isOpen}
        setIsOpenDialogSendRequest={setDialogSendRequest}
        title="Gửi yêu cầu duyệt phiếu đặt cọc"
        description={`Bạn có chắc chắn muốn gửi yêu cầu duyệt phiếu đặt cọc ${dialogSendRequest.rowSelected?.depositCode} này không ?`}
        actionName="Gửi duyệt"
        handleSubmit={handleSendRequest}
      />
      {/* <DialogRequest
        isOpenDialogSendRequest={dialogApproveRequest}
        setIsOpenDialogSendRequest={setDialogApproveRequest}
        title="Duyệt phiếu đặt cọc"
        description="Bạn có chắc chắn muốn duyệt phiếu giữ chỗ GC-00002947
        này không ?"
        actionName="Duyệt"
      /> */}

      {openBookingDetail.isOpen && (
        <BookingDetail
          type="deposit"
          isOpen={openBookingDetail.isOpen}
          bookingId={openBookingDetail.rowId}
          filterParams={
            // { ...filter, status: 'DEPOSIT', projectId: id }
            filterParams
          }
          onClose={() =>
            setOpenBookingDetail({
              isOpen: false,
              rowId: '',
            })
          }
        />
      )}

      {openReservationDetail.isOpen && (
        <BookingDetail
          type="reservation"
          isOpen={openReservationDetail.isOpen}
          bookingId={openReservationDetail.id}
          filterParams={{
            ...filterParams,
            status: 'RESERVATION',
          }}
          onClose={() =>
            setOpenReservationDetail({
              isOpen: false,
              id: '',
            })
          }
        />
      )}

      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '1000px' } }}
        maxWidth={'md'}
      >
        <Box sx={{ position: 'absolute', top: '14px', right: '16px' }}>
          <IconButton aria-label="delete" onClick={handleClose}>
            <CloseIcon
              sx={{ width: 26, height: 26, color: palette.button.greyLighter }}
            />
          </IconButton>
        </Box>
        <DialogTitle
          sx={{
            color: '#1E1E1E',
            fontSize: '24px !important',
            fontWeight: '700 !important',
            textAlign: 'center',
          }}
        >
          Quy trình duyệt đặt cọc
        </DialogTitle>
        <EditProcess isEdit isShow idShow={workFlowInformation?.id || ''} />
      </Dialog>
    </Paper>
  );
}
