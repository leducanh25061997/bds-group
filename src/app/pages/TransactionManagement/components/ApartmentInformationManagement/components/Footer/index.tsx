import { Box } from '@mui/material';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  StatusProductEnumEN,
  StatusProductEnum,
  PriorityStatus,
  EventStatusEnum,
} from 'types/Enum';

import { selectApartmentInformation } from '../../slice/selectors';
import { Count } from '../../slice/types';

export const Footer = () => {
  const { apartmentInformation } = useSelector(selectApartmentInformation);
  const [data, setData] = useState<Count[]>([]);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [dataPriority, setDataPriority] = useState<any>();
  const [totalProductPriority, setTotalProductPriority] = useState<number>(0);
  const { priorityStatus } = useSelector(selectTransactionManagement);

  useEffect(() => {
    if (apartmentInformation) {
      if (
        apartmentInformation?.infProject.eventSales?.status !==
          EventStatusEnum.NOT_START ||
        !priorityStatus ||
        priorityStatus === PriorityStatus.NOT_OPENED_PRIORITY ||
        priorityStatus === PriorityStatus.LOCK_PRIORITY ||
        priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL
      ) {
        if (apartmentInformation.infProject) {
          setData(apartmentInformation.infProject.count);
          if (Object.keys(apartmentInformation.infProject.count).length > 0) {
            const data = apartmentInformation.infProject.count;
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
              sum += +data[i].value;
            }
            setTotalProduct(sum);
          }
        }
      } else {
        if (apartmentInformation.countPriority) {
          const { countPriority } = apartmentInformation;
          let sum = 0;
          (
            Object.keys(countPriority) as (keyof typeof countPriority)[]
          ).forEach((key, index) => {
            sum += countPriority[key];
          });
          setDataPriority(countPriority);
          setTotalProductPriority(sum);
        }
      }
    }
  }, [apartmentInformation]);

  useEffect(() => {
    return () => {
      setData([]);
    };
  }, []);

  const getValue = (key: StatusProductEnumEN) => {
    const filters = data.filter(item => item && item.key === key);
    if (filters.length > 0) {
      return filters[0].value;
    } else {
      return '0';
    }
  };

  const getColor = (key: StatusProductEnumEN) => {
    const filters = data.filter(item => item && item.key === key);
    if (filters.length > 0) {
      return filters[0].color || '#B5BAC0';
    } else {
      return 'unset';
    }
  };

  const RenderKeyValue = (
    key: StatusProductEnumEN,
    value: StatusProductEnum,
  ) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            background: getColor(key),
            border: '1px solid #C8CBCF',
            borderRadius: '4px',
            padding: '3px 9px',
            fontWeight: 600,
            fontSize: '11px',
            lineHeight: '20px',
            marginLeft: '24px',
            height: '28px',
          }}
        >
          {getValue(key)}
        </Box>
        {RenderValue(value)}
      </Box>
    );
  };

  const RenderValue = (value: string) => {
    return (
      <Box
        sx={{
          marginLeft: '6px',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '20px',
          width: 'max-content',
        }}
      >
        {value}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        // background: '#FFFFFF',
        boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.10)',
        // borderRadius: 'inherit',
        alignItems: 'center',
        // justifyContent: 'space-between',
        overflow: 'auto',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {(apartmentInformation?.infProject.eventSales == null ||
        apartmentInformation?.infProject.eventSales?.status ===
          EventStatusEnum.NOT_START) &&
      priorityStatus &&
      !(
        priorityStatus === PriorityStatus.LOCK_PRIORITY ||
        priorityStatus === PriorityStatus.NOT_OPENED_PRIORITY ||
        priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL
      ) ? (
        <>
          <Box
            sx={{
              color: '#FFFFFF',
              padding: '16px 14px',
              background:
                'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #3A4454',
            }}
          >
            <span style={{ fontWeight: '700', marginRight: '6px' }}>
              {totalProductPriority}
            </span>
            <span>Sản phẩm</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid #C8CBCF',
                // borderBottom: '4px solid #D6465F',
                borderRadius: '4px',
                padding: '3px 9px',
                fontWeight: 600,
                fontSize: '11px',
                lineHeight: '20px',
                marginLeft: '24px',
                marginRight: '10px',
              }}
            >
              {dataPriority?.WHITE || 0}
            </Box>
            {`Trống ưu tiên`}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid #C8CBCF',
                borderBottom: '4px solid #D6465F',
                borderRadius: '4px',
                padding: '3px 9px',
                fontWeight: 600,
                fontSize: '11px',
                lineHeight: '20px',
                marginLeft: '24px',
                marginRight: '10px',
              }}
            >
              {dataPriority?.RED || 0}
            </Box>
            {`Đã ráp ưu tiên`}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '1px solid #C8CBCF',
                borderBottom: '4px solid #3395FF',
                borderRadius: '4px',
                padding: '3px 9px',
                fontWeight: 600,
                fontSize: '11px',
                lineHeight: '20px',
                marginLeft: '24px',
                marginRight: '10px',
              }}
            >
              {dataPriority?.BLUE || 0}
            </Box>
            {`Đang ráp bổ sung ưu tiên`}
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              color: '#FFFFFF',
              padding: '16px 14px',
              background:
                'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #3A4454',
            }}
          >
            <span style={{ fontWeight: '700', marginRight: '6px' }}>
              {totalProduct}
            </span>
            <span>Sản phẩm</span>
          </Box>
          {RenderKeyValue(
            StatusProductEnumEN.WARE_HOUSE,
            StatusProductEnum.WARE_HOUSE,
          )}
          {RenderKeyValue(StatusProductEnumEN.LOCK, StatusProductEnum.LOCK)}
          {RenderKeyValue(StatusProductEnumEN.CLOSE, StatusProductEnum.CLOSE)}
          {RenderKeyValue(StatusProductEnumEN.OPEN, StatusProductEnum.OPEN)}
          {RenderKeyValue(
            StatusProductEnumEN.SIGN_UP,
            StatusProductEnum.SIGN_UP,
          )}
          {RenderKeyValue(
            StatusProductEnumEN.BOOKING,
            StatusProductEnum.BOOKING,
          )}
          {RenderKeyValue(
            StatusProductEnumEN.WAIT_FILE,
            StatusProductEnum.WAIT_FILE,
          )}
          {RenderKeyValue(
            StatusProductEnumEN.SOLD_OUT,
            StatusProductEnum.SOLD_OUT,
          )}
          {/* {RenderKeyValue(StatusProductEnumEN.CONSTRACT, StatusProductEnum.CONSTRACT)} */}
          {/* {RenderKeyValue(StatusProductEnumEN.LIQUIDATION, StatusProductEnum.LIQUIDATION)} */}
          {/* {RenderKeyValue(StatusProductEnumEN.TRANSFER, StatusProductEnum.TRANSFER)} */}
        </>
      )}
    </Box>
  );
};
