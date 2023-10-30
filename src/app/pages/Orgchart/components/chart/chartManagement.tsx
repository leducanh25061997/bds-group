import { Avatar, Box, Divider, Grid, Stack, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import STAFF_ICON from 'assets/background/icon-staff-pink.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import palette from 'styles/theme/palette';

import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { selectOrgchart } from '../../slice/selector';
import { PayloadCreateOrgchart } from '../../slice/types';

const initialNodes = [
  {
    id: '1',
    type: 'orgchartNodes',
    position: { x: 0, y: 0 },
    data: {
      name: 'Cánh quân 1',
      staff: 'Nguyễn Tiến Anh',
      position: 'Giám đốc dự án',
    },
  },
  {
    id: '2',
    type: 'orgchartNodes',
    position: { x: -115, y: 135 },
    data: {
      name: 'Trưởng phòng 1',
      staff: 'Nguyễn Văn Nguyên',
      position: 'Trưởng phòng',
    },
  },
  {
    id: '3',
    type: 'orgchartNodes',
    position: { x: 115, y: 135 },
    data: {
      name: 'Trường phòng 2',
      staff: 'Nguyễn Công Trí Dũng',
      position: 'Trưởng phòng',
    },
  },
  {
    id: '4',
    type: 'orgchartNodes',
    position: { x: -230, y: 270 },
    data: {
      name: 'Trưởng nhóm 1',
      staff: 'Nguyễn Văn Nguyên',
      position: 'Trưởng nhóm',
    },
  },
  {
    id: '5',
    type: 'orgchartNodes',
    position: { x: 0, y: 275 },
    data: {
      name: 'Trưởng nhóm 2',
      staff: 'Nguyễn Văn A',
      position: 'Trưởng nhóm',
    },
  },
];
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'step',
    sourceHandle: 'a',
    style: { stroke: palette.primary.button },
  },
];

const nodeTypes = { orgchartNodes: customeNodesNode };
interface Props {
  idShowOrgChart?: string;
}

function customeNodesNode(itemChild: any, isConnectable: boolean) {
  const onChange = useCallback(evt => {
    console.log(evt.target.value);
  }, []);
  return (
    <Stack
      sx={{
        border: itemChild.selected ? '3px solid #D6465F' : '1px solid #EB94A3',
        borderRadius: '8px',
        width: { md: '187px' },
        // height: { md: '85px' },
        p: '5px',
      }}
    >
      {!itemChild?.data?.isFirst && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: '#D6465F', width: '10px', height: '10px' }}
        />
      )}
      <Typography
        fontWeight={700}
        fontSize={'14px'}
        color={palette.primary.button}
        textAlign={'center'}
      >
        {itemChild?.data?.name}
      </Typography>
      <Divider
        sx={{
          background: palette.primary.button,
          width: '90%',
          my: 1,
          mx: '5%',
        }}
      />
      <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', ml: 1 }}>
        <Avatar
          sx={{ width: 28, height: 28 }}
          // src="https://i.ibb.co/f9M2bwg/278238193-3052363221682674-5550266724405196590-n.jpg"
        />
        <Stack sx={{ alignItems: 'flex-start', ml: 0.5 }}>
          <Typography style={{ color: 'black', fontWeight: 700, fontSize: 12 }}>
            {itemChild?.data?.manager?.fullName}
          </Typography>
          <Typography
            style={{ color: '#7A7A7A', fontWeight: 400, fontSize: 10 }}
          >
            {itemChild?.data?.manager?.position}
          </Typography>
          <Typography
            style={{
              color: '#7A7A7A',
              fontWeight: 400,
              fontSize: 10,
            }}
          >
            {itemChild?.data?.position}
          </Typography>
          {itemChild?.data?.countStaff > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={STAFF_ICON} alt="staff" width={16} height={11} />
              <Typography sx={{ fontSize: 10, color: '#1E1E1E', ml: 0.5 }}>
                {itemChild?.data?.countStaff} nhân viên
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        style={{ background: '#D6465F', width: '10px', height: '10px' }}
      />
    </Stack>
  );
}

