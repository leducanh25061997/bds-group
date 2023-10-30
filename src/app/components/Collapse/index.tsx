import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { Stack, Box, Grid } from '@mui/material';

interface Props {
  description?: any;
  title?: any;
  openCollapse?: boolean;
  handleOpenCollapse?: () => void;
}

export default function NestedList(props: Props) {
  const { description, title, openCollapse, handleOpenCollapse } = props;

  return (
    <Stack>
      <Grid
        onClick={handleOpenCollapse}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            fontSize: '18px',
            fontWeight: '700',
            lineHeight: '21.15px',
            color: '#777777',
          }}
        >
          {title}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openCollapse ? (
            <ArrowDropDownIcon sx={{ color: '#868686', marginLeft: 2 }} />
          ) : (
            <ArrowRight sx={{ color: '#868686', marginLeft: 2 }} />
          )}
        </Box>
      </Grid>
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        {description}
      </Collapse>
    </Stack>
  );
}
