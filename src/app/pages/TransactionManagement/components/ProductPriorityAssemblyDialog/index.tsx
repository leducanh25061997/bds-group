/* eslint-disable eqeqeq */
import {
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import CustomButton from 'app/components/Button';
import { useProfile } from 'app/hooks';
import { useEffect, useState } from 'react';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import { useParams } from 'react-router-dom';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { isEqual } from 'lodash';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';
import { PriorityStatus } from 'types/Enum';
import { selectProject } from 'app/pages/Projects/slice/selector';
import { ProjectTypeEnum } from 'types/Project';

import {
  ApartmentInformationSParams,
  SubDataProtype,
} from '../ApartmentInformationManagement/slice/types';
import { useApartmentInformationsSlice } from '../ApartmentInformationManagement/slice';

import { OrderTicketRequest, TicketApprove, Tickets } from '../../slice/type';

import { ControlledSelect } from './components/ControlledSelect';
import { RenderCustomer } from './components/RenderCustomer';
import { RenderKeyValue } from './components/RenderKeyValue';

interface ProductPriorityAssemblyProtype {
  open: boolean;
  onClose: () => void;
  product: SubDataProtype;
}

export function ProductPriorityAssemblyDialog(
  props: ProductPriorityAssemblyProtype,
) {
  const { open, onClose, product } = props;
  const { ticketCanOrder, settingSalesProgramId, priorityStatus } = useSelector(
    selectTransactionManagement,
  );
  const methods = useForm();
  const dispatch = useDispatch();
  const { actions } = useApartmentInformationsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { id } = useParams();
  const { actions: transactionManagementAction } =
    useTransactionManagementSlice();
  const [tickets, setTickets] = useState<TicketApprove[]>([]);
  const [isPermision, setIsPermision] = useState<boolean>(true);
  const [priority1, setPriority1] = useState<TicketApprove | null>(null);
  const [priority2, setPriority2] = useState<TicketApprove | null>(null);
  const [priority3, setPriority3] = useState<TicketApprove | null>(null);
  const [oldPriorities, setOldPriorities] = useState('');
  const userInfo = useProfile();
  const { ProjectDetail } = useSelector(selectProject);

  const isApartment = ProjectDetail?.type === ProjectTypeEnum.APARTMENT;

  useEffect(() => {
    if (id && checkPermissionExist(PermissionKeyEnum.TICKIC_ORDER, userInfo)) {
      dispatch(transactionManagementAction.fetchTicketCanOrder(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userInfo]);

  useEffect(() => {
    if (
      priorityStatus === PriorityStatus.LOCK_PRIORITY ||
      priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL
    ) {
      setIsPermision(false);
    }
  }, [priorityStatus]);

  useEffect(() => {
    if (product.priorities && product.priorities?.length > 0) {
      const prioriti: any = {
        priority1: null,
        priority2: null,
        priority3: null,
      };

      prioriti.priority1 =
        product.priorities.filter(
          item => item.order === 1 && item.ticket !== null,
        )[0]?.ticket || null;
      setPriority1(
        product.priorities.filter(
          item => item.order === 1 && item.ticket !== null,
        )[0]?.ticket || null,
      );

      prioriti.priority2 =
        product.priorities.filter(
          item => item.order === 2 && item.ticket !== null,
        )[0]?.ticket || null;
      setPriority2(
        product.priorities.filter(
          item => item.order === 2 && item.ticket !== null,
        )[0]?.ticket || null,
      );
      prioriti.priority3 =
        product.priorities.filter(
          item => item.order === 3 && item.ticket !== null,
        )[0]?.ticket || null;
      setPriority3(
        product.priorities.filter(
          item => item.order === 3 && item.ticket !== null,
        )[0]?.ticket || null,
      );

      methods.setValue('priority1', prioriti.priority1?.id || 7);
      methods.setValue('priority2', prioriti.priority2?.id || '');
      methods.setValue('priority3', prioriti.priority3?.id || '');
      setOldPriorities(
        `${prioriti.priority1?.id}-${prioriti.priority2?.id}-${prioriti.priority3?.id}`,
      );
      if (ticketCanOrder?.length) {
        const data: any = [...ticketCanOrder];
        (Object.keys(prioriti) as (keyof typeof prioriti)[]).forEach(
          (key, index) => {
            if (prioriti[key] !== null) {
              data.push(prioriti[key]);
            }
          },
        );
        const unique: any[] = uniqForObject(data);
        setTickets(unique);
      }
    } else {
      setTickets(ticketCanOrder || []);
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketCanOrder, product]);

  function uniqForObject<T>(array: T[]): T[] {
    const result: T[] = [];
    for (const item of array) {
      const found = result.some(value => isEqual(value, item));
      if (!found) {
        result.push(item);
      }
    }
    return result;
  }

  const handleClose = () => {
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    const data = tickets.find(item => item.id === value);
    if (data) {
      switch (field) {
        case 'priority1':
          setPriority1(data);
          break;
        case 'priority2':
          setPriority2(data);
          break;
        case 'priority3':
          setPriority3(data);
          break;
      }
    }
  };

  const onSubmit = (data: any) => {
    const requestData: any = { ...data };
    const _tickets: Tickets[] = [];
    (Object.keys(requestData) as (keyof typeof requestData)[]).forEach(
      (key, i) => {
        if (requestData[key]) {
          _tickets.push({
            index: i + 1,
            ticketId: requestData[key],
          });
        }
      },
    );
    if (product && settingSalesProgramId) {
      const formData: OrderTicketRequest = {
        settingSalesProgramId,
        productId: product.id,
        tickets: _tickets,
      };

      dispatch(
        transactionManagementAction.createProductPriority(
          formData,
          (err?: any) => {
            if (err.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Xác nhận ráp ưu tiên thành công',
                  type: 'success',
                }),
              );
              if (id) {
                const params: ApartmentInformationSParams = {
                  idProject: id,
                  isPriority: true,
                  saleId: settingSalesProgramId,
                };
                dispatch(actions.fetchDatatable(params));
              }
              onClose();
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: err.message || 'Thay đổi thông tin không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
  };

  const handleRemove = (field: string) => {
    switch (field) {
      case 'priority1':
        methods.setValue('priority1', priority2?.id || '');
        methods.setValue('priority2', priority3?.id || '');
        methods.setValue('priority3', '');
        setPriority1(priority2);
        setPriority2(priority3);
        setPriority3(null);
        break;
      case 'priority2':
        methods.setValue('priority2', priority3?.id || '');
        methods.setValue('priority3', '');
        setPriority2(priority3);
        setPriority3(null);
        break;
      case 'priority3':
        methods.setValue('priority3', '');
        setPriority3(null);
        break;
    }
  };
  const checkButtonAcceptDisable = () => {
    if (
      priorityStatus !== PriorityStatus.OPEN_PRIORITY &&
      priorityStatus !== PriorityStatus.OPEN_PRIORITY_ADDITIONAL
    )
      return false;
    const newPriorities = `${priority1?.id}-${priority2?.id}-${priority3?.id}`;
    if (newPriorities !== oldPriorities) {
      return false;
    }
    return true;
  };
  const handleFilterTicket = (index = 1) => {
    const listFilter = tickets.filter(item => {
      let firstData = priority2;
      let secondData = priority3;
      if (index === 2) {
        firstData = priority1;
      } else if (index === 3) {
        secondData = priority1;
      }
      if (firstData?.id === item.id || secondData?.id === item.id) {
        return false;
      }
      return true;
    });
    return listFilter;
  };

  const priorityByOtherOrg = (priority: any) => {
    if (priority) {
      return priority.staff?.orgChart?.id != userInfo?.staff?.orgChart?.id;
    }
    return false;
  };
  const priorityAddedFirst = (priority: any) => {
    return priority?.isPriority;
  };

  const canSetPriority =
    product.canSetPriority &&
    (priorityStatus === PriorityStatus.OPEN_PRIORITY ||
      product.isPriorityAdditional);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box
          sx={{
            position: 'relative',
            background: '#1C293D',
            boxShadow: '-4px 0px 8px 0px rgba(0, 0, 0, 0.15)',
            color: '#FFFFFF',
            pt: 2,
          }}
        >
          {isPermision &&
            checkPermissionExist(PermissionKeyEnum.TICKIC_ORDER, userInfo) && (
              <DialogTitle
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '29px',
                }}
              >
                {priorityStatus === PriorityStatus.OPEN_PRIORITY
                  ? `Ráp ưu tiên sản phẩm`
                  : `Ráp bổ sung ưu tiên sản phẩm`}
              </DialogTitle>
            )}
          <Box
            sx={{
              position: 'absolute',
              right: '16px',
              top: '10px',
              cursor: 'pointer',
            }}
          >
            <Icon
              icon="mdi:remove"
              color="#d9d9d9"
              width="18"
              height="28"
              onClick={handleClose}
            />
          </Box>
          <DialogContent sx={{ padding: '10px 24px' }}>
            <Box mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '20px' }}
                >
                  {product.code}
                </Typography>
                <Box
                  ml={2}
                  sx={{
                    borderRadius: '4px',
                    border: '1px solid #636B78',
                    background: ' #1C293D',
                    padding: '2px 4px',
                  }}
                >
                  <Typography sx={{ fontSize: '10px', lineHeight: '12px' }}>
                    Trống ưu tiên
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  background: '#475160',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px 12px',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  margin: '16px 0',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box>Block {product.block}</Box>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{
                      background: '#FFFFFF',
                      margin: '2px 16px',
                      width: '2px',
                    }}
                  />
                  {isApartment && (
                    <>
                      <Box>Tầng {product.floor}</Box>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          background: '#FFFFFF',
                          margin: '2px 16px',
                          width: '2px',
                        }}
                      />
                      <Box>{product.bedRoom} PN</Box>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          background: '#FFFFFF',
                          margin: '2px 16px',
                          width: '2px',
                        }}
                      />
                    </>
                  )}
                  {ProjectDetail?.type === ProjectTypeEnum.GROUND && (
                    <>
                      <Box>Lô góc: {product.corner}</Box>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          background: '#FFFFFF',
                          margin: '2px 16px',
                          width: '2px',
                        }}
                      />
                    </>
                  )}
                  <Box>{product.direction}</Box>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{
                      background: '#FFFFFF',
                      margin: '2px 16px',
                      width: '2px',
                    }}
                  />
                  <Box>{product.subscription}</Box>
                </Box>
              </Box>
              <RenderKeyValue
                title={`Diện tích tim tường`}
                value={
                  <Typography>
                    {`${product?.builtUpArea} m`}
                    <sup>2</sup>
                  </Typography>
                }
              />
              <RenderKeyValue
                title={`Diện tích thông thủy`}
                value={
                  <Typography>
                    {`${product?.carpetArea} m`}
                    <sup>2</sup>
                  </Typography>
                }
              />
              <RenderKeyValue
                title={`Đơn vị sở hữu`}
                value={
                  <Typography>{product?.orgChart?.name || '-'}</Typography>
                }
              />
              <Box sx={{ margin: '24px 0' }}>
                <Divider />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4} md={4}>
                  Ưu tiên 1
                </Grid>
                <Grid item xs={4} md={4}>
                  Ưu tiên 2
                </Grid>
                <Grid item xs={4} md={4}>
                  Ưu tiên 3
                </Grid>
                {isPermision &&
                  checkPermissionExist(
                    PermissionKeyEnum.TICKIC_ORDER,
                    userInfo,
                  ) && (
                    <Grid item xs={4} md={4}>
                      <ControlledSelect
                        placeholder="Chọn phiếu"
                        control={methods.control}
                        name="priority1"
                        disabled={
                          !canSetPriority ||
                          priorityByOtherOrg(priority1) ||
                          priorityAddedFirst(priority1)
                        }
                        value={priority1?.code}
                        options={handleFilterTicket(1)}
                        onChange={(value: any) =>
                          handleChange('priority1', value)
                        }
                      />
                    </Grid>
                  )}
                {isPermision &&
                  checkPermissionExist(
                    PermissionKeyEnum.TICKIC_ORDER,
                    userInfo,
                  ) && (
                    <Grid item xs={4} md={4}>
                      <ControlledSelect
                        placeholder="Chọn phiếu"
                        control={methods.control}
                        // priority2
                        disabled={
                          !canSetPriority ||
                          priorityByOtherOrg(priority2) ||
                          priorityAddedFirst(priority2) ||
                          !priority1?.code
                        }
                        value={priority2?.code}
                        name="priority2"
                        options={handleFilterTicket(2)}
                        onChange={(value: any) =>
                          handleChange('priority2', value)
                        }
                      />
                    </Grid>
                  )}
                {isPermision &&
                  checkPermissionExist(
                    PermissionKeyEnum.TICKIC_ORDER,
                    userInfo,
                  ) && (
                    <Grid item xs={4} md={4}>
                      <ControlledSelect
                        placeholder="Chọn phiếu"
                        control={methods.control}
                        value={priority3?.code}
                        disabled={
                          !canSetPriority ||
                          priorityByOtherOrg(priority3) ||
                          priorityAddedFirst(priority3) ||
                          !priority2?.code
                        }
                        name="priority3"
                        options={handleFilterTicket(3)}
                        onChange={(value: any) =>
                          handleChange('priority3', value)
                        }
                      />
                    </Grid>
                  )}
                <Grid item xs={4} md={4}>
                  <RenderCustomer
                    stt={`1`}
                    data={priority1}
                    handleRemove={
                      isPermision &&
                      checkPermissionExist(
                        PermissionKeyEnum.TICKIC_ORDER,
                        userInfo,
                      )
                        ? () => handleRemove('priority1')
                        : undefined
                    }
                  />
                </Grid>
                <Grid item xs={4} md={4}>
                  <RenderCustomer
                    stt={`2`}
                    data={priority2}
                    handleRemove={
                      isPermision &&
                      checkPermissionExist(
                        PermissionKeyEnum.TICKIC_ORDER,
                        userInfo,
                      )
                        ? () => handleRemove('priority2')
                        : undefined
                    }
                  />
                </Grid>
                <Grid item xs={4} md={4}>
                  <RenderCustomer
                    stt={`3`}
                    data={priority3}
                    handleRemove={
                      isPermision &&
                      checkPermissionExist(
                        PermissionKeyEnum.TICKIC_ORDER,
                        userInfo,
                      )
                        ? () => handleRemove('priority3')
                        : undefined
                    }
                  />
                </Grid>
              </Grid>
              {isPermision &&
                checkPermissionExist(
                  PermissionKeyEnum.TICKIC_ORDER,
                  userInfo,
                ) && (
                  <Box
                    mt={3}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <CustomButton
                      title="Hủy"
                      handleClick={onClose}
                      sxProps={{
                        background: '#FFFFFF',
                        // border: '1px solid #D6465F',
                        borderRadius: '8px',
                        width: '128px',
                        marginRight: '42px',
                      }}
                      sxPropsText={{ color: '#1E1E1E' }}
                    />
                    <CustomButton
                      title="Xác nhận"
                      isDisable={checkButtonAcceptDisable()}
                      typeButton="submit"
                      sxProps={{
                        background: '#D45B7A',
                        borderRadius: '8px',
                        width: '128px',
                      }}
                      sxPropsText={{
                        color: '#FFFFFF',
                      }}
                    />
                  </Box>
                )}
            </Box>
          </DialogContent>
        </Box>
      </form>
    </Dialog>
  );
}
