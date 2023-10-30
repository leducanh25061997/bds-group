/* eslint-disable no-nested-ternary */
import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material';
import path from 'app/routes/path';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterParams } from 'types';
import { NotificationTypeEnum, NotifyType } from 'types/Enum';
import { Notify } from 'types/Notification';
import { getLocalTime } from 'utils/helpers';
import palette from 'styles/theme/palette';

import { useNotificationsSlice } from '../../slice';
import { selectNotify } from '../../slice/selector';
import { PayloadReadedNotify } from '../../slice/types';
import SkeletonNotify from '../skeleton-notify';
import { usePaymentSlice } from '../../../../pages/Payment/Receipts/slice/index';
interface Props {
  type: NotifyType;
  refresh: number;
  handleClose: () => void;
}

export default function RenderList(props: Props) {
  const { type, handleClose } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions } = useNotificationsSlice();
  const { notificationsList, isLoading } = useSelector(selectNotify);
  const { actions: usePaymentActions } = usePaymentSlice()
  const navigate = useNavigate();

  const requestApiFnc = () => {
    const params: FilterParams = {
      limit: 20,
      page: 1,
    };
    if (type === NotifyType.UNREAD) {
      params.status = 'unread';
    } else {
      params.status = 'all';
    }
    dispatch(actions.getListNotifications(params));
  };

  useEffect(() => {
    requestApiFnc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, props.refresh]);

  const handleRedirect = (url: string, objectLocation?: any) => {
    if (url) {
      if (objectLocation) {
        navigate(url, objectLocation);
      } else {
        navigate(url);
      }
      handleClose();
    }
  };

  const handleReadedNotify = (notifyId?: string) => {
    const params: PayloadReadedNotify = {
      id: notifyId,
    };
    dispatch(actions.readedNotify(params));
  };

  const handleReadAllNotify = () => {
    dispatch(actions.readedAllNotify({}));
    setTimeout(() => {
      requestApiFnc();
    }, 1000);
  };

  const redirectNotify = (notify: Notify) => {
    const type = notify?.type;
    switch (type) {
      case NotificationTypeEnum.KPI:
        handleRedirect(`kpi-mission/edit/${notify?.result?.id}`, {
          state: { tabActive: 0 },
        });
        break;
      case NotificationTypeEnum.SALES_EVENT:
        handleRedirect(
          `sale-event/project/${notify?.result?.id}/transaction/${notify?.settingSalesProgramId}`,
        );
        break;
      case NotificationTypeEnum.RECEIPT:
        notify.result?.receiptId && dispatch(usePaymentActions.setTicketIdStore(notify.result?.receiptId));
        handleRedirect(path.receipts);
        break;
      case NotificationTypeEnum.RESERVATION:
        handleRedirect(
          `project/transaction-management/${notify?.result?.projectId}`,
          {
            state: {
              tabActive: 1,
              tickId: notify?.result?.ticketId,
            },
          },
        );
        break;
      case NotificationTypeEnum.DEPOSIT:
        handleRedirect(
          `project/transaction-management/${notify?.result?.projectId}`,
          {
            state: {
              tabActive: 2,
              tickId: notify?.result?.ticketId,
            },
          },
        );
        break;
      case NotificationTypeEnum.CANCELED:
        handleRedirect(
          `project/transaction-management/${notify?.result?.projectId}`,
          {
            state: {
              tabActive: 3,
              tickId: notify?.result?.ticketId,
            },
          },
        );
        break;
        case NotificationTypeEnum.CUSTOMER:
          handleRedirect(
            `customer/customers-potential`,
            {
              state: {
                customerId: notify?.result?.customerId,
              },
            },
          );
          break;
      case NotificationTypeEnum.REFUND:
        handleRedirect(path.refunds);
        break;
      default:
        return null;
    }
    handleReadedNotify(notify.id);
  };

  return (
    <Box sx={{ background: '#fdeff5'}}>
      {isLoading ? (
        <SkeletonNotify notiLength={8} />
      ) : !notificationsList?.data?.length ? (
        <Typography
          fontSize="14px"
          fontWeight={600}
          lineHeight="17px"
          color={theme.palette.primary.light}
          textAlign="center"
          pt={2}
        >
          Chưa có thông báo nào
        </Typography>
      ) : (
        notificationsList?.data?.map(notify => (
          <Grid
            container
            p={1}
            key={notify.id}
            borderBottom={`1px solid ${theme.palette.secondary.lighter}`}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: theme.palette.grey[200],
              },
            }}
            bgcolor={!notify.isRead ? '#ffd8e8' : 'unset'}
            onClick={() => redirectNotify(notify)}
          >
            <Grid
              item
              sm={1.8}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Avatar
                src={''}
                sx={{
                  width: '40px',
                  height: '40px',
                }}
              />
            </Grid>
            <Grid item sm={8.7}>
              <Typography
                fontSize="10px"
                lineHeight="12px"
                fontWeight={400}
                color={theme.palette.grey[500]}
                mb="6px"
              >
                {notify?.createdAt
                  ? getLocalTime(notify?.createdAt, 'HH:mm - DD/MM/YYYY')
                  : ''}
              </Typography>
              <Typography
                fontSize="12px"
                fontWeight={700}
                lineHeight="12px"
                color={theme.palette.primary.light}
                mb="6px"
              >
                {notify?.name}
              </Typography>
              <Typography
                fontSize="10px"
                lineHeight="12px"
                sx={{
                  '& span': {
                    color: theme.palette.primary.lighter,
                  },
                  display: '-webkit-box',
                  maxWidth: '100%',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  margin: '0 auto',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {/* <span>{`${notify?.createdBy?.role} ${
                  notify?.createdBy?.name || ''
                } `}</span> */}
                {notify?.description}
              </Typography>
            </Grid>
            <Grid
              item
              sm={1.5}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {/* <Typography
                fontSize="14px"
                lineHeight="17px"
                color={theme.palette.grey[100]}
              >
                {createMinute(notify?.createdAt || '')}
              </Typography> */}
              {!notify.isRead && (
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    bgcolor: palette.primary.darkRed,
                    borderRadius: '50%',
                    // mt: 1,
                  }}
                />
              )}
            </Grid>
          </Grid>
        ))
      )}
      <Typography
        fontSize={'12px'}
        lineHeight={'15px'}
        fontWeight={600}
        color={
          palette.primary.darkRed
          // theme.palette.primary.lighter
        }
        p="16px"
        textAlign={'end'}
        sx={{
          cursor: 'pointer',
        }}
        onClick={handleReadAllNotify}
      >
        Xem tất cả
      </Typography>
    </Box>
  );
}
