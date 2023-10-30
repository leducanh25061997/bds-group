import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid, Typography, Box } from '@mui/material';
import palette from 'styles/theme/palette';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';
import PLUS_ICON from 'assets/icons/plus-icon.svg';
import REMOVE_ICON from 'assets/icons/remove-icon.svg';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useSelector } from 'react-redux';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';

import SimpleDialog from '../SimpleDialog';
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

const initialSalesUnit = [
  {
    id: 'CanhQuan1',
    isCheck: false,
    key: 'Cánh quân 1',
    name: 'Cánh quân 1',
    value: 'CanhQuan1',
  },
  {
    id: 'CanhQuan2',
    isCheck: false,
    key: 'Cánh quân 2',
    name: 'Cánh quân 2',
    value: 'CanhQuan2',
  },
  {
    id: 'CanhQuan3',
    isCheck: false,
    key: 'Cánh quân 3',
    name: 'Cánh quân 3',
    value: 'CanhQuan3',
  },
  {
    id: 'CanhQuan4',
    isCheck: false,
    key: 'Cánh quân 4',
    name: 'Cánh quân 4',
    value: 'CanhQuan4',
  },
  {
    id: 'CanhQuan5',
    isCheck: false,
    key: 'Cánh quân 5',
    name: 'Cánh quân 5',
    value: 'CanhQuan5',
  },
  {
    id: 'CTLand',
    isCheck: false,
    key: 'CT Land',
    name: 'CT Land',
    value: 'CTLand',
  },
];

export const UnitsParticipatingSales1 = () => {
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

  const handeleAddUnit = (units: any[]) => {
    const _array = units.filter((unit: any) => values.includes(unit.id));
    setSelectedUnits(_array);
  };

  const handeleRemoveUnit = (id: string) => {
    const _values = [...values];
    const _arr = _values.filter(item => item !== id);
    setValues(_arr);
    setValue('salesUnitIds', _arr);
    const newUnit = selectedUnits.filter((item: any) => item.id !== id);
    setSelectedUnits(newUnit);
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
        <Grid item xs={6} md={3} mt={1}>
          <TextFieldCustom
            placeholder="Đơn vị bán hàng"
            label="Đơn vị bán hàng"
            isRequired
            optionsCustom={salesUnit}
            type="customizeMultipleSelect"
            name="salesUnitIds"
            control={control}
            errors={errors}
            handleChangeMultipleSelect={handleSelectUnit}
            setError={setError}
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
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 400,
            }}
            iconNode={<img src={PLUS_ICON} alt="Plus Icon" />}
            handleClick={() => handeleAddUnit(salesUnit)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {selectedUnits.length > 0 &&
          selectedUnits.map((unit: SalesUnitProps) => (
            <Grid
              item
              key={unit.id}
              xs={3}
              md={3}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: '100%',
                  border: '1px solid #FF9EB6',
                  background: '#FDEAF4',
                  borderRadius: '9px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <CustomButton
                  title={unit.name}
                  sxProps={{
                    background: 'transparent',
                    height: 'unset',
                    padding: '0',
                    minWidth: 'unset',
                    color: palette.common.black,
                  }}
                  sxPropsText={{
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                  handleClick={() => handleClickOpen(unit)}
                />
                <CustomButton
                  isIcon
                  sxProps={{
                    background: 'transparent',
                    height: 'unset',
                    padding: '0',
                    minWidth: 'unset',
                  }}
                  sxPropsText={{
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                  iconNode={<img src={REMOVE_ICON} alt="Plus Icon" />}
                  handleClick={() => handeleRemoveUnit(unit.id)}
                />
              </Box>
            </Grid>
          ))}
      </Grid>
      <SimpleDialog open={open} onClose={handleClose} data={selectedUnit} />
    </Box>
  );
};
