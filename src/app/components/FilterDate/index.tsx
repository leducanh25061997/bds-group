import React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  Box,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';

export interface FilterDateProps {
  dateValue?: Dayjs;
  onChange?: (data: Dayjs | null) => void;
  sx?: SxProps<Theme>;
  placeholder?: string;
}
export default function FilterDate(props: FilterDateProps) {
  const { onChange, dateValue, placeholder } = props;
  const [value, setValue] = React.useState<Dayjs | null>(
    dateValue ? dateValue : null,
  );
  const theme = useTheme();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ ...props.sx, '& .MuiSvgIcon-root': { width: '22px' } }}>
        <DesktopDatePicker
          inputFormat="DD/MM/YYYY"
          onChange={(newValue: Dayjs | null) => {
            setValue(newValue);
            onChange?.(newValue);
          }}
          value={value}
          renderInput={params => (
            <>
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: placeholder ?? 'dd/mm/yyyy',
                }}
                sx={{
                  mr: { xs: 0, sm: '16px' },
                  border: '1px solid #D3D3D3',
                  width :'100%',
                  minWidth: '150px',
                  borderRadius: '8px',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    background: theme.palette.common.white,
                    color: theme.palette.common.black,
                    fontSize: '14px',
                    '& input': {
                      padding: '10.5px 13px',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'break-spaces',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.lighter,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
            </>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
