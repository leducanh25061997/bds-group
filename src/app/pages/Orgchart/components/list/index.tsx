import {
  Box,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { EllipsisText } from 'app/components/EllipsisText';
import RenderStatus from 'app/components/RenderStatus';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import { translations } from 'locales/translations';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FilterParams, TableHeaderProps } from 'types';
import { Status, TableType } from 'types/Enum';
import { OrgchartItem } from 'types/Orgchart';

import dayjs from 'dayjs';

import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import document from 'services/api/document';
import palette from 'styles/theme/palette';

import MenuPopover from 'app/components/MenuPopover';

import { selectOrgchart } from '../../slice/selector';

import { useOrgchartSlice } from '../../slice';
import FilterBar from '../Filterbar';
import { Options } from 'types/User';

export default function ListOrgchart() {
  const { t } = useTranslation();
  const { actions } = useOrgchartSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const theme = useTheme();
  const { OrgchartManagementFilter, OrgchartManagement, isLoading } =
    useSelector(selectOrgchart);
  const initialFilter = useMemo(() => {
    return {
      status: true,
    };
  }, []);
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [unitOptions, setUnitOptions] = useState<Options[]>([
    { label: 'Chọn đơn vị', value: '' },
  ]);
  const [textSearching, setTextSearching] = useState<string>('');
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });
  const dispatch = useDispatch();

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListOrgchartFilter(params));
    dispatch(actions.fetchListOrgchart());
  };

  useEffect(() => {
    const orgchart: Options[] = [{ label: 'Chọn đơn vị', value: '' }];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        label: item?.name,
        value: item?.name,
      });
    });
    setUnitOptions(orgchart);
  }, [OrgchartManagement?.data]);

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const filterList = useMemo(() => {
    return [
      {
        label: 'Đơn vị/ Công ty',
        options: unitOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelect({
            ...filterSelect,
            nameOrgchart: value,
          });
        },
      },
      {
        label: 'Trạng thái',
        options: [
          {
            label: 'Kích hoạt',
            value: Status.ACTIVE,
          },
          {
            label: 'Vô hiệu',
            value: Status.INACTIVE,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            status: value === Status.ACTIVE,
          });
        },
      },
    ];
  }, [unitOptions, filterSelect, textSearching]);

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'code',
        label: t(translations.Orgchart.orgchartCode),
        align: 'left',
        width: 120,
      },
      {
        id: 'name',
        label: t(translations.Orgchart.orgchartName),
        align: 'left',
        width: 180,
      },
      {
        id: 'manager',
        label: t(translations.Orgchart.manager),
        width: 180,
        align: 'left',
      },
      {
        id: 'count',
        label: t(translations.Orgchart.emloyeeCount),
        width: 150,
        align: 'center',
        hasSort: true,
      },
      {
        id: 'createDate',
        label: t(translations.Orgchart.createDate),
        width: 120,
        align: 'left',
      },
      {
        id: 'updatedate',
        label: t(translations.Orgchart.updatedate),
        width: 120,
        align: 'left',
      },
      {
        id: 'status',
        label: t(translations.Orgchart.status),
        width: 100,
        align: 'left',
      },
      {
        id: 'option',
        label: '',
        width: 80,
        align: 'left',
      },
    ],
    [t],
  );

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
    });
  };

  const onPageSizeChange = (take: number) => {
    onFilterToQueryString({
      ...filter,
    });
  };

  const renderItem = (item: OrgchartItem, index: number) => {
    return [
      <EllipsisText text={`${item.code ?? '-'}`} line={1} color={'#007AFF'} />,
      <EllipsisText text={`${item.name ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.manager?.fullName ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.countStaff ?? '-'}`} line={1} />,
      <EllipsisText
        text={`${dayjs(item.createdAt).format('DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText
        text={`${dayjs(item.updatedAt).format('DD/MM/YYYY')}`}
        line={1}
      />,
      <RenderStatus status={item.status ? Status.ACTIVE : Status.INACTIVE} />,
      <div style={{ display: 'flex' }}>
        <IconButton onClick={() => handleEdit(item.id)}>
          <img src={EDIT_ICON} alt="icon edit" />
        </IconButton>
      </div>,
    ];
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const redirectToCreatePage = () => navigate(path.createOrgchart);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const documentRes = await document.uploadFileOrgchart(e.target.files[0]);
      if (documentRes) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload file excel thành công',
            type: 'success',
          }),
        );
        fetchDataForPage(initialFilter);
      } else {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload file excel không thành công',
            type: 'error',
          }),
        );
      }
    }
  };

  const onSelectRow = (rowData: any) => {
    handleEdit(rowData.id);
  };

  const handleEdit = (id: any) => {
    navigate(`/orgchart/edit/${id}`);
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
          mt: 1,
          mb: 2,
        }}
      >
        <Typography
          fontSize={'20px'}
          fontWeight={'700'}
          color={palette.primary.text}
        >
          {t(translations.sidebar.orchartList)}
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <CustomButton
            title={'Upload file Excel'}
            isIcon
            buttonMode={'excel'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
            }}
            handleClick={handleUploadClick}
          />
          <input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <>
            <CustomButton
              title={'Tải'}
              isIcon
              propRef={anchorRef}
              buttonMode={'download'}
              sxProps={{
                background: palette.primary.button,
                borderRadius: 1,
                m: '0px 15px 20px 15px',
              }}
              handleClick={handleOpenDialog}
            />
            <MenuPopover
              open={isOpenDialog}
              onClose={handleCloseDialog}
              anchorEl={anchorRef.current}
              sx={{ width: 'max-content' }}
            >
              <List>
                <ListItemButton
                  sx={{
                    ':hover': {
                      backgroundColor: '#FDEAF4',
                    },
                    m: '6px',
                    borderRadius: '4px',
                  }}
                  onClick={handleOpenDialog}
                >
                  <Link
                    style={{ color: 'transparent' }}
                    to={'/static/template/Template_Orgchart.xlsx'}
                    download="Template_Orgchart"
                    target="_blank"
                  >
                    <Box display={'flex'} alignItems={'center'}>
                      <Typography
                        ml={1}
                        fontSize={'14px'}
                        fontWeight={400}
                        color={theme.palette.common.black}
                      >
                        Tải template
                      </Typography>
                    </Box>
                  </Link>
                </ListItemButton>
              </List>
            </MenuPopover>
          </>
          <CustomButton
            title={t(translations.common.addNew)}
            isIcon
            buttonMode={'create'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
            }}
            handleClick={redirectToCreatePage}
          />
        </Box>
      </Box>
      <FilterBar
        onChangeSearchInput={handleSearchInputChange}
        placeholder={t(translations.common.search)}
        isFilter
        filterList={filterList}
        submitFilter={submitFilter}
      />
      <Table
        headers={header}
        renderItem={renderItem}
        onClickRow={onSelectRow}
        items={OrgchartManagementFilter?.data}
        pageNumber={filter.page}
        totalElements={OrgchartManagementFilter?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
    </Paper>
  );
}
