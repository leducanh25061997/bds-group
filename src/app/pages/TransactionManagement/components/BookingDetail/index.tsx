import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { useProfile } from 'app/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import palette from 'styles/theme/palette';

import CustomButton from 'app/components/Button';
import { LoadingScreen } from 'app/components/Table';
import { useDispatch, useSelector } from 'react-redux';

import { selectProject } from 'app/pages/Projects/slice/selector';

import { FilterParams } from 'types';
import { CustomerTypeTitle } from 'types/Enum';
import { PermissionKeyEnum } from 'types/Permission';
import { CustomerItem } from 'types/User';

import { snackbarActions } from 'app/components/Snackbar/slice';
import CREATE_CONTRACT_ICON from 'assets/background/create-contract-icon.svg';
import axios from 'axios';
import DocumentServices from 'services/api/document';
import { StatusReservation } from 'types/Transaction';
import { checkPermissionExist } from 'utils/helpers';

import ProjectBaseInfo from '../../../Projects/components/ProjectBaseInfo';

import { useTransactionManagementSlice } from '../../slice';
import { selectTransactionManagement } from '../../slice/selector';
import {
  PayloadTicketAction,
  PaymentMethods,
  PaymentsInfo,
  StatusTicketCanceled,
  StatusTicketReservation,
} from '../../slice/type';

import { DialogConfirmTicket } from '../../component/DialogConfirmTicket';
import { ActionDialog } from './ActionDialog';
import ApprovedHistory from './ApprovedHistory';
import AssociateCustomer from './AssociateCustomer';
import BookingProcessStatus from './BookingProcessStatus';
import CustomerBasicInfo from './CustomerBasicInfo';
import FieldInfo from './FieldInfo';
import TicketHeader from './TicketHeader';

interface BookingDetailProps {
  bookingId: string;
  isOpen: boolean;
  onClose?: () => void;
  filterParams?: FilterParams;
  type: 'deposit' | 'reservation' | 'canceled';
  isRedirectToReceipt?: boolean;
  onCanceledReservation?: () => void;
  viewOnly?: boolean;
}

interface OpenDialog {
  approve: boolean;
  reject: boolean;
}

export const addressFormat = ({
  street,
  ward,
  district,
  province,
}: {
  street: string | null;
  ward: string;
  district: string;
  province: string;
}) => {
  return (
    (street ? `${street}, ` : '') +
    `${ward}, ${district}, ${province}, Việt Nam`
  );
};

