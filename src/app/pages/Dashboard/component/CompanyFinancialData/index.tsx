import { Box, Collapse, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { translations } from 'locales/translations';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CardWrapper from '../CardWrapper';
import FilterBar from '../FilterBar';
import ChartData from '../ChartData';

const CompanyFinancialData = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [filterSelect, setFilterSelect] = useState<string>('');
  const { t } = useTranslation();
  const theme = useTheme();
  const filterList = useMemo(() => {
    return [
      {
        label: 'Năm',
        options: [
          {
            label: 'Chọn năm',
            value: '',
          },
          {
            label: 'Năm 2022',
            value: '2022',
          },
          {
            label: 'Năm 2023',
            value: '2023',
          },
          {
            label: 'Năm 2024',
            value: '2024',
          },
          {
            label: 'Năm 2025',
            value: '2025',
          },
          {
            label: 'Năm 2026',
            value: '2026',
          },
          {
            label: 'Năm 2027',
            value: '2027',
          },
          {
            label: 'Năm 2028',
            value: '2028',
          },
          {
            label: 'Năm 2029',
            value: '2029',
          },
          {
            label: 'Năm 2030',
            value: '2030',
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect(value);
        },
      },
    ];
  }, []);
  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`IV. ${t(translations.dashboard.companyFinancialData)}`}
        onClick={() => setOpen(prev => !prev)}
        isUpper
      />
      <Collapse in={open}>
        <Box
          sx={{ marginTop: { xs: '16px', sm: '0px' } }}
          display="flex"
          justifyContent={'flex-end'}
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
        <Box
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          display="flex"
          justifyContent={'flex-end'}
          marginTop={'16px'}
        >
          <FilterBar filterList={filterList} />
        </Box>
        <Box
          sx={{
            marginBottom: '14px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              fontSize={'14px'}
              lineHeight={'17px'}
              color={theme.palette.primary.lighter}
            >
              {t(translations.Comisstion.revenue)}
            </Typography>
            <Typography
              fontSize={'14px'}
              lineHeight={'17px'}
              color={theme.palette.primary.lighter}
            >
              (trăm triệu)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              width={'13px'}
              height={'13px'}
              borderRadius={'5px'}
              marginRight={'5px'}
              sx={{ background: theme.palette.primary.lighter }}
            />
            <Typography
              fontSize={'14px'}
              lineHeight={'17px'}
              color={theme.palette.primary.light}
              marginRight={'22px'}
            >
              {t(translations.dashboard.realRevenue)}
            </Typography>
            <Box
              width={'13px'}
              height={'13px'}
              borderRadius={'5px'}
              marginRight={'5px'}
              sx={{ background: theme.palette.primary.contrastText }}
            />
            <Typography
              fontSize={'14px'}
              lineHeight={'17px'}
              color={theme.palette.primary.light}
            >
              {t(translations.Comisstion.assumedRevenue)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: '500px' }}>
          <ChartData />
        </Box>
      </Collapse>
    </CardWrapper>
  );
};

export default CompanyFinancialData;
