import {
  Box,
  Grid,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { EllipsisText } from 'app/components/EllipsisText';
import MenuPopover from 'app/components/MenuPopover';
import PasswordDialog from 'app/components/PasswordDialog';
import RenderStatus from 'app/components/RenderStatus';
import { snackbarActions } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useSettingSlice } from 'app/pages/Settings/slice';
import { selectSetting } from 'app/pages/Settings/slice/selector';
import path from 'app/routes/path';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import KEY_ICON from 'assets/background/key-icon.svg';
import { translations } from 'locales/translations';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import document from 'services/api/document';
import palette from 'styles/theme/palette';
import { FilterParams, TableHeaderProps } from 'types';
import { Status, TableType } from 'types/Enum';
import { PermissionKeyEnum } from 'types/Permission';
import { StaffItem } from 'types/Staff';
import { Options } from 'types/User';
import { checkPermissionExist, renderPosition } from 'utils/helpers';

import FilterBar from 'app/components/Filterbar';
import { useStaffSlice } from '../../slice';
import { selectStaff } from '../../slice/selector';
import PopupShowOrgChart from './popupOrgChart';

export default function ListStaff() {
  const { actions } = useStaffSlice();
  const theme = useTheme();
  const userInfo = useProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { actions: SettingActions } = useSettingSlice();
  const anchorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { staffManagement, isLoading } = useSelector(selectStaff);
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isForgetPassDialog, setIsForgetPassDialog] = useState<boolean>(false);
  const [isShowOrgChart, setIsShowOrgChart] = useState<boolean>(false);
  const [idOrgchart, setIdOrgchart] = useState<string>('');
  const { rolesManager } = useSelector(selectSetting);

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);

  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [staffChangePass, setStaffChangePass] = useState<StaffItem>();
  const [unitOptions, setUnitOptions] = useState<Options[]>([
    { label: 'Chọn đơn vị', value: '' },
  ]);
  const [rolesOptions, setRolesOptions] = useState<Options[]>([
    { label: 'Chọn vai trò', value: '' },
  ]);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'code',
        label: 'Mã nhân viên',
        align: 'center',
        width: 130,
      },
      {
        id: 'name',
        label: 'Tên nhân viên',
        align: 'left',
        width: 180,
      },
      {
        id: 'phone',
        label: 'Điện thoại',
        width: 130,
        align: 'left',
      },
      {
        id: 'email',
        label: 'Email',
        width: 200,
        align: 'left',
      },
      {
        id: 'unit',
        label: 'Đơn vị làm việc',
        width: 180,
        align: 'left',
      },
      {
        id: 'position',
        label: 'Cấp bậc',
        width: 130,
        align: 'left',
      },
      {
        id: 'from',
        label: 'Chức danh',
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Trạng thái',
        width: 110,
        align: 'left',
      },
      {
        id: 'userUuid',
        label: '',
        width: 130,
        align: 'left',
      },
    ],
    [t],
  );

  useEffect(() => {
    const orgchart: Options[] = [{ label: 'Chọn đơn vị', value: '' }];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setUnitOptions(orgchart);
  }, [OrgchartManagement?.data]);

  useEffect(() => {
    const roles: Options[] = [{ label: 'Chọn chức danh', value: '' }];
    rolesManager?.data.forEach((element, index) => {
      if (element.name !== process.env.REACT_APP_SYS_ROLE) {
        roles.push({
          label: element?.name,
          value: element?.name,
        });
      }
    });
    setRolesOptions(roles);
  }, [rolesManager?.data]);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListStaff(params));
    dispatch(SettingActions.fetchListRole(params));
    fetchListOrgchart();
  };

  const fetchListOrgchart = () => {
    dispatch(OrgchartActions.fetchListOrgchart());
  };

  const handleRequestSort = (event: any, property: string) => {};

  const hanldeAddnew = () => navigate(path.createStaff);

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

  const handleCloseShowOrgchart = () => {
    setIsShowOrgChart(false);
  };

  const renderItem = (item: StaffItem, index: number) => {
    return [
      <EllipsisText
        text={item.code}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
          handleClickRow(item);
        }}
      />,
      <EllipsisText text={item.fullName} line={2} />,
      <EllipsisText text={item.phone} line={1} />,
      <EllipsisText text={item.email} line={1} />,
      <EllipsisText
        text={item.orgChart?.name}
        line={1}
        color={item.orgChart ? '#007AFF' : ''}
        handleClick={() => {
          if (item?.orgChart) {
            setIsShowOrgChart(true);
            setIdOrgchart(item?.orgChart?.id);

            // setIdOrgchart(
            //   item?.orgChart?.xPath?.split(',')[
            //     item?.orgChart?.xPath?.split(',').length - 1
            //   ],
            // );
          }
        }}
      />,
      <EllipsisText text={renderPosition(item?.staffLevel)} line={1} />,
      <EllipsisText text={item.position} line={1} />,
      <RenderStatus
        status={item.staffStatus ? Status.ACTIVE : Status.INACTIVE}
      />,
      <div style={{ display: 'flex' }}>
        <IconButton onClick={() => handleClickRow(item)}>
          <img src={EDIT_ICON} alt="icon edit" />
        </IconButton>
        {checkPermissionExist(
          PermissionKeyEnum.STAFF_RESETPASSWORD,
          userInfo,
        ) && (
          <IconButton
            sx={{ ml: 2 }}
            onClick={() => handleOpenChangePassDialog(item)}
          >
            <img src={KEY_ICON} alt="key icon" style={{ height: 16 }} />
          </IconButton>
        )}
      </div>,
    ];
  };

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

  const filterList = useMemo(() => {
    return [
      {
        label: 'Đơn vị làm việc',
        options: unitOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelect({
            ...filterSelect,
            orgChartId: value,
          });
        },
      },
      {
        label: 'Chức danh',
        options: rolesOptions,
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            position: value,
          });
        },
      },
    ];
  }, [filterSelect, unitOptions, rolesOptions, textSearching]);

  const handleClickRow = (item: StaffItem) => {
    navigate(`/staff/${item?.id}`);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const documentRes = await document.uploadFileStaff(e.target.files[0]);
      if (documentRes) {
        fetchDataForPage(filter);
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload file excel thành công',
            type: 'success',
          }),
        );
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

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenChangePassDialog = (item: StaffItem) => {
    setIsForgetPassDialog(true);
    setStaffChangePass(item);
  };

  const handleCloseChangePassDialog = () => {
    setIsForgetPassDialog(false);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid
        xs={12}
        sm={12}
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
      >
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
            {'Danh sách nhân viên'}
          </Typography>
        </Box>
        <Box display={'flex'}>
          <CustomButton
            title={'Upload file Excel'}
            isHide={
              !checkPermissionExist(PermissionKeyEnum.STAFF_CREATE, userInfo)
            }
            isIcon
            buttonMode={'excel'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
              mb: '20px',
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
              isHide={
                !checkPermissionExist(PermissionKeyEnum.STAFF_CREATE, userInfo)
              }
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
                    to={'/static/template/template_Staff.xlsx'}
                    download="Template_Staff"
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
            title={'Thêm mới'}
            isIcon
            isHide={
              !checkPermissionExist(PermissionKeyEnum.STAFF_CREATE, userInfo)
            }
            buttonMode="create"
            sxProps={{
              background: palette.primary.button,
              color: palette.common.white,
              borderRadius: '8px',
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
            }}
            handleClick={hanldeAddnew}
          />
        </Box>
      </Grid>
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
        items={staffManagement?.data}
        pageNumber={filter.page}
        totalElements={staffManagement?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
      {isForgetPassDialog && (
        <PasswordDialog
          staff={staffChangePass}
          isOpen={isForgetPassDialog}
          handleClose={handleCloseChangePassDialog}
        />
      )}
      {isShowOrgChart && (
        <PopupShowOrgChart
          isOpen={isShowOrgChart}
          handleClose={handleCloseShowOrgchart}
          // idShowOrgChart={idOrgchart}
          idShowOrgChart={idOrgchart}
        />
      )}
    </Paper>
  );
}
