/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from '@iconify/react';
import { Box, List, ListItemButton, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useProfile } from 'app/hooks';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import {
  DialogProtype,
  EventSocketListen,
  PriorityAssemblyLock,
  PriorityStatus,
} from 'types/Enum';
import { Option } from 'types/Option';
import { PermissionKeyEnum } from 'types/Permission';
import { ChangeStatusPriorityParams } from 'types/ProductTable';
import { StatusReservation } from 'types/Transaction';
import { checkPermissionExist } from 'utils/helpers';
import ChooseSaleEventDialog from 'app/pages/SaleEvent/components/ChooseSaleEventDialog';
import { useSaleEventControlSlice } from 'app/pages/SaleEventControl/slice';
import { selectSaleEventControl } from 'app/pages/SaleEventControl/slice/selector';
import path from 'app/routes/path';
import SocketManager, { EventSocket } from 'app/components/Socket';
import moment from 'moment';

import { selectTransactionManagement } from '../../slice/selector';
import { SimpleDialog } from '../ApartmentInformationManagement/components/Dialog';
import { useApartmentInformationsSlice } from '../ApartmentInformationManagement/slice';
import { ApartmentInformationSParams } from '../ApartmentInformationManagement/slice/types';
import { AssemblePrioritySupplementDialog } from '../AssemblePrioritySupplementDialog';
import { LockPriorityAssemblyDialog } from '../LockPriorityAssemblyDialog';
import { selectApartmentInformation } from '../ApartmentInformationManagement/slice/selectors';
import { SaleControlEnum } from '../../../SaleEventControl/slice/types';

