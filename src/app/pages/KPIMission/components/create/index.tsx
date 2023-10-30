import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  Grid,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { translations } from 'locales/translations';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import Toogle from 'app/components/Toogle';
import CloseIcon from '@mui/icons-material/Close';
import { useStaffSlice } from 'app/pages/Staff/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectStaff } from 'app/pages/Staff/slice/selector';
import path from 'app/routes/path';
import { useProfile } from 'app/hooks';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';

import {
  CalculationDateKpi,
  KpiPerformance,
  MeasurementTimeKpi,
  TypeKpiEnum,
  UnitKpiEnum,
} from '../../slice/types';
import { useKpiMissionSlice } from '../../slice';
import { selectKpiMissionState } from '../../slice/selectors';
import { FormAddPerformance } from '../FormAddPerformance';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = (
  <CheckBoxIcon fontSize="small" sx={{ color: palette.primary.darkRed }} />
);
interface CreateKpiMissionProps {
  isEdit?: boolean;
}
interface StateLocationProps {
  tabActive?: number;
}
export function CreateKpiMission(props: CreateKpiMissionProps) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useProfile();
  const { actions } = useKpiMissionSlice();
  const { actions: staffActions } = useStaffSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { detailKpiMission, isLoading } = useSelector(selectKpiMissionState);
  const { staffManagement } = useSelector(selectStaff);
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { StaffOrgChart } = useSelector(selectOrgchart);
  const { state } = useLocation();
  const locationProps = state as StateLocationProps;
  const FormControl = useForm({
    mode: 'onSubmit',
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset,
  } = FormControl;

  const [checkStatus, setCheckStatus] = useState<boolean>(false);
  const [staffSelected, setStaffSelected] = useState<any[]>([]);
  const [calculationDate, setCalculationDate] = useState<CalculationDateKpi[]>(
    [],
  );
  const [kpiPerformance, setKpiPerformance] = useState<KpiPerformance[]>([]);
  const missionTypeOptions = useMemo(
    () => [
      { id: 1, key: 'Data', value: TypeKpiEnum.DATA },
      { id: 2, key: 'Doanh thu', value: TypeKpiEnum.REVENUE },
    ],
    [],
  );
  const timeOfMeasureOptions = useMemo(
    () => [
      { id: 1, key: 'Ngày', value: MeasurementTimeKpi.DAY },
      { id: 2, key: 'Tuần', value: MeasurementTimeKpi.WEEK },
      { id: 3, key: 'Tháng', value: MeasurementTimeKpi.MONTH },
      { id: 4, key: 'Quý', value: MeasurementTimeKpi.QUARTER_YEAR },
    ],
    [],
  );
  const dateApplyKPI = useMemo(
    () => [
      { id: 1, key: 'T.2', value: CalculationDateKpi.MON },
      { id: 2, key: 'T.3', value: CalculationDateKpi.TUE },
      { id: 3, key: 'T.4', value: CalculationDateKpi.WEB },
      { id: 4, key: 'T.5', value: CalculationDateKpi.THU },
      { id: 2, key: 'T.6', value: CalculationDateKpi.FRI },
      { id: 3, key: 'T.7', value: CalculationDateKpi.SAT },
      { id: 4, key: 'CN', value: CalculationDateKpi.SUN },
    ],
    [],
  );
  const StaffAssignedOptions = useMemo(() => {
    if (userInfo?.staff?.orgChart?.id) {
      if (StaffOrgChart?.data?.length) {
        const listTempStaffOrgChartOptions: any[] = [];
        StaffOrgChart?.data?.forEach((e, index) => {
          if (userInfo?.id !== e?.userId) {
            listTempStaffOrgChartOptions.push({
              id: index + 1,
              key: `${e.fullName} (${e.email})`,
              name: e.fullName,
              position: e.position,
              avatar: '',
              value: e.id,
            });
          }
        });
        return [
          {
            id: 0,
            key: 'Chọn tất cả',
            name: 'Chọn tất cả',
            position: '',
            avatar: '',
            value: 'all',
          },
          ...listTempStaffOrgChartOptions,
        ];
      } else {
        return [];
      }
    } else {
      if (staffManagement?.data.length) {
        const listTempOptions: any[] = [];
        staffManagement?.data?.forEach((e, index) => {
          if (userInfo?.id !== e?.userId) {
            listTempOptions.push({
              id: index + 1,
              key: `${e.fullName} (${e.email})`,
              name: e.fullName,
              position: e.position,
              avatar: '',
              value: e.id,
            });
          }
        });
        return [
          {
            id: 0,
            key: 'Chọn tất cả',
            name: 'Chọn tất cả',
            position: '',
            avatar: '',
            value: 'all',
          },
          ...listTempOptions,
        ];
      } else {
        return [];
      }
    }
  }, [
    StaffOrgChart?.data?.length,
    staffManagement?.data,
    userInfo?.staff?.orgChart?.id,
  ]);
  const disabledField = useMemo(() => {
    if (isEdit) {
      if (userInfo?.staffId === detailKpiMission?.creator?.id) {
        if (!locationProps?.tabActive) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, [
    detailKpiMission?.creator?.id,
    isEdit,
    locationProps?.tabActive,
    userInfo?.staffId,
  ]);

  useEffect(() => {
    // setValue('missionType', TypeKpiEnum.DATA);
    if (userInfo?.staff?.orgChart?.id) {
      dispatch(
        OrgchartActions.fetchListStaffOrgchart({
          page: 1,
          limit: 10000,
          orgChartId: userInfo?.staff?.orgChart?.id,
        }),
      );
    } else {
      dispatch(
        staffActions.fetchListStaff({
          page: 1,
          limit: 10000,
          // orgChartId: userInfo?.staff?.orgChart?.id || '',
        }),
      );
    }
  }, [userInfo]);
  useEffect(() => {
    if (detailKpiMission) {
      setValue('missionName', detailKpiMission?.name ?? '');
      setValue('missionType', detailKpiMission?.type ?? '');
      // setValue('performanceAchieved', detailKpiMission?.performance ?? '');
      // setValue('amountAchieved', detailKpiMission?.quantity ?? '');
      // setValue('optionAchieved', detailKpiMission?.unit ?? '');
      if (detailKpiMission?.kpiPerformance?.length) {
        setKpiPerformance(detailKpiMission?.kpiPerformance);
      }
      setValue('timeOfMeasure', detailKpiMission?.measurementTime ?? '');
      setValue('startTimeApply', detailKpiMission?.startTime ?? '');
      setValue('endTimeApply', detailKpiMission?.endTime ?? '');
      setCheckStatus(detailKpiMission?.status);
      setCalculationDate(detailKpiMission?.calculationDate ?? []);
      if (StaffAssignedOptions?.length) {
        const listIdStaffAssigned = detailKpiMission?.dutyPerformers.map(
          e => e.staffId,
        );
        const optionsSelectedInit = StaffAssignedOptions.filter(staff =>
          listIdStaffAssigned.includes(staff.value),
        );
        if (optionsSelectedInit?.length === StaffAssignedOptions?.length - 1) {
          setStaffSelected(StaffAssignedOptions);
        } else {
          setStaffSelected(optionsSelectedInit);
        }
      }
    }
  }, [StaffAssignedOptions, detailKpiMission]);

  // useEffect(() => {
  //   setValue('optionAchieved', '');
  //   setKpiPerformance([]);
  // }, [watch('missionType')]);

  const handleCancel = () => {
    let activeTab = 0;
    if (locationProps?.tabActive === 0) {
      activeTab = 0;
    } else if (locationProps?.tabActive === 1) {
      activeTab = 1;
    }
    navigate(path.kpi, { state: { tabActive: activeTab } });
  };

  const submit = (data: any) => {
    const payload = {
      name: data?.missionName,
      type: data?.missionType,
      // performance: data?.performanceAchieved
      //   ? Number(data?.performanceAchieved)
      //   : 0,
      // unit: data?.optionAchieved,
      // quantity: data?.amountAchieved ? Number(data?.amountAchieved) : 0,
      kpiPerformance,
      measurementTime: data?.timeOfMeasure,
      startTime: data?.startTimeApply,
      endTime: data?.endTimeApply,
      calculationDate,
      status: checkStatus,
      staffIds: staffSelected.map(e => e.value).filter(el => el !== 'all'),
    };

    if (kpiPerformance?.length < 1) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng thêm KPI!',
          type: 'error',
        }),
      );
      return;
    }
    if (!isEdit) {
      dispatch(
        actions.createKpiMission(payload, (err?: any) => {
          if (err.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thêm mới KPI thành công',
                type: 'success',
              }),
            );
            navigate(path.kpi, {
              state: {
                tabActive: 1,
              },
            });
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: message || 'Thêm mới KPI không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    } else if (id) {
      const payloadEdit = {
        id,
        payload,
      };
      dispatch(
        actions.updateKpiMission(payloadEdit, (err?: any) => {
          if (err.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa KPI thành công',
                type: 'success',
              }),
            );
            navigate(path.kpi, {
              state: {
                tabActive: locationProps?.tabActive,
              },
            });
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: message || 'Chỉnh sửa KPI không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };
  const onError = () => {};

  const handleDeleteField = (name: string) => {
    setValue(name, '');
  };

  const renderTextField = (
    isRequired: boolean = false,
    name: string,
    label: string,
    placeholder: string,
    type: 'text' | 'select' | 'date' | 'integer' | 'currency',
    disabled: boolean = false,
    options: any[] = [],
    endAdornment?: any,
  ) => {
    return (
      <Box
        sx={{
          width: '31%',
          '& .MuiBox-root .MuiInputBase-root': {
            width: '100%',
          },
        }}
      >
        <TextFieldCustom
          placeholder={placeholder}
          isRequired={isRequired}
          label={label}
          type={type}
          name={name}
          options={options}
          control={control}
          errors={errors}
          handleDeleted={() => handleDeleteField(name)}
          setError={setError}
          disabled={disabled || disabledField}
          endAdornment={endAdornment}
          format={name === 'performanceAchieved' ? 'float_number' : undefined}
          allowNegative={type !== 'currency'}
        />
      </Box>
    );
  };

  const handleSelectCalculationDateKpi = (element: any) => {
    if (calculationDate.includes(element.value)) {
      const newCalculationDate = calculationDate.filter(
        e => e !== element.value,
      );
      setCalculationDate(newCalculationDate);
    } else {
      setCalculationDate([...calculationDate, element.value]);
    }
  };

  const renderDateKPI = () => {
    return (
      <Box
        sx={{
          width: '31%',
        }}
      >
        <Typography
          color={theme.palette.primary.light}
          fontSize={'14px'}
          fontWeight={500}
          sx={{
            '& span': {
              color: theme.palette.primary.lighter,
            },
            //   position: 'absolute',
            //   zIndex: 999,
            background: theme.palette.common.white,
            mt: '-5px',
            p: '2px 8px',
          }}
        >
          Ngày tính KPI
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', ml: '8px' }}>
          {dateApplyKPI.map(e => {
            let borderSelect = '';
            let backgroundSlect = '';
            if (calculationDate.includes(e?.value)) {
              if (disabledField) {
                borderSelect = '#AFAFAF';
                backgroundSlect = '#ECECEE';
              } else {
                borderSelect = palette.primary.button;
                backgroundSlect = palette.primary.barList;
              }
            } else {
              borderSelect = '#ECECEE';
              backgroundSlect = 'white';
            }
            return (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: '12px',
                  width: '32px',
                  height: '32px',
                  fontWeight: 400,
                  fontFamily: 'Inter',

                  borderRadius: '50%',
                  border: `solid 1px ${borderSelect}`,
                  background: backgroundSlect,
                  cursor: disabledField ? 'not-allowed' : 'pointer',
                }}
                onClick={() =>
                  disabledField ? null : handleSelectCalculationDateKpi(e)
                }
              >
                <Typography
                  sx={{
                    fontSize: '11px',
                  }}
                >
                  {e.key}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const handleDeleteItemSelected = (itemSelect: any) => {
    const listStatusRest = staffSelected?.filter(e => e !== itemSelect);
    setStaffSelected(listStatusRest);
  };

  const BoxStaffInfo = styled(Typography)({
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  const renderStaffIsAssigned = (listStaff: any, isDelete = false) => {
    return listStaff?.map(
      (e: any) =>
        e?.value !== 'all' && (
          <Box
            sx={{
              width: 'fit-content',
              minWidth: '260px',
              display: 'flex',
              background: '#FEF4FA',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: '5px 13px',
              m: '0px 8px 8px 0px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ width: '28px', height: '28px', mr: '5px' }}
                src={e?.avatar}
              />
              <Box>
                <BoxStaffInfo
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: palette.primary.text,
                  }}
                >
                  {e.name}
                </BoxStaffInfo>
                <BoxStaffInfo
                  sx={{
                    fontWeight: 400,
                    fontSize: '10px',
                    color: palette.primary.hint,
                  }}
                >
                  {e.position}
                </BoxStaffInfo>
              </Box>
            </Box>
            {isDelete && (
              <CloseIcon
                sx={{
                  width: '16px',
                  height: '16px',
                  ml: '18px',
                  color: palette.primary.darkRed,
                  cursor: 'pointer',
                }}
                onClick={() => handleDeleteItemSelected(e)}
              />
            )}
          </Box>
        ),
    );
  };

  const handleChangeStaffAssigned = (event: any, value: any) => {
    if (
      value?.length > 0 &&
      value?.findIndex((element: any) => element === StaffAssignedOptions[0]) >
        -1 &&
      staffSelected?.findIndex(
        elementSelect => elementSelect === StaffAssignedOptions[0],
      ) < 0
    ) {
      setStaffSelected(StaffAssignedOptions);
      return;
    }
    if (
      value?.length > 0 &&
      value?.findIndex((element: any) => element === StaffAssignedOptions[0]) <
        0 &&
      staffSelected?.findIndex(
        elementSelect => elementSelect === StaffAssignedOptions[0],
      ) > -1
    ) {
      setStaffSelected([]);
      return;
    }
    if (
      value?.length > 0 &&
      value?.length === StaffAssignedOptions?.length - 1
    ) {
      if (staffSelected?.findIndex(e => e === StaffAssignedOptions[0]) > -1) {
        setStaffSelected(
          value.filter((select: any) => select !== StaffAssignedOptions[0]),
        );
        return;
      } else {
        setStaffSelected(StaffAssignedOptions);
        return;
      }
    }
    setStaffSelected(value);
  };

  const CustomPopper = useCallback(props => {
    if (props.open) {
      return (
        <Box
          {...props}
          sx={{
            width: '100%',
            position: 'absolute',
            top: 60,
            zIndex: 2,
            '& .MuiPaper-root .MuiAutocomplete-listbox': {
              maxHeight: '260px',
            },
          }}
        />
      );
    } else {
      return <></>;
    }
  }, []);

  return (
    <Fragment>
      <Box
        pb={'43px'}
        mt={'-10px'}
        bgcolor={theme.palette.grey[0]}
        sx={{
          marginBottom: { xs: '24px', md: '0px' },
          borderRadius: 3,
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSubmit(submit, onError)}>
          <Grid container xs={12} sm={12} p={'24px'}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                '& .MuiButtonBase-root': { minWidth: '155px' },
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
                  {`${
                    isEdit && detailKpiMission
                      ? detailKpiMission?.name
                      : 'Thêm mới KPI - Nhiệm vụ'
                  }`}
                </Typography>
              </Box>
              <CustomButton
                title={t(translations.common.update)}
                isIcon
                typeButton={'submit'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: 'flex',
              mt: 3,
              px: 3,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {/* {renderTextField('kpiCode', 'Mã nhiệm vụ', '', 'text', true)} */}
            {renderTextField(
              true,
              'missionName',
              'Tên nhiệm vụ',
              'Nhập tên nhiệm vụ',
              'text',
            )}
            {renderTextField(
              true,
              'missionType',
              'Loại nhiệm vụ',
              'Chọn loại nhiệm vụ',
              'select',
              false,
              missionTypeOptions,
            )}
            {renderTextField(
              true,
              'timeOfMeasure',
              'Thời gian đo',
              'Chọn thời gian đo',
              'select',
              false,
              timeOfMeasureOptions,
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: 'flex',
              mt: 3,
              px: 3,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                width: '65.4%',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                '& .MuiBox-root': {
                  flex: 1,
                },
              }}
            >
              {renderTextField(
                true,
                'startTimeApply',
                'Thời gian áp dụng',
                'Từ ngày',
                'date',
                false,
              )}
              <Typography
                sx={{
                  alignSelf: 'center',
                  flex: 0.1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {' '}
                ~{' '}
              </Typography>
              {renderTextField(
                true,
                'endTimeApply',
                '',
                'Đến ngày',
                'date',
                false,
              )}
            </Box>
            {watch('timeOfMeasure') === MeasurementTimeKpi.DAY ? (
              renderDateKPI()
            ) : (
              <Box sx={{ width: '31%' }} />
            )}
          </Grid>
          <FormAddPerformance
            missionType={watch('missionType')}
            timeOfMeasure={watch('timeOfMeasure')}
            disabledField={disabledField}
            kpiPerformance={kpiPerformance}
            setKpiPerformance={setKpiPerformance}
          />
          <Grid
            container
            xs={12}
            md={8}
            sx={{
              mt: 2.5,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid
              item
              md={6}
              xs={6}
              sx={{
                display: 'flex',
                '& .MuiBox-root': {
                  cursor: disabledField ? 'not-allowed' : 'unset',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter',
                  color: palette.primary.label,
                  mr: 5,
                  minWidth: 'fit-content',
                }}
              >
                Trạng thái
              </Typography>
              <Toogle
                selected={checkStatus}
                onChange={() =>
                  disabledField ? null : setCheckStatus(!checkStatus)
                }
                sxProps={{ mr: 3 }}
              />
            </Grid>
            {disabledField && detailKpiMission?.taskGiver && (
              <>
                <Grid
                  item
                  md={6}
                  xs={6}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    sx={{
                      minWidth: '125px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'Inter',
                      color: palette.primary.label,
                      mr: 2,
                    }}
                  >
                    Người giao chỉ tiêu
                  </Typography>
                  {renderStaffIsAssigned(
                    [
                      {
                        avatar: '',
                        name: detailKpiMission?.taskGiver?.fullName ?? '',
                        position: detailKpiMission?.taskGiver?.position ?? '',
                      },
                    ],
                    false,
                  )}
                </Grid>
              </>
            )}
          </Grid>
          <Grid px={3} my={3}>
            <Box sx={{ borderBottom: 'solid 1px #FFD9EA' }} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              px: 3,
              display: 'flex',
            }}
          >
            {/* {renderTextField(
              'personActive',
              'Người thực hiện nhiệm vụ',
              'Chọn người thực hiện',
              'select',
              false,
              StaffAssignedOptions,
            )} */}

            {(!detailKpiMission ||
              (detailKpiMission &&
                (!!detailKpiMission?.isEdited ||
                  !detailKpiMission?.taskGiver))) && (
              <Box
                sx={{
                  maxWidth: '31%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    '& .MuiAutocomplete-root': {
                      width: '380px',
                      '& .MuiFormControl-root .MuiInputBase-root': {
                        height: '60px',
                        overflow: 'auto',
                        border: 'solid 1px #C8CBCF',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'unset !important',
                          borderColor: 'unset !important',
                          borderWidth: 'unset !important',
                        },
                        '& .MuiAutocomplete-tag': {
                          display: 'none',
                        },
                        '& .MuiAutocomplete-clearIndicator': {
                          display: 'none',
                        },
                      },
                    },
                  }}
                >
                  <Autocomplete
                    multiple
                    // limitTags={0}
                    value={staffSelected?.length ? staffSelected : []}
                    options={StaffAssignedOptions}
                    disableCloseOnSelect
                    getOptionLabel={option => option.key}
                    // PaperComponent={props => (
                    //   <Box
                    //     {...props}
                    //     sx={{
                    //       width: '100%',
                    //       position: 'absolute',
                    //       background: theme.palette.common.white,
                    //     }}
                    //   />
                    // )}
                    PopperComponent={CustomPopper}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder="Chọn người thực hiện"
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li
                        style={{
                          background: selected
                            ? palette.primary.lightRed
                            : 'unset',
                          fontWeight: selected ? 600 : 400,
                        }}
                        {...props}
                      >
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.key}
                      </li>
                    )}
                    sx={{
                      maxWidth: '100%',
                      width: staffSelected?.length > 0 ? 'unset' : '380px',
                    }}
                    onChange={handleChangeStaffAssigned}
                  />
                  <Typography
                    color={theme.palette.primary.light}
                    fontSize={'14px'}
                    fontWeight={500}
                    sx={{
                      '& span': {
                        color: theme.palette.primary.lighter,
                      },
                      position: 'absolute',
                      zIndex: 999,
                      background: theme.palette.common.white,
                      p: '0px 8px',
                      ml: '12px',
                      mt: '-6px',
                    }}
                  >
                    Người thực hiện nhiệm vụ
                  </Typography>
                </Box>
              </Box>
            )}
            {!!staffSelected?.length && (
              <Box
                sx={{
                  ml: '16px',
                  p: '14px',
                  width: '100%',
                  display: 'flex',
                  border: 'solid 1px #EF7197',
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                  maxHeight: '500px',
                  overflow: 'auto',
                }}
              >
                {renderStaffIsAssigned(staffSelected, true)}
              </Box>
            )}
          </Grid>
        </form>
      </Box>
    </Fragment>
  );
}
