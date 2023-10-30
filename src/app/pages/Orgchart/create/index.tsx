import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import path from 'app/routes/path';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { Option, OptionAutocomplete } from 'types/Option';

import { useStaffSlice } from 'app/pages/Staff/slice';

import { useOrgchartSlice } from '../slice';
import { selectOrgchart } from '../slice/selector';
import { PayloadCreateOrgchart, StaffOption } from '../slice/types';
interface Props {
  isEdit?: boolean;
}

export default function CreateOrgchart(props: Props) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { actions: StaffActions } = useStaffSlice();
  const { OrgchartDetail, OrgchartManagement, StaffNoneOrgchart, isLoading } =
    useSelector(selectOrgchart);
  const [listOption, setlistOption] = useState<OptionAutocomplete[]>([]);
  const [listOrgChart, setlistOrgChart] = useState<Option[]>([]);
  const [listManager, setlistManager] = useState<OptionAutocomplete[]>([]);
  const [listStaff, setListStaff] = useState<StaffOption[]>([]);
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    fetchListOrgchart();
  }, [dispatch, OrgchartActions]);

  useEffect(() => {
    if (isEdit && OrgchartDetail) {
      reset({
        name: OrgchartDetail?.name,
        parentOrgchartId: OrgchartDetail?.parentOrgChart?.id || '0',
        managerId: OrgchartDetail?.manager?.id,
      });

      const listStaffDetail: StaffOption[] = [];
      const listManagerOrg = [...listManager];
      if (OrgchartDetail?.manager && OrgchartDetail?.manager?.id) {
        listManagerOrg.push({
          label: OrgchartDetail?.manager?.fullName,
          id: OrgchartDetail?.manager?.id,
        });
      }
      OrgchartDetail?.staffs.forEach(element => {
        if (element?.id !== OrgchartDetail?.manager?.id) {
          listStaffDetail.push({
            id: element?.id,
            name: element?.fullName,
            avatar: '',
            position: element?.email,
          });
        }
      });
      setlistManager(listManagerOrg);
      setListStaff(listStaffDetail);
    }
  }, [
    OrgchartDetail?.name,
    OrgchartDetail?.parentOrgChart,
    OrgchartDetail?.manager,
    isEdit,
    reset,
  ]);

  const fetchListOrgchart = () => {
    dispatch(OrgchartActions.fetchListOrgchart());
    dispatch(OrgchartActions.getStaffNoneOrgchart());
  };

  useEffect(() => {
    const newData: OptionAutocomplete[] = [];
    const newManager: OptionAutocomplete[] = [];
    StaffNoneOrgchart?.data?.forEach(item => {
      newData.push({
        id: item.id,
        key: item?.id,
        value: item?.code,
        isCheck: false,
        avatar: '',
        position: item?.email,
        label: item?.fullName,
      });
      newManager.push({
        label: item.fullName,
        id: item.id,
      });
    });
    newManager.push({
      label: OrgchartDetail?.manager?.fullName,
      id: OrgchartDetail?.manager?.id,
    });
    setlistManager(newManager);
    setlistOption(newData);
  }, [StaffNoneOrgchart?.data, OrgchartDetail]);

  useEffect(() => {
    const orgchart: Option[] = [
      {
        id: 0,
        key: 'Không trực thuộc',
        value: '0',
      },
    ];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        id: +Date.now(),
        key: item.name,
        value: item.id,
      });
    });
    setlistOrgChart(orgchart);
  }, [OrgchartManagement]);

  const submit = async (data: PayloadCreateOrgchart) => {
    const staffIds: string[] = [];
    listStaff.forEach(element => {
      staffIds.push(element.id || '');
    });
    const parentOrgchartId = watch('parentOrgchartId');

    if (isEdit) {
      const requestPayload = {
        ...data,
        id,
        staffIds,
      };

      if (parentOrgchartId === '0') {
        requestPayload.parentOrgchartId = '';
      }

      await dispatch(
        OrgchartActions.updateDataOrgchart(requestPayload, (res?: any) => {
          if (res) {
            if (!res?.error) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật thành công',
                  type: 'success',
                }),
              );
              setTimeout(() => {
                navigate(path.Orgcharts);
              }, 500);
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
        staffIds,
      };

      if (parentOrgchartId === '0') {
        requestPayload.parentOrgchartId = '';
      }

      dispatch(
        OrgchartActions.createOrgchart(requestPayload, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo thành công',
                  type: 'success',
                }),
              );
              navigate(path.Orgcharts);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    }
  };

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

  const handleCancel = () => {
    // navigate(path.Orgcharts);
    navigate(-1);
  };

  const handleDetail = () => {
    navigate(`/orgchart/detail/${id}`);
  };

  const hanldeAddStaff = (value: string | number) => {
    const newListOption = [...listOption];
    const staffInfo = newListOption.find(item => item.id === value);
    const staffIndex = newListOption.findIndex(item => item.id === value);

    if (listStaff.find(item => item.id === staffInfo?.id)) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Nhân viên này đã được thêm',
          type: 'error',
        }),
      );
      return;
    }

    const item: StaffOption = {
      id: staffInfo?.id,
      name: staffInfo?.label,
      avatar: staffInfo?.avatar,
      position: staffInfo?.position,
    };

    if (staffIndex >= 0) {
      newListOption[staffIndex].isCheck = true;
      setListStaff([...listStaff].concat(item));
      setlistOption(newListOption);
    }
  };

  const hanldeRemoveStaff = (staff: StaffOption, index: number) => {
    const newListOption = [...listOption];

    const newListStaff = [...listStaff];
    newListStaff.splice(index, 1);

    const staffIndex = newListOption.findIndex(item => item.id === staff.id);
    if (staffIndex >= 0) {
      newListOption[staffIndex].isCheck = false;
    }

    setlistOption(newListOption);
    setListStaff(newListStaff);
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
            <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
              <img src={BACK_ICON} onClick={handleCancel} />
            </Box>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              Thiết lập sơ đồ tổ chức
            </Typography>
          </Box>
          <Stack flexDirection={'row'}>
            {/* <CustomButton
              title={'Xem chi tiết'}
              isHide={!isEdit}
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
                width: { md: '120px' },
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={handleDetail}
            /> */}
            <CustomButton
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
            />
          </Stack>
        </Grid>
        <Grid
          container
          bgcolor={theme.palette.grey[0]}
          p={'24px'}
          pb={10}
          sx={{
            marginBottom: { xs: '24px', md: '0px' },
            borderRadius: 3,
            mt: 2,
          }}
        >
          <Grid item xs={12} md={12}>
            <Typography
              fontWeight={700}
              fontSize={'18px'}
              color={palette.primary.button}
            >
              Thông tin tổ chức
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} mt={1} sx={{ display: 'flex', mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={3}>
                <TextFieldCustom
                  placeholder="Nhập tên tổ chức"
                  label="Tên tổ chức"
                  name="name"
                  isRequired
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={3}>
                <TextFieldCustom
                  placeholder="Chọn tổ chức trực thuộc"
                  label="Tổ chức trực thuộc"
                  name="parentOrgchartId"
                  type="select"
                  isRequired
                  options={listOrgChart}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={3}>
                <TextFieldCustom
                  placeholder="Chọn quản lý"
                  label="Quản lý"
                  name="managerId"
                  type="selectsearch"
                  optionAutoComplete={listManager}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={3}>
                <Typography
                  fontWeight={700}
                  fontSize={'18px'}
                  color={palette.primary.button}
                  style={{ marginBottom: 16 }}
                >
                  Thông tin nhân viên
                </Typography>
                <TextFieldCustom
                  placeholder={'Chọn nhân viên'}
                  label={'Thêm nhân viên'}
                  type="selectcustom"
                  optionAutoComplete={listOption}
                  name="staff"
                  control={control}
                  errors={errors}
                  setError={setError}
                  onChange={hanldeAddStaff}
                />
              </Grid>
              <Grid item xs={8} md={9} sx={{ pl: 5 }}>
                <Typography
                  fontWeight={700}
                  fontSize={'18px'}
                  color={palette.primary.button}
                  textAlign={'center'}
                >
                  Danh sách nhân viên
                </Typography>

                <Box
                  sx={{
                    flexWrap: 'wrap',
                    display: 'flex',
                    mt: 2,
                    border: '2px solid #D6465F',
                    borderRadius: '12px',
                    p: 1.5,
                  }}
                >
                  {listStaff.length === 0 && (
                    <Typography
                      fontWeight={700}
                      fontSize={'15px'}
                      color={palette.primary.button}
                    >
                      Chưa có nhân viên!
                    </Typography>
                  )}
                  {listStaff.map((item, index) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          mr: 1.5,
                          mb: 1.5,
                          width: { md: '15vw' },
                          background: '#FFD9EA',
                          borderRadius: 10,
                          p: '4px 10px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Stack flexDirection={'row'} alignItems={'center'}>
                          <Avatar
                            src={item.avatar}
                            style={{ height: '28px', width: '28px' }}
                          />
                          <Box sx={{ ml: '5px' }}>
                            <Typography
                              fontWeight={700}
                              fontSize={'12px'}
                              color={'black'}
                              sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                width: { md: '9.5vw' },
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              fontSize={'10px'}
                              color={'#7A7A7A'}
                              sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                width: { md: '9.5vw' },
                              }}
                            >
                              {item.position}
                            </Typography>
                          </Box>
                        </Stack>
                        <IconButton
                          sx={{ p: 0, ml: 1 }}
                          onClick={() => hanldeRemoveStaff(item, index)}
                        >
                          <img src={CLOSE_ICON} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
