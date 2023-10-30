import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  Box,
  Grid,
  IconButton,
  Link as MuiLink,
  Radio,
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
import { useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ApproveCustomerBigTypeEnum,
  CustomerEvaluationBigType,
  CustomerGroupType,
  CustomerSourceType,
  Gender,
  SocialType,
  TYPEIdentification,
} from 'types/Enum';
import palette from 'styles/theme/palette';

import { useProfile } from 'app/hooks';
import { ErrorType, OptionCustom } from 'types/Option';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist, formatDateTime2 } from 'utils/helpers';

import { AddressInfo } from 'app/pages/TransactionManagement/components/addressInfo';
import { LegalEntityInfo } from 'app/pages/TransactionManagement/components/legalEntityInfo';
import documentService from 'services/api/document';
import UploadFile from '../components/UploadFile';
import { useCustomerSlice } from '../slice';
import { selectCustomer } from '../slice/selector';
import { PayloadCreateCustomer } from '../slice/types';

interface Props {
  isEdit?: boolean;
  handleClose?: () => void;
}

const ListProject = [
  { code: 'METROSTAR', name: 'METRO STAR' },
  { code: 'LEMAN_LUXURY', name: 'LÉMAN LUXURY APARTMENT' },
  { code: 'CT_PLAZA_NH', name: 'CT PLAZA NGUYÊN HỒNG' },
  { code: 'DIYAS', name: 'DIYAS' },
  { code: 'CT_PLAZA_MC', name: 'CT PLAZA MINH CHÂU' },
  { code: 'DIAMOND', name: 'DIAMOND SQUARE' },
  { code: 'BURANO', name: 'BURANO STATION' },
  { code: 'RESIDENCE', name: 'LÉMAN CAP RESIDENCE' },
  { code: 'PARKING', name: 'LÉMAN PARKING LOT' },
];

