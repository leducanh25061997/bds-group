import { Box } from '@mui/material';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ProductTableParams } from 'types/ProductTable';
import SocketManager, { EventSocket } from 'app/components/Socket';
import { EventSocketListen } from 'types/Enum';

import { useVirtualTableSlice } from '../slice';
import { VirtualDataTable } from '../components/VirtualDataTable';
import { ViewType } from '../slice/types';
import { selectVirtualTable } from '../slice/selectors';

import { Header } from './components/Header';

export function VirtualTable() {
  const params = useParams();
  const { id, projectId } = params;
  const dispatch = useDispatch();
  const { actions: virtualTableActions } = useVirtualTableSlice();
  const containerTableRef: any = useRef(null);
  const [heightContainer, setHeightContainer] = useState<number>(0);
  const { filterParams } = useSelector(selectVirtualTable);

  useEffect(() => {
    if (containerTableRef && containerTableRef.current) {
      const { current } = containerTableRef;
      setHeightContainer(current.offsetHeight);
    }
  }, [containerTableRef]);

  useEffect(() => {
    if (id && projectId) {
      const params: ProductTableParams = {
        idProject: projectId,
        isPriority: false,
        saleId: id,
        isVirtual: true,
      };
      dispatch(virtualTableActions.handleFilter(params));
      fetchDatatable(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, projectId]);

  useEffect(() => {
    if (filterParams?.idProject) fetchDatatable(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  const fetchDatatable = (params: ProductTableParams) => {
    dispatch(virtualTableActions.fetchDatatable(params));
    dispatch(virtualTableActions.fetchSettingTableProduct(params));
  };

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_DATA_TABLE,
        handler: (data: any) => {
          if (
            filterParams?.idProject &&
            data?.projectId === filterParams?.idProject
          ) {
            fetchDatatable(filterParams);
          }
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );

  return (
    <Box ref={containerTableRef} sx={{ height: 'calc(100vh - 100px)' }}>
      <SocketManager events={events} />
      <Header />
      <VirtualDataTable
        heightContainer={heightContainer}
        type={ViewType.TABLE}
      />
    </Box>
  );
}
