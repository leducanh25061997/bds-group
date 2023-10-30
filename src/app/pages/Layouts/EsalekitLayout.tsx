import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import FilterSlideBar from 'app/components/FilterSlideBar';

import { HeaderTab, LefttabItem } from 'types/Esalekit';

import { Box, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { translations } from 'locales/translations';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import Overview from '../Esalekit/Overview';
import ComfirmTabDialog from '../Esalekit/components/ComfirmTabDialog';
import DashboardNavbar from '../Esalekit/components/NavBar';
import DashboardSidebar from '../Esalekit/components/Sidebar';
import { useEsalekitSlice } from '../Esalekit/slice';
import { selectEsalekit } from '../Esalekit/slice/selectors';

import {
  PayloadCreateHeadTab,
  PayloadCreateLeftTab,
  PayloadGetEsalekit,
  PayloadUpdateHeadTab,
  PayloadUpdateLeftTab,
} from '../Esalekit/slice/types';

import { TabMediaTypeEnum } from 'types/Enum';
import { useLayoutsSlice } from './slice';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 60;
const APP_BAR_DESKTOP = 66;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  background: '#0F1C2F',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: `${APP_BAR_DESKTOP + 19}px`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  background: theme.palette.grey[300],
}));

export default function EsalekitLayout() {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { id } = useParams();
  const initialRef = useRef(true);
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { EsalekitDetail, LeftTabDetail } = useSelector(selectEsalekit);

  const [LeftTab, setLeftTab] = useState<LefttabItem>();
  const [HeaderTab, setHeaderTab] = useState<HeaderTab>();
  const [isDialogAddTab, setDialogAddTab] = useState<boolean>(false);
  const [isDialogAddMenu, setDialogAddMenu] = useState<boolean>(false);
  const [isDialogDelMenu, setDialogDelMenu] = useState<boolean>(false);
  const [isDialogDelTab, setDialogDelTab] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);

  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    fetchListSidebar();
  }, [dispatch, actions, id]);

  useEffect(() => {
    if (EsalekitDetail?.leftTabs && initialRef.current) {
      initialRef.current = false;
      dispatch(
        EsalekitActions.getLefttab({ id: EsalekitDetail?.leftTabs[0]?.id }),
      );
    }
  }, [EsalekitDetail?.leftTabs]);

  useEffect(() => {
    if (LeftTabDetail?.hearTabs) {
      setLeftTab(LeftTabDetail);
    }
  }, [LeftTabDetail?.hearTabs]);

  const fetchListSidebar = () => {
    dispatch(EsalekitActions.getEsalekit({ id }));
  };

  const fetchListHeadertab = () => {
    dispatch(EsalekitActions.getLefttab({ id: LeftTab?.id }));
  };

  const MediaType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Hình ảnh',
        value: TabMediaTypeEnum.IMAGE,
      },
      {
        id: 2,
        key: 'Video',
        value: TabMediaTypeEnum.VIDEO,
      },
      {
        id: 3,
        key: 'Link View3D',
        value: TabMediaTypeEnum.VIEW3D,
      },
      {
        id: 4,
        key: 'Link View360',
        value: TabMediaTypeEnum.VIEW360,
      },
      {
        id: 5,
        key: 'Link StreetView',
        value: TabMediaTypeEnum.STREETVIEW,
      },
    ];
  }, []);

  const onChangeTabSidebar = (id: string) => {
    dispatch(EsalekitActions.getLefttab({ id }));
  };

  const openDialogAddMenu = () => {
    setisEdit(false);
    setValue('menu_name', '');
    setDialogAddMenu(true);
  };

  const openDialogAddHeaderTab = () => {
    setisEdit(false);
    setValue('tab_name', '');
    setDialogAddTab(true);
  };

  const closeDialogAddTab = () => {
    setDialogAddTab(false);
  };

  const closeDialogAddMenu = () => {
    setDialogAddMenu(false);
  };

  const submitDialogEditMenu = () => {
    const menu_name = watch('menu_name');
    const payloadCreate: PayloadUpdateLeftTab = {
      name: menu_name,
      esalekitId: id,
      id: LeftTab?.id,
    };

    dispatch(
      EsalekitActions.updateLeftTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa thành công',
                type: 'success',
              }),
            );
            fetchListSidebar();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
    setDialogAddMenu(false);
  };

  const submitDialogEditTab = () => {
    const tab_name = watch('tab_name');
    const payloadCreate: PayloadUpdateHeadTab = {
      name: tab_name,
      leftTabId: LeftTab?.id,
      id: HeaderTab?.id,
    };

    dispatch(
      EsalekitActions.updateHeadTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa thành công',
                type: 'success',
              }),
            );
            fetchListHeadertab();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Chỉnh sửa không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
    setDialogAddTab(false);
  };

  const onChangeHeaderTab = (header: HeaderTab) => {
    setHeaderTab(header);
  };

  const submitDialogAddTab = () => {
    setDialogAddTab(false);
    const tab_name = watch('tab_name');
    const mediaType = watch('media_type');

    const payloadCreate: PayloadCreateHeadTab = {
      name: tab_name,
      leftTabId: LeftTab?.id,
      mediaType: undefined,
    };

    if (LeftTab?.mediaType == TabMediaTypeEnum.IMAGE) {
      payloadCreate.mediaType = mediaType;
    } else if (LeftTab?.mediaType == TabMediaTypeEnum.ESALEKIT_NEWS) {
      payloadCreate.mediaType = TabMediaTypeEnum.ESALEKIT_NEWS;
    } else {
      delete payloadCreate.mediaType;
    }

    dispatch(
      EsalekitActions.createHeaderTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo thành công',
                type: 'success',
              }),
            );
            fetchListHeadertab();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const submitDialogAddMenu = () => {
    setDialogAddMenu(false);
    const menu_name = watch('menu_name');
    const payloadCreate: PayloadCreateLeftTab = {
      name: menu_name,
      esalekitId: id,
    };
    dispatch(
      EsalekitActions.createLeftTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo thành công',
                type: 'success',
              }),
            );
            fetchListSidebar();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const openDialogDelTab = () => {
    setDialogDelTab(true);
  };

  const openDialogDelMenu = () => {
    setDialogDelMenu(true);
  };

  const closeDialogDelMenu = () => {
    setDialogDelMenu(false);
  };

  const closeDialogDelTab = () => {
    setDialogDelTab(false);
  };

  const onChaneNameTab = () => {
    setValue('tab_name', HeaderTab?.name);
    setisEdit(true);
    setDialogAddTab(true);
  };

  const onChaneNameMenu = () => {
    setValue('menu_name', LeftTab?.name);
    setisEdit(true);
    setDialogAddMenu(true);
  };

  const submitDialogDelMenu = () => {
    setDialogDelMenu(false);
    const payloadCreate: PayloadGetEsalekit = {
      id: LeftTab?.id,
    };
    dispatch(
      EsalekitActions.deleteLeftTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá thành công',
                type: 'success',
              }),
            );
            fetchListSidebar();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const submitDialogDelTab = () => {
    setDialogDelTab(false);
    const payloadCreate: PayloadGetEsalekit = {
      id: HeaderTab?.id,
    };
    dispatch(
      EsalekitActions.deleteHeaderTab(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá thành công',
                type: 'success',
              }),
            );
            fetchListHeadertab();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  return (
    <>
      <RootStyle>
        <DashboardNavbar
          dataSidebar={LeftTab}
          projectDetail={EsalekitDetail?.project}
          headerTab={HeaderTab}
          esalekitId={id}
          onChaneNameTab={onChaneNameTab}
          onDeleteTab={openDialogDelTab}
          onChaneNameMenu={onChaneNameMenu}
          onDeleteMenu={openDialogDelMenu}
        />
        <FilterSlideBar />
        <DashboardSidebar
          dataSidebar={EsalekitDetail?.leftTabs}
          onChangeTabSidebar={onChangeTabSidebar}
          openDialogAddTab={openDialogAddMenu}
          openDialogDelTab={openDialogDelMenu}
        />
        <MainStyle>
          <Overview
            dataSidebar={LeftTab}
            esalekitId={id}
            openDialogAddTab={openDialogAddHeaderTab}
            openDialogDelTab={openDialogDelTab}
            onChangeHeaderTab={onChangeHeaderTab}
          />
        </MainStyle>
        <ComfirmTabDialog
          isOpen={isDialogAddTab}
          handleClose={closeDialogAddTab}
          handleSubmit={isEdit ? submitDialogEditTab : submitDialogAddTab}
          actionName={isEdit ? 'Đổi tên tab' : 'Tạo tab mới'}
          actionComfirm={
            isEdit ? t(translations.common.save) : t(translations.common.create)
          }
        >
          <Box width="100%">
            <TextFieldCustom
              placeholder="Nhập tên tab"
              label="Tên tab"
              isRequired
              name="tab_name"
              control={control}
              errors={errors}
              setError={setError}
            />
          </Box>
          {LeftTab?.mediaType === TabMediaTypeEnum.IMAGE && (
            <Box mt={1} width="100%">
              <TextFieldCustom
                placeholder="Chọn loại thư viện"
                label="Loại thư viện"
                isRequired
                disabled={isEdit}
                options={MediaType}
                type="select"
                name="media_type"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Box>
          )}
        </ComfirmTabDialog>
        <ComfirmTabDialog
          isOpen={isDialogAddMenu}
          handleClose={closeDialogAddMenu}
          handleSubmit={isEdit ? submitDialogEditMenu : submitDialogAddMenu}
          actionName={isEdit ? 'Đổi tên menu' : 'Tạo menu mới'}
          actionComfirm={
            isEdit ? t(translations.common.save) : t(translations.common.create)
          }
        >
          <Box>
            <TextFieldCustom
              placeholder="Nhập tên menu"
              label="Tên menu"
              isRequired
              name="menu_name"
              control={control}
              errors={errors}
              setError={setError}
              sxProps={{ width: { md: '30vw' } }}
            />
          </Box>
        </ComfirmTabDialog>
        <ComfirmTabDialog
          isOpen={isDialogDelMenu}
          handleClose={closeDialogDelMenu}
          handleSubmit={submitDialogDelMenu}
          actionName={'Xoá menu'}
          actionComfirm={t(translations.common.delete)}
        >
          <Typography fontSize={'16px'}>
            Bạn có chắc chắn muốn xóa menu{' '}
            <span
              style={{
                color: palette.primary.button,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {LeftTab?.name}
            </span>{' '}
            này không?
          </Typography>
        </ComfirmTabDialog>
        <ComfirmTabDialog
          isOpen={isDialogDelTab}
          handleClose={closeDialogDelTab}
          handleSubmit={submitDialogDelTab}
          actionName={'Xoá tab'}
          actionComfirm={t(translations.common.delete)}
        >
          <Typography fontSize={'16px'}>
            Bạn có chắc chắn muốn xóa tab{' '}
            <span
              style={{
                color: palette.primary.button,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {HeaderTab?.name}
            </span>{' '}
            này không?
          </Typography>
        </ComfirmTabDialog>
      </RootStyle>
    </>
  );
}
