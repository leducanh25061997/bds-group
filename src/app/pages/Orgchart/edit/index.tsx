import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateOrgchart from '../create';
import { useOrgchartSlice } from '../slice';

export default function EditOrgchart() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useOrgchartSlice();
  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailOrgchart({ id }));
    }
    return () => {
      dispatch(actions.clearDataOrgchart());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      <CreateOrgchart isEdit />
    </div>
  );
}
