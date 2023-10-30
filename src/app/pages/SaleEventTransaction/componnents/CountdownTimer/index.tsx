import { useCountdown } from 'app/hooks/useCountdown';
import React from 'react';
import { Box } from '@mui/material';

const CountdownTimer = ({ targetDate, onClose, startCountDown }: { targetDate: number, onClose: (v?: boolean) => void, startCountDown: boolean }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  // React.useEffect(() => {
  //   if (days + hours + minutes + seconds <= 0 && startCountDown) {
  //     onClose(true)
  //   }
  // }, [days, hours, minutes, seconds, startCountDown])

  if (days + hours + minutes + seconds <= 0) {
    return <Box></Box>;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

const ShowCounter = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box
        sx={{
          color: '#1E1E1E',
          background: '#FFFFFF',
          borderRadius: '4px',
          ml: 1,
          padding: '0px 5px',
        }}
      >{hours > 9 ? hours : `0${hours}`}</Box>
      <Box sx={{ ml: 1 }}>{`:`}</Box>
      <Box
        sx={{
          color: '#1E1E1E',
          background: '#FFFFFF',
          borderRadius: '4px',
          ml: 1,
          padding: '0px 5px',
        }}
      >{minutes > 9 ? minutes : `0${minutes}`}</Box>
      <Box sx={{ ml: 1 }}>{`:`}</Box>
      <Box
        sx={{
          color: '#1E1E1E',
          background: '#FFFFFF',
          borderRadius: '4px',
          ml: 1,
          padding: '0px 5px',
        }}
      >{seconds > 9 ? seconds : `0${seconds}`}</Box>
    </Box>
  );
};

export default CountdownTimer;
