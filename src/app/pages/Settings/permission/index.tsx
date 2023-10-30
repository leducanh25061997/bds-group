import {
  Avatar,
  Box,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useFilter } from 'app/hooks';
import path from 'app/routes/path';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { FilterParams, Permission } from 'types';
import { Option, OptionAutocomplete, OptionCustom } from 'types/Option';

import { useSettingSlice } from '../slice';
import { selectSetting } from '../slice/selector';
import {
  PayloadCreatePermission,
  PayloadGetDetailRoles,
  PayloadUpdateRoles,
  PayloadUpdateUserRoles,
} from '../slice/types';

export function PermissionCreate() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useSettingSlice();
  const { permissionManager, rolesManager, roleDetail, userManager } =
    useSelector(selectSetting);
  const [listRoles, setlistRoles] = useState<Option[]>([]);
  const [listPermission, setlistPermission] = useState<string[]>([]);
  const [listStaff, setlistStaff] = useState<OptionAutocomplete[]>([]);
  const [listUserDetail, setlistUserDetail] = useState<OptionAutocomplete[]>(
    [],
  );
  const [isOpenDialogeDelete, setIsOpenDialogeDeletel] =
    useState<boolean>(false);
  const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false);
  const [open, setOpen] = useState(-1);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 100,
    };
  }, []);

  const onError: SubmitErrorHandler<PayloadCreatePermission> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });
  const redirectToCreatePage = () => navigate(path.createpermission);

  useEffect(() => {
    const roles: Option[] = [];
    rolesManager?.data.forEach((element, index) => {
      roles.push({ key: element.name, value: element.id, id: +Date.now() });
      if (index === 0) {
        setValue('roles', element.id);
        handleSelectedRoles(element.id);
      }
    });

    setlistRoles(roles);
  }, [rolesManager?.data]);

  const handleSelectedRoles = async (id: string | number | string[]) => {
    const roles = listRoles.find(element => element.value === id);

    if (roles?.key === process.env.REACT_APP_SYS_ROLE) {
      setIsDeleteRole(false);
    } else {
      setIsDeleteRole(true);
    }
    dispatch(actions.getRoleDetail({ id }));
  };

  useEffect(() => {
    const newData: OptionAutocomplete[] = [];
    userManager?.data?.forEach(item => {
      let isCheck = false;
      const staff =
        roleDetail?.users?.findIndex(child => child.staffId === item.staffId) ||
        -1;
      if (staff > -1) {
        isCheck = true;
      }
      if (item?.staff) {
        newData.push({
          id: item?.id,
          key: item?.id,
          value: item?.id,
          isCheck,
          avatar: '',
          position: item?.staff?.position,
          label: item?.staff?.fullName,
        });
      }
    });

    setlistStaff(newData);
  }, [userManager?.data, roleDetail]);

  useEffect(() => {
    const permission: string[] = [];
    const newData: OptionAutocomplete[] = [];

    roleDetail?.permissions?.forEach(element => {
      permission.push(element.key);
    });
    roleDetail?.users?.forEach(element => {
      newData.push({
        id: element?.id,
        key: element?.id,
        value: element?.id,
        isCheck: !element?.staff || false,
        avatar: '',
        position: element?.staff?.position || 'ADMIN',
        label: element?.staff?.fullName || 'ADMIN',
      });
    });

    setlistUserDetail(newData);
    setlistPermission(permission);
  }, [roleDetail]);

  const fetchDataForPage = (params: FilterParams) => {
    setIsDeleteRole(false);
    dispatch(actions.fetchListPermission(params));
    dispatch(actions.fetchListRole(params));
    dispatch(actions.fetchListUser(params));
  };

  const onChangeCheckRoles = (key: string) => {
    const permission = [...listPermission];
    const index = permission.findIndex(item => item === key);

    if (index >= 0) {
      permission.splice(index, 1);
    } else {
      permission.push(key);
    }
    setlistPermission(permission);
  };

  const hanldeSaveRoles = () => {
    const roles = watch('roles');
    const newuserIds: any[] = [];
    const listUser = [...listUserDetail];
    listUser.forEach(item => {
      newuserIds.push(item.id);
    });

    const requestPayload: PayloadUpdateRoles = {
      id: roles,
      name: roles,
      permissionKeys: listPermission,
    };

    const requestUserRolesPayload: PayloadUpdateUserRoles = {
      roleId: roles,
      userIds: newuserIds,
    };

    dispatch(
      actions.updateDataUserRoles(requestUserRolesPayload, (err?: any) => {}),
    );

    dispatch(
      actions.updateDataRoles(requestPayload, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thành công',
                type: 'success',
              }),
            );
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
  };

  const onChangeStaff = (value: string | number) => {
    const staff = listStaff.filter(element => element.id === value);
    const listUser = [...listUserDetail].concat(staff);
    const newListStaff = [...listStaff];
    const staffIndex = newListStaff.findIndex(item => item.id === value);
    if (staffIndex >= 0) {
      newListStaff[staffIndex].isCheck = true;
    }
    setlistUserDetail(listUser);
    setlistStaff(newListStaff);
  };

  const onRemoveStaff = (id: any, index: number) => {
    const listUser = [...listUserDetail];
    const newListStaff = [...listStaff];
    listUser.splice(index, 1);
    const staffIndex = newListStaff.findIndex(item => item.id === id);
    if (staffIndex >= 0) {
      newListStaff[staffIndex].isCheck = false;
    }
    setlistStaff(newListStaff);
    setlistUserDetail(listUser);
  };

  const hanldOpenItem = (open: number, id: string, index: number) => {
    setOpen(open);
  };

  const hanldeRemovePermission = () => {
    setIsOpenDialogeDeletel(false);

    const roles = watch('roles');
    const requestPayload: PayloadGetDetailRoles = {
      id: roles,
    };

    dispatch(
      actions.deleteUserRoles(requestPayload, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá thành công',
                type: 'success',
              }),
            );
            fetchDataForPage(initialFilter);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xoá thất bại',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const handleCloseDialogeDelete = () => {
    setIsOpenDialogeDeletel(false);
  };

  const handleOpenDialogeDelete = () => {
    setIsOpenDialogeDeletel(true);
  };

  const onCheckAllPermission = (permissionData: Permission[], value: any) => {
    const permission = [...listPermission];
    permissionData.forEach(element => {
      const index = permission.findIndex(item => item === element.key);

      if (value.target.checked) {
        if (!permission.includes(element.key)) {
          permission.push(element.key);
        }
      } else {
        permission.splice(index, 1);
      }
    });
    setlistPermission(permission);
  };

  const submit = (data: PayloadCreatePermission) => {};

  return (
    <Box pb={'43px'} mt={'-10px'}>
      <form onSubmit={handleSubmit(submit, onError)}>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              {'Thiết lập phân quyền'}
            </Typography>
          </Box>
          <Box>
            <CustomButton
              title={t(translations.common.addNew)}
              isIcon
              buttonMode={'create'}
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={redirectToCreatePage}
            />
            <CustomButton
              title={t(translations.common.update)}
              isIcon
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
                ml: 2,
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={hanldeSaveRoles}
            />
          </Box>
        </Grid>
        <Grid
          container
          bgcolor={theme.palette.grey[0]}
          xs={12}
          sm={12}
          sx={{
            marginBottom: { xs: '24px', md: '0px' },
            borderRadius: '8px',
            p: '15px 24px',
            mt: 2,
          }}
        >
          <Grid item xs={12} sm={12}>
            <Typography
              color={palette.primary.button}
              fontWeight={700}
              fontSize={'16px'}
              mt={2}
            >
              {'Chọn vai trò thiết lập*'}
            </Typography>

            <Stack flexDirection={'row'} alignItems={'center'}>
              <Box>
                <TextFieldCustom
                  placeholder="Chọn vai trò"
                  name="roles"
                  type="select"
                  options={listRoles}
                  control={control}
                  errors={errors}
                  setError={setError}
                  onChange={handleSelectedRoles}
                  sxProps={{
                    width: { md: '375px' },
                  }}
                />
              </Box>
              {isDeleteRole && (
                <CustomButton
                  title={'Xoá vai trò'}
                  sxProps={{
                    background: palette.primary.button,
                    color: palette.common.white,
                    borderRadius: '8px',
                    ml: 2,
                  }}
                  sxPropsText={{
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                  handleClick={handleOpenDialogeDelete}
                />
              )}
            </Stack>
            <Typography
              color={palette.primary.button}
              fontWeight={700}
              fontSize={'16px'}
              mt={2}
            >
              Danh sách quyền
            </Typography>
            {permissionManager?.data?.map((item, index) => {
              let isCheckAll = true;
              if (item?.permissions) {
                item?.permissions.forEach(element => {
                  if (!listPermission.includes(element.key)) {
                    isCheckAll = false;
                    return;
                  }
                });
              }
              return (
                <Stack>
                  <Box
                    sx={{
                      mt: '8px',
                      background: '#FEF4FA',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      display: 'flex',
                      width: '100%',
                      minHeight: '44px',
                      mr: 3,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                      onClick={() =>
                        hanldOpenItem(
                          open === index ? -1 : index,
                          item.id,
                          index,
                        )
                      }
                    >
                      <Typography
                        sx={{
                          fontSize: '25px',
                          color: 'black',
                        }}
                      >
                        {open === index ? '-' : '+'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: 'black',
                          fontWeight: 600,
                          ml: 1,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Stack>
                    <Stack
                      sx={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        mr: 2,
                      }}
                    >
                      <Checkbox
                        onClick={value =>
                          onCheckAllPermission(item.permissions, value)
                        }
                        checked={isCheckAll}
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                            borderRadius: 20,
                          },
                        }}
                      />
                      <Typography
                        fontSize={'13px'}
                        color={'black'}
                        fontWeight={'500'}
                        width={'max-content'}
                      >
                        {'Chọn tất cả'}
                      </Typography>
                    </Stack>
                  </Box>
                  <Collapse in={open === index} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        my: 1,
                      }}
                    >
                      {item.permissions?.map(child => (
                        <Stack
                          sx={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            mr: 3,
                          }}
                        >
                          <Checkbox
                            onClick={() => onChangeCheckRoles(child.key)}
                            checked={listPermission.indexOf(child.key) > -1}
                            sx={{
                              color: palette.primary.button,
                              '&.Mui-checked': {
                                color: palette.primary.button,
                                borderRadius: 20,
                              },
                            }}
                          />
                          <Typography
                            fontSize={'13px'}
                            color={'black'}
                            fontWeight={'500'}
                          >
                            {child.name}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  </Collapse>
                </Stack>
              );
            })}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}
          >
            <Stack>
              <Typography
                color={palette.primary.button}
                fontWeight={700}
                fontSize={'16px'}
                mt={2}
              >
                Danh sách nhân viên
              </Typography>
              <Box
                sx={{
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: { md: '330px' },
                  overflow: 'auto',
                  position: 'relative',
                  padding: '0px 10px',
                }}
              >
                <Box>
                  <TextFieldCustom
                    placeholder={'Chọn nhân viên'}
                    label={'Thêm quyền nhân viên'}
                    type="selectcustom"
                    optionAutoComplete={listStaff}
                    name="staffs"
                    control={control}
                    errors={errors}
                    setError={setError}
                    sxProps={{ width: { md: '300px' }, height: '40px' }}
                    isShowDropDown
                    onChange={onChangeStaff}
                  />
                </Box>
              </Box>
            </Stack>
            <Stack ml={10}>
              <Typography
                color={palette.primary.button}
                fontWeight={700}
                fontSize={'16px'}
                mt={2}
              >
                Danh sách quyền {roleDetail?.name.toLocaleLowerCase()}
              </Typography>
              <Box
                sx={{
                  marginTop: 3,
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: { md: '350px' },
                  overflow: 'auto',
                  maxHeight: '50vh',
                  position: 'relative',
                  padding: '0px 10px',
                }}
              >
                {listUserDetail?.map((item, index) => (
                  <Box sx={{ display: 'flex', mr: 2 }}>
                    <Box
                      sx={{
                        background: '#FEF4FA',
                        borderRadius: '8px',
                        mb: '4px',
                        p: '2px 13px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: { md: '280px' },
                        mr: '12px',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{ width: '28px', height: '28px' }}
                          src={item.avatar}
                        />
                        <Box ml={'5px'}>
                          <Typography
                            fontWeight={700}
                            fontSize={'14px'}
                            color={theme.palette.common.black}
                          >
                            {item?.label}
                          </Typography>
                          <Typography fontSize={'10px'} color={'#7A7A7A'}>
                            {item?.position}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => onRemoveStaff(item.id, index)}
                    >
                      <img src={CLOSE_ICON} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </form>
      <ConfirmDialog
        isOpen={isOpenDialogeDelete}
        handleClose={handleCloseDialogeDelete}
        handleSubmit={hanldeRemovePermission}
        isIcon={false}
      >
        <Typography
          fontSize={'15px'}
          fontWeight={700}
          width={400}
          color={theme.palette.primary.light}
          mb={5}
          mt={2}
          textAlign={'center'}
        >
          {'Bạn có chắc xoá quyền này hay không ?'}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
}
