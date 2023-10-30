import { Box, Skeleton } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';

import { useEffect } from 'react';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';

import { CreateReservation } from '../create';

interface UpdateReservationProps {}

export default function EditReservation(props: UpdateReservationProps) {
  const { reservationId, id } = useParams();
  const { actions } = useTransactionManagementSlice();
  const dispatch = useDispatch();
  const { bookingDetail, isLoading } = useSelector(selectTransactionManagement);
  const userInfo = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkPermissionExist(PermissionKeyEnum.TICKET_UPDATE, userInfo)) {
      navigate(`/project/transaction-management/${id}`);
    }
  }, [userInfo, id]);

  useEffect(() => {
    if (reservationId) {
      dispatch(actions.getDetailBooking({ id: reservationId }));
    }
    return () => {
      dispatch(actions.clearDataBookingDetail());
    };
  }, [actions, dispatch, reservationId]);

  return (
    <div>
      {isLoading[`transactionManagementSlice/getDetailBooking`] ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreateReservation isEdit />
      )}
    </div>
  );
}
