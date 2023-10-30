import { Box, Typography, useTheme } from '@mui/material';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  list: List[];
}

interface List {
  label: string;
  path: string;
  isActive?: boolean;
  isGoback?: boolean;
}

export default function BreadCrumb(props: Props) {
  const { list } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box display={'flex'} alignItems={'center'}>
      {list?.map((item, index) => (
        <Fragment key={index}>
          <Typography
            key={item.label}
            fontSize={'16px'}
            color={theme.palette.primary.light}
            sx={{
              opacity: 0.6,
              cursor: 'pointer',
              fontWeight: item.isActive ? 600 : 'unset',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() =>
              item?.isGoback ? navigate(-1) : navigate(item.path)
            }
          >
            {item.label}
          </Typography>
          {index !== list.length - 1 && (
            <Box sx={{ mx: 0.5, opacity: 0.6 }}>{'>'}</Box>
          )}
        </Fragment>
      ))}
    </Box>
  );
}
