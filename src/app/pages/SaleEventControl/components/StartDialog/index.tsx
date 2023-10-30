import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import CustomButton from 'app/components/Button';
import { Close } from '@mui/icons-material';
import palette from 'styles/theme/palette';
import TextFieldCustom from 'app/components/TextFieldCustom';
import START_EVENT from 'assets/background/start_event.png';
import { useParams } from 'react-router-dom';
import EventSales from 'services/api/eventSales';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { snackbarActions } from 'app/components/Snackbar/slice';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';

import { PhaseEnum, SaleControlEnum } from '../../slice/types';
import { useSaleEventControlSlice } from '../../slice';
import { selectSaleEventControl } from '../../slice/selector';

interface StartDialogProps {
  open: boolean;
  onClose: () => void;
}

const StartDialog = (props: StartDialogProps) => {
  const { open, onClose } = props;

  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<{ phase: string }>();

  const handleClose = () => {
    onClose?.();
  };

  const handleStartEvent = async (data: { phase: string }) => {
    if (!id || !data.phase) return;

    try {
      const res = await EventSales.startEvent({
        id,
        phase: data.phase.split(','),
      });

      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );
      dispatch(actions.fetchEventSalesInfo({ id }));
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: error.response?.data.message,
            type: 'error',
          }),
        );
      }
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: '#1E1E1E',
          pt: 5,
          pb: 2,
        }}
        variant="h4"
      >
        <Box
          component="img"
          src={START_EVENT}
          alt="event"
          sx={{
            mx: 'auto',
            mb: 1.25,
          }}
        />
        Bắt đầu sự kiện
        <IconButton
          aria-label="close"
          onClick={handleClose}
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

      <DialogContent sx={{ padding: '10px 24px' }}>
        <Box mb={2}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              padding: '0 48px',
            }}
          >
            Bạn có chắc chắn muốn bắt đầu sự kiện ngay bây giờ?
          </Typography>

          <form onSubmit={handleSubmit(handleStartEvent)}>
            <Box sx={{ mt: 4, position: 'relative', width: '100%' }}>
              {/* <TextFieldCustom
                placeholder="Chọn chương trình"
                label="Chương trình bán hàng"
                control={control}
                name="phase"
                type="select"
                errors={errors}
                options={[
                  {
                    id: 'phase1',
                    value: PhaseEnum.PHASE_1,
                    name: 'Giai đoạn 1',
                  },
                  {
                    id: 'phase2',
                    value: PhaseEnum.PHASE_2,
                    name: 'Giai đoạn 2',
                  },
                ]}
              /> */}

              <ControlledAutocomplete
                name="phase"
                label="Giai đoạn bắt đầu"
                placeholder="Chọn giai đoạn để bắt đầu sự kiện"
                control={control as any}
                // handleBlur={handlerBlurPicker}
                options={[
                  {
                    id: PhaseEnum.PHASE_1,
                    name: 'Giai đoạn 1',
                  },
                  {
                    id: PhaseEnum.PHASE_2,
                    name: 'Giai đoạn 2',
                  },
                ]}
              />
            </Box>

            <Box
              mt={3}
              mb={2}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CustomButton
                title="Hủy"
                variant="outlined"
                handleClick={() => handleClose()}
                sxProps={{
                  borderRadius: '8px',
                  minWidth: '128px',
                  marginRight: '42px',
                  ':hover': {
                    border: `1px solid ${palette.primary.button}`,
                    color: palette.common.white,
                    background: palette.primary.button,
                  },
                }}
                sxPropsText={{ fontWeight: 400 }}
              />
              <CustomButton
                title="Xác nhận"
                typeButton="submit"
                sxProps={{
                  background: '#D45B7A',
                  borderRadius: '8px',
                  minWidth: '128px',
                }}
                sxPropsText={{ color: '#FFFFFF' }}
              />
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StartDialog;
