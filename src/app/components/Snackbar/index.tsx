import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import MuiSnackbar from '@mui/material/Snackbar';
import SUCCESS_ICON from 'assets/background/snackbar-success-icon.svg';
import ERROR_ICON from 'assets/background/error-snackbar-icon.svg';
import WARING_ICON from 'assets/background/warning-icon.svg';

import { selectSnackbar } from './slice/selectors';
import { useSnackbarSlice } from './slice';

const Snackbar = () => {
  const { open, message, type } = useSelector(selectSnackbar);
  const { actions } = useSnackbarSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        dispatch(actions.closeSnackbar());
      }, 3000);
    }
  }, [open]);

  return (
    <Box
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: 'fit-content',
        },
      }}
    >
      <MuiSnackbar
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        message={
          <Grid
            sx={() => ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            })}
          >
            {type === 'success' ? (
              <img src={SUCCESS_ICON} alt="Snackbar success icon" />
            ) : type === 'error' ? (
              <img src={ERROR_ICON} alt="Snackbar error icon" />
            ) : (
              <img src={ERROR_ICON} alt="Snackbar waring icon" />
            )}
            <Typography
              alignItems="center"
              variant="subtitle2"
              sx={{
                ml: 2,
              }}
              color={'#1E1E1E'}
            >
              {message}
            </Typography>
          </Grid>
        }
        key={'top right'}
        sx={theme => ({
          top: '105px !important',
          [theme.breakpoints.down('sm')]: {
            top: '25px !important',
            margin: theme.spacing(0, 5),
          },
          '& .MuiSnackbarContent-root': {
            background: type === 'success' ? '#D6F4DE' : type === 'error' ? '#FFE8E9' : "#fff5cc",
            borderRadius: '8px',
            boxShadow: '0px 4px 16px rgb(0 0 0 / 8%) !important',
            padding: '6px 38px 6px 26px',
          },
        })}
      />
    </Box>
  );
};

export default React.memo(Snackbar);
