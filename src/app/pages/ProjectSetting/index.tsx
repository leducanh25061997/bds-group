import { Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import moment from 'moment';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import useTabs from 'app/hooks/useTabs';

import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import dayjs from 'dayjs';

import path from 'app/routes/path';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

// import { ManagementInformation } from '../ManagementInformation/Loadable';
import { useStaffSlice } from '../Staff/slice';
import { useManagementInformationActionsSlice } from '../ManagementInformation/slice';
import { useOrgchartSlice } from '../Orgchart/slice';

import { SalesProgram } from '../SalesProgram';
import { TemplateProject } from '../TemplateProject';
import { ManagementInformation } from '../ManagementInformation';

const initialFilter = {
  page: 1,
  limit: 10000,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StateLocationProps {
  tabActive?: number;
}

export function ProjectSetting() {
  const navigate = useNavigate();
  const theme = useTheme();
  const params = useParams();
  const { id } = params;
  const { actions: StaffActions } = useStaffSlice();
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { informationProject, isSubmitting } = useSelector(
    selectManagementInformation,
  );
  const dispatch = useDispatch();
  const { handleTabChange, activeTab, setActiveTab } = useTabs(0);
  const { state } = useLocation();
  const locationProps = state as StateLocationProps;

  const managementInformationFormRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState<any>({});

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const canView = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_READ,
    userInfo,
  );

  // const managementInformationFormMethod = useForm({
  //   mode: 'onSubmit',
  // });
  const { actions: orgChardActions } = useOrgchartSlice();

  const handleCancel = useCallback(() => navigate(path.project), [navigate]);

  function toDateWithOutTimeZone(date: any) {
    const tempTime = date.split(':');
    const seconds = +tempTime[0] * 60 * 60 + +tempTime[1] * 60;
    return seconds * 1000;
  }

  useEffect(() => {
    if (!canView) handleCancel();
  }, [canView, handleCancel]);

  useEffect(() => {
    if (informationProject && Object.keys(informationProject).length > 0) {
      const _salesUnit = informationProject.salesUnit.map(item => item.id);

      const _projectManagerIds = informationProject.projectManager.map(
        item => item.id,
      );
      const _supportDepartmentIds = informationProject.supportDepartment.map(
        item => item.id,
      );
      setValue({
        registerTime: informationProject.registerTime,
        cashCollectionAccountant: informationProject.cashCollectionAccountant,
        productCount: informationProject.productCount,
        bookingAmountReservation: informationProject.bookingAmountReservation,
        contractIssuanceTime: informationProject.contractIssuanceTime,
        debtReminderTime1: informationProject.debtReminderTime1,
        debtReminderTime2: informationProject.debtReminderTime2,
        latePaymentInterest: informationProject.latePaymentInterest,
        numberOfDays: informationProject.numberOfDays,
        interestCalculationDays: informationProject.interestCalculationDays,
        calculatedByWorkingDays: informationProject.calculatedByWorkingDays,
        startDate: informationProject.startDate || '',
        endDate: informationProject.endDate || '',
        startTime:
          informationProject.startTime !== 'Invalid date' &&
          informationProject.startTime !== null
            ? dayjs(
                new Date(toDateWithOutTimeZone(informationProject.startTime))
                  .toISOString()
                  .split('.')[0],
              )
            : '',
        endTime:
          informationProject.endTime !== 'Invalid date' &&
          informationProject.endTime !== null
            ? dayjs(
                new Date(toDateWithOutTimeZone(informationProject.endTime))
                  .toISOString()
                  .split('.')[0],
              )
            : '',
        reservationProcessId: informationProject.reservationProcessId,
        depositProcessId: informationProject.depositProcessId,
        reservationRefundProcessId:
          informationProject.reservationRefundProcessId,
        contactCreationProcessId: informationProject.contactCreationProcessId,
        salesUnitIds: _salesUnit.toString(),
        projectManagerIds: _projectManagerIds.toString(),
        supportDepartmentIds: _supportDepartmentIds.toString(),
      });
    } else {
      setValue({});
    }
  }, [informationProject]);

  useEffect(() => {
    if (locationProps?.tabActive) {
      setActiveTab(locationProps?.tabActive);
    }
  }, [locationProps]);

  useEffect(() => {
    if (id) {
      dispatch(projectSettingActions.fetchInformationProject(id));
    }
    if (window.location.search) {
      setActiveTab(Number(window.location.search.split('?type=')[1]));
    } else {
      setActiveTab(0);
    }
  }, [id]);

  useEffect(() => {
    dispatch(StaffActions.fetchListStaff(initialFilter));
    dispatch(orgChardActions.fetchListOrgchart());
    // dispatch(orgChardActions.fetchListOrgchart());
    dispatch(projectSettingActions.fetchListWorkFlow());
  }, []);

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

  const handleStep = () => {
    switch (activeTab) {
      case 0:
        managementInformationFormRef.current?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
        // managementInformationFormMethod.handleSubmit(() => {
        //   handleCreateSettingProject();
        // })();

        break;
      default:
        break;
    }
  };

  // const handleCreateSettingProject = () => {
  //   const formValue = managementInformationFormMethod.getValues();
  //   const formData: any = { ...formValue };
  //   formData.startTime = moment(new Date(formData.startTime)).format('HH:mm');
  //   formData.endTime = moment(new Date(formData.endTime)).format('HH:mm');
  //   formData.projectManagerIds = formData.projectManagerIds.split(',');
  //   formData.supportDepartmentIds = formData.supportDepartmentIds.split(',');
  //   formData.projectId = id;
  //   formData.registerTime = Number(formData.registerTime);
  //   formData.productCount = Number(formData.productCount);
  //   formData.contractIssuanceTime = Number(formData.contractIssuanceTime);
  //   formData.debtReminderTime1 = Number(formData.debtReminderTime1);
  //   formData.debtReminderTime2 = Number(formData.debtReminderTime2);
  //   formData.latePaymentInterest = Number(formData.latePaymentInterest);
  //   formData.numberOfDays = Number(formData.numberOfDays);
  //   formData.interestCalculationDays = Number(formData.interestCalculationDays);
  //   formData.salesUnitIds = formData.salesUnitIds.split(',');
  //   dispatch(
  //     projectSettingActions.createInformationProjectFormData(
  //       formData,
  //       (err?: any) => {
  //         if (err.success) {
  //           dispatch(
  //             snackbarActions.updateSnackbar({
  //               message: 'Thay đổi thông tin thành công',
  //               type: 'success',
  //             }),
  //           );
  //         } else {
  //           dispatch(
  //             snackbarActions.updateSnackbar({
  //               message: 'Thay đổi thông tin không thành công',
  //               type: 'error',
  //             }),
  //           );
  //         }
  //       },
  //     ),
  //   );
  // };

  const handleCreate = () => {
    navigate(`/project/project-setting/${id}/sales-program/create`);
  };

  const [isReset, setIsReset] = useState<boolean>(true);

  return (
    <>
      <Fragment>
        {activeTab?.toString() && (
          <Box
            sx={{
              display: 'flex',
              mb: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display={'flex'} sx={{ alignItems: 'center' }}>
              <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
                <img src={BACK_ICON} onClick={handleCancel} alt="" />
              </Box>
              <Typography
                fontSize={'20px'}
                fontWeight={700}
                lineHeight={'24px'}
              >
                {'Thiết lập dự án'}
              </Typography>
            </Box>
            <ChildrenTab value={activeTab} index={0}>
              {canEdit && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomButton
                    title="Lưu cập nhật"
                    isIcon
                    sxProps={{
                      ml: '16px',
                      borderRadius: '8px',
                      width: { xs: 'auto' },
                      height: { xs: '44px' },
                    }}
                    isLoading={isSubmitting}
                    sxPropsText={{ fontSize: '14px' }}
                    handleClick={handleStep}
                  />
                </Box>
              )}
            </ChildrenTab>

            <ChildrenTab value={activeTab} index={1}>
              {canEdit && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomButton
                    title="Tạo chương trình"
                    isIcon
                    buttonMode="create"
                    variant="outlined"
                    light
                    sxProps={{
                      ml: '16px',
                      borderRadius: '8px',
                      width: { xs: 'auto' },
                      height: { xs: '44px' },
                    }}
                    sxPropsText={{
                      fontSize: '14px',
                      color: palette.primary.button,
                      fontWeight: 700,
                    }}
                    handleClick={handleCreate}
                  />
                  {/* <CustomButton
                title="Lưu cập nhật"
                isIcon
                sxProps={{
                  ml: '16px',
                  borderRadius: '8px',
                  width: { xs: 'auto' },
                  height: { xs: '44px' },
                }}
                sxPropsText={{ fontSize: '14px' }}
              /> */}
                </Box>
              )}
            </ChildrenTab>
          </Box>
        )}
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
              label="Thông tin quản lý"
            />
            <Tab
              sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
              label="Chương trình bán hàng"
            />
            <Tab
              sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
              label="Template dự án"
            />
          </Tabs>
        </Paper>
        {activeTab?.toString() && (
          <Box
            sx={{
              backgroundColor: theme.palette.grey[0],
              marginTop: '8px',
              borderRadius: '20px',
            }}
          >
            <ChildrenTab value={activeTab} index={0}>
              <Box sx={{ p: 3 }}>
                {/* <ManagementInformation form={managementInformationFormMethod} /> */}
                <ManagementInformation
                  isReset={isReset}
                  setIsReset={setIsReset}
                  value={value}
                  setValue={setValue}
                  ref={managementInformationFormRef}
                  canEdit={canEdit}
                />
              </Box>
            </ChildrenTab>
            <ChildrenTab value={activeTab} index={1}>
              <Box sx={{ p: 3 }}>
                <SalesProgram />
              </Box>
            </ChildrenTab>
            <ChildrenTab value={activeTab} index={2}>
              <Box sx={{ p: 3.5 }}>
                <TemplateProject />
              </Box>
            </ChildrenTab>
          </Box>
        )}
      </Fragment>
    </>
  );
}
