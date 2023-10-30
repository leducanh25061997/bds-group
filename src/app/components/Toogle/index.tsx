import { Box, Slide, Typography, useTheme, SxProps } from '@mui/material';
import React, { Fragment } from 'react';

interface Props {
  sxProps?: SxProps;
  selected: boolean;
  noText?: boolean;
  onChange: () => void;
}

function Toogle(props: Props) {
  const { sxProps, selected, noText, onChange } = props;

  return (
    <Fragment>
      <Box sx={{ display: 'flex', ...sxProps }}>
        <div
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onChange();
          }}
          style={{ cursor: 'pointer' }}
        >
          <Box
            sx={{
              // width: '45px',
              height: 25,
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: selected ? 'flex-end' : 'flex-start',
              display: 'flex',
              padding: '5px',
              // padding: '2px',
              position: 'relative',
            }}
          >
            {selected && (
              <Typography
                sx={{
                  color: '#B5BAC0',
                  fontSize: '13px',
                  position: 'relative',
                  marginRight: '20px',
                }}
              >
                {'On'}
              </Typography>
            )}
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '100%',
                background: selected ? '#34C759' : '#B5BAC0',
              }}
            />
            {!selected && (
              <Typography
                sx={{
                  color: '#B5BAC0',
                  fontSize: '13px',
                  position: 'relative',
                  marginLeft: '20px',
                }}
              >
                {'Off'}
              </Typography>
            )}
          </Box>
        </div>

        {!noText && (
          <Typography
            sx={{
              color: '#222222',
              fontSize: '14px',
              marginLeft: '20px',
              fontStyle: 'italic',
              minWidth: 'fit-content',
            }}
          >
            {selected ? 'Kích hoạt' : 'Chưa kích hoạt'}
          </Typography>
        )}
      </Box>
    </Fragment>
  );
}

export default React.memo(Toogle);