const BookingDetail: React.FC<BookingDetailProps> = props => {
  const {
    bookingId,
    type,
    filterParams,
    isOpen,
    onClose,
    isRedirectToReceipt = false,
    onCanceledReservation,
    viewOnly = false,
  } = props;

  const userInfo = useProfile();
  const dispatch = useDispatch();
  const { actions } = useTransactionManagementSlice();
  const { bookingDetail, isLoading } = useSelector(selectTransactionManagement);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<OpenDialog>({
    approve: false,
    reject: false,
  });
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [isOpenDialogConfirmTicket, setOpenDialogConfirmTicket] =
    useState(false);

  const { ProjectDetail } = useSelector(selectProject);

  useEffect(() => {
    if (bookingId && !isRedirectToReceipt) {
      dispatch(
        actions.getDetailBooking({
          id: bookingId,
        }),
      );
    }

    return () => {
      dispatch(actions.clearDataBookingDetail());
    };
  }, [actions, dispatch, bookingId, isRedirectToReceipt]);

  const mainCustomer = useMemo(() => {
    const mainCustomerFilter = bookingDetail?.customers?.filter(
      customer => customer?.mainCustomer != null,
    );
    if (mainCustomerFilter?.length) return mainCustomerFilter[0];
    return null;
  }, [bookingDetail]);

  const listSubCustomer = useMemo(() => {
    return bookingDetail?.customers.reduce((acc, cur) => {
      if (cur.subCustomer != null) acc.push(cur.subCustomer);
      return acc;
    }, [] as CustomerItem[]);
  }, [bookingDetail]);

  const isGetDetailLoading = isLoading[actions.getDetailBooking.type];

  const handleClose = () => {
    onClose?.();
  };

  const handleOpen = (type: keyof OpenDialog) => (state: boolean) => {
    setConfirmDialogOpen(prev => {
      return {
        ...prev,
        [type]: state,
      };
    });
  };

  const handleApprove = (isApprove: boolean) => (reason?: string) => {
    if (!bookingDetail) return;

    const payload: PayloadTicketAction = {
      ticketId: bookingDetail.id,
      isApprove,
      reason: reason ? reason : '',
    };

    dispatch(
      actions.doTicketAction(payload, (err?: any) => {
        if (err?.success) {
          if (isApprove) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Đã duyệt phiếu ${dialogTitle}`,
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Từ chối phiếu ${dialogTitle} thành công`,
                type: 'success',
              }),
            );
          }
          handleClose();

          if (type === 'reservation') {
            dispatch(actions.fetchListReservation(filterParams));
            return;
          } else if (type === 'canceled') {
            dispatch(actions.fetchListCanceled(filterParams));
            return;
          } else {
            dispatch(actions.fetchListReservation(filterParams));
          }
        } else {
          let message = `${isApprove ? `Duyệt phiếu` : `Từ chối phiếu`} ${
            type === 'deposit' ? 'đặt cọc' : 'giữ chỗ'
          } không thành công`;
          if (err.response && err.response.data.message) {
            message = err.response.data.message;
          }
          dispatch(
            snackbarActions.updateSnackbar({
              message,
              type: 'error',
            }),
          );
        }
      }),
    );
  };
  const handlePrintTicket = () => async (ticketType: string) => {
    if (!bookingDetail?.id) return;
    setOpenDialogConfirmTicket(false);

    try {
      setIsPrintingTicket(true);
      const data: { url: string } = await DocumentServices.printTicket(
        bookingDetail?.id,
        ticketType,
      );

      const documentUrl = `${process.env.REACT_APP_API_URL}/${data.url}`;
      window.open(documentUrl, '_blank');

      dispatch(
        snackbarActions.updateSnackbar({
          message: 'In phiếu thành công',
          type: 'success',
        }),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status &&
          error.response?.status < 500 &&
          error.response?.status >= 400
        ) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: error.response?.data.message,
              type: 'error',
            }),
          );
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'In phiếu không thành công',
              type: 'error',
            }),
          );
        }
      }
    } finally {
      setIsPrintingTicket(false);
    }
  };

  const isShowApproveTicket = useMemo(() => {
    const index = bookingDetail?.workFlow.workFlows.findIndex(
      item => item.id === bookingDetail?.currentNodeId,
    );

    if (index === undefined || index < 0) return false;

    const workFlows = bookingDetail?.workFlow.workFlows;

    if (
      workFlows &&
      index + 1 === workFlows.length - 1 &&
      workFlows[workFlows.length - 1].staffs.findIndex(
        (staff: any) => staff.userId === userInfo?.id,
      ) >= 0
    )
      return false;

    const nextElement = bookingDetail?.workFlow.workFlows[index + 1];
    if (nextElement) {
      return (
        nextElement.staffs.findIndex(
          (staff: any) => staff.userId === userInfo?.id,
        ) >= 0
      );
    } else {
      return false;
    }
  }, [
    bookingDetail?.workFlow.workFlows,
    bookingDetail?.currentNodeId,
    userInfo?.id,
  ]);

  const canApprove = checkPermissionExist(
    PermissionKeyEnum.TICKET_APPROVE,
    userInfo,
  );

  const canCanceled = checkPermissionExist(
    PermissionKeyEnum.TICKET_CANCELED,
    userInfo,
  );

  const dialogTitle = useMemo(() => {
    switch (type) {
      case 'reservation':
        return 'giữ chỗ';
      case 'deposit':
        return 'đặt cọc';
      case 'canceled':
        return 'huỷ chỗ';
      default:
        return '';
    }
  }, [type]);

  const paymentTitle = useMemo(() => {
    return {
      [PaymentsInfo.TRANSFER]: 'Chuyển khoản',
      [PaymentsInfo.CASH]: 'Tiền mặt',
    };
  }, []);

  const paymentMethodTitle = useMemo(() => {
    return {
      [PaymentMethods.BORROW]: 'PTTT vay ngân hàng',
      [PaymentMethods.FAST]: 'PTTT nhanh',
      [PaymentMethods.STANDARD]: 'PTTT chuẩn',
    };
  }, []);

  const handleSendRequest = () => {
    if (bookingDetail?.id) {
      const payload = {
        ticketId: bookingDetail.id,
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
            handleClose();
            dispatch(actions.fetchListReservation(filterParams));
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
    }
  };

  const hanldeOpenDialogConfirmTicket = () => {
    setOpenDialogConfirmTicket(true);
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth={'md'}
      onClose={handleClose}
      scroll={'paper'}
    >
      <TicketHeader type={type} onClose={onClose} />
      <DialogContent>
        {isGetDetailLoading ? (
          <LoadingScreen>
            <img
              src="/static/loader/spinner.svg"
              alt=""
              width={100}
              height={100}
            />
          </LoadingScreen>
        ) : (
          !!bookingDetail && (
            <>
              {!!bookingDetail.workFlow && (
                <BookingProcessStatus bookingDetail={bookingDetail} />
              )}
              <ProjectBaseInfo projectInfo={ProjectDetail} />

              <Box sx={{ mt: 2.5 }}>
                <Typography
                  fontWeight={700}
                  color={palette.primary.button}
                  marginBottom={1.5}
                >
                  Thông tin khách hàng
                </Typography>
                <Stack spacing={1.5}>
                  {type === 'deposit' && (
                    <FieldInfo
                      label="Mã giữ chỗ (nếu có):"
                      content={
                        <>
                          {bookingDetail.code ? (
                            <MuiLink
                              component={Link}
                              to={`/project/transaction-management/${bookingDetail.projectId}`}
                              state={{
                                tabActive: 1,
                                tickId: bookingDetail.id,
                              }}
                              underline="hover"
                              sx={{
                                color: '#006EE6',
                              }}
                            >
                              {bookingDetail.code}
                            </MuiLink>
                          ) : (
                            ''
                          )}
                        </>
                      }
                    />
                  )}
                  {type !== 'canceled' && (
                    <FieldInfo
                      label="Mã sản phẩm (nếu có):"
                      content={bookingDetail.product?.code}
                    />
                  )}
                  <FieldInfo
                    label="Loại khách hàng:"
                    content={
                      CustomerTypeTitle[
                        mainCustomer?.mainCustomer
                          ?.type as keyof typeof CustomerTypeTitle
                      ]
                    }
                  />
                  {mainCustomer?.mainCustomer && (
                    <CustomerBasicInfo data={mainCustomer.mainCustomer} />
                  )}

                  <FieldInfo
                    label="Thông tin thanh toán:"
                    content={
                      paymentTitle[
                        bookingDetail.payments as keyof typeof paymentTitle
                      ]
                    }
                  />
                  <FieldInfo label="Mã số thuế:" content={bookingDetail.tax} />
                  <FieldInfo label="Ngân hàng:" content={bookingDetail.bank} />
                  <FieldInfo
                    label="Số tài khoản ngân hàng:"
                    content={bookingDetail.accountNumber}
                  />
                  <FieldInfo
                    label="Phương thức thanh toán:"
                    content={
                      paymentMethodTitle[
                        bookingDetail.paymentMethod as keyof typeof paymentMethodTitle
                      ]
                    }
                  />
                </Stack>
              </Box>
              <AssociateCustomer data={listSubCustomer} />
              <Box sx={{ mt: 2.5 }}>
                {type !== 'canceled' && (
                  <>
                    <Typography
                      fontWeight={700}
                      color={palette.primary.button}
                      marginBottom={1.5}
                    >
                      Thông tin khác
                    </Typography>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        marginBottom={1.5}
                      >
                        Khảo sát nhu cầu khách hàng
                      </Typography>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2.5}
                        >
                          <Typography variant="body2">
                            Khách hàng có nhu cầu vay ngân hàng không?
                          </Typography>
                          <Typography variant="body2">
                            {bookingDetail.bankLoanNeeds ? 'Có' : 'Không'}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2.5}
                        >
                          <Typography variant="body2">
                            Dự án quan tâm khác
                          </Typography>
                          <Typography variant="body2">
                            {bookingDetail.otherProjects ? 'Có' : 'Không'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                    {!!bookingDetail.note && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          marginBottom={1.5}
                        >
                          Ghi chú thêm
                        </Typography>
                        <Typography variant="body2">
                          {bookingDetail.note}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
                {bookingDetail.files && bookingDetail.files.length > 0 && (
                  <Box sx={{ mt: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      marginBottom={1.5}
                    >
                      Chứng từ liên quan (nếu có)
                    </Typography>
                    <Stack>
                      {bookingDetail.files?.map(file => (
                        <Box>
                          <MuiLink
                            key={file.id}
                            underline="hover"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              color: '#006EE6',
                              cursor: 'pointer',
                            }}
                            href={
                              process.env.REACT_APP_API_URL +
                              `/${file?.file?.path}`
                            }
                            target="_blank"
                          >
                            <AttachFileIcon
                              sx={{
                                width: '1.25rem',
                                height: '1.25rem',
                                mr: 0.5,
                                transform: 'rotate(45deg) scaleY(-1)',
                              }}
                            />
                            <span>{file?.file?.path}</span>
                          </MuiLink>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
              <Divider
                sx={{
                  my: 3,
                }}
              />
              {bookingDetail.recordApproveTickets.length > 0 && (
                <ApprovedHistory history={bookingDetail.recordApproveTickets} />
              )}
            </>
          )
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          {type === 'reservation' && (
            <>
              {bookingDetail?.status === StatusReservation.RESERVATION &&
                userInfo?.id === bookingDetail.createdBy && (
                  <CustomButton
                    title="Gửi"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,
                    }}
                    handleClick={() => handleSendRequest()}
                  />
                )}
              {canApprove &&
                isShowApproveTicket &&
                bookingDetail?.status !==
                  StatusTicketCanceled.WAIT_APPROVE_CANCELED &&
                bookingDetail?.status !== StatusReservation.RESERVATION && (
                  <>
                    <CustomButton
                      variant="outlined"
                      title="Từ chối"
                      sxProps={{
                        borderRadius: '8px',
                        minWidth: 130,

                        backgroundColor: '#FFE8E9',
                      }}
                      sxPropsText={{ color: '#1E1E1E' }}
                      handleClick={() => handleOpen('reject')(true)}
                    />
                    <CustomButton
                      variant="outlined"
                      title="Duyệt"
                      sxProps={{
                        borderRadius: '8px',
                        minWidth: 130,

                        borderColor: '#2FB350',
                        backgroundColor: '#D6F4DE',
                      }}
                      sxPropsText={{ color: '#2FB350' }}
                      handleClick={() => handleOpen('approve')(true)}
                    />
                  </>
                )}
            </>
          )}
          {type === 'deposit' && (
            <>
              {bookingDetail?.status === StatusReservation.DEPOSIT &&
                userInfo?.id === bookingDetail.createdBy && (
                  <CustomButton
                    title="Gửi"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,
                    }}
                    handleClick={() => handleSendRequest()}
                  />
                )}
              {canApprove && isShowApproveTicket && (
                <>
                  <CustomButton
                    variant="outlined"
                    title="Từ chối"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,

                      backgroundColor: '#FFE8E9',
                    }}
                    sxPropsText={{ color: '#1E1E1E' }}
                    handleClick={() => handleOpen('reject')(true)}
                  />
                  <CustomButton
                    variant="outlined"
                    title="Duyệt"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,

                      borderColor: '#2FB350',
                      backgroundColor: '#D6F4DE',
                    }}
                    sxPropsText={{ color: '#2FB350' }}
                    handleClick={() => handleOpen('approve')(true)}
                  />
                </>
              )}

              {bookingDetail?.currentNodeId &&
                bookingDetail.currentNodeId ===
                  bookingDetail.workFlow.workFlows[
                    bookingDetail.workFlow.workFlows.length - 1
                  ].id && (
                  <CustomButton
                    title="Tạo hợp đồng"
                    isIcon
                    buttonMode="print"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,
                    }}
                    iconNode={
                      <img src={CREATE_CONTRACT_ICON} alt="Contract Icon" />
                    }
                    // handleClick={() => handleOpen('reject')(true)}
                  />
                )}
            </>
          )}
          {type === 'canceled' && (
            <>
              {canApprove && isShowApproveTicket && !viewOnly && (
                <>
                  <CustomButton
                    variant="outlined"
                    title="Từ chối"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,

                      backgroundColor: '#FFE8E9',
                    }}
                    sxPropsText={{ color: '#1E1E1E' }}
                    handleClick={() => handleOpen('reject')(true)}
                  />
                  <CustomButton
                    variant="outlined"
                    title="Duyệt"
                    sxProps={{
                      borderRadius: '8px',
                      minWidth: 130,

                      borderColor: '#2FB350',
                      backgroundColor: '#D6F4DE',
                    }}
                    sxPropsText={{ color: '#2FB350' }}
                    handleClick={() => handleOpen('approve')(true)}
                  />
                </>
              )}
            </>
          )}
          {type === 'reservation' &&
            bookingDetail?.status === StatusTicketReservation.APPROVED_TICKET &&
            canCanceled &&
            !bookingDetail.isPriority && (
              <CustomButton
                title="Hủy chỗ, hoàn tiền"
                variant="outlined"
                sxProps={{
                  background: '#FFDEB8',
                  border: '1px solid #FC7900',
                  borderRadius: '8px',
                }}
                sxPropsText={{
                  color: '#1E1E1E',
                  fontWeight: 400,
                  fontSize: '16px',
                }}
                handleClick={onCanceledReservation}
              />
            )}
          <CustomButton
            title={'In phiếu'}
            isIcon
            isLoading={isPrintingTicket}
            buttonMode="print"
            sxProps={{
              borderRadius: '8px',
              minWidth: 130,
            }}
            handleClick={hanldeOpenDialogConfirmTicket}
          />
        </Stack>
      </DialogActions>

      <DialogConfirmTicket
        type={type}
        projectId={ProjectDetail?.id || ''}
        isOpenDialog={isOpenDialogConfirmTicket}
        title="In phiếu"
        actionName="In"
        description="Vui lòng chọn mẫu in phù hợp để thực hiện in phiếu."
        handleSubmit={handlePrintTicket()}
        setIsOpenDialog={setOpenDialogConfirmTicket}
      />

      <ActionDialog
        isOpenDialogSendRequest={confirmDialogOpen.approve}
        setIsOpenDialogSendRequest={handleOpen('approve')}
        title={`Duyệt phiếu ${dialogTitle}`}
        description={
          <>
            Bạn có chắc chắn muốn duyệt phiếu {`${dialogTitle}`}{' '}
            <b>
              {type === 'reservation'
                ? bookingDetail?.code
                : bookingDetail?.depositCode}
            </b>{' '}
            này không?
          </>
        }
        actionName="Duyệt"
        handleSubmit={handleApprove(true)}
      />

      <ActionDialog
        isOpenDialogSendRequest={confirmDialogOpen.reject}
        setIsOpenDialogSendRequest={handleOpen('reject')}
        title={`Huỷ phiếu ${dialogTitle}`}
        description={
          <>
            Bạn có chắc chắn muốn huỷ phiếu {`${dialogTitle}`}{' '}
            <b>{bookingDetail?.code}</b> này không?
          </>
        }
        actionName="Xác nhận"
        handleSubmit={handleApprove(false)}
        isReject
      />
    </Dialog>
  );
};

export default BookingDetail;
