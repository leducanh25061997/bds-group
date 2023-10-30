import { Stack, Box, Typography, Grid } from '@mui/material';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EventSales from 'services/api/eventSales';
import axios from 'axios';
import { snackbarActions } from 'app/components/Snackbar/slice';
import path from 'app/routes/path';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import SaleEventStatus from './components/SaleEventStatus';
import Notifications from './components/Notifications';
import Statistics from './components/Statistics';
import SendNotification from './components/SendNotification';
import { ActionsDialog } from './components/ActionsDialog';
import { SaleControlEnum } from './slice/types';
import { useSaleEventControlSlice } from './slice';
import { selectSaleEventControl } from './slice/selector';
import ControlButtons from './components/ControlButtons';

const INIT_DIALOG_ACTION = { open: false, type: null };

export function SaleEventControl() {
  const { id } = useParams();
  const [dialogActionStates, setDialogActionStates] = useState<{
    open: boolean;
    type: SaleControlEnum | string | null;
  }>(INIT_DIALOG_ACTION);
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();
  const { eventSale, permission } = useSelector(selectSaleEventControl);
  const navigate = useNavigate();

  const userInfo = useProfile();

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchEventSalesInfo({ id }));
    }
    if (eventSale?.id) {
      dispatch(
        actions.checkEventSalesPermission({
          projectId: eventSale.salesProgram.projectId,
        }),
      );
    }
  }, [id, eventSale?.id]);

  useLayoutEffect(() => {
    if (!permission) return;
    const hasSalesOpenPermission = checkPermissionExist(
      PermissionKeyEnum.EVENT_SALES_OPEN,
      userInfo,
    );

    if (!permission.isAdmin || !hasSalesOpenPermission) {
      navigate(
        `${path.saleEvent}/project/${eventSale?.salesProgram.projectId}/transaction/${eventSale?.id}`,
      );
    }
  }, [
    id,
    eventSale?.salesProgramId,
    permission,
    userInfo,
    eventSale?.id,
    eventSale?.salesProgram.projectId,
  ]);

  const handleClose = () => {
    setDialogActionStates(prev => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  const handleOpenActionDialog = (type: SaleControlEnum) => {
    setDialogActionStates({
      open: true,
      type,
    });
  };

  const handleEndEvent = async () => {
    if (!id) return;
    try {
      const res = await EventSales.endEvent({ id });

      setDialogActionStates(INIT_DIALOG_ACTION);
      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );
      dispatch(actions.fetchEventSalesInfo({ id }));
    } catch (error) {
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

  const handleUpdatePhase = async () => {
    if (!id) return;

    try {
      const res = await EventSales.updateEventPhase({
        id,
        phase: dialogActionStates.type as SaleControlEnum,
      });

      setDialogActionStates(INIT_DIALOG_ACTION);
      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );
      dispatch(actions.fetchEventSalesInfo({ id }));
    } catch (error) {
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

  const handleSendEmailEndPhase = async () => {
    if (!id) return;
    try {
      const res = await EventSales.sendEmailEndPhase({
        id,
        currentPhase: eventSale?.currentPhase as SaleControlEnum,
      });

      setDialogActionStates(INIT_DIALOG_ACTION);
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Gửi Email XN kết thúc giao dịch thành công',
          type: 'success',
        }),
      );
    } catch (error) {
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

  const handleExportEventReport = async () => {
    if (!id) return;
    try {
      const res = await EventSales.exportEventReport({
        id,
      });

      const link = document.createElement('a');
      const href = URL.createObjectURL(res);
      link.href = href;
      link.setAttribute('download', 'Bao_cao_su_kien.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      setDialogActionStates(INIT_DIALOG_ACTION);
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Xuất báo cáo sự kiện thành công',
          type: 'success',
        }),
      );
    } catch (error) {
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

  const handleActionClick = () => {
    switch (dialogActionStates.type) {
      case SaleControlEnum.ENDED:
        handleEndEvent();
        break;
      case SaleControlEnum.SEND_EMAIL:
        handleSendEmailEndPhase();
        break;
      case SaleControlEnum.EXPORT_EVENT_REPORT:
        handleExportEventReport();
        break;
      default:
        handleUpdatePhase();
    }
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Điều khiển sự kiện
        </Typography>
        <ControlButtons onOpenActionDialog={handleOpenActionDialog} />
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 1.5,
          flex: 1,
        }}
      >
        <Grid item xs={8.5}>
          <Grid container spacing={2.5}>
            <SendNotification />
            <Statistics />
          </Grid>
        </Grid>
        <Grid item xs={3.5}>
          <Stack spacing={2.5} height="100%">
            <SaleEventStatus />
            <Notifications />
          </Stack>
        </Grid>
      </Grid>
      {dialogActionStates.open && (
        <ActionsDialog
          open={dialogActionStates.open}
          onClose={handleClose}
          handleSubmit={handleActionClick}
          type={dialogActionStates.type}
        />
      )}
    </Fragment>
  );
}
