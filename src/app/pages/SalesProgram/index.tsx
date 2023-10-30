import { Box, IconButton, Tooltip } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import Toogle from 'app/components/Toogle';
import { useFilter, useProfile } from 'app/hooks';
import CLOSE_ICON from 'assets/background/delete-icon-pink.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import CHECKED_ICON from 'assets/background/checkgreen_icon.svg';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilterParams, TableHeaderProps } from 'types';
import { SalesProgramEnum, SalesProgramType } from 'types/Enum';
import { checkPermissionExist, formatDateTime3 } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import { DeleteSalesProgram } from './delete';
import { useSalesProgramSlice } from './slice';
import { selectSalesProgram } from './slice/selectors';
import {
  PayloadActionPriceSalesProgram,
  PayloadUpdateStatusSalesProgram,
  SalesProgramItem,
} from './slice/types';

export function SalesProgram() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { salesProgramManagement, isLoading } = useSelector(selectSalesProgram);
  const { actions } = useSalesProgramSlice();
  const [isOpen, setIsOpen] = useState(false);
  const [salesProgram, setSalesProgram] = useState<SalesProgramItem>();
  const [idSalesProgram, setIdSalesProgram] = useState<string>();
  const { actions: snackbarActions } = useSnackbarSlice();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListSalesProgram({ ...params, projectID: id }));
  };
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const header: TableHeaderProps[] = useMemo(
    () =>
      canEdit
        ? [
            {
              id: 'stt',
              label: 'STT',
              align: 'left',
              width: 80,
            },
            {
              id: 'id_program',
              label: 'Mã chương trình',
              align: 'left',
              width: 120,
            },
            {
              id: 'name_program',
              label: 'Tên chương trình',
              width: 180,
              align: 'left',
            },
            {
              id: 'product_count',
              label: 'Số sản phẩm',
              width: 120,
              align: 'center',
            },
            {
              id: 'created_at',
              label: 'Ngày tạo',
              width: 180,
              align: 'left',
            },
            {
              id: 'updated_at',
              label: 'Ngày cập nhật',
              width: 180,
              align: 'left',
            },
            {
              id: 'status',
              label: 'Trạng  thái',
              width: 120,
              align: 'center',
            },
            {
              id: 'isDefault',
              label: 'CT mặc định',
              width: 120,
              align: 'center',
            },
            {
              id: 'showPrice',
              label: 'Ẩn/Hiện giá',
              width: 50,
              align: 'right',
            },
            {
              id: '',
              label: '',
              width: 50,
              align: 'right',
            },
          ]
        : [
            {
              id: 'stt',
              label: 'STT',
              align: 'left',
              width: 80,
            },
            {
              id: 'id_program',
              label: 'Mã chương trình',
              align: 'left',
              width: 120,
            },
            {
              id: 'name_program',
              label: 'Tên chương trình',
              width: 180,
              align: 'left',
            },
            {
              id: 'product_count',
              label: 'Số sản phẩm',
              width: 120,
              align: 'center',
            },
            {
              id: 'created_at',
              label: 'Ngày tạo',
              width: 180,
              align: 'left',
            },
            {
              id: 'updated_at',
              label: 'Ngày cập nhật',
              width: 180,
              align: 'left',
            },
            {
              id: 'status',
              label: 'Trạng  thái',
              width: 120,
              align: 'center',
            },
            {
              id: 'isDefault',
              label: 'CT mặc định',
              width: 120,
              align: 'center',
            },
            {
              id: 'showPrice',
              label: 'Ẩn/Hiện giá',
              width: 50,
              align: 'right',
            },
          ],
    [canEdit],
  );

  const handleCheckBox = (item: SalesProgramItem) => {
    const requestPayload: PayloadActionPriceSalesProgram = {
      id: item.id,
      isHiddenPrice: !item.isHiddenPrice,
    };
    dispatch(
      actions.actionPriceSalesProgram(requestPayload, (res?: any) => {
        if (res) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật trạng thái giá thành công',
              type: 'success',
            }),
          );
          dispatch(actions.fetchListSalesProgram({ ...filter, projectID: id }));
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật trạng thái giá không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const renderItem = (item: SalesProgramItem, index: number) => {
    return canEdit
      ? [
          <EllipsisText text={index + 1} line={1} />,
          <EllipsisText
            text={item.code}
            line={1}
            color={'#007AFF'}
            handleClick={event => {
              event.stopPropagation();
              handleSelectRow(item);
            }}
          />,
          <EllipsisText text={item.name} line={1} />,
          <EllipsisText text={item.productNumber.toString()} line={1} />,
          <EllipsisText
            text={formatDateTime3(item.createdAt) as string}
            line={1}
          />,
          <EllipsisText
            text={formatDateTime3(item.updatedAt) as string}
            line={1}
          />,
          <EllipsisText
            text={get(SalesProgramType, item.status)}
            color={
              get(SalesProgramType, item.status) === SalesProgramType.ENABLED
                ? '#2FB350'
                : '#E42B2C'
            }
            line={1}
          />,
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item?.isDefault ? (
              <img src={CHECKED_ICON} />
            ) : (
              <EllipsisText text={'--'} line={1} />
            )}
          </div>,
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Toogle
              selected={item.isHiddenPrice}
              onChange={() => handleCheckBox(item)}
              noText
            />
          </div>,
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <IconButton
              sx={{ ml: 1 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                navigate(
                  `/project/project-setting/${id}/sales-program/edit/${item.id}`,
                );
              }}
            >
              <Tooltip title="Chỉnh sửa">
                <img alt="edit icon" src={EDIT_ICON} />
              </Tooltip>
            </IconButton>
            {item.productNumber === 0 ? (
              <IconButton
                sx={{ ml: 1 }}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  setIsOpen(true);
                  setSalesProgram(item);
                  setIdSalesProgram(item.id);
                }}
              >
                <Tooltip title="Xóa">
                  <img alt="delete icon" src={CLOSE_ICON} />
                </Tooltip>
              </IconButton>
            ) : (
              <Box sx={{ ml: 1, width: '30px' }}></Box>
            )}
          </div>,
        ]
      : [
          <EllipsisText text={index + 1} line={1} />,
          <EllipsisText
            text={item.code}
            line={1}
            color={'#007AFF'}
            handleClick={event => {
              event.stopPropagation();
              handleSelectRow(item);
            }}
          />,
          <EllipsisText text={item.name} line={1} />,
          <EllipsisText text={item.productNumber.toString()} line={1} />,
          <EllipsisText
            text={formatDateTime3(item.createdAt) as string}
            line={1}
          />,
          <EllipsisText
            text={formatDateTime3(item.updatedAt) as string}
            line={1}
          />,
          <EllipsisText
            text={get(SalesProgramType, item.status)}
            color={
              get(SalesProgramType, item.status) === SalesProgramType.ENABLED
                ? '#2FB350'
                : '#E42B2C'
            }
            line={1}
          />,
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item?.isDefault ? (
              <img src={CHECKED_ICON} />
            ) : (
              <EllipsisText text={'--'} line={1} />
            )}
          </div>,
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Toogle selected={item.isHiddenPrice} onChange={() => {}} noText />
          </div>,
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

  const onPageSizeChange = (limit: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };

  const handleSelectRow = (data: any) => {
    navigate(`/project/project-setting/${id}/sales-program/edit/${data.id}`);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    const params = {
      id: idSalesProgram,
    };
    dispatch(
      actions.deleteSalesProgram(params, (res?: any) => {
        if (res) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Xóa chương trình bán hàng thành công',
              type: 'success',
            }),
          );
          dispatch(actions.fetchListSalesProgram({ ...filter, projectID: id }));
          setIsOpen(false);
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Xóa chương trình bán hàng thất bại',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <>
      <Table
        headers={header}
        onRequestSort={handleRequestSort}
        renderItem={renderItem}
        items={salesProgramManagement?.data}
        pageNumber={filter.page}
        totalElements={salesProgramManagement?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
        dataType={'SalesProgram'}
        // onSelectRow={handleSelectRow}
      />
      <DeleteSalesProgram
        isOpen={isOpen}
        handleClose={handleClose}
        salesProgram={salesProgram}
        handleDelete={handleDelete}
      />
    </>
  );
}
