import { Box, useTheme } from '@mui/material';
import path from 'app/routes/path';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ListOrgcharts from './components/list';

import { useDispatch } from 'react-redux';
import OrgChartManagement from './components/chart/chartManagement';
import { useOrgchartSlice } from './slice';

export function Orgchart() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useOrgchartSlice();
  const redirectToCreatePage = () => navigate(path.createOrgchart);

  useEffect(() => {
    dispatch(actions.fetchListOrgchart());
  }, []);

  return (
    <Fragment>
      <Box
        bgcolor={theme.palette.grey[0]}
        p={3}
        sx={{
          marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
          marginRight: { xs: '12px', sm: '24px', lg: '0px' },
          borderRadius: 3,
          mt: '-10px',
          minHeight: 'calc(99%)',
        }}
      >
        {/* <ListOrgcharts /> */}
        <OrgChartManagement />
      </Box>
    </Fragment>
  );
}
