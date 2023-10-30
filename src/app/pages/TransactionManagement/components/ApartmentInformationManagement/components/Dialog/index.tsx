import { Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Icon } from '@iconify/react';
import { DialogProtype } from 'types/Enum';
import { RenderTitleDialog } from 'utils/helpers';

import { RenderContentBooking } from './RenderContentBooking';
import { RenderContentCreateContract } from './RenderContentCreateContract';
import { RenderContentLockUp } from './RenderContentLockUp';
import { RenderContentOpenSell } from './RenderContentOpenSell';
import { RenderContentRecall } from './RenderContentRecall';
import { RenderContentTranfer } from './RenderContentTranfer';
import { RenderContentTransactionNotes } from './RenderContentTransactionNotes';
import { RenderContentUnlock } from './RenderContentUnlock';
import { RenderContentRegister } from './RenderContentRegister';
import { RenderContentReturn } from './RenderContentReturn';
import { RenderContentProductPriorityAssembly } from './RenderContentProductPriorityAssembly';
import { RenderContentEnterCustomerInformation } from './RenderContentEnterCustomerInformation';
import { RenderContentTransferProductToSaleProgram } from './RenderContentTransferProductToSaleProgram';
import { RenderContentConfirmSignUp } from './RenderContentConfirmSignUp';
import { RenderContentSendRequire } from './RenderContentSendRequire';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  type: DialogProtype;
}

const RenderContent = (type: DialogProtype, onClose: () => void) => {
  switch (type) {
    case DialogProtype.ENTER_CUSTOMER_INFORMATION:
      return <RenderContentEnterCustomerInformation onClose={onClose} />;
    case DialogProtype.RETURN:
      return <RenderContentReturn onClose={onClose} />;
    case DialogProtype.BOOKING:
      return <RenderContentBooking onClose={onClose} />;
    case DialogProtype.TRANSACTION_NOTES:
      return <RenderContentTransactionNotes onClose={onClose} />;
    case DialogProtype.CREATE_CONTRACT:
      return <RenderContentCreateContract onClose={onClose} />;
    case DialogProtype.OPEN_SELL:
      return <RenderContentOpenSell onClose={onClose} />;
    case DialogProtype.TRANFER:
      return <RenderContentTranfer onClose={onClose} />;
    case DialogProtype.LOCK_UP:
      return <RenderContentLockUp onClose={onClose} />;
    case DialogProtype.RECALL:
      return <RenderContentRecall onClose={onClose} />;
    case DialogProtype.UN_LOCK:
      return <RenderContentUnlock onClose={onClose} />;
    case DialogProtype.PRODUCT_PRIORITY_ASSEMBLY:
      return <RenderContentProductPriorityAssembly onClose={onClose} />;
    case DialogProtype.TRANSFER_PRODUCT_TO_SALE_PROGRAM:
      return <RenderContentTransferProductToSaleProgram onClose={onClose} />;
    case DialogProtype.CONFIRM_SIGN_UP:
      return <RenderContentConfirmSignUp onClose={onClose} />;
    case DialogProtype.SEND_REQUIRE:
      return <RenderContentSendRequire onClose={onClose} />;
    default:
      return <RenderContentRegister onClose={onClose} />;
  }
};

export function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, type } = props;

  const handleClose = () => {
    onClose();
  };

  const renderSize = (type: DialogProtype) => {
    if (
      type === DialogProtype.REGISTER ||
      type === DialogProtype.ENTER_CUSTOMER_INFORMATION
    ) {
      return 'md';
    } else {
      return 'sm';
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={renderSize(type)}
      open={open}
      onClose={handleClose}
      // sx={{ zIndex: 1000000 }}
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
        {RenderTitleDialog(type)}
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
        {RenderContent(type, handleClose)}
      </DialogContent>
    </Dialog>
  );
}
