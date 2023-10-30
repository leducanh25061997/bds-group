import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
interface Props {
  list: OptionType[];
  handleSelected?: (value: string) => void;
  field?: string;
  label?: string;
  isIcon?: boolean;
  iconURL?: string;
  valueSelected?: string;
  type?: string;
  handleRemove?: () => void;
  placeholder?: string;
  disable?: boolean
}

interface OptionType {
  label: string;
  value: string;
}

export default function SelectBar(props: Props) {
  const theme = useTheme();
  const {
    list,
    handleSelected,
    label,
    isIcon,
    iconURL,
    valueSelected,
    type,
    field,
    handleRemove,
    placeholder,
    disable,
  } = props;
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (valueSelected) {
      setValue(valueSelected)
    }
  }, [valueSelected])

  const handleChange = (event: SelectChangeEvent) => {
    handleSelected?.(event.target.value);
    setValue(event.target.value);
  };

  const handleRemoveValue = () => {
    setValue('');
    handleRemove && handleRemove();
  };

  return (
    <FormControl
      sx={{
        width: '100%',
        '& .MuiSelect-select': {
          padding: isIcon ? '9px 12px 9px 32px' : '9px 12px',
          width: '100%',
          minWidth: '150px',
          fontSize: '14px',
          color: theme.palette.primary.light,
          bgcolor: theme.palette.common.white,
          border: '1px solid #D3D3D3',
          borderRadius: '8px',
        },
        '& .MuiFormLabel-root': {
          display: 'none',
        },
        '& .MuiInputBase-root': {
          borderRadius: '0px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        mr: { xs: 0, sm: '15px' },
      }}
    >
      {label && (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: '#222222',
            background: theme.palette.common.white,
            p: '0px 8px 0px 8px',
            bottom: '35px',
            ml: '12px',
            position: 'absolute',
            zIndex: 1000,
          }}
        >
          {label}
        </Typography>
      )}
      <Select
        displayEmpty
        onChange={handleChange}
        value={valueSelected}
        disabled={disable}
        renderValue={
          valueSelected !== '' ? undefined : () => <Box>{placeholder}</Box>
        }
        sx={{
          '& .MuiSelect-select': {
            paddingRight: '50px !important',
          },
        }}
        IconComponent={() => (
          <>
            {value && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 30,
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
                onClick={() => handleRemoveValue()}
              >
                <Icon icon="mdi:remove" color="#d6465f" width="18" />
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                right: 10,
                cursor: 'pointer',
                // fontSize: '20px',
              }}
            >
              <Icon icon="mingcute:down-line" width="18" />
            </Box>
            {isIcon && (
              <img
                src={iconURL}
                style={{
                  position: 'absolute',
                  left: 10,
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              />
            )}
          </>
        )}
      >
        {list?.map(item => (
          <MenuItem
            sx={{
              fontSize: '14px',
              height: '30px',
              color: 'black',
              fontWeight: '400',
              m: '3px',
              '&.Mui-selected': {
                backgroundColor: '#FDEAF4',
                borderRadius: '6px',
                fontWeight: '600',
              },
            }}
            disabled={item.value === 'null'}
            key={item.label}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
