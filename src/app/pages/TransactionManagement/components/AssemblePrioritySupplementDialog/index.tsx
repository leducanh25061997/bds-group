import {
  Box,
  Typography,
  Checkbox,
  Grid,
  Dialog,
  DialogTitle,
  FormControlLabel,
  DialogContent,
  FormGroup,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import FilterSelect from 'app/components/FilterSelect';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { PriorityStatus } from 'types/Enum';

import { selectSalesProgram } from 'app/pages/SalesProgram/slice/selectors';

import { SalesProgramItem } from 'app/pages/SalesProgram/slice/types';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import { selectProject } from 'app/pages/Projects/slice/selector';
import { ProjectTypeEnum } from 'types/Project';

import {
  ApartmentInformationSParams,
  TableProductInformation,
} from '../ApartmentInformationManagement/slice/types';
import { useTransactionManagementSlice } from '../../slice';

import { useApartmentInformationsSlice } from '../ApartmentInformationManagement/slice';
import { selectApartmentInformation } from '../ApartmentInformationManagement/slice/selectors';
import { selectTransactionManagement } from '../../slice/selector';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const initialFilter = {
  idProject: '',
  saleId: '',
  productId: '',
  block: '',
  floor: '',
};

export function AssemblePrioritySupplementDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
  const methods = useForm();
  const [filter, setFilter] = useState<any>(initialFilter);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const { settingTableProduct, productCanOrderPrototype } = useSelector(
    selectApartmentInformation,
  );
  const dispatch = useDispatch();
  const { actions: apartmentInformationActions } =
    useApartmentInformationsSlice();
  const { actions: orgChartActions } = useOrgchartSlice();
  const params = useParams();
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const [orgCharts, SetOrgChart] = useState<any[]>([]);
  const [products, setProducts] = useState<TableProductInformation[]>([]);
  const { actions: transactionManagementAction } =
    useTransactionManagementSlice();
  const { id } = params;
  const [selecteds, setSelecteds] = useState<any[]>([]);
  const [productSelecteds, setProductSelecteds] = useState<any[]>([]);
  const [formRequest, setFormRequest] = useState<any[]>([]);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { settingSalesProgramId } = useSelector(selectTransactionManagement);
  const { salesProgramManagement } = useSelector(selectSalesProgram);
  const [saleProgram, setSaleProgram] = useState<SalesProgramItem>();
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const { informationProject } = useSelector(selectManagementInformation);
  const { ProjectDetail } = useSelector(selectProject);

  const isGround = ProjectDetail?.type === ProjectTypeEnum.GROUND;

  useEffect(() => {
    if (id && settingSalesProgramId) {
      const filter = {
        idProject: id,
        saleId: settingSalesProgramId,
      };
      setFilter(filter);
      fetchData(filter);
    }
  }, [id, settingSalesProgramId]);

  useEffect(() => {
    if (id) {
      dispatch(projectSettingActions.fetchInformationProject(id));
    }
  }, [id]);

  useEffect(() => {
    if (productCanOrderPrototype && productCanOrderPrototype.length > 0) {
      const _products = [];
      for (let i = 0; i < productCanOrderPrototype.length; i++) {
        _products.push({
          ...productCanOrderPrototype[i],
          name: productCanOrderPrototype[i].code,
        });
      }
      setProducts(_products);
    } else {
      setProducts([]);
    }
  }, [productCanOrderPrototype]);

  useEffect(() => {
    dispatch(orgChartActions.fetchListOrgchart());
  }, []);

  useEffect(() => {
    if (settingSalesProgramId && salesProgramManagement?.data) {
      const data = salesProgramManagement?.data.filter(
        item => item.id === settingSalesProgramId,
      );
      if (data.length > 0) {
        setSaleProgram(data[0]);
      }
    }
  }, [settingSalesProgramId, salesProgramManagement]);

  useEffect(() => {
    if (
      OrgchartManagement &&
      OrgchartManagement.data.length &&
      informationProject
    ) {
      const options = OrgchartManagement.data.filter(item =>
        informationProject.salesUnit.some(unit => unit.id === item.id),
      );
      SetOrgChart([{ id: '', name: 'Tất cả đơn vị' }, ...options]);
    }
  }, [OrgchartManagement]);

  useEffect(() => {
    if (settingTableProduct && settingTableProduct.length > 0) {
      const _blocks: any[] = [];
      for (let i = 0; i < settingTableProduct.length; i++) {
        _blocks.push({
          id: settingTableProduct[i].block,
          name: settingTableProduct[i].block,
        });
      }
      setBlocks(_blocks);
    }
  }, [settingTableProduct]);

  const handleClose = () => {
    onClose();
  };

  const fetchData = (filter: any) => {
    dispatch(
      apartmentInformationActions.fetchProductCanOrder({
        ...filter,
        idProject: id,
      }),
    );
  };

  const onSubmit = (data: any) => {};

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

  const handleChangeCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelecteds(products);
    } else {
      setSelecteds([]);
    }
    setIsCheckAll(event.target.checked);
  };

  const handleFilter = (value: string, field: string) => {
    if (
      field === 'block' &&
      settingTableProduct &&
      settingTableProduct.length > 0
    ) {
      const _dataFloor = settingTableProduct.filter(
        item => item.block === value,
      );
      if (_dataFloor.length > 0) {
        const _floors = [];
        const floors = _dataFloor[0].dataFloor.split(',').slice().reverse();
        for (let i = 0; i < floors.length; i++) {
          _floors.push({
            id: floors[i],
            name: floors[i],
          });
        }
        setFloors(_floors);
      }
    }
    const _filter = { ...filter, [field]: value ? value : '' };
    setFilter(_filter);
    fetchData(_filter);
    setSelecteds([]);
  };

  const handleRemove = (id: string) => {
    const _productSelecteds = productSelecteds.filter(item => item.id !== id);
    if (_productSelecteds.length < selecteds.length) {
      setIsCheckAll(false);
    }
    setSelecteds(_productSelecteds);
    const _formRequest = [...formRequest];
    setFormRequest(_formRequest.filter(item => item.productId !== id));
    setProductSelecteds(_productSelecteds);
    methods.unregister(`priority3.${id}`);
  };

  const handleAdd = () => {
    setProductSelecteds(selecteds);
    const _selecteds = [...selecteds];
    const listProductAndOrgChart = [];
    for (let i = 0; i < _selecteds.length; i++) {
      listProductAndOrgChart.push({
        productId: _selecteds[i].id,
        orgChartId: '',
      });
    }
    setFormRequest(listProductAndOrgChart);
  };

  const handleSelectItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any,
  ) => {
    const _selecteds: any[] = [...selecteds];
    _selecteds.push(value);
    const uniqueIds: any[] = [];

    const unique = _selecteds.filter(element => {
      const isDuplicate = uniqueIds.includes(element.id);

      if (!isDuplicate) {
        uniqueIds.push(element.id);

        return true;
      }

      return false;
    });

    if (event.target.checked) {
      if (unique.length === products.length) {
        setIsCheckAll(true);
      } else {
        setIsCheckAll(false);
      }

      setSelecteds(unique);
    } else {
      const dataFilter: string[] = _selecteds.filter(
        item => item.id !== value.id,
      );
      if (dataFilter.length === products.length) {
        setIsCheckAll(true);
      } else {
        setIsCheckAll(false);
      }
      setSelecteds(dataFilter);
    }
  };

  const handleSelected = (v: any, id: string) => {
    const _formRequest = [];
    if (v === 'Tất cả đơn vị') v = '';
    for (let i = 0; i < formRequest.length; i++) {
      if (formRequest[i].productId === id) {
        _formRequest.push({
          orgChartId: v,
          productId: id,
        });
      } else {
        _formRequest.push(formRequest[i]);
      }
    }
    setFormRequest(_formRequest);
  };

  const handleOpenPriority = () => {
    if (formRequest.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng chọn sản phẩm',
          type: 'error',
        }),
      );
      return;
    }
    if (settingSalesProgramId) {
      const formData = {
        settingSalesProgramId,
        listProductAndOrgChart: formRequest,
      };
      dispatch(
        apartmentInformationActions.createPostOpenPriorityAdditional(
          formData,
          (err?: any) => {
            if (err.success) {
              dispatch(
                transactionManagementAction.setPriorityStatus(
                  PriorityStatus.OPEN_PRIORITY_ADDITIONAL,
                ),
              );
              dispatch(orgChartActions.fetchListOrgchart());
              if (id) {
                const params: ApartmentInformationSParams = {
                  idProject: id,
                  isPriority: true,
                  saleId: settingSalesProgramId,
                };
                dispatch(apartmentInformationActions.fetchDatatable(params));
              }

              onClose();
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Mở ráp bổ sung ưu tiên thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    err.message || 'Mở ráp bổ sung ưu tiên không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
  };

  const handleDeleted = (v: string) => {
    const _filter = { ...filter };
    switch (v) {
      case 'block':
        setFilter({ ..._filter, block: '', floor: '', productId: '' });
        fetchData({ ..._filter, block: '', floor: '', productId: '' });
        methods.setValue('block', '');
        methods.setValue('floor', '');
        methods.setValue('productId', '');
        break;
      case 'floor':
        setFilter({ ..._filter, floor: '', productId: '' });
        fetchData({ ..._filter, floor: '', productId: '' });
        methods.setValue('floor', '');
        methods.setValue('productId', '');
        break;
      default:
        setFilter({ ..._filter, productId: '' });
        fetchData({ ..._filter, productId: '' });
        methods.setValue('productId', '');
        break;
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      // sx={{ zIndex: 1000000 }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '29px',
          color: '#1E1E1E',
        }}
      >
        {`Mở ráp bổ sung ưu tiên`}
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
      <DialogContent>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ padding: '0px 16px 10px 16px' }}>
            <Typography
              sx={{ color: '#1E1E1E', fontSize: '16px', lineHeight: '24px' }}
              textAlign={'center'}
            >
              {`Vui lòng chọn các thông tin sản phẩm để thực hiện mở ráp bổ sung ưu tiên.`}
            </Typography>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: '#ECECEE',
                  padding: '14px',
                  marginTop: '23px',
                }}
              >
                <Box
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Chương trình bán hàng:
                </Box>
                <Box
                  sx={{
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    marginLeft: '12px',
                  }}
                >
                  {saleProgram?.name}
                </Box>
              </Box>
            </Box>
            <Grid
              container
              spacing={2}
              mt={2}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Grid item md={isGround ? 12 : 6}>
                <TextFieldCustom
                  label="Chọn Block"
                  placeholder="Chọn Block"
                  control={methods.control}
                  name="block"
                  type="select"
                  errors={methods.formState.errors}
                  onChange={(v: any) => handleFilter(v, 'block')}
                  options={blocks}
                  handleDeleted={() => handleDeleted('block')}
                />
              </Grid>
              {!isGround && (
                <Grid item md={6}>
                  <TextFieldCustom
                    label="Chọn tầng"
                    placeholder="Chọn tầng"
                    disabled={!filter.block}
                    control={methods.control}
                    name="floor"
                    type="select"
                    errors={methods.formState.errors}
                    onChange={(v: any) => handleFilter(v, 'floor')}
                    handleDeleted={() => handleDeleted('floor')}
                    options={floors}
                  />
                </Grid>
              )}
              {/* <Grid item md={4}>
                <TextFieldCustom
                  label="Chọn sản phẩm"
                  placeholder="Chọn sản phẩm"
                  control={methods.control}
                  name="productId"
                  type="select"
                  errors={methods.formState.errors}
                  onChange={(v: any) => handleFilter(v, 'productId')}
                  handleDeleted={() => handleDeleted('productId')}
                  options={products}
                />
              </Grid> */}
            </Grid>
            <Box
              sx={{
                borderRadius: '8px',
                border: '1px solid #C8CBCF',
                padding: '16px 10px',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isCheckAll}
                          onChange={handleChangeCheckAll}
                          color="success"
                        />
                      }
                      label="Chọn tất cả"
                    />
                  </FormGroup>
                  {selecteds.length > 0 && (
                    <Box sx={{ display: 'flex' }}>
                      (
                      <Typography
                        sx={{ color: '#D6465F' }}
                      >{`${selecteds.length} `}</Typography>
                      <Box sx={{ marginLeft: '4px' }}>sản phẩm được chọn</Box>)
                    </Box>
                  )}
                </Box>
                <Box>
                  <CustomButton
                    title="Thêm vào DS chọn"
                    handleClick={handleAdd}
                    sxProps={{
                      background: '#FFFFFF',
                      border: '1px solid #D6465F',
                      borderRadius: '8px',
                      marginRight: '42px',
                      width: '100%',
                      fontSize: '14px',
                    }}
                    iconNode={
                      <Icon
                        icon="ic:baseline-plus"
                        color="#d6465f"
                        width="18"
                        height="18"
                      />
                    }
                    sxPropsText={{ color: '#D6465F' }}
                  />
                </Box>
              </Box>

              <FormGroup
                sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}
              >
                {products.map((product: any) => (
                  <FormControlLabel
                    key={product.id}
                    control={
                      <Checkbox
                        color="success"
                        checked={selecteds.some(item => item.id === product.id)}
                        onChange={e => handleSelectItem(e, product)}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          borderRadius: '4px',
                          border: '1px solid #C8CBCF',
                          padding: '4px',
                          marginTop: '12px',
                        }}
                      >
                        {product.name}
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>

            {productSelecteds.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    marginTop: '16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 'normal',
                  }}
                >
                  {`Sản phẩm đã chọn (${productSelecteds.length})`}
                </Typography>
                <Grid
                  container
                  // spacing={2}
                  mt={3}
                  sx={{
                    borderRadius: '8px 8px 0px 0px',
                    background: '#FDEAF4',
                    padding: '14px 24px',
                  }}
                >
                  <Grid item xs={1} md={1}>
                    <Typography fontWeight={700}>STT</Typography>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <Typography fontWeight={700}>Mã sản phẩm</Typography>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <Typography fontWeight={700}>Đơn vị sở hữu</Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography fontWeight={700}>Đơn vị bổ sung</Typography>
                  </Grid>
                  <Grid item xs={1} md={1}></Grid>
                </Grid>
                {productSelecteds.map((item: any, index: number) => (
                  <Grid
                    container
                    // spacing={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 3,
                    }}
                    key={`${item.id}`}
                  >
                    <Grid item xs={1} md={1}>
                      {index + 1}
                    </Grid>
                    <Grid item xs={3} md={3}>
                      {item.code}
                    </Grid>
                    <Grid item xs={3} md={3}>
                      {item?.orgChart?.name || '-'}
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <TextFieldCustom
                        placeholder="Tất cả đơn vị"
                        control={methods.control}
                        name={`priority3.${item.id}`}
                        type="select"
                        errors={methods.formState.errors}
                        options={orgCharts}
                        onChange={v => handleSelected(v, item.id)}
                      />
                    </Grid>
                    <Grid
                      item
                      md={1}
                      xs={1}
                      textAlign="center"
                      sx={{ cursor: 'pointer' }}
                    >
                      <Icon
                        onClick={() => handleRemove(item.id)}
                        icon="ph:x-bold"
                        color="#d6465f"
                        width="18"
                        height="18"
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}
            <Box
              mt={3}
              mb={2}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CustomButton
                title="Hủy"
                handleClick={() => onClose()}
                sxProps={{
                  background: '#FFFFFF',
                  border: '1px solid #D6465F',
                  borderRadius: '8px',
                  width: '128px',
                  marginRight: '42px',
                }}
                sxPropsText={{ color: '#1E1E1E' }}
              />
              <CustomButton
                title="Mở ráp bổ sung"
                handleClick={handleOpenPriority}
                isDisable={!(formRequest.length > 0)}
                sxProps={{
                  background: '#D45B7A',
                  borderRadius: '8px',
                  width: 'max-content',
                }}
                sxPropsText={{ color: '#FFFFFF' }}
              />
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
