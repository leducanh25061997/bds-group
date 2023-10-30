import { Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Icon } from '@iconify/react';
import { DialogProtype } from 'types/Enum';
import { RenderTitleDialog } from 'utils/helpers';
import { Product } from 'types/ProductTable';

import { RenderContentBooking } from './components/RenderContentBooking';
import { RenderContentTranfer } from './components/RenderContentTranfer/index';
import { RenderContentEnterCustomerInformation } from './components/RenderContentEnterCustomerInformation';
import { RenderContentTransactionNotes } from './components/RenderContentTransactionNotes/index';
import { RenderContentRecall } from './components/RenderContentRecall/index';
import { RenderContentReturn } from './components/RenderContentReturn/index';
import { RenderContentRegister } from './components/RenderContentRegister/index';
import { RenderContentSendRequire } from './components/RenderContentSendRequire';
import { RenderContentConfirmSignUp } from './components/RenderContentConfirmSignUp';
export interface SimpleDialogProps {
  open: boolean;
  onClose: (v?: boolean) => void;
  type: DialogProtype;
  product: Product
  salesProgramId?: string;
}

const RenderContent = (type: DialogProtype, onClose: (v?: boolean) => void, product: Product, salesProgramId?: string) => {
  switch (type) {
    case DialogProtype.ENTER_CUSTOMER_INFORMATION:
      return <RenderContentEnterCustomerInformation onClose={onClose} product={product} />;
    case DialogProtype.RETURN:
      return <RenderContentReturn onClose={onClose} product={product} />;
    case DialogProtype.BOOKING:
      return <RenderContentBooking onClose={onClose} product={product} salesProgramId={salesProgramId}/>;
    case DialogProtype.TRANSACTION_NOTES:
      return <RenderContentTransactionNotes onClose={onClose} product={product} />;
      case DialogProtype.SEND_REQUIRE:
      return <RenderContentSendRequire onClose={onClose} product={product} />;
    case DialogProtype.CONFIRM_SIGN_UP:
      return <RenderContentConfirmSignUp onClose={onClose} product={product} />;
  //   case DialogProtype.OPEN_SELL:
  //     return <RenderContentOpenSell onClose={onClose} />;
    case DialogProtype.TRANFER:
      return <RenderContentTranfer onClose={onClose} product={product} salesProgramId={salesProgramId} />;
  //   case DialogProtype.LOCK_UP:
  //     return <RenderContentLockUp onClose={onClose} />;
    case DialogProtype.RECALL:
      return <RenderContentRecall onClose={onClose} product={product} />;
  //   case DialogProtype.UN_LOCK:
  //     return <RenderContentUnlock onClose={onClose} />;
  //   case DialogProtype.PRODUCT_PRIORITY_ASSEMBLY:
  //     return <RenderContentProductPriorityAssembly onClose={onClose} />;
    default:
      return <RenderContentRegister onClose={onClose} product={product} />;
     }
};

export function Modal(props: SimpleDialogProps) {
  const { onClose, open, type, product, salesProgramId } = props;

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
        {RenderContent(type, onClose, product, salesProgramId)}
      </DialogContent>
    </Dialog>
  );
}
