import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

interface StatisticInfo {
  text: {
    title: string;
    status: string;
  };
  style: {
    textColor: string;
    shapeColor: {
      fill: string;
      stroke: string;
      border: string;
    };
  };
}

interface StatisticItemProps {
  baseInfo: StatisticInfo;
  // style: {
  //   textColor: string;
  //   shapeColor: {
  //     fill: string;
  //     stroke: string;
  //   };
  // };
  data: number;
}

const StatisticItem = (props: StatisticItemProps) => {
  const { baseInfo, data } = props;
  const { style, text } = baseInfo;

  return (
    <Grid item xs={6}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          borderRadius: 1.5,
          height: '130px',

          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            width: 8,
            height: '100%',
            background: style.shapeColor.border,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pl: 4.75,
            pr: 5.75,
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography>{text.title}</Typography>
            <Typography color={style.textColor} sx={{ mt: 1.5 }}>
              {text.status}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '50px',
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            {data}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            right: '10px',
            bottom: 0,
            cursor: 'none',
          }}
        >
          <Shape
            fillColor={style.shapeColor.fill}
            strokeColor={style.shapeColor.stroke}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

const Shape: React.FC<{ fillColor: string; strokeColor: string }> = ({
  fillColor,
  strokeColor,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="130"
      height="86"
      viewBox="0 0 130 86"
      fill="none"
    >
      <g opacity="0.5">
        <path
          d="M31 41C31 38.7909 32.7909 37 35 37H47C49.2091 37 51 38.7909 51 41V86H31V41Z"
          fill={fillColor}
        />
        <path
          d="M7 55C7 52.7909 8.79086 51 11 51H23C25.2091 51 27 52.7909 27 55V86H7V55Z"
          fill={fillColor}
        />
        <path
          d="M55 33C55 30.7909 56.7909 29 59 29H71C73.2091 29 75 30.7909 75 33V86H55V33Z"
          fill={fillColor}
        />
        <path
          d="M79 19C79 16.7909 80.7909 15 83 15H95C97.2091 15 99 16.7909 99 19V86H79V19Z"
          fill={fillColor}
        />
        <path
          d="M103 31C103 28.7909 104.791 27 107 27H119C121.209 27 123 28.7909 123 31V86H103V31Z"
          fill={fillColor}
        />
        <path
          d="M0.5 46.5L17 35L41.5 29.5L64 19.5L89 3L116 19.5L129 13"
          stroke={strokeColor}
        />
        <circle cx="17" cy="35" r="2" fill="white" stroke={strokeColor} />
        <circle cx="41" cy="29" r="2" fill="white" stroke={strokeColor} />
        <circle cx="64" cy="19" r="2" fill="white" stroke={strokeColor} />
        <circle cx="89" cy="3" r="2" fill="white" stroke={strokeColor} />
        <circle cx="115" cy="19" r="2" fill="white" stroke={strokeColor} />
      </g>
    </svg>
  );
};

export default React.memo(StatisticItem);
