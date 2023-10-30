import {
  AppBar,
  Box,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountPopover from 'app/components/AccountPopover';
import path from 'app/routes/path';
import ARROW_DOWN from 'assets/background/arrow_down.svg';
import BG_HEADER from 'assets/background/background-header.svg';
import CTLOTUSTEXT_LOGO from 'assets/background/ctlotus-logo.svg';
import CTLOTUS_LOGO from 'assets/background/ctlotuslogonotext-icon.svg';
import IconTabbar from 'assets/background/ic_tabbar.svg';
import { translations } from 'locales/translations';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useProjectSlice } from 'app/pages/Projects/slice';

import { selectProject } from 'app/pages/Projects/slice/selector';

import Notification from '../Notification';
import Search from '../Search';
import ICON_SUPPORT_WHITE from 'assets/background/icon-support-white.svg';

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_ON_MOBILE = 120;
const APPBAR_MOBILE = 54;
const APPBAR_DESKTOP = 60;

const RootStyle = styled(AppBar)(({ theme }) => ({
  filter: 'drop-shadow(0px 6px 13px rgba(0, 0, 0, 0.06))',
  backgroundImage: `url(${BG_HEADER})`,
  zIndex: '1201',
  color: 'white',
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
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

  // [theme.breakpoints.up('xs')]: {
  //   padding: theme.spacing(0, 1.1),
  // },
}));

interface Props {
  onOpenSidebar: () => void;
  isOpenSidebar: boolean;
}

