import { Box, Grid, styled, useTheme } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useFilter } from 'app/hooks';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import { useCustomerSlice } from 'app/pages/CustomerPotential/slice';
import { selectCustomer } from 'app/pages/CustomerPotential/slice/selector';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { get } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import documentService from 'services/api/document';
import { EnumObject, FilterParams, TableHeaderProps } from 'types';
import { CustomerType, TitleEnum } from 'types/Enum';
import {
  formatCurrency,
  getLinkDownloadTemplateContract,
  readMoney,
} from 'utils/helpers';

import SelectSearch from '../components/select-search';
import { useSettingSlice } from '../slice';
import { selectSetting } from '../slice/selector';

const LayoutBox = styled(Box)<{ mt?: number | string }>`
  margin-top: ${props => `${(props?.mt && props?.mt) || '21px'}`};
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.08);
`;

interface Props {
  isEdit?: boolean;
  isAppendix?: boolean;
}

export default function CreateContract(props: Props) {
  const { isEdit, isAppendix } = props;
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };
  const { id } = useParams();
  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };
  const theme = useTheme();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [htmlData, setHtmlData] = useState('');
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch,
  } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      type: null,
      name: '',
      contractCode: '',
      representative: '',
      position: '',
      fax: '',
      typeRadio: get(CustomerType, 'COMPANY'),
      customer: '',
      supplier: 0,
      purpose: '',
      properties: [],
      files: [],
      sendTime: 0,
      price: {
        priceUnit: '',
        paymentMethod: '',
        totalPrice: null,
        totalPriceText: '',
        address: '',
        tax: null,
        payTimes: null,
        payDetail: [],
      },
      time: {
        summaryReportMethod: '',
        summaryReportTime: undefined,
        summaryReportLanguage: [{ language: undefined, amount: undefined }],
        draftReportMethod: '',
        draftReportTime: undefined,
        draftReportLanguage: [{ language: undefined, amount: undefined }],
        officialReportMethod: '',
        officialReportTime: undefined,
        officialReportLanguage: [{ language: undefined, amount: undefined }],
        summaryReport: false,
        draftReport: false,
        customerReview: false,
        officialReport: false,
      },
      ruleTerm: {
        languageLegalDoc: '',
        noContract: undefined,
        languageContract: [{ language: undefined, amount: undefined }],
      },
      licenseRequirement: {
        requiringLicenses:
          'Bản sao Giấy phép đầu tư và bất kỳ thông tin và giấy tờ pháp luật liên quan\nBản sao Giấy chứng nhận quyền sử dụng đất và sở hữu công trình xây dựng trên đất\nBản sao Giấy phép xây dựng\nBản sao sơ đồ mặt bằng vị trí\nCác thông tin và giấy tờ khác có liên quan đến dự án',
      },
    },
  });
  const [fileUpload, setfileUpload] = useState<File | null>(null);
  const { fields, replace } = useFieldArray({
    control,
    name: 'price.payDetail',
  });
  const {
    fields: fieldsSummary,
    append: appendSummary,
    replace: replaceSummary,
  } = useFieldArray({
    control,
    name: 'time.summaryReportLanguage',
  });
  const {
    fields: fieldsDraft,
    append: appendDraft,
    replace: replaceDraft,
  } = useFieldArray({
    control,
    name: 'time.draftReportLanguage',
  });
  const {
    fields: fieldsOfficial,
    append: appendOfficial,
    replace: replaceOfficial,
  } = useFieldArray({
    control,
    name: 'time.officialReportLanguage',
  });
  const { fields: fieldsRule, append: appendRule } = useFieldArray({
    control,
    name: 'ruleTerm.languageContract',
  });
  const isDisableSummary = !watch('time.summaryReport');
  const isDisableDraftReport = !watch('time.draftReport');
  const isDisableCustomerReview = !watch('time.customerReview');
  const isDisableOfficialReport = !watch('time.officialReport');
  const location = useLocation();
  const isLiquid = useMemo(() => {
    if (location.pathname.includes('/contracts/liquid/')) {
      return true;
    }
    return false;
  }, [location]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [customerAccount, setCustomerAccount] = useState(CustomerType.COMPANY);
  const breadCrumbList = useMemo(() => {
    return [
      {
        label: t(translations.contract.contract),
        path: path.settings,
        isGoback: true,
      },
      {
        label: t(translations.contract.createContract),
        path: path.createContract,
        isActive: true,
      },
    ];
  }, [t]);
  const dispatch = useDispatch();
  const { actions } = useSettingSlice();
  const { actions: customerActions } = useCustomerSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { contractDetail } = useSelector(selectSetting);
  const { customerManager } = useSelector(selectCustomer);
  const { enumList } = useSelector(selectAuth);
  const { isShowSidebar } = useSelector(layoutsSelector);
  const [isPopupSelectProperty, setIsPopupSelectProperty] = useState(false);
  const [indexPropertySelected, setIndexPropertySelected] = useState<
    number | null
  >(null);

  useEffect(() => {}, [actions, dispatch]);

  useEffect(() => {
    if (isEdit && contractDetail) {
      setValue('name', contractDetail?.name);
    }
  }, [isEdit, contractDetail, setValue, dispatch, customerActions]);

  useEffect(() => {
    if (!isEdit) {
      dispatch(customerActions.resetCustomerList());
      setValue('createdAt', moment(Date.now()).toDate().toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerAccount, customerActions, dispatch]);

  const header: TableHeaderProps[] = useMemo(() => {
    return [
      {
        id: 'stt',
        label: 'STT',
        align: 'left',
        width: 100,
      },
      {
        id: 'legalName',
        label: 'Hạng mục',
        align: 'left',
        width: 500,
      },
      {
        id: 'taxCode',
        label: 'Diện tích (m2)',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone',
        label: 'Diện tích CTXD (m2)',
        width: 200,
        align: 'left',
      },
      {
        id: 'type',
        label: 'Mục đích sử dụng đất',
        width: 200,
        align: 'left',
      },
      {
        id: 'userUuid',
        label: '',
        width: 100,
        align: 'center',
      },
    ];
  }, []);
  const contractType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.ContractType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const appraisalPurpose = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.AppraisalPurpose,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const sendFormType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.SendForm,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const langType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.Language,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const langTypeThirdOptions = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.LegalContractLanguage,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const handleCancel = () => navigate(-1);
  const customerType = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Doanh nghiệp',
        value: 'COMPANY',
        isDefault: true,
      },
      {
        id: 2,
        key: 'Cá nhân',
        value: 'PERSONAL',
      },
    ];
  }, []);

  const handleSelectCustomerCompany = (value: string) => {
    const data = customerManager?.data?.find(item => item.id === value) || null;
    clearErrors();
    setValue('customer', value);
    if (data) {
      setValue('partyB.address', data?.address);
    }
  };

  const handleSelectCustomerPersonal = (value: string) => {
    const data = customerManager?.data?.find(item => item.id === value) || null;
    clearErrors();
    setValue('customer', value);
    if (data) {
      setValue('partyB.name', data?.name);
      setValue('partyB.address', data?.address);
    }
  };

  const handleSearchCustomer = (value: string) => {
    setValue('partyB.name', value);
    if (customerAccount === CustomerType.COMPANY) {
      dispatch(
        customerActions.fetchListCustomer({
          limit: 100,
          page: 1,
          search: value,
        }),
      );
    } else {
      dispatch(
        customerActions.fetchListCustomer({
          limit: 100,
          page: 1,
          search: value,
        }),
      );
    }
  };

  const handleDeleted = () => {
    setValue('partyB.name', '');
    setValue('partyB.taxCode', '');
    setValue('partyB.address', '');
    setValue('partyB.representative', '');
    setValue('partyB.phone', '');
    setValue('partyB.position', '');
    setValue('partyB.cccd', '');
    setValue('partyB.license', '');
    setValue('partyB.fax', '');
    setValue('customer', '');
    dispatch(customerActions.resetCustomerList());
  };

  const renderFieldFollowCustomerType = useMemo(() => {
    if (customerAccount === CustomerType.COMPANY) {
      return (
        <Grid container mt={2}>
          <Grid container item sm={12} justifyContent={'space-between'}>
            <Grid xs={12} sm={5.9} position="relative">
              <SelectSearch
                placeholder="Nhập tên pháp lý doanh nghiệp"
                label="Tên pháp lý doanh nghiệp"
                isRequired
                control={control}
                errors={errors}
                name="partyB.name"
                options={customerManager?.data}
                handleSelected={handleSelectCustomerCompany}
                onChange={handleSearchCustomer}
                handleDeleted={handleDeleted}
                clearErrors={clearErrors}
                setError={setError}
                watch={watch}
              />
            </Grid>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập mã số thuế"
                label="Mã số thuế"
                isRequired
                control={control}
                name="partyB.taxCode"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container item sm={12} mt={2} justifyContent={'space-between'}>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ"
                label="Địa chỉ"
                isRequired
                control={control}
                name="partyB.address"
                errors={errors}
                disabled
              />
            </Grid>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập đại diện bởi"
                label="Đại diện bởi"
                isRequired
                control={control}
                name="partyB.representative"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container item sm={12} mt={2} justifyContent={'space-between'}>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                isRequired
                control={control}
                name="partyB.phone"
                errors={errors}
                disabled
              />
            </Grid>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập chức vụ"
                label="Chức vụ"
                control={control}
                name="partyB.position"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container item sm={12} mt={2} justifyContent={'space-between'}>
            <Grid xs={12} sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập số fax"
                label="Fax"
                control={control}
                name="partyB.fax"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      );
    }
    if (customerAccount === CustomerType.PERSONAL) {
      return (
        <Grid container mt={2}>
          <Grid container item sm={12} justifyContent={'space-between'}>
            <Grid sm={5.9} position="relative">
              <SelectSearch
                placeholder="Nhập họ và tên khách hàng"
                label="Họ và tên khách hàng"
                isRequired
                control={control}
                errors={errors}
                name="partyB.name"
                options={customerManager?.data}
                disabled={isLiquid}
                handleSelected={handleSelectCustomerPersonal}
                onChange={handleSearchCustomer}
                handleDeleted={handleDeleted}
                clearErrors={clearErrors}
                setError={setError}
                watch={watch}
              />
            </Grid>
            <Grid sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ"
                label="Địa chỉ"
                control={control}
                name="partyB.address"
                errors={errors}
                disabled
                type="textarea"
                rows={2}
              />
            </Grid>
          </Grid>
          <Grid container item sm={12} mt={2} justifyContent={'space-between'}>
            <Grid sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                isRequired
                control={control}
                name="partyB.phone"
                errors={errors}
                disabled
              />
            </Grid>
            <Grid sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập số CMND/CCCD"
                label="Số CMND/CCCD"
                isRequired
                control={control}
                name="partyB.cccd"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container item sm={12} mt={2} justifyContent={'space-between'}>
            <Grid sm={5.9}>
              <TextFieldCustom
                placeholder="Nhập số fax"
                label="Fax"
                control={control}
                name="partyB.fax"
                errors={errors}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerAccount, control, errors, customerManager, isLiquid]);

  const handleChangeFieldAccountType = (value: string | number) => {
    setCustomerAccount(get(CustomerType, value));
    handleDeleted();
  };

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      take: 100,
      orderBy: ['createdDate desc'],
    };
  }, []);

  const { filter } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage({ ...params });
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {};

  const paymentUnit = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.CurrencyUnit,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const paymentMethod = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.PaymentMethod,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const paymentStage = useMemo(() => {
    const options = [];
    for (let i = 0; i < 3; i++) {
      options.push({
        id: i + 1,
        key: `${i + 1} Đợt`,
        value: i + 1,
      });
    }
    return options;
  }, []);

  const handleSelectPayTimes = (value: string | number) => {
    const data = [];
    for (let i = 0; i < +value; i++) {
      data.push({
        percentage: null,
        description: '',
        payDate: '',
        payAmount: '',
      });
    }
    replace(data);
  };

  const handleOpenPopupSelectProperty = () => setIsPopupSelectProperty(true);
  const handleClosePopupSelectProperty = () => setIsPopupSelectProperty(false);

  const handleLiquidContract = () => {
    handleOpenDialog();
  };

  const increaseSummary = () => {
    appendSummary({ language: undefined, amount: undefined });
  };

  const increaseDraft = () => {
    appendDraft({ language: undefined, amount: undefined });
  };

  const increaseOfficial = () => {
    appendOfficial({ language: undefined, amount: undefined });
  };

  const increaseRuleTerm = () => {
    appendRule({ language: undefined, amount: undefined });
  };

  const handleSend = () => {
    const data = watch('liquidateContract');
    const payload = {
      id: id || '',
      ...data,
    };
    payload.liquidatingPrice.totalPrice = formatCurrency(
      payload.liquidatingPrice.totalPrice + '',
    );
  };

  const handleChangePercent = () => {
    if (fields.length === 2) {
      const payDetail = watch('price.payDetail');
      if (payDetail?.length) {
        for (let i = 0; i < payDetail?.length; i++) {
          if (payDetail[i].payAmount) {
            const numberTemp = Number(
              (payDetail[i].payAmount + '').replace('%', ''),
            );
            payDetail[i + 1].payAmount = 100 - numberTemp + '';
            break;
          } else {
            payDetail[i + 1].payAmount = '0';
            break;
          }
        }
        setValue('price.payDetail', payDetail);
      }
    }
    if (fields.length === 3) {
      const payDetail = watch('price.payDetail');
      if (payDetail?.length) {
        for (let i = 0; i < payDetail?.length; i++) {
          if (Number((payDetail[0].payAmount + '').replace('%', '')) === 100) {
            payDetail[1].payAmount = '0';
            payDetail[2].payAmount = '0';
            break;
          }
          if (Number((payDetail[1].payAmount + '').replace('%', '')) === 100) {
            payDetail[0].payAmount = '0';
            payDetail[2].payAmount = '0';
            break;
          }
          if (payDetail[i].payAmount && payDetail[i + 1].payAmount) {
            const numberTempPrev = Number(
              (payDetail[i].payAmount + '').replace('%', ''),
            );
            const numberTempNext = Number(
              (payDetail[i + 1].payAmount + '').replace('%', ''),
            );
            payDetail[i + 2].payAmount =
              100 - (numberTempPrev + numberTempNext) + '';
            break;
          } else {
            payDetail[i + 2].payAmount = '';
            break;
          }
        }
        setValue('price.payDetail', payDetail);
      }
    }
  };

  const renderPayDetail = () => {
    return fields?.map((pay, index) => (
      <Grid container mt={2} key={pay.id}>
        <Grid container item sm={12} justifyContent={'space-between'}>
          <Grid container sm={5.9} justifyContent={'space-between'}>
            <Grid item sm={3}>
              <TextFieldCustom
                label={`Đợt ${index + 1}`}
                control={control}
                name={`price.payDetail[${index}].payAmount`}
                errors={errors}
                isRequired
                placeholder="Nhập"
                disabled={index + 1 === fields.length}
                onBlur={handleChangePercent}
                type="percent"
                setError={setError}
                max={100}
              />
            </Grid>
            <Grid item sm={8.6}>
              <TextFieldCustom
                label="Thời điểm thanh toán"
                control={control}
                name={`price.payDetail[${index}].description`}
                errors={errors}
                isRequired
                placeholder="Nhập"
              />
            </Grid>
          </Grid>
          <Grid sm={5.9}>
            <TextFieldCustom
              label="Ngày thanh toán"
              control={control}
              name={`price.payDetail[${index}].payDate`}
              errors={errors}
              setError={setError}
              type="date"
              isRequired
              isHiddenPastDay
            />
          </Grid>
        </Grid>
      </Grid>
    ));
  };

  const renderSummary = () => {
    return fieldsSummary?.map((summary, _index) => (
      <Grid
        item
        container
        justifyContent={'space-between'}
        mb="5px"
        key={summary.id}
      >
        <Grid item xs={12} sm={7}>
          <TextFieldCustom
            label="Ngôn ngữ văn bản"
            control={control}
            name={`time.summaryReportLanguage[${_index}].language`}
            errors={errors}
            type="select"
            options={langType}
            placeholder="Chọn ngôn ngữ văn bản"
            disabled={isDisableSummary}
          />
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <TextFieldCustom
            label="Số lượng văn bản"
            placeholder="0"
            control={control}
            name={`time.summaryReportLanguage[${_index}].amount`}
            errors={errors}
            disabled={isDisableSummary}
          />
        </Grid>
      </Grid>
    ));
  };

  const renderDraft = () => {
    return fieldsDraft?.map((draft, _index) => (
      <Grid
        item
        container
        justifyContent={'space-between'}
        mb="5px"
        key={draft.id}
      >
        <Grid item xs={12} sm={7}>
          <TextFieldCustom
            label="Ngôn ngữ văn bản"
            control={control}
            name={`time.draftReportLanguage[${_index}].language`}
            errors={errors}
            type="select"
            options={langType}
            placeholder="Chọn ngôn ngữ văn bản"
            disabled={isDisableDraftReport}
          />
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <TextFieldCustom
            label="Số lượng văn bản"
            placeholder="0"
            control={control}
            name={`time.draftReportLanguage[${_index}].amount`}
            errors={errors}
            disabled={isDisableDraftReport}
          />
        </Grid>
      </Grid>
    ));
  };

  const renderOffical = () => {
    return fieldsOfficial?.map((official, _index) => (
      <Grid
        item
        container
        justifyContent={'space-between'}
        mb="5px"
        key={official.id}
      >
        <Grid item xs={12} sm={7}>
          <TextFieldCustom
            label="Ngôn ngữ văn bản"
            control={control}
            name={`time.officialReportLanguage[${_index}].language`}
            errors={errors}
            type="select"
            options={langType}
            placeholder="Chọn ngôn ngữ văn bản"
            disabled={isDisableOfficialReport}
          />
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <TextFieldCustom
            label="Số lượng văn bản"
            placeholder="0"
            control={control}
            name={`time.officialReportLanguage[${_index}].amount`}
            errors={errors}
            disabled={isDisableOfficialReport}
          />
        </Grid>
      </Grid>
    ));
  };

  const handleDownloadTemplateContract = () => {
    const alink = document.createElement('a');
    alink.href = getLinkDownloadTemplateContract();
    alink.click();
  };

  const handleBlur = (value: string | number) => {
    if (value) {
      const newValue = (value + '').replaceAll('.', '');
      setValue(
        'price.totalPriceText',
        readMoney(newValue, watch('price.priceUnit') === 'VND'),
      );
    } else {
      setValue('price.totalPriceText', '');
    }
  };

  const handleBlurLiquidating = (value: string | number) => {
    if (value) {
      const newValue = (value + '').replaceAll('.', '');
      setValue(
        'liquidateContract.liquidatingPrice.totalPriceText',
        readMoney(
          newValue,
          watch('liquidateContract.liquidatingPrice.priceUnit') === 'VND',
        ),
      );
    } else {
      setValue('liquidateContract.liquidatingPrice.totalPriceText', '');
    }
  };

  const handleSelectedUnitPrice = (value: string | number) => {
    const totalPrice = watch('price.totalPrice')
      ?.toString()
      ?.replaceAll('.', '');
    if (value) {
      setValue('price.totalPriceText', readMoney(totalPrice, value === 'VND'));
    } else {
      setValue('price.totalPriceText', '');
    }
  };

  const handleSelectedUnitPriceLiquidate = (value: string | number) => {
    const totalPrice = watch('liquidateContract.liquidatingPrice.totalPrice')
      ?.toString()
      ?.replaceAll('.', '');
    if (value) {
      setValue(
        'liquidateContract.liquidatingPrice.totalPriceText',
        readMoney(
          totalPrice,
          watch('liquidateContract.liquidatingPrice.priceUnit') === 'VND',
        ),
      );
    } else {
      setValue('liquidateContract.liquidatingPrice.totalPriceText', '');
    }
  };

  const renderRule = () => {
    return fieldsRule?.map((rule, _index) => (
      <Grid
        item
        container
        justifyContent={'space-between'}
        mb="5px"
        key={rule.id}
      >
        <Grid item xs={12} sm={7}>
          <TextFieldCustom
            label="Ngôn ngữ văn bản"
            control={control}
            name={`ruleTerm.languageContract[${_index}].language`}
            errors={errors}
            type="select"
            options={langType}
            placeholder="Chọn ngôn ngữ văn bản"
          />
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <TextFieldCustom
            label="Số lượng văn bản"
            placeholder="0"
            control={control}
            name={`ruleTerm.languageContract[${_index}].amount`}
            errors={errors}
          />
        </Grid>
      </Grid>
    ));
  };

  const handleUploadExcel = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.click();
    fileSelector.addEventListener('change', async (event: any) => {
      if (event.target.files?.length) {
        const file = event.target.files[0];
        setfileUpload(file);
        const imageId = await documentService.uploadAvatar(file);
        setValue('appendix', imageId[0]);
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Tải tệp lên thành công',
            type: 'success',
          }),
        );
      }
    });
  };

  const previewContract = () => {
    if (isLiquid) {
      const data = watch('liquidateContract');
      const payload = {
        id: id || '',
        ...data,
      };
      payload.price.totalPrice = formatCurrency(
        payload?.price?.totalPrice + '',
      );
    } else {
      const data = watch();
      data.price.totalPrice = formatCurrency(data?.price?.totalPrice + '');
    }
  };

  const closePreviewDialog = () => {
    setHtmlData('');
  };
  return <></>;
}
