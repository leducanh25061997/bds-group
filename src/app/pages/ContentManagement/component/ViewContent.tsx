import { Box, Stack, Typography, useTheme } from '@mui/material';
import UploadFile from 'app/components/UploadFileImage';
import { Fragment, useEffect, useRef, useState } from 'react';
import palette from 'styles/theme/palette';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { TabMediaTypeEnum } from 'types/Enum';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import CustomButton from 'app/components/Button';
import document from 'services/api/document';
import { useParams } from 'react-router-dom';
import { selectEsalekit } from 'app/pages/Esalekit/slice/selectors';
import { PayloadCreateContent, PayloadCreateGallery } from 'app/pages/Esalekit/slice/types';
import { useEsalekitSlice } from 'app/pages/Esalekit/slice';
import { ItemLibrary } from 'app/pages/Esalekit/components/ItemLibrary';
interface Props {
  headerId: string;
  type: TabMediaTypeEnum
}

export function ViewContent(props: Props) {
  const { type } = props;
  const dispatch = useDispatch();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { GalleryHeaderType } = useSelector(selectEsalekit);
  const [imageUpload, setImageUpload] = useState('');

  const {
    control,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchGalleryHeader();
  }, [type]);

  const fetchGalleryHeader = () => {
    dispatch(EsalekitActions.getGalleryType(type));
    return () => {
      dispatch(EsalekitActions.clearDataGalleryType());
    };
  };

  const handleSaveFile = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    if (imageId?.length && imageId[0]) {
      setImageUpload(imageId[0]?.path);
    }
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
    const linkcontent = watch('linkcontent');
    const title = watch('title');
    const payloadCreate: PayloadCreateContent = {
      title: title,
      url: linkcontent,
      thumbnail: imageUpload,
      type: type,
    };

    if (linkcontent.length === 0) {
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
      EsalekitActions.createContent(payloadCreate, (res?: any) => {
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
  };

  return (
    <Fragment>
      <Box
        sx={{
          background: palette.common.white,
          borderRadius: '12px',
          minHeight: '70vh',
          pb: '20vh',
        }}
      >
        <Stack
          sx={{
            p: 2,
            width: '100%',
            flexDirection: 'row',
            borderStyle: 'dashed',
            borderRadius: '8px',
            borderColor: '#C8CBCF',
          }}
        >
         
          <Stack width={'50%'} alignItems={'center'}>
            <Box sx={{ width: '90%' }}>
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
            </Box>
          </Stack>
          <Stack width={'50%'} alignItems={'center'}>
            <Box sx={{ width: '90%' }}>
              <TextFieldCustom
                placeholder="Nhập link URL"
                label="Link URL"
                name="linkcontent"
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{ width: '100%' }}
              />
            </Box>
            <Box sx={{ width: '90%', mt: 2 }}>
              <TextFieldCustom
                placeholder="Nhập tiêu đề"
                label="Tiêu đề"
                name="title"
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{ width: '100%' }}
              />
            </Box>
            <CustomButton
                title={'Thêm nội dung'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                  mt: 2,
                }}
                sxPropsText={{
                  fontSize: '14px',
                }}
                handleClick={hanldeAddVideo}
              />
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width:'100%' }}>
          {GalleryHeaderType?.map((items, index) => (
            <ItemLibrary
              data={items}
              hanldeDeleteProject={hanldeDeleteProject}
              customType={TabMediaTypeEnum.BANNER}
            />
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
