import ADDNEW_ICON from 'assets/esalekit/addnew-icon.svg';
import GROUND_ICON from 'assets/esalekit/ground-icon.svg';
import LEFT_DEFAULT_ICON from 'assets/esalekit/leftmenu-default-icon.svg';
import LIBRARY_ICON from 'assets/esalekit/library-icon.svg';
import NEWS_ICON from 'assets/esalekit/news-project-icon.svg';
import OVERVIEW_ICON from 'assets/esalekit/overview-icon.svg';
import POLICY_ICON from 'assets/esalekit/policy-project-icon.svg';
import UTILITIES_ICON from 'assets/esalekit/utilities-icon.svg';
import { Fragment, useState } from 'react';
import styled from 'styled-components';

import {
  Divider,
  List,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { LEFT_TAB } from 'types/Enum';
import { LeftTab } from 'types/Esalekit';

const MenuContainer = styled(List)`
  position: unset;
`;

const MenuItem = styled(ListItemButton)`
  display: flex;
  align-items: center;
  padding: 17px 0px;
  &.active {
    background: #475160;
  }
`;
interface Props {
  dataSidebar?: LeftTab[];
  onChangeTabSidebar: (id: any) => void;
  openDialogAddTab?: () => void;
  openDialogDelTab?: () => void;
}

export default function SidebarMenu(props: Props) {
  const {
    dataSidebar,
    onChangeTabSidebar,
    openDialogAddTab,
    openDialogDelTab,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [leftmenu, setLeftMenu] = useState<string>(LEFT_TAB.OVERVIEW);

  const handleOpenTab = (id: string) => {
    setLeftMenu(id);
    onChangeTabSidebar(id);
  };

  const renderIconMenu = (type: string) => {
    let icon = LEFT_DEFAULT_ICON;
    switch (type) {
      case LEFT_TAB.OVERVIEW:
        icon = OVERVIEW_ICON;
        break;
      case LEFT_TAB.GROUND:
        icon = GROUND_ICON;
        break;
      case LEFT_TAB.UTILITIES:
        icon = UTILITIES_ICON;
        break;
      case LEFT_TAB.LIBRARIES:
        icon = LIBRARY_ICON;
        break;
      case LEFT_TAB.POLICY:
        icon = POLICY_ICON;
        break;
      case LEFT_TAB.NEWS:
        icon = NEWS_ICON;
        break;
      case LEFT_TAB.ADDNEW:
        icon = ADDNEW_ICON;
        break;
      default:
        break;
    }
    return icon;
  };

  const hanldeOpenDialogAddTab = () => {
    if (openDialogAddTab) {
      openDialogAddTab();
    }
  };

  return (
    <MenuContainer>
      {dataSidebar?.map((tabConfig, index) => {
        return (
          <Fragment key={tabConfig.id}>
            <MenuItem
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              className={classNames({
                active: leftmenu === tabConfig.id,
              })}
              onClick={() => handleOpenTab(tabConfig.id)}
            >
              <Stack alignItems={'center'}>
                <img src={renderIconMenu(tabConfig.name)} alt="icon tab" />
                <Typography
                  fontSize={'12px'}
                  lineHeight={'17px'}
                  fontWeight={'400'}
                  color={'#AFAFAF'}
                  mt={'4px'}
                >
                  {tabConfig.name}
                </Typography>
              </Stack>
            </MenuItem>
            {index < dataSidebar.length - 1 && (
              <Divider
                sx={{ background: '#475160', width: '75%', ml: '10%' }}
              />
            )}
          </Fragment>
        );
      })}
    </MenuContainer>
  );
}
