import { Box } from '@mui/material';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  PhaseEnum,
  SaleControlEnum,
} from 'app/pages/SaleEventControl/slice/types';
import SocketManager, { EventSocket } from 'app/components/Socket';
import { EventSocketListen } from 'types/Enum';

import { selectSaleEventControl } from '../SaleEventControl/slice/selector';

import { PriorityAssemblyProducts } from './componnents/PriorityAssemblyProducts';
import { FreeProducts } from './componnents/FreeProducts';
import { useSaleEventTransactionSlice } from './slice';
import {
  TransactionParams,
  CheckPermissionEventSaleParams,
} from './slice/types';
import { selectSaleEventTransaction } from './slice/selector';

import { Header } from './componnents/Header';

export function SaleEventTransaction() {
  const windowHeight = useRef(window.innerHeight);
  const collapseRef = useRef<any>();
  const params = useParams();
  const { transactionId, projectId } = params;
  const dispatch = useDispatch();
  const { eventSale } = useSelector(selectSaleEventControl);
  const { saleEventTransactionFree, saleEventTransactionPriority, searchKey } =
    useSelector(selectSaleEventTransaction);
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const [collapse, setCollapse] = useState('');

  useEffect(() => {
    if (transactionId && projectId) {
      const params: CheckPermissionEventSaleParams = {
        projectId,
        salesProgramId: transactionId,
      };
      dispatch(saleEventTransactionActions.fetchPermissionEventSale(params));
      checkAndSetCollapse();
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, projectId]);

  const checkAndSetCollapse = () => {
    if (
      !collapseRef.current &&
      eventSale != null &&
      collapse === '' &&
      saleEventTransactionPriority?.data &&
      saleEventTransactionFree?.data
    ) {
      collapseRef.current = true;
      const isPhase1 =
        eventSale.currentPhase === SaleControlEnum.START_PHASE1 ||
        eventSale.currentPhase === SaleControlEnum.END_PHASE1;
      if (!isPhase1) {
        setCollapse('PHARSE_2');
      } else if (
        (saleEventTransactionFree?.data?.length || 0) === 0 &&
        (saleEventTransactionPriority?.data?.length || 0) > 0
      ) {
        setCollapse('PHARSE_1');
      } else if (
        (saleEventTransactionPriority?.data?.length || 0) === 0 &&
        (saleEventTransactionFree?.data?.length || 0) > 0
      ) {
        setCollapse('PHARSE_2');
      }
    } else {
      setTimeout(() => {
        checkAndSetCollapse();
      }, 200);
    }
  };

  const fetchAllData = () => {
    if (transactionId) {
      fetchData(transactionId);
    }
  };

  const fetchData = (id: string, type?: string) => {
    const freeParams: TransactionParams = {
      id,
      isPriority: false,
      search: searchKey ?? '',
    };
    const priorityParams: TransactionParams = {
      id,
      isPriority: true,
      search: searchKey ?? '',
    };
    if (!type) {
      dispatch(
        saleEventTransactionActions.fetchSaleEventTransaction(freeParams),
      );
      dispatch(
        saleEventTransactionActions.fetchSaleEventTransaction(priorityParams),
      );
    } else {
      if (type === 'PHARSE_1') {
        dispatch(
          saleEventTransactionActions.fetchSaleEventTransaction({
            ...priorityParams,
            refreshPharse: 'PHARSE_1',
          }),
        );
      } else {
        dispatch(
          saleEventTransactionActions.fetchSaleEventTransaction({
            ...freeParams,
            refreshPharse: 'PHARSE_2',
          }),
        );
      }
    }
  };

  const handleRefresh = (type?: string) => {
    if (transactionId) {
      fetchData(transactionId, type);
    }
  };

  const handleCollapse = (type: string) => {
    if (type === collapse) {
      setCollapse('');
    } else {
      setCollapse(type);
    }
  };

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_DATA_TABLE,
        handler: (data: any) => {
          if (data?.projectId === projectId) {
            fetchAllData();
          }
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchKey],
  );

  return (
    <Box>
      <SocketManager events={events} />
      <Header />
      {saleEventTransactionPriority?.eventSales?.phases?.includes(
        PhaseEnum.PHASE_1,
      ) && (
        <PriorityAssemblyProducts
          handleRefresh={handleRefresh}
          handleCollapse={handleCollapse}
          height={
            collapse === 'PHARSE_2' ? 0 : Number(windowHeight.current) - 140
          }
          isFullHeight={
            collapse === 'PHARSE_1' ||
            saleEventTransactionPriority?.eventSales?.phases?.length === 1
          }
        />
      )}
      {saleEventTransactionFree?.eventSales?.phases?.includes(
        PhaseEnum.PHASE_2,
      ) && (
        <FreeProducts
          handleRefresh={handleRefresh}
          handleCollapse={handleCollapse}
          height={
            collapse === 'PHARSE_1' ? 0 : Number(windowHeight.current) - 140
          }
          isFullHeight={
            collapse === 'PHARSE_2' ||
            saleEventTransactionFree?.eventSales?.phases?.length === 1
          }
        />
      )}
    </Box>
  );
}
