import React, { memo, useState } from 'react';
import { SxProps, Theme, Tooltip, Typography, useTheme } from '@mui/material';

interface Props {
  text: string | number;
  line?: number;
  width?: number | string;
  color?: string;
  fontWeight?: number;
  sx?: SxProps<Theme>;
  handleClick?: (e: any) => void;
  underLine?: string;
  toolTip?: boolean;
}

const COLOR_LINK = '#007aff';

export const EllipsisText = memo((props: Props) => {
  const theme = useTheme();
  const ref = React.useRef<HTMLElement>(null);

  const [hasTooltip, setHasTooltip] = useState<boolean>(false);

  React.useEffect(() => {
    if (!ref.current) return;
    if (ref?.current?.offsetHeight < ref?.current?.scrollHeight) {
      setHasTooltip(true);
    } else {
      setHasTooltip(false);
    }
  }, [props.text]);

  if (props.toolTip) {
    return (
      <Tooltip
        title={props.text as string}
        arrow
        placement="bottom-start"
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              color: theme.palette.primary.light,
              backgroundColor: theme.palette.info.lighter,
            },
            '& .MuiTooltip-arrow': {
              position: 'absolute',
              left: '0px !important',
              top: '-10px !important',
              height: '20px ',
              width: '25px ',
              '&::before': {
                backgroundColor: theme.palette.info.lighter,
              },
            },
          },
        }}
      >
        <Typography
          ref={ref}
          sx={{
            ...props.sx,
            display: '-webkit-box',
            WebkitLineClamp: props.line || 3,
            lineClamp: props.line || 3,
            maxWidth: props.width || 250,
            WebkitBoxOrient: 'vertical',
            fontWeight: props.fontWeight || 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            color: theme.palette.primary.light,
          }}
          onClick={props.handleClick}
        >
          {props.text ? props.text : '-'}
        </Typography>
      </Tooltip>
    );
  }

  if (hasTooltip) {
    return (
      <Tooltip title={props.text as string}>
        <Typography
          ref={ref}
          sx={{
            ...props.sx,
            display: '-webkit-box',
            WebkitLineClamp: props.line || 3,
            lineClamp: props.line || 3,
            maxWidth: props.width || 250,
            WebkitBoxOrient: 'vertical',
            fontWeight: props.fontWeight || 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            color: props.color || theme.palette.primary.light,
            ':hover': {
              textDecoration:
                props.color?.toLowerCase() === COLOR_LINK
                  ? 'underline'
                  : 'unset',
            },
          }}
          onClick={props.handleClick}
        >
          {props.text ? props.text : '-'}
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Typography
      ref={ref}
      sx={{
        ...props.sx,
        display: '-webkit-box',
        WebkitLineClamp: props.line || 3,
        lineClamp: props.line || 3,
        maxWidth: props.width || 250,
        WebkitBoxOrient: 'vertical',
        fontWeight: props.fontWeight || 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'break-spaces',
        color: props.color || theme.palette.primary.light,
        textDecoration: props.underLine || 'unset',
        ':hover': {
          textDecoration:
            props.color?.toLowerCase() === COLOR_LINK ? 'underline' : 'unset',
        },
      }}
      onClick={props.handleClick}
    >
      {props.text ? props.text : '-'}
    </Typography>
  );
});
