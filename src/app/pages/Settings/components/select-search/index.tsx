import {
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form';
import { CustomerItem } from 'types/User';
import CustomButton from 'app/components/Button';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import CreateCustomer from 'app/pages/CustomerPotential/create';

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
  options?: CustomerItem[];
  handleSelected?: (value: string) => void;
  handleDeleted?: () => void;
  clearErrors?: UseFormClearErrors<any>;
  setError?: UseFormSetError<any>;
  watch?: (value: string) => void;
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
    clearErrors,
    setError,
    watch,
  } = props;
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isOpenCreateAccount, setIsOpenCreateAccount] =
    useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!isOpenCreateAccount && isOpenSearch) {
          setIsOpenSearch(false);
          setIsOpenCreateAccount(false);
          if (name === 'partyB.name' && !watch?.(name)) {
            setError?.(name, {
              message: 'Vui lòng chọn khách hàng',
            });
          }
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, isOpenSearch, isOpenCreateAccount, setError, name, watch]);

  const handleOpenDropDown = () => {
    setIsOpenSearch(true);
  };

  const handleOpenDialogCreateAccount = () => {
    setIsOpenCreateAccount(true);
    // setIsOpenSearch(false);
  };

  const handleClose = () => {
    clearErrors && clearErrors();
    setIsOpenCreateAccount(false);
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
                  if (event.keyCode === 8 || event.keyCode === 46) {
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
                    border: fieldState?.error?.message
                      ? `1px solid ${theme.palette.error.lighter}`
                      : 'unset',
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
                        handleSelected?.(item.id);
                        setIsOpenSearch(false);
                      }}
                    >
                      <Typography
                        fontSize="14px"
                        lineHeight="17px"
                        color={theme.palette.primary.light}
                        sx={{
                          '& span': {
                            ml: 1,
                            fontWeight: 600,
                          },
                        }}
                      >
                        {item.name}
                        <span>()</span>
                      </Typography>
                    </MenuItem>
                  ))}
                  <CustomButton
                    title={t(translations.common.createAccount)}
                    isIcon
                    buttonMode={'create'}
                    sxProps={{
                      background: theme.palette.primary.lighter,
                      mt: 1.5,
                    }}
                    handleClick={handleOpenDialogCreateAccount}
                  />
                  <Dialog
                    open={isOpenCreateAccount}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle
                      sx={{ bgcolor: theme.palette.primary.lighter }}
                    >
                      <Typography
                        fontSize="16px"
                        fontWeight={600}
                        color={theme.palette.grey[0]}
                      >
                        Tạo tài khoản
                      </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 'unset' }}>
                      <DialogContentText id="alert-dialog-description">
                        <CreateCustomer handleClose={handleClose} />
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
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
