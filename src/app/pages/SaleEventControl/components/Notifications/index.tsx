import { Box, Card, List, ListItem, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useElementSize } from 'app/hooks/useElementSize';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useSaleEventControlSlice } from '../../slice';
import { selectSaleEventControl } from '../../slice/selector';
import NotificationItem from '../NotificationItem';

const Notifications: React.FC = () => {
  const [elementRef, { height }] = useElementSize();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { notifications } = useSelector(selectSaleEventControl);
  const { actions } = useSaleEventControlSlice();

  useEffect(() => {
    if (id) {
      dispatch(actions.getNotification({ id }));
    }
  }, [id]);

  return (
    <Paper
      ref={elementRef}
      elevation={0}
      sx={{
        py: 2.5,
        px: 2.25,
        borderRadius: 2.5,
        backgroundColor: '#ffffff',
        height: '100%',
      }}
    >
      <Typography fontWeight={700}>Thông báo sự kiện đã gửi</Typography>
      <List
        sx={{
          maxHeight: `calc(${height}px - 80px)`,
          height: '100%',
          overflow: 'auto',
        }}
      >
        {notifications?.data.map(item => (
          <NotificationItem data={item} />
        ))}
      </List>
    </Paper>
  );
};

export default Notifications;
