import {
  Box,
  DialogActions,
  Grid,
  Radio,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import Toogle from 'app/components/Toogle';
import UploadFile from 'app/components/UploadFileImage/UploadIdentification';
import { PayloadCreateCustomer } from 'app/pages/CustomerPotential/slice/types';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useSettingSlice } from 'app/pages/Settings/slice';
import { selectSetting } from 'app/pages/Settings/slice/selector';
import path from 'app/routes/path';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import FACEBOOK_ICON from 'assets/background/facebook-icon.svg';
import ZALO_ICON from 'assets/background/zalo-icon.svg';
import WHATSAPP_ICON from 'assets/background/close-button-icon.svg';
import INSTAGRAM_ICON from 'assets/background/instagram-icon.svg';
import TWITTER_ICON from 'assets/background/twitter-icon.svg';
import GOOGLE_ICON from 'assets/background/close-button-icon.svg';

import DEFAULT_BACK from 'assets/img/img-back.svg';
import DEFAULT_FRONT from 'assets/img/img-front.svg';
import DEFAULT_PORTRAIT from 'assets/img/img_portrait.svg';
import { translations } from 'locales/translations';
import { useEffect, useMemo, useState } from 'react';
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
  SocialType,
  StaffFieldType,
  StaffLevelType,
  TYPEIdentification,
} from 'types/Enum';
import { ErrorType, OptionAutocomplete } from 'types/Option';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist, renderIdentifier } from 'utils/helpers';

import { useProfile } from 'app/hooks';

import { selectStaff } from 'app/pages/Staff/slice/selector';
import { useStaffSlice } from 'app/pages/Staff/slice';
import {
  FileId,
  PayloadCreateStaff,
  PayloadUpdateStaff,
  StaffInfor,
} from 'app/pages/Staff/slice/types';
import { useAuthSlice } from 'app/pages/Auth/slice';

interface Props {
  id?: string;
}
interface Province {
  id: number;
  key: string;
  value: string;
}

interface LinkSocical {
  type: SocialType;
  link: string;
}

