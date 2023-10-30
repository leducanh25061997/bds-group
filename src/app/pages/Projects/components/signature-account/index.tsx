import { Box, Dialog, Grid, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import SignaturePad from 'react-signature-canvas';
import document from 'services/api/document';
import { dataUrlToFile } from 'utils/helpers';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSignatureSuccess: (idSugnature: number) => void;
}

interface PayloadSignature {
  file: File | null;
}

export default function SignatureAccount(props: Props) {
  const { isOpen, handleClose, handleSignatureSuccess } = props;
  const signatureRef = useRef<any>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { handleSubmit } = useForm({
    mode: 'onSubmit',
  });

  const onSubmit = async (data: PayloadSignature) => {
    const image = signatureRef?.current?.toDataURL('image/png');
    const file = await dataUrlToFile(image, 'signature.jpeg');
    const fileIds = await document.uploadSimpleFile(file);
    const fileId = fileIds?.[0];
    handleSignatureSuccess?.(fileId);
    dispatch(
      snackbarActions.updateSnackbar({
        message: 'Thêm chữ ký thành công',
        type: 'success',
      }),
    );
    handleClose();
  };

  return (
    <Dialog
      sx={{ '& .MuiPaper-root': { maxWidth: 'unset' } }}
      open={isOpen}
      onClose={handleClose}
    >
      <Box sx={{ width: '1200px' }}>
        <form>
          <Box p={'12px 24px'} bgcolor={theme.palette.primary.lighter}>
            <Typography
              fontSize="24px"
              fontWeight={600}
              lineHeight="20px"
              color={theme.palette.grey[0]}
            >
              Chữ ký
            </Typography>
          </Box>
          <Box>
            <Box bgcolor={theme.palette.grey[0]} p={3}>
              <Box
                sx={{
                  border: '5px solid #C1C1C1',
                  borderRadius: '10px',
                }}
              >
                <SignaturePad
                  ref={signatureRef}
                  canvasProps={{
                    style: {
                      width: '100%',
                      height: '500px',
                    },
                  }}
                />
              </Box>
            </Box>
            <Grid
              container
              mt={3}
              px={3}
              pb={2.5}
              justifyContent="space-between"
            >
              <Grid item sm={9} container>
                <Grid item sm={3} />
              </Grid>
              <Grid item sm={3} container justifyContent="end">
                <CustomButton
                  title="Lưu"
                  isIcon
                  buttonMode="create-click"
                  light
                  handleClick={handleSubmit(onSubmit)}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
}
