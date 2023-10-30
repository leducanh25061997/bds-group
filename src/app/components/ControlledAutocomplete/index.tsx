import {
  Paper,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Fade,
  Box,
  Typography,
} from '@mui/material';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import React, { useRef, useState } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { toLowerCaseNonAccentVietnamese } from 'utils/helpers/regex';

import palette from 'styles/theme/palette';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface AutocompleteProps {
  className?: string;
  name?: string;
  error?: boolean;
  errorText?: string;
  value?: string;
  onChange?: (value?: string) => void;
  label: string;
  disabled?: boolean;
  onBlur?: (value?: string) => void;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  id?: string;
  required?: boolean;
  handleDelete?: () => void;
  placeholder?: string;
  options: any[];
  typePosition?: React.CSSProperties;
  hasSelectAll?: boolean;
}

const Error = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
  color: #ff0000;
`;

const Input = styled.input.attrs(props => ({
  // we can define static props
  type: 'text',
}))<{ $size?: string }>`
  background: #fff;
  color: #000;
  height: 44px;
  font-size: 14px;
  border: none;
  width: 90%;
  &:focus {
    border: none;
  }
  &:focus-visible {
    outline: none;
  }
`;

const InputContainer = styled.div`
  border-radius: 8px;
  background: #fff;
  color: #000;
  height: 44px;
  font-size: 14px;
  border: 1px solid #d3d3d3;
  padding: 0 16px;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  top: -10px;
  background: #ffffff;
  left: 8px;
  padding: 0 10px;
  font-size: 14px;
