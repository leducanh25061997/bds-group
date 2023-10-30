import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  Box,
  Dialog,
  DialogActions,
  Divider,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography
} from '@mui/material';
import CustomButton from 'app/components/Button';
import TicketHeader from 'app/pages/TransactionManagement/components/BookingDetail/TicketHeader';
import ADD_ICON from 'assets/background/add-icon.svg';
import EDIT_HISTORY from 'assets/background/history.svg';
import dayjs from 'dayjs';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import { CustomerGroupType } from 'types/Enum';
import {
  RenderTitleGender,
  renderCustomerGroup,
  renderIdentifier,
} from 'utils/helpers';
import { useCustomerSlice } from '../../slice';
import { selectCustomer } from '../../slice/selector';
import HistoryCustomerBig from '../HistoryCustomerBig/HistoryCustomerBig';
import { StatusReservation } from 'types/Transaction';
import { ActionDialog } from 'app/pages/TransactionManagement/components/BookingDetail/ActionDialog';
import { PayloadApproveAction } from '../../slice/types';
import { snackbarActions } from 'app/components/Snackbar/slice';
import { useProfile } from 'app/hooks';
import ProcessStatusCustomer from '../ProcessStatusCustomer/ProcessStatusCustomer';
interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handeAddHistory: () => void;
  id?: string;
}

interface OpenDialog {
  approve: boolean;
  reject: boolean;
}

const ListProject = [
  { code: 'METROSTAR', name: 'METRO STAR' },
  { code: 'LEMAN_LUXURY', name: 'LÉMAN LUXURY APARTMENT' },
  { code: 'CT_PLAZA_NH', name: 'CT PLAZA NGUYÊN HỒNG' },
  { code: 'DIYAS', name: 'DIYAS' },
  { code: 'CT_PLAZA_MC', name: 'CT PLAZA MINH CHÂU' },
  { code: 'DIAMOND', name: 'DIAMOND SQUARE' },
  { code: 'BURANO', name: 'BURANO STATION' },
  { code: 'RESIDENCE', name: 'LÉMAN CAP RESIDENCE' },
  { code: 'PARKING', name: 'LÉMAN PARKING LOT' },
];

