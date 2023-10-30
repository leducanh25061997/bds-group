import {
  Typography,
  Stack,
  Box,
  StackProps,
  TypographyProps,
} from '@mui/material';
import React from 'react';
import { isNullOrEmpty } from 'utils/helpers';

interface FieldInfoProps {
  containerProps?: StackProps;
  label: string | React.ReactNode;
  labelProps?: TypographyProps;
  content: React.ReactNode | string | null;
  contentProps?: TypographyProps;
}

const FieldInfo: React.FC<FieldInfoProps> = ({
  label,
  content,
  contentProps,
  containerProps,
  labelProps,
}) => {
  const renderContent = () => {
    if (
      typeof content === 'string' ||
      content == null ||
      content === undefined
    ) {
      return (
        <Typography variant="body2" {...contentProps}>
          {!isNullOrEmpty(content) ? content : '---'}
        </Typography>
      );
    }
    return content;
  };

  return (
    <Stack direction="row" spacing={2} {...containerProps}>
      <Typography
        variant="body2"
        {...labelProps}
        sx={{
          fontWeight: 700,
          minWidth: 185,
          ...(labelProps?.sx && labelProps.sx),
        }}
      >
        {label}
      </Typography>
      <Box>{renderContent()}</Box>
    </Stack>
  );
};

export default React.memo(FieldInfo);
