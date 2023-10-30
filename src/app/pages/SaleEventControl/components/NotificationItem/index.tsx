import { ListItem, Box, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import dayjs from 'dayjs';
import React from 'react';

import { Notification } from '../../slice/types';

interface NotificationItemProps {
  data: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ data }) => {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        borderRadius: 0.5,
        padding: '6px 12px 4px 16px',
        backgroundColor: '#EAF9EE',
        mb: 1,
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
        >
          <path
            d="M5.18077 10.6941C5.09035 10.6955 5.00064 10.678 4.91736 10.6427C4.83408 10.6075 4.75905 10.5553 4.69705 10.4895L0.204037 6.08019C0.0733853 5.94937 0 5.77205 0 5.58716C0 5.40228 0.0733853 5.22496 0.204037 5.09414C0.337585 4.96512 0.516019 4.89301 0.70171 4.89301C0.887401 4.89301 1.06583 4.96512 1.19938 5.09414L5.19007 9.02902L14.1668 0.201132C14.3003 0.0721133 14.4788 0 14.6645 0C14.8502 0 15.0286 0.0721133 15.1621 0.201132C15.2928 0.331946 15.3662 0.50927 15.3662 0.694154C15.3662 0.879038 15.2928 1.05636 15.1621 1.18718L5.69239 10.4895C5.62581 10.557 5.54599 10.61 5.45795 10.6452C5.36991 10.6804 5.27554 10.6971 5.18077 10.6941Z"
            fill="#20BF55"
          />
        </svg>
        <Typography
          variant="caption"
          color="primary.hint"
          sx={{
            ml: 1.5,
          }}
        >
          {dayjs(data.createdAt).format('HH:mm, DD/MM/YYYY')}
        </Typography>
      </Box>
      <EllipsisText
        width={'auto'}
        line={2}
        text={data.description}
        color="#1E1E1E"
        sx={{
          fontSize: '14px',
          lineHeight: '20px',
        }}
      />
    </ListItem>
  );
};

export default NotificationItem;
