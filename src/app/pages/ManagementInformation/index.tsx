import { forwardRef, useEffect } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import { LoadingScreen } from 'app/components/Table';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import useResponsive from 'app/hooks/useResponsive';

import { useManagementInformationActionsSlice } from '../ManagementInformation/slice';
import { useOrgchartSlice } from '../Orgchart/slice';
import { useStaffSlice } from '../Staff/slice';
import { selectStaff } from '../Staff/slice/selector';
import { selectOrgchart } from '../Orgchart/slice/selector';

import { GeneralSettings } from './components/GeneralSettings';
import { ContractInformation } from './components/ContractInformation';
import { UnitsParticipatingSales } from './components/UnitsParticipatingSales';
import { AdminAccount } from './components/AdminAccount';
import TransactionProcess from './components/TransactionProcess';

export const ManagementInformation = forwardRef<HTMLFormElement, any>(
  (props, ref) => {
    const { canEdit } = props;
    const params = useParams();
    const { id } = params;
    const managementInformationFormMethod = useForm<any>({
      mode: 'onSubmit',
      defaultValues: {
        calculatedByWorkingDays: false,
      },
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { actions: StaffActions } = useStaffSlice();
    const { actions: orgChardActions } = useOrgchartSlice();
    const { actions: projectSettingActions } =
      useManagementInformationActionsSlice();
    const { actions: snackbarActions } = useSnackbarSlice();

    const { informationProject, isInfoManagementLoading, isWorkflowLoading } =
      useSelector(selectManagementInformation);
    const { isLoading: isStaffLoading } = useSelector(selectStaff);
    const { isLoading: isOrgChartLoading } = useSelector(selectOrgchart);
    const isDesktop = useResponsive('up', 'lg');

    function toDateWithOutTimeZone(date: any) {
      const tempTime = date.split(':');
      const seconds = +tempTime[0] * 60 * 60 + +tempTime[1] * 60;
      return seconds * 1000;
    }

    useEffect(() => {
      if (props.value && Object.keys(props.value).length > 0) {
        managementInformationFormMethod.reset(props.value);
      } else {
        managementInformationFormMethod.reset({});
      }
    }, [props.value]);

    const handleCreateSettingProject = () => {
      const formValue = managementInformationFormMethod.getValues();
      const formData: any = { ...formValue };
      props.setValue(formValue);
      formData.startTime = formData.startTime
        ? moment(new Date(formData.startTime)).format('HH:mm')
        : null;
      formData.endTime = formData.endTime
        ? moment(new Date(formData.endTime)).format('HH:mm')
        : null;
      formData.projectManagerIds = formData.projectManagerIds
        ? formData.projectManagerIds.split(',')
        : [];
      formData.supportDepartmentIds = formData.supportDepartmentIds
        ? formData.supportDepartmentIds.split(',')
        : [];
      formData.projectId = id;
      formData.registerTime = Number(formData.registerTime);
      formData.productCount = Number(formData.productCount);
      formData.contractIssuanceTime = Number(formData.contractIssuanceTime);
      formData.debtReminderTime1 = Number(formData.debtReminderTime1);
      formData.debtReminderTime2 = Number(formData.debtReminderTime2);
      formData.latePaymentInterest = Number(formData.latePaymentInterest);
      formData.numberOfDays = Number(formData.numberOfDays);
      formData.interestCalculationDays = Number(
        formData.interestCalculationDays,
      );
      formData.salesUnitIds = formData.salesUnitIds
        ? formData.salesUnitIds.split(',')
        : [];

      dispatch(
        projectSettingActions.createInformationProjectFormData(
          formData,
          (err?: any) => {
            if (err.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Thay đổi thông tin thành công',
                  type: 'success',
                }),
              );
              navigate('/project');
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Thay đổi thông tin không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    };

    if (
      isInfoManagementLoading ||
      isWorkflowLoading ||
      isOrgChartLoading ||
      isStaffLoading
    ) {
      return (
        <LoadingScreen>
          <img
            src="/static/loader/spinner.svg"
            alt=""
            width={100}
            height={100}
          />
        </LoadingScreen>
      );
    }

    return (
      <Box
        sx={{
          background: '#FFFFFF',
          borderRadius: '20px',
        }}
      >
        <form
          ref={ref}
          onSubmit={managementInformationFormMethod.handleSubmit(
            handleCreateSettingProject,
          )}
        >
          <FormProvider {...managementInformationFormMethod}>
            <Grid container spacing={2}>
              <Grid item md={5.8}>
                <GeneralSettings canEdit={canEdit} />
              </Grid>
              {isDesktop && (
                <Grid
                  item
                  md={0.4}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Divider orientation="vertical" />
                </Grid>
              )}

              <Grid item md={5.8}>
                <ContractInformation canEdit={canEdit} />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: '32px' }}>
              <TransactionProcess canEdit={canEdit} />
            </Box>
            <Box sx={{ marginTop: '32px' }}>
              <UnitsParticipatingSales canEdit={canEdit} />
            </Box>
            <Box sx={{ marginTop: '32px' }}>
              <AdminAccount canEdit={canEdit} />
            </Box>
          </FormProvider>
        </form>
      </Box>
    );
  },
);

ManagementInformation.displayName = 'ManagementInformation';
