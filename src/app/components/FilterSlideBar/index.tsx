import { useCallback, useState } from 'react';
// import { useLocation } from 'react-router-dom';

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import Scrollbar from 'app/components/Scrollbar';

import { useDispatch, useSelector } from 'react-redux';

import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
// ----------------------------------------------------------------------
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import * as React from 'react';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import FILLTER_ICON from 'assets/background/filter-icon.svg';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import palette from 'styles/theme/palette';

import CustomButton from '../Button';

export const DRAWER_WIDTH = 420;
export const DRAWER_WIDTH_ON_MOBILE = 120;
// ----------------------------------------------------------------------

interface Props {}

export default function FilterSlideBar(props: Props) {
  // const { pathname } = useLocation();
  const { isShowFilter } = useSelector(layoutsSelector);
  const [isUpDateInfo, setIsUpDateInfo] = useState<boolean>(false);
  const [isShowDialogInforMation, setIsShowDialogInforMation] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const handleSubmitDialog = useCallback(() => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(true);
  }, []);

  const handleCloseDialog = () => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(false);
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        // width:'100%',
        position: 'relative',
        mt: 9.5,
        bgcolor: 'white',
        borderRadius: '20px',
        ml: '20px',
      }}
    ></Scrollbar>
  );

  const list = () => (
    <Box
      sx={{ width: DRAWER_WIDTH, padding: '24px', height: '100%' }}
      role="presentation"
      // onClick={onCloseSidebar}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
          <img src={FILLTER_ICON} style={{}} />
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 700,
              color: palette.common.black,
              ml: '8px',
            }}
          >
            Lọc thông tin các trường
          </Typography>
        </Stack>
        <img
          src={CLOSE_ICON}
          style={{ height: 30, cursor: 'pointer' }}
          onClick={onCloseSidebar}
        />
      </Stack>
      <Divider sx={{ background: '#C8CBCF', mt: '12px', mb: '12px' }} />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          color: palette.common.black,
          ml: '8px',
          fontStyle: 'italic',
        }}
      >
        Chọn hoặc bỏ các trường để hiển thị danh sách các cột data mong muốn
      </Typography>
    </Box>
  );

  const onCloseSidebar = () => {
    dispatch(actions.showFilter(false));
  };

  const handleConfirm = () => {};

  const handleReset = () => {};

  return (
    <div>
      <React.Fragment>
        <Drawer
          sx={{ zIndex: '1301' }}
          anchor={'right'}
          open={isShowFilter}
          onClose={onCloseSidebar}
        >
          {list()}
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CustomButton
              title="Thiết lập lại"
              sxProps={{
                borderRadius: '8px',
                width: { xs: '180px' },
                height: { xs: '44px' },
              }}
              variant="outlined"
              handleClick={handleReset}
            />
            <CustomButton
              title="Áp dụng"
              sxProps={{
                borderRadius: '8px',
                width: { xs: '180px' },
                height: { xs: '44px' },
                ml: '16px',
              }}
              handleClick={handleConfirm}
            />
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
