import { Box, Grid } from '@mui/material';
import REFRESH_ICON from 'assets/icons/refesh-icon.svg';
import COLLAPSE_2_WAYS_ICON from 'assets/icons/collapse-2-ways.svg';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectSaleEventTransaction } from '../../slice/selector';
import { Statistics } from '../../slice/types';

const keys: string[] = ['OPEN', 'BOOKING', 'WAIT_FILE', 'SOLD_OUT', 'SIGN_UP'];

export const HeaderTable = ({
  data,
  handleRefresh,
  handleCollapse,
}: {
  data: Statistics[];
  handleRefresh: (v?: string) => void;
  handleCollapse?: (v: string) => void;
}) => {
  const [total, setTotal] = useState<number>(0);
  const { loadingHeader } = useSelector(selectSaleEventTransaction);

  useEffect(() => {
    if (data.length > 0) {
      let _total = 0;
      for (let i = 0; i < data.length; i++) {
        if (keys.includes(data[i].key)) {
          _total += data[i].value;
        }
      }
      setTotal(_total);
    }
  }, [data]);

  return (
    <Box
      sx={{
        background: '#E0E1E4',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            background: '#475160',
            color: '#fff',
            padding: '10px 16px',
            alignItems: 'center',
            width: '180px',
          }}
        >
          <Box sx={{ fontSize: '14px', fontWeight: 400 }}>Sản phẩm tự do:</Box>
          <Box sx={{ fontSize: '16px', fontWeight: 700, marginLeft: '10px' }}>
            {total}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            overflow: 'auto',
            alignItems: 'center',
            width: 'calc(100vw - 370px)',
          }}
        >
          <Box sx={{ display: 'flex', height: '36px', p: '8px' }}>
            <Box
              sx={{
                background: '#FFEB99',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              {data.filter(item => item.key === 'OPEN')[0].value || 0}
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginLeft: '6px',
                width: 'max-content',
              }}
            >
              Mở bán
            </Box>
          </Box>
          <Box sx={{ display: 'flex', height: '36px', p: '8px' }}>
            <Box
              sx={{
                background: '#D687F2',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              {data.filter(item => item.key === 'SIGN_UP')[0].value || 0}
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginLeft: '6px',
                width: 'max-content',
              }}
            >
              Đăng ký
            </Box>
          </Box>
          <Box sx={{ display: 'flex', height: '36px', p: '8px' }}>
            <Box
              sx={{
                background: '#7CE7FF',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              {data.filter(item => item.key === 'BOOKING')[0].value || 0}
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginLeft: '6px',
                width: 'max-content',
              }}
            >
              Booking
            </Box>
          </Box>
          <Box sx={{ display: 'flex', height: '36px', p: '8px' }}>
            <Box
              sx={{
                background: '#FF9A6D',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              {data.filter(item => item.key === 'WAIT_FILE')[0].value || 0}
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginLeft: '6px',
                width: 'max-content',
              }}
            >
              Chuyển cọc, chờ HS
            </Box>
          </Box>
          <Box sx={{ display: 'flex', height: '36px', p: '8px' }}>
            <Box
              sx={{
                background: '#FF595C',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              {data.filter(item => item.key === 'SOLD_OUT')[0].value || 0}
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginLeft: '6px',
                width: 'max-content',
              }}
            >
              Đã bán
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '20px',
          padding: '2px 10px',
          cursor: 'pointer',
        }}
        onClick={() => handleRefresh('PHARSE_2')}
      >
        <Box>
          <img
            className={
              loadingHeader === 'PHARSE_2' || loadingHeader === 'PHARSE_ALL'
                ? 'spin'
                : ''
            }
            src={REFRESH_ICON}
            alt="Icon"
          />
        </Box>
        <Box sx={{ marginLeft: '10px' }}>Refesh</Box>
        {handleCollapse && (
          <Box
            sx={{ marginLeft: '15px' }}
            onClick={() => handleCollapse('PHARSE_2')}
          >
            <img src={COLLAPSE_2_WAYS_ICON} alt="Icon" width={24} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
