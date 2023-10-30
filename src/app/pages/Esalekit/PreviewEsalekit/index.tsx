import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { TabMediaTypeEnum } from 'types/Enum';
import { HeaderTab, LeftTab } from 'types/Esalekit';

import GroundTablePreview from '../components/GroundTablePreview';
import { ViewNews } from '../components/Library/ViewNews';

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: palette.primary.button,
    fontWeight: '600',
  },
});
interface Props {
  dataSidebar?: LeftTab;
}

export default function PreviewEsalekit(props: Props) {
  const { dataSidebar } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [value, setValue] = React.useState('0');

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (dataSidebar) {
      setValue('0');
    }
  }, [dataSidebar]);

  const renderContent = (item: HeaderTab) => {
    let view = null;
    if (dataSidebar?.customType) {
      switch (item?.mediaType) {
        case TabMediaTypeEnum.ESALEKIT_NEWS:
          view = <ViewNews headerId={item.id} ispreview />;
          break;
        default:
          view = null;
          break;
      }
    } else {
      view = view = (
        <div
          style={{ marginTop: -25 }}
          dangerouslySetInnerHTML={{ __html: item?.html }}
        />
      );
    }
    return view;
  };

  return (
    <Fragment>
      <Box
        sx={{
          height: 'calc(100vh - 110px)',
          background: 'white',
          width: '85vw',
          opacity: '0.95',
          borderRadius: '20px',
          mt: 1,
          p: '5px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              TabIndicatorProps={{
                style: { backgroundColor: palette.primary.button },
              }}
            >
              {dataSidebar?.hearTabs?.map((element, index) => (
                <StyledTab
                  sx={{ fontWeight: '400', color: palette.common.black }}
                  label={element.name}
                  value={index.toString()}
                />
              ))}
            </TabList>
          </Box>
          {dataSidebar?.hearTabs?.map((element, index) => (
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