export default function CreateUser(props: Props) {
  const { id } = props;
  //   const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useProfile();
  const { staffDetail } = useSelector(selectStaff);

  const { rolesManager } = useSelector(selectSetting);
  const [listRoles, setlistRoles] = useState<OptionAutocomplete[]>([]);
  const [isMale, setIsMale] = useState(true);
  const [isIdentifier, setIsIdentifier] = useState(
    TYPEIdentification.CITIZEN_IDENTIFICATION,
  );
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { actions: SettingActions } = useSettingSlice();
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const { actions: authActions } = useAuthSlice();
  const { actions } = useStaffSlice();
  const [listIssuedby, setListIssuedby] = useState<Province[]>([]);
  const [listOrgChart, setlistOrgChart] = useState<OptionAutocomplete[]>([]);
  const [listlink, setListLink] = useState<LinkSocical[]>([]);
  const [paramsFilter, setParamsFilter] = useState<FilterParams>({
    key: 'province',
    province: '0',
    district: '0',
  });
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 100,
    };
  }, []);

  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);
  const [portraitImage, setPortraitImage] = useState<any>(null);
  const [workingUnit, setworkingUnit] = useState<any>('');

  const [isEdit, setEdit] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });
  useEffect(() => {
    if (staffDetail) {
      reset({
        staffStatus: staffDetail?.staffStatus,
        fullName: staffDetail?.fullName,
        code: staffDetail?.code,
        email: staffDetail?.email,
        birthDay: staffDetail?.birthDay,
        phone: staffDetail?.phone,
        position: staffDetail?.position,
        identityNumber: staffDetail?.identityNumber,
        dateRange: staffDetail?.dateRange,
        workingUnit: staffDetail?.workingUnit,
        staffLevel: staffDetail?.staffLevel,
        commission: staffDetail?.commission,
        orgChartId: staffDetail?.orgChart?.id,
        issuedBy: staffDetail?.issuedBy,
        files: staffDetail?.files,
        roleId: staffDetail?.user?.roleId,
        userId: staffDetail?.userId
      });
      setworkingUnit(staffDetail?.orgChart?.name);
      setIsIdentifier(staffDetail?.typeIdentification);
      if (staffDetail?.soical) {
        setListLink(staffDetail?.soical);
      }
      if (staffDetail?.files) {
        const frontImage = staffDetail?.files.find(
          element => element?.field === StaffFieldType.FRONT,
        )?.file?.id;
        const backImage = staffDetail?.files.find(
          element => element?.field === StaffFieldType.BACK,
        )?.file?.id;
        const portraitImage = staffDetail?.files.find(
          element => element?.field === StaffFieldType.PORTRAIT,
        )?.file?.id;
        setFrontImage(frontImage);
        setBackImage(backImage);
        setPortraitImage(portraitImage);
      }
    }
  }, [
    staffDetail?.staffStatus,
    staffDetail?.fullName,
    staffDetail?.code,
    staffDetail?.email,
    staffDetail?.phone,
    staffDetail?.position,
    staffDetail?.identityNumber,
    staffDetail?.birthDay,
    staffDetail?.dateRange,
    staffDetail?.workingUnit,
    staffDetail?.staffLevel,
    staffDetail?.commission,
    staffDetail?.files,
    staffDetail?.orgChart?.id,
    staffDetail?.user?.roleId,
    staffDetail?.userId,
    reset,
  ]);

  useEffect(() => {
    getProvinces();
    fetchListOrgchart();
  }, [actions, dispatch]);

  useEffect(() => {
    const orgchart: OptionAutocomplete[] = [];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        id: item.id,
        label: item.name,
      });
    });
    setlistOrgChart(orgchart);
  }, [OrgchartManagement]);

  useEffect(() => {
    const roles: OptionAutocomplete[] = [];
    rolesManager?.data.forEach((element, index) => {
      if (element.name !== process.env.REACT_APP_SYS_ROLE) {
        roles.push({ label: element.name, id: element.id });
      }
    });
    setlistRoles(roles);
  }, [rolesManager?.data]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchListOrgchart = () => {
    dispatch(OrgchartActions.fetchListOrgchart());
    dispatch(SettingActions.fetchListRole(initialFilter));
  };

  const levelSource = useMemo(() => {
    return [
      {
        id: 1,
        key: 'C1',
        value: StaffLevelType.C1,
      },
      {
        id: 2,
        key: 'C2',
        value: StaffLevelType.C2,
      },
      {
        id: 3,
        key: 'D1',
        value: StaffLevelType.D1,
      },
      {
        id: 4,
        key: 'E1',
        value: StaffLevelType.E1,
      },
      {
        id: 5,
        key: 'E2',
        value: StaffLevelType.E2,
      },
      {
        id: 6,
        key: 'E3',
        value: StaffLevelType.E3,
      },
      {
        id: 7,
        key: 'M1',
        value: StaffLevelType.M1,
      },
      {
        id: 8,
        key: 'M2',
        value: StaffLevelType.M2,
      },
      {
        id: 9,
        key: 'M3',
        value: StaffLevelType.M3,
      },
    ];
  }, []);

  const soicalSource = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Facebook',
        value: SocialType.FACEBOOK,
        isDefault: true,
      },
      // {
      //   id: 2,
      //   key: 'WhatsApp',
      //   value: SocialType.WHATSAPP,
      // },
      {
        id: 3,
        key: 'Instagram',
        value: SocialType.INSTAGRAM,
      },
      // {
      //   id: 4,
      //   key: 'Snapchat',
      //   value: SocialType.SNAPCHAT,
      // },
      {
        id: 5,
        key: 'Twitter',
        value: SocialType.TWITTER,
      },
      // {
      //   id: 6,
      //   key: 'Google',
      //   value: SocialType.GOOGLE,
      // },
      {
        id: 7,
        key: 'Zalo',
        value: SocialType.ZALO,
      },
      // {
      //   id: 8,
      //   key: 'Website',
      //   value: SocialType.WEBSITE,
      // },
    ];
  }, []);

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
    setListIssuedby(item.concat(newData));

    setParamsFilter({
      key: 'province',
      province: '0',
      district: '0',
    });
  };

  const submit = async (data: StaffInfor) => {

    setIsLoading(true);
    const fileIdsPayload: FileId[] = [];

    if (frontImage) {
      fileIdsPayload.push({
        field: StaffFieldType.FRONT,
        fileId: frontImage,
      });
    }
    if (backImage) {
      fileIdsPayload.push({
        field: StaffFieldType.BACK,
        fileId: backImage,
      });
    }
    if (portraitImage) {
      fileIdsPayload.push({
        field: StaffFieldType.PORTRAIT,
        fileId: portraitImage,
      });
    }

    // if (isEdit) {
    const staffPayload = {
      ...data,
      typeIdentification: isIdentifier,
      workingUnit,
    };
    const requestPayload: PayloadUpdateStaff = {
      staffInfor: staffPayload,
      fileIds: fileIdsPayload,
      id: staffDetail?.id,
      social: listlink
    };

    await dispatch(
      actions.updateDataStaff(requestPayload, (res?: any) => {
        if (res) {
          if (res?.success) {
            setIsLoading(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thành công',
                type: 'success',
              }),
            );
            dispatch(actions.getDetailStaff({ id: staffDetail?.id}));
            dispatch(authActions.getUserInfo());
            setEdit(false);
          } else {
            setIsLoading(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật không thành công',
                type: 'error',
              }),
            );
            const errors: ErrorType[] = res?.response?.data?.errors;
            if (errors?.length) {
              for (let i = 0; i < errors.length; i++) {
                setError(`${errors[i].at}`, {
                  message: errors[i].message,
                });
              }
            }
          }
        }
        setIsLoading(false);
      }),
    );
    // } else {
    //   const staffPayload = {
    //     ...data,
    //     typeIdentification: isIdentifier,
    //     workingUnit,
    //     staffStatus: checkStatus,
    //   };

    //   const requestPayload: PayloadCreateStaff = {
    //     staffInfor: staffPayload,
    //     fileIds: fileIdsPayload,
    //   };

    //   await dispatch(
    //     actions.createStaff(requestPayload, (res?: any) => {
    //       if (res) {
    //         if (res?.success) {
    //           dispatch(
    //             snackbarActions.updateSnackbar({
    //               message: 'Tạo thành công',
    //               type: 'success',
    //             }),
    //           );
    //           setTimeout(() => {
    //             navigate(path.staff);
    //           }, 1000);
    //         } else {
    //           dispatch(
    //             snackbarActions.updateSnackbar({
    //               message: 'Tạo không thành công',
    //               type: 'error',
    //             }),
    //           );
    //         }
    //       }
    //       setIsLoading(false);
    //     }),
    //   );
    // }
  };

  const onError: SubmitErrorHandler<PayloadCreateCustomer> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const handleChangeMale = () => {
    setIsMale(!isMale);
  };

  const handleChangeIdentifier = (type: TYPEIdentification) => {
    setIsIdentifier(type);
  };

  const handleUpdate = () => {
    setEdit(true);
  };

  const handleAddLink = () => {
    const socialLink = watch('socialLink');
    const socialType = watch('socialApp');
    const linkItem: LinkSocical = {
      type: socialType,
      link: socialLink,
    };
    if (socialLink) {
      const newlistLink = [...listlink].concat(linkItem);
      setListLink(newlistLink);
    }
  };

  const handleRemoveLink = (index: number) => {
    const newlistLink = [...listlink];
    newlistLink.splice(index, 1);
    setListLink(newlistLink);
  };

  const handleSelectFilePortrait = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setPortraitImage(imageId[0]);
  };

  const handleSelectFileBack = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setBackImage(imageId[0]);
  };

  const handleSelectFileFront = async (file: File) => {
    const imageId = await document.uploadAvatar(file);
    imageId?.length && setFrontImage(imageId[0]);
  };

  const handleSelectedUnits = async (id: string | number | string[]) => {
    const orgchart = OrgchartManagement?.data.find(
      element => element?.id === id,
    );
    setworkingUnit(orgchart?.name);
  };

  const renderContent = (item: LinkSocical) => {
    let view = null;
    switch (item?.type) {
      case SocialType.FACEBOOK:
        view = <img src={FACEBOOK_ICON} style={{ borderRadius: '25px' }} />;
        break;
      case SocialType.ZALO:
        view = <img src={ZALO_ICON} style={{ borderRadius: '25px' }} />;
        break;
      case SocialType.TWITTER:
        view = <img src={TWITTER_ICON} style={{ borderRadius: '25px' }} />;
        break;
      case SocialType.INSTAGRAM:
        view = <img src={INSTAGRAM_ICON} style={{ borderRadius: '25px' }} />;
        break;
      default:
        view = null;
        break;
    }
    return view;
  };

  return (
    <Box mt={'-10px'}>
      <form onSubmit={handleSubmit(submit, onError)}>
        <Box
          bgcolor={theme.palette.grey[0]}
          p={3}
          sx={{
            marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
            marginRight: { xs: '12px', sm: '24px', lg: '0px' },
            borderRadius: 3,
            mt: '24px',
            maxHeight: '570px',
            overflow: 'auto',
          }}
        >
          <Grid
            container
            xs={12}
            sm={12}
            bgcolor={theme.palette.grey[0]}
            sx={{
              marginBottom: { xs: '24px', md: '0px' },
              borderRadius: 3,
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <CustomButton
                title={t(translations.common.save)}
                isDisable={false}
                isIcon
                isHide={
                  !checkPermissionExist(
                    PermissionKeyEnum.STAFF_UPDATE,
                    userInfo,
                  )
                }
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
            </Grid>
            <Grid container xs={12} sm={12}>
              <Grid item md={12} lg={7}>
                <Typography
                  fontSize={'20px'}
                  fontWeight={700}
                  color={palette.primary.button}
                >
                  Thông tin nhân viên
                </Typography>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box mt={1} mr={'16px'} sx={{ width: '51%' }}>
                    <TextFieldCustom
                      placeholder="Nhập họ và tên"
                      label="Nhập họ và tên"
                      isRequired
                      name="fullName"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                  <Box mt={1} mr={'16px'} sx={{ width: '20%' }}>
                    <TextFieldCustom
                      placeholder="Ngày sinh"
                      label="Chọn ngày"
                      type="date"
                      name="birthDay"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled={!isEdit}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      ml: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      width: '30%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio
                        checked={isMale}
                        onChange={handleChangeMale}
                        disabled={!isEdit}
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: theme.palette.common.black,
                        }}
                      >
                        Nam
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} ml={5}>
                      <Radio
                        checked={!isMale}
                        disabled={!isEdit}
                        onChange={handleChangeMale}
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: theme.palette.common.black,
                        }}
                      >
                        Nữ
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box mt={1} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      placeholder="Nhập địa chỉ Email"
                      label="Địa chỉ Email"
                      name="email"
                      isRequired
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                  <Box mt={1} ml={'16px'} mr={'16px'} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      placeholder="Số điện thoại"
                      label="Nhập số điện thoại"
                      isRequired
                      name="phone"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled={!isEdit}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box mt={1} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      placeholder="Chọn đơn vị"
                      label="Đơn vị làm việc"
                      type="selectsearch"
                      optionAutoComplete={listOrgChart}
                      onChange={handleSelectedUnits}
                      name="orgChartId"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                  <Box mt={1} ml={'16px'} mr={'16px'} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      placeholder="Chọn cấp bậc"
                      label="Cấp bậc"
                      type="select"
                      options={levelSource}
                      name="staffLevel"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box mt={1} mr={'16px'} sx={{ width: '100%' }}>
                    <TextFieldCustom
                      placeholder="Nhập chức danh"
                      label="Chức danh"
                      name="position"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                </Grid>
                <Typography
                  fontSize={'20px'}
                  fontWeight={700}
                  color={palette.primary.button}
                  mt={4}
                >
                  Liên kết mạng xã hội
                </Typography>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box mt={1} sx={{ width: '300px' }}>
                    <TextFieldCustom
                      placeholder="Mạng xã hội"
                      label="Chọn mạng xã hội"
                      name="socialApp"
                      options={soicalSource}
                      control={control}
                      type="select"
                      errors={errors}
                      disabled={!isEdit}
                    />
                  </Box>
                  <Box mt={1} ml={'16px'} mr={'16px'} sx={{ width: '100%' }}>
                    <TextFieldCustom
                      placeholder="Link liên kết"
                      label="Nhập link liên kết"
                      name="socialLink"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled={!isEdit}
                    />
                  </Box>
                  <Box mt={2} sx={{ width: '73px' }}>
                    <CustomButton
                      title={t(translations.common.add)}
                      sxProps={{
                        background: theme.palette.common.white,
                        color: palette.primary.button,
                        border: `1px solid ${palette.primary.button}`,
                        p: 0,
                        borderRadius: '8px',
                        width: '73px',
                        ':hover': {
                          background: theme.palette.common.white,
                        },
                      }}
                      sxPropsText={{
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                      handleClick={handleAddLink}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  {listlink.map((item, index) => (
                    <Box
                      sx={{
                        background: '#FFD9EA',
                        p: '4px 8px',
                        borderRadius: '30px',
                        display: 'flex',
                        mr: 1.5,
                        mb: 1,
                        alignItems: 'center',
                        width: 'fit-content',
                      }}
                    >
                      {renderContent(item)}

                      <Typography
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          marginLeft: '6px',
                        }}
                        fontWeight={700}
                        fontSize={'12px'}
                        color={'black'}
                      >
                        {item.link}
                      </Typography>
                      <img
                        src={CLOSE_ICON}
                        style={{ marginLeft: 10, cursor: 'pointer' }}
                        onClick={() => handleRemoveLink(index)}
                      />
                    </Box>
                  ))}
                </Grid>
              </Grid>
              <Grid item md={12} lg={5}>
                <Typography
                  fontSize={'20px'}
                  fontWeight={700}
                  color={palette.primary.button}
                >
                  Định danh nhân viên
                </Typography>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }} pr={3}>
                  <Box
                    sx={{
                      mt: 3,
                      display: 'flex',
                      alignItems: 'center',
                      ml: -1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio
                        checked={
                          isIdentifier ===
                          TYPEIdentification.CITIZEN_IDENTIFICATION
                        }
                        onChange={() =>
                          handleChangeIdentifier(
                            TYPEIdentification.CITIZEN_IDENTIFICATION,
                          )
                        }
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                          },
                        }}
                        disabled
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: theme.palette.common.black,
                        }}
                      >
                        Căn cước công dân
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} ml={6}>
                      <Radio
                        disabled
                        checked={
                          isIdentifier === TYPEIdentification.IDENTITY_CARD
                        }
                        onChange={() =>
                          handleChangeIdentifier(
                            TYPEIdentification.IDENTITY_CARD,
                          )
                        }
                        sx={{
                          color: palette.primary.button,
                          '&.Mui-checked': {
                            color: palette.primary.button,
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: theme.palette.common.black,
                        }}
                      >
                        Chứng minh nhân dân
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                  <Box mt={1} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      placeholder={`Nhập số ${renderIdentifier(isIdentifier)}`}
                      label={`Số ${renderIdentifier(isIdentifier)}`}
                      name="identityNumber"
                      format="number"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                  <Box mt={1} ml={'16px'} sx={{ width: '50%' }}>
                    <TextFieldCustom
                      label="Ngày cấp"
                      placeholder="Chọn ngày cấp"
                      name="dateRange"
                      type="date"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                  <Box mt={1} sx={{ width: '100%' }}>
                    <TextFieldCustom
                      label="Nơi cấp"
                      placeholder="Chọn nơi cấp"
                      type="select"
                      options={listIssuedby}
                      name="issuedBy"
                      control={control}
                      errors={errors}
                      setError={setError}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography mt={1}>
                    {'Chụp mặt trước, mặt sau CMND/CCCD'}
                  </Typography>
                  <Stack sx={{ flexDirection: 'row', mt: 2.5 }}>
                    <UploadFile
                      handleSelectFile={handleSelectFileFront}
                      buttonName="Ảnh mặt trước"
                      warningMessage="lỗi"
                      name="fileId"
                      control={control}
                      errors={errors}
                      urlDefault={
                        staffDetail?.files.find(
                          element => element?.field === StaffFieldType.FRONT,
                        )?.file?.path
                      }
                      bgImage={DEFAULT_FRONT}
                    />
                    <Box ml={1.5}>
                      <UploadFile
                        handleSelectFile={handleSelectFileBack}
                        buttonName="Ảnh mặt sau"
                        warningMessage="lỗi"
                        name="fileId"
                        control={control}
                        errors={errors}
                        urlDefault={
                          staffDetail?.files.find(
                            element => element?.field === StaffFieldType.BACK,
                          )?.file?.path
                        }
                        bgImage={DEFAULT_BACK}
                      />
                    </Box>
                    <Box ml={1.5}>
                      <UploadFile
                        handleSelectFile={handleSelectFilePortrait}
                        buttonName="Ảnh chân dung"
                        warningMessage="lỗi"
                        name="fileId"
                        control={control}
                        errors={errors}
                        urlDefault={
                          staffDetail?.files.find(
                            element =>
                              element?.field === StaffFieldType.PORTRAIT,
                          )?.file?.path
                        }
                        bgImage={DEFAULT_PORTRAIT}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <DialogActions
          sx={{
            // display: 'flex',
            // alignItems: 'center',
            // mt: '25px',
            // justifyContent: 'end',
            position: 'fixed',
            bottom: '8px',
            right: '24px',
          }}
        >
          {isEdit && (
            <Box>
              <CustomButton
                title="Hủy bỏ"
                sxProps={{
                  borderRadius: '8px',
                  width: '160px',
                  color: '#1E1E1E',
                  fontWeight: '400',
                  marginRight: '12px'
                }}
                variant="outlined"
                handleClick={() => {
                  setEdit(false);
                }}
              />
              <CustomButton
                title="Cập nhật"
                sxProps={{
                  borderRadius: '8px',
                  width: '160px',
                }}
                variant="contained"
                typeButton={'submit'}
              />
            </Box>
          )}

{!isEdit && (
   <CustomButton
   title="Cập nhật thông tin"
   sxProps={{
     borderRadius: '8px',
     width: '180px',
   }}
   variant="contained"
   handleClick={() => {
    setEdit(true);
  }}
 />
  )}
         
        </DialogActions>
      </form>
    </Box>
  );
}
