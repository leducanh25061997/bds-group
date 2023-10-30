import {
  Box,
  Stack,
  Typography,
  ListItemButton,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { GalleryHeaderItem } from 'types/Esalekit';
import IMG_ICON from 'assets/esalekit/esalekit-image-icon.svg';
import VIDEO_ICON from 'assets/esalekit/esakekit-video-icon.svg';
import VIEW3D_ICON from 'assets/esalekit/esalekit-3d-icon.svg';
import VIEW360_ICON from 'assets/esalekit/esalekit-360-icon.svg';
import STREETVIEW_ICON from 'assets/esalekit/esalekit-street-icon.svg';
import AliceCarousel from 'react-alice-carousel';
import './css/alice-carousel.css';
import { renderFile } from 'utils/helpers';
import { TabMediaTypeEnum } from 'types/Enum';
import ReactPlayer from 'react-player';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import classNames from 'classnames';
const APPBAR = 80;

interface Props {
  dataGallery?: GalleryHeaderItem[];
  handleChangeAvatar: (item: GalleryHeaderItem) => void;
}

const RootStyle = styled(Box)(({ theme }) => ({
  background: '#0F1C2F',
  height: APPBAR,
  width: '100%',
  position: 'fixed',
  bottom: 0,
  flexDirection: 'row',
  display: 'flex',
  justifyContent: 'center',
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 400,
  color: '#AFAFAF',
  marginTop: 8,
}));

const DividerItem = styled(Divider)(({ theme }) => ({
  background: '#475160',
  width: '1px',
  height: '65%',
}));

const MenuItem = styled(ListItemButton)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 95%;
  margin: 3px;
  width: 90px;
  &.active {
    background: #475160;
  }
`;

export default function BottomBar(props: Props) {
  const { dataGallery, handleChangeAvatar } = props;
  const [ListLibrary, setListLibrary] = useState<any[]>([]);
  const [btnActive, setbtnActive] = useState<TabMediaTypeEnum>(
    TabMediaTypeEnum.IMAGE,
  );

  const handleDragStart = (items: any) => {
    handleChangeAvatar(items);
  };
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    if (dataGallery) {
      let gallery: any[] = [];
      dataGallery
        ?.filter(element => element.type === TabMediaTypeEnum.IMAGE)
        .forEach(items => {
          gallery.push(
            <Tooltip title={items.title}>
              <img
                src={renderFile(items.url)}
                onClick={() => handleDragStart(items)}
                style={{ width: 93, height: 70 }}
              />
            </Tooltip>,
          );
        });
      setListLibrary(gallery);
    }
  }, [dataGallery]);

  const hanldeChangeType = (type: TabMediaTypeEnum) => {
    let gallery: any[] = [];
    let dataTypeMedia = dataGallery?.filter(element => element.type === type);
    if (dataTypeMedia && dataTypeMedia?.length > 0) {
      handleChangeAvatar(dataTypeMedia[0]);
    }
    setbtnActive(type);
    dataTypeMedia?.forEach(items => {
      switch (type) {
        case TabMediaTypeEnum.IMAGE:
          gallery.push(
            <Tooltip title={items.title}>
              <img
                src={renderFile(items.url)}
                onClick={() => handleDragStart(items)}
                style={{ width: 93, height: 70 }}
              />
            </Tooltip>,
          );
          break;
        case TabMediaTypeEnum.VIDEO:
          if (items.thumbnail) {
            gallery.push(
              <Tooltip title={'items.title'}>
                <img
                  src={renderFile(items.thumbnail)}
                  onClick={() => handleDragStart(items)}
                  style={{ width: 93, height: 70 }}
                />
              </Tooltip>,
            );
          } else {
            gallery.push(
              <Tooltip title={items.title}>
                <video
                  onClick={() => handleDragStart(items)}
                  height="70px"
                  width="93px"
                  src={`${renderFile(items?.url)}#t=6`}
                ></video>
              </Tooltip>,
            );
          }
          break;
        case TabMediaTypeEnum.VIEW3D:
          gallery.push(
            <Tooltip title={items.title}>
              <div
                onClick={() => handleDragStart(items)}
                style={{ width: 93, height: 70 }}
                dangerouslySetInnerHTML={{
                  __html: `<div style="overflow: hidden; pointer-events: none;">${items?.url}</div>`,
                }}
              />
            </Tooltip>,
          );
          break;
        case TabMediaTypeEnum.VIEW3D:
          gallery.push(
            <Tooltip title={items.title}>
              <div
                onClick={() => handleDragStart(items)}
                style={{ width: 93, height: 70 }}
                dangerouslySetInnerHTML={{
                  __html: `<div style="overflow: hidden; pointer-events: none;">${items?.url}</div>`,
                }}
              />
            </Tooltip>,
          );
          break;
        case TabMediaTypeEnum.STREETVIEW:
          gallery.push(
            <Tooltip title={items.title}>
              <div
                onClick={() => handleDragStart(items)}
                style={{ width: 93, height: 70 }}
                dangerouslySetInnerHTML={{
                  __html: `<div style="overflow: hidden; pointer-events: none;">${items?.url}</div>`,
                }}
              />
            </Tooltip>,
          );
          break;
        default:
          break;
      }
    });
    setListLibrary(gallery);
  };

  const onNextSlide = () => {
    if (carouselRef?.current) {
      carouselRef?.current?.slideNext();
    }
  };

  const onPrevSlide = () => {
    if (carouselRef?.current) {
      carouselRef?.current?.slidePrev();
    }
  };

  return (
    <RootStyle>
      <IconButton
        sx={{ width: 35, height: 35, alignSelf: 'center' }}
        onClick={onPrevSlide}
      >
        <ArrowBackIosIcon fontSize="small" sx={{ color: 'white' }} />
      </IconButton>
      <Stack sx={{ width: '55%', height: '100%', justifyContent: 'center' }}>
        <AliceCarousel
          ref={carouselRef}
          mouseTracking
          items={ListLibrary}
          autoHeight
          autoWidth
          disableDotsControls
          keyboardNavigation
        />
      </Stack>
      <IconButton
        sx={{ width: 35, height: 35, alignSelf: 'center' }}
        onClick={onNextSlide}
      >
        <ArrowForwardIosIcon fontSize="small" sx={{ color: 'white' }} />
      </IconButton>
      <Stack
        sx={{
          width: '35%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MenuItem
          className={classNames({
            active: btnActive === TabMediaTypeEnum.IMAGE,
          })}
          onClick={() => hanldeChangeType(TabMediaTypeEnum.IMAGE)}
        >
          <img src={IMG_ICON} />
          <Text>Hình ảnh</Text>
        </MenuItem>
        <DividerItem />
        <MenuItem
          className={classNames({
            active: btnActive === TabMediaTypeEnum.VIDEO,
          })}
          onClick={() => hanldeChangeType(TabMediaTypeEnum.VIDEO)}
        >
          <img src={VIDEO_ICON} />
          <Text>Video</Text>
        </MenuItem>
        <DividerItem />
        <MenuItem
          className={classNames({
            active: btnActive === TabMediaTypeEnum.VIEW3D,
          })}
          onClick={() => hanldeChangeType(TabMediaTypeEnum.VIEW3D)}
        >
          <img src={VIEW3D_ICON} />
          <Text>3D</Text>
        </MenuItem>
        <DividerItem />
        <MenuItem
          className={classNames({
            active: btnActive === TabMediaTypeEnum.VIEW360,
          })}
          onClick={() => hanldeChangeType(TabMediaTypeEnum.VIEW360)}
        >
          <img src={VIEW360_ICON} />
          <Text sx={{ mt: 0.5 }}>
            View 360<sup>o</sup>
          </Text>
        </MenuItem>
        <DividerItem />
        <MenuItem
          className={classNames({
            active: btnActive === TabMediaTypeEnum.STREETVIEW,
          })}
          onClick={() => hanldeChangeType(TabMediaTypeEnum.STREETVIEW)}
        >
          <img src={STREETVIEW_ICON} />
          <Text>Street View</Text>
        </MenuItem>
      </Stack>
    </RootStyle>
  );
}
