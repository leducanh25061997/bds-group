import {
  Box,
  Checkbox,
  Collapse,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useFilter } from 'app/hooks';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { FilterParams, Permission } from 'types';

import { useSettingSlice } from '../slice';
import { selectSetting } from '../slice/selector';
import { PayloadCreatePermission } from '../slice/types';

export function CreatePermission() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useSettingSlice();
  const { permissionManager } = useSelector(selectSetting);
  const [listPermission, setlistPermission] = useState<string[]>([]);
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

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListPermission(params));
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
    const roles = watch('newStaffRole');
    const requestPayload: PayloadCreatePermission = {
      name: roles,
      permissionKeys: listPermission,
    };

    dispatch(
      actions.createRoles(requestPayload, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thành công',
                type: 'success',
              }),
            );
            hanldeCancelAddRole();
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thất bại',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
  };

  const hanldOpenItem = (open: number, id: string, index: number) => {
    setOpen(open);
  };

  const hanldeCancelAddRole = () => {
    navigate(path.permission);
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
              {'Thêm quyền mới'}
            </Typography>
          </Box>
          <Box>
            <CustomButton
              title={t(translations.common.cancel)}
              isIcon
              sxProps={{
                background: palette.primary.button,
                color: palette.common.white,
                borderRadius: '8px',
              }}
              sxPropsText={{
                fontSize: '14px',
                fontWeight: 700,
              }}
              handleClick={hanldeCancelAddRole}
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
              {'Thêm vai trò mới'}
            </Typography>

            <Stack flexDirection={'row'}>
              <Box>
                <TextFieldCustom
                  placeholder="Nhập quyền mới"
                  name="newStaffRole"
                  control={control}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '420px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '10px',
                      },
                    },
                  }}
                />
              </Box>
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
        </Grid>
      </form>
    </Box>
  );
}
