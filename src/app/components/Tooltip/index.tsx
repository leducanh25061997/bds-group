import React, { memo, useState } from 'react';
import { SxProps, Theme, Tooltip, Typography, useTheme } from '@mui/material';

interface Props {
  text: string | number;
  line?: number;
  width?: number;
  color?: string;
  fontWeight?: number;
  sx?: SxProps<Theme>;
  handleClick?: () => void;
  underLine?: string;
  toolTip?: boolean;
  children?: any;
}

export const TooltipText = memo((props: Props) => {
  const theme = useTheme();
  const ref = React.useRef<HTMLElement>(null);
  //#F4F5F6
  return (
    <Tooltip
      title={props.text as string}
      componentsProps={{
        tooltip: {
          sx: {
            color: '#E42B2C',
            background: '#FEF4FA',
            fontSize: '9px',
            fontWeight: '400',
            border: '0.5px solid #D45B7A',
            borderRadius: '4px',
          },
        },
        arrow: {
          sx: {
            color: '#D45B7A',
          },
        },
      }}
      arrow
      placement="top"
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
        {props.children}
      </Typography>
    </Tooltip>
  );
});
