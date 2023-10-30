import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import palette from 'styles/theme/palette';
import { Segment } from '../../slice/types';
import { Option } from 'types/Option';

interface Props {
  placeholder?: string;
  data?: Segment[];
  onChangeValue?: (value: string) => void;
  handleAddNew?: (value: string) => void;
}

export default function SellectSearch(props: Props) {
  const theme = useTheme();
  const { placeholder, onChangeValue, handleAddNew, data } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectSearch, setSelectSearch] = useState('');

  const [dataFilter, setdataFilter] = useState<Option[]>([]);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (data && data.length > 0) {
      let arr: Option[] = [];
      data.forEach(element => {
        if (element.id) {
          arr.push({
            name: element.type,
            value: element.id,
            id: element.id,
          });
        }
      });
      setdataFilter(arr);
    }
  }, [data]);

  const handleChange = (event: any) => {
    
    if (onChangeValue) {
      onChangeValue(event.target.value);
    }
    setSelectSearch(event.target.value);
  };

  const hanldeAdd = () => {
    if (handleAddNew) {
      handleAddNew(value);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setValue('');
    }
  };

  return (
    <Box sx={{ minWidth: { lg: '180px', md: '100px' } }}>
      <FormControl fullWidth>
        <Select
          value={selectSearch}
          onKeyDownCapture={e => {
            e.stopPropagation();
          }}
          variant="outlined"
          autoComplete="off"
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          displayEmpty
          renderValue={selectSearch !== '' ? undefined : () => placeholder}
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
              width: '100%',
            },
            '& .MuiInputLabel-root': {
              color: 'black !important',
              fontWeight: 500,
            },
            '& .MuiInputBase-root': {
              mt: 1,
            },
            mb: 'unset',
            '& .MuiInputBase-input': {
              borderRadius: '8px',
              background: theme.palette.common.white,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: `1px solid #D3D3D3 !important`,
            },
          }}
          onChange={handleChange}
        >
          {dataFilter?.map(_x => (
            <MenuItem
              value={_x.id}
              key={_x.id}
              sx={{
                fontSize: '14px',
                height: '30px',
                color: 'black',
                fontWeight: '400',
                borderBottom: '1px solid #D3D3D3',
                m: '3px',
                '&.Mui-selected': {
                  backgroundColor: '#FDEAF4',
                  borderRadius: '6px',
                  fontWeight: '600',
                },
              }}
            >
              {_x.name}
            </MenuItem>
          ))}
          <TextField
            inputRef={inputRef}
            placeholder={'Thêm mới ...'}
            autoComplete="off"
            defaultValue={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              let newValue = event.target.value;
              setValue(newValue);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      cursor: 'pointer',
                      p: 0.5,
                    }}
                    onClick={hanldeAdd}
                  >
                    <AddCircleOutlineOutlinedIcon
                      sx={{
                        color: palette.primary.button,
                      }}
                    />
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiFormControl-root': {
                position: 'relative',
              },
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                background: theme.palette.common.white,
                color: theme.palette.common.black,
                '& input': {
                  padding: '8.45px 0px',
                  fontSize: '14px',
                  '&::placeholder': {
                    color: theme.palette.common.black,
                  },
                },
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.error.lighter,
                position: 'absolute',
                bottom: '-22px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: `none`,
              },
            }}
          />
        </Select>
      </FormControl>
    </Box>
  );
}
