import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  title: string;
}

export default function ViewContractDialog(props: Props) {
  const { isOpen, handleClose, children, ...rest } = props;
  const theme = useTheme();
  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <DialogTitle sx={{ padding: '0px' }}>
        <Grid>
          <Grid
            sx={{
              height: '44px',
              padding: '7px 16px 8px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: theme.palette.primary.lighter,
            }}
          >
            <Typography
              fontSize="16px"
              fontWeight={600}
              lineHeight="20px"
              color={theme.palette.grey[0]}
            >
              {rest.title}
            </Typography>
            <Close
              sx={{
                color: theme.palette.common.white,
                cursor: 'pointer',
              }}
              onClick={handleClose}
            />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ padding: '0px' }}>
        {!!children && children}
      </DialogContent>
    </Dialog>
  );
}