export default function ActivityDetailDialog(props: Props) {
  const { actions } = useCustomerSlice();
  const dispatch = useDispatch();
  const userInfo = useProfile();
  const { isOpen, handleClose, id, handeAddHistory } = props;
  const { customerDetail } = useSelector(selectCustomer);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<OpenDialog>({
    approve: false,
    reject: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailCustomer({ id }));
    }
    return () => {
      dispatch(actions.clearDataCustomer());
    };
  }, [actions, dispatch, id]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'createAt',
        enableHiding: false,
        header: 'Thời gian',
        Cell: ({ cell }) => (
          <span>{dayjs(cell.getValue<Date>()).format('DD/MM/YYYY')}</span>
        ),
      },
      {
        accessorKey: 'meetingForm',
        enableHiding: false,
        header: 'Hình thức gặp gỡ',
      },
      {
        accessorKey: 'satisfactionRate',
        header: 'Tỉ lệ hài lòng',
      },
      {
        accessorKey: 'purchaseRate',
        header: 'Tỉ lệ chốt deal',
      },
      {
        accessorKey: 'informationExchanged',
        header: 'Thông tin trao đổi',
      },
      {
        accessorKey: 'feedback',
        header: 'Feedback KH',
      },
      {
        accessorKey: 'description',
        header: 'Chân dung KH',
      },
      {
        accessorKey: 'proposedSolutions',
        header: 'Kế hoạch - đề xuất',
      },
      {
        accessorKey: 'note',
        header: 'Ghi chú',
      },
    ],
    [],
  );

  const getlinkAttacment = (file: any) => {
    if (!file) return;
    if (!file?.name) {
      return process.env.REACT_APP_API_URL + `/${file?.file?.path}`;
    }
    if (file?.name) {
      const url = URL.createObjectURL(file);
      return url;
    }
  };

  const renderFileAttachment = (title: any, attachments: any) => {
    if (!attachments?.length) return;
    return (
      <>
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
          <Box sx={{ flexDirection: 'column' }}>
            {attachments?.map((e: any, index: number) => (
              <MuiLink
                key={index}
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#006EE6',
                  cursor: 'pointer',
                  width: 'fit-content',
                }}
                href={getlinkAttacment(e)}
                target="_blank"
              >
                <AttachFileIcon
                  sx={{
                    width: '1.25rem',
                    height: '1.25rem',
                    mr: 0.5,
                    transform: 'rotate(45deg) scaleY(-1)',
                  }}
                />
                <span>{e?.name || e?.file?.path}</span>
              </MuiLink>
            ))}
          </Box>

        </Box>
      </>
    );
  };


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

  const renderMentionedProject = () => {
    let mentionedProject = ''
    ListProject.forEach((item) => {
      if (
        customerDetail?.mentionedProject?.length &&
        customerDetail?.mentionedProject.includes(item.code)
      ) {
        mentionedProject += `${item.name}, `
      }
    });
    return mentionedProject;
  }

  const handleApprove = (isApprove: boolean) => (reason?: string, files?: any) => {
    if (!customerDetail) return;

    const payload: PayloadApproveAction = {
      id: customerDetail?.customerBigApprove[0]?.id,
      filesVip: files,
      isApprove,
      reason,
    };

    dispatch(
      actions.updateApproveCustomer(payload, (err?: any) => {
        if (err?.success) {
          if (isApprove) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Đã duyệt KH lớn`,
                type: 'success',
              }),
            );
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Từ chối KH lớn thành công`,
                type: 'success',
              }),
            );
          }
          handleClose();
        } else {
          let message = `${isApprove ? `Duyệt KH lớn` : `Từ chối KH lớn`} không thành công`;
          if (err.response && err.response.data.message) {
            message = err.response.data.message;
          }
          dispatch(
            snackbarActions.updateSnackbar({
              message,
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleOpen = (type: keyof OpenDialog) => (state: boolean) => {
    setConfirmDialogOpen(prev => {
      return {
        ...prev,
        [type]: state,
      };
    });
  };

  const checkCanApprove = () => {
    let index = customerDetail?.workFlow?.workFlows[customerDetail?.workFlow?.workFlows?.findIndex((ele) => ele?.id === customerDetail?.customerBigApprove[0]?.currentNodeId) + 1]?.staffs.filter(element => element.userId === userInfo?.id).length ?? 0
    if (index > 0 && customerDetail?.groupType === CustomerGroupType.BIG && customerDetail?.customerBigApprove[0]?.status === 'WAIT_APPROVE') {
      return true
    } else {
      return false
    }
  }

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          height: 'max-content',
          padding: '25px 0px',
          overflow: 'hidden'
        }}
      >
        <TicketHeader type={'customer'} onClose={handleClose} />
        {customerDetail?.groupType === CustomerGroupType.BIG && !!customerDetail && !!customerDetail?.workFlow && (
          <ProcessStatusCustomer customerDetail={customerDetail} />
        )}
        <Box style={{ height: '720px', overflow: 'auto' }}>
          <Box px={4} mt={2}>
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
            {renderInfo(
              'Nhóm khách hàng:',
              renderCustomerGroup(customerDetail?.groupType),
            )}
            {renderInfo('Mã khách hàng:', customerDetail?.code, true)}
            {renderInfo('Tên khách hàng:', customerDetail?.name)}
            {renderInfo(
              'Giới tính:',
              RenderTitleGender(customerDetail?.gender),
            )}
            {renderInfo(
              'Ngày sinh:',
              customerDetail?.birth ? `${dayjs(customerDetail?.birth).format('DD/MM/YYYY')}` : "--",
            )}
            {renderInfo('Địa chỉ Email:', customerDetail?.email)}
            {renderInfo('Số điện thoại:', customerDetail?.phoneNumber)}
            {renderInfo('Địa chỉ liên hệ:', customerDetail?.address)}
            {renderInfo('Địa chỉ thường trú:', customerDetail?.addressBorn)}
            {renderInfo(
              `Số ${renderIdentifier(customerDetail?.typeIdentification)}:`,
              customerDetail?.identityNumber,
            )}
            {renderInfo(
              'Ngày cấp:',
              customerDetail?.dateRange ? `${dayjs(customerDetail?.dateRange).format('DD/MM/YYYY')}` : "--",
            )}
            {renderInfo('Nơi cấp:', customerDetail?.issuedBy)}
            {customerDetail?.groupType === CustomerGroupType.BIG &&
              <>
                {renderInfo('Tiêu chí tài chính:', customerDetail?.evaluation ?? "--")}
                {renderInfo('Chi tiết tài chính:', customerDetail?.finance ?? "--")}
                {renderInfo('Thoả thuận đồng hành:', customerDetail?.agree ?? "--")}
                {renderInfo('Khác:', customerDetail?.otherReason ?? "--")}
                {renderInfo('Mã nhân viên giới thiệu:', customerDetail?.referralEmployeeCode ?? "--")}
                {renderInfo('Tên nhân viên giới thiệu:', customerDetail?.referralEmployeeName ?? "--")}
                {renderFileAttachment('Tài liệu chứng minh:', customerDetail?.filesVip)}
              </>
            }
            {renderInfo('Nguồn:', customerDetail?.source)}
            {renderInfo('Kênh truyền thông:', customerDetail?.socialApp)}
            {renderInfo(
              'Dự án quan tâm:',
              renderMentionedProject() ?? '-',
            )}
            {renderFileAttachment('Chứng từ liên quan (nếu có):', customerDetail?.files)}
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
              <img src={EDIT_HISTORY} alt="icon history" />
              <Typography
                sx={{
                  fontSize: '16px',
                  color: palette.primary.button,
                  fontWeight: 700,
                  ml: 1,
                }}
              >
                Lịch sử chăm sóc khách hàng
              </Typography>
            </Stack>
            <Stack sx={{ flexDirection: 'row' }} onClick={handeAddHistory}>
              <IconButton sx={{ p: 0 }}>
                <img src={ADD_ICON} alt="icon history" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: palette.primary.button,
                  fontWeight: 500,
                  ml: 1,
                  cursor: 'pointer'
                }}
              >
                Thêm lịch sử CSKH
              </Typography>
            </Stack>
          </Stack>

          <Box minHeight={'120vh'}>
            {customerDetail?.activity ? (
              <MaterialReactTable
                columns={columns}
                enablePagination={false}
                data={customerDetail?.activity}
                initialState={{ columnVisibility: { address: false } }}
              />
            ) : (
              <p>No data available.</p>
            )}
          {customerDetail?.groupType === CustomerGroupType.BIG && !!customerDetail && !!customerDetail?.workFlow && (
            <HistoryCustomerBig customerDetail={customerDetail} />
          )}
          </Box>
  
        </Box>
      </Box>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          {checkCanApprove() && (
              <>
                <CustomButton
                  variant="outlined"
                  title="Từ chối"
                  sxProps={{
                    borderRadius: '8px',
                    minWidth: 130,

                    backgroundColor: '#FFE8E9',
                  }}
                  sxPropsText={{ color: '#1E1E1E' }}
                  handleClick={() => handleOpen('reject')(true)}
                />
                <CustomButton
                  variant="outlined"
                  title="Duyệt"
                  sxProps={{
                    borderRadius: '8px',
                    minWidth: 130,

                    borderColor: '#2FB350',
                    backgroundColor: '#D6F4DE',
                  }}
                  sxPropsText={{ color: '#2FB350' }}
                  handleClick={() => handleOpen('approve')(true)}
                />
              </>
            )}
        </Stack>
      </DialogActions>

      <ActionDialog
        isOpenDialogSendRequest={confirmDialogOpen.approve}
        setIsOpenDialogSendRequest={handleOpen('approve')}
        title={`Duyệt KH lớn`}
        description={
          <>
            Bạn có chắc chắn muốn duyệt KH lớn này không?
          </>
        }
        actionName="Duyệt"
        handleSubmit={handleApprove(true)}
        isApprove
      />

      <ActionDialog
        isOpenDialogSendRequest={confirmDialogOpen.reject}
        setIsOpenDialogSendRequest={handleOpen('reject')}
        title={`Từ chối KH lớn`}
        description={
          <>
            Bạn có chắc chắn muốn từ chối KH lớn này không?
          </>
        }
        actionName="Xác nhận"
        handleSubmit={handleApprove(false)}
        isReject
      />
    </Dialog>
  );
}
