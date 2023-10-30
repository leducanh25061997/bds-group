import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Permission } from 'types';
import { Box, Chip, useTheme, Typography } from '@mui/material';
import palette from 'styles/theme/palette';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      height: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 280,
    },
  },
};

interface Props {
  option: Permission[];
  label?: string;
  listPermission: string[];
  onChangeCheckRoles: (id: any) => void;
}

export default function MultipleSelectCheckmarks(props: Props) {
  const { option, label, listPermission, onChangeCheckRoles } = props;
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel
          shrink={false}
          sx={{ fontWeight: 500, color: 'black', fontSize: '15px' }}
        >
          Thiết lập quyền {label}
        </InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={
            <OutlinedInput
              placeholder={label}
              sx={{
                width: { md: '281px' },
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  padding: '10px 20px 15px 20px',
                  fontSize: '14px',
                  color: theme.palette.primary.light,
                  bgcolor: theme.palette.secondary.lighter,
                  border: `1px solid ${palette.primary.button}`,
                  borderRadius: '8px',
                  display: 'flex',
                },
                '& .MuiFormLabel-root': {
                  display: 'none',
                },
                '& .MuiInputBase-root': {
                  mt: 1,
                },
                '& .MuiInputBase-input': {
                  borderRadius: '8px',
                  background: theme.palette.common.white,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            />
          }
          renderValue={selected => <></>}
          MenuProps={MenuProps}
        >
          {option.map((item, index) => (
            <MenuItem key={item.key} value={item.name}>
              <Checkbox
                onClick={() => onChangeCheckRoles(item.key)}
                checked={listPermission.indexOf(item.key) > -1}
                sx={{
                  color: palette.primary.button,
                  '&.Mui-checked': {
                    color: palette.primary.button,
                    borderRadius: 20,
                  },
                }}
              />
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: '13px',
                  color: 'black',
                  fontWeight: '500',
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
