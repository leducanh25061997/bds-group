import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import EYE_ICON from 'assets/background/eye-icon.svg';
import EYE_SLASH_ICON from 'assets/background/eye-slash-icon.svg';
import CHECK_ICON from 'assets/background/checkgreen_icon.svg';
import dayjs, { Dayjs } from 'dayjs';
import React, { Fragment } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';
import { Option, OptionAutocomplete, OptionCustom } from 'types/Option';
import { formatCurrency, formatDate } from 'utils/helpers';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  CURRENCY_NUMBER,
  DECIMAL_NUMBER,
  EMAIL_REGEX,
  FLOAT_NUMBER,
  INT_NUMBER,
  NUMBER_REGEX,
  NUMBER_REGEX_EXCEPT_NEGATIVE,
  PHONE_NUMBER_REGREX,
} from 'utils/helpers/regex';
import { TYPEIdentification } from 'types/Enum';
import palette from 'styles/theme/palette';
import { CustomerItem } from 'types/User';
import { StaffItem } from 'types/Staff';

interface Props {
  label?: string | React.ReactNode;
  type?:
    | 'text'
    | 'number'
    | 'phone'
    | 'date'
    | 'select'
    | 'selectcustom'
    | 'selectsearch'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'textarea2'
    | 'password'
    | 'selectMultiple'
    | 'time'
    | 'currency'
    | 'percent'
    | 'yearOnly'
    | 'decimalNew'
    | 'area'
    | 'upper'
    | 'customizeMultipleSelect'
    | 'integer';
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  control?: Control<any>;
  options?: Option[];
  optionsCustom?: OptionAutocomplete[];
  optionAutoComplete?: OptionAutocomplete[];
  disabled?: boolean;
  errors?: any;
  setError?: any;
  rows?: number;
  warningMessage?: string;
  onChange?: (value: string | number | any) => void;
  handleChangeMultipleSelect?: (field: any, value: string) => void;
  onBlur?: (value: string | number) => void;
  onChecked?: (checked: boolean) => void;
  defaultValue?: string;
  mlRadio?: string | number;
  sizeWarningText?: string;
  format?:
    | 'currency'
    | 'number'
    | 'email'
    | 'float_number'
    | 'phone'
    | 'upper'
    | 'cmnd'
    | 'cccd'
    | 'image'
    | 'decimal'
    | TYPEIdentification;
  max?: number;
  min?: number;
  endAdornment?: any;
  startAdornment?: any;
  isHiddenPastDay?: boolean;
  isHiddenFeatureDay?: boolean;
  isShowDropDown?: boolean;
  sxProps?: SxProps;
  fullWidth?: boolean;
  rules?: RegisterOptions;
  handleSelected?: (value: CustomerItem | StaffItem | any) => void;
  handleDeleted?: () => void;
  backgroundColor?: string;
  textColor?: string;
  allowNegative?: boolean;
  isDefaultId?: boolean;
  isTrim?: boolean;
}

const TextInput = styled(TextField)``;

