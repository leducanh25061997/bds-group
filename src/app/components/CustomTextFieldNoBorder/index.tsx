import { TextField, useTheme } from '@mui/material';
import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { formatCurrency } from 'utils/helpers';
import { FLOAT_NUMBER, INT_NUMBER, NUMBER_REGEX } from 'utils/helpers/regex';

interface FieldProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  type: 'text' | 'float' | 'currency' | 'decimal' | 'int';
  placeholder: string;
  isDisabled?: boolean;
  onChange?: (value: any) => void;
  isHidden?: boolean;
}

const CustomTextFieldNoBorder = (props: FieldProps) => {
  const {
    name,
    control,
    rules,
    type,
    placeholder,
    isDisabled,
    onChange,
    isHidden,
  } = props;
  const theme = useTheme();

  const renderValue = (value?: string) => {
    const defaultValue = 0;
    if (`${value}` === `${defaultValue}`) return '0';
    if (!value) return '';
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'decimal':
        if (String(value).indexOf('%') > -1) {
          return value;
        }
        return `${value}%`;
      case 'float':
        if (String(value).indexOf('.') > -1) {
          return (value + '')?.replace('.', ',');
        }
        return `${value}`;
      default:
        return value;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          if (newValue === undefined) return;
          switch (type) {
            case 'int':
              if (INT_NUMBER.test(newValue)) {
                field.onChange(newValue);
                onChange?.(newValue);
              }
              break;
            case 'decimal':
              const valueDecimal = newValue.split('%').join('');
              if (NUMBER_REGEX.test(valueDecimal)) {
                field.onChange(valueDecimal);
                onChange?.(valueDecimal);
              }
              break;
            case 'currency':
              const _newValue = newValue.split('.').join('');
              if (NUMBER_REGEX.test(_newValue)) {
                field.onChange(_newValue);
                onChange?.(_newValue);
              }
              break;
            case 'float':
              const valueFloat = newValue
                .split(',00')
                .join('')
                .replaceAll(',0', '');
              if (FLOAT_NUMBER.test(valueFloat) && valueFloat !== ',') {
                field.onChange(valueFloat.replace(',', '.'));
                onChange?.(valueFloat);
              }
              break;
            default:
              field.onChange(newValue);
              onChange?.(newValue);
              break;
          }
        };
        const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          if (newValue === undefined || newValue === '') return;
          switch (type) {
            case 'decimal':
              if (newValue.indexOf('%') > -1) {
                return field.onChange(newValue);
              }
              return field.onChange(`${newValue}%`);
            case 'float':
              if (newValue.indexOf('.') > -1 || newValue.indexOf(',') > -1)
                return field.onChange(newValue);
              return field.onChange(`${newValue},00`);
            case 'currency':
              const currency = Math.round(Number(newValue.split('.').join('')));
              return field.onChange(currency);
            default:
              field.onChange(newValue);
              break;
          }
          field.onChange(newValue);
        };
        return (
          <TextField
            {...field}
            onChange={handleChange}
            autoComplete="off"
            onBlur={handleOnBlur}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              display: isHidden ? 'none' : 'unset',
              '& input': {
                color: theme.palette.primary.lighter,
                fontSize: '14px',
                '&::placeholder': {
                  fontSize: '14px',
                  color: theme.palette.grey[100],
                },
              },
            }}
            value={renderValue(field?.value)}
            placeholder={placeholder}
            disabled={isDisabled}
          />
        );
      }}
    />
  );
};

export default React.memo(CustomTextFieldNoBorder);
