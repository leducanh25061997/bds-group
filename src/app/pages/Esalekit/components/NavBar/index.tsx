import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountPopover from 'app/components/AccountPopover';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import AUTOSAVE_ICON from 'assets/background/autosave-icon.svg';
import BG_HEADER from 'assets/background/background-header.svg';
import CHANGETAB_ICON from 'assets/background/changetabn-icon.svg';
import DELETE_ICON from 'assets/background/deletetab-icon.svg';
import HOME_ICON from 'assets/background/home-icon.svg';
import LEFT_ICON from 'assets/background/left-icon.svg';
import PREVIEW_ICON from 'assets/background/preview-icon.svg';
import REDO_ICON from 'assets/background/redo-icon.svg';
import UNDO_ICON from 'assets/background/undo-icon.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { LeftTabType, TabMediaTypeEnum } from 'types/Enum';
import { HeaderTab, LeftTab } from 'types/Esalekit';
import { Project } from 'types/User';

import { useDispatch } from 'react-redux';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { useEsalekitSlice } from '../../slice';
import { PayloadCreateGround } from '../../slice/types';

const APPBAR_MOBILE = 54;
const APPBAR_DESKTOP = 60;

interface Props {
  dataSidebar?: LeftTab;
  headerTab?: HeaderTab;
  projectDetail?: Project;
  onChaneNameTab?: () => void;
  onDeleteTab?: () => void;
  onChaneNameMenu?: () => void;
  onDeleteMenu?: () => void;
  esalekitId?: string;
}

const RootStyle = styled(AppBar)(({ theme }) => ({
  filter: 'drop-shadow(0px 6px 13px rgba(0, 0, 0, 0.06))',
  backgroundImage: `url(${BG_HEADER})`,
  zIndex: '1201',
  color: 'white',
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 3.8),
  },
}));

export default function DashboardNavbar(props: Props) {
  const {
    dataSidebar,
    projectDetail,
    onChaneNameTab,
    esalekitId,
    onDeleteTab,
    headerTab,
    onChaneNameMenu,
    onDeleteMenu,
  } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(path.project);
  };

  const handlePublic = () => {};

  const hanldePreview = () => {
    navigate(`/esalekit/preview/${esalekitId}`);
  };

  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();

  const handleSave = (id: string) => {
    const rawGroundData = localStorage.getItem('imageMapProSaves');
    const payloadCreate: PayloadCreateGround = {
      headerId: id,
      data: rawGroundData,
    };

    dispatch(
      EsalekitActions.createGround(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Lưu sửa thành công',
                type: 'success',
              }),
            );
            fetchGalleryHeader(id);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Lưu không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const fetchGalleryHeader = (id: string) => {
    dispatch(EsalekitActions.getHeadertab({ id }));
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <Stack
          sx={{ flexDirection: 'row', alignItems: 'center' }}
          onClick={handleBack}
        >
          <IconButton sx={{ p: 0 }}>
            <img src={LEFT_ICON} alt="left icon" />
          </IconButton>
          <IconButton sx={{ mb: '2.5px' }}>
            <img src={HOME_ICON} alt="home icon" />
          </IconButton>
          <Typography
            fontWeight={700}
            fontSize={'14px'}
            color={palette.common.white}
          >
            Dự án
          </Typography>
          <Divider
            sx={{
              background: '#FFCBE5',
              width: '1px',
              height: 30,
              ml: 3,
              mr: 2,
            }}
          />
          <Typography fontSize={'14px'} color={palette.common.white}>
            Dự án
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={'20px'}
            ml={'5px'}
            color={palette.common.white}
          >
            {projectDetail?.name}
          </Typography>
        </Stack>
        <Box
          flex={1}
          display={'flex'}
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'flex-end'}
        >
          {dataSidebar?.type === LeftTabType.ADD_NEW && (
            <>
              <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
                <IconButton onClick={onChaneNameMenu}>
                  <img src={CHANGETAB_ICON} alt="autosave" />
                </IconButton>
                <Typography fontSize={'10px'} color={palette.common.white}>
                  Đổi tên menu
                </Typography>
              </Stack>

              <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
                <IconButton onClick={onDeleteMenu}>
                  <img src={DELETE_ICON} alt="autosave" />
                </IconButton>
                <Typography fontSize={'10px'} color={palette.common.white}>
                  Xoá menu
                </Typography>
              </Stack>
              <Divider
                sx={{
                  background: '#FFCBE5',
                  width: '1px',
                  height: 30,
                }}
              />
            </>
          )}
          {headerTab?.type === LeftTabType.ADD_NEW && (
            <>
              <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
                <IconButton onClick={onChaneNameTab}>
                  <img src={CHANGETAB_ICON} alt="autosave" />
                </IconButton>
                <Typography fontSize={'10px'} color={palette.common.white}>
                  Đổi tên tab
                </Typography>
              </Stack>
              <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
                <IconButton onClick={onDeleteTab}>
                  <img src={DELETE_ICON} alt="autosave" />
                </IconButton>
                <Typography fontSize={'10px'} color={palette.common.white}>
                  Xoá tab
                </Typography>
              </Stack>
            </>
          )}
          <Divider
            sx={{
              background: '#FFCBE5',
              width: '1px',
              height: 30,
            }}
          />
          <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
            <IconButton>
              <img src={UNDO_ICON} alt="undo" />
            </IconButton>
            <Typography fontSize={'10px'} color={palette.common.white}>
              Undo
            </Typography>
          </Stack>
          <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
            <IconButton>
              <img src={REDO_ICON} alt="redo" />
            </IconButton>
            <Typography fontSize={'10px'} color={palette.common.white}>
              Rendo
            </Typography>
          </Stack>
          <Divider
            sx={{
              background: '#FFCBE5',
              width: '1px',
              height: 30,
            }}
          />
          {dataSidebar?.hearTabs[0]?.mediaType ===
          TabMediaTypeEnum.OVERALL_GROUND ? (
            <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
              <IconButton
                onClick={() => handleSave(dataSidebar?.hearTabs[0]?.id)}
              >
                <img src={AUTOSAVE_ICON} alt="autosave" />
              </IconButton>
              <Typography fontSize={'10px'} color={palette.common.white}>
                save
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
              <IconButton>
                <img src={AUTOSAVE_ICON} alt="autosave" />
              </IconButton>
              <Typography fontSize={'10px'} color={palette.common.white}>
                Auto save
              </Typography>
            </Stack>
          )}

          <Divider
            sx={{
              background: '#FFCBE5',
              width: '1px',
              height: 30,
            }}
          />
          <Stack sx={{ width: { md: '75px', alignItems: 'center' } }}>
            <IconButton onClick={hanldePreview}>
              <img src={PREVIEW_ICON} alt="preview" />
            </IconButton>
            <Typography fontSize={'10px'} color={palette.common.white}>
              Preview
            </Typography>
          </Stack>
          <CustomButton
            title={'Public'}
            buttonMode={'filter'}
            sxProps={{
              background: 'transparent',
              color: palette.primary.button,
              border: `1px solid ${palette.common.white}`,
              p: 0,
              mr: 3,
              ml: 2,
              borderRadius: '8px',
              width: '100px',
              ':hover': {
                background: 'transparent',
              },
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
              color: palette.common.white,
            }}
            handleClick={handlePublic}
          />
        </Box>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 1.0 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
