import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import deleteIcon from 'assets/background/close-icon.svg';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import {
  formatCurrency,
  renderCustomerGroup,
  renderIdentifier,
  RenderTitleGender,
} from 'utils/helpers';

import { EllipsisText } from 'app/components/EllipsisText';
import { useCustomerSlice } from 'app/pages/CustomerPotential/slice';
import { selectCustomer } from 'app/pages/CustomerPotential/slice/selector';
import { BookingDetailDialog } from 'app/pages/Payment/Receipts/components/ReceiptsAwaitingApproval';
import BookingDetail from 'app/pages/TransactionManagement/components/BookingDetail';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
interface Props {
  isOpen: boolean;
  handleClose: () => void;
  id?: string;
}

export default function CustomerDetailDialog(props: Props) {
  const { actions } = useCustomerSlice();
  const dispatch = useDispatch();
  const { isOpen, handleClose, id } = props;
  const { customerDetail } = useSelector(selectCustomer);
  const [sumPrice, setSumPrice] = useState<number>();
  const navigate = useNavigate();
  const [openBookingDetail, setOpenBookingDetail] =
    useState<BookingDetailDialog>({
      isOpen: false,
      rowId: '',
      type: 'reservation',
    });
    

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailCustomer({ id }));
    }
    return () => {
      dispatch(actions.clearDataCustomer());
    };
  }, [actions, dispatch, id]);

  useEffect(() => {
    let sum = 0;
    customerDetail?.history.forEach( (item: any) => {
      sum +=item.bookingAmountReservation;
      setSumPrice(sum);
    })

  }, [customerDetail])

  const handleOpenBookingDetail = (
    id: string,
    type: 'reservation' | 'deposit' = 'reservation',
  ) => {

    setOpenBookingDetail({ isOpen: true, rowId: id, type });
  };

  const handleCloseBookingDetail = () => {
    setOpenBookingDetail({ isOpen: false, rowId: '', type: 'reservation' });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'depositCode',
        header: 'Mã giao dịch',
        size: 250,
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${cell.getValue<any>()}`}
            line={2}
            color={'#007AFF'}
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            handleClick={event => {
              event.stopPropagation();
              handleOpenBookingDetail(row?.original?.depositId, 'deposit');
            }}
          />
        ),
      },
      {
        accessorKey: 'projectName',
        header: 'Dự án',
      },
      {
        accessorKey: 'code',
        header: 'Mã sản phẩm',
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${row?.original?.productCode || '---' }`}
            sx={{ fontSize: '14px', cursor: 'pointer' }}
          />
        ),
      },
      {
        accessorKey: 'createAt',
        enableHiding: false,
        header: 'Ngày giao dịch',
        Cell: ({ cell }) => (
          <span>{dayjs(cell.getValue<Date>()).format('DD/MM/YYYY')}</span>
        ),
      },
      {
        accessorKey: 'bookingAmountReservation',
        header: 'Số tiền giao dịch',
        Cell: ({ cell }) => (
          <span>{formatCurrency(
            Number(cell.getValue()) || '0',
          )} VND</span>
        ),
      },
      {
        accessorKey: 'orgChartName',
        header: 'Đơn vị bán hàng',
      },
      {
        accessorKey: 'staffFullName',
        header: 'Nhân viên kinh doanh',
        size: 250,
      },
    ],
    [],
  );


  const renderInfo = (title: any, content: any, highlight?: boolean) => (
    <Box sx={{ display: 'flex', mb: 1.5 }}>
      <Typography
        sx={{
          fontSize: '14px',
          color: palette.common.black,
          fontWeight: 700,
          width: '20%',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: highlight ? '#006EE6' : palette.common.black,
          fontWeight: 400,
        }}
      >
        {content}
      </Typography>
    </Box>
  );

  return (
    <>
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          height: 'max-content',
          padding: '25px 0px',
        }}
      >
        <img
          src={deleteIcon}
          alt="delete-icon"
          className="cursor-pointer absolute top-4 right-4"
          onClick={handleClose}
          height={20}
          width={20}
        />
        <DialogTitle
          sx={{
            textAlign: 'center',
            p: 0,
            '&.MuiDialogTitle-root.MuiTypography-root': {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1E1E1E',
            },
          }}
        >
          Chi tiết khách hàng
        </DialogTitle>
        <Box style={{ height: '720px', overflow: 'auto' }}>
          <Box px={'32px'}>
            <Typography
              sx={{
                fontSize: '16px',
                color: palette.primary.button,
                fontWeight: 700,
                mb: 2,
              }}
            >
              Thông tin khách hàng
            </Typography>
            {renderInfo('Mã khách hàng:', customerDetail?.code)}
            {renderInfo(
              'Loại khách hàng:',
              renderCustomerGroup(customerDetail?.groupType),
            )}
             {renderInfo(
              'Nhân viên tư vấn:', customerDetail?.staff?.fullName,
            )}
            {renderInfo('Tên khách hàng:', customerDetail?.name)}
            {renderInfo(
              'Giới tính:',
              RenderTitleGender(customerDetail?.gender),
            )}
            {renderInfo(
              'Ngày sinh:',
              customerDetail?.birth?  `${dayjs(customerDetail?.birth).format('DD/MM/YYYY')}` : "--",
            )}
            {renderInfo('Địa chỉ Email:', customerDetail?.email)}
            {renderInfo('Số điện thoại:', customerDetail?.phoneNumber)}
            
            {renderInfo(
              `Số ${renderIdentifier(customerDetail?.typeIdentification)}:`,
              customerDetail?.identityNumber,
            )}
            {renderInfo(
              'Ngày cấp:',
              customerDetail?.dateRange ? `${dayjs(customerDetail?.dateRange).format('DD/MM/YYYY')}` : "--",
            )}
            {renderInfo('Nơi cấp:', customerDetail?.issuedBy)}
            {renderInfo('Địa chỉ liên hệ:', customerDetail?.address)}
            {renderInfo('Địa chỉ thường trú:', customerDetail?.addressBorn)}
            {renderInfo('Số lượng giao dịch:', customerDetail?.history?.length)}
            {renderInfo('Tổng số tiền giao dịch:',`${formatCurrency(
                  Number(sumPrice) || '0',
                )} VND`)}
          </Box>
          <Divider sx={{ my: 2, background: '#C8CBCF' }} />
          <Stack
            sx={{
              px: 4,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Stack sx={{ flexDirection: 'row', width: 'max-content' }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: palette.primary.button,
                  fontWeight: 700,
                  ml: 1,
                }}
              >
                Lịch sử giao dịch
              </Typography>
            </Stack>
          </Stack>

          <Box>
            {customerDetail?.history ? (
              <MaterialReactTable
                columns={columns}
                enablePagination={false}
                data={customerDetail?.history}
                muiTableBodyCellProps={{ sx: { padding: '8.3px 15px ' } }}
                muiTableContainerProps={{ sx: { minHeight: '200px' } }}
                enableStickyHeader
                enableColumnResizing
                muiTableHeadCellProps={{
                  sx: {
                    background: 'rgb(254, 244, 250)',
                  },
                }}
              />
            ) : (
              <MaterialReactTable
                columns={columns}
                data={[]}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
    {openBookingDetail.isOpen && (
        <BookingDetail
          type={openBookingDetail.type}
          isOpen={openBookingDetail.isOpen}
          bookingId={openBookingDetail.rowId}
          onClose={() => handleCloseBookingDetail()}
        />
      )}
    </>
  );
}
