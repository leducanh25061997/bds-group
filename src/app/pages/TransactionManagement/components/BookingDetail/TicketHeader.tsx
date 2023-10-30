import { DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import React from 'react';

interface TicketHeaderProps {
  onClose?: () => void;
  type: 'deposit' | 'reservation' | 'canceled' | 'customer';
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ type, onClose }) => {
  const title = () => {
    switch (type) {
      case 'reservation':
        return 'Chi tiết phiếu giữ chỗ';
      case 'customer':
        return 'Chi tiết khách hàng';
      case 'deposit':
        return 'Chi tiết phiếu đặt cọc';
      case 'canceled':
        return 'Chi tiết phiếu hủy chỗ - hoàn tiền';
      default:
        return 'Chi tiết phiếu';
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <DialogTitle
      sx={{
        m: 0,
        py: 2,
        px: 3.5,
        textAlign: 'center',
        color: '#1E1E1E',
      }}
      variant="h4"
    >
      {title()}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default TicketHeader;
