import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilterParams, Staff, TableHeaderProps } from 'types';
import { useOrgchartSlice } from '../../slice';
import { selectOrgchart } from '../../slice/selector';

interface Props {
  listOrgchartName?: string;
  setCountStaffOrg: any;
}

export default function TableStaffOrg(props: Props) {
  const { listOrgchartName, setCountStaffOrg } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { StaffOrgChart, isLoading } = useSelector(selectOrgchart);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
      orgChartId: id,
    };
  }, []);
  const fetchDataForPage = (params: FilterParams) => {
    dispatch(
      OrgchartActions.fetchListStaffOrgchart({ ...params, orgChartId: id }),
    );
  };
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'code',
        label: 'Mã nhân viên',
        align: 'left',
        width: 120,
      },
      {
        id: 'name',
        label: 'Tên nhân viên',
        align: 'left',
        width: 120,
      },
      {
        id: 'email',
        label: 'Địa chỉ Email',
        align: 'left',
        width: 80,
      },
      {
        id: 'phome',
        label: 'Số điện thoại',
        align: 'left',
        width: 120,
      },
      {
        id: 'position',
        label: 'Chức vụ',
        align: 'left',
        width: 120,
      },
      {
        id: 'parentOrgChart',
        label: 'Đơn vị chủ quản',
        align: 'left',
        width: 200,
      },
    ],
    [],
  );

  const convertListOrgchartName = (input: string) => {
    const parts = input.split(';').map((part: string) => part.trim());
    return parts.join(' - ');
  };

  useEffect(() => {
    setCountStaffOrg(StaffOrgChart?.total)
  }, [StaffOrgChart])

  const renderItem = (item: Staff, index: number) => {
    return [
      <EllipsisText
        text={`${item.code ?? '-'}`}
        line={1}
        color={'#007AFF'}
        handleClick={() => navigate(`/staff/${item?.id}`)}
      />,
      <EllipsisText text={`${item.fullName ?? '-'}`} line={1} />,
      <EllipsisText text={`${item.email ?? '-'}`} line={1} />,
      <EllipsisText text={`${item.phone ?? '-'}`} line={1} />,
      <EllipsisText text={`${item.position ?? '-'}`} line={1} />,
      <EllipsisText
        text={`${
          convertListOrgchartName(listOrgchartName || '').slice(0, -3) ?? '-'
        }`}
        line={1}
      />,
    ];
  };

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page: page,
    });
  };

  const onPageSizeChange = (take: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      take,
    });
  };

  const onSelectRow = (rowData: any) => {};

  return (
    <>
      <Table
        headers={header}
        renderItem={renderItem}
        onClickRow={onSelectRow}
        items={StaffOrgChart?.data}
        pageNumber={filter.page}
        totalElements={StaffOrgChart?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
    </>
  );
}
