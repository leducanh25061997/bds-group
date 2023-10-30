import {
  Box,
  Radio,
  Stack,
  SvgIcon,
  SvgIconProps,
  Typography,
} from '@mui/material';
import EDIT_ICON from 'assets/background/delete-icon.svg';
import dayjs from 'dayjs';
import { TabMediaTypeEnum } from 'types/Enum';
import { GalleryHeaderItem } from 'types/Esalekit';
import { renderFile } from 'utils/helpers';

interface Props {
  data: GalleryHeaderItem;
  ispreview?: boolean;
  hanldeDeleteProject: (id: string) => void;
  handleChangeAvatar?: (item: GalleryHeaderItem) => void;
  customType?: TabMediaTypeEnum;
}

export function EsakekitNews(props: Props) {
  const { data, hanldeDeleteProject, ispreview } = props;

  return (
    <Box
      sx={{
        mr: 2,
        mb: '15px',
        width: '22.5%',
        border: '1px solid #C8CBCF',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          borderRadius: 'inherit',
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          p: 0.25,
        }}
      >
        <a href={data?.url} target="_blank">
          <img
            src={renderFile(data?.thumbnail)}
            alt={data?.title}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              borderRadius: 8,
              objectFit: 'cover',
            }}
          />
        </a>
        <Box
          sx={{
            display: ispreview ? 'none' : 'flex',
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
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          px: 1,
          mt: 0.5,
          mb: 1,
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
            fontSize: '16px',
            fontWeight: 700,
            color: '#000',
          }}
        >
          {data?.title}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: 12,
            lineHeight: '140%',
            mt: 0.5,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <ClockIcon
            sx={{
              fontSize: 12,
              mr: 0.5,
            }}
          />{' '}
          {dayjs(data?.createdAt).format('DD/MM/YYYY')}
        </Typography>
      </Box>
    </Box>
  );
}

const ClockIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 12 12" {...props}>
      <path
        d="M6 0C4.81331 0 3.65328 0.351894 2.66658 1.01118C1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C0.00259973 4.80025 -0.11622 6.00665 0.115291 7.17054C0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C5.99335 12.1162 7.19975 11.9974 8.2961 11.5433C9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C11.6481 8.34673 12 7.18669 12 6C11.9981 4.40928 11.3654 2.88424 10.2406 1.75943C9.11576 0.63462 7.59072 0.00187662 6 0ZM6 10.9091C5.02908 10.9091 4.07995 10.6212 3.27266 10.0818C2.46536 9.54234 1.83615 8.77565 1.46459 7.87863C1.09304 6.98161 0.99582 5.99455 1.18524 5.04228C1.37466 4.09001 1.8422 3.2153 2.52875 2.52875C3.2153 1.8422 4.09002 1.37465 5.04229 1.18524C5.99456 0.995817 6.98161 1.09303 7.87863 1.46459C8.77565 1.83615 9.54234 2.46536 10.0818 3.27265C10.6212 4.07995 10.9091 5.02907 10.9091 6C10.9075 7.30148 10.3898 8.54921 9.4695 9.4695C8.54921 10.3898 7.30149 10.9075 6 10.9091Z"
        fill="#7A7A7A"
      />
      <path
        d="M6.5455 5.774V2.7271C6.5455 2.58243 6.48803 2.44369 6.38574 2.3414C6.28345 2.23911 6.14471 2.18164 6.00004 2.18164C5.85538 2.18164 5.71664 2.23911 5.61435 2.3414C5.51206 2.44369 5.45459 2.58243 5.45459 2.7271V5.99982C5.45462 6.14447 5.51211 6.28319 5.61441 6.38546L7.25077 8.02182C7.35365 8.12118 7.49143 8.17616 7.63444 8.17492C7.77746 8.17367 7.91427 8.11631 8.0154 8.01518C8.11653 7.91405 8.1739 7.77724 8.17514 7.63422C8.17638 7.49121 8.1214 7.35342 8.02204 7.25055L6.5455 5.774Z"
        fill="#7A7A7A"
      />
    </SvgIcon>
  );
};