interface FilterBarProps {
  value: number;
  handleChangeSearch?: (e: any) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface LockDialogProps {
  isOpen: boolean;
  type: PriorityAssemblyLock;
  title: string;
  description: string;
  action?: () => void;
}

export const FilterBarTransactionManagement = React.memo(
  (props: FilterBarProps) => {
    const initialValueLockDialog = {
      isOpen: false,
      type: PriorityAssemblyLock.LOCK_PRIORITY_ASSEMBLY,
      title: '',
      description: '',
    };
    const FormControl = useForm({
      mode: 'onSubmit',
    });
    const {
      control,
      formState: { errors },
      setValue,
      setError,
    } = FormControl;
    const { id } = useParams();
    const dispatch = useDispatch();
    const { value, handleChangeSearch } = props;
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState<boolean>(false);
    const { filterDatatable } = useSelector(selectApartmentInformation);
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
    const {
      settingSalesProgramId,
      priorityStatus,
      reservationManagement,
      depositManagement,
      canceledManagement,
    } = useSelector(selectTransactionManagement);

    const { actions: snackbarActions } = useSnackbarSlice();
    const { actions: transactionManagementAction } =
      useTransactionManagementSlice();
    const [openLockDialog, setOpenLockDialog] = useState<LockDialogProps>(
      initialValueLockDialog,
    );
    const [isOpenChooseSaleEventDialog, setIsOpenChooseSaleEventDialog] =
      useState<boolean>(false);
    const { actions: apartmentInformationsAction } =
      useApartmentInformationsSlice();
    const [
      openAssemblePrioritySupplementDialog,
      setOpenAssemblePrioritySupplementDialog,
    ] = useState<boolean>(false);
    const navigate = useNavigate();
    const userInfo = useProfile();
    const scheduleFetchSettingProgram = useRef<any>(null);

    const { actions: saleEventControlAction } = useSaleEventControlSlice();
    const { permission, eventSale } = useSelector(selectSaleEventControl);

    useEffect(() => {
      dispatch(transactionManagementAction.updateParamsSearchKeyNodeName(''));
      setValue('status', '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);

    useEffect(() => {
      if (!eventSale) return;
      const saleEventStartDate = moment(
        eventSale?.salesProgram?.startEvent?.replace('.000Z', '') || '',
      );
      const currentTime = moment();
      const diffTime = saleEventStartDate.diff(currentTime, 'milliseconds');
      clearTimeout(scheduleFetchSettingProgram.current);
      checkEventSalesPermission();
      if (diffTime > 0) {
        scheduleFetchSettingProgram.current = setTimeout(() => {
          checkEventSalesPermission();
        }, diffTime + 1000);
      }

      return () => {
        clearTimeout(scheduleFetchSettingProgram.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventSale]);

    const checkEventSalesPermission = () => {
      if (id && settingSalesProgramId) {
        dispatch(
          saleEventControlAction.checkEventSalesPermission({
            projectId: id,
            salesProgramId: settingSalesProgramId,
          }),
        );
      }
    };

    const optionStatus = useMemo(() => {
      const option: Option[] = [];

      if (reservationManagement?.statistic && value === 1) {
        reservationManagement?.statistic.map(item => {
          option.push({
            key: item.nameNode.includes('Khởi tạo')
              ? item.nameNode
              : `Chờ ${item.nameNode}`,
            value: item.nameNode,
            id: item.nameNode,
          });
        });
        option.push({
          key: 'Giữ chỗ thành công',
          value: 'Giữ chỗ thành công',
          id: 'Giữ chỗ thành công',
        });
      } else if (depositManagement?.statistic && value === 2) {
        depositManagement?.statistic.map(item => {
          option.push({
            key: item.nameNode.includes('Khởi tạo')
              ? item.nameNode
              : `Chờ ${item.nameNode}`,
            value: item.nameNode,
            id: item.nameNode,
          });
        });
        option.push({
          key: 'Đặt cọc thành công',
          value: 'Đặt cọc thành công',
          id: 'Đặt cọc thành công',
        });
      } else if (canceledManagement?.statistic && value === 3) {
        canceledManagement?.statistic.map(item => {
          option.push({
            key: item.nameNode.includes('Khởi tạo')
              ? item.nameNode
              : `Chờ ${item.nameNode}`,
            value: item.nameNode,
            id: item.nameNode,
          });
        });
        option.push({
          key: 'Hủy chỗ thành công',
          value: 'Hủy chỗ thành công',
          id: 'Hủy chỗ thành công',
        });
      }
      return option;
    }, [reservationManagement, depositManagement, canceledManagement, value]);

    const handleSelectStatus = (e: any) => {
      dispatch(transactionManagementAction.updateParamsSearchKeyNodeName(e));
    };

    const handleOpen = () => {
      setOpen(true);
    };

    const handleOpenDialog = () => {
      setOpen(false);
      setIsOpenDialog(true);
    };

    const handleRidirectCreateReservation = (e?: any) => {
      let statusType = '';
      if (value === 1) {
        statusType = StatusReservation.RESERVATION;
      } else if (value === 2) {
        statusType = StatusReservation.DEPOSIT;
      }
      navigate(`/project/transaction-management/${id}/reservation/create`, {
        state: {
          typeCreate: statusType,
        },
      });
    };

    const handleChange = (event: any) => {
      handleChangeSearch?.(event.target.value);
    };

    const handleClose = () => {
      setOpen(false);
    };

    useOnClickOutside(anchorRef, handleClose);

    const ChildrenTab = (props: TabPanelProps) => {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && <Box>{children}</Box>}
        </div>
      );
    };

    const SelectStatus = () => {
      return (
        <TextFieldCustom
          placeholder="Chọn trạng thái"
          sxProps={{ paddingLeft: '8px' }}
          backgroundColor="#F2F2F2"
          name="status"
          type="select"
          options={optionStatus || []}
          control={control}
          errors={errors}
          handleDeleted={() => {
            setValue('status', '');
            dispatch(
              transactionManagementAction.updateParamsSearchKeyNodeName(''),
            );
          }}
          setError={setError}
          onChange={handleSelectStatus}
        />
      );
    };

    const lockPriorityAdditional = () => {
      if (settingSalesProgramId) {
        const params: ChangeStatusPriorityParams = {
          isOpen: false,
          settingSalesProgramId,
        };
        dispatch(
          transactionManagementAction.changeStatusPriority(
            params,
            (status: any) => {
              if (status.success) {
                if (id) {
                  const paramFetch: ApartmentInformationSParams = {
                    idProject: id,
                    isPriority: true,
                    saleId: settingSalesProgramId,
                  };
                  dispatch(
                    apartmentInformationsAction.fetchDatatable(paramFetch),
                  );
                }
                dispatch(
                  snackbarActions.updateSnackbar({
                    message: 'Khóa ráp bổ sung ưu tiên thành công',
                    type: 'success',
                  }),
                );
                dispatch(
                  transactionManagementAction.setPriorityStatus(
                    PriorityStatus.LOCK_PRIORITY_ADDITIONAL,
                  ),
                );
                setOpenLockDialog(initialValueLockDialog);
              } else {
                dispatch(
                  snackbarActions.updateSnackbar({
                    message: status.message,
                    type: 'error',
                  }),
                );
              }
            },
          ),
        );
      }
    };

    const lockPriorityAssembly = () => {
      if (settingSalesProgramId) {
        const params: ChangeStatusPriorityParams = {
          isOpen: false,
          settingSalesProgramId,
        };
        dispatch(
          transactionManagementAction.changeStatusPriority(
            params,
            (status: any) => {
              if (status.success) {
                dispatch(
                  snackbarActions.updateSnackbar({
                    message: 'Khóa ráp ưu tiên thành công',
                    type: 'success',
                  }),
                );
                if (filterDatatable?.idProject) {
                  dispatch(
                    apartmentInformationsAction.fetchDatatable(filterDatatable),
                  );
                }
                dispatch(
                  transactionManagementAction.setPriorityStatus(
                    PriorityStatus.LOCK_PRIORITY,
                  ),
                );
                setOpenLockDialog(initialValueLockDialog);
              } else {
                dispatch(
                  snackbarActions.updateSnackbar({
                    message: 'Khóa ráp ưu không thành tiên thành công',
                    type: 'error',
                  }),
                );
                setOpenLockDialog(initialValueLockDialog);
              }
            },
          ),
        );
      }
    };

    const showCreateTicket = checkPermissionExist(
      PermissionKeyEnum.TICKET_CREATE,
      userInfo,
    );

    const showSaleEventButton =
      settingSalesProgramId &&
      (permission?.salesUnit.isManager ||
        permission?.salesUnit.isStaff ||
        permission?.isAdmin ||
        permission?.isSupport);
    const showPriorityManagerButton =
      checkPermissionExist(PermissionKeyEnum.PRIORITY_MANAGEMENT, userInfo) &&
      (!settingSalesProgramId ||
        !eventSale ||
        eventSale.status === SaleControlEnum.NOT_START);
    const events: EventSocket[] = useMemo(
      () => [
        {
          // when sale program update/change status
          name: EventSocketListen.UPDATE_SALES_PROGRAM,
          handler: (data: any) => {
            if (data?.projectId === id) {
              dispatch(
                saleEventControlAction.fetchEventSalesInfo({
                  id: settingSalesProgramId || '',
                }),
              );
            }
          },
        },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [filterDatatable, settingSalesProgramId],
    );

    return (
      <Box
        sx={{
          display: 'flex',
          // mb: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SocketManager events={events} />
        {/* {value < 1 && (
          <Typography
            fontSize={'18px'}
            fontWeight={700}
            color={palette.common.black}
          >
            {ProjectDetail?.name}
          </Typography>
        )} */}
        <ChildrenTab value={value} index={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Search /> */}
            <Box sx={{ position: 'relative' }} ref={anchorRef}>
              {showPriorityManagerButton && (
                <CustomButton
                  title="Quản lý ưu tiên"
                  // propRef={anchorRef}
                  // ariaDescribedby={idPopover}
                  handleClick={handleOpen}
                  isDropdown
                  sxProps={{
                    borderRadius: '8px',
                    width: { xs: '158px' },
                    height: { xs: '44px' },
                    marginLeft: '10px',
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              )}
              {open && (
                <Box
                  sx={{
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.15)',
                    zIndex: 10,
                    position: 'absolute',
                    left: '-50px',
                    width: 'max-content',
                    marginTop: '10px',
                    padding: '0 14px',
                  }}
                >
                  <List sx={{ p: '12px 0px' }}>
                    {(!priorityStatus ||
                      priorityStatus === PriorityStatus.NOT_OPENED_PRIORITY) &&
                      checkPermissionExist(
                        PermissionKeyEnum.OPEN_PRIORITY,
                        userInfo,
                      ) && (
                        <ListItemButton
                          sx={{
                            py: 1,
                            borderRadius: '8px',
                            padding: '12px 8px',
                            '&:hover': {
                              background: '#FDEAF4',
                              borderRadius: '8px',
                            },
                          }}
                          onClick={handleOpenDialog}
                        >
                          <Box display={'flex'} alignItems={'center'} sx={{}}>
                            <Typography
                              ml={1}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              fontWeight={600}
                              color={theme.palette.primary.light}
                            >
                              {`Ráp ưu tiên`}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      )}
                    {priorityStatus === PriorityStatus.OPEN_PRIORITY &&
                      checkPermissionExist(
                        PermissionKeyEnum.OPEN_PRIORITY,
                        userInfo,
                      ) && (
                        <ListItemButton
                          sx={{
                            py: 1,
                            mt: 0.5,
                            borderRadius: '8px',
                            padding: '12px 8px',
                            '&:hover': {
                              background: '#FDEAF4',
                              borderRadius: '8px',
                            },
                          }}
                          onClick={() => {
                            setOpen(false);
                            setOpenLockDialog({
                              isOpen: true,
                              type: PriorityAssemblyLock.LOCK_PRIORITY_ASSEMBLY,
                              title: 'Khóa ráp ưu tiên',
                              description: `Bạn có chắc chắn muốn khóa giai đoạn ráp ưu tiên?
                          Khi xác nhận khóa, các đơn vị sẽ không thể thực hiện ráp
                          ưu tiên được nữa.`,
                              action: lockPriorityAssembly,
                            });
                          }}
                        >
                          <Box display={'flex'} alignItems={'center'}>
                            <Icon icon="bxs:lock" color="#1e1e1e" />
                            <Typography
                              ml={1}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              fontWeight={600}
                              color={theme.palette.primary.light}
                            >
                              {`Khóa ráp ưu tiên`}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      )}
                    {(priorityStatus === PriorityStatus.LOCK_PRIORITY ||
                      priorityStatus ===
                        PriorityStatus.LOCK_PRIORITY_ADDITIONAL) &&
                      checkPermissionExist(
                        PermissionKeyEnum.OPEN_PRIORITY,
                        userInfo,
                      ) && (
                        <ListItemButton
                          sx={{
                            py: 1,
                            mt: 0.5,
                            borderRadius: '8px',
                            padding: '12px 8px',
                            '&:hover': {
                              background: '#FDEAF4',
                              borderRadius: '8px',
                            },
                          }}
                          onClick={() => {
                            setOpen(false);
                            setOpenAssemblePrioritySupplementDialog(true);
                          }}
                        >
                          <Box display={'flex'} alignItems={'center'}>
                            <Typography
                              ml={1}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              fontWeight={600}
                              color={theme.palette.primary.light}
                            >
                              {`Ráp bổ sung ưu tiên`}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      )}
                    {priorityStatus ===
                      PriorityStatus.OPEN_PRIORITY_ADDITIONAL &&
                      checkPermissionExist(
                        PermissionKeyEnum.OPEN_PRIORITY,
                        userInfo,
                      ) && (
                        <ListItemButton
                          sx={{
                            py: 1,
                            mt: 0.5,
                            borderRadius: '8px',
                            padding: '12px 8px',
                            '&:hover': {
                              background: '#FDEAF4',
                              borderRadius: '8px',
                            },
                          }}
                          onClick={() => {
                            setOpen(false);
                            setOpenLockDialog({
                              isOpen: true,
                              type: PriorityAssemblyLock.PRIORITY_ADDITIONAL_ASSEMBLY,
                              title: 'Khóa ráp bổ sung ưu tiên',
                              description: `Bạn có chắc chắn muốn khóa giai đoạn ráp bổ sung ưu tiên?
                          Khi xác nhận khóa, các đơn vị sẽ không thể thực hiện ráp
                           bổ sung ưu tiên được nữa.`,
                              action: lockPriorityAdditional,
                            });
                          }}
                        >
                          <Box display={'flex'} alignItems={'center'}>
                            <Icon icon="bxs:lock" color="#1e1e1e" />
                            <Typography
                              ml={1}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              fontWeight={600}
                              color={theme.palette.primary.light}
                            >
                              {`Khóa ráp bổ sung ưu tiên`}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      )}

                    <ListItemButton
                      sx={{
                        py: 1,
                        mt: 0.5,
                        borderRadius: '8px',
                        padding: '12px 8px',
                        '&:hover': {
                          background: '#FDEAF4',
                          borderRadius: '8px',
                        },
                      }}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography
                          ml={1}
                          fontSize={'14px'}
                          lineHeight={'17px'}
                          fontWeight={600}
                          color={theme.palette.primary.light}
                        >
                          {`Tải danh sách ráp ưu tiên`}
                        </Typography>
                      </Box>
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        py: 1,
                        mt: 0.5,
                        borderRadius: '8px',
                        padding: '12px 8px',
                        '&:hover': {
                          background: '#FDEAF4',
                          borderRadius: '8px',
                        },
                      }}
                      // onClick={() => console.log()}
                    >
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography
                          ml={1}
                          fontSize={'14px'}
                          lineHeight={'17px'}
                          fontWeight={600}
                          color={theme.palette.primary.light}
                        >
                          {`Gửi email ráp ưu tiên`}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </List>
                </Box>
              )}
            </Box>
            {showSaleEventButton && (
              <CustomButton
                title="Bán hàng sự kiện"
                isIcon
                buttonMode="event"
                handleClick={() => {
                  if (permission.isAdmin) {
                    navigate(
                      `${path.saleEvent}/${settingSalesProgramId}/control`,
                    );
                  } else {
                    navigate(
                      `${path.saleEvent}/project/${id}/transaction/${settingSalesProgramId}`,
                    );
                  }
                }}
                sxProps={{
                  borderRadius: '8px',
                  background: palette.button.bgEvent,
                  height: { xs: '44px' },
                  marginLeft: '10px',
                  minWidth: '100px',
                }}
                sxPropsText={{ fontSize: '14px' }}
              />
            )}
          </Box>
        </ChildrenTab>
        <ChildrenTab value={value} index={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Search /> */}
            <SelectStatus />
            {showCreateTicket && (
              <CustomButton
                title="Tạo phiếu giữ chỗ"
                isIcon
                buttonMode="create"
                sxProps={{
                  ml: '8px',
                  borderRadius: '8px',
                  width: { xs: '189px' },
                  height: { xs: '44px' },
                }}
                sxPropsText={{ fontSize: '14px' }}
                handleClick={handleRidirectCreateReservation}
              />
            )}
          </Box>
        </ChildrenTab>
        <ChildrenTab value={value} index={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Search /> */}
            <SelectStatus />
            {showCreateTicket && (
              <CustomButton
                title="Tạo phiếu đặt cọc"
                isIcon
                buttonMode="create"
                sxProps={{
                  ml: '8px',
                  borderRadius: '8px',
                  width: { xs: '189px' },
                  height: { xs: '44px' },
                }}
                sxPropsText={{ fontSize: '14px' }}
                handleClick={handleRidirectCreateReservation}
              />
            )}
          </Box>
        </ChildrenTab>
        <ChildrenTab value={value} index={3}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Search /> */}
            <SelectStatus />
          </Box>
        </ChildrenTab>
        {isOpenDialog && (
          <SimpleDialog
            onClose={() => setIsOpenDialog(false)}
            open={isOpenDialog}
            type={DialogProtype.PRODUCT_PRIORITY_ASSEMBLY}
          />
        )}
        {openLockDialog.isOpen && (
          <LockPriorityAssemblyDialog
            onClose={() => {
              setOpenLockDialog(initialValueLockDialog);
            }}
            dialogTitle={openLockDialog.title}
            subTitle={openLockDialog.description}
            open={openLockDialog.isOpen}
            handleAction={openLockDialog.action}
          />
        )}
        {openAssemblePrioritySupplementDialog && (
          <AssemblePrioritySupplementDialog
            onClose={() => setOpenAssemblePrioritySupplementDialog(false)}
            open={openAssemblePrioritySupplementDialog}
          />
        )}
        {isOpenChooseSaleEventDialog && (
          <ChooseSaleEventDialog
            open={isOpenChooseSaleEventDialog}
            onClose={() => setIsOpenChooseSaleEventDialog(false)}
            projectId={id}
          />
        )}
      </Box>
    );
  },
);
