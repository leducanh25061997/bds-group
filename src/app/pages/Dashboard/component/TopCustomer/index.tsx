import { Box, Collapse, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { translations } from 'locales/translations';
import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { TableHeaderProps } from 'types';

import { TopCustomerType } from '../../slice/types';

import CardWrapper from '../CardWrapper';
import { TopCustomerData } from '../Data';

const TopCustomer = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 100,
      },
      {
        id: 'name',
        label: t(translations.customer.customerName),
        align: 'left',
        hasSort: true,
        width: 250,
      },
      {
        id: 'businessName',
        label: t(translations.customer.businessName),
        align: 'left',
        width: 150,
      },
      {
        id: 'phone',
        label: t(translations.common.phone),
        align: 'left',
        width: 120,
      },
      {
        id: 'customerType',
        label: t(translations.customer.customerType),
        align: 'left',
        width: 150,
      },
      {
        id: 'spendingTotal',
        label: t(translations.dashboard.spendingTotal),
        align: 'left',
        width: 200,
      },
    ],
    [t],
  );

  const renderItem = (item: TopCustomerType, index: number) => {
    // const take = filter?.limit || 0;
    // const page = filter?.page || 0;
    return [
      // <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText text={item?.id} line={1} />,
      <EllipsisText
        text={item?.name}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={item?.businessName}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.phone}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.customerType}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.spendingTotal}
        color={theme.palette.primary.light}
        line={1}
      />,
    ];
  };
  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`V. ${t(translations.dashboard.topCustomer)}`}
        onClick={() => setOpen(prev => !prev)}
        isUpper
      />
      <Collapse in={open}>
        <Box
          display="flex"
          justifyContent={'flex-end'}
          sx={{ marginTop: { xs: '16px', sm: '0px' } }}
        >
          <CustomButton
            title={t(translations.dashboard.downloaded)}
            variant="contained"
            isIcon
            buttonMode="download"
            typeButton={'download'}
            // isDisable={isLoading}
            light
          />
        </Box>
        <Box marginTop={'16px'}>
          <Table
            headers={header}
            renderItem={renderItem}
            items={TopCustomerData}
            hidePagination
          />
        </Box>
      </Collapse>
    </CardWrapper>
  );
};

export default TopCustomer;
