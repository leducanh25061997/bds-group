import path from 'app/routes/path';
import CUSTOMER_ICON from 'assets/background/account-customer.svg';
import CANDIDATE_ICON from 'assets/background/candidate-customer.svg';
import DASHBOARD_ICON from 'assets/background/dashboard-icon.svg';
import EMP_ICON from 'assets/background/emp-customer.svg';
import LEAD_ICON from 'assets/background/lead-icon.svg';
import LOGOUT_ICON from 'assets/background/logout-icon.svg';
import PROJECT_ICON from 'assets/background/project-icon.svg';
import REPORT_ICON from 'assets/background/report-customer.svg';
import SETTING_ICON from 'assets/background/setting-icon.svg';
import TRANSACTION_ICON from 'assets/background/trans.svg';
import CHART_ICON from 'assets/background/chart-icon.svg';
import PROCESS_ICON from 'assets/background/process-icon.svg';
import KPI_ICON from 'assets/background/kpi-icon.svg';
import { Fragment, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { LocalStorageService } from 'services';
import PAY_ICON from 'assets/icons/pay-icon.svg';
import PAY_ICON_ACTIVE from 'assets/icons/pay-icon-active.svg';

import CARRER_ICON_ACTIVE from 'assets/background/carrer-active.svg';
import CUSTOMER_ICON_ACTIVE from 'assets/background/customer-active.svg';
import DASHBROAD_ICON_ACTIVE from 'assets/background/dashboard-active.svg';
import Comisstion_ICON_ACTIVE from 'assets/background/comisstion-active.svg';
import LEADS_ICON_ACTIVE from 'assets/background/leads-active.svg';
import PROJECT_ICON_ACTIVE from 'assets/background/project-active.svg';
import REPORT_ICON_ACTIVE from 'assets/background/report-active.svg';
import SETTING_ICON_ACTIVE from 'assets/background/setting-active.svg';
import STAFF_ICON_ACTIVE from 'assets/background/staff-active.svg';
import CHART_ICON_ACTIVE from 'assets/background/chart-icon-active.svg';
import PROCESS_ICON_ACTIVE from 'assets/background/process-icon-active.svg';
import KPI_ICON_ACTIVE from 'assets/background/kpi-icon-active.svg';

import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useProfile } from 'app/hooks';
import classNames from 'classnames';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import palette from 'styles/theme/palette';
import { PermissionKeyEnum } from 'types/Permission';
import { Permission } from 'types';
import useResponsive from 'app/hooks/useResponsive';

const MenuContainer = styled(List)`
  position: unset;
  flex-grow: 1;
  overflow: auto;
`;

const MenuItem = styled(ListItemButton)`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  margin-bottom: 11px;
  &.active {
    background: #fef4fa;
    p {
      font-weight: 700;
      color: #d6465f;
    }
  }
`;

const MenuItemChild = styled(ListItemButton)`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0px 10px 15px;
  margin-bottom: 11px;
  &.active {
    p {
      color: #d6465f;
    }
  }
`;

interface Props {
  isOpenSidebar: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
}

