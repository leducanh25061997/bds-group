import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import { EllipsisText } from 'app/components/EllipsisText';
import CustomButton from 'app/components/Button';
import PRINT_ICON from 'assets/icons/print-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { CURRENCY_NUMBER } from 'utils/helpers/regex';
import { checkPermissionExist, formatCurrency } from 'utils/helpers';
import { ReceiptsStatus, TypePaymentText } from 'types/Enum';
import { useNavigate } from 'react-router';
import { useProfile } from 'app/hooks';
import { PermissionKeyEnum } from 'types/Permission';
import { Permission } from 'types';
import DocumentServices from 'services/api/document';
import { snackbarActions } from 'app/components/Snackbar/slice';
import CircularProgress from '@mui/material/CircularProgress';
import { StatusTicketReservation } from 'app/pages/TransactionManagement/slice/type';
import { get } from 'lodash';

import { Transactions } from '../../Receipts/slice/types';
import { usePaymentSlice } from '../../Receipts/slice';
import { selectReceipt } from '../../Receipts/slice/selectors';
import { DialogConfirmTicket } from 'app/pages/TransactionManagement/component/DialogConfirmTicket';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  handleOpenDialogConfirm?: () => void;
  setTypeConfirm?: (value: string) => void;
  handleOpenDialogCancel?: () => void;
  id: string;
}

