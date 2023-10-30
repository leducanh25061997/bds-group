import {
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Grid,
  DialogActions,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import Button from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useCallback, useMemo } from 'react';
import palette from 'styles/theme/palette';

import { AdditionalProductItem } from '../../slice/types';

interface Props {
  open: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  selectedProducts: AdditionalProductItem[];
}

export function DeleteProductDialog(props: Props) {
  const {
    open,
    onClose,
    // setIsOpenDialogSendRequest,
    // title,
    // description,
    // actionName,
    handleSubmit,
    selectedProducts,
  } = props;

  const handleCloseActionDialog = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    handleSubmit?.();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={open}
      onClose={handleCloseActionDialog}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: '#1E1E1E',
          pt: 3,
          pb: 2,
        }}
        variant="h4"
      >
        Xóa sản phẩm
        <IconButton
          aria-label="close"
          onClick={handleCloseActionDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '0px 44px' }}>
        <Box mb={2}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              padding: '0 24px',
            }}
          >
            Bạn có chắc chắn muốn xóa{' '}
            <Typography component={'span'} color="primary.darkRed">
              {selectedProducts.length}
            </Typography>{' '}
            sản phẩm này không?
          </Typography>

          <Box
            sx={{
              backgroundColor: '#555E6C',
              borderRadius: 1,
              mt: 2,
              px: 2.5,
              py: 2,
            }}
          >
            <Grid container rowSpacing={1.5} columnSpacing={2} sx={{}}>
              {selectedProducts.map(product => (
                <Grid item xs={3} key={product.uuid}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    {product.code}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <Button
          title="Hủy"
          variant="outlined"
          handleClick={() => handleCloseActionDialog()}
          sxProps={{
            borderRadius: '8px',
            minWidth: '135px',
            marginRight: '42px',
            ':hover': {
              border: `1px solid ${palette.primary.button}`,
              color: palette.common.white,
              background: palette.primary.button,
            },
          }}
          sxPropsText={{ fontWeight: 400 }}
        />
        <Button
          title={'Xoá'}
          typeButton="submit"
          sxProps={{
            background: '#D45B7A',
            borderRadius: '8px',
            minWidth: '135px',
          }}
          sxPropsText={{ color: '#FFFFFF' }}
          handleClick={() => handleConfirm()}
        />
      </DialogActions>
    </Dialog>
  );
}
