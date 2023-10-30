import { Paper, useTheme, Button, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import ConfirmDialog from 'app/components/ConfirmDialog';
import RenderStatus from 'app/components/RenderStatus';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import { translations } from 'locales/translations';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EnumObject, FilterParams, TableHeaderProps } from 'types';
import VIEW_ICON from 'assets/background/view-detail-icon.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import LOCk_ICON from 'assets/background/lock-icon.svg';
import ButtonMoreMenu from 'app/components/ButtonMoreMenu';
import moment from 'moment';
import { Status, TitleEnum } from 'types/Enum';
import { selectAuth } from 'app/pages/Auth/slice/selectors';

import FilterBar from '../FilterBar';
import { useCategorySlice } from '../../slice';
import { CategoryItem } from '../../slice/types';
import { selectCategory } from '../../slice/selector';

const ListCategory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { categoriesList, isLoading } = useSelector(selectCategory);
  const { enumList } = useSelector(selectAuth);
  const { actions } = useCategorySlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      sortByName: 'false',
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [dialogType, setDialogType] = useState<Status>(Status.INACTIVE);
  const [userSelected, setUserSelected] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const categoryType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.CategoryType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 70,
      },
      {
        id: 'nameCategory',
        label: t(translations.listManagement.nameCategory),
        align: 'left',
        width: 250,
        hasSort: true,
      },
      {
        id: 'creatAt',
        label: t(translations.listManagement.createAt),
        width: 150,
        align: 'left',
      },
      {
        id: 'typeCategory',
        label: t(translations.listManagement.typeCategory),
        width: 150,
        align: 'left',
      },
      {
        id: 'status',
        label: t(translations.listManagement.status),
        width: 150,
        align: 'left',
      },
      {
        id: '',
        label: '',
        align: 'left',
        width: 70,
      },
    ],
    [t],
  );

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      let tempParams = { ...params };
      if (!!params?.typeCategory) {
        tempParams = { ...tempParams, type: params?.typeCategory };
        delete tempParams?.typeCategory;
      }
      fetchDataForPage(tempParams);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.getListCategories(params));
  };

  const handleRequestSort = (event: any, property: string) => {
    // const newSort = getOrder({ filter, property });
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

  const filterList = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.CategoryType,
    )?.ctlotusEnumValues;
    const dataFilter: { label: string; value: string }[] = [];
    options?.forEach(item => {
      dataFilter.push({
        label: item.description || '',
        value: item.name || '',
      });
    });
    return [
      {
        label: 'Loại danh mục',
        options: [
          {
            label: 'Loại danh mục',
            value: '',
          },
          ...dataFilter,
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            typeCategory: value,
            fields: textSearching ? ['name', 'description'] : [],
          });
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
            label: 'Đang hoạt động',
            value: 'true',
          },
          {
            label: 'Ngừng hoạt động',
            value: 'false',
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            status: value,
            fields: textSearching ? ['name', 'description'] : [],
          });
        },
      },
    ];
  }, [enumList, filterSelect, textSearching]);

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const renderItem = (item: CategoryItem, index: number) => {
    const take = filter?.limit || 0;
    const page = filter?.page || 0;
    return [
      <EllipsisText text={index + 1 + take * page - take} line={1} />,
      <EllipsisText text={item.name} line={1} />,
      <EllipsisText
        text={moment(item.createdAt).format('DD/MM/YYYY')}
        line={1}
      />,
      <EllipsisText
        text={
          categoryType?.find(category => category.name === item.type)
            ?.description || ''
        }
        line={1}
      />,
      <RenderStatus status={item.status ? Status.ACTIVE : Status.INACTIVE} />,
      <div>
        {
          <ButtonMoreMenu
            width={i18n.language === 'en' ? 220 : 175}
            items={[
              {
                name: t(translations.common.view),
                itemComponent: Button,
                onClick: () => {
                  navigate(`/category/detail/${item.id}`);
                },
                icon: VIEW_ICON,
              },
              {
                name: t(translations.common.edit),
                itemComponent: Button,
                onClick: () => {
                  navigate(`/category/edit/${item.id}`);
                },
                icon: EDIT_ICON,
              },
              {
                name: item.status
                  ? t(translations.common.lock)
                  : t(translations.common.unlock),
                itemComponent: Button,
                onClick: () => {
                  handleOpenDialog();
                  setDialogType(item.status ? Status.INACTIVE : Status.ACTIVE);
                  setUserSelected(item.id || '');
                },
                icon: LOCk_ICON,
              },
            ]}
          />
        }
      </div>,
    ];
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
    onFilterToQueryString({
      ...filter,
      search: keyword,
      page: 1,
      fields: keyword ? ['name', 'description'] : [],
    });
  };

  const handleSubmitDialog = () => {
    if (userSelected) {
      dispatch(
        actions.updateStatusCategory(
          { id: userSelected },
          (responseData?: any) => {
            if (responseData?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    dialogType === Status.ACTIVE
                      ? t(translations.category.successfullyUnlock)
                      : t(translations.category.successfullyLock),
                  type: 'success',
                }),
              );
              dispatch(actions.getListCategories(filter));
              handleCloseDialog();
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    dialogType === Status.ACTIVE
                      ? t(translations.category.errorUnlock)
                      : t(translations.category.errorLock),
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
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
        isLoading={isLoading}
        headers={header}
        onRequestSort={handleRequestSort}
        renderItem={renderItem}
        items={categoriesList?.data}
        pageNumber={filter.page}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
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
              ? t(translations.category.confirmUnlock)
              : t(translations.category.confirmLock)}
          </Typography>
        </ConfirmDialog>
      )}
    </Paper>
  );
};

export default ListCategory;