export default function DashboardNavbar(props: Props) {
  const { onOpenSidebar, isOpenSidebar } = props;
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProjectSlice();
  const { ProjectDetail } = useSelector(selectProject);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/project');
  };

  const convertLocaltionToTitle = useMemo(() => {
    if (location.pathname.includes(path.dashboards)) {
      return t(translations.sidebar.dashboard);
    }
    if (
      location.pathname.includes(
        path.transactionManagementProject.replace('/:id', ''),
      )
    ) {
      return `${t(translations.sidebar.project)}/ ${ProjectDetail?.name} / ${t(
        translations.sidebar.transactionManagement,
      )}`;
    }
    if (location.pathname.includes(path.projectSetting.replace('/:id', ''))) {
      return `${t(translations.sidebar.project)}/ ${ProjectDetail?.name} / ${t(
        translations.sidebar.projectSetting,
      )}`;
    }
    if (
      location.pathname.includes(path.productTableSetting.replace('/:id', ''))
    ) {
      return `${t(translations.sidebar.project)}/ ${ProjectDetail?.name} / ${t(
        translations.sidebar.productTableSetting,
      )}`;
    }
    if (location.pathname.includes(path.project)) {
      return t(translations.sidebar.project);
    }
    if (location.pathname.includes(path.ComisstionsAccount)) {
      return (
        t(translations.sidebar.transaction) +
        '/' +
        t(translations.sidebar.transListDetail)
      );
    }
    if (location.pathname.includes(path.ComisstionsRequest)) {
      return (
        t(translations.sidebar.transaction) +
        '/' +
        t(translations.sidebar.transRequestlist)
      );
    }
    if (location.pathname.includes(path.ComisstionRules)) {
      return (
        t(translations.sidebar.transaction) +
        '/' +
        t(translations.sidebar.transRule)
      );
    }
    if (location.pathname.includes(path.receipts)) {
      return (
        t(translations.sidebar.pay) + '/' + t(translations.sidebar.receipts)
      );
    }
    if (location.pathname.includes(path.refunds)) {
      return (
        t(translations.sidebar.pay) + '/' + t(translations.sidebar.refunds)
      );
    }
    if (location.pathname.includes(path.potentialAccount)) {
      return (
        t(translations.sidebar.customer).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.customerPotential)
      );
    }
    if (location.pathname.includes(path.customerTransaction)) {
      return (
        t(translations.sidebar.customer).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.customerTransaction)
      );
    }
    if (location.pathname.includes(path.cityStarMembership)) {
      return (
        t(translations.sidebar.customer).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.membershipCityStar)
      );
    }
    if (location.pathname.includes(path.logImportCustomer)) {
      return (
        t(translations.sidebar.customer).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.importCustomerLogs)
      );
    }
    if (location.pathname.includes(path.cityStarCustomer)) {
      return (
        t(translations.sidebar.customer).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.customerCityStar)
      );
    }
    if (location.pathname.includes(path.carrers)) {
      return t(translations.sidebar.candidate);
    }
    if (location.pathname.includes(path.Orgcharts)) {
      return t(translations.sidebar.Orgchart);
    }
    if (location.pathname.includes(path.roleList)) {
      return (
        t(translations.sidebar.setting).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.roleList)
      );
    }
    if (location.pathname.includes(path.processManagement)) {
      return t(translations.sidebar.processManagement);
    }

    if (location.pathname.includes(path.permission)) {
      return (
        t(translations.sidebar.setting).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.permission)
      );
    }
    if (location.pathname.includes(path.contentManagement)) {
      return (
        t(translations.sidebar.setting).toLocaleUpperCase() +
        '/' +
        t(translations.sidebar.contentManagement)
      );
    }
    if (location.pathname.includes(path.staff)) {
      return t(translations.sidebar.ComisstionAccount);
    }
    if (location.pathname.includes(path.kpi)) {
      return t(translations.sidebar.mission);
    }
    if (location.pathname.includes(path.leads)) {
      return t(translations.sidebar.lead);
    }
    if (location.pathname.includes(path.reports)) {
      return t(translations.sidebar.report);
    }
    if (location.pathname.includes(path.Profile)) {
      return t(translations.sidebar.profile);
    }
  }, [location, t, ProjectDetail]);

  const onChangeSearchInput = (keyword: string) => {};

  const content =
    convertLocaltionToTitle?.split('/')[0] +
    (convertLocaltionToTitle?.split('/')[1] ? '/' : '');
  const subContent = convertLocaltionToTitle?.split('/')[2]
    ? convertLocaltionToTitle?.substring(
        convertLocaltionToTitle.indexOf('/') + 1,
      )
    : convertLocaltionToTitle?.split('/')[1];
  const DRAWER = isOpenSidebar ? DRAWER_WIDTH : DRAWER_WIDTH_ON_MOBILE;
  return (
    <RootStyle>
      <ToolbarStyle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            flexShrink: 0,

            width: {
              xs: `calc(${DRAWER}px)`,
              md: `calc(${DRAWER}px)`,
              lg: `calc(${DRAWER}px)`,
            },
          }}
        >
          <IconButton
            sx={{
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <Box
              sx={{ display: 'flex', flexShrink: 0 }}
              onClick={() => handleNavigate()}
            >
              <img src={CTLOTUSTEXT_LOGO} alt="Ctlotus logo." />
              {isOpenSidebar && (
                <img
                  src={CTLOTUS_LOGO}
                  alt="Ctlotus logo."
                  style={{ marginLeft: 7, marginTop: 18 }}
                />
              )}
            </Box>
          </IconButton>
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              padding: '15px',
              ml: '-50px',
              display: 'flex',
              ':hover': {
                cursor: 'pointer',
              },
            }}
          >
            <img src={IconTabbar} alt="Tabbar icon." />
          </IconButton>
        </Box>

        <Box
          flex={1}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box display="flex" alignItems="center">
            <Typography
              sx={{
                ml: 5,
                display: { xs: 'none', sm: 'none', md: 'flex' },
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              fontWeight={700}
              fontSize={'24px'}
              lineHeight={'29px'}
            >
              {content}
            </Typography>
            <Typography
              style={{ alignSelf: 'flex-end' }}
              sx={{
                ml: '5px',
                display: { xs: 'none', sm: 'none', md: 'flex' },
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              fontWeight={400}
              fontSize={'16px'}
              lineHeight={'19px'}
            >
              {subContent}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 1.0 }}>
          {/* <Search
            placeholder="Bạn cần tìm gì?"
            onChangeSearchInput={onChangeSearchInput}
          /> */}
          <Tooltip title="Trung tâm hỗ trợ">
            <Link
              style={{ cursor: 'pointer' }}
              target="_blank"
              href="https://ctlotusctgroupvietnam.notion.site/d2a03fe46b8c4ff38b961c8322be9636?v=88f4f27a8261406fbaad7f672f0901c4&pvs=4"
            >
              <Box>
                <img src={ICON_SUPPORT_WHITE} alt="More icon nav" />
              </Box>
            </Link>
          </Tooltip>
          <Notification />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
