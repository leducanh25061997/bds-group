import { Control, Controller, RegisterOptions } from 'react-hook-form';
import {
  Box,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  useTheme,
} from '@mui/material';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { StatusProductCorlorEnum, StatusProductEnum } from 'types/Enum';
import { Icon } from '@iconify/react';

interface Options {
  color: StatusProductCorlorEnum;
  name: StatusProductEnum;
  value: number
}

interface Props {
  label?: string | React.ReactNode;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  control?: Control<any>;
  options?: Options[];
  disabled?: boolean;
  onChange?: (value: string | number | any) => void;
  defaultValue?: string;
  endAdornment?: any;
  sxProps?: SxProps;
  rules?: RegisterOptions;
  handleDeleted?: () => void;
  backgroundColor?: string;
  isDefaultId?: boolean;
}

export const ControlledSelectColor = (props: Props) => {
  const theme = useTheme();
  const {
    label,
    isRequired = false,
    placeholder,
    name,
    control,
    options,
    disabled,
    onChange,
    sxProps,
    handleDeleted,
    backgroundColor,
    isDefaultId = false,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required:
          isRequired && !disabled
            ? `Vui lòng chọn ${label ? label?.toString().toLowerCase() : ''}`
            : '',
      }}
      render={({ field, fieldState }) => {
        return (
          <Box
            sx={{
              mt: 1,
              position: 'relative',
              '& .MuiFormHelperText-root': {
                color: theme.palette.error.lighter,
                position: 'absolute',
                bottom: '-13px',
              },
              '& .MuiInputBase-root': {
                pr: '0px',
                '& .Mui-disabled': {
                  background: '#f4f4f4',
                },
                '& .MuiSvgIcon-root': {
                  zIndex: 2,
                },
              },
            }}
          >
            <Select
              onChange={(event: SelectChangeEvent) => {
                field.onChange(event.target.value);
                onChange?.(event.target.value);
              }}
              displayEmpty
              renderValue={
                field.value
                  ? (value) => (
                    <Box>{value}</Box>
                  )
                  : () => (
                      <Box sx={{ color: theme.palette.grey[500] }}>
                        {placeholder}
                      </Box>
                    )
              }
              disabled={disabled}
              // value={field.value}
              sx={{
                width: '100%',
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  padding: '10px 20px 10px 20px',
                  paddingRight: '60px !important',
                  textAlign: 'start',

                  fontSize: '14px',
                  color: theme.palette.primary.light,
                  bgcolor: theme.palette.secondary.lighter,
                  border: `1px solid ${
                    fieldState?.error?.message
                      ? theme.palette.error.lighter
                      : '#D3D3D3'
                  }`,
                  borderRadius: '8px',
                  // display: 'flex',
                  width: '100%',
                },
                '& .MuiFormLabel-root': {
                  display: 'none',
                },
                '& .MuiInputBase-root': {
                  mt: 1,
                },
                mb: fieldState?.error?.message ? '8px' : 'unset',
                '& .MuiInputBase-input': {
                  borderRadius: '8px',
                  background: backgroundColor
                    ? backgroundColor
                    : theme.palette.common.white,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                ...sxProps,
              }}
              endAdornment={
                field?.value &&
                handleDeleted && (
                  <Box sx={{ position: 'absolute', right: '31px' }}>
                    <IconButton
                      color="primary"
                      aria-label="show password"
                      component="label"
                      onClick={() => {
                        if (field?.value) {
                          handleDeleted?.();
                        }
                      }}
                    >
                      <img src={CLOSE_ICON} alt="close-icon" />
                    </IconButton>
                  </Box>
                )
              }
            >
              {options?.map((_x: Options) => (
                <MenuItem
                  value={_x.name}
                  key={_x.value}
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
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          background: _x.color,
                          borderRadius: '2px',
                          width: '28px',
                          height: '20px',
                          mr: 2,
                        }}
                      ></Box>
                      {_x.name}
                    </Box>
                    {field.value === _x.name ? <Box>
                      <Icon icon="teenyicons:tick-solid" color="#2fb350" />
                    </Box> : null}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{fieldState?.error?.message || ''}</FormHelperText>
          </Box>
        );
      }}
    />
  );
};
