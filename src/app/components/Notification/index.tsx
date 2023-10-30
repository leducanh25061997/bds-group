import React, { Fragment, useEffect, useRef, useState, useMemo } from 'react';
import NOTIFY_ICON_UNREAD from 'assets/background/notify-icon.svg';
import {
  Box,
  IconButton,
  Popover,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { NotifyType, EventSocketListen } from 'types/Enum';
import { useSelector, useDispatch } from 'react-redux';
import { FilterParams } from 'types';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'types/Notification';
import { useProfile } from 'app/hooks';
import palette from 'styles/theme/palette';
import SocketManager, { EventSocket } from 'app/components/Socket';

import { useNotificationsSlice } from '../Notification/slice';

import TabPanel from './components/tab-notify';
import RenderList from './components/render-list';
import { selectNotify } from './slice/selector';
import NotificationEvent from './components/notificationEvent';
import { PayloadReadedNotify } from './slice/types';

export default function Notification() {
  const { hasUnread, notificationsList, totalUnread } =
    useSelector(selectNotify);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useNotificationsSlice();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [refreshListNoti, setRefreshListNoti] = useState(0);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const useInfo = useProfile();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [tabSelected, setTabSelected] = React.useState<NotifyType>(
    NotifyType.ALL,
  );

  const [notiToolTip, setNotiToolTip] = useState<Notify[]>([]);

  useEffect(() => {
    if (!totalUnread || !notificationsList?.data?.length) {
      setNotiToolTip([]);
    }
    const arrToolTip = notificationsList?.data.filter(
      notify =>
        (notify.type === 'kpi' || notify.type === 'sales_event') &&
        !notify.isRead,
    );
    if (arrToolTip) {
      setNotiToolTip(arrToolTip);
    }
  }, [totalUnread, notificationsList?.data]);

  const handleReadedNotify = (notifyId?: string) => {
    const params: PayloadReadedNotify = {
      id: notifyId,
    };
    dispatch(actions.readedNotify(params));
  };

  const requestApiFnc = () => {
    const params: FilterParams = {
      limit: 20,
      page: 1,
      status: 'unread',
    };
    dispatch(actions.checkHasUnreadNotify(params));
  };

  useEffect(() => {
    requestApiFnc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: NotifyType,
  ) => {
    setTabSelected(newValue);
  };

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_NOTIFICATION,
        handler: () => {
          requestApiFnc();
          setRefreshListNoti(refreshListNoti + 1);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useInfo],
  );

  return (
    <Fragment>
      <SocketManager events={events} />
      <IconButton onClick={handleClick} style={{ marginRight: 10 }}>
        <img alt="Icon notification" src={NOTIFY_ICON_UNREAD} />
        {hasUnread && (
          <div
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'white',
              height: 14,
              width: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: 7,
              right: 5,
            }}
          >
            <Typography
              style={{ margin: 0, padding: 0 }}
              fontSize={'7px'}
              lineHeight={'12px'}
              fontWeight={700}
              color={'#E42B2C'}
            >
              {totalUnread && totalUnread > 100 ? '99+' : totalUnread}
            </Typography>
          </div>
        )}
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPaper-root': {
            width: '435px',
            height: 'fit-content',
            maxHeight: '75vh',
            top: '70px !important',
            borderRadius: '0px',
            overflowX: 'hidden',
          },
        }}
      >
        <Box p={2}>
          <Typography
            fontSize="16px"
            lineHeight="20px"
            fontWeight={600}
            color={palette.primary.darkRed}
          >
            Thông báo
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .Mui-selected': {
                bgcolor: '#fdeff5',
                color: `${palette.primary.darkRed} !important`,
              },
            }}
          >
            <Tabs value={tabSelected} onChange={handleChangeTab}>
              <Tab
                sx={{
                  fontSize: '14px',
                  color: theme.palette.grey[100],
                }}
                label="Tất cả"
              />
              <Tab
                label="Chưa đọc"
                sx={{
                  fontSize: '14px',
                  color: theme.palette.grey[100],
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={tabSelected} index={NotifyType.ALL}>
            <RenderList
              type={NotifyType.ALL}
              handleClose={handleClose}
              refresh={refreshListNoti}
            />
          </TabPanel>
          <TabPanel value={tabSelected} index={NotifyType.UNREAD}>
            <RenderList
              type={NotifyType.UNREAD}
              handleClose={handleClose}
              refresh={refreshListNoti}
            />
          </TabPanel>
        </Box>
      </Popover>
      <NotificationEvent
        open={!!notiToolTip?.length && notiToolTip?.length > 0 && !open}
        title={notiToolTip?.[0]?.name ?? ''}
        createAt={notiToolTip?.length ? notiToolTip?.[0]?.createdAt : ''}
        desciption={notiToolTip?.[0]?.description ?? ''}
        isClose={
          !!notiToolTip?.length && notiToolTip?.[0]?.type === 'sales_event'
        }
        handleClose={async () => {
          await handleReadedNotify(notiToolTip?.[0]?.id);
          // requestApiFnc();
          setNotiToolTip([]);
        }}
        handleClick={() => {
          if (notiToolTip?.length) {
            if (notiToolTip?.[0]?.type === 'kpi') {
              navigate(`kpi-mission/edit/${notiToolTip?.[0]?.result?.id}`, {
                state: { tabActive: 0 },
              });
            } else if (notiToolTip?.[0]?.type === 'sales_event') {
              //redirect sales event
              if (notiToolTip?.[0]?.settingSalesProgramId && useInfo?.staff) {
                navigate(
                  `sale-event/${notiToolTip?.[0]?.settingSalesProgramId}/transaction`,
                );
              }
            }
            handleReadedNotify(notiToolTip?.[0]?.id);
          }
        }}
        sxProps={
          notiToolTip?.[0]?.type === 'sales_event'
            ? {
                background: '#D6F4DE', //'#FFD9EA',
                right: 0,
                left: 'auto',
              }
            : {}
        }
      />
    </Fragment>
  );
}
