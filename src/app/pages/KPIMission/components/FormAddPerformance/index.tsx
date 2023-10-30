import { Box, Grid, styled, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { Fragment, useEffect, useMemo, useState } from 'react';
import palette from 'styles/theme/palette';
import { useForm } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { get } from 'lodash';
import { Icon } from '@iconify/react';

import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import {
  KpiPerformance,
  MeasurementTimeKpi,
  TransferTextMeasurementTimeKpi,
  TransferTextUnitKpiEnum,
  TypeKpiEnum,
  UnitKpiEnum,
} from '../../slice/types';

interface FormAddPerformanceProps {
  missionType?: TypeKpiEnum;
  timeOfMeasure?: MeasurementTimeKpi;
  disabledField: boolean;
  kpiPerformance: KpiPerformance[];
  setKpiPerformance: (e: KpiPerformance[]) => void;
}
const BoxItemKPI = styled(Box)(({ theme }) => ({
  background: palette.primary.lightRed,
  borderRadius: '40px',
  width: 'fit-content',
  padding: '10px 12px',
  margin: '0px 12px 12px 0px',
}));
export function FormAddPerformance(props: FormAddPerformanceProps) {
  const {
    missionType,
    disabledField,
    kpiPerformance,
    setKpiPerformance,
    timeOfMeasure,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
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

  const unitAchievedTypeDataOptions = useMemo(
    () => [
      { id: 1, key: 'Khách hàng phát sinh', value: UnitKpiEnum.DAILY },
      { id: 2, key: 'Khách hàng quan tâm', value: UnitKpiEnum.INTERESTED },
      { id: 3, key: 'Khách hàng tiềm năng', value: UnitKpiEnum.POTENTIAL },
      { id: 4, key: 'Leads', value: UnitKpiEnum.LEADS },
    ],
    [],
  );
  const unitAchievedTypeRevenueOptions = useMemo(
    () => [
      { id: 2, key: 'Tiền (VNĐ)', value: UnitKpiEnum.MONEY },
      { id: 3, key: 'Sản phẩm', value: UnitKpiEnum.PRODUCT },
    ],
    [],
  );
  const [isReset, setIsReset] = useState<boolean>(false);

  // useEffect(() => {
  //   setValue('optionAchieved', '');
  //   setKpiPerformance([]);
  // }, [missionType]);

  useEffect(() => {
    if (isReset) {
      setValue('performanceAchieved', '');
      setValue('amountAchieved', '');
      setValue('optionAchieved', '');
    }
    if (
      !watch('performanceAchieved') &&
      !watch('amountAchieved') &&
      !watch('optionAchieved')
    ) {
      setIsReset(false);
    }
  }, [isReset]);

  const submit = async (data: any) => {
    const dataPayload = {
      performance: Number(data?.performanceAchieved),
      quantity: data?.amountAchieved,
      unit: data?.optionAchieved,
    };
    if (Number(data?.performanceAchieved) > 100) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Hiệu suất nên nhỏ hơn 100%',
          type: 'error',
        }),
      );
      return;
    }
    await setKpiPerformance([...kpiPerformance, dataPayload]);
    setIsReset(true);
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
            '& .MuiInputAdornment-root .MuiBox-root': {
              height: '28px',
            },
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

  const getOptionsAchievedForType = () => {
    if (missionType === TypeKpiEnum.DATA) {
      return unitAchievedTypeDataOptions;
    } else if (missionType === TypeKpiEnum.REVENUE) {
      return unitAchievedTypeRevenueOptions;
    } else {
      return [];
    }
  };

  const handleDeleteKpiPerformance = (kpiItem: KpiPerformance) => {
    const newArrKpiPerformance = kpiPerformance.filter(
      item => item !== kpiItem,
    );
    setKpiPerformance(newArrKpiPerformance);
  };

  return (
    <Fragment>
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
        {renderTextField(
          true,
          'performanceAchieved',
          'Hiệu suất đạt',
          'Nhập hiệu suất đạt',
          'integer',
          false,
          [],
          '%',
        )}
        {renderTextField(
          true,
          'amountAchieved',
          'Số lượng đạt',
          'Nhập số lượng đạt',
          'currency',
          false,
          [],
          <Box
            maxWidth="240px"
            sx={{
              '& .MuiBox-root': {
                height: '28px',
                '& .MuiBox-root .MuiInputBase-root': {
                  height: '20px',
                  border: 'unset',
                  '& .MuiSelect-select': {
                    border: 'unset',
                    height: '20px',
                  },
                },
                '& .MuiFormHelperText-root': {
                  bottom: '-25px',
                },
              },
            }}
          >
            <TextFieldCustom
              name="optionAchieved"
              placeholder="Chọn"
              isRequired={true}
              disabled={disabledField}
              type="select"
              control={control}
              errors={errors}
              options={getOptionsAchievedForType()}
            />
          </Box>,
        )}
        <Box width="31%" sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomButton
            handleClick={handleSubmit(submit, onError)}
            title={'Thêm'}
            isHide={disabledField}
            isIcon
            variant="outlined"
            buttonMode={'create'}
            light
            sxProps={{
              borderRadius: 1,
              minWidth: '146px',
            }}
            sxPropsText={{ fontWeight: 400, color: palette.primary.button }}
          />
        </Box>
      </Grid>
      <Grid sx={{ px: 3, display: 'flex', flexWrap: 'wrap' }}>
        {kpiPerformance?.map((kpiItem, i) => (
          <BoxItemKPI key={i} sx={{ display: 'flex' }}>
            <span
              style={{ color: palette.primary.button, fontWeight: 700 }}
            >{`${kpiItem.performance}% / ${kpiItem.quantity} `}</span>
            <span
              style={{ fontWeight: 700, color: theme.palette.common.black }}
            >
              &nbsp;{get(TransferTextUnitKpiEnum, kpiItem.unit)}&nbsp;
            </span>
            {timeOfMeasure && (
              <span>{` / ${get(
                TransferTextMeasurementTimeKpi,
                timeOfMeasure,
              )}`}</span>
            )}
            {!disabledField && (
              <Box
                sx={{ ml: '9px', cursor: 'pointer' }}
                onClick={() => handleDeleteKpiPerformance(kpiItem)}
              >
                <Icon icon="mdi:remove" color="#d6465f" width="18" />
              </Box>
            )}
          </BoxItemKPI>
        ))}
      </Grid>
    </Fragment>
  );
}
