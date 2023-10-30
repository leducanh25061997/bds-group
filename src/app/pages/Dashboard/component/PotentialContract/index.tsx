import { Box, Collapse, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import { translations } from 'locales/translations';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterParams, TableHeaderProps } from 'types';

import { PotentialContractType } from '../../slice/types';

import CardWrapper from '../CardWrapper';
import { contractPotentialData } from '../Data';

const PotentialContract = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 100,
      },
      {
        id: 'codeContract',
        label: t(translations.Comisstion.codeContract),
        align: 'left',
        width: 100,
      },
      {
        id: 'nameContract',
        label: t(translations.contract.contractName),
        align: 'left',
        width: 220,
      },
      {
        id: 'nameCustomer',
        label: t(translations.customer.customerName),
        align: 'left',
        width: 200,
      },
      {
        id: 'numberRealEstate',
        label: t(translations.contract.numberOfrealEstate),
        align: 'left',
        width: 120,
      },
      {
        id: 'createAt',
        label: t(translations.common.createdAt),
        align: 'left',
        width: 150,
      },
    ],
    [t],
  );

  const renderItem = (item: PotentialContractType, index: number) => {
    // const take = filter?.limit || 0;
    // const page = filter?.page || 0;
    return [
      // <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText text={item?.id} line={1} />,
      <EllipsisText
        text={item?.contractCode}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={item?.name}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={item?.nameCustomer}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.numberRealEstate}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.createAt}
        color={theme.palette.primary.light}
        line={1}
      />,
    ];
  };
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      // fetchDataForPage({ ...params });
    },
    defaultFilter: initialFilter,
  });

  // const fetchDataForPage = (params: FilterParams) => {
  //   dispatch(actions.fetchListWorkProgress(params));
  // };

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (take: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      take,
    });
  };
  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`II. ${t(translations.dashboard.contractPotential)}`}
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
        <Box marginTop={'16px'}>
          <Table
            headers={header}
            renderItem={renderItem}
            items={contractPotentialData}
            pageNumber={filter.page}
            sort={filter.orderBy}
            limitElement={filter.limit}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </Box>
      </Collapse>
    </CardWrapper>
  );
};

export default PotentialContract;
