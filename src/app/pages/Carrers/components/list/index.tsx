import { Button, Paper, Typography, useTheme } from '@mui/material';
import ButtonMoreMenu from 'app/components/ButtonMoreMenu';
import { EllipsisText } from 'app/components/EllipsisText';
import RenderStatus from 'app/components/RenderStatus';
import { useFilter } from 'app/hooks';
import { translations } from 'locales/translations';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterParams, TableHeaderProps, TypeCheckBoxTable } from 'types';
import { Status } from 'types/Enum';
import { useNavigate } from 'react-router-dom';
import VIEW_ICON from 'assets/background/view-detail-icon.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import LOCk_ICON from 'assets/background/lock-icon.svg';
import Table from 'app/components/Table';
import { RealEstateItem } from 'types/RealEstate';
import moment from 'moment';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useDispatch, useSelector } from 'react-redux';

import { selectSetting } from 'app/pages/Settings/slice/selector';

import dayjs, { Dayjs } from 'dayjs';

import { useSettingSlice } from 'app/pages/Settings/slice';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { formatCurrency } from 'utils/helpers';

import FilterBar from '../Filterbar';
import { useRealEstateSlice } from '../../slice';
import { selectRealEstate } from '../../slice/selectors';

interface ListRealEstateProps {
  hasCheckbox?: boolean;
  isFilterAppraised?: boolean;
  onSelectCheckbox?: (listItem: RealEstateItem[]) => void;
  listSelected?: RealEstateItem[];
  typeCheckBox?: TypeCheckBoxTable;
}

