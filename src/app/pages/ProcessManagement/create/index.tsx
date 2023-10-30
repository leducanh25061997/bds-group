import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import ADD_ICON from 'assets/background/add-icon-pink.svg';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import DELETE_ICON from 'assets/background/icon-delete-file.svg';
import documentService from 'services/api/document';

import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  Node,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useStaffSlice } from 'app/pages/Staff/slice';
import { selectStaff } from 'app/pages/Staff/slice/selector';
import { get } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import palette from 'styles/theme/palette';
import { WorkflowType } from 'types/Enum';
import { useProcessManagementSlice } from '../slice';
import { selectProcessManagement } from '../slice/selector';
import { ListCreateWorkFlow } from '../slice/type';
import { CreatePanel } from './newPanel';
import { RenderAvatar } from './renderAvatar';

interface Props {
  isEdit?: boolean;
  isCopy?: boolean;
  isShow?: boolean;
}

interface StaffType {
  id: string;
  staffSelect: [];
}
interface CodeType {
  id: string;
  code: any;
}

interface LineStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

const nodeTypes = {
  customeNodes: (itemChild: any, isConnectable: boolean) =>
    customeNodesNode(itemChild, isConnectable, false),
};
const nodeTyoesNotEdit = {
  customeNodes: (itemChild: any, isConnectable: boolean) =>
    customeNodesNode(itemChild, isConnectable, true),
};

function customeNodesNode(
  itemChild: any,
  isConnectable: boolean,
  isNotEdit: boolean,
) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {!itemChild.data.isFirst && !itemChild.data.isShow && !isNotEdit && (
          <Box
            sx={{
              background: '#FFFFFF',
              borderRadius: '50px',
              minWidth: '25px !important',
              height: '25px',
              padding: 0,
              position: 'absolute',
              left: itemChild.data.isLast ? '73%' : '102%',
              transform: itemChild.data.isLast
                ? 'translateX(-73%)'
                : 'translateX(-102%)',
              top: -10,
              zIndex: 1,
              cursor: 'pointer',
            }}
            onClick={() => itemChild.data.onRemoveNode()}
          >
            <img src={DELETE_ICON} width={24} height={24} />
          </Box>
        )}
        <Box display={'flex'}>
          <Stack
            sx={{
              border: itemChild.selected
                ? '3px solid #D6465F'
                : '1px solid #EB94A3',
              borderRadius: '8px',
              width: { xs: '187px', md: '187px' },
              // height: { md: itemChild.data.isFirst ? '40px' : '85px' },
              p: '5px',
            }}
          >
            <Handle
              type="target"
              id="a"
              position={Position.Top}
              isConnectable={isConnectable}
              style={{
                background: '#D6465F',
                width: '10px',
                height: '10px',
                display: 'flex',
                left: itemChild.data.isLast ? '37%' : '50%',
              }}
            />
            <Box
              sx={{
                alignSelf: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Typography
                fontWeight={700}
                fontSize={'14px'}
                color={palette.primary.button}
                paddingBottom={'1px'}
              >
                {itemChild.data.name || 'Title'}
              </Typography>
            </Box>
            {!itemChild.data.isFirst && (
              <div>
                <Divider
                  sx={{
                    background: palette.primary.button,
                    width: '90%',
                    my: 1,
                    mx: '5%',
                  }}
                />
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    ml: 1,
                    pb: 1,
                  }}
                >
                  <Stack sx={{ alignItems: 'flex-start', ml: 0.5 }}>
                    {itemChild.data.staffSelect && (
                      <RenderAvatar listEmp={itemChild.data.staffSelect} />
                    )}
                  </Stack>
                </Stack>
              </div>
            )}
            <Handle
              type="source"
              position={Position.Bottom}
              id="b"
              isConnectable={isConnectable}
              style={{
                background: '#D6465F',
                width: '10px',
                height: '10px',
                display: 'flex',
                left: itemChild.data.isLast ? '37%' : '50%',
              }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id="d"
              isConnectable={itemChild.data.isShow ? false : true}
              style={{
                background: '#D6465F',
                width: '10px',
                height: '10px',
                display: itemChild.data.isFirst ? 'block' : 'none',
              }}
            />
            <Handle
              type="target"
              id="e"
              position={Position.Left}
              isConnectable={itemChild.data.isShow ? false : true}
              style={{
                background: '#D6465F',
                width: '10px',
                height: '10px',
                // marginTop: '10px',
                display: itemChild.data.isFirst ? 'none' : 'block',
              }}
            />
            <Handle
              type="source"
              id="c"
              position={Position.Left}
              isConnectable={true}
              style={{
                background: '#D6465F',
                width: '10px',
                height: '10px',
                marginBottom: '20px',
                display: itemChild.data.isFirst ? 'none' : 'block',
              }}
            />
          </Stack>
        </Box>
        {itemChild.data.isLast && !itemChild.data.isShow && !isNotEdit && (
          <Button
            sx={{
              background: '#FEF4FA',
              borderRadius: '50px',
              minWidth: '44px !important',
              height: '44px',
              padding: 0,
              ml: 3,
            }}
            onClick={itemChild.data.onAddNode}
          >
            <img src={ADD_ICON} width={18} height={18} />
          </Button>
        )}
      </Box>
    </>
  );
}

