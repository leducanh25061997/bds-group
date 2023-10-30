import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';
import palette from 'styles/theme/palette';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';
import PLUS_ICON from 'assets/icons/plus-icon.svg';
import REMOVE_ICON from 'assets/icons/remove-icon.svg';
import { Icon } from '@iconify/react';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';
import { useSelector } from 'react-redux';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import SimpleDialog from '../SimpleDialog';
import { selectManagementInformation } from '../../slice/selectors';

interface SalesUnitProps {
  id: string;
  isCheck: boolean;
  key: string;
  name: string;
  value: string;
}

const initialSaleUnit = {
  id: '',
  isCheck: false,
  key: '',
  name: '',
  value: '',
};

export const UnitsParticipatingSales: React.FC<{ canEdit: boolean }> = ({
  canEdit,
}) => {
  const {
    control,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useFormContext();
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const [values, setValues] = useState<string[]>([]);
  const [salesUnit, setSalesUnit] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>({});
  const [selectedUnits, setSelectedUnits] = useState<any[]>([]);
  const { informationProject } = useSelector(selectManagementInformation);

  useEffect(() => {
    if (informationProject) {
      if (Object.keys(informationProject).length > 0) {
        const data: any[] = [];
        for (let i = 0; i < informationProject.salesUnit.length; i++) {
          data.push(informationProject.salesUnit[i]);
        }
        setSelectedUnits(data);
      }
      if (informationProject.salesUnit.length > 0) {
        const saleUnitIds = informationProject.salesUnit.map(unit => unit.id);
        setValues(saleUnitIds);
      }
    }
  }, [informationProject]);

  const handleSelectUnit = (field: any, value: string) => {
    const _values = typeof value === 'string' ? value.split(',') : value;
    setValues(_values);
    field.onChange(_values);
  };
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (OrgchartManagement && OrgchartManagement?.data?.length > 0) {
      setSalesUnit(OrgchartManagement.data);
    }
  }, [OrgchartManagement]);

  const handleClickOpen = (data: SalesUnitProps) => {
    setSelectedUnit(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUnit = (units: any[]) => {
    console.log(units, values);

    const _array = units.filter((unit: any) => values.includes(unit.id));
    setSelectedUnits(_array);
  };

  const handleRemoveUnit = (id: string) => {
    const _values = [...values];
    const _arr = _values.filter(item => item !== id);
    setValues(_arr);
    // setValue('salesUnitIds', _arr);
    const newUnit = selectedUnits.filter((item: any) => item.id !== id);
    setSelectedUnits(newUnit);
    const _newUnit = newUnit.map(item => item.id);
    setValue('salesUnitIds', _newUnit.toString().replace(/\s/g, ''));
  };

  const handleBlur = (value?: string) => {
    if (value) {
      setValues(value.split(','));
    } else setValues([]);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19px',
              color: palette.primary.button,
            }}
          >
            Đơn vị tham gia bán hàng
          </Typography>
        </Grid>
        {canEdit && (
          <>
            <Grid item xs={6} md={3} mt={1}>
              <ControlledAutocomplete
                name="salesUnitIds"
                control={control}
                label="Đơn vị bán hàng"
                options={salesUnit}
                handleBlur={handleBlur}
                placeholder="Đơn vị bán hàng"
                endAdornment={
                  <Icon icon="mdi:arrow-down-drop" width="24" height="24" />
                }
              />
            </Grid>
            <Grid
              item
              xs={4}
              md={3}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CustomButton
                title={'Thêm đơn vị'}
                isIcon
                sxProps={{
                  background: palette.common.white,
                  color: palette.primary.button,
                  border: '1px solid',
                  borderColor: palette.primary.button,
                  borderRadius: '8px',

                  '&:hover .MuiSvgIcon-root, &:hover .MuiTypography-root': {
                    color: '#ffffff',
                  },
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 400,
                }}
                iconNode={
                  <PlusIcon
                    sx={{
                      fontSize: 18,
                      color: '#D6465F',
                    }}
                  />
                }
                handleClick={() => handleAddUnit(salesUnit)}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid container spacing={2}>
        {selectedUnits.length > 0 &&
          selectedUnits.map((unit: any) => (
            <Grid
              item
              key={unit.id}
              xs={4}
              md={2.4}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: 'primary.lightRed',
                  borderRadius: '9px',
                  padding: '6px 0 6px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleClickOpen(unit)}
                >
                  {unit.name}
                </Typography>

                {canEdit && (
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveUnit(unit.id)}
                    disableRipple
                    sx={{
                      color: 'primary.darkRed',
                      p: '6px 12px',
                      borderRadius: 0,
                      borderLeft: '1px solid white',
                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
      </Grid>
      <SimpleDialog open={open} onClose={handleClose} data={selectedUnit} />
    </Box>
  );
};

const PlusIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 18 18" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 0C8.44771 0 8 0.447716 8 1V8L1 8C0.447715 8 0 8.44771 0 9C0 9.55228 0.447716 10 1 10H8V17C8 17.5523 8.44771 18 9 18C9.55229 18 10 17.5523 10 17V10H17C17.5523 10 18 9.55229 18 9C18 8.44771 17.5523 8 17 8L10 8V1C10 0.447715 9.55229 0 9 0Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
