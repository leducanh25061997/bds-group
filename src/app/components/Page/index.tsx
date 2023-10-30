/**
 *
 * Page
 *
 */
import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  children?: React.ReactNode;
  [attr: string]: any;
}

const Page = forwardRef<any, Props>((props, ref) => {
  const { title, children, ...rest } = props;

  return (
    <Box ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  );
});

export default Page;
