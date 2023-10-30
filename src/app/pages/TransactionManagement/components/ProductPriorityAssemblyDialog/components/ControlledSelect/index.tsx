import React, { useState, useEffect } from 'react';
import { Box, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';

interface Props {
  // label?: string | React.ReactNode;
  isRequired?: boolean;
  placeholder: string;
  name: string;
  control?: Control<any>;
  options?: any[];
  disabled?: boolean;
  // errors?: any;
  // setError?: any;
  onChange?: (value: string | number | any) => void;
  value?: string;
  // defaultValue?: string;
  // sxProps?: SxProps;
  // handleDeleted?: () => void;
}

export const ControlledSelect = (props: Props) => {
  const {
    // label,
    // isRequired,
    placeholder,
    name,
    control,
    options,
    disabled,
    // errors,
    // setError,
    onChange,
    value,
    // defaultValue,
    // sxProps,
    // handleDeleted,
  } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    if (options) {
      setList(options);
    }
  }, [options]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelect = () => {
    setAnchorEl(null);
  };

  const [valueSearch, setValueSearch] = useState<string>('');
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setValueSearch(value);
    // console.log(value, '-----: value')
    if (options) {
      const _list: any[] = [...options];
      const newList = _list.filter(v =>
        v.code.toLowerCase().includes(value.toLowerCase()),
      );
      if (value) {
        setList(newList);
      } else {
        setList(options);
      }
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Box>
            <Button
              id="basic-button"
              disabled={disabled}
              aria-controls={openSelect ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openSelect ? 'true' : undefined}
              onClick={handleClick}
              endIcon={
                <Icon icon="mingcute:down-line" color="white" width="10" />
              }
              sx={{
                border: '1px solid #FFF',
                width: '100%',
                padding: '10px 16px',
                color: '#FFF',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value || placeholder}
              </Box>
            </Button>
            <Menu
              id="basic-menu"
              PaperProps={{
                style: {
                  width: 239,
                },
              }}
              anchorEl={anchorEl}
              open={openSelect}
              onClose={handleCloseSelect}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField
                  id="search"
                  type="text"
                  placeholder="Tìm nhanh phiếu..."
                  value={valueSearch}
                  sx={{ width: '222px', height: '44px' }}
                  InputProps={{
                    style: {
                      height: '44px',
                    },
                    startAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearch(event)
                  }
                />
              </Box>
              {list?.map((_x: any) => (
                <MenuItem
                  onClick={() => {
                    field.onChange(_x.id);
                    onChange?.(_x.id);
                    handleCloseSelect();
                  }}
                  key={_x.id}
                  disabled={!!_x.priority?.productId}
                  sx={{
                    width: '100%',
                    '&:hover': {
                      background: '#FDEAF4',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{ fontSize: '12px', lineHeight: '20px' }}
                        >{`${dayjs(_x?.createdAt).format(
                          'HH:mm DD/MM/YYYY',
                        )}`}</Box>
                        {_x.priority?.productId ? (
                          <Box
                            sx={{
                              color: '#7A7A7A',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              justifyContent: 'space-between',
                              background: '#E0E1E4',
                              borderRadius: '8px',
                              padding: '6px',
                            }}
                          >
                            <Box
                              sx={{
                                borderRadius: '50%',
                                background: '#7A7A7A',
                                width: '20px',
                                color: '#FFF',
                                textAlign: 'center',
                                marginRight: '4px',
                              }}
                            >
                              {_x.priority?.order || ''}
                            </Box>
                            <Box>{_x.priority?.product?.code || ''}</Box>
                          </Box>
                        ) : null}
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '14px',
                            lineHeight: '20px',
                            fontWeight: '600',
                          }}
                        >
                          {_x.customers.length &&
                            _x.customers[0].mainCustomer?.name}
                        </Box>
                        {field.value === _x.id && (
                          <Box>
                            <Icon icon="mdi:tick" color="#2fb350" width="14" />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        );
      }}
    />
  );
};
