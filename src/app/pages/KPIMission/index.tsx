import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Icon } from '@iconify/react';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import useTabs from 'app/hooks/useTabs';
import { useProfile } from 'app/hooks';
import { PermissionKeyEnum } from 'types/Permission';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import querystring from 'query-string';

import ListKpiMission from './components/listKpiMission';
import { useKpiMissionSlice } from './slice';

// import ListMision from './components/list';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface StateLocationProps {
  tabActive?: number;
}

export function KPIMission() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { actions } = useKpiMissionSlice();
  const locationProps = state as StateLocationProps;
  const { handleTabChange, activeTab, setActiveTab } = useTabs(0);
  const userInfo = useProfile();
  const checkShowBtnCreate = useMemo(() => {
    const havePermision = userInfo?.role?.permissions?.filter(
      e => e?.key === PermissionKeyEnum.KPI_CREATE,
    );
    return !!havePermision?.length;
  }, [userInfo?.role?.permissions]);

  useEffect(() => {
    if (locationProps?.tabActive) {
      setActiveTab(locationProps?.tabActive);
    }
  }, [locationProps, handleTabChange]);

  useEffect(() => {
    const params = querystring.parse(location.search, {
      arrayFormat: 'bracket',
    });
    if (params.status === 'created') {
      setActiveTab(1);
    }
  }, [location.search]);

  const handleRedirectCreate = () => {
    navigate(path.createKpiMission);
  };

  const handleChangeSearch = (e: any) => {
    switch (activeTab) {
      case 0:
        const paramsSearchAssigned = {
          page: 1,
          limit: 20,
          status: 'assigned',
          search: e.target.value,
          fields: ['name'],
        };
        dispatch(actions.fetchListMissionAssigned(paramsSearchAssigned));
        navigate(
          {
            pathname: location.pathname,
            search: `?${querystring.stringify(paramsSearchAssigned, {
              arrayFormat: 'bracket',
              skipNull: true,
              skipEmptyString: true,
            })}`,
          },
          { replace: true },
        );
        break;
      case 1:
        const paramsSearchCreated = {
          page: 1,
          limit: 20,
          status: 'created',
          search: e.target.value,
          fields: ['name'],
        };
        dispatch(actions.fetchListMissionAssigned(paramsSearchCreated));
        navigate(
          {
            pathname: location.pathname,
            search: `?${querystring.stringify(paramsSearchCreated, {
              arrayFormat: 'bracket',
              skipNull: true,
              skipEmptyString: true,
            })}`,
          },
          { replace: true },
        );
        break;
      default:
        break;
    }
  };

  const debounceOnChange = debounce(handleChangeSearch, 350);

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
          {'Báo cáo KPI - Nhiệm vụ'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search"
            type="search"
            placeholder="Nhập từ khóa"
            sx={{
              width: '222px',
              height: '44px',
            }}
            InputProps={{
              style: {
                height: '44px',
                background: palette.common.white,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={debounceOnChange}
          />
          {checkShowBtnCreate && (
            <CustomButton
              title="Tạo mới"
              isIcon
              sxProps={{
                ml: '16px',
                borderRadius: '8px',
                width: { xs: 'auto' },
                height: { xs: '44px' },
              }}
              iconNode={
                <Icon icon="zondicons:add-solid" color="#fafafa" width="25px" />
              }
              sxPropsText={{ fontSize: '14px' }}
              handleClick={handleRedirectCreate}
            />
          )}
        </Box>
      </Box>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
            label="Nhiệm vụ được giao"
          />
          {checkShowBtnCreate && (
            <Tab
              sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
              label="Nhiệm vụ đã tạo"
              disabled={!checkShowBtnCreate}
            />
          )}
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
            <ListKpiMission isAssigned />
          </Box>
        </ChildrenTab>
        {checkShowBtnCreate && (
          <ChildrenTab value={activeTab} index={1}>
            <Box sx={{ p: 3 }}>
              <ListKpiMission />
            </Box>
          </ChildrenTab>
        )}
      </Box>
    </Fragment>
  );
}
