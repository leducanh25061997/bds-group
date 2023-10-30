import { Box, useTheme } from '@mui/material';
import {
  StatusTicketCanceled,
  StatusTicketDeposit,
  StatusTicketReservation,
} from 'app/pages/TransactionManagement/slice/type';
import { get } from 'lodash';
import React from 'react';
import { Status, TransferTextStatus } from 'types/Enum';

interface Props {
  status: Status | StatusTicketReservation | StatusTicketDeposit | StatusTicketCanceled;
  isAsset?: boolean;
  pre_suf_fix?: string;
}

export default function RenderStatus({ status, isAsset, pre_suf_fix }: Props) {
  const theme = useTheme();
  const convertColorStatus = (
    status: Status | StatusTicketReservation | StatusTicketDeposit | StatusTicketCanceled,
  ) => {
    switch (status) {
      case Status.ACTIVE:
        return '#2FB350';
      case StatusTicketReservation.APPROVED_TICKET:
        return '#2FB350';
      case StatusTicketDeposit.APPROVED_DEPOSIT:
        return '#2FB350';
      case Status.EXPERTISE:
        return theme.palette.success.lighter;
      case Status.SENT:
        return theme.palette.success.lighter;
      case Status.APPROVED:
        return theme.palette.primary.lighter;
      case Status.REFUSE:
        return theme.palette.error.lighter;
      case StatusTicketReservation.REFUSE_TICKET:
        return theme.palette.error.lighter;
      case StatusTicketDeposit.REFUSE_DEPOSIT:
        return theme.palette.error.lighter;
      case Status.NEW:
        return theme.palette.primary.lighter;
      case StatusTicketReservation.CREATE_TICKET:
        return theme.palette.primary.lighter;
      case StatusTicketDeposit.CREATE_DEPOSIT:
        return theme.palette.primary.lighter;
      case StatusTicketReservation.WAIT_APPROVE_TICKET:
        return theme.palette.grey[500];
      case StatusTicketDeposit.WAIT_APPROVE_DEPOSIT:
        return theme.palette.grey[500];
      case Status.INACTIVE:
        return '#F93E42';
      default:
        return '';
    }
  };
  const renderAssetStatus = (
    status:
      | Status
      | StatusTicketReservation
      | StatusTicketDeposit
      | StatusTicketCanceled,
  ) => {
    if (isAsset && status === Status.ACTIVE) {
      return 'Đang sử dụng';
    } else if (isAsset && status === Status.INACTIVE) {
      return 'Ngưng sử dụng';
    } else if (isAsset && status === StatusTicketReservation.APPROVED_TICKET) {
      return 'Giữ chỗ thành công';
    } else if (isAsset && status === StatusTicketDeposit.APPROVED_DEPOSIT) {
      return 'Đặt cọc thành công';
    } else if (
      isAsset &&
      status === StatusTicketReservation.WAIT_APPROVE_TICKET
    ) {
      return `Chờ ${pre_suf_fix} duyệt`;
    } else if (isAsset && status === StatusTicketDeposit.WAIT_APPROVE_DEPOSIT) {
      return `Chờ ${pre_suf_fix} duyệt`;
    } else if (isAsset && status === StatusTicketReservation.REFUSE_TICKET) {
      return `${pre_suf_fix} đã từ chỗi`;
    } else if (isAsset && status === StatusTicketDeposit.REFUSE_DEPOSIT) {
      return `${pre_suf_fix} đã từ chỗi`;
    } else if (
      isAsset &&
      (status === StatusTicketReservation.CREATE_TICKET ||
        status === StatusTicketDeposit.CREATE_DEPOSIT)
    ) {
      return 'Khởi tạo';
    } else if (
      isAsset &&
      status === StatusTicketCanceled.WAIT_APPROVE_CANCELED
    ) {
      return `Chờ ${pre_suf_fix} XN`;
    } else if (isAsset && status === StatusTicketCanceled.APPROVED_CANCELED) {
      return `Hủy chỗ thành công`;
    } else if (isAsset && status === StatusTicketCanceled.CREATE_CANCELED) {
      return `Khởi tạo`;
    } else if (isAsset && status === StatusTicketCanceled.REFUSE_CANCELED) {
      return `${pre_suf_fix} đã từ chối`;
    }
  };
  return (
    <Box
      sx={{
        display: 'inline',
        p: '8px 12px',
        color: convertColorStatus(status),
        borderRadius: '4px',
        fontWeight: 400,
        fontSize: '14px',
      }}
    >
      {isAsset ? renderAssetStatus(status) : get(TransferTextStatus, status)}
    </Box>
  );
}