export default function CreateProcess(props: Props) {
  const { isEdit, isCopy, isShow } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useStaffSlice();
  const { actions: ProcessActions } = useProcessManagementSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { staffManagement } = useSelector(selectStaff);
  const { WorkFlowDetail } = useSelector(selectProcessManagement);
  const [listStaffSelect, setListStaffSelect] = useState<StaffType[]>([
    { id: '1', staffSelect: [] },
  ]);

  const initialEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      style: { stroke: '#2FB350' },
    },
  ];

  const initialNodes = [
    {
      id: '1',
      type: 'customeNodes',
      position: { x: 100, y: 0 },
      data: {
        name: 'Khởi tạo',
        staff: [],
      },
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [nodesDetail, setNodesDetail] = useState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  const [nameProcess, setNameProcess] = useState<string>();
  const [typeProcess, setTypeProcess] = useState<string>();
  const [listCode, setListCode] = useState<CodeType[]>([]);
  const [listNextStep, setListNextStep] = useState<CodeType[]>([]);
  const [listBackStep, setListBackStep] = useState<CodeType[]>([]);
  const [idRemove, setIdRemove] = useState<string>('');
  const [isHide, setIsHide] = useState(false);
  const genarateCode = { generateCode: 'QTD' };

  const navigate = useNavigate();

  // const connectionLineStyle: LineStyle = {
  //   strokeWidth: 1,
  //   stroke: '#2FB350',
  // };

  const defaultEdgeOptions = {
    style: { strokeWidth: 1, stroke: '#2FB350' },
    type: 'smoothstep',
    label: 'Duyệt',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#2FB350',
    },
  };

  useEffect(() => {
    window.addEventListener('error', e => {
      if (
        e.message === 'ResizeObserver loop limit exceeded' ||
        e.message === 'Script error.' ||
        e.message ===
          'ResizeObserver loop completed with undelivered notifications.'
      ) {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div',
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay',
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
      if (element.id === nodesDetail[0].id && listStaffSelect.length > 0) {
        element.data.staffSelect = listStaffSelect.filter(
          (item: StaffType) => item.id === element.id,
        )[0].staffSelect;
      }
      element.data.onAddNode = addNode;
      if (isShow) {
        element.data.isShow = true;
      }
      if (!isShow) {
        element.data.isShow = false;
      }
      if (i + 1 === nodes.length) {
        element.data.isLast = true;
      }
      if (i + 1 < nodes.length) {
        element.data.isLast = false;
      }
      if (!isEdit && !isCopy) {
        if (i === 0) {
          element.data.isFirst = true;
        }
        if (i > 0) {
          element.data.isFirst = false;
        }
      } else if (isEdit || isCopy) {
        element.data.onRemoveNode = () => handleNodeDelete(element.id);
        if (WorkFlowDetail?.firstNode === element.id) {
          element.data.isFirst = true;
        } else {
          element.data.isFirst = false;
        }
      }
    }
  }, [nodes, listStaffSelect]);

  useEffect(() => {
    const initialFilter = {
      page: 1,
      limit: 10000,
    };
    dispatch(actions.fetchListStaff(initialFilter));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      getGenerateCode();
    }
  }, []);

  const renderTarget = (backNode: any) => {
    if (backNode.id !== WorkFlowDetail?.firstNode) {
      return 'e';
    } else {
      return 'd';
    }
  };

  useEffect(() => {
    if (isEdit && WorkFlowDetail) {
      const newinitialNodes: any[] = [];
      const newinitialEdges: any[] = [];
      const listStaffSelected: StaffType[] = [];
      const newlistCode: CodeType[] = [];
      const newlistNextStep: CodeType[] = [];
      const newlistBackStep: CodeType[] = [];
      let yPosCurrent = 0;

      WorkFlowDetail?.workFlows.length > 0 &&
        WorkFlowDetail?.workFlows.map((item: any, index: number) => {
          // const data = documentService.postGenarateCode(genarateCode);
          newinitialNodes.push({
            id: item.id,
            type: 'customeNodes',
            position: {
              x: 100,
              y: yPosCurrent,
            },
            data: {
              name: item.name,
              staff: item.staffs.map((item: any) => item.id),
              staffSelect: item.staffs.map((item: any) => item),
            },
          });
          yPosCurrent += 130;
          listStaffSelected.push({
            id: item.id,
            staffSelect: item.staffs,
          });
          newinitialEdges.push({
            id: item.code,
            source: item.id,
            target: item.nextNode ? item.nextNode.id : '',
            style: { strokeWidth: 1, stroke: '#2FB350' },
            type: 'smoothstep',
            label: 'Duyệt',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#2FB350',
            },
          });
          newinitialEdges.push({
            id: item.id,
            style: {
              stroke: 'red',
              strokeWidth: 1,
            },
            type: 'smoothstep',
            label: 'Từ chối',
            markerEnd: {
              color: 'red',
              type: 'arrowclosed',
            },
            source: item.id,
            sourceHandle: 'c',
            target: item.backNode ? item.backNode.id : '',
            targetHandle: item.backNode ? renderTarget(item.backNode) : '',
          });

          newlistCode.push({
            id: item.id,
            code: item.code,
          });
          newlistNextStep.push({
            id: item.id,
            code: item.nextNode ? item.nextNode.code : '',
          });
          newlistBackStep.push({
            id: item.id,
            code: item.backNode ? item.backNode.code : '',
          });
        });
      setListNextStep(newlistNextStep);
      setListBackStep(newlistBackStep);
      setListCode(newlistCode);
      setEdges(newinitialEdges);
      setNodes(newinitialNodes);
      const nodeDetail: any[] = [];
      nodeDetail.push(newinitialNodes[0]);
      setNodesDetail(nodeDetail);

      setListStaffSelect(listStaffSelected);
    } else if (isCopy && WorkFlowDetail) {
      const newinitialNodes: any[] = [];
      const newinitialEdges: any[] = [];
      const listStaffSelected: StaffType[] = [];
      const newlistCode: CodeType[] = [];
      const newlistNextStep: CodeType[] = [];
      const newlistBackStep: CodeType[] = [];
      let yPosCurrent = 0;
      WorkFlowDetail?.workFlows.length > 0 &&
        WorkFlowDetail?.workFlows.map((item: any, index: number) => {
          newinitialNodes.push({
            id: item.id,
            type: 'customeNodes',
            position: {
              x: 100,
              y: yPosCurrent,
            },
            data: {
              name: item.name,
              staff: item.staffs.map((item: any) => item.id),
              staffSelect: item.staffs.map((item: any) => item.id),
            },
          });
          yPosCurrent += 130;
          listStaffSelected.push({
            id: item.id,
            staffSelect: item.staffs,
          });
          newinitialEdges.push({
            id: item.code,
            source: item.id,
            target: item.nextNode ? item.nextNode.id : '',
            style: { stroke: '#2FB350' },
          });
          newinitialEdges.push({
            id: item.id,
            style: {
              stroke: 'red',
              strokeWidth: 1,
            },
            type: 'smoothstep',
            label: 'Từ chối',
            markerEnd: {
              color: 'red',
              type: 'arrowclosed',
            },
            source: item.id,
            sourceHandle: 'c',
            target: item.backNode ? item.backNode.id : '',
            targetHandle: item.backNode ? renderTarget(item.backNode) : '',
          });

          newlistCode.push({
            id: item.id,
            code: item.code,
          });
          newlistNextStep.push({
            id: item.id,
            code: item.nextNode ? item.nextNode.code : '',
          });
          newlistBackStep.push({
            id: item.id,
            code: item.backNode ? item.backNode.code : '',
          });
        });
      setListNextStep(newlistNextStep);
      setListBackStep(newlistBackStep);
      setListCode(newlistCode);
      setEdges(newinitialEdges);
      setNodes(newinitialNodes);
      setListStaffSelect(listStaffSelected);
      if (newinitialNodes) {
        const nodeDetail: any[] = [];
        nodeDetail.push(newinitialNodes[0]);
        setNodesDetail(nodeDetail);
      }
    } else {
      const newinitialNodes = [
        {
          id: '1',
          type: 'customeNodes',
          position: { x: 100, y: 0 },
          data: {
            name: 'Khởi tạo',
            staff: [],
          },
        },
      ];
      setNodes(newinitialNodes);
      setNodesDetail(newinitialNodes);
    }
    const urlParams = new URLSearchParams(window.location.search);
    setTypeProcess(urlParams.get('type')?.toString());
    setNameProcess(urlParams.get('name')?.toString());
  }, [WorkFlowDetail]);

  const getGenerateCode = async () => {
    const data = await documentService.postGenarateCode(genarateCode);
    const listCode: CodeType[] = [];
    listCode.push({
      id: '1',
      code: data,
    });
    setListCode(listCode);
  };

  const yPos = useRef(0);

  const {
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
  });

  const handleCancel = () => {
    navigate('/process-management');
    dispatch(ProcessActions.clearDataProcess());
  };

  const onConnect =
    // useCallback(
    (params: any) => {
      if (params.targetHandle === 'a') {
        const newListNextStep = [
          ...listNextStep,
          {
            id: params.source,
            code: listCode.filter(item => item.id === params.target)[0].code,
          },
        ];
        setListNextStep(newListNextStep);
        (params.label = 'Duyệt'),
          (params.style = {
            stroke: '#2FB350',
            strokeWidth: 1,
          });
        params.markerEnd = {
          color: '#2FB350',
          type: 'arrowclosed',
        };
        setEdges(eds => addEdge(params, eds));
      }
      if (params.targetHandle === 'd' || params.targetHandle === 'e') {
        const newListBackStep = [
          ...listBackStep,
          {
            id: params.source,
            code: listCode.filter(item => item.id === params.target)[0].code,
          },
        ];
        setListBackStep(newListBackStep);
        (params.label = 'Từ chối'),
          (params.style = {
            stroke: 'red',
            strokeWidth: 1,
          });
        params.markerEnd = {
          color: 'red',
          type: 'arrowclosed',
        };
        setEdges(eds => addEdge(params, eds));
      }
    };
  // [setEdges, nodes, setListBackStep, setListNextStep],
  // );

  const handleNodeClick = (event: any, node: Node) => {
    const newNode = [node];
    setNodesDetail(newNode);
    setIsHide(false);
  };

  const newNodes = useMemo(() => {
    const updateListNode = nodes.filter(item => item.id !== idRemove);
    setNodes(updateListNode);
    setIsHide(true);
  }, [idRemove]);

  const handleNodeDelete = (id: string) => {
    setIdRemove(id);
  };

  const addNode = async () => {
    const dataCode = await documentService.postGenarateCode(genarateCode);
    if (isEdit || isCopy) {
      yPos.current = nodes[nodes.length - 1].position.y;
    }
    yPos.current += 130;
    const newId = Math.random().toString();
    const newListCode = [
      ...listCode,
      {
        id: newId,
        code: dataCode,
      },
    ];
    setListCode(newListCode);
    const newNodes = [
      ...nodes,
      {
        id: newId,
        type: 'customeNodes',
        position: { x: 100, y: yPos.current },
        data: {
          name: '',
          staff: staffManagement?.data,
          onRemoveNode: () => handleNodeDelete(newId),
        },
      },
    ];
    const newListStaff = [
      ...listStaffSelect,
      {
        id: newId,
        staffSelect: [],
      },
    ];
    setListStaffSelect(newListStaff as StaffType[]);
    setNodes(newNodes as any);
  };

  const handleSubmitWorkFlow = () => {
    if (nodes.length === 1) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng thêm bước vào quy trình',
          type: 'warning',
        }),
      );
      return;
    }
    if (edges.length === 1) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng vẽ điều kiện',
          type: 'warning',
        }),
      );
      return;
    }
    const listWorkFlow: ListCreateWorkFlow[] = [];
    for (let index = 0; index < listStaffSelect.length; index++) {
      const element = listStaffSelect[index];
      if (index !== 0 && element.staffSelect.length < 1) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng thêm nhân viên vào quy trình',
            type: 'warning',
          }),
        );
        return;
      }
    }
    nodes?.forEach((item, index) => {
      if (isEdit) {
        listWorkFlow.push({
          id: item.id,
          code: listCode.filter((data: any) => data.id === item.id)[0].code,
          nextStepCode:
            listNextStep.find(nextStep => nextStep.id === item.id) !== undefined
              ? listNextStep.filter(data => data.id === item.id)[
                  listNextStep.filter(data => data.id === item.id).length - 1
                ].code
              : '',
          backStepCode:
            listBackStep.find(backStep => backStep.id === item.id) !== undefined
              ? listBackStep.filter(data => data.id === item.id)[
                  listBackStep.filter(data => data.id === item.id).length - 1
                ].code
              : '',
          name: item.data.name,
          typeTimeOut: 'MINUTE',
          timeOut: 24,
          staffIds: listStaffSelect
            .filter((data: any) => data.id === item.id)[0]
            .staffSelect.map((item: StaffType) => item.id),
        });
      } else {
        listWorkFlow.push({
          code: listCode.filter((data: any) => data.id === item.id)[0].code,
          nextStepCode:
            listNextStep.find(nextStep => nextStep.id === item.id) !== undefined
              ? listNextStep.filter(data => data.id === item.id)[
                  listNextStep.filter(data => data.id === item.id).length - 1
                ].code
              : '',
          backStepCode:
            listBackStep.find(backStep => backStep.id === item.id) !== undefined
              ? listBackStep.filter(data => data.id === item.id)[
                  listBackStep.filter(data => data.id === item.id).length - 1
                ].code
              : '',
          name: item.data.name,
          typeTimeOut: 'MINUTE',
          timeOut: 24,
          staffIds: listStaffSelect
            .filter((data: any) => data.id === item.id)[0]
            .staffSelect.map((item: StaffType) => item.id),
        });
      }
    });
    if (isEdit) {
      const payload = {
        id: id,
        name: WorkFlowDetail?.name,
        type: WorkFlowDetail?.type,
        firstNodeCode: listCode.filter(
          (data: CodeType) => data.id === nodes[0].id,
        )[0].code,
        listCreateWorkFlow: listWorkFlow,
      };
      dispatch(
        ProcessActions.updateWorkFlowTree(payload, (err?: any) => {
          if (err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật quy trình thành công',
                type: 'success',
              }),
            );
            setTimeout(() => {
              navigate(`/process-management`, {
                state: {
                  tabActive: 1,
                },
              });
            }, 500);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  err?.response?.data?.message ||
                  'Cập nhật quy trình không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    } else {
      const payload = {
        name: nameProcess?.toString(),
        type: typeProcess?.toString(),
        firstNodeCode: listCode.filter(
          (data: CodeType) => data.id === nodes[0].id,
        )[0].code,
        listCreateWorkFlow: listWorkFlow,
      };

      dispatch(
        ProcessActions.createWorkFlow(payload, (err?: any) => {
          if (err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: isCopy
                  ? 'Nhân bản quy trình thành công'
                  : 'Tạo quy trình thành công',
                type: 'success',
              }),
            );
            setTimeout(() => {
              navigate(`/process-management`, {
                state: {
                  tabActive: 1,
                },
              });
            }, 500);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  err?.response?.data?.message ||
                  (isCopy
                    ? 'Nhân bản quy trình không thành công'
                    : 'Tạo quy trình không thành công'),
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  return (
    <>
      {!isShow && (
        <Box
          display={'flex'}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center', width: '80%' }}>
            <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
              <img src={BACK_ICON} onClick={handleCancel} />
            </Box>
            <Tooltip
              title={
                isEdit
                  ? WorkFlowDetail?.name
                  : get(WorkflowType, typeProcess || '')
              }
            >
              <Typography
                fontSize={'20px'}
                fontWeight={700}
                lineHeight={'24px'}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {isEdit
                  ? WorkFlowDetail?.name
                  : get(WorkflowType, typeProcess || '')}
              </Typography>
            </Tooltip>
          </Box>
          <Box
            display={'flex'}
            sx={{
              alignItems: 'center',
              width: '20%',
              justifyContent: 'flex-end',
            }}
          >
            <CustomButton
              title="Hủy"
              sxProps={{
                ml: '16px',
                borderRadius: '8px',
                width: { xs: 'auto' },
                height: { xs: '44px' },
              }}
              sxPropsText={{ fontSize: '14px' }}
              handleClick={handleCancel}
            />
            <CustomButton
              title="Lưu"
              isIcon
              sxProps={{
                ml: '16px',
                borderRadius: '8px',
                width: { xs: 'auto' },
                height: { xs: '44px' },
              }}
              sxPropsText={{ fontSize: '14px' }}
              handleClick={handleSubmitWorkFlow}
              // isDisable={isEdit ? true : false}
            />
          </Box>
        </Box>
      )}
      <div style={{ width: '100%', height: '90vh', display: 'flex' }}>
        <div
          style={{ width: isShow || isHide ? '100%' : '80%', height: '90vh' }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              elementsSelectable={nodes as any}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={!isShow ? handleNodeClick : undefined}
              onConnect={onConnect}
              nodeTypes={
                isEdit && WorkFlowDetail?.isUsed ? nodeTyoesNotEdit : nodeTypes
              }
              attributionPosition="bottom-left"
              fitView
              nodesDraggable={isShow ? false : true}
              nodesConnectable={isShow ? false : true}
              connectOnClick={false}
              // connectionLineStyle={connectionLineStyle}
              defaultEdgeOptions={defaultEdgeOptions}
            >
              <Controls />
              <Background gap={15} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        {isShow != undefined && !isShow ? (
          <CreatePanel
            nodesDetail={nodesDetail}
            setNodesDetail={setNodesDetail}
            nodes={nodes}
            setNodes={setNodes}
            listStaffSelect={listStaffSelect}
            setListStaffSelect={setListStaffSelect}
          />
        ) : !isHide ? (
          <CreatePanel
            nodesDetail={nodesDetail}
            setNodesDetail={setNodesDetail}
            nodes={nodes}
            setNodes={setNodes}
            listStaffSelect={listStaffSelect}
            setListStaffSelect={setListStaffSelect}
          />
        ) : null}
      </div>
    </>
  );
}
