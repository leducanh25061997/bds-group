import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Editor from 'app/components/Editor';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { HeaderTab, LeftTab } from 'types/Esalekit';
import ADD_ICON from 'assets/background/add-pink-icon.svg';
import { TabMediaTypeEnum } from 'types/Enum';

import { ViewImage } from '../components/Library/ViewImage';
import { ViewVideo } from '../components/Library/ViewVideo';
import { View3D } from '../components/Library/View3D';

import GroundTableEditor from '../components/GroundTableEditor';
import { ItemLibrary } from '../components/ItemLibrary';
import { ViewNews } from '../components/Library/ViewNews';

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: palette.primary.button,
    fontWeight: '600',
  },
});

interface Props {
  dataSidebar?: LeftTab;
  esalekitId?: string;
  openDialogAddTab?: () => void;
  openDialogDelTab?: () => void;
  onChangeHeaderTab?: (header: HeaderTab) => void;
}

export default function Overview(props: Props) {
  const {
    dataSidebar,
    openDialogAddTab,
    openDialogDelTab,
    onChangeHeaderTab,
    esalekitId,
  } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [value, setValue] = React.useState('0');

  const handleChange = (event: any, newValue: any) => {
    const header = dataSidebar?.hearTabs[newValue];
    if (onChangeHeaderTab && header) {
      onChangeHeaderTab(header);
    }
    setValue(newValue);
  };

  useEffect(() => {
    if (dataSidebar) {
      setValue('0');
    }
  }, [dataSidebar?.id]);

  const renderContent = (item: HeaderTab) => {
    let view = null;
    if (dataSidebar?.customType) {
      switch (item?.mediaType) {
        case TabMediaTypeEnum.IMAGE:
          view = <ViewImage headerId={item.id} />;
          break;
        case TabMediaTypeEnum.VIDEO:
          view = <ViewVideo headerId={item.id} />;
          break;
        case TabMediaTypeEnum.ESALEKIT_NEWS:
          view = <ViewNews headerId={item.id} />;
          break;
        case TabMediaTypeEnum.STREETVIEW:
          view = <View3D headerId={item.id} mediaType={item?.mediaType} />;
          break;
        case TabMediaTypeEnum.VIEW3D:
          view = <View3D headerId={item.id} mediaType={item?.mediaType} />;
          break;
        case TabMediaTypeEnum.VIEW360:
          view = <View3D headerId={item.id} mediaType={item?.mediaType} />;
          break;
        case TabMediaTypeEnum.OVERALL_GROUND:
          view = <GroundTableEditor id={item.id} />;
          break;
        default:
          view = null;
          break;
      }
    } else {
      view = <Editor id={item.id} esalekitId={esalekitId} />;
    }
    return view;
  };

  return (
    <Fragment>
      <Box
        sx={{
          marginTop: '-15px',
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={'20px'}
          color={palette.common.black}
        >
          {dataSidebar?.name}
        </Typography>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {dataSidebar?.hearTabs[0]?.mediaType !==
              TabMediaTypeEnum.OVERALL_GROUND && (
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
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: 2,
                    cursor: 'pointer',
                  }}
                  onClick={openDialogAddTab}
                >
                  <img src={ADD_ICON} alt="add icon" />
                  <Typography
                    color={palette.primary.button}
                    fontSize={'14px'}
                    ml={0.5}
                  >
                    Thêm tab
                  </Typography>
                </Box>
              </TabList>
            )}
          </Box>
          {dataSidebar?.hearTabs?.map((element, index) => (
            <TabPanel value={index.toString()} sx={{ p: 0, pt: 1.5 }}>
              {renderContent(element)}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Fragment>
  );
}
