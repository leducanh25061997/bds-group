import React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import palette from 'styles/theme/palette';

import CustomButton from '../Button';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  title: string;
}

export default function ViewFileDialog(props: Props) {
  const { isOpen, handleClose, children, ...rest } = props;
  const theme = useTheme();
  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth={'lg'}>
      <DialogTitle sx={{ padding: '0px' }}>
        <Grid>
          <Grid
            sx={{
              height: '100px',
              padding: '7px 16px 8px 24px',
              background: theme.palette.common.white,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <Close
                sx={{
                  color: palette.primary.hint,
                  cursor: 'pointer',
                }}
                onClick={handleClose}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: theme.palette.common.black,
                }}
              >
                {rest.title}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ px: '9px' }}>{!!children && children}</DialogContent>
      <DialogActions>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomButton
            title="Đóng"
            variant="outlined"
            handleClick={handleClose}
            sxProps={{
              borderRadius: '8px',
              minWidth: { md: '128px' },
            }}
            sxPropsText={{
              fontWeight: 400,
            }}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
}
