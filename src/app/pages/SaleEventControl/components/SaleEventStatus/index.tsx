import { Box, SvgIcon, SvgIconProps, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectSaleEventControl } from '../../slice/selector';
import { SaleControlEnum } from '../../slice/types';

const SaleEventStatus: React.FC = () => {
  const { eventSale } = useSelector(selectSaleEventControl);

  const statusColor = React.useMemo(() => {
    let textColor, backgroundColor;

    if (eventSale?.currentPhase === SaleControlEnum.START_PHASE1) {
      switch (eventSale.currentPriority) {
        case SaleControlEnum.START_PRIORITY1:
        case SaleControlEnum.START_PRIORITY2:
        case SaleControlEnum.START_PRIORITY3:
          textColor = '#2FB350';
          backgroundColor = '#D6F4DE';
          break;
        case SaleControlEnum.END_PRIORITY1:
        case SaleControlEnum.END_PRIORITY2:
        case SaleControlEnum.END_PRIORITY3:
          textColor = 'primary.darkRed';
          backgroundColor = '#FFD9EA';
          break;
      }
    } else if (
      eventSale?.currentPhase === SaleControlEnum.END_PHASE1 ||
      eventSale?.currentPhase === SaleControlEnum.END_PHASE2 ||
      eventSale?.status === SaleControlEnum.ENDED ||
      eventSale?.status === SaleControlEnum.NOT_START
    ) {
      textColor = 'primary.darkRed';
      backgroundColor = '#FFD9EA';
    } else if (eventSale?.currentPhase === SaleControlEnum.START_PHASE2) {
      textColor = '#2FB350';
      backgroundColor = '#D6F4DE';
    }

    // const textColor = true ? '#2FB350' : 'primary.darkRed';
    // const backgroundColor = true ? '#D6F4DE' : '#FFD9EA';

    return {
      textColor,
      backgroundColor,
    };
  }, [eventSale]);

  const statusText = React.useMemo(() => {
    if (eventSale?.status === SaleControlEnum.NOT_START)
      return 'Sự kiện chưa bắt đầu';
    if (eventSale?.status === SaleControlEnum.ENDED)
      return 'Sự kiện đã kết thúc';

    if (eventSale?.currentPhase === SaleControlEnum.START_PHASE1) {
      switch (eventSale.currentPriority) {
        case SaleControlEnum.START_PRIORITY1:
          return 'Bắt đầu giao dịch giai đoạn 1 - Ưu tiên 1';
        case SaleControlEnum.START_PRIORITY2:
          return 'Bắt đầu giao dịch giai đoạn 1 - Ưu tiên 2';
        case SaleControlEnum.START_PRIORITY3:
          return 'Bắt đầu giao dịch giai đoạn 1 - Ưu tiên 3';
        case SaleControlEnum.END_PRIORITY1:
          return 'Giao dịch giai đoạn 1 - Kết thúc ưu tiên 1';
        case SaleControlEnum.END_PRIORITY2:
          return 'Giao dịch giai đoạn 1 - Kết thúc ưu tiên 2';
        case SaleControlEnum.END_PRIORITY3:
          return 'Giao dịch giai đoạn 1 - Kết thúc ưu tiên 3';
      }
    } else if (eventSale?.currentPhase === SaleControlEnum.END_PHASE1) {
      return 'Kết thúc giao dịch giai đoạn 1';
    } else if (eventSale?.currentPhase === SaleControlEnum.END_PHASE2) {
      return 'Kết thúc giao dịch giai đoạn 2';
    } else if (eventSale?.currentPhase === SaleControlEnum.START_PHASE2) {
      return 'Bắt đầu giao dịch giai đoạn 2';
    }

    return 'Sự kiện đã kết thúc';
  }, [eventSale]);

  return (
    <Box
      sx={{
        py: 2,
        pl: 2.5,
        borderRadius: 1.5,
        backgroundColor: statusColor.backgroundColor,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <SpeakerIcon
        sx={{
          color: statusColor.textColor,
          height: '20px',
        }}
      />
      <Typography
        variant="body2"
        color={statusColor.textColor}
        fontWeight={500}
        sx={{
          ml: 1,
          mr: 1,
        }}
      >
        {statusText}
      </Typography>
    </Box>
  );
};

function SpeakerIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_18466_165745)">
          <path
            d="M17.6759 3.33007C17.4461 3.16225 17.1781 3.05424 16.8962 3.01576C16.6143 2.97728 16.3272 3.00954 16.0608 3.10963L9.27705 5.99502C8.27334 6.42363 7.19314 6.64422 6.10175 6.64346H3.09028C2.53634 6.64391 2.00519 6.86405 1.61334 7.25558C1.22148 7.64711 1.00091 8.17808 1 8.73202V14.399C1.00045 14.9532 1.22083 15.4846 1.61273 15.8766C2.00463 16.2685 2.53604 16.4888 3.09028 16.4893H3.4651L6.09746 22.4693C6.19266 22.6852 6.36972 22.8544 6.58969 22.9398C6.80966 23.0251 7.05452 23.0196 7.2704 22.9244C7.48628 22.8292 7.6555 22.6521 7.74083 22.4321C7.82617 22.2122 7.82062 21.9673 7.72542 21.7514L5.40956 16.4893H6.10261C7.20049 16.4893 8.26922 16.7071 9.2779 17.1369L16.1388 20.0506C16.3967 20.1327 16.6703 20.153 16.9375 20.1098C17.2047 20.0666 17.4579 19.9611 17.6767 19.8018C18.1185 19.4785 18.3827 18.9595 18.3827 18.4123V4.72044C18.3827 4.17321 18.1185 3.65257 17.6759 3.33007ZM21.274 12.4554H24.1268C24.3627 12.4554 24.589 12.3617 24.7558 12.1949C24.9226 12.0281 25.0163 11.8018 25.0163 11.5659C25.0163 11.33 24.9226 11.1038 24.7558 10.937C24.589 10.7702 24.3627 10.6765 24.1268 10.6765H21.274C21.0381 10.6765 20.8119 10.7702 20.6451 10.937C20.4783 11.1038 20.3846 11.33 20.3846 11.5659C20.3846 11.8018 20.4783 12.0281 20.6451 12.1949C20.8119 12.3617 21.0381 12.4554 21.274 12.4554ZM21.2749 8.70028C21.4087 8.70028 21.5451 8.67026 21.6737 8.60593L24.5265 7.17268C24.631 7.12019 24.724 7.04764 24.8004 6.95919C24.8768 6.87074 24.935 6.76811 24.9717 6.65716C25.0084 6.54621 25.0229 6.42912 25.0144 6.31257C25.0058 6.19601 24.9744 6.08228 24.9219 5.97786C24.8695 5.87345 24.7969 5.7804 24.7085 5.70401C24.62 5.62763 24.5174 5.56942 24.4064 5.53271C24.2955 5.49599 24.1784 5.48148 24.0618 5.49002C23.9453 5.49856 23.8316 5.52996 23.7271 5.58245L20.8743 7.01571C20.6952 7.10555 20.5516 7.25329 20.4669 7.43495C20.3822 7.61662 20.3613 7.82158 20.4077 8.01658C20.454 8.21159 20.5649 8.38522 20.7223 8.50932C20.8797 8.63342 21.0745 8.70071 21.2749 8.70028ZM24.5265 15.9592L21.6737 14.5268C21.4639 14.429 21.2242 14.4169 21.0055 14.4929C20.7868 14.5689 20.6063 14.7271 20.5023 14.934C20.3983 15.1408 20.379 15.3801 20.4485 15.6009C20.5179 15.8218 20.6707 16.0069 20.8743 16.117L23.7271 17.5494C23.8316 17.6019 23.9453 17.6333 24.0618 17.6419C24.1784 17.6504 24.2955 17.6359 24.4064 17.5992C24.5174 17.5625 24.62 17.5043 24.7085 17.4279C24.7969 17.3515 24.8695 17.2584 24.9219 17.154C24.9744 17.0496 25.0058 16.9359 25.0144 16.8193C25.0229 16.7028 25.0084 16.5857 24.9717 16.4747C24.935 16.3638 24.8768 16.2611 24.8004 16.1727C24.724 16.0842 24.631 16.0117 24.5265 15.9592Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_18466_165745">
            <rect
              width="25"
              height="20"
              fill="white"
              transform="translate(1 3)"
            />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export default React.memo(SaleEventStatus);
