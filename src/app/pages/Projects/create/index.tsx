import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import UploadFile from 'app/components/UploadFileImage';
import path from 'app/routes/path';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import MAP_ICON from 'assets/background/map-icon.svg';
import { translations } from 'locales/translations';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  default as document,
  default as documentService,
} from 'services/api/document';
import palette from 'styles/theme/palette';
import { FilterParams } from 'types';
import {
  ProjectFormEnum,
  ProjectOwnershipEnum,
  ProjectStatusEnum,
  ProjectTypeEnum,
} from 'types/Project';
import { Province } from 'types/User';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';
import { ProductType } from 'types/Enum';

import { useProjectSlice } from '../slice';
import { selectProject } from '../slice/selector';
import { PayloadCreateProject } from '../slice/types';

interface Props {
  isEdit?: boolean;
  isCreateContract?: boolean;
  handleClose?: () => void;
}

export function CreateProject(props: Props) {
  const { isEdit, handleClose } = props;
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset,
  } = useForm({
    mode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { actions } = useProjectSlice();
  const userInfo = useProfile();
  const { isLoading, ProjectDetail } = useSelector(selectProject);
  const { actions: snackbarActions } = useSnackbarSlice();
  const [isEsalekit, setIsSalekit] = useState(false);
  const [province, setProvince] = React.useState<string>('');
  const [listProvince, setListProvince] = useState<Province[]>([]);
  const [listDistrict, setListDistrict] = useState<Province[]>([]);
  const [listCommune, setListCommune] = useState<Province[]>([]);
  const [fileID, setFileID] = useState<any>('');
  const [logoProject, setLogoProject] = useState<any>('');

  const [paramsFilter, setParamsFilter] = useState<FilterParams>({
    key: 'province',
    province: '0',
    district: '0',
  });

  const ProjectType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Căn hộ',
        value: ProjectTypeEnum.APARTMENT,
      },
      {
        id: 2,
        key: 'Đất nền',
        value: ProjectTypeEnum.GROUND,
      },
      {
        id: 3,
        key: 'Biệt thự',
        value: ProjectTypeEnum.VILLA,
      },
      {
        id: 4,
        key: 'Khu nghỉ dưỡng/ Khu phức hợp',
        value: ProjectTypeEnum.RESORT,
      },
      {
        id: 5,
        key: 'Shophouse/ Nhà phố',
        value: ProjectTypeEnum.SHOP_HOUSE,
      },
      {
        id: 6,
        key: 'Khu đô thị thương mại',
        value: ProjectTypeEnum.COMMERCIAL_AREA,
      },
    ];
  }, []);
  const StatusType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Sắp mở bán',
        value: ProjectStatusEnum.ABOUT_TO_SALE,
      },
      {
        id: 2,
        key: 'Đang mở bán',
        value: ProjectStatusEnum.ON_SALE,
      },
      {
        id: 3,
        key: 'Đang bàn giao',
        value: ProjectStatusEnum.HANDING_OVER,
      },
      {
        id: 3,
        key: 'Đã bàn giao',
        value: ProjectStatusEnum.HANDED_OVER,
      },
    ];
  }, []);

  const FormType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Bán',
        value: ProjectFormEnum.SALE,
      },
      {
        id: 2,
        key: 'Cho thuê',
        value: ProjectFormEnum.LEASE,
      },
    ];
  }, []);

  const ProducFormType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Căn hộ cao cấp',
        value: ProductType.LUXURY,
      },
      {
        id: 2,
        key: 'Căn hộ Studio',
        value: ProductType.STUDIO,
      },
      {
        id: 2,
        key: 'Căn hộ chung cư',
        value: ProductType.APARTMENT,
      },
    ];
  }, []);

  const OwnershiType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Lâu dài',
        value: ProjectOwnershipEnum.INDEFINITE,
      },
      {
        id: 2,
        key: 'Có thời hạn <50 năm',
        value: ProjectOwnershipEnum.HAVE_TERM,
      },
    ];
  }, []);

  useEffect(() => {
    getProvinces();
    return () => {
      dispatch(actions.clearDataProject());
    };
  }, [actions, dispatch]);

  useEffect(() => {
    if (!isEdit) {
      getGenerateCode();
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && ProjectDetail) {
      getDistrics();
      getCommunes();
      reset({
        code: ProjectDetail?.code,
        name: ProjectDetail?.name,
        type: ProjectDetail?.type,
        status: ProjectDetail?.status,
        investor: ProjectDetail?.investor,
        scale: ProjectDetail?.scale,
        area: ProjectDetail?.area,
        form: ProjectDetail?.form,
        ownershipForm: ProjectDetail?.ownershipForm,
        startPrice: ProjectDetail?.startPrice,
        endPrice: ProjectDetail?.endPrice,
        ratioCommission: ProjectDetail?.ratioCommission,
        description: ProjectDetail?.description,
        province: ProjectDetail?.province,
        district: ProjectDetail?.district,
        classification: ProjectDetail?.classification,
        ward: ProjectDetail?.ward,
        address: ProjectDetail?.address,
      });
      setLogoProject(ProjectDetail?.avatarEsalekit);
      setFileID(ProjectDetail?.fileId);
      setIsSalekit(ProjectDetail?.isEsalekit);
    }
  }, [
    ProjectDetail?.code,
    ProjectDetail?.name,
    ProjectDetail?.type,
    ProjectDetail?.status,
    ProjectDetail?.investor,
    ProjectDetail?.scale,
    ProjectDetail?.area,
    ProjectDetail?.form,
    ProjectDetail?.ownershipForm,
    ProjectDetail?.classification,
    ProjectDetail?.startPrice,
    ProjectDetail?.endPrice,
    ProjectDetail?.ratioCommission,
    ProjectDetail?.isEsalekit,
    ProjectDetail?.description,
    ProjectDetail?.province,
    ProjectDetail?.district,
    ProjectDetail?.ward,
    ProjectDetail?.address,
    ProjectDetail?.fileId,
    ProjectDetail?.avatarEsalekit,
    isEdit,
    reset,
  ]);

  const getGenerateCode = async () => {
    const genarateCode = { generateCode: 'PRJ' };
    const data = await documentService.postGenarateCode(genarateCode);
    setValue('code', data);
  };

  const getProvinces = async () => {
    const data = await documentService.getProvince(paramsFilter);
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    const item: Province[] = [
      {
        id: +Date.now(),
        key: 'Cục quản lý trật tự xã hội',
        value: 'Cục quản lý trật tự xã hội',
      },
    ];
    setListProvince(newData);

    setParamsFilter({
      key: 'province',
      province: '0',
      district: '0',
    });
  };

  const getDistrics = async () => {
    const data = await documentService.getProvince({
      key: 'district',
      province: ProjectDetail?.province,
      district: '0',
    });
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    setListDistrict(newData);
  };

  const getCommunes = async () => {
    const data = await documentService.getProvince({
      key: 'commune',
      province: ProjectDetail?.province,
      district: ProjectDetail?.district,
    });
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    setListCommune(newData);
  };

  const handleSelectedProvince = async (value: string | number | string[]) => {
    const params = {
      key: 'district',
      province: value as string,
      district: '0',
    };
    setProvince(value as string);
    setParamsFilter(params);
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    setListDistrict(newData);
    setListCommune([]);
  };

  const handleSelectedDistrict = async (value: string | number | string[]) => {
    const params = {
      key: 'commune',
      district: value as string,
      province,
    };
    setParamsFilter(params);
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    setListCommune(newData);
  };

  const handleCancel = () => navigate(-1);

  const onError: SubmitErrorHandler<PayloadCreateProject> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const handleRemoveImage = () => {
    setFileID(null);
  };

  const handleRemoveImageLogo = () => {
    setLogoProject(null);
  };

  const handleSelectFile = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setFileID(imageId[0]);
  };

  const handleSelectFileLogo = async (file: File) => {
    const imageId = await document.uploadSingleFile(file);
    if (imageId.length > 0 && imageId[0]?.path) {
      imageId?.length && setLogoProject(imageId[0]?.path);
    }
  };

  const submit = async (data: PayloadCreateProject) => {
    if (isEdit) {
      const requestPayload = {
        ...data,
        id,
        isEsalekit,
        fileId: fileID,
        avatarEsalekit: logoProject,
        scale: data?.scale ? Number(data.scale) : 0,
        area: data?.area ? Number(data.scale) : 0,
        startPrice: data?.startPrice ? Number(data.startPrice) : 0,
        endPrice: data?.endPrice ? Number(data.endPrice) : 0,
        ratioCommission: data?.ratioCommission
          ? Number(data.ratioCommission)
          : 0,
      };
      await dispatch(
        actions.updateDataProject(requestPayload, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật thành công',
                  type: 'success',
                }),
              );
              setTimeout(() => {
                navigate(path.project);
              }, 1000);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    } else {
      const requestPayload = {
        ...data,
        isEsalekit,
        fileId: fileID,
        avatarEsalekit: logoProject,
        scale: data?.scale ? Number(data.scale) : 0,
        area: data?.area ? Number(data.scale) : 0,
        startPrice: data?.startPrice ? Number(data.startPrice) : 0,
        endPrice: data?.endPrice ? Number(data.endPrice) : 0,
        ratioCommission: data?.ratioCommission
          ? Number(data.ratioCommission)
          : 0,
      };
      if (fileID === '') {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Vui lòng tải lên ảnh đại diện dự án',
            type: 'error',
          }),
        );
        return;
      }
      await dispatch(
        actions.createProject(requestPayload, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo thành công',
                  type: 'success',
                }),
              );
              setTimeout(() => {
                navigate(path.project);
              }, 1000);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: res?.response || 'Tạo không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    }
  };

  return (
    <Fragment>
      <Box pb={'43px'} mt={'-10px'}>
        <form onSubmit={handleSubmit(submit, onError)}>
          <Grid
            container
            bgcolor={theme.palette.grey[0]}
            p={'24px'}
            pb={10}
            sx={{
              marginBottom: { xs: '24px', md: '0px' },
              borderRadius: 3,
              justifyContent: 'space-between',
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              <Box display={'flex'} sx={{ alignItems: 'center' }}>
                <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
                  <img src={BACK_ICON} onClick={handleCancel} />
                </Box>
                <Typography
                  fontSize={'20px'}
                  fontWeight={700}
                  lineHeight={'24px'}
                >
                  {isEdit
                    ? `Cập nhật thông tin dự án ${ProjectDetail?.name}`
                    : 'Tạo mới dự án'}
                </Typography>
              </Box>
              {checkPermissionExist(
                PermissionKeyEnum.PROJECT_CREATE,
                userInfo,
              ) && (
                <CustomButton
                  title={t(translations.common.update)}
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
                  handleClick={submit}
                />
              )}
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                fontWeight={700}
                fontSize={'20px'}
                color={palette.primary.button}
              >
                {'Thông tin dự án'}
              </Typography>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    label="Mã dự án"
                    isRequired
                    name="code"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                    isTrim
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    placeholder="Nhập tên dự án"
                    label="Tên dự án"
                    type="upper"
                    isRequired
                    name="name"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    label="Loại dự án"
                    placeholder="Chọn loại dự án"
                    isRequired
                    options={ProjectType}
                    type="select"
                    name="type"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    placeholder="Nhập phân loại sản phẩm"
                    label="Phân loại sản phẩm"
                    name="classification"
                    options={ProducFormType}
                    type="select"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    label="Trạng thái"
                    placeholder="Chọn trạng thái"
                    isRequired
                    options={StatusType}
                    name="status"
                    type="select"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    type="select"
                    label="Chủ đầu tư"
                    placeholder="Nhập chủ đầu tư"
                    options={[
                      {
                        id: 0,
                        key: 'CT Land',
                        value: 'CT Land',
                      },
                    ]}
                    name="investor"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    label="Quy mô"
                    placeholder="Chọn loại dự án"
                    endAdornment={'Sản phẩm'}
                    isRequired
                    name="scale"
                    format="number"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    label="Diện tích"
                    placeholder="Nhập diện tích"
                    endAdornment={
                      <p>
                        m<sup>2</sup>
                      </p>
                    }
                    name="area"
                    format="number"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    label="Hình thức giao dịch"
                    placeholder="Chọn hình thức giao dịch"
                    isRequired
                    options={FormType}
                    name="form"
                    type="select"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    label="Hình thức sở hữu"
                    placeholder="Chọn hình thức sở hữu"
                    isRequired
                    options={OwnershiType}
                    type="select"
                    name="ownershipForm"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box
                  mt={2}
                  sx={{
                    display: 'flex',
                    width: '50%',
                  }}
                >
                  <TextFieldCustom
                    label={'Đơn giá'}
                    placeholder={'Từ'}
                    name={`startPrice`}
                    control={control}
                    format="currency"
                    type="currency"
                    endAdornment={
                      <p>
                        Tr/m<sup>2</sup>
                      </p>
                    }
                    errors={errors}
                    setError={setError}
                    sxProps={{
                      '& .MuiInputBase-root': {
                        width: '100%',
                        borderRadius: '8px',
                        background: theme.palette.common.white,
                        color: theme.palette.common.black,
                        height: '44px',
                        fontSize: '14px',
                        border: `1px solid #D3D3D3`,
                        '& input': {
                          padding: '8.45px 10px',
                        },
                      },
                    }}
                  />
                  <Typography sx={{ alignSelf: 'center', p: '5px' }}>
                    ~
                  </Typography>
                  <TextFieldCustom
                    name={`endPrice`}
                    placeholder={'Đến'}
                    control={control}
                    format="currency"
                    type="currency"
                    endAdornment={
                      <p>
                        Tr/m<sup>2</sup>
                      </p>
                    }
                    errors={errors}
                    setError={setError}
                    sxProps={{
                      '& .MuiInputBase-root': {
                        width: '100%',
                        borderRadius: '8px',
                        background: theme.palette.common.white,
                        color: theme.palette.common.black,
                        height: '44px',
                        fontSize: '14px',
                        border: `1px solid #D3D3D3`,
                        '& input': {
                          padding: '8.45px 10px',
                        },
                      },
                    }}
                  />
                  {/* </Box> */}
                </Box>
                <Box mt={2} mx={2} width={'50%'}>
                  <TextFieldCustom
                    name={`ratioCommission`}
                    label={'Phí hoa hồng (Nếu có)'}
                    placeholder={'Nhập hoa hồng'}
                    control={control}
                    endAdornment={'%'}
                    errors={errors}
                    format="float_number"
                    max={100}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} mr={2} width={'100%'}>
                  <TextFieldCustom
                    name={`description`}
                    label={'Mô tả tổng quan dự án'}
                    placeholder={'Nhập nội dung...'}
                    control={control}
                    errors={errors}
                    type="textarea2"
                    setError={setError}
                    sxProps={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        width: '100%',
                        background: theme.palette.common.white,
                        color: theme.palette.common.black,
                        fontSize: '14px',
                        minHeight: '100px',
                        display: 'inline',
                        border: `1px solid #D3D3D3`,
                        '& input': {
                          padding: '8.45px 13px',
                          display: 'inline',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }} mt={1} mb={1}>
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    sx={{ mt: 1.5 }}
                    label={
                      <Typography fontSize={'14px'} color={'black'}>
                        Hiển thị Esalekit
                      </Typography>
                    }
                    control={
                      <Checkbox
                        value={isEsalekit}
                        checked={isEsalekit}
                        onClick={() => setIsSalekit(!isEsalekit)}
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                            borderRadius: 20,
                          },
                        }}
                      />
                    }
                  />
                </Grid>
                {isEsalekit && (
                  <Grid item xs={6} md={6} mr={2}>
                    <UploadFile
                      handleSelectFile={handleSelectFileLogo}
                      handleRemove={handleRemoveImageLogo}
                      buttonName="Tải ảnh lên"
                      warningMessage="lỗi"
                      name="avatarEsalekit"
                      control={control}
                      errors={errors}
                      urlDefault={ProjectDetail?.avatarEsalekit}
                      sx={{ height: '30vh' }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={0}
              md={0.1}
              sx={{
                borderLeft: '1px solid #E0E1E4',
                borderLeftStyle: 'dashed',
              }}
            ></Grid>
            <Grid item xs={12} md={4.9}>
              <Box display={'flex'}>
                <Typography
                  fontWeight={700}
                  fontSize={'20px'}
                  color={palette.primary.button}
                  mr={2}
                >
                  {'Địa chỉ dự án'}
                </Typography>
                <img src={MAP_ICON} alt="" />
              </Box>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    placeholder="Chọn Tỉnh/ Thành phố"
                    label="Tỉnh/ Thành phố"
                    isRequired
                    name="province"
                    type="select"
                    options={listProvince}
                    control={control}
                    errors={errors}
                    setError={setError}
                    onChange={handleSelectedProvince}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    placeholder="Chọn Quận/ Huyện"
                    label="Quận/ Huyện"
                    isRequired
                    type="select"
                    options={listDistrict}
                    name="district"
                    control={control}
                    errors={errors}
                    setError={setError}
                    onChange={handleSelectedDistrict}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: 'flex', width: '100%' }}
              >
                <Box mt={2} width={'50%'}>
                  <TextFieldCustom
                    placeholder="Chọn Phường/ Xã"
                    label="Phường/ Xã"
                    isRequired
                    type="select"
                    name="ward"
                    options={listCommune}
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
                <Box mt={2} ml={'16px'} mr={'16px'} width={'50%'}>
                  <TextFieldCustom
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    name="address"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: '100%' }}
                  />
                </Box>
              </Grid>
              <Typography
                fontWeight={700}
                fontSize={'20px'}
                color={palette.primary.button}
                mt={4}
              >
                {'Ảnh đại diện dự án'}
              </Typography>
              <Typography
                fontSize={'14px'}
                color={palette.common.black}
                mt={1.5}
                mb={3}
              >
                {
                  'Vui lòng tải 1 ảnh với định dạng .JPG, JPEG, .PNG, kích thước tối thiểu là 1000x750px hoặc tỉ lệ 4x3, dung lượng tối đa của mỗi tấm hình là 5MB.'
                }
              </Typography>
              <UploadFile
                handleSelectFile={handleSelectFile}
                handleRemove={handleRemoveImage}
                buttonName="Tải ảnh lên"
                warningMessage="lỗi"
                name="fileId"
                control={control}
                errors={errors}
                urlDefault={ProjectDetail?.image?.path}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </Fragment>
  );
}
