import { Box, useTheme, Typography, IconButton } from '@mui/material';
import React, { FC, useMemo } from 'react';
import { FilterParams, TableHeaderProps } from 'types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import Table from 'app/components/Table';

import { EllipsisText } from 'app/components/EllipsisText';
import { PerformentContract, RealValuation } from 'types/Comisstion';
import DETAI_ICON from 'assets/icons/detail.svg';

import { useSelector } from 'react-redux';
import { useFilter } from 'app/hooks/useFilter';
import moment from 'moment';
import RenderStatus from 'app/components/RenderStatus';

import { realValuation } from '../Data';

import { selectComisstion } from '../../slice/selector';

interface ContractSumaryProps {
  isConstractPrecious: boolean;
  isTotalContract: boolean;
  totalContractThisQuarter?: number;
  totalContract?: number;
  totaltotalProperty?: number;
}

const ContractSumary: FC<ContractSumaryProps> = ({
  isConstractPrecious,
  isTotalContract,
  totalContractThisQuarter,
  totalContract,
  totaltotalProperty,
}) => {
  const theme = useTheme();
  // const { id } = useParams();
  const { t } = useTranslation();
  const { staffList } = useSelector(selectComisstion);
  // const dispatch = useDispatch();
  // const { actions } = useComisstionSlice();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    // dispatch(actions.getListTotalContractOrThisQuarter(params));
  };

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

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 60,
      },
      {
        id: 'codeContract',
        label: t(translations.Comisstion.codeContract),
        align: 'left',
      },
      {
        id: 'nameContract',
        label: t(translations.contract.contractName),
        align: 'left',
      },
      {
        id: 'createDay',
        label: t(translations.common.createdAt),
        align: 'left',
        width: 150,
      },
      {
        id: 'status',
        label: t(translations.common.status),
        align: 'left',
      },
      {
        id: '',
        label: '',
      },
    ],
    [t],
  );
  const headerReal: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
      },
      {
        id: 'nameReal',
        label: t(translations.common.nameReal),
        align: 'left',
      },
      {
        id: 'acreage',
        label: t(translations.Comisstion.areaComisstion),
        align: 'left',
      },
      {
        id: 'ctxd',
        label: t(translations.Comisstion.ctXD),
        align: 'left',
      },
      {
        id: 'purposeSd',
        label: t(translations.Comisstion.purposeSd),
        align: 'left',
      },
      {
        id: 'valueTd',
        label: t(translations.Comisstion.valueTĐ),
        align: 'left',
      },
      {
        id: 'status',
        label: t(translations.common.status),
        align: 'left',
      },
    ],
    [t],
  );

  const renderItem = (item: PerformentContract, index: number) => {
    const take = filter?.limit || 0;
    const page = filter?.page || 0;
    return [
      <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText
        text={item.contractCode}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item.name}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={moment(item.createdAt).format('DD/MM/YYYY')}
        color={theme.palette.primary.light}
        line={2}
      />,
      <RenderStatus status={item.status} />,
      <div>
        {
          <IconButton>
            <img alt="Trash icon" src={DETAI_ICON} />
          </IconButton>
        }
      </div>,
    ];
  };

  const renderItemReal = (item: RealValuation, index: number) => {
    return [
      <EllipsisText text={item.id} />,
      <EllipsisText
        text={item.realName}
        toolTip
        color={theme.palette.primary.light}
        line={3}
      />,
      <EllipsisText
        text={item.area}
        color={theme.palette.primary.light}
        line={3}
      />,
      <EllipsisText
        text={item.ctxd}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item.purposeSd}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={item.valueTd}
        color={theme.palette.primary.light}
        toolTip
        line={2}
      />,
      <RenderStatus status={item.status} />,
    ];
  };

  if (isConstractPrecious || isTotalContract) {
    return (
      <>
        <Box
          sx={{ display: 'flex', alignItems: 'center', paddingBottom: '14px' }}
        >
          <Typography
            fontSize={'14px'}
            lineHeight={'17px'}
            fontWeight={600}
            color={theme.palette.primary.light}
          >
            {isConstractPrecious
              ? t(translations.common.performanceContract)
              : t(translations.common.contractTotal)}
            :
          </Typography>
          <Typography
            ml={'16px'}
            fontWeight={400}
            fontSize={'14px'}
            lineHeight={'17px'}
            color={theme.palette.primary.light}
          >
            {isConstractPrecious ? totalContractThisQuarter : totalContract}
          </Typography>
        </Box>
        <Table
          headers={header}
          renderItem={renderItem}
          items={staffList?.data}
          pageNumber={filter.page}
          totalElements={staffList?.total}
          sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </>
    );
  }
  return (
    <>
      <Box
        sx={{ display: 'flex', alignItems: 'center', paddingBottom: '14px' }}
      >
        <Typography
          fontSize={'14px'}
          lineHeight={'17px'}
          fontWeight={600}
          color={theme.palette.primary.light}
        >
          {t(translations.common.realValuation)}:
        </Typography>
        <Typography
          ml={'16px'}
          fontWeight={400}
          fontSize={'14px'}
          lineHeight={'17px'}
          color={theme.palette.primary.light}
        >
          {totaltotalProperty}
        </Typography>
      </Box>

      <Table
        headers={headerReal}
        renderItem={renderItemReal}
        items={realValuation}
      />
      <Box />
    </>
  );
};

export default ContractSumary;
