import {
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { translations } from 'locales/translations';
import { useCallback, useEffect, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import TextFieldCustom from 'app/components/TextFieldCustom';
import palette from 'styles/theme/palette';

import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';
import path from 'app/routes/path';

import { selectOrgchart } from '../../slice/selector';
import { useOrgchartSlice } from '../../slice';
import { PayloadCreateOrgchart } from '../../slice/types';

const initialNodes = [
  {
    id: '1',
    type: 'customeNodes',
    position: { x: 0, y: 0 },
    data: {
      name: 'Cánh quân 1',
      staff: 'Nguyễn Tiến Anh',
      position: 'Giám đốc dự án',
    },
  },
  {
    id: '2',
    type: 'customeNodes',
    position: { x: -115, y: 135 },
    data: {
      name: 'Trưởng phòng 1',
      staff: 'Nguyễn Văn Nguyên',
      position: 'Trưởng phòng',
    },
  },
  {
    id: '3',
    type: 'customeNodes',
    position: { x: 115, y: 135 },
    data: {
      name: 'Trường phòng 2',
      staff: 'Nguyễn Công Trí Dũng',
      position: 'Trưởng phòng',
    },
  },
  {
    id: '4',
    type: 'customeNodes',
    position: { x: -230, y: 270 },
    data: {
      name: 'Trưởng nhóm 1',
      staff: 'Nguyễn Văn Nguyên',
      position: 'Trưởng nhóm',
    },
  },
  {
    id: '5',
    type: 'customeNodes',
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
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    sourceHandle: 'b',
    type: 'step',
    style: { stroke: palette.primary.button },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    sourceHandle: 'b',
    type: 'step',
    style: { stroke: palette.primary.button },
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    sourceHandle: 'b',
    type: 'step',
    style: { stroke: palette.primary.button },
  },
];

const nodeTypes = { customeNodes: customeNodesNode };
interface Props {
  isEdit?: boolean;
}

function customeNodesNode(itemChild: any, isConnectable: boolean) {
  const onChange = useCallback(evt => {
    console.log(evt.target.value);
  }, []);

  return (
    <Stack
      sx={{
        border: '1px solid #EB94A3',
        borderRadius: '8px',
        width: { md: '187px' },
        height: { md: '85px' },
        p: '5px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#D6465F', width: '10px', height: '10px' }}
      />
      <Typography
        fontWeight={700}
        fontSize={'14px'}
        color={palette.primary.button}
        textAlign={'center'}
      >
        {itemChild.data.name}
      </Typography>
      <Divider
        sx={{
          background: palette.primary.button,
          width: '90%',
          my: 1,
          mx: '5%',
        }}
      />
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', ml: 1 }}>
        <Avatar
          sx={{ width: 28, height: 28 }}
          src="https://i.ibb.co/f9M2bwg/278238193-3052363221682674-5550266724405196590-n.jpg"
        />
        <Stack sx={{ alignItems: 'flex-start', ml: 0.5 }}>
          <Typography style={{ color: 'black', fontWeight: 700, fontSize: 12 }}>
            {itemChild.data.staff}
          </Typography>
          <Typography
            style={{
              color: '#7A7A7A',
              fontWeight: 400,
              fontSize: 10,
            }}
          >
            {itemChild.data.position}
          </Typography>
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

export default function OrgchartView(props: Props) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [assetType, setAssetType] = useState<number | null>(null);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { isShowSidebar } = useSelector(layoutsSelector);
  const { OrgchartDetail } = useSelector(selectOrgchart);
  const { t } = useTranslation();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

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

  useEffect(() => {
  }, [dispatch, OrgchartActions]);

  useEffect(() => {
    assetType && dispatch(OrgchartActions.getAssetSector(assetType));
  }, [dispatch, OrgchartActions, assetType]);

  useEffect(() => {
    if (isEdit && OrgchartDetail) {
    }
  }, [isEdit, OrgchartDetail, setValue, dispatch]);

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

  const onNodeClick = (node: any) => {
    console.log('node', node);
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
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              Chi tiết sơ đồ tổ chức
            </Typography>
          </Box>
          <Stack flexDirection={'row'}>
            <CustomButton
              title={t(translations.common.back)}
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
                width: { md: '93px' },
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={handleCancel}
            />
            {/* <CustomButton
              title={t(translations.common.save)}
              isIcon
              typeButton={'submit'}
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
                ml: 1.5,
                width: { md: '113px' },
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={submit}
            /> */}
          </Stack>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          sx={{ background: 'white', mt: '10px', borderRadius: '12px' }}
        >
          <div style={{ width: '100%', height: '90vh' }}>
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
