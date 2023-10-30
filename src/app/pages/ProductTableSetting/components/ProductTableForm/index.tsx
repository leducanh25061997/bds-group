import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, IconButton, Typography, SvgIcon } from '@mui/material';

import TextFieldCustom from 'app/components/TextFieldCustom';
import { useFieldArray, useForm } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import { useParams } from 'react-router-dom';
import { formatBlockField, isBlockValid } from 'utils/helpers';
import palette from 'styles/theme/palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { useProductTableActionsSlice } from '../../slice';

import { BlockVisualization } from '../BlockVisualization';

import CreateBlockForm from '../CreateBlockForm';
import { BlockFields, PayloadProductTable } from '../../slice/types';
import { selectProductTable } from '../../slice/selectors';

export interface ProductTableFormData {
  data: BlockFields[];
  isDisable?: boolean;
}

const ProductTableForm = forwardRef<HTMLFormElement, any>((props, ref) => {
  const [showPreview, setShowPreview] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  const { actions } = useProductTableActionsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { productTableData } = useSelector(selectProductTable);
  const [isEdit, setIsEdit] = useState(false);

  const { id } = params;

  const createProductTable = useForm<ProductTableFormData>({
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: createProductTable.control,
    name: 'data',
  });

  const watchFieldsBlock = createProductTable.watch('data');
  const controlledFieldsBlock = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldsBlock[index],
    };
  });

  const blocks = useMemo(() => {
    return productTableData && productTableData.length > 0
      ? productTableData.map(({ projectId, ...rest }) => rest)
      : [];
  }, [productTableData]);

  useEffect(() => {
    if (id) {
      dispatch(
        actions.getProductTable({ id }, (err: any) => {
          if (!err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Lấy thông tin bảng hàng không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
    return () => {
      dispatch(actions.clearProductTableData());
    };
  }, [actions, dispatch, id, snackbarActions]);

  useEffect(() => {
    if (productTableData && productTableData.length > 0) setIsEdit(true);
    else setIsEdit(false);
  }, [productTableData]);

  useEffect(() => {
    createProductTable.reset({
      data: blocks,
    });
  }, [blocks, createProductTable]);

  const isUniqueName = (value: string) => {
    const formattedEls = value
      .trim()
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '');
    const uniqueEls = new Set(formattedEls);

    return formattedEls.length === uniqueEls.size || 'Tên không được trùng';
  };

  const metaCallback = useCallback(
    (err: any) => {
      const successMessage = isEdit
        ? 'Cập nhật bảng hàng thành công'
        : 'Tạo bảng hàng thành công';
      const errorMessage = isEdit
        ? 'Cập nhật bảng hàng không thành công'
        : 'Tạo bảng hàng không thành công';

      if (err?.success) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: successMessage,
            type: 'success',
          }),
        );
      } else {
        dispatch(
          snackbarActions.updateSnackbar({
            message: errorMessage,
            type: 'error',
          }),
        );
      }
    },
    [dispatch, snackbarActions, isEdit],
  );

  const handleSubmitProductTable = (data: ProductTableFormData) => {
    const blocksData: BlockFields[] = data.data.map(block => {
      return {
        block: block.block.trim(),
        dataFloor: formatBlockField(block.dataFloor),
        dataQuanlityProduct: formatBlockField(block.dataQuanlityProduct),
      };
    });

    const payload: PayloadProductTable = {
      id,
      data: blocksData,
    };

    dispatch(actions.createProductTable(payload, metaCallback));

    // !isEdit
    //   ? dispatch(actions.createProductTable(payload, metaCallback))
    //   : dispatch(actions.updateProductTable(payload, metaCallback));
  };

  return (
    <Box>
      <CreateBlockForm
        append={append}
        fields={controlledFieldsBlock}
        isDisable={props.isDisable}
      />
      <Box
        sx={{
          py: 1.5,
          px: 2.5,
          backgroundColor: '#F4F5F6',
          borderRadius: 1.5,
          mt: 2,
        }}
      >
        <form
          onSubmit={createProductTable.handleSubmit(handleSubmitProductTable)}
          ref={ref}
        >
          {!!fields.length && (
            <Grid
              container
              alignItems={'center'}
              columnSpacing={2}
              rowSpacing={0.5}
            >
              {fields.map((item, idx) => (
                <Grid key={item.id} container item spacing={2}>
                  <Grid item xs={3.5}>
                    <TextFieldCustom
                      name={`data.${idx}.block`}
                      placeholder="Nhập tên block"
                      isRequired
                      disabled={props.isDisable}
                      control={createProductTable.control}
                      errors={createProductTable.formState.errors}
                    />
                  </Grid>
                  <Grid item xs={3.5}>
                    <TextFieldCustom
                      name={`data.${idx}.dataFloor`}
                      placeholder="Nhập số tầng"
                      isRequired
                      disabled={props.isDisable}
                      control={createProductTable.control}
                      errors={createProductTable.formState.errors}
                      rules={{
                        validate: {
                          isValid: isBlockValid,
                          isUniqueName,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldCustom
                      name={`data.${idx}.dataQuanlityProduct`}
                      placeholder="Nhập số sản phẩm/tầng"
                      isRequired
                      disabled={props.isDisable}
                      control={createProductTable.control}
                      errors={createProductTable.formState.errors}
                      rules={{
                        validate: {
                          isValid: isBlockValid,
                          isUniqueName,
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center',
                    }}
                  >
                    {!props.isDisable && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => remove(idx)}
                      >
                        <ClearIcon sx={{ color: palette.primary.button }} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          )}
        </form>
      </Box>

      <Typography
        variant="caption"
        component="p"
        fontStyle="italic"
        sx={{
          mt: 1,
          color: '#D6465F',
        }}
      >
        <b>* Lưu ý: </b>Số tầng, số sản phẩm được quy định bằng số có 3 ký tự
        (có thể bao gồm số và ký tự. Vd 12A), được phân biệt bởi dấu phẩy “,”
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          mt: 2.5,
          mb: 0.5,
          color: '#7A7A7A',
          cursor: 'pointer',
        }}
        onClick={() => setShowPreview(!showPreview)}
      >
        <SvgIcon
          component={showPreview ? VisibilityIcon : VisibilityOffIcon}
          sx={{
            mr: 1,
          }}
        />
        Xem trước
      </Typography>
      {showPreview && <BlockVisualization fields={controlledFieldsBlock} />}
    </Box>
  );
});

ProductTableForm.displayName = 'TestForm';

export default ProductTableForm;
