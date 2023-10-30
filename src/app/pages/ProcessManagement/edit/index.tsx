import { useParams } from 'react-router-dom';
import CreateProcess from '../create';
import { useDispatch } from 'react-redux';
import { useProcessManagementSlice } from '../slice';
import { useEffect } from 'react';

interface Props {
  isEdit?: boolean;
  idShow?: string;
  isShow?: boolean;
}

export default function EditProcess(props: Props) {
  const { isEdit, isShow, idShow } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProcessManagementSlice();

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailWorkFlow({ id: idShow ? idShow : id }));
    } else {
      dispatch(actions.clearDataProcess());
    }
  }, [actions, dispatch, id]);

  return (
    <>
      <CreateProcess isEdit={isEdit} isShow={isShow} />
    </>
  );
}
