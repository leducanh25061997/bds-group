import { Box, Radio, Stack, Typography } from '@mui/material';
import EDIT_ICON from 'assets/background/delete-icon.svg';
import { TabMediaTypeEnum } from 'types/Enum';
import { GalleryHeaderItem } from 'types/Esalekit';
import { renderFile } from 'utils/helpers';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import palette from 'styles/theme/palette';

interface Props {
  data: GalleryHeaderItem;
  hanldeDeleteProject: (id: string) => void;
  handleChangeAvatar?: (item: GalleryHeaderItem) => void;
  customType?: TabMediaTypeEnum;
}

export function ItemLibrary(props: Props) {
  const { data, hanldeDeleteProject, customType, handleChangeAvatar } = props;

  const renderContent = () => {
    let view = null;
    switch (customType) {
      case TabMediaTypeEnum.IMAGE:
        view = (
          <img
            src={renderFile(data?.url)}
            style={{ width: '100%', height: '100%' }}
          />
        );
        break;
      case TabMediaTypeEnum.BANNER:
        view = (
          <a href={data?.url} target="_blank">
            <img
              src={renderFile(data?.thumbnail)}
              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </a>
        );
        break;
      case TabMediaTypeEnum.VIDEO:
        view = (
          <ReactPlayer
            controls
            url={data?.thumbnail ? data?.url : renderFile(data?.url)}
            light={data?.thumbnail ? renderFile(data?.thumbnail) : false}
            width="100%"
            height="100%"
            style={{ borderRadius: '8px', overflow: 'hidden' }}
          />
        );
        break;
      case TabMediaTypeEnum.VIEW3D:
        view = (
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: data?.url }}
          />
        );
        break;
      case TabMediaTypeEnum.VIEW360:
        view = (
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: data?.url }}
          />
        );
        break;
      case TabMediaTypeEnum.STREETVIEW:
        view = (
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: data?.url }}
          />
        );
        break;
      default:
        view = (
          <img
            src={renderFile(data?.url)}
            style={{ width: '100%', height: '100%' }}
          />
        );
        break;
    }
    return view;
  };

  const onChangeAvatar = (e: any) => {
    if (handleChangeAvatar) {
      handleChangeAvatar(data);
    }
  };

  return (
    <Box sx={{ mr: 2, mt: 3, width: '22.5%' }}>
      <Box
        sx={{
          borderRadius: '8px',
          border: '1px solid #C8CBCF',
          p: '2px',
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
        }}
      >
        {renderContent()}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
          }}
        >
          <Box
            sx={{
              width: '32px',
              height: '32px',
              background: 'white',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              m: '2px',
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px',
              ':hover': { background: '#dddddd' },
              cursor: 'pointer',
            }}
          >
            <img
              src={EDIT_ICON}
              alt="edit-icon"
              onClick={() => hanldeDeleteProject(data?.id)}
              height={16}
              width={16}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          border: '1px solid #C8CBCF',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          py: '4px',
          px: 1,
          mt: 1,
        }}
      >
        <Typography
          sx={{
            WebkitLineClamp: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            fontSize: '12px',
            fontWeight: 400,
          }}
        >
          {data?.title}
        </Typography>
      </Box>
      {TabMediaTypeEnum.IMAGE === customType && (
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Radio
            onChange={onChangeAvatar}
            checked={data.isAvatar}
            defaultChecked={data.isAvatar}
            sx={{
              '&.Mui-checked': {
                color: palette.primary.button,
              },
            }}
          />
          <Typography fontWeight={400} fontSize={'14px'}>
            Đặt làm ảnh đại diện dự án
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
