import { Box, Stack } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import LINK_ICON from 'assets/background/upload-view3d-icon.svg';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import { TabMediaTypeEnum } from 'types/Enum';
import { useEsalekitSlice } from '../../slice';
import { selectEsalekit } from '../../slice/selectors';
import { PayloadCreateGallery } from '../../slice/types';
import { ItemLibrary } from '../ItemLibrary';
import { useParams } from 'react-router-dom';
interface Props {
  headerId: string;
  mediaType: TabMediaTypeEnum;
}

export function View3D(props: Props) {
  const { headerId, mediaType } = props;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { GalleryHeaderManager } = useSelector(selectEsalekit);

  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm();

  useEffect(() => {
    fetchGalleryHeader();
  }, [headerId]);

  const fetchGalleryHeader = () => {
    dispatch(EsalekitActions.getGalleryHeader({ id: headerId }));
    console.log('mediaType', mediaType);
    return () => {
      dispatch(EsalekitActions.clearDataGallery());
    };
  };

  const hanldeDeleteProject = (id: string) => {
    dispatch(
      EsalekitActions.deleteGallery({ id: id }, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá thành công',
                type: 'success',
              }),
            );
            fetchGalleryHeader();
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

  const hanldeAddVideo = () => {
    const linkvideo = watch('linkvideo');
    const url = `<iframe frameborder="0" src="${linkvideo}"" style="height: 100%;width: 100%;"></iframe>`
    //https://my.matterport.com/show/?m=ucnUNAynPkL&play=1&qs=1
    const payloadCreate: PayloadCreateGallery = {
      esalekitId: id,
      headerId: headerId,
      url: url,
      title: mediaType,
      type: mediaType,
    };
   
   
    if (linkvideo.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa nhập Link URL',
          type: 'error',
        }),   
      );
      return;
    }

    dispatch(
      EsalekitActions.createGallery(payloadCreate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thêm thành công',
                type: 'success',
              }),
            );
            setValue('linkvideo','');
            fetchGalleryHeader();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thêm không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          px: 4,
          paddingTop: 3,
          background: palette.common.white,
          borderRadius: '12px',
          minHeight: '70vh',
          pb: '20vh',
        }}
      >
        <Stack
          sx={{
            p: 2,
            mt: 1,
            width: '100%',
            flexDirection: 'row',
            borderStyle: 'dashed',
            borderRadius: '8px',
            borderColor: '#C8CBCF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={LINK_ICON} />
          <Box width={'55%'} mx={2}>
            <TextFieldCustom
              placeholder="Nhập link URL View 3D"
              label="Link URL"
              name="linkvideo"
              control={control}
              errors={errors}
              setError={setError}
              sxProps={{ width: '100%' }}
            />
          </Box>
          <CustomButton
            title={'Tải lên'}
            sxProps={{
              mt: 1,
              background: palette.primary.button,
              color: palette.common.white,
              borderRadius: '8px',
              alignSelf: 'flex-start',
              width: '100px',
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 400,
            }}
            handleClick={hanldeAddVideo}
          />
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width:'100%' }}>
          {GalleryHeaderManager?.map((items, index) => (
            <ItemLibrary
              data={items}
              hanldeDeleteProject={hanldeDeleteProject}
              customType={TabMediaTypeEnum.VIEW3D}
            />
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
