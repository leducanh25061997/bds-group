import React from 'react';

import {
  Accordion,
  Box,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Link as MuiLink,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import palette from 'styles/theme/palette';
import dayjs from 'dayjs';
import { TransferTextStatus } from 'types/Enum';

import { CustomerItem } from 'types/User';

import FieldInfo from './FieldInfo';

import { addressFormat } from '.';

interface AssociateCustomerProps {
  data: CustomerItem[] | undefined;
}

const AssociateCustomer: React.FC<AssociateCustomerProps> = ({ data }) => {
  if (!data || !data.length) return null;

  return (
    <Box sx={{ mt: 2.5 }}>
      {data.map((customer, idx) => (
        <Accordion
          key={idx}
          sx={{
            backgroundColor: '#F4F5F6',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#1E1E1E' }} />}
            aria-controls="panel2a-content"
          >
            <Typography fontWeight={700} color={palette.primary.button}>
              Khách hàng đồng sở hữu {idx + 1}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={1.5}>
              <FieldInfo
                label="Mã khách hàng (nếu có):"
                content={
                  customer.code ? (
                    <MuiLink
                      component={Link}
                      to="#"
                      underline="hover"
                      sx={{
                        color: '#006EE6',
                      }}
                    >
                      {customer.code}
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
              <FieldInfo label="Tên khách hàng:" content={customer.name} />
              <FieldInfo
                label="Giới tính:"
                content={TransferTextStatus[customer.gender]}
              />
              <FieldInfo
                label="Ngày sinh:"
                content={dayjs(customer.birth).format('DD/MM/YYYY')}
              />
              <FieldInfo label="Địa chỉ Email:" content={customer.email} />
              <FieldInfo
                label="Số điện thoại:"
                content={customer.phoneNumber}
              />
              <FieldInfo
                label="Số CCCD/CMND/Pastport:"
                content={customer.identityNumber}
              />
              <FieldInfo label="Ngày cấp:" content={'15/01/2021'} />
              <FieldInfo label="Nơi cấp:" content={customer.issuedBy} />
              <FieldInfo
                label="Địa chỉ liên hệ:"
                content={addressFormat({
                  street: customer.street,
                  ward: customer.ward,
                  district: customer.district,
                  province: customer.province,
                })}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default React.memo(AssociateCustomer);