function TextFieldCustom(props: Props) {
  const theme = useTheme();
  const {
    label,
    type = 'text',
    isRequired = false,
    placeholder,
    name,
    control,
    options,
    optionAutoComplete,
    optionsCustom,
    disabled,
    errors,
    rows,
    warningMessage,
    onChange,
    onChecked,
    defaultValue,
    mlRadio,
    sizeWarningText,
    format,
    setError,
    onBlur,
    max,
    min,
    endAdornment,
    startAdornment,
    isHiddenPastDay,
    isHiddenFeatureDay,
    isShowDropDown,
    handleChangeMultipleSelect,
    sxProps,
    fullWidth,
    rules,
    handleSelected,
    handleDeleted,
    backgroundColor,
    textColor,
    allowNegative = true,
    isDefaultId = false,
    isTrim,
  } = props;

  const [value, setValue] = React.useState<Dayjs | null | any>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const handleClickShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const [selected, setSelected] = React.useState<number[]>([]);
  const [openSelect, setOpenSelect] = React.useState(false);

  const returnInputType = (type: string, showPassword: boolean) => {
    if (type === 'password' && showPassword) {
      return 'text';
    } else if (type === 'password' && !showPassword) {
      return 'password';
    } else {
      return 'text';
    }
  };

  const renderValue = (value?: string) => {
    const defaultValue = 0;
    if (`${value}` === `${defaultValue}`) return '0';
    if (!value?.toString().trim()) return '';
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        if (String(value).indexOf('%') > -1) {
          return value;
        }
        return `${value}%`;
      case 'decimalNew':
        if (String(value).indexOf('.') > -1) {
          return (value + '')?.replace('.', ',');
        }
        return `${value}`;
      case 'area':
        const num_parts = value.toString().split('.');
        num_parts[0] = formatCurrency(num_parts[0]);
        return num_parts.join(',');
      default:
        return value;
    }
  };

  const renderInputType = () => {
    if (
      type === 'text' ||
      type === 'password' ||
      type === 'currency' ||
      type === 'percent' ||
      type === 'decimalNew' ||
      type === 'area' ||
      type === 'upper' ||
      type === 'integer'
    ) {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
            validate: value => {
              if (!value) return true;
              if (format === 'number') {
                if (!INT_NUMBER.test(value + '')) {
                  return 'Sai định dạng số';
                }
                if (max && +value > max) {
                  return `Tối đa là ${max}`;
                }
                if (min && +value < min) {
                  return `Tối thiểu là ${min}`;
                }
              }
              if (format === 'float_number') {
                if (
                  !/^[0-9]*?\.?[0-9]*?$/.test(value + '') &&
                  !/^[0-9]*?\,?[0-9]*?$/.test(value + '')
                ) {
                  return 'Sai định dạng số';
                }
                if (max && +value > max) {
                  return `Tối đa là ${max}`;
                }
                if (min && +value < min) {
                  return `Tối thiểu là ${min}`;
                }
              }
              if (format === TYPEIdentification.IDENTITY_CARD) {
                if (!INT_NUMBER.test(value + '')) {
                  return 'Sai định dạng số';
                }
                if (value.length < 9) {
                  return `Chứng minh nhân minh phải đủ 9 kí tự số`;
                }
                if (value.length > 9) {
                  return `Tối đa là 9 kí tự số`;
                }
              }
              if (format === TYPEIdentification.PASSPORT) {
                if (value.length < 8) {
                  return `Chứng minh nhân minh phải đủ 8 kí tự`;
                }
                if (value.length > 8) {
                  return `Tối đa là 8 kí tự`;
                }
              }
              if (format === TYPEIdentification.CITIZEN_IDENTIFICATION) {
                if (!INT_NUMBER.test(value + '')) {
                  return 'Sai định dạng số';
                }
                if (value.length < 12) {
                  return `Căn cước công dân phải đủ 12 kí tự số`;
                }
                if (value.length > 12) {
                  return `Tối đa là 12 kí tự số`;
                }
              }
              if (format === 'decimal') {
                if (!NUMBER_REGEX.test(value + '')) {
                  return 'Sai định dạng số';
                }
                if (max && +value > max) {
                  return `Tối đa là ${max}`;
                }
                if (min && +value < min) {
                  return `Tối thiểu là ${min}`;
                }
              }
              if (format === 'email') {
                if (!EMAIL_REGEX.test(value + '')) {
                  return 'Sai định dạng email';
                }
              }
              if (format === 'phone') {
                const phoneNumber = value.trim();
                if (
                  /\s/g.test(phoneNumber) ||
                  !PHONE_NUMBER_REGREX.test(phoneNumber) ||
                  phoneNumber.length !== 10
                ) {
                  return 'Sai định dạng số điện thoại';
                }
              }
              return true;
            },
            ...rules,
          }}
          defaultValue={defaultValue}
          render={({ field, fieldState }) => {
            let title = label ? label : '' + isRequired ? '*' : '';
            return (
              <TextInput
                // label={title}
                // variant="outlined"
                // focused
                placeholder={placeholder}
                autoComplete="off"
                type={returnInputType(type, showPassword)}
                fullWidth
                {...field}
                value={renderValue(field?.value)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let newValue = event.target.value;
                  if (isTrim) {
                    newValue = newValue.trim();
                  }
                  switch (type) {
                    case 'currency':
                      const _newValue = newValue.split('.').join('');
                      const testRegex = allowNegative
                        ? NUMBER_REGEX
                        : NUMBER_REGEX_EXCEPT_NEGATIVE;
                      if (testRegex.test(_newValue)) {
                        const currency = Math.round(Number(_newValue));
                        field.onChange(currency);
                        onChange?.(currency);
                      }
                      break;
                    case 'upper':
                      const valueUpper = newValue.toUpperCase();
                      field.onChange(valueUpper);
                      onChange?.(valueUpper);
                      break;
                    case 'percent':
                      const valueDecimal = newValue.split('%').join('');
                      if (INT_NUMBER.test(valueDecimal)) {
                        field.onChange(valueDecimal);
                        onChange?.(valueDecimal);
                      }
                      break;
                    case 'integer':
                      const valueInt = newValue;
                      if (INT_NUMBER.test(valueInt)) {
                        field.onChange(valueInt);
                        onChange?.(valueInt);
                      }
                      break;
                    case 'decimalNew':
                      const valueFloat = newValue
                        .split(',00')
                        .join('')
                        .replaceAll(',0', '');
                      if (
                        (FLOAT_NUMBER.test(valueFloat) && valueFloat !== ',') ||
                        (DECIMAL_NUMBER.test(valueFloat) && valueFloat !== '.')
                      ) {
                        field.onChange(valueFloat.replace(',', '.'));
                        onChange?.(valueFloat);
                      }
                      break;
                    case 'area':
                      const areaValue = newValue.split('.').join('');
                      if (
                        (FLOAT_NUMBER.test(areaValue) && areaValue !== ',') ||
                        (DECIMAL_NUMBER.test(areaValue) && areaValue !== '.')
                      ) {
                        field.onChange(areaValue.replace(',', '.'));
                        onChange?.(areaValue);
                      }
                      break;
                    default:
                      field.onChange(newValue);
                      onChange?.(newValue);
                      break;
                  }
                  setError?.(field.name, {
                    message: '',
                  });
                }}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  const newValue = event.target.value;
                  if (event.target.value && format === 'currency') {
                    const newValue = (event.target.value + '').replaceAll(
                      '.',
                      '',
                    );
                    if (!CURRENCY_NUMBER.test(event.target.value + '')) {
                      setError?.(field.name, {
                        message: 'Sai định dạng số',
                      });
                      return;
                    }
                    field.onChange(formatCurrency(newValue));
                  }
                  switch (type) {
                    case 'percent':
                      const valueDecimal = newValue.split('%').join('');
                      onBlur?.(event.target.value);
                      return field.onChange(Number(valueDecimal));
                    case 'currency':
                      onBlur?.(event.target.value);
                      return field.onChange(
                        Number(newValue.split('.').join('')),
                      );
                    default:
                      break;
                  }
                  onBlur?.(event.target.value);
                }}
                onKeyDown={event => {
                  if (
                    type === 'area' &&
                    event.key === '.' &&
                    !(field.value + '').includes('.')
                  ) {
                    field.onChange(field.value + ',');
                  }
                }}
                disabled={disabled}
                sx={{
                  mt: 1,
                  mb: fieldState?.error?.message ? '8px' : 'unset',
                  '& .MuiFormControl-root': {
                    position: 'relative',
                  },
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    background: backgroundColor
                      ? backgroundColor
                      : theme.palette.common.white,
                    color: textColor ? textColor : theme.palette.common.black,
                    height: '44px',
                    '& input': {
                      padding: '8.45px 20px',
                      fontSize: '14px',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.lighter,
                    position: 'absolute',
                    bottom: '-22px',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black !important',
                    fontWeight: 500,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: `1px solid ${
                      fieldState?.error?.message
                        ? theme.palette.error.lighter
                        : '#D3D3D3'
                    } !important`,
                  },
                  ...sxProps,
                }}
                helperText={fieldState?.error?.message || ''}
                InputProps={
                  type === 'password'
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              aria-label="show password"
                              component="label"
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? (
                                <img src={EYE_ICON} alt="eye-icon" />
                              ) : (
                                <img src={EYE_SLASH_ICON} alt="eye-icon" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : {
                        endAdornment: (
                          <InputAdornment position="end">
                            {endAdornment && (
                              <Box
                                sx={{
                                  borderLeft: '1px solid #E0E1E4',
                                  paddingLeft: '9px',
                                  height: '32px',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: '14px', color: 'black' }}
                                >
                                  {endAdornment}
                                </Typography>
                              </Box>
                            )}
                          </InputAdornment>
                        ),
                        startAdornment: startAdornment && (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                height: '32px',
                                alignItems: 'center',
                                display: 'flex',
                              }}
                            >
                              <Typography
                                sx={{ fontSize: '14px', color: 'black' }}
                              >
                                {startAdornment}
                              </Typography>
                            </Box>
                          </InputAdornment>
                        ),
                      }
                }
              />
            );
          }}
        />
      );
    }
    if (type === 'selectsearch') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            const defaultValue = optionAutoComplete?.find(
              element => element.id === field.value,
            );
            return (
              <Autocomplete
                options={optionAutoComplete || []}
                disabled={disabled}
                onChange={(e, data) => {
                  field?.onChange(data?.id);
                  onChange?.(data?.id || '');
                  if (!data) {
                    handleDeleted?.();
                  }
                }}
                noOptionsText="Không tìm thấy dữ liệu."
                defaultValue={optionAutoComplete?.find(
                  element => element.id === field.value,
                )}
                value={
                  field.value && defaultValue?.label
                    ? { label: defaultValue?.label, id: field.value }
                    : null
                }
                sx={{
                  mt: 1,
                  '.MuiInputBase-input': {
                    height: '10px',
                  },
                }}
                renderOption={(props, option, { selected }) => {
                  return (
                    <li
                      {...props}
                      style={{
                        background: 'white',
                        padding: '4px',
                      }}
                    >
                      <Box
                        display={'flex'}
                        flexDirection={'row'}
                        sx={{
                          backgroundColor: selected ? '#FDEAF4' : 'white',
                          width: '100%',
                          borderRadius: '5px',
                          p: '4px',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                        onClick={() => {
                          handleSelected?.(option);
                        }}
                      >
                        <Box
                          display={'flex'}
                          ml={1.2}
                          flexDirection={'column'}
                          height={'25px'}
                          justifyContent={'center'}
                        >
                          <Typography
                            color={'black'}
                            fontSize={'13px'}
                            fontWeight={selected ? '700' : '400'}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  );
                }}
                renderInput={params => (
                  <TextInput
                    label={label}
                    variant="outlined"
                    focused
                    placeholder={placeholder}
                    autoComplete="off"
                    {...params}
                    value={renderValue(field?.value)}
                    disabled={disabled}
                    sx={{
                      mb: fieldState?.error?.message ? '8px' : 'unset',
                      '& .MuiFormControl-root': {
                        position: 'relative',
                      },
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        background: theme.palette.common.white,
                        color: textColor
                          ? textColor
                          : theme.palette.common.black,
                        '& input': {
                          padding: '8.45px 20px',
                          fontSize: '14px',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: theme.palette.error.lighter,
                        position: 'absolute',
                        bottom: '-22px',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black !important',
                        fontWeight: 500,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: `1px solid ${
                          fieldState?.error?.message
                            ? theme.palette.error.lighter
                            : '#D3D3D3'
                        } !important`,
                      },
                      ...sxProps,
                    }}
                    helperText={
                      errors[field.name]?.message || fieldState?.error?.message
                    }
                  />
                )}
              />
            );
          }}
        />
      );
    }
    if (type === 'textarea') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            return (
              <TextInput
                label={label}
                variant="outlined"
                focused
                placeholder={placeholder}
                type={type}
                fullWidth
                {...field}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  field.onChange(event.target.value);
                }}
                autoComplete="off"
                multiline
                rows={rows}
                disabled={disabled}
                sx={{
                  mt: 1,
                  '& .MuiFormControl-root': {
                    position: 'relative',
                  },
                  mb: fieldState?.error?.message ? '8px' : 'unset',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    width: '100%',
                    // width: { md: '875px', xs: '435px', sm: '725px' },
                    background: theme.palette.common.white,
                    color: textColor ? textColor : theme.palette.common.black,
                    minHeight: '44px',
                    display: 'inline',
                    '& input': {
                      padding: '8.45px 13px',
                      display: 'inline',
                      fontSize: '14px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black !important',
                    fontWeight: 500,
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.lighter,
                    position: 'absolute',
                    bottom: '-22px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #D3D3D3 !important',
                  },
                }}
                helperText={errors[field.name]?.message || ''}
              />
            );
          }}
        />
      );
    }
    if (type === 'textarea2') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            return (
              <TextInput
                label={label}
                variant="outlined"
                focused
                placeholder={placeholder}
                type={type}
                fullWidth
                {...field}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  field.onChange(event.target.value);
                }}
                autoComplete="off"
                multiline
                rows={rows}
                disabled={disabled}
                sx={{
                  mt: 1,
                  '& .MuiFormControl-root': {
                    position: 'relative',
                  },
                  mb: fieldState?.error?.message ? '8px' : 'unset',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    width: '100%',
                    // width: { md: '430px', xs: '215px', sm: '350px' },
                    background: theme.palette.common.white,
                    color: textColor ? textColor : theme.palette.common.black,
                    minHeight: '44px',
                    fontSize: '14px',
                    display: 'inline',
                    padding: '10px 20px 10px 20px',
                    border: `1px solid #D3D3D3`,
                    '& input': {
                      padding: '8.45px 13px',
                      display: 'inline',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.lighter,
                    position: 'absolute',
                    bottom: '-22px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  ...sxProps,
                }}
                helperText={errors[field.name]?.message || ''}
              />
            );
          }}
        />
      );
    }
    if (type === 'select') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required:
              isRequired && !disabled
                ? `Vui lòng chọn ${
                    label ? label?.toString().toLowerCase() : ''
                  }`
                : '',
          }}
          defaultValue={
            isDefaultId
              ? options?.find(item => item?.isDefault)?.id || ''
              : options?.find(item => item?.isDefault)?.value || ''
          }
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
                      ? undefined
                      : () => (
                          <Box sx={{ color: theme.palette.grey[500] }}>
                            {placeholder}
                          </Box>
                        )
                  }
                  defaultValue={
                    options?.find(item => item?.isDefault)?.value + '' || ''
                  }
                  disabled={disabled}
                  value={field.value}
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
                  {options?.map(_x => (
                    <MenuItem
                      value={_x.value || _x.id || _x.name}
                      key={_x.id}
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
                      {format === 'image' ? (
                        <img src={_x.key} />
                      ) : (
                        _x.key || _x.description || _x.name
                      )}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {fieldState?.error?.message || ''}
                </FormHelperText>
              </Box>
            );
          }}
        />
      );
    }
    if (type === 'selectcustom') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            const defaultValue = optionAutoComplete?.find(
              element => element.id === field.value,
            );
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
                }}
              >
                <Autocomplete
                  options={optionAutoComplete || []}
                  onChange={(e, data) => {
                    field?.onChange(data?.id);
                    onChange?.(data?.id || '');
                  }}
                  noOptionsText="Không tìm thấy dữ liệu."
                  defaultValue={optionAutoComplete?.find(
                    element => element.id === field.value,
                  )}
                  value={
                    field.value && defaultValue?.label
                      ? { label: defaultValue?.label, id: field.value }
                      : null
                  }
                  sx={{
                    mt: 1,
                    '.MuiInputBase-input': {
                      height: '10px',
                    },
                  }}
                  renderOption={(props, option, { selected }) => {
                    return (
                      <li
                        {...props}
                        style={{
                          background: option?.isCheck ? '#FDEAF4' : 'white',
                          padding: '5px 15px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={option.avatar}
                              style={{ height: '28px', width: '28px' }}
                            />
                            <Box sx={{ ml: '5px' }}>
                              <Typography
                                fontWeight={700}
                                fontSize={option?.isCheck ? '14px' : '12px'}
                                color={'black'}
                              >
                                {option.label}
                              </Typography>
                              <Typography fontSize={'10px'} color={'#7A7A7A'}>
                                {option.position}
                              </Typography>
                            </Box>
                          </Box>
                          {option?.isCheck && (
                            <img
                              src={CHECK_ICON}
                              style={{ position: 'absolute', right: 15 }}
                            />
                          )}
                        </Box>
                      </li>
                    );
                  }}
                  renderInput={params => (
                    <TextInput
                      placeholder={placeholder}
                      autoComplete="off"
                      {...params}
                      value={renderValue(field?.value)}
                      sx={{
                        mb: fieldState?.error?.message ? '8px' : 'unset',
                        '& .MuiFormControl-root': {
                          position: 'relative',
                        },
                        '& .MuiInputBase-root': {
                          borderRadius: '8px',
                          width: { md: '281px' },
                          background: theme.palette.common.white,
                          color: textColor
                            ? textColor
                            : theme.palette.common.black,
                          fontSize: '14px',
                          border: `1px solid #D3D3D3`,
                          '& input': {
                            padding: '8.45px 20px',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color: theme.palette.error.lighter,
                          position: 'absolute',
                          bottom: '-22px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        ...sxProps,
                      }}
                      helperText={
                        errors[field.name]?.message ||
                        fieldState?.error?.message
                      }
                    />
                  )}
                />
                <FormHelperText>
                  {fieldState?.error?.message || ''}
                </FormHelperText>
              </Box>
            );
          }}
        />
      );
    }
    if (type === 'customizeMultipleSelect') {
      return (
        <Controller
          name={name}
          control={control}
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
                  width: '100%',
                }}
                onMouseEnter={() => {
                  setOpenSelect(true);
                }}
              >
                <Select
                  open={openSelect}
                  onChange={(event: SelectChangeEvent) => {
                    // field.onChange(event.target.value);
                    handleChangeMultipleSelect?.(field, event.target.value);
                  }}
                  displayEmpty
                  renderValue={selected => (
                    <>
                      <Box>
                        <Typography fontSize={'14px'} color={'black'}>
                          {placeholder}
                        </Typography>
                      </Box>
                    </>
                  )}
                  multiple
                  disabled={disabled}
                  value={field.value || []}
                  sx={{
                    width: '100%',
                    // width: { md: '281px' },
                    borderRadius: '8px',
                    '& .MuiSelect-select': {
                      padding: '10px 20px 10px 20px',
                      fontSize: '14px',
                      color: theme.palette.primary.light,
                      bgcolor: theme.palette.secondary.lighter,
                      border: `1px solid #D3D3D3`,
                      borderRadius: '8px',
                      display: 'flex',
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
                      background: theme.palette.common.white,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    ...sxProps,
                  }}
                  MenuProps={{
                    PaperProps: {
                      onMouseLeave: () => {
                        setOpenSelect(false);
                      },
                    },
                  }}
                >
                  {optionsCustom?.map(_x => (
                    <MenuItem
                      value={_x.id}
                      key={_x.id}
                      sx={{
                        fontSize: '14px',
                        height: '45px',
                        color: 'black',
                        fontWeight: '400',
                        m: '3px',
                        '&.Mui-disabled': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ ml: '5px' }}>
                            <Typography
                              fontWeight={700}
                              fontSize={'12px'}
                              color={'black'}
                            >
                              {_x.name}
                            </Typography>
                            <Typography fontSize={'10px'} color={'#7A7A7A'}>
                              {_x.position}
                            </Typography>
                          </Box>
                        </Box>
                        {field.value && field.value.indexOf(_x.id) !== -1 && (
                          <img
                            src={CHECK_ICON}
                            style={{ position: 'absolute', right: 15 }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {fieldState?.error?.message || ''}
                </FormHelperText>
              </Box>
            );
          }}
        />
      );
    }

    if (type === 'selectMultiple') {
      return (
        <Controller
          name={name}
          control={control}
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
                  width: '100%',
                }}
              >
                <Select
                  onChange={(event: SelectChangeEvent) => {
                    field.onChange(event.target.value);
                    onChange?.(event.target.value);
                  }}
                  displayEmpty
                  renderValue={selected => (
                    <>
                      <Box>
                        <Typography fontSize={'14px'} color={'black'}>
                          {placeholder}
                        </Typography>
                      </Box>
                    </>
                  )}
                  disabled={disabled}
                  value={field.value}
                  sx={{
                    width: '100%',
                    // width: { md: '281px' },
                    borderRadius: '8px',
                    '& .MuiSelect-select': {
                      padding: '10px 20px 10px 20px',
                      fontSize: '14px',
                      color: theme.palette.primary.light,
                      bgcolor: theme.palette.secondary.lighter,
                      border: `1px solid #D3D3D3`,
                      borderRadius: '8px',
                      display: 'flex',
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
                      background: theme.palette.common.white,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    ...sxProps,
                  }}
                >
                  {optionsCustom?.map(_x => (
                    <MenuItem
                      value={_x.value || _x.name}
                      key={_x.id}
                      sx={{
                        fontSize: '14px',
                        height: '45px',
                        color: 'black',
                        fontWeight: '400',
                        m: '3px',
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-disabled': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ ml: '5px' }}>
                            <Typography
                              fontWeight={700}
                              fontSize={'12px'}
                              color={'black'}
                            >
                              {_x.name}
                            </Typography>
                            <Typography fontSize={'10px'} color={'#7A7A7A'}>
                              {_x.position}
                            </Typography>
                          </Box>
                        </Box>
                        {_x.isCheck && (
                          <img
                            src={CHECK_ICON}
                            style={{ position: 'absolute', right: 15 }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {fieldState?.error?.message || ''}
                </FormHelperText>
              </Box>
            );
          }}
        />
      );
    }
    if (type === 'date') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs} {...field}>
                <Stack
                  spacing={3}
                  sx={{ '& .MuiSvgIcon-root': { width: '22px' } }}
                >
                  <DesktopDatePicker
                    minDate={isHiddenPastDay ? dayjs() : undefined}
                    maxDate={isHiddenFeatureDay ? dayjs() : undefined}
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue: Dayjs | null) => {
                      if (
                        newValue?.year() + '' === 'NaN' ||
                        newValue?.month() + '' === 'NaN' ||
                        newValue?.date() + '' === 'NaN'
                      ) {
                        setError?.(field.name, {
                          message: 'Không hợp lệ',
                        });
                      } else {
                        setError?.(field.name, {
                          message: '',
                        });
                      }
                      field.onChange(formatDate(newValue));
                      setValue(formatDate(newValue));
                    }}
                    value={field.value || value}
                    // label={label}
                    disabled={disabled}
                    renderInput={params => (
                      <TextField
                        variant="outlined"
                        focused
                        {...params}
                        autoComplete="off"
                        inputProps={{
                          ...params.inputProps,
                          placeholder,
                        }}
                        sx={{
                          mt: 1,
                          '& .MuiFormControl-root': {
                            position: 'relative',
                          },

                          mb: fieldState?.error?.message ? '8px' : 'unset',
                          '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            height: '44px',
                            // width: { md: '281px' },
                            background: theme.palette.common.white,
                            color: theme.palette.primary.light,
                            marginTop: '8px',
                            fontSize: '14px',
                            '& input': {
                              padding: '8.45px 13px',
                            },
                            border: `1px solid ${
                              fieldState?.error?.message
                                ? theme.palette.error.lighter
                                : '#D3D3D3'
                            }`,
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.error.lighter,
                            position: 'absolute',
                            bottom: '-22px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          ...sxProps,
                        }}
                        helperText={
                          errors[field.name]?.message ||
                          fieldState?.error?.message
                        }
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            );
          }}
        />
      );
    }
    if (type === 'yearOnly') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs} {...field}>
                <Stack
                  spacing={3}
                  sx={{ '& .MuiSvgIcon-root': { width: '22px' } }}
                >
                  <DesktopDatePicker
                    views={['year']}
                    minDate={isHiddenPastDay ? dayjs() : undefined}
                    maxDate={isHiddenFeatureDay ? dayjs() : undefined}
                    inputFormat="YYYY"
                    onChange={(newValue: Dayjs | null) => {
                      field.onChange(newValue);
                      setValue(newValue);
                    }}
                    value={field.value || value}
                    disabled={disabled}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete="off"
                        sx={{
                          mt: 1,
                          '& .MuiFormControl-root': {
                            position: 'relative',
                          },
                          mb: fieldState?.error?.message ? '8px' : 'unset',
                          '& .MuiInputBase-root': {
                            borderRadius: '0px',
                            background: '#f2f6ff',
                            color: theme.palette.primary.light,
                            fontSize: '14px',
                            '& input': {
                              padding: '8.45px 13px',
                            },
                            border: fieldState?.error?.message
                              ? `1px solid ${theme.palette.error.lighter}`
                              : 'unset',
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.error.lighter,
                            position: 'absolute',
                            bottom: '-22px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                        helperText={
                          errors[field.name]?.message ||
                          fieldState?.error?.message
                        }
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            );
          }}
        />
      );
    }
    if (type === 'radio') {
      let styleDisplay = palette.primary.button;
      if (disabled) {
        styleDisplay = theme.palette.grey[100];
      }

      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          defaultValue={options?.find(item => item?.isDefault)?.value || ''}
          render={({ field, fieldState }) => {
            return (
              <FormControl
                {...field}
                sx={{
                  ml: mlRadio || 'unset',
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '20px',
                  },
                  '& .MuiButtonBase-root:hover': {
                    backgroundColor: 'unset',
                  },
                  '& .MuiFormGroup-root': {
                    maxHeight: '40px',
                  },
                  '& .MuiFormGroup-root .MuiFormControlLabel-root .MuiButtonBase-root > span > svg':
                    {
                      fill: fieldState?.error?.message
                        ? theme.palette.error.lighter
                        : styleDisplay,
                    },
                  ...sxProps,
                }}
              >
                <RadioGroup
                  row
                  defaultValue={
                    options?.find(item => item?.isDefault)?.value || ''
                  }
                  onChange={(event: SelectChangeEvent) => {
                    field.onChange(event.target.value);
                    onChange?.(event.target.value);
                  }}
                  value={field.value}
                >
                  {options?.map(item => (
                    <FormControlLabel
                      value={item.value}
                      control={<Radio />}
                      label={item.key}
                      key={item.id}
                      disabled={disabled}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          }}
        />
      );
    }
    if (type === 'checkbox') {
      let styleDisplay = palette.primary.button;
      if (disabled) {
        styleDisplay = theme.palette.grey[100];
      }
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
          }}
          render={({ field, fieldState }) => {
            return (
              <RadioGroup
                {...field}
                row
                defaultValue={options?.length ? options[0]?.value : ''}
                sx={{
                  ml: mlRadio || 'unset',
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '20px',
                    fill: fieldState?.error?.message
                      ? theme.palette.error.lighter
                      : styleDisplay,
                  },
                  '& .MuiButtonBase-root:hover': {
                    backgroundColor: 'unset',
                  },
                }}
              >
                {options?.map(item => (
                  <FormControlLabel
                    value={item.value}
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          field.onChange(event.target.checked);
                          onChecked?.(event.target.checked);
                        }}
                      />
                    }
                    label={item.key}
                    key={item.id}
                    disabled={disabled}
                  />
                ))}
              </RadioGroup>
            );
          }}
        />
      );
    }
    if (type === 'time') {
      return (
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired && !disabled ? 'Vui lòng nhập' : '',
            validate: {
              isValid: v => {
                const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

                return (
                  (regex.test(dayjs(v).format('HH:mm')) && !isRequired) ||
                  v === '' ||
                  'Giờ không hợp lệ'
                );
              },
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs} {...field}>
                <Stack
                  spacing={3}
                  sx={{ '& .MuiSvgIcon-root': { width: '22px' } }}
                >
                  <TimePicker
                    ampm={false}
                    onChange={(newValue: Dayjs | null) => {
                      field.onChange(newValue);
                    }}
                    value={field.value || null}
                    disabled={disabled}
                    renderInput={params => (
                      <TextField
                        {...params}
                        sx={{
                          mt: 1,
                          '& .MuiFormControl-root': {
                            position: 'relative',
                          },
                          mb: fieldState?.error?.message ? '8px' : 'unset',
                          '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            height: '44px',
                            background: theme.palette.common.white,
                            color: theme.palette.primary.light,
                            mt: 1,
                            fontSize: '14px',
                            '& input': {
                              padding: '8.45px 13px',
                            },
                            border: fieldState?.error?.message
                              ? `1px solid ${theme.palette.error.lighter}`
                              : '1px solid #D3D3D3',
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.error.lighter,
                            position: 'absolute',
                            bottom: '-22px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                        autoComplete="off"
                        helperText={errors[field.name]?.message || ''}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            );
          }}
        />
      );
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '& .MuiInputBase-root .MuiInputAdornment-root': {
          zIndex: 2,
        },
        width: fullWidth ? '100%' : null,
      }}
    >
      {!!label && (
        <Typography
          color={
            backgroundColor
              ? theme.palette.common.white
              : theme.palette.primary.light
          }
          fontSize={'14px'}
          fontWeight={500}
          sx={{
            '& span': {
              color: theme.palette.primary.lighter,
            },
            position: 'absolute',
            zIndex: 999,
            background: backgroundColor
              ? '#0F1C2F'
              : theme.palette.common.white,
            p: '0px 8px',
            ml: '12px',
            mt:
              type === 'selectsearch' ||
              type === 'select' ||
              type === 'selectMultiple' ||
              type === 'selectcustom' ||
              type === 'customizeMultipleSelect'
                ? '-10px'
                : '-3px',
          }}
        >
          {label}
          {isRequired && (
            <span style={{ color: '#E42B2C', marginLeft: 0.5 }}>*</span>
          )}
        </Typography>
      )}
      {renderInputType()}
      <Typography
        mt={1}
        fontSize={sizeWarningText || '14px'}
        color={theme.palette.primary.light}
        fontStyle={'italic'}
      >
        {warningMessage}
      </Typography>
    </Box>
  );
}

export default React.memo(TextFieldCustom);
