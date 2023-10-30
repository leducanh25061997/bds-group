import { Box, Stack, Typography, useTheme } from '@mui/material';
import UploadFile from 'app/components/UploadFileImage';
import { Fragment, useEffect, useRef, useState } from 'react';
import palette from 'styles/theme/palette';
import { ItemLibrary } from '../ItemLibrary';
import { useDispatch, useSelector } from 'react-redux';
import { useEsalekitSlice } from '../../slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { selectEsalekit } from '../../slice/selectors';
import { TabMediaTypeEnum } from 'types/Enum';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import CustomButton from 'app/components/Button';
import document from 'services/api/document';
import { PayloadCreateGallery } from '../../slice/types';
import { useParams } from 'react-router-dom';
interface Props {
  headerId: string;
}

export function ViewVideo(props: Props) {
  const { headerId } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileRef = useRef('');
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { GalleryHeaderManager } = useSelector(selectEsalekit);
  const [imageUpload, setImageUpload] = useState('');

  const {
    control,
    formState: { errors },
    watch,
    setError,
    setValue
  } = useForm();

  useEffect(() => {
    fetchGalleryHeader();
  }, [headerId]);

  const fetchGalleryHeader = () => {
    dispatch(EsalekitActions.getGalleryHeader({ id: headerId }));
    return () => {
      dispatch(EsalekitActions.clearDataGallery());
    };
  };

  const handleSaveFile = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    fileRef.current = file.name;
    if (imageId?.length && imageId[0]) {
      setImageUpload(imageId[0]?.path);
    }
  };

  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    if (imageId?.length && imageId[0]) {
      const payloadCreate: PayloadCreateGallery = {
        esalekitId: id,
        headerId: headerId,
        title: file.name,
        url: imageId[0]?.path,
        type: TabMediaTypeEnum.VIDEO,
      };
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
    }
  };

  const hanldeDeleteProject = (id: string) => {
    dispatch(
      EsalekitActions.deleteGallery({id: id}, (res?: any) => {
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
    const linkVideo = watch('linkvideo');
    const payloadCreate: PayloadCreateGallery = {
      esalekitId: id,
      headerId: headerId,
      title: fileRef.current,
      url: linkVideo,
      thumbnail: imageUpload,
      type: TabMediaTypeEnum.VIDEO,
    };

    if (linkVideo.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa nhập Link URL',
          type: 'error',
        }),
      );
      return;
    }

    if (imageUpload === '') {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa tải ảnh đại diện',
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
        <Typography fontWeight={400} fontSize={'14px'}>
          Có thể upload video bằng cách gán link URL video từ link Youtube hoặc
          tải trực tiếp video từ máy lên
        </Typography>
        <Stack
          sx={{
            p: 2,
            mt: 1,
            width: '100%',
            flexDirection: 'row',
            borderStyle: 'dashed',
            borderRadius: '8px',
            borderColor: '#C8CBCF',
          }}
        >
          <Stack width={'50%'} alignItems={'center'}>
            <Box sx={{ width: '80%' }}>
              <TextFieldCustom
                placeholder="Nhập link URL video"
                label="Link URL"
                name="linkvideo"
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{ width: '100%' }}
              />
            </Box>
            <Box sx={{ width: '80%' }}>
              <Typography fontWeight={500} fontSize={'14px'} mb={1}>
                Ảnh đại diện video
              </Typography>
              <UploadFile
                handleSelectFile={handleSaveFile}
                buttonName="Tải ảnh lên"
                warningMessage="lỗi"
                name="fileId"
                urlDefault={null}
                sx={{
                  height: { md: '220px' },
                  border: '1px solid #D3D3D3',
                  borderStyle: 'solid',
                }}
              />
              <CustomButton
                title={'Thêm video'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                  mt: 1.5,
                  alignSelf: 'flex-start',
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 400,
                }}
                handleClick={hanldeAddVideo}
              />
            </Box>
          </Stack>
          <Box
            sx={{
              height: { md: '280x' },
              background: '#AFAFAF',
              width: '1px',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                background: palette.common.white,
                p: 2,
              }}
            >
              Hoặc
            </Typography>
          </Box>
          <Stack width={'50%'} alignItems={'center'}>
            <Box sx={{ width: '80%' }}>
              <UploadFile
                handleSelectFile={handleSelectFile}
                buttonName="Tải video lên"
                warningMessage="lỗi"
                name="fileId"
                urlDefault={null}
                isHideImage={true}
                uploadType={TabMediaTypeEnum.VIDEO}
                sx={{
                  height: { md: '270px' },
                  border: '1px solid #D3D3D3',
                  borderStyle: 'solid',
                }}
              />
              <Typography fontWeight={400} fontSize={'14px'} mt={1}>
                'Định dạng phù hợp: .mp4, .mov, .mpeg-1, .mpeg-2, .mpeg4, .mpg,
                .avi, .wmv, .mpegps, .flv ...vv'
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width:'100%' }}>
          {GalleryHeaderManager?.map((items, index) => (
            <ItemLibrary
              data={items}
              hanldeDeleteProject={hanldeDeleteProject}
              customType={TabMediaTypeEnum.VIDEO}
            />
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
