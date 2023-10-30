import { Box, Typography } from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { SalesProgramItem } from '../slice/types';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  salesProgram?: SalesProgramItem;
  handleDelete: () => void;
}

export function DeleteSalesProgram(props: Props) {
  const { isOpen, handleClose, salesProgram, handleDelete } = props;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      handleClose={handleClose}
      handleSubmit={handleDelete}
      buttonMode="unset"
      actionName="Xóa"
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
          Xóa chương trình bán hàng
        </Typography>
        <span>
          Bạn có chắc chắn muốn xóa <strong>{salesProgram?.name}</strong> này
          hay không?
        </span>
      </Box>
    </ConfirmDialog>
  );
}
