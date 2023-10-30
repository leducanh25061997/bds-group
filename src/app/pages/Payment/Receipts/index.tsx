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
import CustomButton from 'app/components/Button';
import React, { useState, Fragment, useEffect } from 'react';
import { Icon } from '@iconify/react';
import useTabs from 'app/hooks/useTabs';
import palette from 'styles/theme/palette';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';

import { ReceiptsAwaitingApproval } from './components/ReceiptsAwaitingApproval';
import { ReceiptsProcessed } from './components/ReceiptsProcessed';
import { usePaymentSlice } from './slice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const ReceiptsPage = () => {
  const { handleTabChange, activeTab } = useTabs(0);
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const { actions } = usePaymentSlice();
  const dispatch = useDispatch();

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
          mb: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          fontSize={'18px'}
          fontWeight={700}
          color={palette.common.black}
        >
          {'Danh sách phiếu thu'}
        </Typography>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search"
            type="search"
            placeholder="Nhập từ khóa"
            value={inputValue}
            sx={{
              width: '222px',
              height: '44px',
            }}
            InputProps={{
              style: {
                height: '44px',
                background: theme.palette.common.white,
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
        {/* <ChildrenTab value={activeTab} index={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomButton
              title="Tạo phiếu thu"
              isIcon
              sxProps={{
                ml: '16px',
                borderRadius: '8px',
                width: { xs: 'auto' },
                height: { xs: '44px' },
              }}
              iconNode={<Icon icon="zondicons:add-solid" color="#fafafa" />}
              sxPropsText={{ fontSize: '14px' }}
            />
          </Box>
        </ChildrenTab>

        <ChildrenTab value={activeTab} index={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomButton
              title="Tạo phiếu thu"
              isIcon
              typeButton={'submit'}
              sxProps={{
                ml: '16px',
                borderRadius: '8px',
                width: { xs: 'auto' },
                height: { xs: '44px' },
              }}
              iconNode={<Icon icon="zondicons:add-solid" color="#fafafa" />}
              sxPropsText={{ fontSize: '14px' }}
            />
          </Box>
        </ChildrenTab> */}
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
              marginRight: '16px'
              // padding: '12px 12px 12px 0'
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
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none', padding: '12px 0', marginRight: '16px'}}
            label="Phiếu thu chờ duyệt"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none', padding: '12px 0'}}
            label="Phiếu thu đã xử lý"
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
          <ReceiptsAwaitingApproval />
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={1}>
          <ReceiptsProcessed />
        </ChildrenTab>
      </Box>
    </Fragment>
  );
};