`;

const IconContainer = styled.div``;

export default function Autocomplete(props: AutocompleteProps) {
  const {
    className,
    error,
    label,
    name,
    startAdornment,
    endAdornment,
    errorText,
    value,
    onChange,
    onBlur,
    disabled,
    required,
    handleDelete,
    placeholder,
    options,
    typePosition,
    hasSelectAll = false,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [list, setList] = React.useState<any[]>([]);
  const [newValue, setNewValue] = React.useState<string>('');
  const [isPopper, setIsPopper] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);

  React.useEffect(() => {
    if (options) {
      if (value) {
        const values = value.split(',');
        setSelectedItem(values);
        const _values = options.filter(function (item) {
          return values.includes(item.id);
        });
        setNewValue(_values.map(item => item.name).toString());
      } else {
        setSelectedItem([]);
        setNewValue('');
      }
    }
  }, [options, value]);

  const handleToggle = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsOpen(true);
    setList(options);
    setAnchorEl(event.currentTarget);
    setNewValue('');
    setIsPopper(true);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    const _list = [...options];
    const newList = _list.filter(v =>
      // toLowerCaseNonAccentVietnamese(v.name)
      v.name.toLowerCase().includes(value.toLowerCase()),
    );
    if (value) {
      setList(newList);
    } else {
      setList(options);
    }
    setNewValue(value);
    onChange && onChange(value);
  };

  const handleClose = () => {
    setList([]);
    const _list = [...options];
    const filteredArray = _list.filter(value =>
      selectedItem.includes(value.id),
    );
    const _filteredArray = filteredArray.map(item => item.name);
    setNewValue(_filteredArray.toString());
    setAnchorEl(null);
    setIsPopper(false);
    if (isOpen) {
      setIsOpen(false);
      onBlur && onBlur(selectedItem.toString());
    }
  };

  useOnClickOutside(rootContainerRef, handleClose);

  const [selectedItem, setSelectedItem] = React.useState<string[]>([]);

  const handleClickMenuItem = (idItem: string) => {
    setIsOpen(true);

    if (hasSelectAll && idItem === 'all') {
      setSelectedItem(prevSelectedItem =>
        prevSelectedItem.includes('all')
          ? []
          : [...options.map(option => option.id), 'all'],
      );
    } else {
      setSelectedItem(prevSelectedItem => {
        if (prevSelectedItem.includes(idItem)) {
          const newSelectedItems = prevSelectedItem.filter(
            item => item !== idItem,
          );

          if (newSelectedItems.includes('all')) {
            const idx = newSelectedItems.indexOf('all');
            newSelectedItems.splice(idx, 1);
          }

          return newSelectedItems;
        } else {
          const newSelectedItems = [...prevSelectedItem, idItem];

          if (newSelectedItems.length === options.length && hasSelectAll) {
            newSelectedItems.unshift('all');
          }

          return newSelectedItems;
        }
      });
    }
  };

  const handleBlurInput = (value: string) => {
    setIsOpen(false);
    onBlur && onBlur(value);
  };

  return (
    <RootContainer ref={rootContainerRef}>
      <Label>
        {label} {required && <span>*</span>}
      </Label>
      <InputContainer
        ref={inputContainerRef}
        onClick={() => inputRef?.current?.focus()}
      >
        <Input
          ref={inputRef}
          onFocus={event => handleToggle(event)}
          aria-owns="simple-popover"
          aria-haspopup="true"
          aria-describedby="filled-weight-helper-text"
          placeholder={placeholder}
          value={newValue}
          onChange={onInputChange}
          disabled={disabled}
          onBlur={() => handleBlurInput(selectedItem.join(','))}
        />
        {endAdornment && <IconContainer>{endAdornment}</IconContainer>}
      </InputContainer>
      {isPopper && (
        <Box
          sx={{
            width: rootContainerRef.current?.offsetWidth,
            maxHeight: '200px',
            overflow: 'hidden auto',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '50px',
            borderRadius: '8px',
            position: typePosition || 'absolute',
            zIndex: 9999999,
            background: '#FFFFFF',
          }}
        >
          {list.length > 0 ? (
            <>
              {hasSelectAll && (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '7px 16px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#EEEEEE',
                    },
                    // background: selectedItem.includes(item.id)
                    //   ? '#EEEEEE'
                    //   : 'transparent',
                  }}
                  onClick={() => handleClickMenuItem('all')}
                >
                  {selectedItem.includes('all') ? (
                    <CheckBoxIcon
                      sx={{
                        color: palette.primary.button,
                      }}
                    />
                  ) : (
                    <CheckBoxOutlineBlankIcon
                      sx={{
                        color: palette.primary.button,
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      ml: 1.5,
                    }}
                  >
                    {'Tất cả'}
                  </Typography>
                </Box>
              )}
              {list.map((item: any) => (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '7px 16px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#EEEEEE',
                    },
                    // background: selectedItem.includes(item.id)
                    //   ? '#EEEEEE'
                    //   : 'transparent',
                  }}
                  key={item.id}
                  onClick={() => handleClickMenuItem(item.id)}
                >
                  {selectedItem.includes(item.id) ? (
                    <CheckBoxIcon
                      sx={{
                        color: palette.primary.button,
                      }}
                    />
                  ) : (
                    <CheckBoxOutlineBlankIcon
                      sx={{
                        color: palette.primary.button,
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      ml: 1.5,
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </>
          ) : (
            <Box
              sx={{
                p: 1,
                textAlign: 'center',
              }}
            >
              {'Không có dữ liệu'}
            </Box>
          )}
        </Box>
      )}
      {error ? <Error>{errorText}</Error> : null}
    </RootContainer>
  );
}

type FormValues = Record<string, string>;

interface FieldProps extends AutocompleteProps {
  control: Control<FormValues>;
  name: keyof FormValues;
  rules?: RegisterOptions;
  autoFormatOnblur?: boolean;
  handleBlur?: (value?: string) => void;
  hasSelectAll?: boolean;
}

export const ControlledAutocomplete = (props: FieldProps) => {
  const {
    control,
    name,
    autoFormatOnblur = true,
    rules,
    value,
    onChange,
    errorText,
    error,
    handleBlur,
    hasSelectAll = false,
    ...rest
  } = props;

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete
            {...rest}
            error={!!fieldState.error}
            errorText={fieldState.error?.message}
            value={field.value || ''}
            onBlur={(currentValue: any) => {
              field.onChange(currentValue);
              handleBlur && handleBlur(currentValue);
            }}
            onChange={(newValue: any) => {}}
            hasSelectAll={hasSelectAll}
          />
        );
      }}
    />
  );
};
