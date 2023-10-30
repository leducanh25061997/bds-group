import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import COPY_ICON from 'assets/background/copy-icon.svg';
import CLOSE_ICON from 'assets/background/delete-icon-pink.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams, TableHeaderProps } from 'types';
import { ProcessType } from 'types/Process';
import { formatDateTime3 } from 'utils/helpers';
import { WorkflowType } from 'types/Enum';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import path from 'app/routes/path';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { selectProcessManagement } from '../slice/selector';
import { useProcessManagementSlice } from '../slice';
import { DialogProcess } from '../dialog';
import { Card } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function ListProcess() {
  const [isOpenDialogCopy, setIsOpenDialogCopy] = useState(false);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [typeDetail, setTypeDetail] = useState<string>();
  const [nameDetail, setNameDetail] = useState<string>();
  const [idProcess, setIdProcess] = useState<string>();
  const { actions } = useProcessManagementSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { processManagement, isLoading } = useSelector(selectProcessManagement);

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      checkStatus: true,
    };
  }, []);

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListProcess(params));
  };

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

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

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 70,
      },
      {
        id: 'id_process',
        label: 'Mã quy trình',
        align: 'left',
        width: 120,
      },
      {
        id: 'process_type',
        label: 'Loại quy trình',
        align: 'left',
        width: 200,
      },
      {
        id: 'name_process',
        label: 'Tên quy trình',
        align: 'left',
        width: 200,
      },
      {
        id: 'created_at',
        label: 'Ngày tạo',
        align: 'left',
        width: 150,
      },
      {
        id: 'updated_at',
        label: 'Ngày cập nhật',
        align: 'left',
        width: 150,
      },
      {
        id: 'option',
        label: '',
        width: 120,
        align: 'right',
      },
    ],
    [],
  );

  const TabPanel = (props: TabPanelProps) => {
    const { children, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Card sx={{ p: 2, borderRadius: '20px' }}>{children}</Card>
      </div>
    );
  };

  const handleCreate = () => {};

  const handleDelete = () => {
    const payload = {
      id: idProcess || '',
    };
    dispatch(
      actions.deleteWorkFlow(payload, (err?: any) => {
        if (err.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đã xóa quy trình thành công',
              type: 'success',
            }),
          );
          dispatch(actions.fetchListProcess(filter));
          setIsOpenDialogDelete(false);
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                err.response.data.message || 'Xóa quy trình không thành công',
              type: 'error',
            }),
          );
          setIsOpenDialogDelete(false);
        }
      }),
    );
  };

  const renderItem = (item: ProcessType, index: number) => {
    return [
      <EllipsisText text={`${index + 1}`} line={1} />,
      <EllipsisText text={`${item.code}`} color={'#007AFF'} line={1} />,
      <EllipsisText text={`${get(WorkflowType, item.type)}`} line={1} />,
      <EllipsisText text={`${item.name}`} line={1} />,
      <EllipsisText text={`${formatDateTime3(item.createdAt)}`} line={1} />,
      <EllipsisText text={`${formatDateTime3(item.updatedAt)}`} line={1} />,
      <div
        style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <IconButton
          sx={{ ml: '8px' }}
          onClick={e => {
            e.stopPropagation();
            navigate(`/process-management/edit/${item.id}`);
          }}
        >
          <Tooltip title="Chỉnh sửa">
            <img alt="edit icon" src={EDIT_ICON} />
          </Tooltip>
        </IconButton>
        <IconButton
          sx={{ ml: '8px' }}
          onClick={e => {
            e.stopPropagation();
            setIsOpenDialogDelete(true);
            setIdProcess(item.id);
          }}
        >
          <Tooltip title="Xóa">
            <img alt="delete icon" src={CLOSE_ICON} />
          </Tooltip>
        </IconButton>
        <IconButton
          sx={{ ml: '8px' }}
          onClick={e => {
            e.stopPropagation();
            setIsOpenDialogCopy(true);
            setTypeDetail(item.type);
            setNameDetail(item.name);
            setIdProcess(item.id);
          }}
        >
          <Tooltip title="Nhân bản">
            <img alt="copy icon" src={COPY_ICON} />
          </Tooltip>
        </IconButton>
      </div>,
    ];
  };

  const onSelectRow = (rowData: any) => {
    navigate(`/process-management/edit/${rowData.id}`);
  };

  return (
    <>
      <TabPanel value={0} index={0}>
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={processManagement?.data}
          pageNumber={filter.page}
          totalElements={processManagement?.total}
          sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          dataType={'Process'}
          onSelectRow={onSelectRow}
        />
      </TabPanel>
      <DialogProcess
        actionName="Nhân bản"
        description="Để nhân bản @ này, vui lòng nhập đầy đủ các thông tin liên quan dưới đây:"
        isOpenDialog={isOpenDialogCopy}
        title="Nhân bản quy trình"
        setIsOpenDialog={setIsOpenDialogCopy}
        handleSubmit={handleCreate}
        type={typeDetail}
        nameDetail={nameDetail}
        idProcess={idProcess}
      />
      <DialogProcess
        actionName="Xóa"
        description="Bạn chắc chắn muốn xóa quy trình"
        isOpenDialog={isOpenDialogDelete}
        title="Xóa quy trình"
        setIsOpenDialog={setIsOpenDialogDelete}
        handleSubmit={handleDelete}
        isDelete
      />
    </>
  );
}
