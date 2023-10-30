import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import useTabs from 'app/hooks/useTabs';
import { debounce } from 'lodash';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import palette from 'styles/theme/palette';

import { RefundAwaitingApproval } from './components/RefundsAwaitingApproval';
import { RefundProcessed } from './components/RefundsProcessed';
import { useRefundSlice } from './slice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const RefundsPage = () => {
  const { handleTabChange, activeTab } = useTabs(0);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions } = useRefundSlice();

  const ChildrenTab = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };

  const handleChangeSearch = (e: any) => {
    switch (activeTab) {
      case 0:
        const paramSearchRefundWaiting = {
          page: 1,
          limit: 20,
          status: 'WAITING',
          search: e.target.value,
          fields: ['code', 'customer.name', 'customer.code', 'ticket.code'],
        };
        dispatch(actions.updateParamsSearch(paramSearchRefundWaiting));
        break;
      case 1:
        const paramSearchRefundApprove = {
          page: 1,
          limit: 20,
          status: 'APPROVED',
          search: e.target.value,
          fields: ['code'],
        };
        dispatch(actions.updateParamsSearch(paramSearchRefundApprove));
        break;

      default:
        break;
    }
  };
  const debounceOnChange = debounce(e => handleChangeSearch(e), 350);

  const handleTabChangeWithAction = (event: any, newValue: any) => {
    setInputValue('');
    handleTabChange(event, newValue);
    dispatch(actions.clearParamsSearch());
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          mb: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          fontSize={'18px'}
          fontWeight={700}
          color={palette.common.black}
        >
          {'Danh sách phiếu hủy chỗ'}
        </Typography>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search"
            type="search"
            placeholder="Nhập từ khóa"
            value={inputValue}
            sx={{ width: '222px', height: '44px' }}
            InputProps={{
              style: {
                height: '44px',
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={e => {
              debounceOnChange(e);
              setInputValue(e.target.value);
            }}
          />
        </Grid>
      </Box>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChangeWithAction}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.common.black,
              fontWeight: 700,
            },
            background: theme.palette.grey[300],
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: palette.primary.button,
            },
          }}
        >
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Phiếu hoàn tiền chờ duyệt"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Phiếu hoàn tiền đã xử lý"
          />
        </Tabs>
      </Paper>
      <Box
        sx={{
          backgroundColor: theme.palette.grey[0],
          marginTop: '16px',
          borderRadius: '20px',
        }}
      >
        <ChildrenTab value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <RefundAwaitingApproval />
          </Box>
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <RefundProcessed />
          </Box>
        </ChildrenTab>
      </Box>
    </Fragment>
  );
};
