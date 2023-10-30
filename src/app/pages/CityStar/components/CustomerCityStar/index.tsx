import { Box, Paper, Typography, useTheme } from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import { translations } from 'locales/translations';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterParams, TableHeaderProps } from 'types';
import { AccountType, Status, TypeCardEnum } from 'types/Enum';

import RenderStatus from 'app/components/RenderStatus';
import { CityStarItem, MembershipItem } from 'types/CityStar';
import { RenderTitleMembershipCard, formatDateTime2 } from 'utils/helpers';

import dayjs, { Dayjs } from 'dayjs';

import { useCityStarSlice } from '../../slice';
import { selectCityStar } from '../../slice/selector';
import FilterBar from 'app/components/Filterbar';

export default function ListCityStars() {
  const { actions } = useCityStarSlice();
  const navigate = useNavigate();
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CustomerCityStarManagement, isLoading } = useSelector(selectCityStar);

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      // checkStatus: true,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<Status>(Status.INACTIVE);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'card_code',
        label: 'Mã thẻ thành viên',
        width: 180,
        align: 'left',
      },
      {
        id: 'type',
        label: 'Loại thẻ',
        width: 110,
        align: 'left',
      },
      {
        id: 'name',
        label: 'Tên khách hàng',
        width: 180,
        align: 'left',
      },
      {
        id: 'birth',
        label: 'Ngày sinh',
        width: 130,
        align: 'left',
      },
      {
        id: 'email',
        label: 'Địa chỉ Email',
        width: 150,
        align: 'left',
      },
      {
        id: 'phone',
        label: 'Số điện thoại',
        width: 130,
        align: 'left',
      },
      {
        id: 'indentify_number',
        label: 'CMND/CCCD',
        width: 130,
        align: 'left',
      },
      {
        id: 'active_date',
        label: 'Ngày kích hoạt',
        width: 140,
        align: 'left',
      },
    ],
    [t],
  );

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListCustomerCityStar(params));
  };

  const handleRequestSort = (event: any, property: string) => {
    onFilterToQueryString({
      ...filter,
      sortByName: filter?.sortByName === 'true' ? 'false' : 'true',
    });
  };

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };

  const handleSubmitDialog = () => {};

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const renderItem = (item: CityStarItem, index: number) => {
    return [
      <EllipsisText text={`${item.customerCode}`} line={1} color={'#007AFF'} />,
      <EllipsisText
        text={`${RenderTitleMembershipCard(item?.code?.typeCard)}`}
        line={1}
      />,
      <EllipsisText text={`${item.name}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.birth)}`} line={1} />,
      <EllipsisText text={`${item.email}`} line={1} />,
      <EllipsisText text={`${item.phoneNumber}`} line={1} />,
      <EllipsisText text={`${item.identityNumber}`} line={1} />,
      <EllipsisText
        text={`${formatDateTime2(item?.code?.createdAt)}`}
        line={1}
      />,
    ];
  };

  const filterList = useMemo(() => {
    return [
      {
        label: 'Loại thẻ',
        options: [
          {
            label: 'Chọn loại thẻ',
            value: '',
          },
          {
            label: 'Bạc',
            value: TypeCardEnum.SIVER,
          },
          {
            label: 'Vàng',
            value: TypeCardEnum.GOLD,
          },
          {
            label: 'Kim Cương',
            value: TypeCardEnum.DIAMOND,
          },
          {
            label: 'Bạch Kim',
            value: TypeCardEnum.PLATINUM,
          },
          {
            label: 'Đối Tác',
            value: TypeCardEnum.PARTNER,
          },
          {
            label: 'Đại Sứ',
            value: TypeCardEnum.AMBASSADOR,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            typeCard: value,
          });
        },
        handleDelete: () => {
          setFilterSelect(prev => {
            return {
              ...prev,
              typeCard: '',
            };
          });
        },
      },
      {
        label: 'Từ ngày',
        type: 'date',
        placeholder: 'Từ ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              startDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.startDate;
            setFilterSelect(filterSelect);
          }
        },
      },
      {
        label: '',
        type: 'date',
        placeholder: 'Đến ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              endDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.endDate;
            setFilterSelect(filterSelect);
          }
        },
      },
    ];
  }, [filterSelect, textSearching]);

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
    onFilterToQueryString({
      ...filter,
      search: keyword,
      page: 1,
    });
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <FilterBar
        onChangeSearchInput={handleSearchInputChange}
        placeholder={t(translations.common.search)}
        isFilter
        filterList={filterList}
        submitFilter={submitFilter}
      />
      <Table
        headers={header}
        onRequestSort={handleRequestSort}
        renderItem={renderItem}
        items={CustomerCityStarManagement?.data}
        pageNumber={filter.page}
        totalElements={CustomerCityStarManagement?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
        fullHeight
      />

      {isOpenDialog && (
        <ConfirmDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={
            dialogType === Status.ACTIVE
              ? t(translations.common.unlock)
              : t(translations.common.lock)
          }
        >
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            color={theme.palette.primary.light}
            mb={5}
          >
            {dialogType === Status.ACTIVE
              ? t(translations.confirmMessage.unlock)
              : t(translations.confirmMessage.lock)}
          </Typography>
        </ConfirmDialog>
      )}
    </Paper>
  );
}