export default function CreateCustomer(props: Props) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const userInfo = useProfile();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { actions: snackbarActions } = useSnackbarSlice();
  const { customerDetail } = useSelector(selectCustomer);
  const { actions } = useCustomerSlice();

  const FormControl = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {},
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
  } = FormControl;

  const [isLoading, setIsLoading] = useState(false);
  const [isMale, setIsMale] = useState(true);
  const [isIdentifier, setIsIdentifier] = useState(
    TYPEIdentification.CITIZEN_IDENTIFICATION,
  );
  const [isSourceOther, setIsSourceOther] = useState(false);
  const [listProject, setListProject] = useState<OptionCustom[]>([]);
  const [customerType, setcustomerType] = useState<CustomerGroupType>(
    CustomerGroupType.DAILY,
  );

  useEffect(() => {
    genarateProject();
    return () => {
      dispatch(actions.clearDataCustomer());
    };
  }, [actions, dispatch]);

  const genarateProject = () => {
    const newData: OptionCustom[] = [];
    ListProject?.forEach(item => {
      newData.push({
        id: item.code,
        key: item.name,
        value: item.code,
        name: item.name,
        isCheck: false,
      });
    });
    setListProject(newData);
  };

  useEffect(() => {
    if (isEdit && customerDetail) {
      reset({
        phoneNumber: customerDetail?.phoneNumber,
        street: customerDetail?.street,
        streetBorn: customerDetail?.streetBorn,
        email: customerDetail?.email,
        birth: customerDetail?.birth || null,
        typeIdentification: customerDetail?.typeIdentification,
        name: customerDetail?.name?.toUpperCase(),
        identityNumber: customerDetail?.identityNumber,
        issuedBy: customerDetail?.issuedBy,
        dateRange: customerDetail?.dateRange,
        otherSource: customerDetail?.otherSource,
        source: customerDetail?.source,
        district: customerDetail?.district,
        province: customerDetail?.province,
        ward: customerDetail?.ward,
        districtBorn: customerDetail?.districtBorn,
        provinceBorn: customerDetail?.provinceBorn,
        wardBorn: customerDetail?.wardBorn,
        code: customerDetail?.code,
        note: customerDetail?.note,
        socialApp: customerDetail?.socialApp,
        projectName: customerDetail?.projectName,
        groupType: customerDetail?.groupType,
        finance: customerDetail?.finance,
        agree: customerDetail?.agree,
        otherReason: customerDetail?.otherReason,
        referralEmployeeCode: customerDetail?.referralEmployeeCode,
        referralEmployeeName: customerDetail?.referralEmployeeName,
        evaluation: customerDetail?.evaluation,
      });
      const project = [...listProject];
      project.forEach((item, index) => {
        if (
          customerDetail?.mentionedProject?.length &&
          customerDetail?.mentionedProject.includes(item.id || 'Back')
        ) {
          project[index].isCheck = true;
        }
      });
      setListProject(project);
      setIsSourceOther(customerDetail?.source === CustomerSourceType.OTHER);
      setcustomerType(customerDetail?.groupType);
      setIsMale(customerDetail?.gender === Gender.MALE);
      setIsIdentifier(customerDetail?.typeIdentification);

      if (customerDetail?.files && customerDetail?.files?.length) {
        setAttachments(customerDetail?.files);
        const listId: any[] = [];
        customerDetail?.files.forEach(e => {
          if (e?.file?.id) {
            listId.push(e?.file?.id);
          }
        });
        setValue('files', listId);
      }
      if (customerDetail?.filesVip && customerDetail?.filesVip?.length) {
        setAttachmentsFinance(customerDetail?.filesVip);
        const listId: any[] = [];
        customerDetail?.filesVip.forEach(e => {
          if (e?.file?.id) {
            listId.push(e?.file?.id);
          }
        });
        setValue('filesVip', listId);
      }
    }
  }, [
    customerDetail?.phoneNumber,
    customerDetail?.address,
    customerDetail?.email,
    customerDetail?.finance,
    customerDetail?.otherReason,
    customerDetail?.agree,
    customerDetail?.birth,
    customerDetail?.typeIdentification,
    customerDetail?.name,
    customerDetail?.identityNumber,
    customerDetail?.issuedBy,
    customerDetail?.dateRange,
    customerDetail?.otherSource,
    customerDetail?.source,
    customerDetail?.district,
    customerDetail?.districtBorn,
    customerDetail?.province,
    customerDetail?.provinceBorn,
    customerDetail?.ward,
    customerDetail?.wardBorn,
    customerDetail?.code,
    customerDetail?.code,
    customerDetail?.socialApp,
    customerDetail?.projectName,
    customerDetail?.groupType,
    customerDetail?.files,
    customerDetail?.filesVip,
    customerDetail?.referralEmployeeCode,
    customerDetail?.referralEmployeeName,
    customerDetail?.evaluation,
    isEdit,
    reset,
  ]);

  useEffect(() => {
    if (!isEdit) {
      getGenerateCode();
    }
  }, [isEdit]);

  const getGenerateCode = async () => {
    const genarateCode = { generateCode: 'KH' };
    const data = await documentService.postGenarateCode(genarateCode);
    setValue('code', data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const customerSourceType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Data Sale',
        value: CustomerSourceType.DATA,
      },
      {
        id: 2,
        key: 'Hotline',
        value: CustomerSourceType.HOTLINE,
      },
      {
        id: 3,
        key: 'CBNV',
        value: CustomerSourceType.CBNV,
      },
      {
        id: 4,
        key: 'Other',
        value: CustomerSourceType.OTHER,
      },
    ];
  }, []);

  const customerBigEvaluationType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Lịch sử mua BĐS (CTG, CĐT khác)',
        value: CustomerEvaluationBigType.HISTORY,
      },
      {
        id: 2,
        key: 'KH là chủ DN niêm yết trên sàn chứng khoán',
        value: CustomerEvaluationBigType.STOCK,
      },
      {
        id: 3,
        key: 'Bác sĩ thẩm mỹ nổi tiếng',
        value: CustomerEvaluationBigType.DOCTOR,
      },
      {
        id: 4,
        key: 'Người thân của Quan chức/Lãnh đạo Nhà nước',
        value: CustomerEvaluationBigType.RELATIES,
      },
      {
        id: 5,
        key: 'KH có sở hữu nhiều BĐS có giá trị trên 50 tỷ',
        value: CustomerEvaluationBigType.BDS,
      },
      {
        id: 6,
        key: 'KH triệu dặm của các hãng Hàng Không',
        value: CustomerEvaluationBigType.AIRLINE,
      },
      {
        id: 7,
        key: 'KH là chủ DN của các thương hiệu nổi tiếng',
        value: CustomerEvaluationBigType.TRADEMARK,
      },
      {
        id: 8,
        key: 'KH là cổ đông lớn của các Công ty niêm yết trên sàn chứng khoán (sở hữu >= 5% số lượng cổ phiếu)',
        value: CustomerEvaluationBigType.SHAREHOLDER,
      },
      {
        id: 9,
        key: 'KH VIP của các thương hiệu xa xỉ: đồng hồ, du thuyền, ô tô, trang sức, túi xách,…',
        value: CustomerEvaluationBigType.VIP,
      },
      {
        id: 9,
        key: 'KH VERYVIP của các Tập Đoàn BĐS khác còn khả năng tài chính',
        value: CustomerEvaluationBigType.VERYVIP,
      },
      {
        id: 10,
        key: 'KH có tài khoản chứng khoán trị giá 30 tỷ trở lên',
        value: CustomerEvaluationBigType.STOCK30,
      },
      {
        id: 11,
        key: 'KH có gửi tiền tiết kiệm trên 30 tỷ',
        value: CustomerEvaluationBigType.SAVINGS,
      },
      {
        id: 12,
        key: 'Tiêu chí khác',
        value: CustomerEvaluationBigType.OTHER,
      },
    ];
  }, []);

  const customerTypeList = useMemo(() => {
    return [
      {
        id: 1,
        key: 'KH phát sinh hằng ngày',
        value: CustomerGroupType.DAILY,
        isDefault: true,
      },
      {
        id: 2,
        key: 'KH quan tâm',
        value: CustomerGroupType.INTERESTED,
      },
      {
        id: 3,
        key: 'KH tiềm năng',
        value: CustomerGroupType.POTENTIAL,
      },
      {
        id: 4,
        key: 'KH lớn',
        value: CustomerGroupType.BIG,
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
      {
        id: 2,
        key: 'WhatsApp',
        value: SocialType.WHATSAPP,
      },
      {
        id: 3,
        key: 'Instagram',
        value: SocialType.INSTAGRAM,
      },
      {
        id: 4,
        key: 'Snapchat',
        value: SocialType.SNAPCHAT,
      },
      {
        id: 5,
        key: 'Twitter',
        value: SocialType.TWITTER,
      },
      {
        id: 6,
        key: 'Google',
        value: SocialType.GOOGLE,
      },
      {
        id: 7,
        key: 'Zalo',
        value: SocialType.ZALO,
      },
      {
        id: 8,
        key: 'Website',
        value: SocialType.WEBSITE,
      },
      {
        id: 9,
        key: 'Khác',
        value: SocialType.OTHER,
      },
    ];
  }, []);

  const [attachments, setAttachments] = useState<any[]>([]);

  const [attachmentFinance, setAttachmentsFinance] = useState<any[]>([]);

  const getlinkAttacment = (file: any) => {
    if (!file) return;
    if (!file?.name) {
      return process.env.REACT_APP_API_URL + `/${file?.file?.path}`;
    }
    if (file?.name) {
      const url = URL.createObjectURL(file);
      return url;
    }
  };

  const renderFileAttachment = (attachments: any[]) => {
    if (!attachments?.length) return;
    return (
      <>
        {attachments?.map((e: any, index: number) => (
          <MuiLink
            key={index}
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#006EE6',
              cursor: 'pointer',
              width: '85%',
              maxWidth: '40vw',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
            href={getlinkAttacment(e)}
            target="_blank"
          >
            <AttachFileIcon
              sx={{
                width: '1.25rem',
                height: '1.25rem',
                mr: 0.5,
                transform: 'rotate(45deg) scaleY(-1)',
              }}
            />
            <span>{e?.name || e?.file?.path}</span>
          </MuiLink>
        ))}
      </>
    );
  };

  const onSubmitForm = async (
    data: PayloadCreateCustomer,
    sendApprove: boolean,
  ) => {
    setIsLoading(true);
    const evaluationOther = watch('evaluationOther');
    const address =
      data.street +
      ' ,' +
      data.ward +
      ' ,' +
      data.district +
      ' ,' +
      data.province;
    let mentionedProject = '';
    listProject.forEach(item => {
      if (item.isCheck) {
        mentionedProject += `$${item.value}`;
      }
    });

    if (
      data.evaluation === CustomerEvaluationBigType.OTHER &&
      evaluationOther &&
      evaluationOther.length > 0
    ) {
      data.evaluation = evaluationOther;
    }

    if (isEdit) {
      const requestPayload = {
        ...data,
        id,
        address,
        sendApprove,
        mentionedProject,
        gender: isMale ? Gender.MALE : Gender.FEMALE,
        typeIdentification: isIdentifier,
      };
      await dispatch(
        actions.updateDataCustomer(requestPayload, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật thành công',
                  type: 'success',
                }),
              );
              setTimeout(() => {
                navigate(path.potentialAccount);
              }, 1000);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    res?.response?.data?.message || 'Cập nhật không thành công',
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
    } else {
      const requestPayload = {
        ...data,
        address,
        sendApprove,
        mentionedProject,
        gender: isMale ? Gender.MALE : Gender.FEMALE,
        typeIdentification: isIdentifier,
      };

      await dispatch(
        actions.createCustomer(requestPayload, (err?: any) => {
          if (err) {
            if (err?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo thành công',
                  type: 'success',
                }),
              );
              navigate(path.potentialAccount);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    err?.response?.data?.message || 'Tạo không thành công',
                  type: 'error',
                }),
              );
            }
            setIsLoading(false);
          }
        }),
      );
    }
  };

  const submit = async (data: PayloadCreateCustomer) => {
    onSubmitForm(data, false);
  };

  const submitApprove = async (data: PayloadCreateCustomer) => {
    onSubmitForm(data, true);
  };

  const onError: SubmitErrorHandler<PayloadCreateCustomer> = errors => {
    console.log('errors', errors);

    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const handleChangeSourceType = (value: string | number) => {
    if (value === CustomerSourceType.OTHER) {
      setIsSourceOther(true);
    } else {
      setIsSourceOther(false);
    }
    clearErrors();
  };

  const handleChangeMale = () => {
    setIsMale(!isMale);
  };

  const hanldeRemoveProject = (index: number) => {
    const project = [...listProject];
    project[index].isCheck = false;
    setListProject(project);
  };

  const onChangeProject = (value: string | number) => {
    const project = [...listProject];
    const item = project.find(item => item.value === value);
    const index = project.findIndex(item => item.value === value);
    const numCheck = project.filter(item => item.isCheck === true);
    if (item?.isCheck) {
      project[index].isCheck = false;
    } else {
      if (numCheck.length < 5) {
        project[index].isCheck = true;
      } else {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Số dự án quan tâm tối đa là 5',
            type: 'error',
          }),
        );
      }
    }
    setListProject(project);
  };

  const handleSelected = (value: CustomerGroupType) => {
    setcustomerType(value);
    setValue('birth', formatDateTime2(watch('birth')));
  };

  const hanldeAttachment = (files: any) => {
    setAttachments(files);
  };

  const hanldeAttachmentFinance = (files: any) => {
    setAttachmentsFinance(files);
  };

  return (
    <Box pb={'43px'} mt={'-10px'}>
      <form onSubmit={handleSubmit(submit, onError)}>
        <Grid
          container
          xs={12}
          sm={12}
          bgcolor={theme.palette.grey[0]}
          p={'24px'}
          pb={10}
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
                  ? `Khách hàng - ${customerDetail?.code}`
                  : 'Tạo mới khách hàng'}
              </Typography>
            </Box>
            <Box>
              <CustomButton
                title={
                  isEdit
                    ? t(translations.common.update)
                    : t(translations.common.save)
                }
                isHide={
                  !checkPermissionExist(
                    PermissionKeyEnum.CUSTOMER_UPDATE,
                    userInfo,
                  )
                }
                isDisable={
                  (customerDetail?.customerBigApprove[0]?.status ===
                    ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                    customerDetail?.customerBigApprove[0]?.status ===
                      ApproveCustomerBigTypeEnum.APPROVED) &&
                  customerType === CustomerGroupType.BIG
                }
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
                handleClick={handleSubmit(submit, onError)}
              />
              <CustomButton
                title={t(translations.common.save_sent)}
                isHide={
                  !checkPermissionExist(
                    PermissionKeyEnum.CUSTOMER_UPDATE,
                    userInfo,
                  )
                }
                isIcon
                isDisable={
                  customerDetail?.customerBigApprove[0]?.status ===
                  ApproveCustomerBigTypeEnum.WAIT_APPROVE
                }
                buttonMode="send"
                typeButton={'submit'}
                sxProps={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  borderRadius: '8px',
                  ml: 2,
                  display:
                    customerDetail?.customerBigApprove[0]?.status ===
                      ApproveCustomerBigTypeEnum.APPROVED ||
                    customerType !== CustomerGroupType.BIG
                      ? 'none'
                      : '',
                }}
                sxPropsText={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                handleClick={handleSubmit(submitApprove, onError)}
              />
            </Box>
          </Grid>
          <Grid item xs={4} md={4} mt={3}>
            <TextFieldCustom
              placeholder="Chọn nhóm khách hàng"
              label="Nhóm khách hàng"
              name="groupType"
              options={customerTypeList}
              control={control}
              onChange={handleSelected}
              type="select"
              errors={errors}
              isRequired
            />
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: 'flex' }}>
            <Grid item xs={4} md={4} mt={1}>
              <TextFieldCustom
                placeholder=""
                label="Mã khách hàng"
                name="code"
                control={control}
                errors={errors}
                disabled
                setError={setError}
              />
            </Grid>
            <Grid item xs={4} md={4} mt={1} ml={2}>
              <TextFieldCustom
                placeholder="Nhập họ & tên khách hàng"
                label="Tên khách hàng"
                isRequired
                name="name"
                control={control}
                type="upper"
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={4} md={4} mt={1} sx={{ display: 'flex', ml: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Radio
                  checked={isMale}
                  onChange={handleChangeMale}
                  title="Nam"
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
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
            <Grid item xs={4} md={4} mt={1}>
              <TextFieldCustom
                label="Ngày sinh"
                placeholder="Chọn ngày sinh"
                name="birth"
                control={control}
                errors={errors}
                setError={setError}
                isRequired={customerType !== CustomerGroupType.DAILY}
                type={
                  customerType === CustomerGroupType.INTERESTED
                    ? 'text'
                    : 'date'
                }
              />
            </Grid>
            <Grid item xs={4} md={4} mt={1} mx={2}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ Email"
                label="Địa chỉ Email"
                name="email"
                control={control}
                errors={errors}
                setError={setError}
                format="email"
                isRequired={customerType !== CustomerGroupType.DAILY}
              />
            </Grid>
            <Grid item xs={4} md={4} mt={1}>
              <TextFieldCustom
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                isRequired
                name="phoneNumber"
                control={control}
                errors={errors}
                format="phone"
                setError={setError}
              />
            </Grid>
          </Grid>
          <AddressInfo
            formControl={FormControl}
            fieldNameObject={{
              province: 'province',
              district: 'district',
              ward: 'ward',
              street: 'street',
              provinceBorn: 'provinceBorn',
              districtBorn: 'districtBorn',
              wardBorn: 'wardBorn',
              streetBorn: 'streetBorn',
            }}
          />
          <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
            <LegalEntityInfo
              isRequired={customerType !== CustomerGroupType.BIG}
              formControl={FormControl}
              fieldNameObject={{
                identifierType: 'typeIdentification',
                identityNumber: 'identityNumber',
                dateRange: 'dateRange',
                issuedBy: 'issuedBy',
              }}
            />
          </Grid>
          {customerType === CustomerGroupType.BIG && (
            <>
              <Typography
                fontSize={'14px'}
                fontWeight={700}
                mt={3}
                color={theme.palette.common.black}
              >
                Điều kiện đáp ứng
              </Typography>
              <Grid item xs={12} sm={12} display={'flex'}>
                <Grid item xs={8} md={8} mt={1} mr={2}>
                  <Box>
                    <TextFieldCustom
                      placeholder="Chọn tiêu chí tài chính"
                      label="Tiêu chí tài chính"
                      name="evaluation"
                      control={control}
                      options={customerBigEvaluationType}
                      type="select"
                      isRequired
                      errors={errors}
                      disabled={
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.APPROVED
                      }
                    />
                  </Box>
                  {watch('evaluation') === CustomerEvaluationBigType.OTHER && (
                    <Box sx={{ mt: 2 }}>
                      <TextFieldCustom
                        placeholder="Nhập tiêu chí khác"
                        label="Tiêu chí khác"
                        name="evaluationOther"
                        control={control}
                        errors={errors}
                        isRequired
                        disabled={
                          customerDetail?.customerBigApprove[0]?.status ===
                            ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                          customerDetail?.customerBigApprove[0]?.status ===
                            ApproveCustomerBigTypeEnum.APPROVED
                        }
                      />
                    </Box>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <TextFieldCustom
                      placeholder="Nhập mô tả tài chính"
                      label="Chi tiết tài chính"
                      name="finance"
                      control={control}
                      errors={errors}
                      disabled={
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.APPROVED
                      }
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextFieldCustom
                      placeholder="Nhập nhoả thuận đồng hành"
                      label="Thoả thuận đồng hành"
                      name="agree"
                      control={control}
                      errors={errors}
                      disabled={
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.APPROVED
                      }
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextFieldCustom
                      placeholder="Nhập lý do khác"
                      label="Khác"
                      name="otherReason"
                      control={control}
                      errors={errors}
                      disabled={
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.APPROVED
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4}>
                  {(!watch('filesVip') || watch('filesVip')?.length <= 100) && (
                    <UploadFile
                      formControl={FormControl}
                      fileMax={100}
                      name="filesVip"
                      hanldeAttachment={hanldeAttachmentFinance}
                      disabled={
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.WAIT_APPROVE ||
                        customerDetail?.customerBigApprove[0]?.status ===
                          ApproveCustomerBigTypeEnum.APPROVED
                      }
                    />
                  )}
                  <Box sx={{ mt: 2 }}>
                    {renderFileAttachment(attachmentFinance)}
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
          {customerType === CustomerGroupType.BIG && (
            <>
              <Typography
                fontSize={'14px'}
                fontWeight={700}
                color={theme.palette.common.black}
              >
                Người giới thiệu
              </Typography>
              <Grid item xs={12} sm={12} display={'flex'}>
                <Grid item xs={4} md={4} mt={1} mr={2}>
                  <TextFieldCustom
                    placeholder="Nhập mã nhân viên giới thiệu"
                    label="Mã nhân viên"
                    name="referralEmployeeCode"
                    control={control}
                    errors={errors}
                    disabled={
                      customerDetail?.customerBigApprove[0]?.status ===
                      'WAIT_APPROVE'
                    }
                  />
                </Grid>
                <Grid item xs={8} md={8} mt={1}>
                  <TextFieldCustom
                    placeholder="Nhập tên nhân viên giới thiệu"
                    label="Tên nhân viên"
                    name="referralEmployeeName"
                    type="upper"
                    control={control}
                    errors={errors}
                    disabled={
                      customerDetail?.customerBigApprove[0]?.status ===
                      'WAIT_APPROVE'
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Typography
            fontSize={'14px'}
            fontWeight={700}
            mt={3}
            color={theme.palette.common.black}
          >
            Thông tin khác
          </Typography>
          <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
            <Grid item xs={4} md={4} mt={1}>
              <TextFieldCustom
                placeholder="Chọn nguồn"
                label="Nguồn"
                name="source"
                options={customerSourceType}
                control={control}
                type="select"
                errors={errors}
                onChange={handleChangeSourceType}
                isRequired
              />
            </Grid>
            <Grid item xs={8} md={8} mt={1} ml={2}>
              <TextFieldCustom
                placeholder="Nhập nguồn khác"
                label="Nguồn khác (Nếu có)"
                name="otherSource"
                control={control}
                errors={errors}
                disabled={!isSourceOther}
                isRequired={isSourceOther}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
            <Grid item xs={4} md={4} mt={1}>
              <TextFieldCustom
                placeholder="Chọn kênh truyền thông"
                label="Kênh truyền thông"
                name="socialApp"
                options={soicalSource}
                control={control}
                type="select"
                errors={errors}
                isRequired
              />
            </Grid>
            <Grid item xs={8} md={8} mt={1} ml={2}>
              <TextFieldCustom
                placeholder="Chọn dự án quan tâm"
                label="Dự án quan tâm"
                isRequired
                optionsCustom={listProject}
                type="selectMultiple"
                name="mentionedProject"
                control={control}
                errors={errors}
                onChange={onChangeProject}
                setError={setError}
              />
              <Box
                sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
              >
                {listProject.map((item, index) => (
                  <>
                    {item.isCheck ? (
                      <Box
                        sx={{
                          border: '1px solid #FF9EB6',
                          background: '#FDEAF4',
                          borderRadius: '16px',
                          mr: '5px',
                          padding: '4px 6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography
                          fontSize={10}
                          fontWeight={600}
                          color={'black'}
                          mr={0.5}
                        >
                          {item.name}
                        </Typography>
                        <IconButton
                          sx={{ p: 0 }}
                          onClick={() => hanldeRemoveProject(index)}
                        >
                          <img src={CLOSE_ICON} alt="close icon" />
                        </IconButton>
                      </Box>
                    ) : (
                      <div style={{ height: 25 }} />
                    )}
                  </>
                ))}
              </Box>
            </Grid>
          </Grid>
          {customerType === CustomerGroupType.BIG || (
            <Grid item xs={12} sm={12}>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  color={'#1E1E1E'}
                >
                  {'Chứng từ liên quan (nếu có)'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>{renderFileAttachment(attachments)}</Box>
              {(!watch('files') || watch('files')?.length <= 5) && (
                <UploadFile
                  formControl={FormControl}
                  fileMax={5}
                  name="files"
                  hanldeAttachment={hanldeAttachment}
                />
              )}
            </Grid>
          )}
          {!isEdit && (
            <>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                <Grid item xs={6} md={6} mt={1}>
                  <TextFieldCustom
                    placeholder="Nhập hình thức gặp gỡ"
                    label="Hình thức gặp gỡ"
                    name="meetingForm"
                    control={control}
                    errors={errors}
                    isRequired
                  />
                </Grid>
                <Grid item xs={6} md={6} mt={1} ml={2}>
                  <TextFieldCustom
                    placeholder="Chọn ngày gặp gỡ"
                    label="Ngày gặp gỡ - trao đổi"
                    name="meetingAt"
                    control={control}
                    type="date"
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                <Grid item xs={6} md={6} mt={1}>
                  <TextFieldCustom
                    placeholder="Nhập tỉ lệ hài lòng"
                    label="Tỉ lệ hài lòng"
                    name="satisfactionRate"
                    control={control}
                    errors={errors}
                    max={100}
                    format="number"
                    isRequired
                    endAdornment={<Typography>%</Typography>}
                  />
                </Grid>
                <Grid item xs={6} md={6} mt={1} ml={2}>
                  <TextFieldCustom
                    placeholder="Nhập tỉ lệ chốt deal"
                    label="Tỉ lệ chốt deal"
                    name="purchaseRate"
                    max={100}
                    format="number"
                    control={control}
                    errors={errors}
                    isRequired
                    endAdornment={<Typography>%</Typography>}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                <Grid item xs={6} md={6} mt={1}>
                  <TextFieldCustom
                    placeholder={`Nhập lịch sử làm việc với khách hàng...`}
                    label="Lịch sử làm việc với khách hàng"
                    isRequired
                    name="workHistory"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
                <Grid item xs={6} md={6} mt={1} ml={2}>
                  <TextFieldCustom
                    placeholder={`Thông tin trao đổi với khách hàng`}
                    label="Thông tin trao đổi với khách hàng"
                    isRequired
                    name="informationExchanged"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                <Grid item xs={6} md={6} mt={1}>
                  <TextFieldCustom
                    placeholder={`Nhập Feedback của khách hàng...`}
                    label="Feedback của khách hàng"
                    isRequired
                    name="feedback"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
                <Grid item xs={6} md={6} mt={1} ml={2}>
                  <TextFieldCustom
                    placeholder={`Nhập mô tả chân dung chi tiết khách hàng...`}
                    label="Mô tả chân dung khách hàng"
                    isRequired
                    name="description"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                <Grid item xs={6} md={6} mt={1}>
                  <TextFieldCustom
                    placeholder={`Nhập kế hoạch - đề xuất...`}
                    label="Kế hoạch - đề xuất"
                    isRequired
                    name="proposedSolutions"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
                <Grid item xs={6} md={6} mt={1} ml={2}>
                  <TextFieldCustom
                    placeholder={`Nhập nội dung ghi chú...`}
                    label="Ghi chú"
                    name="note"
                    type="textarea2"
                    control={control}
                    errors={errors}
                    setError={setError}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </Box>
  );
}
