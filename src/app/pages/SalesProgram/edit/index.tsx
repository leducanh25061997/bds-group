import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { useSalesProgramSlice } from '../slice';
import CreateSalesProgram from '../create';

interface Props {}

export default function EditSalesProgram(props: Props) {
  const { salesprogramId } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSalesProgramSlice();

  useEffect(() => {
    if (salesprogramId) {
      dispatch(actions.getDetailSalesProgram({ id: salesprogramId }));
    } else {
      dispatch(actions.clearDataSalesProgram());
    }
  }, [actions, dispatch, salesprogramId]);

  return (
    <>
      <CreateSalesProgram isEdit />
    </>
  );
}