export default function SidebarMenu(props: Props) {
  const { isOpenSidebar, onOpenSidebar, onCloseSidebar } = props;
  const location = useLocation();
  const theme = useTheme();
  const [leftMenu, setLeftMenu] = useState(path.dashboards);
  const [listPermission, setListPermission] = useState<Permission[]>([]);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const userInfo = useProfile();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    const permissions = userInfo?.role?.permissions || [];
    setListPermission(permissions);
  }, [userInfo]);

  const checkPermissionExist = (permissionKey: string[]) => {
    for (let index = 0; index < permissionKey.length; index++) {
      const permission = listPermission.find(
        elementChild => elementChild.key === permissionKey[index],
      );
      if (permission) {
        return true;
      }
    }
    return false;
  };

  const config = useMemo(() => {
    return [
      {
        id: 1,
        label: t(translations.sidebar.dashboard),
        icon: DASHBOARD_ICON,
        iconactive: DASHBROAD_ICON_ACTIVE,
        path: path.dashboards,
        permission: [PermissionKeyEnum.CUSTOMER_READ],
      },
      {
        id: 2,
        label: t(translations.sidebar.project),
        icon: PROJECT_ICON,
        iconactive: PROJECT_ICON_ACTIVE,
        path: path.project,
        permission: [
          PermissionKeyEnum.PROJECT_READ,
          PermissionKeyEnum.PROJECT_CREATE,
        ],
      },
      {
        id: 3,
        label: t(translations.sidebar.lead),
        icon: LEAD_ICON,
        iconactive: LEADS_ICON_ACTIVE,
        path: path.leads,
        status: checkPermissionExist([PermissionKeyEnum.LEAD_TAKE_CARE])
          ? path.leadsCare === leftMenu
          : path.leadManagement === leftMenu,
        permission: [PermissionKeyEnum.LEAD],
        options: [
          {
            id: 3.1,
            label: t(translations.sidebar.leadManagement),
            path: path.leadManagement,
            permission: [PermissionKeyEnum.LEAD_WIEW_ALL],
          },
          {
            id: 3.2,
            label: t(translations.sidebar.leadTakeCare),
            path: path.leadsCare,
            permission: [PermissionKeyEnum.LEAD_TAKE_CARE],
          },
        ],
      },
      {
        id: 4,
        label: t(translations.sidebar.customer),
        icon: CUSTOMER_ICON,
        iconactive: CUSTOMER_ICON_ACTIVE,
        path: path.customer,
        status: path.potentialAccount === leftMenu,
        permission: [
          PermissionKeyEnum.CUSTOMER_READ,
          PermissionKeyEnum.CUSTOMER_CREATE,
        ],
        options: [
          {
            id: 4.1,
            label: t(translations.sidebar.customerPotential),
            path: path.potentialAccount,
            permission: [
              PermissionKeyEnum.CUSTOMER_READ,
              PermissionKeyEnum.CUSTOMER_CREATE,
            ],
          },
          {
            id: 4.2,
            label: t(translations.sidebar.customerTransaction),
            path: path.customerTransaction,
            permission: [
              PermissionKeyEnum.CUSTOMER_READ,
              PermissionKeyEnum.CUSTOMER_CREATE,
            ],
          },
          {
            id: 4.3,
            label: t(translations.sidebar.membershipCityStar),
            path: path.cityStarMembership,
            permission: [
              PermissionKeyEnum.QRCODE_CREATE,
              PermissionKeyEnum.QRCODE_VIEW_ALL,
            ],
          },
          {
            id: 4.2,
            label: t(translations.sidebar.customerCityStar),
            path: path.cityStarCustomer,
            permission: [PermissionKeyEnum.CUSTOMER_CITYSTAR_VIEW_ALL],
          },
          {
            id: 4.4,
            label: t(translations.sidebar.importCustomerLogs),
            path: path.logImportCustomer,
            permission: [
              PermissionKeyEnum.CUSTOMER_READ,
              PermissionKeyEnum.CUSTOMER_CREATE,
            ],
          },
        ],
      },
      {
        id: 5,
        label: t(translations.sidebar.ComisstionAccount),
        icon: EMP_ICON,
        iconactive: STAFF_ICON_ACTIVE,
        path: path.staff,
        permission: [PermissionKeyEnum.STAFF_READ],
      },
      {
        id: 6,
        label: t(translations.sidebar.transaction),
        icon: TRANSACTION_ICON,
        iconactive: Comisstion_ICON_ACTIVE,
        status: path.ComisstionRules === leftMenu,
        path: path.Comisstion,
        permission: [
          PermissionKeyEnum.COMMISSION_POLICY_READ,
          PermissionKeyEnum.COMMISSION_READ,
        ],
        options: [
          {
            id: 6.1,
            label: t(translations.sidebar.transRule),
            path: path.ComisstionRules,
            permission: [PermissionKeyEnum.COMMISSION_POLICY_READ],
          },
          {
            id: 6.2,
            label: t(translations.sidebar.transList),
            path: path.ComisstionsAccount,
            permission: [PermissionKeyEnum.COMMISSION_READ],
          },
          {
            id: 6.3,
            label: t(translations.sidebar.transRequestlist),
            path: path.ComisstionsRequest,
            permission: [PermissionKeyEnum.COMMISSION_READ],
          },
        ],
      },
      {
        id: 7,
        label: t(translations.sidebar.pay),
        icon: PAY_ICON,
        iconactive: PAY_ICON_ACTIVE,
        status: path.receipts === leftMenu,
        path: path.payment,
        permission: [
          PermissionKeyEnum.RECEIPT_READ,
          PermissionKeyEnum.REFUND_READ,
        ],
        options: [
          {
            id: 7.1,
            label: t(translations.sidebar.receipts),
            path: path.receipts,
            permission: [PermissionKeyEnum.RECEIPT_READ],
          },
          {
            id: 7.2,
            label: t(translations.sidebar.refundTicket),
            path: path.refunds,
            permission: [PermissionKeyEnum.REFUND_READ],
          },
        ],
      },
      {
        id: 8,
        label: t(translations.sidebar.report),
        icon: REPORT_ICON,
        iconactive: REPORT_ICON_ACTIVE,
        path: path.reports,
        permission: [PermissionKeyEnum.ROLE_READ],
      },
      {
        id: 9,
        label: t(translations.sidebar.candidate),
        icon: CANDIDATE_ICON,
        iconactive: CARRER_ICON_ACTIVE,
        path: path.carrers,
        permission: [PermissionKeyEnum.ROLE_READ],
      },
      {
        id: 10,
        label: t(translations.sidebar.mission),
        icon: KPI_ICON,
        iconactive: KPI_ICON_ACTIVE,
        path: path.kpi,
        permission: [
          PermissionKeyEnum.KPI_READ,
          PermissionKeyEnum.KPI_CREATE,
          PermissionKeyEnum.KPI_UPDATE,
          PermissionKeyEnum.KPI_DELETE,
        ],
      },
      {
        id: 11,
        label: t(translations.sidebar.organizeChart),
        icon: CHART_ICON,
        iconactive: CHART_ICON_ACTIVE,
        path: path.Orgcharts,
        permission: [PermissionKeyEnum.ROLE_READ],
      },
      {
        id: 12,
        label: t(translations.sidebar.processManagement),
        icon: PROCESS_ICON,
        iconactive: PROCESS_ICON_ACTIVE,
        path: path.processManagement,
        permission: [
          PermissionKeyEnum.WORK_FLOW_READ,
          PermissionKeyEnum.WORK_FLOW_CREATE,
          PermissionKeyEnum.WORK_FLOW_UPDATE,
          PermissionKeyEnum.WORK_FLOW_DELETE,
        ],
      },
      {
        id: 13,
        label: t(translations.sidebar.setting),
        icon: SETTING_ICON,
        iconactive: SETTING_ICON_ACTIVE,
        path: path.settings,
        status: path.permission === leftMenu,
        permission: [PermissionKeyEnum.ROLE_READ],
        options: [
          {
            id: 13.1,
            label: t(translations.sidebar.permission),
            path: path.permission,
            permission: [PermissionKeyEnum.ROLE_READ],
          },
          {
            id: 11.2,
            label: t(translations.sidebar.contentManagement),
            path: path.contentManagement,
            permission: [PermissionKeyEnum.ROLE_READ],
          },
        ],
      },
    ];
  }, [leftMenu, t, userInfo]);

  const onLogOut = () => {
    LocalStorageService.removeAllItem();
    navigate(path.login);
    window.location.reload();
  };

  const handleOpenTab = (pathName: string) => {
    switch (pathName) {
      case path.Comisstion:
        onOpenSidebar();
        setLeftMenu(path.ComisstionRules);
        navigate(path.ComisstionRules);
        break;
      case path.leads:
        onOpenSidebar();
        if (checkPermissionExist([PermissionKeyEnum.LEAD_TAKE_CARE])) {
          setLeftMenu(path.leadsCare);
          navigate(path.leadsCare);
        } else {
          setLeftMenu(path.leadManagement);
          navigate(path.leadManagement);
        }
        break;
      case path.customer:
        onOpenSidebar();
        navigate(path.potentialAccount);
        setLeftMenu(path.potentialAccount);
        break;
      case path.settings:
        onOpenSidebar();
        navigate(path.permission);
        setLeftMenu(path.permission);
        break;
      case path.payment:
        onOpenSidebar();
        navigate(path.receipts);
        setLeftMenu(path.receipts);
        break;
      default:
        break;
    }
  };

  const handleNav = (path: string) => {
    navigate(path);
    setLeftMenu(path);
    !isDesktop && onCloseSidebar();
  };

  return (
    <>
      <MenuContainer>
        {isOpenSidebar ? (
          config?.map(tabConfig => (
            <Fragment key={tabConfig.id}>
              <MenuItem
                sx={{ margin: '0px 6px 0px 6px' }}
                style={{
                  display: checkPermissionExist(tabConfig.permission)
                    ? ''
                    : 'none',
                }}
                className={classNames({
                  active: location.pathname.includes(tabConfig.path as string),
                })}
                onClick={() =>
                  !tabConfig.options?.length &&
                  // !location.pathname.includes(tabConfig.path as string)
                  !(location.pathname === (tabConfig.path as string))
                    ? handleNav(
                        tabConfig.path === '/contracts'
                          ? `${tabConfig.path}/MASTER`
                          : tabConfig.path,
                      )
                    : handleOpenTab(tabConfig.path)
                }
              >
                <Box display={'flex'} alignItems={'center'}>
                  <img
                    src={
                      location.pathname.includes(tabConfig.path as string)
                        ? tabConfig.iconactive
                        : tabConfig.icon
                    }
                    style={{ height: 28, width: 28 }}
                    alt="icon tab"
                  />
                  <Typography
                    fontSize={'14px'}
                    lineHeight={'17px'}
                    fontWeight={'400'}
                    color={palette.primary.text}
                    ml={'15px'}
                  >
                    {tabConfig.label}
                  </Typography>
                </Box>
              </MenuItem>
              {tabConfig.options?.length && (
                <Collapse in={tabConfig.status} timeout="auto" unmountOnExit>
                  {tabConfig.options?.map(configChild => (
                    <Box key={`${configChild.id}_${configChild.path}`}>
                      <MenuItemChild
                        style={{
                          display: checkPermissionExist(configChild.permission)
                            ? ''
                            : 'none',
                        }}
                        sx={{ margin: '0px 6px 0px 6px' }}
                        key={configChild.id}
                        className={classNames({
                          active: location.pathname.includes(
                            configChild.path as string,
                          ),
                        })}
                        onClick={() => {
                          navigate(configChild.path);
                          !isDesktop && onCloseSidebar();
                        }}
                      >
                        <Box
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <span
                            style={{
                              height: 8,
                              width: 8,
                              backgroundColor: location.pathname.includes(
                                configChild.path as string,
                              )
                                ? '#D6465F'
                                : '#C8CBCF',
                              borderRadius: '50%',
                            }}
                          />
                          <Typography
                            fontSize={'14px'}
                            lineHeight={'20px'}
                            fontWeight={'400'}
                            color={palette.text}
                            ml={'12px'}
                          >
                            {configChild.label}
                          </Typography>
                        </Box>
                      </MenuItemChild>
                    </Box>
                  ))}
                </Collapse>
              )}
            </Fragment>
          ))
        ) : (
          <>
            {config?.map(tabConfig => (
              <Box
                key={tabConfig.id}
                style={{
                  display: checkPermissionExist(tabConfig.permission)
                    ? ''
                    : 'none',
                }}
                display="flex"
                justifyContent="center"
                py={2}
                sx={theme => ({
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.palette.grey[200],
                  },
                  borderRadius: '8px',
                  margin: '8px',
                  background: location.pathname.includes(
                    tabConfig.path as string,
                  )
                    ? '#FEF4FA'
                    : 'unset',
                })}
                onClick={() =>
                  !tabConfig.options?.length &&
                  !(location.pathname === (tabConfig.path as string))
                    ? navigate(
                        tabConfig.path === '/contracts'
                          ? `${tabConfig.path}/MASTER`
                          : tabConfig.path,
                      )
                    : handleOpenTab(tabConfig.path)
                }
              >
                <img src={tabConfig.icon} alt="icon tab" />
              </Box>
            ))}
          </>
        )}
        <Box
          textAlign="end"
          sx={{
            bottom: 0,
            ml: '16px',
          }}
        ></Box>
      </MenuContainer>
      <Divider sx={{ background: '#F2F2F2', mt: '30px', mb: '5px' }} />
      <Box
        onClick={onLogOut}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pb: '15px',
          pt: '15px',
          m: '5px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: theme.palette.grey[200],
          },
          borderRadius: '20px',
        }}
      >
        <img
          src={LOGOUT_ICON}
          style={{ height: 28, width: 28 }}
          alt="icon tab"
        />
        {isOpenSidebar && (
          <Typography
            fontSize={'14px'}
            lineHeight={'16px'}
            fontWeight={'400'}
            color={palette.text}
            ml={'12px'}
          >
            {'Đăng xuất'}
          </Typography>
        )}
      </Box>
    </>
  );
}