export default function OrgChartManagement(props: Props) {
  const { idShowOrgChart } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const { t } = useTranslation();

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodesParent, setNodesParent] = useState<any>();
  const [nodesDetail, setNodesDetail] = useState<any>(null);
  const [isHandle, setIsHandle] = useState(false);

  const onConnect = (params: any) => {
    if (params) {
      return;
    }
  };

  const dataOrg = useMemo(() => {
    if (idShowOrgChart) {
      setIsHandle(true);
      return OrgchartManagement?.data?.filter(item =>
        item?.xPath.includes(idShowOrgChart || ''),
      );
    } else {
      setIsHandle(false);
      return OrgchartManagement?.data;
    }
  }, [OrgchartManagement]);

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
    if (dataOrg) {
      const orgChartParent = idShowOrgChart
        ? dataOrg?.filter(item => item?.id === idShowOrgChart)
        : dataOrg?.filter(item => item?.parentOrgChart === null);
      const orgChartChildren = dataOrg?.filter(
        item => item?.parentOrgChart !== null,
      );
      const newinitialNodes: any[] = [];
      let xPosition = 0;
      orgChartParent?.forEach((data: any, index: number) => {
        xPosition = xPosition + 350;
        newinitialNodes.push({
          id: data.id,
          type: 'orgchartNodes',
          position: {
            x:
              orgChartParent?.length > 1
                ? xPosition
                : index === 0
                ? -100
                : xPosition,
            y: 0,
          },
          data: {
            name: data.name,
            staff: data.staffs.map((item: any) => item.id),
            manager: data?.manager,
            isFirst: true,
            backNode: null,
            nextNode:
              data?.id !== undefined
                ? dataOrg?.filter(item => item?.parentOrgChart?.id === data?.id)
                : null,
            countStaff: data?.countStaff,
          },
          draggable: idShowOrgChart ? false : true,
        });
      });
      let positionX = 0;
      orgChartChildren?.forEach(data => {
        positionX = positionX + 300;
        newinitialNodes.push({
          id: data.id,
          type: 'orgchartNodes',
          position: {
            x: positionX,
            y: 200,
          },
          data: {
            name: data.name,
            staff: data.staffs.map((item: any) => item.id),
            manager: data?.manager,
            isFirst: false,
            backNode:
              data?.parentOrgChart?.id !== undefined
                ? dataOrg?.filter(
                    item => item?.id === data?.parentOrgChart?.id,
                  )[0]?.id
                : null,
            nextNode:
              data?.id !== undefined
                ? dataOrg?.filter(item => item?.parentOrgChart?.id === data?.id)
                : null,
            countStaff: data?.countStaff,
          },
          draggable: idShowOrgChart ? false : true,
        });
      });
      setNodes(newinitialNodes);
      setNodesParent(newinitialNodes);
    }
  }, [dataOrg]);

  function updatePositionRecursively(
    nodes: any[],
    nodeId: string,
    xOffset: number = 200,
  ) {
    const node = nodes.find(item => item.id === nodeId);
    if (!node) {
      return;
    }

    if (node.data?.backNode) {
      const backNode = nodes.find(item => item.id === node.data.backNode);
      if (backNode) {
        node.position.x = backNode.position.x;
        node.position.y = backNode.position.y + 200;
      }
    }

    for (const childNodeId of node.data?.nextNode || []) {
      updatePositionRecursively(nodes, childNodeId, xOffset);
    }
  }

  function updatePositions(data: any) {
    const updatedData = [...data];
    const distanceBetweenNodesY = 200;
    const distanceBetweenNodesX = 200;

    const nodeXPositions: Record<string, number> = {};

    for (let i = 0; i < updatedData.length; i++) {
      const currentNode = updatedData[i];

      if (currentNode.data.nextNode && currentNode.data.nextNode.length > 0) {
        const totalNextNodes = currentNode.data.nextNode.length;
        const yOffset = distanceBetweenNodesY;

        const totalWidthOfChildren = totalNextNodes * distanceBetweenNodesX;
        const startX = currentNode.position.x - totalWidthOfChildren / 2;

        let xOffset = 0;

        for (let j = 0; j < currentNode.data.nextNode.length; j++) {
          const nextNode = currentNode.data.nextNode[j];
          const matchingNode = updatedData.find(
            node => node.id === nextNode.id,
          );
          if (matchingNode) {
            let newX = startX + xOffset;
            while (
              nodeXPositions[newX] &&
              matchingNode.position.y !== currentNode.position.y + yOffset
            ) {
              newX += distanceBetweenNodesX;
            }
            nodeXPositions[newX] = 1;

            matchingNode.position.x = newX;
            matchingNode.position.y = currentNode.position.y + yOffset;

            xOffset += distanceBetweenNodesX;
          }
        }
      } else {
        const parentX = currentNode.position.x;
        const yOffset = distanceBetweenNodesY;
        currentNode.position.y += yOffset;

        if (currentNode.data.backNode) {
          const backNode = updatedData.find(
            node => node.id === currentNode.data.backNode.id,
          );
          if (backNode) {
            currentNode.position.x = backNode.position.x;
          } else {
            currentNode.position.x = parentX;
          }
        } else {
          currentNode.position.x = parentX;
        }
      }
    }

    return updatedData;
  }

  function adjustNodePositions(nodes: any) {
    const nodeMap = new Map();
    const backNodeMap = new Map();

    nodes.forEach((node: any) => {
      const positionY = node.position.y;
      if (!nodeMap.has(positionY)) {
        nodeMap.set(positionY, []);
      }
      nodeMap.get(positionY).push(node);

      if (node.data.backNode) {
        if (!backNodeMap.has(node.data.backNode)) {
          backNodeMap.set(node.data.backNode, []);
        }
        backNodeMap.get(node.data.backNode).push(node);
      }
    });

    nodeMap.forEach(nodeGroup => {
      if (nodeGroup.length > 1) {
        nodeGroup.sort((a: any, b: any) => a.position.x - b.position.x);

        const totalNodes = nodeGroup.length;
        const distanceBetweenNodesX = 200;

        const totalWidth = totalNodes * distanceBetweenNodesX;

        let initialXOffset = -(totalWidth / 2);

        if (initialXOffset + nodeGroup[0].position.x > 0) {
          initialXOffset = -nodeGroup[0].position.x;
        }

        for (let i = 0; i < nodeGroup.length; i++) {
          const node = nodeGroup[i];
          const xOffset = initialXOffset + i * distanceBetweenNodesX;
          const backNodes = backNodeMap.get(node.id);
          if (backNodes && backNodes.length > 0) {
            const backNode = backNodes[0];
            if (backNode.position.y === node.position.y) {
              node.position.y = backNode.position.y + 150;
            }
          }
          node.position.x = xOffset;
        }
      }
    });

    return nodes;
  }

  const handleUpdatePositions = (data: any) => {
    if (idShowOrgChart) {
      const updatedData = updatePositions(data);
      setNodes([...updatedData]);
    } else {
      const orgChartParent = dataOrg?.filter(
        item => item?.parentOrgChart === null,
      );
      if (orgChartParent?.length! > 1) {
        const updatedData = updatePositions(data);
        setNodes([...updatedData]);
      } else {
        const updatedData = adjustNodePositions(updatePositions(data));
        setNodes([...updatedData]);
      }
    }
  };

  const redirectToCreatePage = () => navigate(path.createOrgchart);

  useEffect(() => {
    if (nodesParent) {
      const newinitialEdges: any[] = [];
      const _newinitialNodes: any[] = [...nodes];
      nodesParent?.forEach((data: any, index: number) => {
        if (data?.data?.nextNode && data?.data?.nextNode?.length > 0) {
          data?.data?.nextNode?.forEach((item: any) => {
            newinitialEdges.push({
              id: data.id,
              source: data?.id,
              target: item?.id ? item?.id : '',
              style: { strokeWidth: 1, stroke: '#D6465F' },
              sourceHandle: 'b',
              targetHandle: 'a',
              type: 'smoothstep',
            });
          });
        }
      });
      setEdges(newinitialEdges);
      _newinitialNodes?.forEach((data: any) => {
        updatePositionRecursively(_newinitialNodes, data.id);
      });
      setNodes(_newinitialNodes);
      for (let index = 0; index < nodesParent.length; index++) {
        handleUpdatePositions(nodes);
      }
    }
  }, [nodesParent]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  const submit = async (data: PayloadCreateOrgchart) => {};

  const onError: SubmitErrorHandler<PayloadCreateOrgchart> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const onNodeClick = (event: any, node: any) => {
    const dataSelect = node.id;
    setNodesDetail(dataSelect);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box pb={'43px'} mt={'-10px'}>
      <form onSubmit={handleSubmit(submit, onError)}>
        <Grid
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {!idShowOrgChart && (
            <Box display={'flex'} sx={{ alignItems: 'center' }}>
              <Typography
                fontSize={'20px'}
                fontWeight={700}
                lineHeight={'24px'}
              >
                Sơ đồ tổ chức
              </Typography>
            </Box>
          )}
          <Stack flexDirection={'row'}>
            {nodesDetail && !idShowOrgChart && (
              <CustomButton
                title={'Chỉnh sửa'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                  // width: { md: '93px' },
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                handleClick={() => {
                  navigate(`/orgchart/edit/${nodesDetail}`);
                }}
              />
            )}
            {nodesDetail && !idShowOrgChart && (
              <CustomButton
                title={'Xem chi tiết'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                  ml: '16px',
                  // width: { md: '93px' },
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                handleClick={() => {
                  navigate(`/orgchart/detail/${nodesDetail}`);
                }}
              />
            )}
            {!idShowOrgChart && (
              <CustomButton
                title={t(translations.common.addNew)}
                isIcon
                buttonMode={'create'}
                sxProps={{
                  background: palette.primary.button,
                  borderRadius: 1,
                  ml: '16px',
                }}
                handleClick={redirectToCreatePage}
              />
            )}
          </Stack>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          sx={{ background: 'white', mt: '10px', borderRadius: '12px' }}
        >
          <div style={{ width: '100%', height: '85vh' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              attributionPosition="bottom-left"
              fitView
              nodesConnectable={false}
              style={
                { pointerEvents: isHandle ? 'none' : '' } as React.CSSProperties
              }
              autoPanOnNodeDrag={false}
            >
              <Controls />
              {/* <MiniMap /> */}
              <Background gap={15} size={1} />
            </ReactFlow>
          </div>
        </Grid>
      </form>
    </Box>
  );
}
