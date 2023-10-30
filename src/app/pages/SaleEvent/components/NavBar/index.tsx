import {
  AppBar,
  Box,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountPopover from 'app/components/AccountPopover';
import Notification from 'app/components/Notification';
import { useSaleEventControlSlice } from 'app/pages/SaleEventControl/slice';
import { selectSaleEventControl } from 'app/pages/SaleEventControl/slice/selector';
import path from 'app/routes/path';
import BG_HEADER from 'assets/background/background-header.svg';
import HOME_ICON from 'assets/background/home-icon.svg';
import LEFT_ICON from 'assets/background/left-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useNavigate,
  matchRoutes,
  useParams,
} from 'react-router-dom';
import palette from 'styles/theme/palette';
import { HeaderTab } from 'types/Esalekit';
import { Project } from 'types/User';

const APPBAR_MOBILE = 54;
const APPBAR_DESKTOP = 60;

interface Props {
  // headerTab?: HeaderTab;
  // projectDetail?: Project;
}

const RootStyle = styled(AppBar)(({ theme }) => ({
  filter: 'drop-shadow(0px 6px 13px rgba(0, 0, 0, 0.06))',
  backgroundImage: `url(${BG_HEADER})`,
  zIndex: '1201',
  color: 'white',
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 3.8),
  },
}));

export default function SaleEventNavbar(props: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();
  const { id } = useParams();
  const { eventSale } = useSelector(selectSaleEventControl);

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchEventSalesInfo({ id }));
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      dispatch(actions.clearEventSalesInfo());
      dispatch(actions.clearNotification());
      dispatch(actions.clearEventReport());
    };
  }, []);

  const routes = [
    { path: path.saleEventControl },
    { path: path.saleEventTransaction },
  ];

  const matchRoute = matchRoutes(routes, location);

  const lastText = useMemo(() => {
    if (location.pathname.includes('control')) return 'Bán hàng sự kiện';
    else if (location.pathname.includes('transaction'))
      return 'Danh sách giao dịch';
    else return '';
  }, [location]);

  const handleBack = () => {
    navigate(path.project);
  };

  const handlePublic = () => {};

  return (
    <RootStyle>
      <ToolbarStyle>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              cursor: 'pointer',
            }}
            onClick={handleBack}
          >
            <Box component="img" src={LEFT_ICON} alt="left icon" />
            <Box component="img" src={HOME_ICON} alt="left icon" />

            <Typography
              fontWeight={700}
              fontSize={'14px'}
              color={palette.common.white}
            >
              Dự án
            </Typography>
          </Stack>
          <Divider
            sx={{
              background: '#FFCBE5',
              width: '1px',
              height: 30,
              ml: 3,
              mr: 2,
            }}
          />
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Typography fontSize={'14px'} color={palette.common.white}>
              Dự án
            </Typography>
            <Typography
              fontWeight={700}
              fontSize={'20px'}
              ml={'5px'}
              color={palette.common.white}
            >
              {eventSale?.salesProgram.project?.name}/
            </Typography>
            <Typography
              component={'span'}
              fontSize={'14px'}
              ml={0.5}
              color={palette.common.white}
            >
              {lastText}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 1.0 }}>
          <Notification />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
