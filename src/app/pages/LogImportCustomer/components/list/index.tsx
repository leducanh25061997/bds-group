import {
  Box, IconButton,
  Paper,
  Typography
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { translations } from 'locales/translations';
import { get } from 'lodash';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import { FilterParams, TableHeaderProps } from 'types';
import {useLogImportCustomerSlice} from "../../slice";
import {selectCustomerLogImport} from "../../slice/selector";
import {DataLogItem} from "../../slice/types";
import document from 'services/api/document';
import {useNavigate} from "react-router-dom";
import {useSnackbarSlice} from "../../../../components/Snackbar/slice";

export default function ListCustomerPro() {
  const { actions } = useLogImportCustomerSlice();

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataLog } = useSelector(selectCustomerLogImport);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const { actions: snackbarActions } = useSnackbarSlice();
  const [isLoading, setIsLoading] = useState(false);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'STT',
        align: 'left',
        width: 30,
      },
      {
        id: 'createDate',
        label: 'Ngày tạo',
        align: 'left',
        width: 130,
      },
      {
        id: 'path',
        label: 'Tên file',
        width: 170,
        align: 'left',
      },
      {
        id: 'errors',
        label: 'Lỗi',
        width: 200,
        align: 'left',
      },
    ],
    [t],
  );

  // useEffect(() => {
  //   return () => {
  //     dispatch(actions.fetchListLogImportCustomer({
  //       page: 1,
  //       limit: 100
  //     }),);
  //   };
  // }, []);


  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListLogImportCustomer(params));
  };

  const onPageChange = (page: number) => {
    setFilterSelect({ ...filterSelect, page });
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    setFilterSelect({ ...filterSelect, page: 1, limit });
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };
  const handleClickRow = async (path: string) => {
    let url = process.env.REACT_APP_API_URL + `/${path}`;
    window.open(url);
  };

  const renderItem = (item: DataLogItem, index: number) => {
    const path = item?.path
    let file_name
    if(path) {
      const file_arr = path.split('/')
      file_name = file_arr.pop()
    }
    return [
      <EllipsisText text={`${index + 1}`} line={1}/>,
      <EllipsisText text={`${dayjs(item.createdAt).format('HH:mm - DD/MM/YYYY')}`} line={1}/>,
      <EllipsisText width={'350px'} text={`${file_name ?? '-'}`} line={2} color={'#007AFF'} handleClick={() => handleClickRow(path)}/>,
      <EllipsisText text={`${item.errors ?? '-'}`} line={4} />,
    ];
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <Typography
          fontSize={'20px'}
          fontWeight={'700'}
          color={palette.primary.text}
        >
          {t(translations.sidebar.importCustomerLogs)}
        </Typography>
      </Box>

      <Table
        headers={header}
        renderItem={renderItem}
        items={dataLog?.data}
        pageNumber={filter.page}
        totalElements={dataLog?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
    </Paper>
  );
}
