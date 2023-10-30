import {
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  Box,
  MenuItem,
} from '@mui/material';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Control, Controller } from 'react-hook-form';
import { ComisstionItem } from 'types/User';

interface Props {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  control?: Control<any>;
  disabled?: boolean;
  errors?: any;
  rows?: number;
  warningMessage?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  mlRadio?: string | number;
  sizeWarningText?: string;
  options?: ComisstionItem[];
  handleSelected?: (value: string) => void;
  handleDeleted?: () => void;
}

const TextInput = styled(TextField)``;

function SelectSearch(props: Props) {
  const theme = useTheme();
  const {
    label,
    isRequired = false,
    placeholder,
    name,
    control,
    disabled,
    warningMessage,
    defaultValue,
    sizeWarningText,
    onChange,
    options,
    handleSelected,
    handleDeleted,
  } = props;
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpenSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOpenDropDown = () => {
    setIsOpenSearch(true);
  };

  return (
    <Fragment>
      <Typography
        color={theme.palette.primary.light}
        fontSize={'14px'}
        fontWeight={600}
        sx={{
          '& span': {
            ml: 0.5,
            color: theme.palette.primary.lighter,
          },
        }}
      >
        {label}
        {isRequired && label && <span>*</span>}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired && !disabled ? 'Trường này là bắt buộc' : '',
        }}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          return (
            <Fragment>
              <TextInput
                placeholder={placeholder}
                onClick={handleOpenDropDown}
                type="text"
                fullWidth
                {...field}
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  onChange?.(event.target.value);
                }}
                onKeyDown={event => {
                  if (event.which === 8) {
                    handleDeleted?.();
                  }
                }}
                autoComplete="off"
                disabled={disabled}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-root': {
                    borderRadius: '0px',
                    background: '#f2f6ff',
                    color: theme.palette.primary.light,
                    fontSize: '14px',
                    '& input': {
                      padding: '8.45px 13px',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.lighter,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                helperText={fieldState?.error?.message || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"></InputAdornment>
                  ),
                }}
              />
              {isOpenSearch && (
                <Box
                  bgcolor={theme.palette.grey[0]}
                  width="100%"
                  ref={wrapperRef}
                  height="auto"
                  position="absolute"
                  boxShadow="0 0 2px 0 rgb(145 158 171 / 24%), 0 20px 40px -4px rgb(145 158 171 / 24%)"
                  zIndex={2}
                  p={2}
                >
                  {options?.map(item => (
                    <MenuItem
                      key={item.id}
                      sx={{
                        p: 1,
                        borderBottom: `1px solid ${theme.palette.secondary.dark}`,
                        mb: 1,
                      }}
                      onClick={() => {
                        handleSelected?.(item.id as string);
                        setIsOpenSearch(false);
                      }}
                    >
                      <Typography
                        fontSize="14px"
                        lineHeight="17px"
                        color={theme.palette.primary.light}
                      >
                        {item.fullName}
                      </Typography>
                    </MenuItem>
                  ))}
                  {!options?.length && (
                    <Typography
                      fontSize="14px"
                      lineHeight="17px"
                      color={theme.palette.primary.light}
                    >
                      Vui lòng nhập để tìm kiếm dữ liệu
                    </Typography>
                  )}
                </Box>
              )}
            </Fragment>
          );
        }}
      />
      <Typography
        mt={1}
        fontSize={sizeWarningText || '14px'}
        color={theme.palette.primary.light}
      >
        {warningMessage}
      </Typography>
    </Fragment>
  );
}

export default React.memo(SelectSearch);
