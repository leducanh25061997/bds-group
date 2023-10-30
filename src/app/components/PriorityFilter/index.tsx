import {
  Drawer,
  Box,
  Divider,
  Typography,
  FormLabel,
  Grid,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { Icon } from '@iconify/react';
import PRIORITY_FILTER_ICON from 'assets/icons/priority-filter-icon.svg';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useMemo, useState } from 'react';
import { PriorityScreening } from 'types/Enum';
import CustomButton from '../Button';
import { useEffect } from 'react';

export const PriorityFilter = ({
  hadlePriorityFilter,
  setSelectedValue,
  selectedValue
}: {
  hadlePriorityFilter: (v: string) => void;
  setSelectedValue: (v: string) => void;
  selectedValue: string;
}) => {
  const { apartmentInformation } = useSelector(layoutsSelector);
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('');
  const { actions } = useLayoutsSlice();
  const options = useMemo(
    () => [
      {
        id: 0,
        key: '1 Ưu tiên',
        value: PriorityScreening.FIRST_PRIORITY,
        check: false,
      },
      {
        id: 1,
        key: '2 Ưu tiên',
        value: PriorityScreening.SECOND_PRIORITY,
        check: false,
      },
      {
        id: 2,
        key: '3 Ưu tiên',
        value: PriorityScreening.THIRD_PRIORITY,
        check: false,
      },
      {
        id: 3,
        key: 'Trống ưu tiên',
        value: PriorityScreening.WHITE_PRIORITY,
        check: false,
      },
      {
        id: 4,
        key: 'Đang bổ sung ưu tiên',
        value: PriorityScreening.PRIORITY_ADDITIONAL,
      },
    ],
    [],
  );

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue)
    }
  }, [selectedValue])

  const onCloseSidebar = () => {
    setValue('');
    dispatch(
      actions.showRightBar({
        isShowPrirityFilter: false,
      }),
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value)
    setValue(event.target.value);
  };

  const handleReset = () => {
    setValue('');
    setSelectedValue('');
    hadlePriorityFilter('');
    dispatch(
      actions.showRightBar({
        isShowPrirityFilter: false,
      }),
    );
  }

  const handleApprove = (value: string) => {
    if (value) {
      hadlePriorityFilter(value);
      dispatch(
        actions.showRightBar({
          isShowPrirityFilter: false,
        }),
      );
    }
  }

  return (
    <Drawer
      anchor="right"
      open={apartmentInformation?.isShowPrirityFilter}
      // onClose={onCloseSidebar}
      PaperProps={{
        sx: {
          background: '#FFF',
          opacity: 0.97,
          boxShadow: '-4px 0px 8px rgba(0, 0, 0, 0.15)',
          minWidth: '330px',
          padding: '44px 16px 32px 16px',
          maxWidth: '350px',
        },
      }}
      sx={{
        zIndex: 1250,
      }}
    >
      <Box
        sx={{
          color: '#000000',
          maxWidth: '350px',
          height: '100%',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              style={{ marginRight: '5px' }}
              src={PRIORITY_FILTER_ICON}
              alt="More icon nav"
            />
            <Box sx={{ fontWeight: 700, fontSize: '16px', lineHeight: '19px' }}>
              Lọc ưu tiên
            </Box>
          </Box>
          <Box onClick={onCloseSidebar} sx={{ cursor: 'pointer' }}>
            <Icon icon="ph:x-bold" color="#000000" />
          </Box>
        </Box>
        <Divider sx={{ background: '#C8CBCF', margin: '16px 0px' }} />
        <Typography
          sx={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: '24px',
          }}
        >
          Chọn hoặc bỏ các trường để hiển thị các ưu tiên mong muốn
        </Typography>
        <FormControl
          sx={{
            mt: 1,
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={handleChange}
            value={value}
          >
            {options?.map(item => (
              <FormControlLabel
                value={item.value}
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: '#D45B7A',
                      },
                    }}
                  />
                }
                label={item.key}
                key={item.id}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomButton
                title="Thiết lập lại"
                handleClick={() => handleReset()}
                iconNode={
                  <Icon icon="teenyicons:refresh-outline" color="#d45b7a" />
                }
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  border: '1px solid #D45B7A',
                  background: '#fff',
                }}
                isIcon
                sxPropsText={{ fontSize: '14px', color: '#1E1E1E' }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomButton
                title="Áp dụng"
                handleClick={() => handleApprove(value)}
                sxProps={{
                  borderRadius: '4px',
                  width: '100%',
                  background: '#D45B7A',
                }}
                sxPropsText={{ fontSize: '14px', color: '#FFF' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
};
