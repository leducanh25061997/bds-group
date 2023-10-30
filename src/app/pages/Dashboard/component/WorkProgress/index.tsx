import { Avatar, Box, Collapse, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { EllipsisText } from 'app/components/EllipsisText';
import RenderStatus from 'app/components/RenderStatus';
import { Status } from 'types/Enum';
import Table from 'app/components/Table';
import { translations } from 'locales/translations';
import { useFilter } from 'app/hooks';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterParams, TableHeaderProps } from 'types';

import { WorkProgressItem } from '../../slice/types';

import CardWrapper from '../CardWrapper';
import FilterBar from '../FilterBar';

import { workProgressData } from '../Data';

const WorkProgress = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [filterSelect, setFilterSelect] = useState<string>('');
  const [checked, setChecked] = React.useState(true);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const { t } = useTranslation();
  const filterList = useMemo(() => {
    return [
      {
        label: 'Tình trạng',
        options: [
          {
            label: 'Tình trạng',
            value: '',
          },
          {
            label: 'Đang hoạt động',
            value: Status.ACTIVE,
          },
          {
            label: 'Ngừng hoạt động',
            value: Status.INACTIVE,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect(value);
        },
      },
    ];
  }, []);

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 60,
      },
      {
        id: 'name',
        label: t(translations.common.nameReal),
        align: 'left',
        hasSort: true,
        width: 200,
      },
      {
        id: 'address',
        label: t(translations.common.address),
        align: 'left',
        width: 270,
      },
      {
        id: 'realEstateType',
        label: t(translations.realEstates.realEstatesType),
        align: 'left',
        width: 100,
      },
      {
        id: 'contract',
        label: t(translations.contract.contract),
        align: 'left',
        width: 150,
      },
      {
        id: 'assignUser',
        label: t(translations.realEstates.assignedPersion),
        align: 'left',
        width: 220,
      },
      {
        id: 'status',
        label: t(translations.common.status),
        align: 'center',
      },
    ],
    [t],
  );

  const renderItem = (item: WorkProgressItem, index: number) => {
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
        text={item?.address}
        color={theme.palette.primary.light}
        line={2}
      />,
      <EllipsisText
        text={item?.realEstateType}
        color={theme.palette.primary.light}
        line={1}
      />,
      <EllipsisText
        text={item?.contract}
        color={theme.palette.primary.light}
        line={1}
      />,
      <Box>
        <Avatar src={item.assignUser} />
      </Box>,
      <RenderStatus status={item.status} />,
    ];
  };

  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`I. ${t(translations.dashboard.workProgression)}`}
        onClick={() => setOpen(prev => !prev)}
        isUpper
      />
      <Collapse in={open}>
        <Box
          sx={{ marginTop: { xs: '16px' } }}
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
          <FilterBar
            isTitle
            filterList={filterList}
            handleCheck={handleChange}
            isChecked={checked}
          />
        </Box>
        <Table
          headers={header}
          renderItem={renderItem}
          items={workProgressData}
          pageNumber={filter.page}
          sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Collapse>
    </CardWrapper>
  );
};

export default WorkProgress;
