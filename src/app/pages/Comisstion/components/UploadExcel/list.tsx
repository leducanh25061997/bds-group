import {
  Box,
  Collapse,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterParams, TableHeaderProps, TypeCheckBoxTable } from 'types';
import { TransactionStatusType } from 'types/Enum';
import { ComisstionItem, UPloadComisstionDetail } from 'types/User';
import {
  checkPermissionExist,
  formatCurrency,
  formatDateTime2,
  roundCustom,
} from 'utils/helpers';

import { PermissionKeyEnum } from 'types/Permission';

import { useComisstionSlice } from '../../slice';
import { selectComisstion } from '../../slice/selector';
import {
  PayloadUpdateStatusComisstion,
  UploadFileItem,
} from '../../slice/types';
import BoxStatus from '../BoxStatus';
interface Props {
  comissionUploadList: UploadFileItem[];
}
export default function ListUploadComisstions(props: Props) {
  const { comissionUploadList } = props;
  const { actions } = useComisstionSlice();
  const navigate = useNavigate();
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { ComisstionManagement, isLoading, ComisstionDetail } =
    useSelector(selectComisstion);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);
  const userInfo = useProfile();
  const [open, setOpen] = useState(-1);
  const [indexItem, setIndexItem] = useState(-1);
  const [listitemChangeStatus, setListitemChangeStatus] = useState<
    ComisstionItem[]
  >([]);
  const [listCheckbox, setListCheckbox] = useState<ComisstionItem[]>([]);
  const [countStatusPaid, setCountStatusPaid] = useState<number>(-1);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'code',
        label: 'Mã NVKD',
        align: 'left',
        width: 100,
      },
      {
        id: 'staffName',
        label: 'Tên nhân viên',
        width: 160,
        align: 'left',
      },
      {
        id: 'orgChart',
        label: 'Đơn vị',
        width: 140,
        align: 'left',
      },
      {
        id: 'position',
        label: 'Chức danh',
        width: 140,
        align: 'left',
      },
      {
        id: 'totalPriceBroker',
        label: 'Phí môi giới',
        width: 140,
        align: 'left',
      },
      {
        id: 'supportCost',
        label: 'Phí hỗ trợ',
        width: 140,
        align: 'left',
      },
    ],
    [t],
  );

  useEffect(() => {
    if (ComisstionDetail?.data) {
      const count = ComisstionDetail?.data?.filter(
        element => element.isPaid === true,
      ).length;
      setCountStatusPaid(count);
    }
  }, [ComisstionDetail]);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListComisstion(params));
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

  const handleClickChecbox = (rowData: any[]) => {
    setListCheckbox(rowData);
  };

  const handleChangeStatus = async () => {
    const itemChangeStatus = [...listitemChangeStatus].concat(listCheckbox);
    setListitemChangeStatus(itemChangeStatus);

    const newListStatus: any[] = [];
    listCheckbox.forEach((element, index) => {
      newListStatus.push(element.id);
    });

    const payload: PayloadUpdateStatusComisstion = {
      commissionDetailIds: newListStatus,
    };

    dispatch(
      actions.updateStatusComisstion(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật thành công',
              type: 'success',
            }),
          );
          setListCheckbox([]);
          dispatch(actions.fetchListComisstion(filter));
        }
      }),
    );
  };

  const renderItem = (item: UPloadComisstionDetail, index: number) => {
    return [
      <EllipsisText text={`${item?.staff?.code}`} line={1} color={'#007AFF'} />,
      <EllipsisText text={`${item?.staff?.fullName}`} line={2} />,
      <EllipsisText text={`${item?.staff?.orgChart?.name}`} line={2} />,
      <EllipsisText text={`${item?.staff?.position}`} line={2} />,
      <EllipsisText
        text={`${formatCurrency(item?.moneyComing)}đ`}
        line={1}
      />,
      <EllipsisText text={`${formatCurrency(item?.supportCost || 0)}đ`} line={1} />,
    ];
  };
  const hanldOpenItem = (open: number, id: string, index: number) => {
    setOpen(open);
    setListitemChangeStatus([]);
    setListCheckbox([]);
    setIndexItem(index);
    if (!open) {
      dispatch(actions.fetchListComisstion(filter));
    }
    dispatch(actions.getDetailComisstion({ id }));
  };

  const checkBoxStatus = (status: string, index: number) => {
    let itemStatus = status;
    const totalItem = ComisstionDetail?.data.length || 0;
    const countItemChanged = listitemChangeStatus.length + countStatusPaid;

    if (index !== indexItem) {
      return status;
    } else {
      if (countItemChanged === 0) {
        itemStatus = TransactionStatusType.UNPAID;
      } else if (countItemChanged > 0 && countItemChanged < totalItem) {
        itemStatus = TransactionStatusType.PAYING;
      } else if (countItemChanged === totalItem) {
        itemStatus = TransactionStatusType.PAID;
      }
    }
    return itemStatus;
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        minHeight: '35vh',
      }}
    >
      {comissionUploadList?.map((item, index) => {
        const ischeckItem = listCheckbox.length > 0 && open === index;
        return (
          <>
            <Box
              sx={{
                width: '100%',
                mt: '8px',
                background: '#E7F8F8',
                padding: '8px 15px 8px 15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '44px',
              }}
            >
              <Stack
                sx={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  hanldOpenItem(open === index ? -1 : index, item.id, index)
                }
              >
                <Typography
                  sx={{
                    fontSize: '25px',
                    color: 'black',
                    width: '30px',
                  }}
                >
                  {open === index ? '-' : '+'}
                </Typography>
                <BoxStatus status={checkBoxStatus(item.status, index)} />
              </Stack>
              <Stack
                style={{
                  cursor: 'pointer',
                  flexDirection: 'row',
                  flexGrow: 1,
                  display: 'inline',
                }}
                onClick={() =>
                  hanldOpenItem(open === index ? -1 : index, item.id, index)
                }
              >
                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                  <Stack flexDirection={'row'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                        ml: 3,
                      }}
                    >
                      {item.product.project.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#007AFF',
                        ml: 1,
                      }}
                    >
                      {item.product.code}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 2,
                      }}
                    >
                      {formatCurrency(item.product.priceVat)}đ(VAT)
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 2,
                      }}
                    >
                      {formatCurrency(item.product.price)}đ
                    </Typography>
                  </Stack>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                      }}
                    >
                      {'Thanh toán:'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'black',
                        ml: 1,
                      }}
                    >
                      {formatCurrency(item.revenue)}đ
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                        ml: 2,
                      }}
                    >
                      {'Tỉ lệ:'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 1,
                      }}
                    >
                      {roundCustom(item.paymentRate * 100, 1)}%
                    </Typography>
                  </Box>
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                        ml: 3,
                      }}
                    >
                      {'Khách hàng:'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 1,
                        whiteSpace: 'nowrap',
                        maxWidth: '30vw',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {item.customerName}
                    </Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                      }}
                    >
                      {'Ngày tạo:'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 0.5,
                      }}
                    >
                      {formatDateTime2(item.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black',
                        ml: 3,
                      }}
                    >
                      {'Tổng:'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'black',
                        ml: 1,
                        whiteSpace: 'nowrap',
                        maxWidth: '30vw',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {formatCurrency(item.value)}đ
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 15,
                }}
              >
                <div>
                  <div
                    style={{
                      display: checkPermissionExist(
                        PermissionKeyEnum.COMMISSION_PAID,
                        userInfo,
                      )
                        ? 'flex'
                        : 'none',
                      border: `1px solid ${
                        ischeckItem ? '#2FB350' : '#C8CBCF'
                      }`,
                      background: ischeckItem ? '#fff' : '#C8CBCF',
                      borderRadius: '8px',
                      padding: '2px 8px',
                      minHeight: '32px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: ischeckItem ? ' pointer' : 'default',
                    }}
                    onClick={() => {
                      ischeckItem && handleChangeStatus();
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: ischeckItem ? '#2FB350' : '#7A7A7A',
                      }}
                    >
                      Xác nhận chi
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>
            <Collapse in={open === index} timeout="auto" unmountOnExit>
              <Table
                headers={header}
                onRequestSort={handleRequestSort}
                renderItem={renderItem}
                items={ComisstionDetail?.data}
                pageNumber={filter.page}
                totalElements={ComisstionDetail?.total}
                countDisabledList={
                  ComisstionDetail?.data?.filter(item => item.isPaid === true)
                    .length
                }
                sort={filter.orderBy}
                limitElement={ComisstionDetail?.total}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                listCheckBox={listitemChangeStatus}
                isLoading={isLoading}
                hidePagination
                hasCheckbox={checkPermissionExist(
                  PermissionKeyEnum.COMMISSION_PAID,
                  userInfo,
                )}
                onSelectCheckbox={handleClickChecbox}
                typeCheckBox={TypeCheckBoxTable.CHECKBOX}
                fullHeight
              />
            </Collapse>
          </>
        );
      })}
    </Paper>
  );
}
