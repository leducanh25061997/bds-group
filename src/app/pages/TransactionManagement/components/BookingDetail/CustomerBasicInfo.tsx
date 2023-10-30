import React from 'react';
import { Link as MuiLink, Typography } from '@mui/material';
import { CustomerItem, ProjectCustomerType } from 'types/User';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { TransferTextStatus } from 'types/Enum';
import path from 'app/routes/path';

import FieldInfo from './FieldInfo';

import { addressFormat } from '.';

interface CustomerBasicInfoProps {
  data: CustomerItem;
}

const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({ data }) => {
  if (data == null) return null;

  const renderInfo = () => {
    switch (data.type) {
      case ProjectCustomerType.PERSONAL:
        return (
          <>
            <FieldInfo label="Tên khách hàng:" content={data.name} />
            <FieldInfo label="Quốc tịch:" content={data?.nationality} />
            <FieldInfo
              label="Giới tính:"
              content={TransferTextStatus[data.gender]}
            />
            <FieldInfo
              label="Ngày sinh:"
              content={
                data.birth ? dayjs(data.birth).format('DD/MM/YYYY') : '-'
              }
            />
            <FieldInfo label="Địa chỉ Email:" content={data.email} />
            <FieldInfo label="Số điện thoại:" content={data.phoneNumber} />
            <FieldInfo
              label="Số CCCD/CMND/Pastport:"
              content={data.identityNumber}
            />
            <FieldInfo
              label="Ngày cấp:"
              content={dayjs(data.dateRange).format('DD/MM/YYYY')}
            />
            <FieldInfo label="Nơi cấp:" content={data.issuedBy} />
            <FieldInfo label="Địa chỉ liên hệ:" content={data?.address} />
            <FieldInfo
              label="Địa chỉ thường trú:"
              content={data?.addressBorn}
            />
          </>
        );
      case ProjectCustomerType.BUSINESS:
        return (
          <>
            <FieldInfo label="Tên công ty:" content={data.companyName} />
            <FieldInfo label="Mã số doanh nghiệp:" content={data.companyCode} />
            <FieldInfo
              label="Ngày cấp:"
              content={dayjs(data.companyDateRange).format('DD/MM/YYYY')}
            />
            <FieldInfo label="Nơi cấp:" content={data.companyIssuedBy} />
            <FieldInfo label="Người đại diện:" content={data.name} />
            <FieldInfo label="Người chức vụ:" content={data.position} />
            <FieldInfo
              label="Ngày sinh:"
              content={
                data.birth ? dayjs(data.birth).format('DD/MM/YYYY') : '-'
              }
            />
            <FieldInfo label="Địa chỉ Email:" content={data.email} />
            <FieldInfo label="Số điện thoại:" content={data.phoneNumber} />
            <FieldInfo
              label="Số CCCD/CMND/Pastport:"
              content={data.identityNumber}
            />
            <FieldInfo
              label="Ngày cấp:"
              content={dayjs(data.dateRange).format('DD/MM/YYYY')}
            />
            <FieldInfo label="Nơi cấp:" content={data.issuedBy} />
          </>
        );
    }
  };

  return (
    <>
      <FieldInfo
        label="Mã khách hàng (nếu có):"
        content={
          data.code ? (
            <MuiLink
              component={Link}
              to={`${path.potentialAccount}/${data.id}`}
              underline="hover"
              sx={{
                color: '#006EE6',
              }}
            >
              {data.code}
            </MuiLink>
          ) : (
            ''
          )
        }
        contentProps={{
          sx: {
            color: '#006EE6',
          },
        }}
      />
      {renderInfo()}
    </>
  );
};

export default React.memo(CustomerBasicInfo);
