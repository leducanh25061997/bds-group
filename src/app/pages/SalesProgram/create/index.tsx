/* eslint-disable no-nested-ternary */
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import {
  ApartmentInformationSParams,
  SubDataProtype,
} from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import CREATE_ICON from 'assets/background/add-icon-pink.svg';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import palette from 'styles/theme/palette';
import { useProfile } from 'app/hooks';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import dayjs from 'dayjs';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import { ProjectTypeEnum } from 'types/Project';
import { selectProject } from 'app/pages/Projects/slice/selector';

import { useSalesProgramSlice } from '../slice';
import { selectSalesProgram } from '../slice/selectors';
import {
  FilterProduct,
  PayloadSalesProgram,
  PayloadUpdateSalesProgram,
  SalesProductsItem,
} from '../slice/types';

interface Props {
  isEdit?: boolean;
}

interface SalesProgramRequest {
  nameSalesProgram: string;
  datestart: string;
  dateend: string;
  timestart: string;
  timeend: string;
  eventTimeStart: string;
  eventDateStart: string;
  eventTimeEnd: string;
  eventDateEnd: string;
  isDefault: boolean;
}

export default function CreateSalesProgram(props: Props) {
  const { isEdit } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { apartmentInformation, settingTableProduct } = useSelector(
    selectApartmentInformation,
  );
  const { detailSalesProgram, productManagement, isLoading } =
    useSelector(selectSalesProgram);
  const params = useParams();
  const { id, salesprogramId } = params;
  const dispatch = useDispatch();
  const { actions } = useApartmentInformationsSlice();
  const { actions: SalesProgramActions } = useSalesProgramSlice();
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { informationProject } = useSelector(selectManagementInformation);
  const [checkedItems, setCheckedItems] = useState<SubDataProtype[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [productSelectd, setProductSelected] = useState<SalesProductsItem[]>(
    [],
  );
  const [codeSelectd, setCodeSelected] = useState<SalesProductsItem[]>([]);
  const [optionBlock, setOptionBlock] = useState<any>();
  const [optionFloor, setOptionFloor] = useState<any>();
  const [isCheckDefault, setIsCheckDefault] = useState<boolean>(false);
  const { ProjectDetail } = useSelector(selectProject);

  const [disableEdit, setDisableEdit] = useState(false);

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const {
    control,
    formState: { errors },
    setError,
    getValues,
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
  });

  const handleCancel = useCallback(() => {
    navigate(`/project/project-setting/${id}?type=1`);
    dispatch(SalesProgramActions.clearDataProduct());
  }, [dispatch, id, navigate, SalesProgramActions]);

  useEffect(() => {
    if (!canEdit && !isEdit) handleCancel();
  }, [canEdit, isEdit, handleCancel]);

  useEffect(() => {
    if (id) {
      const params: ApartmentInformationSParams = {
        idProject: id,
        isPriority: false,
      };
      dispatch(actions.fetchDatatable(params));
      dispatch(actions.fetchSettingTableProduct(params));
      dispatch(projectSettingActions.fetchInformationProject(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function toDateWithOutTimeZone(date: any) {
    const tempTime = date.split(':');
    const seconds = +tempTime[0] * 60 * 60 + +tempTime[1] * 60;
    return seconds * 1000;
  }

  useEffect(() => {
    if (settingTableProduct && settingTableProduct.length > 0) {
      const option: any[] = [{ id: 'all', key: 'Chọn tất cả', value: 'all' }];
      settingTableProduct.forEach(data => {
        option.push({
          id: data.projectId,
          key: data.block,
          value: data.block,
        });
      });
      setOptionBlock(option);
    }
    if (informationProject) {
      setValue('datestart', informationProject.startDate);
      setValue('dateend', informationProject.endDate);
      setValue(
        'timestart',
        informationProject.startTime !== 'Invalid date' &&
          informationProject.startTime != null
          ? dayjs(
              new Date(toDateWithOutTimeZone(informationProject.startTime))
                .toISOString()
                .split('.')[0],
            )
          : '',
      );
      setValue(
        'timeend',
        informationProject.endTime !== 'Invalid date' &&
          informationProject.endTime != null
          ? dayjs(
              new Date(toDateWithOutTimeZone(informationProject.endTime))
                .toISOString()
                .split('.')[0],
            )
          : '',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingTableProduct, informationProject]);

  useEffect(() => {
    const updatedListParams: SalesProductsItem[] = [];
    const updatedListCode: any[] = [];
    checkedItems.forEach(item => {
      const blockIndex = updatedListParams.findIndex(
        param => param.blockName === item.block,
      );
      if (blockIndex !== -1) {
        updatedListParams[blockIndex].products.push(item.id);
        updatedListCode[blockIndex].products.push(item);
      } else {
        updatedListParams.push({
          blockName: item.block,
          floor: item.floor,
          products: [item.id],
        });
        updatedListCode.push({
          blockName: item.block,
          floor: item.floor,
          products: [item],
        });
      }
    });
    setProductSelected(updatedListParams);
    setCodeSelected(updatedListCode);
  }, [checkedItems]);

  useEffect(() => {
    if (isEdit) {
      setDisableEdit(
        detailSalesProgram?.status === 'DISABLED' ||
          detailSalesProgram?.isOpenSales ||
          false,
      );
      if (detailSalesProgram) {
        setValue('nameSalesProgram', detailSalesProgram.name);
        setValue(
          'datestart',
          moment(detailSalesProgram.startDate).utc().format('MM/DD/YYYY'),
        );
        setValue(
          'dateend',
          moment(detailSalesProgram.endDate).utc().format('MM/DD/YYYY'),
        );
        setValue(
          'timestart',
          moment(detailSalesProgram.startDate).utc().format('YYYY-MM-DD HH:mm'),
        );
        setValue(
          'timeend',
          moment(detailSalesProgram.endDate).utc().format('YYYY-MM-DD HH:mm'),
        );
        setValue(
          'eventDateStart',
          moment(detailSalesProgram.startEvent).utc().format('MM/DD/YYYY'),
        );
        setValue(
          'eventDateEnd',
          moment(detailSalesProgram.endEvent).utc().format('MM/DD/YYYY'),
        );
        setValue(
          'eventTimeStart',
          moment(detailSalesProgram.startEvent)
            .utc()
            .format('YYYY-MM-DD HH:mm'),
        );
        setValue(
          'eventTimeEnd',
          moment(detailSalesProgram.endEvent).utc().format('YYYY-MM-DD HH:mm'),
        );
        setIsCheckDefault(detailSalesProgram?.isDefault);
        const ids: any[] = [];
        for (
          let index = 0;
          index < detailSalesProgram.openSaleProducts.length;
          index++
        ) {
          const element = detailSalesProgram.openSaleProducts[index].products;
          apartmentInformation?.data?.[
            detailSalesProgram?.openSaleProducts?.[index]?.blockName
          ]
            ?.filter(item => element.includes(item.id))
            .forEach(data => {
              ids.push(data);
            });
        }
        setCheckedItems(ids);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailSalesProgram, apartmentInformation]);

  const productList = useMemo(() => {
    if (productManagement && productManagement.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Không có sản phẩm nào',
          type: 'warning',
        }),
      );
    }
    return productManagement || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productManagement]);

  useEffect(() => {
    if (productList && productList.length > 0) {
      const isSubset = productList.every((item2: any) => {
        return checkedItems.some(item1 => item1.id === item2.id);
      });
      setSelectAll(isSubset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList]);

  // Remove old state
  useEffect(() => {
    return () => {
      dispatch(SalesProgramActions.clearDataProduct());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (item: any) => () => {
    const currentIndex = checkedItems.findIndex(
      checkedItem => checkedItem.id === item.id,
    );
    const newCheckedItems = [...checkedItems];

    if (currentIndex === -1) {
      newCheckedItems.push(item);
    } else {
      newCheckedItems.splice(currentIndex, 1);
    }

    setCheckedItems(newCheckedItems);
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      // const listCheckedItem = [...checkedItems];

      const newList = [...checkedItems, ...productList].reduce(
        (uniqueArr, obj) => {
          if (!uniqueArr.some((item: any) => item.id === obj.id)) {
            uniqueArr.push(obj);
          }
          return uniqueArr;
        },
        [] as any,
      );

      // productList.forEach((item: any) => {
      //   listCheckedItem.push(item);
      // });
      setCheckedItems(newList as any);
    } else {
      const updatedArray = checkedItems.filter((element: any) => {
        return !productList.some(
          (item: any) => item.id === element.id && item.data === element.data,
        );
      });
      setCheckedItems(updatedArray);
    }
    setSelectAll(!selectAll);
  };

  const handleAddProduct = () => {
    let block = '';
    let floor = '';

    if (getValues('block') && getValues('block') !== 'all') {
      block = getValues('block');
    }

    if (getValues('floor') && getValues('floor') !== 'all') {
      floor = getValues('floor');
    }

    const params: FilterProduct = {
      projectID: id,
      block,
      floor,
      status: 'Kho',
    };
    dispatch(SalesProgramActions.fetchListProduct(params));
  };

  const onSubmit = (data: SalesProgramRequest) => {
    const formData = { ...data };
    if (
      !moment(formData.eventDateStart).isBetween(
        moment(formData.datestart),
        moment(formData.dateend),
      )
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Thời gian bắt đầu sự kiện phải trong thời gian chương trình bán hàng',
          type: 'error',
        }),
      );
      return;
    }
    // else if (
    //   moment(formData.eventDateStart).isSame(moment(formData.dateend)) &&
    //   moment(formData.eventTimeStart).isAfter(moment(formData.timeend))
    // ) {
    //   dispatch(
    //     snackbarActions.updateSnackbar({
    //       message:
    //         'Thời gian bắt đầu sự kiện phải trong thời gian chương trình bán hàng',
    //       type: 'error',
    //     }),
    //   );
    //   return;
    // }
    if (moment(formData.eventDateEnd).isAfter(moment(formData.dateend))) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Thời gian kết thúc sự kiện phải trước thời gian kết thúc chương trình bán hàng',
          type: 'error',
        }),
      );
      return;
    } else if (
      moment(formData.eventDateEnd).isSame(moment(formData.dateend)) &&
      moment(formData.eventTimeEnd).isAfter(moment(formData.timeend))
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Thời gian kết thúc sự kiện phải trước thời gian kết thúc chương trình bán hàng',
          type: 'error',
        }),
      );
      return;
    }
    formData.datestart = moment(formData.datestart).format('DD/MM/YYYY');
    formData.dateend = moment(formData.dateend).format('DD/MM/YYYY');
    formData.eventDateStart = moment(formData.eventDateStart).format(
      'DD/MM/YYYY',
    );
    formData.eventDateEnd = moment(formData.eventDateEnd).format('DD/MM/YYYY');

    formData.timestart = formData.timestart
      ? moment(new Date(formData.timestart)).format('HH:mm')
      : '00:00';
    formData.timeend = formData.timeend
      ? moment(new Date(formData.timeend)).format('HH:mm')
      : '00:00';
    formData.eventTimeStart = formData.eventTimeStart
      ? moment(new Date(formData.eventTimeStart)).format('HH:mm')
      : '00:00';
    formData.eventTimeEnd = formData.eventTimeEnd
      ? moment(new Date(formData.eventTimeEnd)).format('HH:mm')
      : '00:00';
    if (isEdit) {
      const payload: PayloadUpdateSalesProgram = {
        id: salesprogramId,
        name: formData.nameSalesProgram,
        startDate: formData.timestart + ' ' + formData.datestart,
        endDate: formData.timeend + ' ' + formData.dateend,
        startEvent: formData.eventTimeStart + ' ' + formData.eventDateStart,
        endEvent: formData.eventTimeEnd + ' ' + formData.eventDateEnd,
        isDefault: isCheckDefault,
        projectId: id?.toString(),
        openSaleProducts: productSelectd,
      };
      dispatch(
        SalesProgramActions.updateDataSalesProgram(payload, (res?: any) => {
          if (res.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật chương trình bán hàng thành công',
                type: 'success',
              }),
            );
            navigate(`/project/project-setting/${id}?type=1`);
          } else {
            if (res.response.status === 400) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Ngày bắt đầu phải trước ngày kết thúc',
                  type: 'warning',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật chương trình bán hàng thất bại',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    } else {
      const payload: PayloadSalesProgram = {
        name: formData.nameSalesProgram,
        startDate: formData.timestart + ' ' + formData.datestart,
        endDate: formData.timeend + ' ' + formData.dateend,
        startEvent: formData.eventTimeStart + ' ' + formData.eventDateStart,
        endEvent: formData.eventTimeEnd + ' ' + formData.eventDateEnd,
        isDefault: isCheckDefault,
        projectId: id?.toString(),
        openSaleProducts: productSelectd,
      };
      dispatch(
        SalesProgramActions.createSalesProgram(payload, (res?: any) => {
          if (res.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo chương trình bán hàng thành công',
                type: 'success',
              }),
            );
            setTimeout(() => {
              navigate(`/project/project-setting/${id}?type=1`);
            }, 1000);
          } else {
            if (res.response.status === 400) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: res.response?.data?.message[0] || '',
                  type: 'warning',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo chương trình bán hàng thất bại',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    }
  };

  const handleSelectBlock = (value: any) => {
    const option: any[] = [{ id: 'all', key: 'Chọn tất cả', value: 'all' }];
    settingTableProduct?.forEach(data => {
      if (data.block === value || value === 'all') {
        const dataArray = data.dataFloor.split(',');
        dataArray.forEach((item, index) => {
          option.push({
            id: index,
            key: item,
            value: item,
          });
        });
      }
    });
    setOptionFloor(option);
  };

  const handleSelectFloor = (value: any) => {
    const option: any[] = [];
  };

  const handleDeletedBlock = () => {
    setValue('block', null);
  };

  const handleDeletedFloor = () => {
    setValue('floor', null);
  };

  return (
    <Box
      pb={'43px'}
      mt={'-10px'}
      style={{
        background: theme.palette.grey[0],
        padding: '24px',
        borderRadius: '20px',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
              <img src={BACK_ICON} alt="back" onClick={handleCancel} />
            </Box>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              {isEdit ? detailSalesProgram?.name : `Tạo chương trình bán hàng`}
            </Typography>
          </Box>
          {canEdit && (
            <CustomButton
              title={'Lưu cập nhật'}
              isDisable={false}
              isIcon
              typeButton={'submit'}
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
            />
          )}
        </Grid>
        <Box sx={{ width: '95%', marginTop: '26px' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Tên chương trình"
                placeholder="Nhập tên chương trình"
                name="nameSalesProgram"
                control={control}
                errors={errors}
                setError={setError}
                isRequired
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={'22px'}>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Ngày bắt đầu"
                placeholder="Nhập ngày bắt đầu"
                name="datestart"
                type="date"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Thời gian bắt đầu"
                placeholder="Nhập thời gian bắt đầu"
                name="timestart"
                type="time"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Ngày kết thúc"
                placeholder="Nhập ngày kết thúc"
                type="date"
                name="dateend"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Thời gian kết thúc"
                placeholder="Nhập thời gian kết thúc"
                type="time"
                name="timeend"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={'22px'}>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Sự kiện bắt đầu"
                placeholder="Nhập ngày bắt đầu"
                name="eventDateStart"
                type="date"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Thời gian bắt đầu"
                placeholder="Nhập thời gian bắt đầu"
                name="eventTimeStart"
                type="time"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Sự kiện kết thúc"
                placeholder="Nhập ngày kết thúc"
                type="date"
                name="eventDateEnd"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCustom
                label="Thời gian kết thúc"
                placeholder="Nhập thời gian kết thúc"
                type="time"
                name="eventTimeEnd"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          </Grid>
          <Box
            sx={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}
          >
            <Checkbox
              checked={isCheckDefault}
              sx={{
                color: '#7A7A7A',
                '&.Mui-checked': {
                  color: '#2FB350',
                  borderRadius: 20,
                },
              }}
              onClick={() => setIsCheckDefault(!isCheckDefault)}
              disabled={!canEdit}
            />
            <Typography sx={{ fontSize: '14px', color: '#1E1E1E' }}>
              Chọn làm chương trình hiển thị mặc định
            </Typography>
          </Box>
        </Box>
      </form>
      <Divider sx={{ margin: '20px 0' }} />
      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1E1E1E' }}>
        Chọn sản phẩm mở bán
      </Typography>
      <Box sx={{ width: '95%', marginTop: '26px' }}>
        <Grid container spacing={2} mt={'22px'}>
          <Grid item xs={3}>
            <TextFieldCustom
              label="Chọn Block"
              placeholder="Chọn Block"
              name="block"
              type="select"
              disabled={disableEdit || !canEdit}
              control={control}
              errors={errors}
              setError={setError}
              options={optionBlock}
              onChange={handleSelectBlock}
              handleDeleted={handleDeletedBlock}
            />
          </Grid>
          {ProjectDetail?.type === ProjectTypeEnum.APARTMENT && (
            <Grid item xs={3}>
              <TextFieldCustom
                label="Chọn tầng"
                placeholder="Chọn tầng"
                name="floor"
                type="select"
                disabled={disableEdit || !canEdit}
                control={control}
                errors={errors}
                setError={setError}
                options={optionFloor}
                onChange={handleSelectFloor}
                handleDeleted={handleDeletedFloor}
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <CustomButton
              handleClick={handleAddProduct}
              typeButton="submit"
              title="Thêm vào CTBH"
              isIcon
              variant="outlined"
              buttonMode="create"
              isDisable={disableEdit || !canEdit}
              iconNode={
                <img
                  src={CREATE_ICON}
                  alt="Plus Icon"
                  style={{ marginRight: '10px' }}
                />
              }
              sxProps={{
                color: palette.primary.button,
                borderRadius: '8px',
                mt: 1,
                width: 'max-content',
              }}
              sxPropsText={{
                fontWeight: 400,
                fontSize: '14px',
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          width: '95%',
          border: '1px solid #C8CBCF',
          borderRadius: '8px',
          padding: '10px 5px 21px 5px',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : productList && productList.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                marginLeft: '20px',
                fontStyle: 'italic',
                color: '#7A7A7A',
                marginTop: '10px',
              }}
            >
              Chưa có sản phẩm nào
            </Typography>
          </Box>
        ) : (
          <div>
            {productList && productList.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  sx={{
                    color: '#7A7A7A',
                    '&.Mui-checked': {
                      color: '#2FB350',
                    },
                  }}
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                  Chọn tất cả
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr));',
                maxHeight: '300px',
                overflow: 'auto',
              }}
            >
              {productList &&
                productList.length > 0 &&
                productList.map((item: any, index: number) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'start',
                      marginTop: '17px',
                      marginLeft: '9px',
                      flex: '1 0 auto',
                    }}
                    key={index}
                  >
                    <Checkbox
                      sx={{
                        color: '#7A7A7A',
                        '&.Mui-checked': {
                          color: '#2FB350',
                        },
                        padding: '0px 5px 0 0',
                      }}
                      checked={checkedItems.some(
                        checkedItem => checkedItem.id.toString() === item.id,
                      )}
                      onChange={handleToggle(item)}
                    />
                    <Box
                      sx={{
                        border: '1px solid #C8CBCF',
                        padding: '6px',
                        borderRadius: '5px',
                        marginRight: '12px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#000000',
                        }}
                      >
                        {item.code}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </div>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#1E1E1E',
          marginTop: '36px',
          maxWidth: 'max-content',
        }}
      >
        {`Sản phẩm đã chọn (${checkedItems.length})`}
      </Typography>
      {codeSelectd && codeSelectd.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '14px',
              marginLeft: '20px',
              fontStyle: 'italic',
              color: '#7A7A7A',
              marginTop: '10px',
            }}
          >
            Chưa có sản phẩm đã chọn
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: '95%',
            backgroundColor: '#FEF4FA',
            borderRadius: '8px',
            marginTop: '8px',
            padding: '10px 5px 21px 17px',
          }}
        >
          <Box
            sx={{
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            {codeSelectd &&
              codeSelectd.length > 0 &&
              codeSelectd.map((item, index) => (
                <Box key={index}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1E1E1E',
                      marginBottom: '12px',
                    }}
                  >
                    Block {item.blockName} ({item.products.length})
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      display: '-webkit-box',
                      flexWrap: 'wrap',
                    }}
                  >
                    {item.products.length > 0 &&
                      item.products.map((data: any, index) => (
                        <Box
                          key={index}
                          sx={{
                            border: '1px solid #C8CBCF',
                            borderRadius: '5px',
                            padding: '6px',
                            marginRight: '8px',
                            display: 'flex',
                            // alignItems: 'center',
                            background: '#FFFFFF',
                            marginBottom: '8px',
                            justifyContent: 'space-between',
                            flex: '1 0 auto',
                            width: '100px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 400,
                              color: '#000000',
                              fontSize: '12px',
                            }}
                          >
                            {data?.code}
                          </Typography>
                          {canEdit && !disableEdit && (
                            <img
                              src={CLOSE_ICON}
                              alt="close"
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                              onClick={handleToggle(data)}
                            />
                          )}
                        </Box>
                      ))}
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
