import { Box, Grid, Typography, useTheme, Skeleton } from '@mui/material';
import BreadCrumb from 'app/components/BreadCrumb';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { useProfile } from 'app/hooks';
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { Status, AccountType } from 'types/Enum';
import { renderContent, formatCurrency } from 'utils/helpers';
import { TableHeaderProps } from 'types';
import Table from 'app/components/Table';
import { EllipsisText } from 'app/components/EllipsisText';

import {
  Group,
  Field,
  TableFieldKey,
  TableFieldValueTuple,
} from '../slice/types';
import { selectOrgchart } from '../slice/selector';
import { useOrgchartSlice } from '../slice';

import OrgchartView from '../components/chart';

import BoxContent from './components/boxcontent';
import DetailOrgChart from '../components/chart/detailOrgChart';

export function OrgchartDetail() {
  return (
    <Box pb={'43px'}>
      {/* <OrgchartView /> */}
      <DetailOrgChart />
    </Box>
  );
}
