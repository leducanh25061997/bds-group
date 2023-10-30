import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { GalleryHeaderItem, LeftTab } from 'types/Esalekit';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import LOCATION_ICON from 'assets/background/locationwhite-icon.svg';

import { SubmitErrorHandler, useForm } from 'react-hook-form';

import TextFieldCustom from 'app/components/TextFieldCustom';

import DashboardSidebarPreview from '../Esalekit/components/SidebarPreview';
import { useEsalekitSlice } from '../Esalekit/slice';
import { selectEsalekit } from '../Esalekit/slice/selectors';

import PreviewEsalekit from '../Esalekit/PreviewEsalekit';

import ComfirmTabDialog from '../Esalekit/components/ComfirmTabDialog';

import ReactPlayer from 'react-player';
import { TabMediaTypeEnum } from 'types/Enum';
import { renderFile } from 'utils/helpers';
import BottomBar from '../Esalekit/components/BottomBar';
import GroundTablePreview from '../Esalekit/components/GroundTablePreview';
import { useLayoutsSlice } from './slice';
import { PayloadCreateConsultation } from '../Esalekit/slice/types';
import { ErrorType } from 'types/Option';

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

export default function PreviewEsalekitLayout() {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { id } = useParams();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { isLoading, EsalekitDetail, LeftTabDetail, AllGalleryManager } =
    useSelector(selectEsalekit);
  const [isDialogRegisterAdvise, setDialogRegisterAdvise] =
    useState<boolean>(false);
  const [headerTab, setHeaderTab] = useState<LeftTab>();
  const [layoutEsalekit, setlayoutEsalekit] = useState<GalleryHeaderItem>();
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    setValue,
    setError,
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    fetchListSidebar();
  }, [dispatch, actions, id]);

  useEffect(() => {
    if (EsalekitDetail?.leftTabs) {
      dispatch(
        EsalekitActions.getLefttab({ id: EsalekitDetail?.leftTabs[0]?.id }),
      );
    }
  }, [EsalekitDetail?.leftTabs]);

  const initThumnail = () => {
    if (AllGalleryManager) {
      const avatar = AllGalleryManager.filter(elemnet => elemnet.isAvatar);
      setlayoutEsalekit(avatar[0]);
    }
  };

  useEffect(() => {
    if (LeftTabDetail?.hearTabs) {
      setHeaderTab(LeftTabDetail);
    }

    if (!LeftTabDetail?.customType) {
      initThumnail();
    }
  }, [LeftTabDetail?.hearTabs]);

  useEffect(() => {
    initThumnail();
  }, [AllGalleryManager]);

  const fetchListSidebar = () => {
    dispatch(EsalekitActions.getEsalekit({ id }));
    dispatch(EsalekitActions.getAllGallery({ id }));
  };

  const onChangeTabSidebar = (id: string) => {
    dispatch(EsalekitActions.getLefttab({ id }));
  };

  const hanldelRegister = () => {
    setValue('name', '');
    setDialogRegisterAdvise(true);
  };

  const closeDialogRegisterAdvise = () => {
    setDialogRegisterAdvise(false);
  };

  const handleChangeAvatar = (item: GalleryHeaderItem) => {
    setlayoutEsalekit(item);
  };

  const submit = async (data: any) => {
    let PayloadCreateConsultation: PayloadCreateConsultation = {
      ...data,
      projectId: EsalekitDetail?.project?.id,
      projectName: EsalekitDetail?.project?.name,
    };

    await dispatch(
      EsalekitActions.createConsultant(
        PayloadCreateConsultation,
        (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Đăng ký thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    res?.response?.data?.message || 'Đăng ký không thành công',
                  type: 'error',
                }),
              );
              const errors: ErrorType[] = res?.response?.data?.errors;
              if (errors?.length) {
                for (let i = 0; i < errors.length; i++) {
                  setError(`${errors[i].at}`, {
                    message: errors[i].message,
                  });
                }
              }
            }
          }
        },
      ),
    );
    reset();
    setDialogRegisterAdvise(false);
  };

  const onError: SubmitErrorHandler<PayloadCreateConsultation> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const renderBackgroundLibrary = () => {
    let view = null;
    const isLibrary = LeftTabDetail?.mediaType === TabMediaTypeEnum.IMAGE;
    const url = layoutEsalekit?.url
      ? layoutEsalekit?.url
      : EsalekitDetail?.project?.image?.path;
    console.log('url', url);
    switch (layoutEsalekit?.type) {
      case TabMediaTypeEnum.IMAGE:
        view = (
          <img
            src={renderFile(url)}
            style={{
              height: `calc(100vh - ${isLibrary ? '80px' : '0px'})`,
              width: '100vw',
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: -1,
            }}
          />
        );
        break;
      case TabMediaTypeEnum.VIDEO:
        view = (
          <ReactPlayer
            controls
            url={layoutEsalekit?.thumbnail ? url : renderFile(url)}
            width="100vw"
            height={`calc(100vh - ${isLibrary ? '80px' : '0px'})`}
            playing
            loop
            style={{
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 0,
            }}
          />
        );
        break;
      case TabMediaTypeEnum.VIEW3D:
        view = (
          <div
            style={{
              height: `calc(100vh - ${isLibrary ? '80px' : '0px'})`,
              width: '100vw',
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 0,
            }}
            dangerouslySetInnerHTML={{ __html: `${url}` }}
          />
        );
        break;
      case TabMediaTypeEnum.VIEW360:
        view = (
          <div
            style={{
              height: `calc(100vh - ${isLibrary ? '80px' : '0px'})`,
              width: '100vw',
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 0,
            }}
            dangerouslySetInnerHTML={{ __html: `${url}` }}
          />
        );
        break;
      case TabMediaTypeEnum.STREETVIEW:
        view = (
          <div
            style={{
              height: `calc(100vh - ${isLibrary ? '80px' : '0px'})`,
              width: '100vw',
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 0,
            }}
            dangerouslySetInnerHTML={{ __html: `${url}` }}
          />
        );
        break;
      default:
        view = (
          <img
            src={renderFile(url)}
            style={{
              height: `calc(100vh - ${isLibrary ? '80px' : '0px'})`,
              width: '100vw',
              objectFit: 'cover',
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: -1,
            }}
          />
        );
        break;
    }
    return view;
  };

  const renderContent = () => {
    let view = null;
    switch (LeftTabDetail?.mediaType) {
      case TabMediaTypeEnum.OVERALL_GROUND:
        if (headerTab?.hearTabs) {
          view = <GroundTablePreview id={headerTab?.hearTabs[0]?.id} />;
        }
        break;
      case TabMediaTypeEnum.IMAGE:
        view = (
          <BottomBar
            dataGallery={AllGalleryManager}
            handleChangeAvatar={handleChangeAvatar}
          />
        );
        break;
      default:
        view = (
          <Box>
            <Stack sx={{flexDirection:'row', alignItems:'center', mt: 1}}>
              <img
                src={renderFile(EsalekitDetail?.project?.avatarEsalekit)}
                style={{ width: 75}}
              />
              <Box ml={1}>
                <Typography
                  fontWeight={700}
                  color={palette.common.white}
                  fontSize={'26px'}
                >
                  {EsalekitDetail?.project?.name?.toLocaleUpperCase()}
                </Typography>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: -0.5,
                  }}
                >
                  {EsalekitDetail?.project && (
                    <img
                      src={LOCATION_ICON}
                      alt="icon location"
                      style={{ height: 13 }}
                    />
                  )}
                  <Typography
                    color={palette.common.white}
                    fontSize={'14px'}
                    ml={1}
                  >
                    {EsalekitDetail?.project?.address}
                    {EsalekitDetail?.project?.address && ', '}
                    {EsalekitDetail?.project?.ward}
                    {EsalekitDetail?.project?.ward && ', '}
                    {EsalekitDetail?.project?.district}
                    {EsalekitDetail?.project?.district && ', '}
                    {EsalekitDetail?.project?.province}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <PreviewEsalekit dataSidebar={headerTab} />
          </Box>
        );
        break;
    }
    return view;
  };

  return (
    <>
      <RootStyle
        sx={{
          display: 'flex',
          justifyContent:
            LeftTabDetail?.mediaType === TabMediaTypeEnum.IMAGE ||
            LeftTabDetail?.mediaType === TabMediaTypeEnum.OVERALL_GROUND
              ? 'normal'
              : 'center',
        }}
      >
        {renderBackgroundLibrary()}
        <DashboardSidebarPreview
          dataSidebar={EsalekitDetail?.leftTabs}
          onChangeTabSidebar={onChangeTabSidebar}
        />
        <Box>
          {renderContent()}
          <Button
            onClick={hanldelRegister}
            sx={{
              background: palette.primary.button,
              border: '1px solid #ffffff',
              position: 'fixed',
              right: '-1%',
              transform: 'rotate(270deg)',
              bottom: '25%',
              opacity: '90%',
              borderRadius: '22px',
              height: '44px',
              px: '18px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: palette.primary.button,
              },
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={'16px'}
              color={palette.common.white}
            >
              Đăng ký tư vấn
            </Typography>
          </Button>
        </Box>

        <ComfirmTabDialog
          backgroundColor={'#0F1C2F'}
          textColor="#D6465F"
          isOpen={isDialogRegisterAdvise}
          handleClose={closeDialogRegisterAdvise}
          handleSubmit={handleSubmit(submit, onError)}
          actionName={'ĐĂNG KÝ TƯ VẤN DỰ ÁN'}
          isRegisterAdvise={true}
          actionComfirm={t('Đăng ký')}
        >
          <Grid container xs={12} md={12} px={4}>
            <Typography
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                marginBottom: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
              }}
            >
              Vui lòng để lại thông tin, đội ngũ tư vấn viên sẽ liên hệ với bạn
              ngay !
            </Typography>
            <Grid item xs={12} md={12}>
              <TextFieldCustom
                placeholder="Nhập họ và tên"
                label="Họ & tên"
                isRequired
                name="name"
                control={control}
                errors={errors}
                backgroundColor="none"
                setError={setError}
                textColor="white"
              />
            </Grid>

            <Grid item xs={12} md={12} mt={1.5}>
              <TextFieldCustom
                placeholder="VD 0987 654 321"
                label="Số điện thoại"
                isRequired
                name="phoneNumber"
                format="phone"
                control={control}
                errors={errors}
                setError={setError}
                backgroundColor="none"
                textColor="white"
              />
            </Grid>
            <Grid item xs={12} md={12} mt={1.5}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ Email"
                label="Địa chỉ Email"
                isRequired
                name="email"
                format="email"
                control={control}
                errors={errors}
                setError={setError}
                backgroundColor="none"
                textColor="white"
              />
            </Grid>

            <Grid item xs={12} md={12} mt={1.5}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ liên hệ"
                label="Địa chỉ liên hệ"
                isRequired
                name="address"
                control={control}
                errors={errors}
                setError={setError}
                backgroundColor="none"
                textColor="white"
              />
            </Grid>
            <Grid item xs={12} md={12} mt={1.5}>
              <TextFieldCustom
                placeholder="Nhập nội dung ghi chú"
                label="Ghi chú (nếu có)"
                name="note"
                control={control}
                errors={errors}
                setError={setError}
                backgroundColor="none"
                textColor="white"
              />
            </Grid>
          </Grid>
        </ComfirmTabDialog>
      </RootStyle>
    </>
  );
}
