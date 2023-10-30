import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab, useTheme } from '@mui/material';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import palette from 'styles/theme/palette';
import { TabMediaTypeEnum } from 'types/Enum';
import { ViewContent } from './component/ViewContent';
import { Typography } from '@mui/material';

const ListTabContent = [
  {
    id: 1,
    name: 'Banner',
    type: TabMediaTypeEnum.BANNER,
  },
  {
    id: 2,
    name: 'Tin tức',
    type: TabMediaTypeEnum.NEWS,
  },
];

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: palette.primary.button,
    fontWeight: '600',
  },
});

export function ContentManagement() {
  const theme = useTheme();

  const [value, setValue] = React.useState('0');
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const renderContent = (item: any) => {
    let view = null;
    switch (item.type) {
      case TabMediaTypeEnum.NEWS:
        view = <ViewContent headerId={item.id} type={TabMediaTypeEnum.NEWS} />;
        break;
      case TabMediaTypeEnum.BANNER:
        view = <ViewContent headerId={item.id}  type={TabMediaTypeEnum.BANNER} />;
        break;
      default:
        view = null;
        break;
    }
    return view;
  };

  return (
    <Fragment>
      <Box
        bgcolor={theme.palette.grey[0]}
        p={3}
        sx={{
          p:'24px',
          borderRadius: 3,
          mt: '-10px',
          minHeight: 'calc(99%)',
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              {'Quản trị nội dung'}
            </Typography>
          </Box>
        </Grid>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              TabIndicatorProps={{
                style: { backgroundColor: palette.primary.button },
              }}
            >
              {ListTabContent.map((element, index) => (
                <StyledTab
                  sx={{ fontWeight: '400', color: palette.common.black }}
                  label={element.name}
                  value={index.toString()}
                />
              ))}
            </TabList>
          </Box>
          {ListTabContent?.map((element, index) => (
            <TabPanel
              value={index.toString()}
              sx={{ overflow: 'auto', height: '100%' }}
            >
              {renderContent(element)}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Fragment>
  );
}
