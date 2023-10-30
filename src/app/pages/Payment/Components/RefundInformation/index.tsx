import { Icon } from '@iconify/react';
import { Box, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from 'app/components/Button';
import { EllipsisText } from 'app/components/EllipsisText';
import { snackbarActions } from 'app/components/Snackbar/slice';
import { useProfile } from 'app/hooks';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import DocumentServices from 'services/api/document';
import { ReceiptsStatus, RefundsStatus, TypePaymentText } from 'types/Enum';
import { checkPermissionExist, formatCurrency } from 'utils/helpers';
import { get } from 'lodash';

import { useRefundSlice } from '../../Refunds/slice';
import { selectRefund } from '../../Refunds/slice/selectors';
import { DialogConfirmTicket } from 'app/pages/TransactionManagement/component/DialogConfirmTicket';

interface SimpleDialogType {
  open: boolean;
  handleClose: () => void;
  handleOpenDialogConfirm?: () => void;
  setTypeConfirm?: (value: string) => void;
  handleOpenDialogCancel?: () => void;
  id: string;
}

export const RefundInformation = (props: SimpleDialogType) => {
  const {
    handleClose,
    open,
    id,
    handleOpenDialogConfirm,
    setTypeConfirm,
    handleOpenDialogCancel,
  } = props;
  const dispatch = useDispatch();
  const { actions } = useRefundSlice();
  const userInfo = useProfile();
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const { refundInformation, isLoadingInfor } = useSelector(selectRefund);
  const navigate = useNavigate();
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [isOpenDialogConfirmTicket, setOpenDialogConfirmTicket] =
    useState(false);

  useEffect(() => {
    dispatch(actions.fetchRefundInformation(id));
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
        {`${key} :`}
      </Box>
    );
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
    if (!refundInformation?.ticketId) return;

    setOpenDialogConfirmTicket(false);
    try {
      setIsPrintingTicket(true);
      const data: { url: string } = await DocumentServices.printTicket(
        refundInformation?.ticketId, ticketType
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

  const canApprove = useMemo(() => {
    const workFlows = refundInformation?.workflow?.workFlows || [];
    const currentNodeId = refundInformation?.ticket?.currentNodeId;
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
    refundInformation?.workflow?.workFlows,
    refundInformation?.ticket?.currentNodeId,
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
          fontSize: '24px',
          lineHeight: '29px',
          color: '#1E1E1E',
        }}
      >
        Chi tiết phiếu hoàn tiền
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
              marginBottom: '28px',
            }}
          >
            <Box sx={{ width: '45%' }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography fontWeight={500}>Tên dự án:</Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={refundInformation?.ticket.project.name || ''}
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
                  <Typography fontWeight={500}>Mã sản phẩm:</Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  {refundInformation?.ticket?.product?.code || '--'}
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={500}>Mã giữ chỗ:</Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={refundInformation?.ticket.code || ''}
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
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography fontWeight={500}>Ngày tạo:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <EllipsisText
                    text={`${dayjs(refundInformation?.createdAt).format(
                      'HH:mm, DD/MM/YYYY',
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
                  <Typography fontWeight={500}>Số tiền:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <EllipsisText
                    text={`${formatCurrency(
                      refundInformation?.amountPaid || 0,
                    )} Vnđ`}
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
                  <Typography fontWeight={500}>Trạng thái:</Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}
                >
                  <EllipsisText
                    text={
                      refundInformation?.status === RefundsStatus.APPROVED
                        ? 'Đã duyệt'
                        : refundInformation?.status === RefundsStatus.WAITING
                        ? 'Chờ duyệt'
                        : 'Từ chối'
                    }
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
            }}
          >
            Thông tin chi tiết
          </Typography>
          <Grid container spacing={1}>
            {refundInformation?.code && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Mã phiếu hoàn')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(refundInformation?.code, true)}
                </Grid>
              </>
            )}
            <>
              <Grid item xs={3} mt={1}>
                {RenderKey('Mã giữ chỗ')}
              </Grid>
              <Grid item xs={9} mt={1}>
                {RenderValue(refundInformation?.ticket.code, true)}
              </Grid>
            </>
            {refundInformation?.customer.code && (
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
                      `/customer/customers-potential/${refundInformation?.customer?.id}`,
                    )
                  }
                >
                  {RenderValue(refundInformation?.customer.code, true)}
                </Grid>
              </>
            )}
            {refundInformation?.customer.name && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Tên khách hàng')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(refundInformation?.customer.name, false)}
                </Grid>
              </>
            )}
            {refundInformation?.customer.identityNumber && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Số CMND/CCCD')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    refundInformation?.customer.identityNumber,
                    false,
                  )}
                </Grid>
              </>
            )}
            {(refundInformation?.customer.street ||
              refundInformation?.customer.ward ||
              refundInformation?.customer.district ||
              refundInformation?.customer.province) && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Địa chỉ liên lạc')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    `${refundInformation?.customer.street}, ${refundInformation?.customer.ward}, ${refundInformation?.customer.district}, ${refundInformation?.customer.province}`,
                    false,
                  )}
                </Grid>
              </>
            )}
            {refundInformation?.refundNumber && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Số chứng từ')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    `${refundInformation?.refundNumber || ''}`,
                    false,
                  )}
                </Grid>{' '}
              </>
            )}

            <>
              <Grid item xs={3} mt={1}>
                {RenderKey('Số tiền')}
              </Grid>
              <Grid item xs={9} mt={1}>
                {RenderValue(
                  `${formatCurrency(refundInformation?.amountPaid || 0)} VND`,
                  false,
                )}
              </Grid>
            </>
            <Grid item xs={3} mt={1}>
              {RenderKey('Ngày tạo phiếu hoàn tiền')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(
                `${dayjs(refundInformation?.createdAt).format(
                  'HH:mm DD/MM/YYYY',
                )}` || '--',
                false,
              )}
            </Grid>
            {refundInformation?.receivedDate && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Ngày hoàn tiền')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    refundInformation?.receivedDate
                      ? `${refundInformation?.receivedTime} ${dayjs(
                          refundInformation?.receivedDate,
                        ).format('DD/MM/YYYY')}`
                      : '--',
                    false,
                  )}
                </Grid>
              </>
            )}
            <Grid item xs={3} mt={1}>
              {RenderKey('Nội dung thanh toán')}
            </Grid>
            <Grid item xs={9} mt={1}>
              {RenderValue(refundInformation?.contentPayment || '--', false)}
            </Grid>
            {refundInformation?.typePayment && (
              <>
                <Grid item xs={3} mt={1}>
                  {RenderKey('Phương thức giao dịch')}
                </Grid>
                <Grid item xs={9} mt={1}>
                  {RenderValue(
                    get(TypePaymentText, refundInformation?.typePayment) ||
                      '--',
                    false,
                  )}
                </Grid>
              </>
            )}
            {refundInformation?.note &&
              refundInformation?.status === 'APPROVED' && (
                <>
                  <Grid item xs={3} mt={1}>
                    {RenderKey('Ghi chú')}
                  </Grid>
                  <Grid item xs={9} mt={1}>
                    {RenderValue(refundInformation?.note || '-', false)}
                  </Grid>
                </>
              )}
            {refundInformation?.reason &&
              refundInformation?.status === 'CANCELED' && (
                <>
                  <Grid item xs={3} mt={1}>
                    {RenderKey('Ghi chú')}
                  </Grid>
                  <Grid item xs={9} mt={1}>
                    {RenderValue(refundInformation?.reason || '-', false)}
                  </Grid>
                </>
              )}
          </Grid>
        </Box>
      </DialogContent>
      {/* số tiền > số tiền đã thu ? nạp tiền : Duyệt */}
      <DialogActions
        sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
      >
        {isPermission &&
        canApprove &&
        refundInformation &&
        refundInformation.status !== RefundsStatus.APPROVED &&
        refundInformation.status !== RefundsStatus.CANCELED ? (
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
          isLoading={isPrintingTicket}
          buttonMode="print"
          sxProps={{
            borderRadius: '8px',
            minWidth: 130,
          }}
          handleClick={hanldeOpenDialogConfirmTicket}
        />
        <DialogConfirmTicket
          type={'canceled'}
          projectId={refundInformation?.ticket.projectId || ''}
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
