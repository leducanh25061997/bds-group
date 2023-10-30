import React from 'react';
import { Dayjs } from 'dayjs';
import {
  Box,
  Stack,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import TextFieldCustom from '../TextFieldCustom';
import { useForm } from 'react-hook-form';

export interface FilterTextFieldProps {
  dateValue?: string;
  onChange?: (data: string | undefined) => void;
  sx?: SxProps<Theme>;
  placeholder?: string;
  title?: string;
}
export default function FilterTextField(props: FilterTextFieldProps) {
  const theme = useTheme();
  const { onChange, dateValue, placeholder, title } = props;
  const [value, setValue] = React.useState<string | undefined>(
    dateValue ? dateValue : undefined,
  );

  const onChangeText = (val: any) => {
    if (onChange) {
      onChange(val);
    }
  };


  const {
    control,
    formState: { errors },
    setError,
  } = useForm();
  return (
    <Box>
      <TextFieldCustom
        placeholder={placeholder}
        label={title}
        name="code"
        control={control}
        errors={errors}
        setError={setError}
      />
    </Box>
  );
}
