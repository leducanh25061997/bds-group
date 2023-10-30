import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  DialogActions,
  Stack,
  FormGroupProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from 'app/components/Button';
import { Product } from 'types/ProductTable';

import { MovingProducts, SaleControlEnum } from '../../slice/types';
import { ActionsDialog } from '../ActionsDialog';

interface MoveProductsDialogProps {
  open: boolean;
  onClose: () => void;
  products: MovingProducts;
  onMoveProducts: (products: string[]) => void;
}

const MoveProductsDialog: React.FC<MoveProductsDialogProps> = ({
  open,
  onClose,
  products,
  onMoveProducts,
}) => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] =
    useState<boolean>(false);

  const combinedProducts = products.priorityProducts.concat(
    products.freeProducts,
  );

  // const handleCheckboxChange = (id: any) => {
  //   setCheckedList(prevCheckedList => {
  //     if (prevCheckedList.includes(id)) {
  //       return prevCheckedList.filter(checkedId => checkedId !== id);
  //     } else {
  //       return [...prevCheckedList, id];
  //     }
  //   });
  // };

  // const handleCheckAllChange = () => {
  //   if (checkedList.length === combinedProducts.length) {
  //     setCheckedList([]);
  //   } else {
  //     setCheckedList(combinedProducts.map(product => product.id));
  //   }
  // };

  const handleClose = () => {
    onClose();
  };

  const handleMoveProducts = () => {
    // console.log(checkedList);
    onMoveProducts(checkedList);
  };

  // const handleCloseConfirm = () => {
  //   setIsOpen(false)
  // }

  const handleCheckboxChange = (id: string[]) => {
    setCheckedList(id);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'lg'}
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
          Chuyển sản phẩm chưa giao dịch sang giai đoạn 2
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
          <Typography fontWeight={700}>
            Tổng sản phẩm chưa giao dịch sau giai đoạn 1:{' '}
            <Typography
              component={'span'}
              fontWeight={700}
              sx={{
                color: 'primary.darkRed',
              }}
            >
              {combinedProducts.length}
            </Typography>
          </Typography>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1.5,
              backgroundColor: 'primary.barList',
              mt: 1.75,
              px: 2.25,
              pt: 1.5,
              pb: 3,
            }}
          >
            {/* <FormGroup>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllChecked}
                      onChange={handleCheckAllChange}
                      disableRipple
                      sx={{
                        color: '#7A7A7A',
                        p: 0,
                        '&.Mui-checked': {
                          color: '#2FB350',
                        },
                      }}
                    />
                  }
                  label="Chọn tất cả"
                  sx={{
                    mx: 0,
                  }}
                />
                <Typography
                  sx={{
                    ml: 2,
                  }}
                >
                  (Đã chọn{' '}
                  <Typography component="span" color="primary.darkRed">
                    {checkedCount}
                  </Typography>
                  )
                </Typography>
              </Box>
              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography fontWeight={700}>Sản phẩm ưu tiên</Typography>
                </Grid>
                {products.priorityProducts.map(product => (
                  <Grid item xs={4} sm={3} md={2} lg={1.2} key={product.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedList.includes(product.id)}
                          onChange={() => handleCheckboxChange(product.id)}
                          disableRipple
                          sx={{
                            color: '#7A7A7A',
                            padding: 0,
                            '&.Mui-checked': {
                              color: '#2FB350',
                            },
                          }}
                        />
                      }
                      label={product.code}
                      sx={{
                        mx: 0,
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          px: '7px',
                          py: '6px',
                          background: '#fff',
                          border: '1px solid #C8CBCF',
                          borderRadius: 0.5,
                          mt: '3px',
                          ml: '2px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Typography fontWeight={700} mt={1}>
                    Sản phẩm tự do
                  </Typography>
                </Grid>
                {products.freeProducts.map(product => (
                  <Grid item xs={4} sm={3} md={2} lg={1.2} key={product.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedList.includes(product.id)}
                          onChange={() => handleCheckboxChange(product.id)}
                          disableRipple
                          sx={{
                            color: '#7A7A7A',
                            padding: 0,
                            '&.Mui-checked': {
                              color: '#2FB350',
                            },
                          }}
                        />
                      }
                      label={product.code}
                      sx={{
                        mx: 0,
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          px: '7px',
                          py: '6px',
                          background: '#fff',
                          border: '1px solid #C8CBCF',
                          borderRadius: 0.5,
                          mt: '3px',
                          ml: '2px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup> */}
            {products.freeProducts.length + products.priorityProducts.length >
            0 ? (
              <>
                {products.priorityProducts.length >= 1 && (
                  <ProductList
                    products={products.priorityProducts}
                    title="Sản phẩm ưu tiên"
                    onChecked={handleCheckboxChange}
                    checkedList={checkedList}
                  />
                )}
                {products.freeProducts.length >= 1 && (
                  <ProductList
                    products={products.freeProducts}
                    title="Sản phẩm chưa mở bán"
                    onChecked={handleCheckboxChange}
                    checkedList={checkedList}
                    containerProps={{
                      sx: {
                        mt: products.priorityProducts.length >= 1 ? 3 : 0,
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <Typography py={2} sx={{ textAlign: 'center' }}>
                Không còn sản phẩm
              </Typography>
            )}
          </Paper>
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
              title="Huỷ"
              variant="outlined"
              handleClick={handleClose}
              sxProps={{
                borderRadius: '8px',
                minWidth: { md: '128px' },
              }}
              sxPropsText={{
                fontWeight: 400,
              }}
            />
            <Button
              title="Chuyển sản phẩm"
              // variant="outlined"
              handleClick={() =>
                checkedList.length > 0 && setIsOpenConfirmDialog(true)
              }
              sxProps={{
                borderRadius: '8px',
                minWidth: { md: '128px' },
              }}
            />
          </Stack>
        </DialogActions>
      </Dialog>
      <ActionsDialog
        open={isOpenConfirmDialog}
        onClose={() => setIsOpenConfirmDialog(false)}
        handleSubmit={() => handleMoveProducts()}
        type={SaleControlEnum.MOVE_PRODUCT}
      />
    </>
  );
};

const ProductList = ({
  products,
  title,
  onChecked,
  checkedList,
  containerProps,
}: {
  products: Product[];
  title: string;
  onChecked: (products: string[]) => void;
  checkedList: string[];
  containerProps?: FormGroupProps;
}) => {
  const handleCheckboxChange = (id: any) => {
    // setCheckedList(prevCheckedList => {
    //   if (prevCheckedList.includes(id)) {
    //     const updatedList = prevCheckedList.filter(
    //       checkedId => checkedId !== id,
    //     );
    //     setCheckedList(updatedList);
    //     const newListId = checkedIds.filter(checkedId => checkedId !== id);
    //     onChecked(newListId);
    //     return updatedList;
    //   } else {
    //     const updatedList = [...prevCheckedList, id];
    //     onChecked([...checkedIds, id]);
    //     return updatedList;
    //   }
    // });

    const newCheckedList = checkedList.includes(id)
      ? checkedList.filter(checkedId => checkedId !== id)
      : [...checkedList, id];

    onChecked(newCheckedList);
  };

  const handleCheckAllChange = () => {
    const allProductIds = products.map(product => product.id);

    const newCheckedList = isAllChecked
      ? checkedList.filter(checkedId => !allProductIds.includes(checkedId))
      : checkedList.concat(
          allProductIds.filter(productId => !checkedList.includes(productId)),
        );

    onChecked(newCheckedList);

    // if (checkedList.length === products.length) {
    //   setCheckedList([]);
    //   const uniqueIds1 = checkedIds.filter(
    //     checkedIds => checkedList.indexOf(checkedIds) === -1,
    //   );
    //   const uniqueIds2 = checkedList.filter(
    //     checkedIds => checkedIds.indexOf(checkedIds) === -1,
    //   );

    //   onChecked(uniqueIds1.concat(uniqueIds2));
    // } else {
    //   const allProductIds = products.map(product => product.id);
    //   setCheckedList(allProductIds);

    //   const newIds = [...checkedIds, ...allProductIds];
    //   const uniqueArray = newIds.filter((value, index, array) => {
    //     return array.indexOf(value) === index;
    //   });

    //   onChecked(uniqueArray);
    // }
  };

  const checkedCount = products.filter(product =>
    checkedList.includes(product.id),
  ).length;

  const isAllChecked =
    checkedList.length > 0 &&
    products.every(product => checkedList.includes(product.id));

  return (
    <FormGroup {...containerProps}>
      <Typography fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllChecked}
              onChange={handleCheckAllChange}
              disableRipple
              sx={{
                color: '#7A7A7A',
                p: 0,
                '&.Mui-checked': {
                  color: '#2FB350',
                },
              }}
            />
          }
          label="Chọn tất cả"
          sx={{
            mx: 0,
          }}
        />
        <Typography
          sx={{
            ml: 2,
          }}
        >
          (Đã chọn{' '}
          <Typography component="span" color="primary.darkRed">
            {checkedCount}
          </Typography>
          )
        </Typography>
      </Box>

      <Grid container spacing={1.5} sx={{ mt: 1 }}>
        {products.map(product => (
          <Grid item xs={4} sm={3} md={2} lg={1.2} key={product.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedList.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                  disableRipple
                  sx={{
                    color: '#7A7A7A',
                    padding: 0,
                    '&.Mui-checked': {
                      color: '#2FB350',
                    },
                  }}
                />
              }
              label={product.code}
              sx={{
                mx: 0,
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  px: '7px',
                  py: '6px',
                  background: '#fff',
                  border: '1px solid #C8CBCF',
                  borderRadius: 0.5,
                  mt: '3px',
                  ml: '2px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};

export default MoveProductsDialog;
