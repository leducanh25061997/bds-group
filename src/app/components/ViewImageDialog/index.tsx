import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import deleteIcon from 'assets/background/close-icon.svg';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}

export default function ViewImageDialog(props: Props) {
  const { isOpen, handleClose, children, ...rest } = props;
  const theme = useTheme();
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ padding: '0px' }}>
        <Grid>
          <Grid
            sx={{
              height: 'max-content',
              minWidth: '50vh',
              pt: '10px',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              background: theme.palette.common.white,
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ p: 0 }}
              className="cursor-pointer absolute top-4 right-4"
            >
              <img src={deleteIcon} alt="delete-icon" height={20} width={20} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ padding: '0px' }}>
        {!!children && children}
      </DialogContent>
    </Dialog>
  );
}
