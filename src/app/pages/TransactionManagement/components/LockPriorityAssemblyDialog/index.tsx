import {
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';

interface LockPriorityAssemblyProtype {
  open: boolean;
  onClose: () => void;
  dialogTitle: string;
  subTitle: string;
  handleAction?: () => void;
}

export function LockPriorityAssemblyDialog(props: LockPriorityAssemblyProtype) {
  const { open, onClose, dialogTitle, subTitle, handleAction } = props;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (data: any) => {};

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'relative',
          boxShadow: '-4px 0px 8px 0px rgba(0, 0, 0, 0.15)',
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '29px',
          }}
        >
          {dialogTitle}
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
          <Box sx={{ padding: '0 70px', textAlign: 'center' }}>
            <Typography
              sx={{ color: '#1E1E1E', fontSize: '16px', lineHeight: '24px' }}
            >
              {subTitle}
            </Typography>
            <Box
              mt={3}
              mb={2}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CustomButton
                title="Hủy"
                handleClick={() => onClose()}
                sxProps={{
                  background: '#FFFFFF',
                  border: '1px solid #D6465F',
                  borderRadius: '8px',
                  width: '128px',
                  marginRight: '42px',
                }}
                sxPropsText={{ color: '#1E1E1E' }}
              />
              <CustomButton
                title="Xác nhận khoá"
                handleClick={() => handleAction && handleAction()}
                typeButton="submit"
                sxProps={{
                  background: '#D45B7A',
                  borderRadius: '8px',
                  width: 'max-content',
                }}
                sxPropsText={{ color: '#FFFFFF' }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
