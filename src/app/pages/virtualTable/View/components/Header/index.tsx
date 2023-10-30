import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { selectVirtualTable } from '../../../slice/selectors';
import { EventSaleStatus } from '../../../components/EventSaleStatus';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { virtualDataTable } = useSelector(selectVirtualTable);
  const [time, setTime] = useState<number>(10);

  useEffect(() => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(10);
    }
  }, [time]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {virtualDataTable?.infProject.settingSalesProgram.name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <EventSaleStatus />
        <Box sx={{ fontWeight: 500, fontSize: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ color: '#1E1E1E' }}>Cập nhật sau</Box>
          <Box sx={{ color: '#E42B2C', ml: 1 }}>{`00:${time < 10 ? `0${time}` : time}s`}</Box>
        </Box>
      </Box>
    </Box>
  );
};