export const ReceiptInformation = (props: SimpleDialogType) => {
  const {
    handleClose,
    open,
    id,
    handleOpenDialogConfirm,
    setTypeConfirm,
    handleOpenDialogCancel,
  } = props;
  const dispatch = useDispatch();
  const { actions } = usePaymentSlice();
  const userInfo = useProfile();
  const [isPermission, setIsPermission] = useState<boolean>(false);

  const { receiptInformation, isLoadingInfor } = useSelector(selectReceipt);
  const navigate = useNavigate();
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [isOpenDialogConfirmTicket, setOpenDialogConfirmTicket] =
    useState(false);

  useEffect(() => {
    dispatch(actions.fetchReceiptInformation(id));
  }, [id]);


  useEffect(() => {
    if (userInfo && userInfo.role.permissions && userInfo.staffId) {
      const checkPermission = checkPermissionExist('receipt.approve', userInfo);
      const isCheck = checkPermission;
      setIsPermission(isCheck);
    }
  }, [userInfo]);

  const RenderKey = (key: string) => {
    return (
      <Box
        sx={{
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '24px',
          color: '#1E1E1E',
        }}
      >
        {`${key}:`}
      </Box>
    );
  };

  const RenderStatus = (value?: ReceiptsStatus) => {
    switch (value) {
      case ReceiptsStatus.CANCELED:
        return 'Huỷ bỏ';
        break;
      case ReceiptsStatus.APPROVED:
        return 'Phê duyệt';
        break;
      default:
        return 'Chờ phê duỵêt';
        break;
    }
  };

  const RenderValue = (value?: string, isLink?: boolean) => {
    return (
      <Box
        sx={{
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          color: isLink ? '#006EE6' : '#1E1E1E',
        }}
      >
        {`${value}`}
      </Box>
    );
  };

  const handleApprove = () => {
    handleClose();
    setTypeConfirm && setTypeConfirm('Approve');
    handleOpenDialogConfirm && handleOpenDialogConfirm();
  };

  const handleRecharge = () => {
    handleClose();
    setTypeConfirm && setTypeConfirm('Recharge');
    handleOpenDialogConfirm && handleOpenDialogConfirm();
  };

  const handleCancel = () => {
    handleClose();
    handleOpenDialogCancel && handleOpenDialogCancel();
  };

  const handlePrintTicket = () => async (ticketType: string) => {
    if (!receiptInformation?.ticketId) return;

    setOpenDialogConfirmTicket(false);
    try {
      setIsPrintingTicket(true);
      const data: { url: string } = await DocumentServices.printReceiptTicket(
        receiptInformation?.id,
        ticketType
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

  const remainingMoney = useMemo(() => {
    const remain =
      Number(receiptInformation?.bookingAmountReservation) -
      Number(receiptInformation?.amountPaid);
    if (!remain || remain < 0) {
      return 0;
    }
    return remain;
  }, [receiptInformation]);

  const canApprove = useMemo(() => {
    const workFlows = receiptInformation?.workflow?.workFlows || [];
    const currentNodeId = receiptInformation?.ticket?.currentNodeId;
    const currentNodeIndex = workFlows.findIndex(
      item => item.id === currentNodeId,
    );

    if (currentNodeIndex === -1) {
      return false;
    }

    const nextElement = workFlows[currentNodeIndex + 1] || null;

    if (currentNodeIndex + 1 === workFlows.length - 1 && nextElement) {
      const staffIndex = nextElement.staffs.findIndex(
        staff => staff.userId === userInfo?.id,
      );
      if (staffIndex !== -1) {
        return true;
      }
    }

    return false;
  }, [
    receiptInformation?.workflow?.workFlows,
    receiptInformation?.ticket?.currentNodeId,
    userInfo?.id,
  ]);

  const hanldeOpenDialogConfirmTicket = () => {
    setOpenDialogConfirmTicket(true);
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1E1E1E',
        }}
        variant="h4"
      >
        Chi tiết phiếu thu
      </DialogTitle>
      <Box
        sx={{
          position: 'absolute',
          right: '16px',
          top: '10px',
          cursor: 'pointer',
        }}
      >
        <Icon
          icon="mdi:remove"
          color="#d9d9d9"
          width="18"
          height="28"
          onClick={handleClose}
        />
      </Box>
      <DialogContent sx={{ padding: '10px 24px' }}>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19px',
              color: '#D6465F',
            }}
          >
            Thông tin chung
          </Typography>
          <Box
            sx={{
              background: '#475160',
              borderRadius: '8px',
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 22px',
              color: '#FFFFFF',
              marginBottom: '12px',
            }}
          >
            <Box sx={{ width: '45%' }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  Tên dự án:
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={receiptInformation?.ticket.project.name || ''}
                    line={1}
                    color={'#FFFFFF'}
                    fontWeight={700}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '19px',
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  Mã sản phẩm:
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  {receiptInformation?.ticket?.product?.code || '--'}
                </Grid>
                <Grid item xs={4}>
                  Mã giữ chỗ:
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={receiptInformation?.ticket.code || ''}
                    line={1}
                    color={'#FFFFFF'}
                    fontWeight={700}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '19px',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ border: '1px solid #FFFFFF' }}></Box>
            <Box sx={{ width: '45%' }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  Ngày tạo:
                </Grid>
                <Grid item xs={8}>
                  <EllipsisText
                    text={`${dayjs(receiptInformation?.createdTime).format(
                      'HH:mm DD/MM/YYYY',
                    )}`}
                    line={1}
                    color={'#FFFFFF'}
                    fontWeight={700}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '19px',
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  Số tiền:
                </Grid>
                <Grid item xs={8}>
                  <EllipsisText
                    text={formatCurrency(
                      receiptInformation?.bookingAmountReservation || '',
                    )}
                    line={1}
                    fontWeight={700}
                    color={'#FFFFFF'}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '19px',
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  Trạng thái:
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={RenderStatus(receiptInformation?.status)}
                    line={1}
                    fontWeight={700}
                    color={'#FFFFFF'}
                    sx={{
                      fontSize: '16px',
                      lineHeight: '19px',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19px',
              color: '#D6465F',
              marginBottom: '12px',
            }}
          >
            Thông tin chi tiết
          </Typography>
          <Grid container spacing={1}>
            {receiptInformation?.receiptNumber && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Số chứng từ')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(receiptInformation?.receiptNumber)}
                </Grid>
              </>
            )}
            {receiptInformation?.code && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Mã phiếu thu')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(receiptInformation?.code, true)}
                </Grid>
              </>
            )}
            {receiptInformation?.customer?.code && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Mã khách hàng')}
                </Grid>
                <Grid
                  item
                  xs={9}
                  mt={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(
                      `/customer/customers-potential/${receiptInformation?.customer?.id}`,
                    )
                  }
                >
                  {RenderValue(receiptInformation?.customer?.code, true)}
                </Grid>
              </>
            )}
            {receiptInformation?.customer?.name && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Tên khách hàng')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(receiptInformation?.customer?.name, false)}
                </Grid>
              </>
            )}
            {receiptInformation?.customer?.identityNumber && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Số CMND/CCCD')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    receiptInformation?.customer?.identityNumber,
                    false,
                  )}
                </Grid>
              </>
            )}
            {(receiptInformation?.customer?.street ||
              receiptInformation?.customer?.ward ||
              receiptInformation?.customer?.district ||
              receiptInformation?.customer?.province) && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Địa chỉ liên lạc')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    `${receiptInformation?.customer?.street}, ${receiptInformation?.customer?.ward}, ${receiptInformation?.customer?.district}, ${receiptInformation?.customer?.province}`,
                    false,
                  )}
                </Grid>
              </>
            )}
            <Grid item xs={3} mt={1}>
              {RenderKey('Số tiền')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(
                `${formatCurrency(
                  Number(receiptInformation?.bookingAmountReservation) || '0',
                )} VND` || '--',
                false,
              )}
            </Grid>{' '}
            <>
              <Grid item xs={3} mt={1}>
                {RenderKey('Số tiền đã thu')}
              </Grid>
              <Grid item xs={9} mt={1}>
                {RenderValue(
                  `${formatCurrency(receiptInformation?.amountPaid || 0)} VND`,
                  false,
                )}
              </Grid>
            </>
            <Grid item xs={3} mt={1}>
              {RenderKey('Số tiền còn lại')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(`${formatCurrency(remainingMoney) || 0} VND`, false)}
            </Grid>
            <Grid item xs={3} mt={1}>
              {RenderKey('Hình thức thanh toán')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(
                `${
                  get(TypePaymentText, receiptInformation?.typePayment || '') ||
                  '--'
                }`,
                false,
              )}
            </Grid>
            <Grid item xs={3} mt={1}>
              {RenderKey('Ngày tạo phiếu thu')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(
                `${dayjs(receiptInformation?.createdTime).format(
                  'HH:mm DD/MM/YYYY',
                )}`,
                false,
              )}
            </Grid>
            {receiptInformation?.receivedDate ? (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Ngày nộp tiền')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    receiptInformation?.receivedDate
                      ? `${receiptInformation?.receivedTime} ${dayjs(
                          receiptInformation?.receivedDate,
                        ).format('DD/MM/YYYY')}`
                      : '-',
                    false,
                  )}
                </Grid>
              </>
            ) : null}
            <Grid item xs={3} mt={1}>
              {RenderKey('Ghi chú')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(receiptInformation?.note || '--', false)}
            </Grid>
            <Grid item xs={3} mt={1}>
              {RenderKey('Nội dung thanh toán')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(receiptInformation?.contentPayment || '--', false)}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      {/* số tiền > số tiền đã thu ? nạp tiền : Duyệt */}
      <DialogActions
        sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
      >
        {isPermission &&
        canApprove &&
        receiptInformation &&
        receiptInformation.status !== ReceiptsStatus.APPROVED ? (
          <React.Fragment>
            <CustomButton
              variant="outlined"
              title="Từ chối"
              sxProps={{
                borderRadius: '8px',
                minWidth: 130,

                backgroundColor: '#FFE8E9',
              }}
              sxPropsText={{ color: '#1E1E1E' }}
              handleClick={handleCancel}
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
              handleClick={handleApprove}
            />
          </React.Fragment>
        ) : null}

        <CustomButton
          title={'In phiếu'}
          isIcon
          buttonMode="print"
          isLoading={isPrintingTicket}
          sxProps={{
            borderRadius: '8px',
            minWidth: 130,
          }}
          handleClick={hanldeOpenDialogConfirmTicket}
        />

      <DialogConfirmTicket
        type={'reservation'}
        projectId={receiptInformation?.ticket.projectId || ''}
        isOpenDialog={isOpenDialogConfirmTicket}
        title="In phiếu"
        actionName="In"
        description="Vui lòng chọn mẫu in phù hợp để thực hiện in phiếu."
        handleSubmit={handlePrintTicket()}
        setIsOpenDialog={setOpenDialogConfirmTicket}
      />
      </DialogActions>
    </Dialog>
  );
};
