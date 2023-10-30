import { Box, Stack, Typography } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import UploadFile from 'app/components/UploadFileImage';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import document from 'services/api/document';
import palette from 'styles/theme/palette';
import { TabMediaTypeEnum } from 'types/Enum';
import { useEsalekitSlice } from '../../slice';
import { selectEsalekit } from '../../slice/selectors';
import { PayloadCreateGallery } from '../../slice/types';
import { ItemLibrary } from '../ItemLibrary';
import { useParams } from 'react-router-dom';
import { GalleryHeaderItem } from 'types/Esalekit';

interface Props {
  headerId: string;
}

export function ViewImage(props: Props) {
  const { headerId } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { GalleryHeaderManager } = useSelector(selectEsalekit);

  useEffect(() => {
    fetchGalleryHeader();
  }, [headerId]);

  const fetchGalleryHeader = () => {
    dispatch(EsalekitActions.getGalleryHeader({ id: headerId }));
    return () => {
      dispatch(EsalekitActions.clearDataGallery());
    };
  };

  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    if (imageId?.length && imageId[0]) {
      const payloadCreate: PayloadCreateGallery = {
        esalekitId: id,
        headerId: headerId,
        title: file.name,
        url: imageId[0]?.path,
        type: TabMediaTypeEnum.IMAGE,
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

  const handleChangeAvatar = (items: GalleryHeaderItem) =>{
    dispatch(
      EsalekitActions.changeAvatarGallery(items?.id, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay ảnh đại diện thành công',
                type: 'success',
              }),
            );
            fetchGalleryHeader();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay ảnh đại diện không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  }

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
        <Stack flexDirection={'row'} width={'100%'}>
          <Box width={'60%'}>
            <UploadFile
              handleSelectFile={handleSelectFile}
              buttonName="Tải ảnh lên"
              warningMessage="lỗi"
              name="fileId"
              urlDefault={null}
              isHideImage={true}
              sx={{ height: '32vh' }}
            />
          </Box>
          <Box
            width={'40%'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              pl: 4,
            }}
          >
            <Typography fontWeight={400} fontSize={'14px'}>
              Lưu ý:
            </Typography>
            <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
              <li>
                <Typography fontWeight={400} fontSize={'14px'}>
                  Vui lòng tải ảnh với định dạng .JPG, JPEG, .PNG.
                </Typography>
              </li>
              <li>
                <Typography fontWeight={400} fontSize={'14px'}>
                  Kích thước tối thiểu là 1000x750px hoặc tỉ lệ 4x3.
                </Typography>
              </li>
              <li>
                <Typography fontWeight={400} fontSize={'14px'}>
                  Vui lòng tải ảnh với định dạng .JPG, JPEG, .PNG.
                </Typography>
              </li>
              <li>
                <Typography fontWeight={400} fontSize={'14px'}>
                  Không giới hạn số lượng ảnh.
                </Typography>
              </li>
            </ul>
          </Box>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width:'100%' }}>
          {GalleryHeaderManager?.map((items, index) => (
            <ItemLibrary
              data={items}
              handleChangeAvatar={handleChangeAvatar}
              hanldeDeleteProject={hanldeDeleteProject}
              customType={TabMediaTypeEnum.IMAGE}
            />
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
