import { Box, useTheme } from '@mui/material';
import React, { FC } from 'react';

interface CardProps {
  children: any;
}

const CardWrapper: FC<CardProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      marginTop={'17px'}
      padding={'24px'}
      sx={{ background: `${theme.palette.grey[0]}` }}
    >
      <Box>{children}</Box>
    </Box>
  );
};

export default CardWrapper;
