import { useParams } from "react-router-dom";
import CreateProcess from "../create";
import { useDispatch } from "react-redux";
import { useProcessManagementSlice } from "../slice";
import { useEffect } from "react";

export default function CopyProcess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProcessManagementSlice();

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailWorkFlow({ id }));
    } else {
      dispatch(actions.clearDataProcess())
    }
  }, [actions, dispatch, id])

  return (
    <>
      <CreateProcess isCopy />
    </>
  )
}