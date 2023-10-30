import {
  Box,
  Card,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';

import palette from 'styles/theme/palette';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import { useEffect, useState } from 'react';
import EditProcess from 'app/pages/ProcessManagement/edit';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import CloseIcon from '@mui/icons-material/Close';
import { WorkFlowTypeEnum } from 'types/Enum';

import { selectTransactionManagement } from '../../slice/selector';
import RESERVATION_ICON from '../../../../../assets/background/reservation-process-icon.svg';

import ReservationTable from '../reservationTable';

interface ReservationManagementProps {}
export default function ReservationManagement(
  props: ReservationManagementProps,
) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const { workFlowInformation } = useSelector(selectManagementInformation);
  const { reservationManagement } = useSelector(selectTransactionManagement);
  const { actions: snackbarActions } = useSnackbarSlice();

  const renderHeaderTopTable = () => {
    if (!reservationManagement?.statistic?.length) return <></>;
    return reservationManagement?.statistic?.map(e => (
      <Grid
        sx={{
          display: 'flex',
          mr: '24px',
          width: 'fit-content',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'Inter',
        }}
      >
        <Grid sx={{ minWidth: '85px' }}>{e.nameNode}</Grid>
        <Grid
          sx={{
            background: '#FFFFFF',
            borderRadius: '4px',
            padding: '6px',
            width: 'fit-content',
            ml: '8px',
            minWidth: '30px',
            height: '30px',
            textAlign: 'center',
          }}
        >
          {e.total}
        </Grid>
      </Grid>
    ));
  };

  useEffect(() => {
    if (id) {
      dispatch(
        projectSettingActions.fetchWorkFlowTree({
          id,
          type: WorkFlowTypeEnum.RESERVATION,
        }),
      );
    }
  }, [id]);

  const handleClickReservationProcess = () => {
    if (workFlowInformation?.id) {
      setIsOpen(true);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Không xem được thiết lập dự án. Vui lòng kiểm tra lại!',
          type: 'error',
        }),
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card sx={{ p: '0px', borderRadius: '20px' }}>
        <Box sx={{ display: 'flex', height: '40px' }}>
          <Grid
            sx={{
              background: palette.background.lighter,
              color: '#FFFFFF',
              display: 'flex',
              minWidth: 'fit-content',
              alignItems: 'center',
              px: '14px',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter',
                mr: '5px',
              }}
            >
              Phiếu GC:
            </Typography>
            <Typography
              sx={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Inter' }}
            >
              {reservationManagement?.totalStatistic ?? 0}
            </Typography>
          </Grid>
          <Grid
            sx={{
              background: palette.background.light,
              display: 'flex',
              justifyContent: 'space-between',
              pl: '24px',
              width: 'calc(100% - 90px)',
            }}
          >
            <Grid sx={{ display: 'flex', overflowY: 'hidden' }}>
              {renderHeaderTopTable()}
            </Grid>
            <Grid
              sx={{
                minWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                color: palette.primary.darkRed,
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter',
                '> img': {
                  mr: '5px',
                },
                mx: '16px',
                cursor: 'pointer',
                width: '182px',
              }}
              onClick={handleClickReservationProcess}
            >
              <img
                width={20}
                height={20}
                src={RESERVATION_ICON}
                alt="icon edit"
              />
              Quy trình duyệt giữ chỗ
            </Grid>
          </Grid>
        </Box>
        <ReservationTable />
      </Card>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '1000px' } }}
        maxWidth={'md'}
      >
        <Box sx={{ position: 'absolute', top: '14px', right: '16px' }}>
          <IconButton aria-label="delete" onClick={handleClose}>
            <CloseIcon
              sx={{ width: 26, height: 26, color: palette.button.greyLighter }}
            />
          </IconButton>
        </Box>
        <DialogTitle
          sx={{
            color: '#1E1E1E',
            fontSize: '24px !important',
            fontWeight: '700 !important',
            textAlign: 'center',
          }}
        >
          Quy trình duyệt giữ chỗ
        </DialogTitle>
        <EditProcess isEdit isShow idShow={workFlowInformation?.id} />
      </Dialog>
    </>
  );
}
