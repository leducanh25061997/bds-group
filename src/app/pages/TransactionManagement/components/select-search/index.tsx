import {
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Control, Controller } from 'react-hook-form';
import { CustomerItem } from 'types/User';
import SearchIcon from '@mui/icons-material/Search';
import palette from 'styles/theme/palette';
import { StaffItem } from 'types/Staff';
import CLOSE_ICON from 'assets/background/close-icon.svg';

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
  onChange?: (value: string, name?: string) => void;
  defaultValue?: string;
  mlRadio?: string | number;
  sizeWarningText?: string;
  options?: CustomerItem[] | StaffItem[];
  handleSelected?: (
    value: CustomerItem | StaffItem | any,
    indexArray?: number,
  ) => void;
  handleDeleted?: () => void;
  indexArray?: number;
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
    indexArray,
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
        fontWeight={500}
        sx={{
          '& span': {
            color: theme.palette.primary.lighter,
          },
          position: 'absolute',
          zIndex: 999,
          background: theme.palette.common.white,
          p: '0px 8px',
          ml: '12px',
          mt: '-2px',
        }}
      >
        {label}
        {isRequired && label && (
          <span style={{ color: '#E42B2C', marginLeft: 0.5 }}>*</span>
        )}
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
                  onChange?.(event.target.value, name);
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
                  mb: fieldState?.error?.message ? '8px' : 'unset',
                  '& .MuiFormControl-root': {
                    position: 'relative',
                  },
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    // width: { md: '281px' },
                    background: theme.palette.common.white,
                    color: theme.palette.common.black,
                    height: '44px',
                    fontSize: '14px',
                    border: fieldState?.error?.message
                      ? `1px solid ${theme.palette.error.lighter}`
                      : '1px solid #D3D3D3',
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
                }}
                helperText={fieldState?.error?.message || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        sx={{
                          borderLeft: '1px solid #E0E1E4',
                          paddingLeft: '9px',
                          height: '32px',
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '14px',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <SearchIcon sx={{ color: palette.primary.hint }} />
                        </Box>
                        {field?.value && handleDeleted && (
                          <Box
                            sx={{
                              width: '36px',
                              ml: '4px',
                            }}
                          >
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
                              <img
                                width="20px"
                                height="20px"
                                src={CLOSE_ICON}
                                alt="close-icon"
                              />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              {isOpenSearch && (
                <Box
                  bgcolor={theme.palette.grey[0]}
                  // width="100%"
                  ref={wrapperRef}
                  maxHeight="300px"
                  overflow="auto"
                  position="absolute"
                  boxShadow="0 0 2px 0 rgb(145 158 171 / 24%), 0 20px 40px -4px rgb(145 158 171 / 24%)"
                  zIndex={1000}
                  p={2}
                >
                  {options?.map((item: any) => (
                    <MenuItem
                      key={item.id}
                      sx={{
                        p: 1,
                        borderBottom: `1px solid ${theme.palette.secondary.dark}`,
                        mb: 1,
                      }}
                      onClick={() => {
                        handleSelected?.(item, indexArray);
                        setIsOpenSearch(false);
                      }}
                    >
                      <Typography
                        sx={{
                          maxWidth: '250px',
                          fontSize: '14px',
                          lineHeight: '17px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: theme.palette.primary.light,
                        }}
                      >
                        {`${item.code} (${item.email})`}
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
