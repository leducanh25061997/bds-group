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
import FilterDateRange from 'app/pages/KPIMission/components/FilterDateRange';
interface Props {
  list: OptionType[];
  handleSelected?: (value: string | any) => void;
  field?: string;
  label?: string;
  isIcon?: boolean;
  iconURL?: string;
  valueSelected?: string;
  type?: string;
  handleRemove?: () => void;
  placeholder?: string;
}

interface OptionType {
  label: string;
  value: string;
  getValue?: any;
}

export default function FilterSelect(props: Props) {
  const theme = useTheme();
  const {
    list,
    handleSelected,
    label,
    isIcon,
    iconURL,
    valueSelected = '',
    type,
    field,
    handleRemove,
    placeholder,
  } = props;
  const [value, setValue] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    handleSelected?.(event.target.value);
    setValue(event.target.value);
  };

  const handleRemoveValue = () => {
    setValue('');
    handleSelected?.('');
    handleRemove && handleRemove();
  };

  const renderFilterComponent = () => {
    if (type === 'orgChart') {
      return (
        <FormControl
          sx={{
            width: '100%',
            '& .MuiSelect-select': {
              padding: isIcon ? '9px 12px 9px 32px' : '9px 12px',
              width: '100%',
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
            onChange={handleChange}
            defaultValue={list[0].value}
            value={valueSelected || value}
            placeholder={placeholder}
            displayEmpty
            renderValue={selected => {
              if (selected) {
                return selected;
              }
              return <em>{placeholder}</em>;
            }}
            IconComponent={() => (
              <>
                <KeyboardArrowDownIcon
                  sx={{
                    position: 'absolute',
                    right: 10,
                    cursor: 'pointer',
                    fontSize: '20px',
                  }}
                />
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
    if (type === 'date') {
      return (
        <FilterDateRange
          list={list}
          handleSelected={handleSelected}
          isIcon
          iconURL={iconURL}
          valueSelected={valueSelected}
          type={type}
          placeholder={placeholder}
        />
      );
    }
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
          mr: 1,
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
          defaultValue={list[0].value}
          value={valueSelected || value}
          placeholder={placeholder}
          sx={{
            '& .MuiSelect-select': {
              paddingRight: '50px !important',
            },
          }}
          renderValue={selected => {
            const item = list.find(x => x.value === selected);
            if (item && item.label) return item.label;
            if (selected) {
              return selected;
            }
            return placeholder;
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
  };

  return renderFilterComponent();
}
