import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ProductTableParams } from 'types/ProductTable';
import { useVirtualTableSlice } from '../slice';
import { Header } from './components/Header';
import { VirtualDataTable } from '../components/VirtualDataTable';
import { ViewType } from '../slice/types';
import { selectVirtualTable } from '../slice/selectors';

export function VirtualView() {
  const params = useParams();
  const { id, projectId } = params;
  const dispatch = useDispatch();
  const { actions: virtualTableActions } = useVirtualTableSlice();
  const containerTableRef: any = useRef(null);
  const [heightContainer, setHeightContainer] = useState<number>(0);
  const { filterParams } = useSelector(selectVirtualTable);
  const interval = useRef<any>();

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
        isVirtual: true
      };
      dispatch(virtualTableActions.handleFilter(params))
      fetchDatatable(params)
    }
  }, [id, projectId]);

  useEffect(() => {
    interval.current = setInterval(() => {
      if (filterParams?.idProject) {
        fetchDatatable(filterParams)
      }
    }, 5000);
    return () => {
      clearInterval(interval.current);
    };
  }, [filterParams]);

  const fetchDatatable = (params: ProductTableParams) => {
    dispatch(virtualTableActions.fetchDatatable(params));
    dispatch(virtualTableActions.fetchSettingTableProduct(params));
  }

  return (
    <Box ref={containerTableRef} sx={{ height: 'calc(100vh - 100px)' }}>
      <Header />
      <VirtualDataTable heightContainer={heightContainer} type={ViewType.VIEW} />
    </Box>
  );
}