export default function ListRealEstate(props: ListRealEstateProps) {
  const {
    hasCheckbox,
    onSelectCheckbox,
    listSelected,
    isFilterAppraised,
    typeCheckBox,
  } = props;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      take: 10,
      sortByName: 'false',
    };
  }, []);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<Status>(Status.INACTIVE);
  const [realEstateSelected, setRealEstateSelected] = useState<string | number>(
    0,
  );
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const { actions } = useRealEstateSlice();
  const { actions: actionsContract } = useSettingSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { realEstateManager, isLoading } = useSelector(selectRealEstate);
  const { listPropertyType } = useSelector(selectSetting);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });
  const dispatch = useDispatch();

  const fetchDataForPage = (params: FilterParams) => {
    if (hasCheckbox) {
      if (isFilterAppraised) {
        dispatch(
          actions.fetchListRealEstates({
            ...params,
            status: Status.ACTIVE,
            appraised: Status.APPRAISED,
          }),
        );
      } else {
        dispatch(
          actions.fetchListRealEstates({ ...params, status: Status.ACTIVE }),
        );
      }
    } else {
      dispatch(actions.fetchListRealEstates(params));
    }
  };
  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
    onFilterToQueryString({
      ...filter,
      search: keyword,
      page: 1,
      sortByName: 'false',
      fields: keyword
        ? [
            'realEstate.generalInfo.propertyCode',
            'realEstate.generalInfo.realEstateProject.name',
            'realEstate.positionInfo.province',
            'realEstate.positionInfo.district',
            'realEstate.positionInfo.ward',
            'realEstate.positionInfo.street',
            'realEstate.positionInfo.apartmentNumber',
            'realEstate.positionInfo.searchAddress ',
            'createdBy.fullName',
          ]
        : [],
    });
  };
  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };
  const dataPropertyType = useMemo(() => {
    if (listPropertyType) {
      const resOption: { label: string; value: string; id: string }[] = [];
      listPropertyType?.forEach(item => {
        resOption.push({
          label: item.description || '',
          value: item.name || '',
          id: item.id.toString(),
        });
      });
      return resOption;
    }
    return [];
  }, [listPropertyType]);

  useEffect(() => {
    dispatch(actionsContract.fetchListPropertyType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterList = useMemo(() => {
    return [
      {
        label: 'Loại khách hàng',
        options: [
          {
            label: '--- Loại hình BĐS ---',
            value: '',
            id: '',
          },
          ...dataPropertyType,
        ],
        handleSelected: (value: string) => {
          const sectorIdFilter = dataPropertyType.find(
            e => e.value === value,
          )?.id;
          setFilterSelect({
            ...filterSelect,
            sector: sectorIdFilter ? sectorIdFilter + '' : null,
            fields: textSearching
              ? [
                  'realEstate.generalInfo.propertyCode',
                  'realEstate.generalInfo.realEstateProject.name',
                  'realEstate.positionInfo.province',
                  'realEstate.positionInfo.district',
                  'realEstate.positionInfo.ward',
                  'realEstate.positionInfo.street',
                  'realEstate.positionInfo.apartmentNumber',
                  'realEstate.positionInfo.searchAddress ',
                  'createdBy.fullName',
                ]
              : [],
          });
        },
      },
      {
        label: 'Thời gian tạo',
        type: 'date',
        placeholder: 'Thời gian tạo',
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
        label: 'Thời gian kết thúc',
        type: 'date',
        placeholder: 'Thời gian kết thúc',
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
      {
        label: 'Tình trạng',
        options: [
          {
            label: 'Tình trạng',
            value: '',
          },
          {
            label: 'Đang sử dụng',
            value: Status.ACTIVE,
          },
          {
            label: 'Ngưng sử dụng',
            value: Status.INACTIVE,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            status: value,
            fields: textSearching
              ? [
                  'realEstate.generalInfo.propertyCode',
                  'realEstate.generalInfo.realEstateProject.name',
                  'realEstate.positionInfo.province',
                  'realEstate.positionInfo.district',
                  'realEstate.positionInfo.ward',
                  'realEstate.positionInfo.street',
                  'realEstate.positionInfo.apartmentNumber',
                  'realEstate.positionInfo.searchAddress ',
                  'createdBy.fullName',
                ]
              : [],
          });
        },
      },
    ];
  }, [dataPropertyType, filterSelect, textSearching]);

  const filterListInPopup = useMemo(() => {
    return [
      {
        label: 'Loại khách hàng',
        options: [
          {
            label: '--- Chọn loại BĐS ---',
            value: '',
            id: '',
          },
          ...dataPropertyType,
        ],
        handleSelected: (value: string) => {
          const sectorIdFilter = dataPropertyType.find(
            e => e.value === value,
          )?.id;
          setFilterSelect({
            ...filterSelect,
            sector: sectorIdFilter + '' || null,
          });
        },
      },
      {
        label: 'Thời gian tạo',
        type: 'date',
        placeholder: 'Thời gian tạo',
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
        label: 'Thời gian kết thúc',
        type: 'date',
        placeholder: 'Thời gian kết thúc',
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
  }, [dataPropertyType, filterSelect]);

  const header: TableHeaderProps[] = useMemo(() => {
    return [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 80,
      },
      {
        id: 'type',
        label: t(translations.common.address),
        width: 200,
        align: 'left',
      },
      {
        id: 'taxCode',
        label: t(translations.realEstate.realEstateType),
        width: 200,
        align: 'left',
      },
      {
        id: 'propertyCode',
        label: t(translations.realEstate.propertyCode),
        align: 'left',
        width: 200,
      },
      {
        id: 'projectName',
        label: t(translations.realEstate.nameProject),
        width: 200,
        align: 'left',
        hasSort: true,
      },
      {
        id: 'phone',
        label: t(translations.common.totalValueVnd),
        width: 200,
        align: 'left',
      },
      {
        id: 'time',
        label: t(translations.realEstate.transactionTime),
        width: 150,
        align: 'left',
      },
      {
        id: 'test',
        label: t(translations.common.creator),
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: t(translations.common.status),
        width: 200,
        align: 'left',
      },
      {
        id: 'userUuid',
        label: '',
        width: 50,
        align: 'left',
      },
    ];
  }, [t]);

  const headerInPopup: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 80,
      },
      {
        id: 'propertyCode',
        label: t(translations.realEstate.propertyCode),
        align: 'left',
        width: 200,
      },
      {
        id: 'projectName',
        label: t(translations.realEstate.nameProject),
        width: 200,
        align: 'left',
        hasSort: true,
      },
      {
        id: 'taxCode',
        label: t(translations.realEstate.realEstateType),
        width: 200,
        align: 'left',
      },
      {
        id: 'phone',
        label: t(translations.common.totalValueVnd),
        width: 200,
        align: 'left',
      },
      {
        id: 'type',
        label: t(translations.common.address),
        width: 200,
        align: 'left',
      },
      {
        id: 'time',
        label: t(translations.realEstate.transactionTime),
        width: 150,
        align: 'left',
      },
      {
        id: 'test',
        label: t(translations.common.creator),
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: t(translations.common.status),
        width: 200,
        align: 'left',
      },
    ],
    [t],
  );

  const renderItem = (item: RealEstateItem, index: number) => {
    const take = filter?.limit || 0;
    const page = filter?.page || 0;
    return [
      <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText
        text={item?.realEstate?.positionInfo?.searchAddress}
        line={1}
      />,
      <EllipsisText text={item?.realEstate?.sector?.name} line={2} />,
      <EllipsisText
        text={item?.realEstate?.generalInfo?.propertyCode}
        line={1}
      />,
      <EllipsisText
        text={item?.realEstate?.generalInfo?.realEstateProject?.name}
        line={2}
      />,
      <EllipsisText
        text={formatCurrency(item?.realEstate?.totalPrice)}
        line={1}
      />,
      <EllipsisText
        text={
          item?.realEstate?.generalInfo?.transactionTime
            ? moment(item?.realEstate?.generalInfo?.transactionTime).format(
                'DD/MM/YYYY',
              )
            : '-'
        }
        line={1}
      />,
      <EllipsisText
        text={
          item?.createdBy == null ? 'Quản trị viên' : item?.createdBy?.fullName
        }
        line={1}
      />,
      <RenderStatus isAsset status={item?.status} />,

      <div>
        {
          <ButtonMoreMenu
            width={i18n.language === 'en' ? 220 : 175}
            items={[
              {
                name: t(translations.common.view),
                itemComponent: Button,
                onClick: () => {
                  navigate(`/assets/real-estates/detail/${item.id}`);
                },
                icon: VIEW_ICON,
              },
              {
                name: t(translations.common.edit),
                itemComponent: Button,
                onClick: () => {
                  navigate(`/assets/real-estates/edit/${item.id}`);
                },
                icon: EDIT_ICON,
              },
              {
                name:
                  item?.status === Status.ACTIVE
                    ? t(translations.common.lock)
                    : t(translations.common.unlock),
                itemComponent: Button,
                onClick: () => {
                  handleOpenDialog();
                  if (item.status === Status.ACTIVE) {
                    setDialogType(Status.INACTIVE);
                    setRealEstateSelected(item.id);
                  } else {
                    setDialogType(Status.ACTIVE);
                    setRealEstateSelected(item.id);
                  }
                },
                icon: LOCk_ICON,
              },
            ]}
          />
        }
      </div>,
    ];
  };

  const renderItemInPopup = (item: RealEstateItem, index: number) => {
    const take = filter?.limit || 0;
    const page = filter?.page || 0;
    return [
      <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText
        text={item?.realEstate?.generalInfo?.propertyCode}
        line={1}
      />,
      <EllipsisText
        text={item?.realEstate?.generalInfo?.realEstateProject?.name}
        line={2}
      />,
      <EllipsisText text={item?.realEstate?.sector?.name} line={2} />,
      <EllipsisText
        text={formatCurrency(item?.realEstate?.totalPrice)}
        line={1}
      />,
      <EllipsisText
        text={item?.realEstate?.positionInfo?.searchAddress}
        line={1}
      />,
      <EllipsisText
        text={
          !!item?.realEstate?.generalInfo?.transactionTime
            ? moment(item?.realEstate?.generalInfo?.transactionTime).format(
                'DD/MM/YYYY',
              )
            : ''
        }
        line={1}
      />,
      <EllipsisText text="-" line={1} />,
      <RenderStatus status={item?.status} />,
    ];
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

  const onPageSizeChange = (take: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      take,
    });
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleSubmitDialog = () => {
    const payload = {
      id: realEstateSelected,
      status: dialogType,
    };
    dispatch(
      actions.updateStatusRealEstate(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                dialogType === Status.ACTIVE
                  ? t(translations.realEstate.unlockRealEstate)
                  : t(translations.realEstate.lockRealEstate),
              type: 'success',
            }),
          );
          dispatch(actions.fetchListRealEstates(filter));
          handleCloseDialog();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: t(translations.common.errorOccurred),
              type: 'error',
            }),
          );
        }
      }),
    );
  };
  return (
    <Paper
      sx={{
        width: '100%',
      }}
    >
      <FilterBar
        onChangeSearchInput={handleSearchInputChange}
        placeholder={t(translations.common.search)}
        isFilter
        filterList={hasCheckbox ? filterListInPopup : filterList}
        submitFilter={submitFilter}
      />
      <Table
        headers={hasCheckbox ? headerInPopup : header}
        onRequestSort={handleRequestSort}
        renderItem={hasCheckbox ? renderItemInPopup : renderItem}
        items={realEstateManager?.data}
        pageNumber={filter.page}
        totalElements={realEstateManager?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        hasCheckbox={hasCheckbox}
        onSelectCheckbox={onSelectCheckbox}
        listSelected={listSelected}
        typeCheckBox={typeCheckBox || TypeCheckBoxTable.CHECKBOX}
        setHeight={hasCheckbox ? '52vh' : ''}
        isLoading={isLoading}
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
              ? t(translations.realEstate.unlockRealEstateMessage)
              : t(translations.realEstate.lockRealEstateMessage)}
          </Typography>
        </ConfirmDialog>
      )}
    </Paper>
  );
}
