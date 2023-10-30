import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  DialogActions,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from 'app/components/Button';
import FieldInfo from 'app/pages/TransactionManagement/components/BookingDetail/FieldInfo';
import { formatNumber } from 'utils/helpers';

import { ProductItem } from '../../slice/types';
import EditProductForm from '../EditProductForm';

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: ProductItem;
  onOpenEdit: () => void;
  isGround: boolean;
  isDisable?: boolean;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onClose,
  item,
  onOpenEdit,
  isGround = false,
  isDisable,
}) => {
  const handleClose = () => {
    onClose();
  };

  // const handleCloseConfirm = () => {
  //   setIsOpen(false)
  // }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
      >
        <DialogTitle
          sx={{
            m: 0,
            pt: 4,
            pb: 2,
            px: 3.5,
            textAlign: 'center',
            color: '#1E1E1E',
          }}
          variant="h4"
        >
          Chi tiết sản phẩm
          {!!onClose ? (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5}>
            <FieldInfo label="Mã sản phẩm:" content={item.code} />
            <FieldInfo
              label={isGround ? 'Phân khu:' : 'Block:'}
              content={item.block}
            />
            <FieldInfo
              label={isGround ? 'Lô:' : 'Tầng:'}
              content={item.floor}
            />
            <FieldInfo label="Trạng thái sản phẩm:" content={item.status} />
            {!isGround && (
              <FieldInfo label="Phòng ngủ:" content={item.bedRoom} />
            )}
            <FieldInfo label="Hướng:" content={item.direction} />
            <FieldInfo label="View 1:" content={item.subscription} />
            {/* <FieldInfo label="View 2:" content={'---'} /> */}
            <FieldInfo
              label={isGround ? 'Lô góc:' : 'Căn góc:'}
              content={item.corner}
            />
            <FieldInfo
              label={
                <>
                  Diện tích thông thủy
                  <Typography variant="body2" component={'span'}>
                    (m<sup>2</sup>)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.carpetArea)}m<sup>2</sup>
                </Typography>
              }
            />
            <FieldInfo
              label={
                <>
                  Diện tích tim tường
                  <Typography variant="body2" component={'span'}>
                    (m<sup>2</sup>)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.builtUpArea)}m<sup>2</sup>
                </Typography>
              }
            />
            <FieldInfo
              label={
                <>
                  Đơn giá/m<sup>2</sup>{' '}
                  <Typography variant="body2" component={'span'}>
                    (chưa VAT)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.unitPrice)}
                  <sup>đ</sup>
                </Typography>
              }
            />
            <FieldInfo
              label={
                <>
                  Đơn giá/m<sup>2</sup>{' '}
                  <Typography variant="body2" component={'span'}>
                    (có VAT)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.unitPriceVat)}
                  <sup>đ</sup>
                </Typography>
              }
            />
            <FieldInfo
              label={
                <>
                  Giá{' '}
                  <Typography variant="body2" component={'span'}>
                    (chưa VAT)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.price)}
                  <sup>đ</sup>
                </Typography>
              }
            />
            <FieldInfo
              label={
                <>
                  Giá{' '}
                  <Typography variant="body2" component={'span'}>
                    (có VAT)
                  </Typography>
                  :
                </>
              }
              content={
                <Typography variant="body2">
                  {formatNumber(item.priceVat)}
                  <sup>đ</sup>
                </Typography>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            py: 2.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Button
              title="Cập nhật sản phẩm"
              // variant="outlined"
              isDisable={isDisable}
              handleClick={() => {
                onOpenEdit();
              }}
              sxProps={{
                borderRadius: '8px',
                minWidth: { md: '128px' },
              }}
            />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetailDialog;
