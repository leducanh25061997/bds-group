import { Box, Grid, Link, Typography, useTheme } from '@mui/material';
import UploadFile from 'app/components/UploadFileImage/UploadIdentification';
import {
  default as document,
  default as documentService,
} from 'services/api/document';
import AVATAR_DEFAULT from 'assets/img/avatar-default.svg';
import IMG_ABSOLUTE from 'assets/img/img-absolute.svg';

import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import UploadAvatar from 'app/components/UploadAvatar';
import { renderFile } from 'utils/helpers';
import { useProfile } from 'app/hooks';
import UploadAvatarProfile from 'app/components/UploadAvatarProfile';
import { useDispatch, useSelector } from 'react-redux';
import { selectStaff } from '../Staff/slice/selector';
import { useStaffSlice } from '../Staff/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { PayloadUpdateAvatarUser } from 'types';
import { useAuthSlice } from '../Auth/slice';
import UserProfile from './components/create';
import EditUser from './components/edit';
import { SocialType } from 'types/Enum';

import FACEBOOK_ICON from 'assets/background/facebook-icon.svg';
import ZALO_ICON from 'assets/background/zalo-icon.svg';
import INSTAGRAM_ICON from 'assets/background/instagram-icon.svg';
import TWITTER_ICON from 'assets/background/twitter-icon.svg';
interface LinkSocical {
  type: SocialType;
  link: string;
}

export function Profile() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const [listlink, setListLink] = useState<LinkSocical[]>([]);
  
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  const userInfo = useProfile();

  // useEffect(() => {

  // }, [actions, dispatch]);

  useEffect(() => {
    if (userInfo?.staff?.soical) {
      setListLink(userInfo?.staff?.soical);
    }
  }, [userInfo]);

  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    if (imageId?.length && imageId[0]) {
      const payload: PayloadUpdateAvatarUser = {
        avatar: imageId[0]?.path,
      };

      dispatch(
        actions.updatedAvatarUser(payload, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật ảnh đại diện thành công',
                  type: 'success',
                }),
              );
              dispatch(actions.getUserInfo());
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật ảnh đại diện không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    }
  };

  const renderContent = (item: LinkSocical) => {
    let view = null;
    switch (item?.type) {
      case SocialType.FACEBOOK:
        view = <img src={FACEBOOK_ICON} style={{ cursor: 'pointer' }} />;
        break;
      case SocialType.ZALO:
        view = <img src={ZALO_ICON} style={{  cursor: 'pointer' }} />;
        break;
      case SocialType.TWITTER:
        view = <img src={TWITTER_ICON} style={{ borderRadius: '25px', cursor: 'pointer' }} />;
        break;
      case SocialType.INSTAGRAM:
        view = <img src={INSTAGRAM_ICON} style={{ cursor: 'pointer' }} />;
        break;
      default:
        view = null;
        break;
    }
    return view;
  };

  return (
    <Fragment>
      <Box
        bgcolor={theme.palette.grey[0]}
        p={3}
        sx={{
          marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
          marginRight: { xs: '12px', sm: '24px', lg: '0px' },
          borderRadius: 3,
          mt: '-10px',
          minHeight: 'calc(99%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              marginRight: '24px',
            }}
          >
            <UploadAvatarProfile
              handleSelectFile={handleSelectFile}
              buttonName=""
              warningMessage="lỗi"
              name="avatar"
              control={control}
              errors={errors}
              bgImage={
                userInfo?.avatar
                  ? `${process.env.REACT_APP_API_URL}/${userInfo?.avatar}`
                  : AVATAR_DEFAULT
              }
              imgAbsolute={IMG_ABSOLUTE}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                color: '#000000',
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              {userInfo?.staff?.fullName}
            </Typography>
            <Typography>{userInfo?.staff?.position}</Typography>
            <Typography
              sx={{
                color: '#007AFF',
              }}
            >
              Mã nhân viên: {userInfo?.staff?.code}
            </Typography>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '4px' }}
            >
              {listlink.map((item, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    mr: 1.5,
                    mb: 1,
                    alignItems: 'center',
                    width: 'fit-content',
                  }}
                >
                  <Link
                    style={{ cursor: 'pointer' }}
                    target="_blank"
                    href={item?.link}
                  >
                    <Box>{renderContent(item)}</Box>
                  </Link>
                </Box>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box>
        <EditUser id={userInfo?.staff?.id}></EditUser>
      </Box>
    </Fragment>
  );
}
