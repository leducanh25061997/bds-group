import React from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import palette from 'styles/theme/palette';
import { getLocalTime } from 'utils/helpers';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationEventProps {
  open: boolean;
  createAt?: string;
  title?: string;
  desciption?: string;
  isClose?: boolean;
  handleClose?: () => void;
  sxProps?: SxProps;
  handleClick?: () => void;
}
export default function NotificationEvent(props: NotificationEventProps) {
  const {
    open,
    createAt,
    title,
    desciption,
    isClose = false,
    handleClose,
    sxProps,
    handleClick,
  } = props;

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        handleClose?.();
      }, 10000);
    }
  }, [handleClose, open]);

  return (
    <Box
      sx={{
        display: open ? 'block' : 'none',
        position: 'absolute',
        height: 'fit-content',
        width: 'fit-content',
        background: palette.common.white,
        top: '70px',
        left: '69vw',
        boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        cursor: 'pointer',
        ...sxProps,
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          p: 2,
          height: 'fit-content',
          width: 'fit-content',
          maxWidth: '400px',
          display: 'flex',
        }}
      >
        <NotificationsActiveIcon
          sx={{
            width: '20px',
            height: '20px',
            color: '#D6465F',
          }}
        />
        <Box ml="11px">
          <Typography
            fontSize="10px"
            lineHeight="12px"
            fontWeight={400}
            color={palette.primary.hint}
            mb="6px"
            height="fit-content"
          >
            {createAt ? getLocalTime(createAt, 'HH:mm - DD/MM/YYYY') : ''}
          </Typography>
          <Typography
            fontSize="12px"
            fontWeight={700}
            lineHeight="12px"
            color={palette.primary.light}
            mb="6px"
          >
            {title}
          </Typography>
          <Typography
            fontSize="10px"
            lineHeight="12px"
            color={palette.primary.hint}
            sx={{
              display: '-webkit-box',
              maxWidth: '100%',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              margin: '0 auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {desciption}
          </Typography>
        </Box>
        {isClose && (
          <CloseIcon
            sx={{
              width: '16px',
              height: '16px',
              ml: '18px',
              color: palette.primary.darkRed,
              cursor: 'pointer',
            }}
            onClick={e => {
              e.stopPropagation();
              handleClose?.();
            }}
          />
        )}
      </Box>
      {!isClose && <span className="arrow"></span>}
    </Box>
  );
}
