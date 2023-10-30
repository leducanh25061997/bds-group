import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  DialogActions,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from 'app/components/Button';
import FieldInfo from 'app/pages/TransactionManagement/components/BookingDetail/FieldInfo';
import palette from 'styles/theme/palette';
import { useForm } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useDispatch, useSelector } from 'react-redux';

import { AdditionalProductItem, ProductItem } from '../../slice/types';
import { useProductTableActionsSlice } from '../../slice';
import { selectProductTable } from '../../slice/selectors';

interface EditProductFormProps {
  open: boolean;
  onClose: () => void;
  item: AdditionalProductItem;
  onSave: () => void;
  isGround: boolean;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  open,
  onClose,
  item,
  onSave,
  isGround = false,
}) => {
  const dispatch = useDispatch();
  const { actions } = useProductTableActionsSlice();
  const { uploadedProductTableList } = useSelector(selectProductTable);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<AdditionalProductItem>>({
    defaultValues: {
      code: item.code,
      block: item.block,
      floor: item.floor,
      status: item.status,
      bedRoom: item.bedRoom,
      direction: item.direction,
      subscription: item.subscription,
      corner: item.corner,
      carpetArea: item.carpetArea,
      builtUpArea: item.builtUpArea,
      unitPrice: item.unitPrice,
      unitPriceVat: item.unitPriceVat,
      price: item.price,
      priceVat: item.priceVat,
    },
  });

  const handleClose = () => {
    onClose();
  };

  // const handleCloseConfirm = () => {
  //   setIsOpen(false)
  // }
  // check giá trị nhận vào không giống với các code khác và có thể bằng giá trị đang edit
  const isUniqueCode = (value: string) => {
    return (
      !uploadedProductTableList.data.products.some(
        product => product.code === value,
      ) ||
      value === item.code ||
      'Mã sản phẩm đã tồn tại'
    );
  };

  const handleSave = (data: AdditionalProductItem) => {
    dispatch(
      actions.editProduct({
        uuid: item.uuid,
        ...data,
      }),
    );
    onSave();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'md'}
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
        <DialogContent
          sx={{
            px: 3.5,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextFieldCustom
                name="code"
                control={control}
                label="Mã sản phẩm"
                errors={errors}
                isRequired
                rules={{
                  validate: {
                    isUniqueCode,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="block"
                control={control}
                label={isGround ? 'Phân khu' : 'Block'}
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="floor"
                control={control}
                label={isGround ? 'Lô' : 'Tầng'}
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="status"
                control={control}
                label="Trạng thái sản phẩm"
                errors={errors}
                isRequired
              />
            </Grid>
            {!isGround && (
              <Grid item xs={6}>
                <TextFieldCustom
                  name="bedRoom"
                  control={control}
                  label="Phòng ngủ"
                  errors={errors}
                  isRequired
                  type="text"
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextFieldCustom
                name="direction"
                control={control}
                label="Hướng"
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="subscription"
                control={control}
                label="View 1"
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="corner"
                control={control}
                label={`${isGround ? 'Lô' : 'Căn'} góc`}
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="carpetArea"
                control={control}
                label="Diện tích thông thuỷ"
                errors={errors}
                isRequired
                format="float_number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="builtUpArea"
                control={control}
                label="Diện tích tim tường"
                errors={errors}
                isRequired
                format="float_number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="unitPrice"
                control={control}
                label="Đơn giá"
                errors={errors}
                isRequired
                type="currency"
                format="float_number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="unitPriceVat"
                control={control}
                label="Đơn giá (Có VAT)"
                errors={errors}
                isRequired
                type="currency"
                format="float_number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="price"
                control={control}
                label="Giá"
                errors={errors}
                isRequired
                type="currency"
                format="float_number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCustom
                name="priceVat"
                control={control}
                label="Giá (Có VAT)"
                errors={errors}
                isRequired
                type="currency"
                format="float_number"
              />
            </Grid>
          </Grid>
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
              title="Hủy"
              variant="outlined"
              handleClick={() => onClose()}
              sxProps={{
                borderRadius: '8px',
                minWidth: '135px',
                ':hover': {
                  border: `1px solid ${palette.primary.button}`,
                  color: palette.common.white,
                  background: palette.primary.button,
                },
              }}
              sxPropsText={{ fontWeight: 400 }}
            />
            <Button
              title="Lưu cập nhật"
              typeButton="submit"
              sxProps={{
                background: '#D45B7A',
                borderRadius: '8px',
                minWidth: '135px',
              }}
              sxPropsText={{ color: '#FFFFFF' }}
              handleClick={() => handleSubmit(handleSave)()}
            />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProductForm;
