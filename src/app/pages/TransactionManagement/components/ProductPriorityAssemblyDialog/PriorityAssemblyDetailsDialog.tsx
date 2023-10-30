/* eslint-disable eqeqeq */
import {
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

import { SubDataProtype } from '../ApartmentInformationManagement/slice/types';

import { TicketApprove } from '../../slice/type';

import { RenderKeyValue } from './components/RenderKeyValue';
import { RenderCustomer } from './components/RenderCustomer';

interface ProductPriorityAssemblyProtype {
  open: boolean;
  onClose: () => void;
  product: SubDataProtype;
}
interface Priority {
  priority1: TicketApprove | null;
  priority2: TicketApprove | null;
  priority3: TicketApprove | null;
}

export function PriorityAssemblyDetailsDialog(
  props: ProductPriorityAssemblyProtype,
) {
  const { open, onClose, product } = props;
  const [priority, setPriority] = useState<Priority>({
    priority1: null,
    priority2: null,
    priority3: null,
  });
  // console.log(priority, 'priority')
  useEffect(() => {
    if (product.priorities && product.priorities?.length > 0) {
      const prioriti: any = {
        priority1: null,
        priority2: null,
        priority3: null,
      };

      prioriti.priority1 =
        product.priorities.filter(
          item => item.order === 1 && item.ticket !== null,
        )[0]?.ticket || null;

      prioriti.priority2 =
        product.priorities.filter(
          item => item.order === 2 && item.ticket !== null,
        )[0]?.ticket || null;

      prioriti.priority3 =
        product.priorities.filter(
          item => item.order === 3 && item.ticket !== null,
        )[0]?.ticket || null;

      setPriority(prioriti);
    }
  }, [product]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'relative',
          background: '#1C293D',
          boxShadow: '-4px 0px 8px 0px rgba(0, 0, 0, 0.15)',
          color: '#FFFFFF',
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '29px',
          }}
        >
          {`Chi tiết ráp ưu tiên`}
        </DialogTitle>
        <Box
          sx={{
            position: 'absolute',
            right: '16px',
            top: '10px',
            cursor: 'pointer',
          }}
        >
          <Icon
            icon="mdi:remove"
            color="#d9d9d9"
            width="18"
            height="28"
            onClick={handleClose}
          />
        </Box>
        <DialogContent sx={{ padding: '10px 24px' }}>
          <Box mb={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '20px' }}
              >
                {product.code}
              </Typography>
              <Box
                ml={2}
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #636B78',
                  background: ' #1C293D',
                  padding: '2px 4px',
                }}
              >
                <Typography sx={{ fontSize: '10px', lineHeight: '12px' }}>
                  Đã ráp 1 ưu tiên
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                background: '#475160',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 12px',
                color: '#FFFFFF',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '20px',
                margin: '16px 0',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <Box>{product.block}</Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: '#FFFFFF',
                    margin: '2px 16px',
                    width: '2px',
                  }}
                />
                <Box>{product.floor}</Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: '#FFFFFF',
                    margin: '2px 16px',
                    width: '2px',
                  }}
                />
                <Box>{product.bedRoom}</Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: '#FFFFFF',
                    margin: '2px 16px',
                    width: '2px',
                  }}
                />
                <Box>{product.direction}</Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: '#FFFFFF',
                    margin: '2px 16px',
                    width: '2px',
                  }}
                />
                <Box>{product.subcription}</Box>
              </Box>
            </Box>
            <RenderKeyValue
              title="Diện tích tim tường"
              value={
                <Typography>
                  {`${product?.builtUpArea} m`}
                  <sup>2</sup>
                </Typography>
              }
            />
            <RenderKeyValue
              title={`Diện tích thông thủy`}
              value={
                <Typography>
                  {`${product?.builtUpArea} m`}
                  <sup>2</sup>
                </Typography>
              }
            />
            <RenderKeyValue
              title={`Đơn vị sở hữu`}
              value={<Typography>{product?.orgChart?.name || '-'}</Typography>}
            />
            <Box sx={{ margin: '24px 0' }}>
              <Divider />
            </Box>
            <Grid container spacing={2}>
              <Grid item md={4}>
                Ưu tiên 1
              </Grid>
              <Grid item md={4}>
                Ưu tiên 2
              </Grid>
              <Grid item md={4}>
                Ưu tiên 3
              </Grid>
              <Grid item md={4}>
                <RenderCustomer stt={`1`} data={priority.priority1} />
              </Grid>
              <Grid item md={4}>
                <RenderCustomer stt={`2`} data={priority.priority2} />
              </Grid>
              <Grid item md={4}>
                <RenderCustomer stt={`3`} data={priority.priority3} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
