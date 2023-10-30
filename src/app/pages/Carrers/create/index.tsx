/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Grid,
  styled,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import BreadCrumb from 'app/components/BreadCrumb';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EnumObject, FilterParams } from 'types';
import { TitleEnum, Status, TenureType } from 'types/Enum';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import documentService from 'services/api/document';
import { LicenseFile, RealEstateItem } from 'types/RealEstate';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import ConfirmDialog from 'app/components/ConfirmDialog';

import { Option } from 'types/Option';

import { returnFileType } from 'utils/helpers';

import { useSettingSlice } from '../../Settings/slice';
import { useRealEstateSlice } from '../slice';
import { selectSetting } from '../../Settings/slice/selector';
import { selectRealEstate } from '../slice/selectors';

import { PayloadCreateRealEstate } from '../slice/types';

const LayoutBox = styled(Box)<{ mt?: number | string }>`
  margin-top: ${props => `${(props?.mt && props?.mt) || '21px'}`};
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.08);
`;

interface Province {
  id: number;
  key: string;
  value: string;
}

interface Props {
  isEdit?: boolean;
}
interface StateLocationProps {
  appraisalId?: string;
  contractId?: string;
}

export default function CreateRealEstate(props: Props) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions } = useSettingSlice();
  const { actions: realEstateActions } = useRealEstateSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { realEstateDetail } = useSelector(selectRealEstate);
  const [isExpand, setIsExpand] = React.useState<boolean>(false);
  const [province, setProvince] = React.useState<string>('');
  const { enumList } = useSelector(selectAuth);
  const { listPropertyType } = useSelector(selectSetting);
  const {
    listPropertyViewsType,
    listPropertyFactorsType,
    listRealEstateProject,
    listRealEstateFrontageAdvantage,
  } = useSelector(selectRealEstate);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { state } = useLocation();
  const getAppraisalInfo = state as StateLocationProps;

  const TitleSection = styled(Typography)({
    fontSize: '16px',
    fontWeight: 600,
    color: theme.palette.primary.lighter,
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PayloadCreateRealEstate>({
    mode: 'onSubmit',
    defaultValues: {
      totalPrice: '',
      totalPriceUSD: '',
      priceUSDPerLA: '',
      priceUSDPerGFA: '',
      generalInfo: {
        dataSrc: '',
        transactionTime: '',
        evidenceFlag: null,
        propertyCode: null,
        projectId: null,
      },
      positionInfo: {
        // location: '',
      },
      statusInfo: {
        shape: null,
        area: '',
        gfa: '',
        factors: [],
        views: [],
        frontageAdvantage: null,
        status: null,
      },
      legalStatus: {
        constructionPermit: false,
        masterPlan1_500: false,
        masterPlan1_2000: false,
        inPrincipleApproval: false,
        llc_lgd: false,
        dc_ccc: false,
        spa: false,
        lurc: false,
        licenseFiles: [],
      },
      additionalStatus: {
        units: null,
        netLandArea: null,
        curLandStatus: '',
        curLandStatus_RLR: null,
        curLandStatus_RHR: null,
        curLandStatus_Comercial: null,
        curLandStatus_Hospitality: null,
        curLandStatus_Industrial: null,
        curLandStatus_Agricultural: null,
        launchYear: null,
        renovateYear: null,
        completionYear: '',
        noBlock: null,
        noFloor: null,
        occupancy: null,
      },
      estimatePrice: {
        lufs: null,
        capitalizationRate: null,
        seller: '',
        buyer: '',
        ppSquareOnNLA: null,
        irr: null,
        mgr: null,
        adr: null,
        marketYield: null,
        ppr: null,
        bank: '',
        bankInstrContactPerson: '',
        bankInstrPhone: '',
        bankInstrEmail: '',
        borrowerName: '',
        borrowerMail: '',
        borrowerPhone: '',
        instrDateTime: '',
      },
    },
  });

  useEffect(() => {
    if (isEdit && realEstateDetail) {
      getDistrics();
      getCommunes();
      setValue(
        'generalInfo.dataSrc',
        realEstateDetail?.realEstate?.generalInfo?.dataSrc,
      );
      setValue(
        'generalInfo.dataType',
        realEstateDetail?.realEstate?.generalInfo?.dataType,
      );
      setValue(
        'generalInfo.transactionType',
        realEstateDetail?.realEstate?.generalInfo?.transactionType,
      );
      setValue(
        'generalInfo.transactionTime',
        realEstateDetail?.realEstate?.generalInfo?.transactionTime,
      );
      setValue(
        'generalInfo.propertyCode',
        realEstateDetail?.realEstate?.generalInfo?.propertyCode,
      );
      setValue(
        'generalInfo.projectId',
        realEstateDetail?.realEstate?.generalInfo?.realEstateProject?.id,
      );
      setValue(
        'generalInfo.evidenceFlag',
        realEstateDetail?.realEstate?.generalInfo?.evidenceFlag,
      );
      setValue(
        'positionInfo.latitude',
        realEstateDetail?.realEstate?.positionInfo?.latitude,
      );
      setValue(
        'positionInfo.longitude',
        realEstateDetail?.realEstate?.positionInfo?.longitude,
      );
      setValue(
        'positionInfo.location',
        realEstateDetail?.realEstate?.positionInfo?.location,
      );
      setValue(
        'positionInfo.province',
        realEstateDetail?.realEstate?.positionInfo?.province,
      );
      setValue(
        'positionInfo.district',
        realEstateDetail?.realEstate?.positionInfo?.district,
      );
      setValue(
        'positionInfo.ward',
        realEstateDetail?.realEstate?.positionInfo?.ward,
      );
      setValue(
        'positionInfo.street',
        realEstateDetail?.realEstate?.positionInfo?.street,
      );
      setValue(
        'positionInfo.apartmentNumber',
        realEstateDetail?.realEstate?.positionInfo?.apartmentNumber,
      );
      setValue('sector', realEstateDetail?.realEstate?.sector?.id);
      setValue(
        'statusInfo.status',
        realEstateDetail?.realEstate?.statusInfo?.status,
      );
      setValue(
        'statusInfo.area',
        realEstateDetail?.realEstate?.statusInfo?.area,
      );
      setValue(
        'statusInfo.length',
        realEstateDetail?.realEstate?.statusInfo?.length,
      );
      setValue(
        'statusInfo.width',
        realEstateDetail?.realEstate?.statusInfo?.width,
      );
      setValue(
        'statusInfo.currentArea',
        realEstateDetail?.realEstate?.statusInfo?.currentArea,
      );
      setValue('statusInfo.gfa', realEstateDetail?.realEstate?.statusInfo?.gfa);
      setValue(
        'statusInfo.plotRatio',
        realEstateDetail?.realEstate?.statusInfo?.plotRatio,
      );
      setValue(
        'statusInfo.tenure',
        realEstateDetail?.realEstate?.statusInfo?.tenure,
      );
      setValue(
        'statusInfo.shape',
        realEstateDetail?.realEstate?.statusInfo?.shape,
      );
      setValue(
        'statusInfo.frontageAdvantage',
        realEstateDetail?.realEstate?.statusInfo?.frontageAdvantage?.id,
      );
      setValue(
        'statusInfo.views',
        realEstateDetail?.realEstate?.statusInfo?.realEstateViews?.map(
          v => v.view.id,
        ),
      );
      setValue(
        'statusInfo.factors',
        realEstateDetail?.realEstate?.statusInfo?.realEstateFactors?.map(
          f => f.factor.id,
        ),
      );
      setValue(
        'statusInfo.description',
        realEstateDetail?.realEstate?.statusInfo?.description,
      );
      setValue(
        'legalStatus.constructionPermit',
        realEstateDetail?.realEstate?.legalStatus?.constructionPermit,
      );
      setValue(
        'legalStatus.masterPlan1_500',
        realEstateDetail?.realEstate?.legalStatus?.masterPlan1_500,
      );
      setValue(
        'legalStatus.masterPlan1_2000',
        realEstateDetail?.realEstate?.legalStatus?.masterPlan1_2000,
      );
      setValue(
        'legalStatus.inPrincipleApproval',
        realEstateDetail?.realEstate?.legalStatus?.inPrincipleApproval,
      );
      setValue(
        'legalStatus.llc_lgd',
        realEstateDetail?.realEstate?.legalStatus?.llc_lgd,
      );
      setValue(
        'legalStatus.dc_ccc',
        realEstateDetail?.realEstate?.legalStatus?.dc_ccc,
      );
      setValue(
        'legalStatus.spa',
        realEstateDetail?.realEstate?.legalStatus?.spa,
      );
      setValue(
        'legalStatus.lurc',
        realEstateDetail?.realEstate?.legalStatus?.lurc,
      );
      setValue('totalPrice', realEstateDetail?.realEstate?.totalPrice);
      setValue('totalPriceUSD', realEstateDetail?.realEstate?.totalPriceUSD);
      setValue('fx', realEstateDetail?.realEstate?.fx);
      setValue(
        'additionalStatus.units',
        realEstateDetail?.realEstate?.additionalStatus?.units,
      );
      setValue(
        'additionalStatus.netLandArea',
        realEstateDetail?.realEstate?.additionalStatus?.netLandArea,
      );
      setValue(
        'additionalStatus.curLandStatus',
        realEstateDetail?.realEstate?.additionalStatus?.curLandStatus,
      );
      setValue(
        'additionalStatus.curLandStatus_RLR',
        realEstateDetail?.realEstate?.additionalStatus?.curLandStatus_RLR,
      );
      setValue(
        'additionalStatus.curLandStatus_RHR',
        realEstateDetail?.realEstate?.additionalStatus?.curLandStatus_RHR,
      );
      setValue(
        'additionalStatus.curLandStatus_Comercial',
        realEstateDetail?.realEstate?.additionalStatus?.curLandStatus_Comercial,
      );
      setValue(
        'additionalStatus.curLandStatus_Hospitality',
        realEstateDetail?.realEstate?.additionalStatus
          ?.curLandStatus_Hospitality,
      );
      setValue(
        'additionalStatus.curLandStatus_Industrial',
        realEstateDetail?.realEstate?.additionalStatus
          ?.curLandStatus_Industrial,
      );
      setValue(
        'additionalStatus.curLandStatus_Industrial',
        realEstateDetail?.realEstate?.additionalStatus
          ?.curLandStatus_Industrial,
      );
      setValue(
        'additionalStatus.curLandStatus_Agricultural',
        realEstateDetail?.realEstate?.additionalStatus
          ?.curLandStatus_Agricultural,
      );
      setValue(
        'additionalStatus.launchYear',
        realEstateDetail?.realEstate?.additionalStatus?.launchYear,
      );
      setValue(
        'additionalStatus.renovateYear',
        realEstateDetail?.realEstate?.additionalStatus?.renovateYear,
      );
      setValue(
        'additionalStatus.completionYear',
        realEstateDetail?.realEstate?.additionalStatus?.completionYear?.toString(),
      );
      setValue(
        'additionalStatus.noBlock',
        realEstateDetail?.realEstate?.additionalStatus?.noBlock,
      );
      setValue(
        'additionalStatus.noFloor',
        realEstateDetail?.realEstate?.additionalStatus?.noFloor,
      );
      setValue(
        'additionalStatus.occupancy',
        realEstateDetail?.realEstate?.additionalStatus?.occupancy,
      );
      setValue(
        'estimatePrice.lufs',
        realEstateDetail?.realEstate?.estimatePrice?.lufs,
      );
      setValue(
        'estimatePrice.capitalizationRate',
        realEstateDetail?.realEstate?.estimatePrice?.capitalizationRate,
      );
      setValue(
        'estimatePrice.seller',
        realEstateDetail?.realEstate?.estimatePrice?.seller,
      );
      setValue(
        'estimatePrice.buyer',
        realEstateDetail?.realEstate?.estimatePrice?.buyer,
      );
      setValue(
        'estimatePrice.ppSquareOnNLA',
        realEstateDetail?.realEstate?.estimatePrice?.ppSquareOnNLA,
      );
      setValue(
        'estimatePrice.irr',
        realEstateDetail?.realEstate?.estimatePrice?.irr,
      );
      setValue(
        'estimatePrice.mgr',
        realEstateDetail?.realEstate?.estimatePrice?.mgr,
      );
      setValue(
        'estimatePrice.adr',
        realEstateDetail?.realEstate?.estimatePrice?.adr,
      );
      setValue(
        'estimatePrice.marketYield',
        realEstateDetail?.realEstate?.estimatePrice?.marketYield,
      );
      setValue(
        'estimatePrice.ppr',
        realEstateDetail?.realEstate?.estimatePrice?.ppr,
      );
      setValue(
        'estimatePrice.bank',
        realEstateDetail?.realEstate?.estimatePrice?.bank,
      );
      setValue(
        'estimatePrice.bankInstrContactPerson',
        realEstateDetail?.realEstate?.estimatePrice?.bankInstrContactPerson,
      );
      setValue(
        'estimatePrice.bankInstrPhone',
        realEstateDetail?.realEstate?.estimatePrice?.bankInstrPhone,
      );
      setValue(
        'estimatePrice.bankInstrEmail',
        realEstateDetail?.realEstate?.estimatePrice?.bankInstrEmail,
      );
      setValue(
        'estimatePrice.borrowerName',
        realEstateDetail?.realEstate?.estimatePrice?.borrowerName,
      );
      setValue(
        'estimatePrice.borrowerMail',
        realEstateDetail?.realEstate?.estimatePrice?.borrowerMail,
      );
      setValue(
        'estimatePrice.borrowerPhone',
        realEstateDetail?.realEstate?.estimatePrice?.borrowerPhone,
      );
      setValue(
        'estimatePrice.instrDate',
        realEstateDetail?.realEstate?.estimatePrice?.instrDateTime,
      );
      setValue(
        'estimatePrice.instrTime',
        realEstateDetail?.realEstate?.estimatePrice?.instrDateTime,
      );
      setValue(
        'tenureType',
        realEstateDetail?.realEstate?.statusInfo?.tenure
          ? TenureType.TERM
          : TenureType.LASTING,
      );
      realEstateDetail?.realEstate?.statusInfo?.tenure
        ? setIsTerm(false)
        : setIsTerm(true);
    }
  }, [isEdit, realEstateDetail, setValue, dispatch, realEstateActions]);

  const breadCrumbList = useMemo(() => {
    return [
      {
        label: 'QL tài sản',
        path: path.carrers,
        isGoback: true,
      },
      {
        label: 'Bất động sản',
        path: path.carrers,
        isGoback: true,
      },
      {
        label: 'Tạo BĐS',
        path: path.createCarrers,
        isActive: true,
      },
    ];
  }, []);

  const dataSourceType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.DataSourceType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const transactionType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.TransactionType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const evidenceFlagType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.EvidenceFlag,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const statusType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.RealEsateActualStatus,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const shapeType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.RealEstateShape,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const tenureType = useMemo(() => {
    const options = enumList?.find(
      (item: EnumObject) => item.title === TitleEnum.TenureType,
    )?.ctlotusEnumValues;
    if (options) {
      return options;
    }
    return [];
  }, [enumList]);

  const yearOptions: Option[] = useMemo(() => {
    const year = new Date().getFullYear();
    const a: Option[] = [];
    for (let i = 1900; i <= year; i++) {
      a.push({
        id: i,
        key: i.toString(),
        value: i,
      });
    }
    return a;
  }, []);

  const [isTerm, setIsTerm] = useState<boolean>(true);
  const [listProvince, setListProvince] = useState<Province[]>([]);
  const [listDistrict, setListDistrict] = useState<Province[]>([]);
  const [listCommune, setListCommune] = useState<Province[]>([]);
  const { isShowSidebar } = useSelector(layoutsSelector);
  const [paramsFilter, setParamsFilter] = useState<FilterParams>({
    key: 'province',
    province: '0',
    district: '0',
  });
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [realEstateId, setRealEstateId] = useState<string | number>('');
  const [filesAttachment, setFilesAttachment] = useState<File[]>([]);
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
      province: realEstateDetail?.realEstate?.positionInfo?.province,
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
      province: realEstateDetail?.realEstate?.positionInfo?.province,
      district: realEstateDetail?.realEstate?.positionInfo?.district,
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

  useEffect(() => {
    dispatch(actions.fetchListPropertyType());
    dispatch(realEstateActions.fetchListViewsType());
    dispatch(realEstateActions.fetchListFactorsType());
    dispatch(realEstateActions.fetchListRealEstateProject());
    dispatch(realEstateActions.fetchListRealEstateFrontageAdvantage());
    getProvinces();
  }, [actions, dispatch, realEstateActions]);

  useEffect(() => {
    if (id) {
      setRealEstateId(id);
    }
  }, [actions, dispatch, id]);

  useEffect(() => {
    if (
      watch('totalPrice') &&
      watch('statusInfo.area') &&
      watch('statusInfo.gfa')
    ) {
      setValue(
        'priceUSDPerLA',
        Math.round(+watch('totalPrice') / +watch('statusInfo.area')),
      );
      setValue(
        'priceUSDPerGFA',
        Math.round(+watch('totalPrice') / +watch('statusInfo.gfa')),
      );
    } else {
      setValue('priceUSDPerLA', 0);
      setValue('priceUSDPerGFA', 0);
    }
  }, [
    watch('totalPrice'),
    watch('statusInfo.area'),
    watch('statusInfo.gfa'),
    setValue,
    watch,
  ]);

  useEffect(() => {
    if (watch('fx') && watch('totalPrice')) {
      setValue(
        'totalPriceUSD',
        Math.round(+watch('totalPrice') / +watch('fx')),
      );
    } else {
      setValue('totalPriceUSD', 0);
    }
  }, [watch('totalPrice'), watch('fx'), setValue, watch]);

  const handleChange = (value: any) => {
    value === TenureType.TERM ? setIsTerm(false) : setIsTerm(true);
    if (value === TenureType.LASTING) {
      setValue('statusInfo.tenure', null);
    }
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleSubmitDialog = () => {
    const payload = {
      id: realEstateId,
      status:
        realEstateDetail?.status === Status.ACTIVE
          ? Status.INACTIVE
          : Status.ACTIVE,
    };
    dispatch(
      realEstateActions.updateStatusRealEstate(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                realEstateDetail?.status === Status.ACTIVE
                  ? t(translations.realEstate.lockRealEstate)
                  : t(translations.realEstate.unlockRealEstate),
              type: 'success',
            }),
          );
          dispatch(realEstateActions.getDetailRealEstate({ id }));
          handleCloseDialog();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: t(translations.common.errorOccurred),
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleRemoveFileImport = (fileIndex: number) => {
    setFilesAttachment(
      filesAttachment?.filter((item, _index) => _index !== fileIndex),
    );
  };

  const handleUploadMultipleFiles = async () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', '');
    fileSelector.setAttribute(
      'accept',
      '.xlsx,.xls,.doc, .docx,.pdf,.png,.jpg',
    );
    fileSelector.click();
    fileSelector.addEventListener('change', async (event: any) => {
      if (event.target.files?.length) {
        if (
          (event.target.files?.length || 0) +
            (filesAttachment?.length || 0) +
            (realEstateDetail?.realEstate?.legalStatus?.licenses?.length || 0) >
          5
        ) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Không được tải lên quá 5 tệp',
              type: 'error',
            }),
          );
          return;
        }
        const newFiles = filesAttachment.concat(Array.from(event.target.files));
        setFilesAttachment(newFiles);
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Tải lên thành công',
            type: 'success',
          }),
        );
      }
    });
  };

  const onSubmit = async (data: PayloadCreateRealEstate) => {
    setIsLoadingSubmit(true);
    data.fx = +data.fx;
    data.sector = +data.sector;
    data.generalInfo.projectId = data.generalInfo.projectId
      ? +data.generalInfo?.projectId
      : null;
    data.statusInfo.area = +data.statusInfo.area;
    data.statusInfo.gfa = +data.statusInfo.gfa;
    data.statusInfo.tenure = data?.statusInfo?.tenure
      ? +data?.statusInfo?.tenure
      : undefined;
    data.statusInfo.frontageAdvantage = data.statusInfo.frontageAdvantage
      ? +data.statusInfo?.frontageAdvantage
      : null;
    const fileIds =
      (await documentService.uploadFile(Array.from(filesAttachment))) || [];
    data.legalStatus.licenseFiles = fileIds;
    const date = new Date(data.estimatePrice.instrDate);
    const time = new Date(data.estimatePrice.instrTime);
    data.estimatePrice.instrDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    ).toString();
    const completionYear = new Date(
      data.additionalStatus.completionYear,
    ).getFullYear();
    data.additionalStatus.completionYear = completionYear;
    if (data.statusInfo.currentArea === '') {
      data.statusInfo.currentArea = null;
    }
    if (data.statusInfo.width === '') {
      data.statusInfo.width = null;
    }
    if (data.statusInfo.length === '') {
      data.statusInfo.length = null;
    }
    if (data.statusInfo.plotRatio === '') {
      data.statusInfo.plotRatio = null;
    }
    if (data.additionalStatus.units === '') {
      data.additionalStatus.units = null;
    }
    if (data.additionalStatus.netLandArea === '') {
      data.additionalStatus.netLandArea = null;
    }
    if (data.additionalStatus.curLandStatus_RLR === '') {
      data.additionalStatus.curLandStatus_RLR = null;
    }
    if (data.additionalStatus.curLandStatus_RHR === '') {
      data.additionalStatus.curLandStatus_RHR = null;
    }
    if (data.additionalStatus.curLandStatus_Comercial === '') {
      data.additionalStatus.curLandStatus_Comercial = null;
    }
    if (data.additionalStatus.curLandStatus_Hospitality === '') {
      data.additionalStatus.curLandStatus_Hospitality = null;
    }
    if (data.additionalStatus.curLandStatus_Industrial === '') {
      data.additionalStatus.curLandStatus_Industrial = null;
    }
    if (data.additionalStatus.curLandStatus_Agricultural === '') {
      data.additionalStatus.curLandStatus_Agricultural = null;
    }
    if (data.additionalStatus.noBlock === '') {
      data.additionalStatus.noBlock = null;
    }
    if (data.additionalStatus.noFloor === '') {
      data.additionalStatus.noFloor = null;
    }
    if (data.additionalStatus.occupancy === '') {
      data.additionalStatus.occupancy = null;
    }
    if (data.estimatePrice.lufs === '') {
      data.estimatePrice.lufs = null;
    }
    if (data.estimatePrice.capitalizationRate === '') {
      data.estimatePrice.capitalizationRate = null;
    }
    if (data.estimatePrice.ppSquareOnNLA === '') {
      data.estimatePrice.ppSquareOnNLA = null;
    }
    if (data.estimatePrice.irr === '') {
      data.estimatePrice.irr = null;
    }
    if (data.estimatePrice.mgr === '') {
      data.estimatePrice.mgr = null;
    }
    if (data.estimatePrice.adr === '') {
      data.estimatePrice.adr = null;
    }
    if (data.estimatePrice.marketYield === '') {
      data.estimatePrice.marketYield = null;
    }
    if (data.estimatePrice.ppr === '') {
      data.estimatePrice.ppr = null;
    }
    if (isEdit) {
      const arrayIds: number[] =
        realEstateDetail?.realEstate?.legalStatus?.licenses?.map(
          item => item?.file?.id,
        ) || [];
      const requestPayload = {
        ...data,
        id,
      };
      requestPayload.legalStatus.licenseFiles = arrayIds.concat(fileIds);
      dispatch(
        realEstateActions.updateDataRealEstate(requestPayload, (err?: any) => {
          if (err?.success) {
            setIsLoadingSubmit(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Cập nhật thành công',
                type: 'success',
              }),
            );
            navigate(path.carrers);
          } else {
            setIsLoadingSubmit(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: err?.response?.data?.message || 'Tạo không thành công',
                type: 'error',
              }),
            );
            if (err.response?.data?.message === 'Cập nhật tài sản thất bại') {
              setError('generalInfo.propertyCode', {
                type: 'error',
                message: `${err.response?.data?.errors[0]?.message}`,
              });
            }
          }
        }),
      );
    } else {
      if (getAppraisalInfo?.appraisalId) {
        data.appraisalId = getAppraisalInfo?.appraisalId;
      }
      dispatch(
        realEstateActions.createRealEstate(data, (err?: any) => {
          if (err?.success) {
            setIsLoadingSubmit(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tạo thành công',
                type: 'success',
              }),
            );
            if (getAppraisalInfo?.appraisalId && getAppraisalInfo?.contractId) {
              navigate(
                `/valuations/list-detail/${getAppraisalInfo?.contractId}/working-valuation/${getAppraisalInfo?.appraisalId}`,
                {
                  state: {
                    stepActive: 0,
                  },
                },
              );
            } else {
              navigate(path.carrers);
            }
          } else {
            setIsLoadingSubmit(false);
            dispatch(
              snackbarActions.updateSnackbar({
                message: err?.response?.data?.message || 'Tạo không thành công',
                type: 'error',
              }),
            );
            if (err.response?.data?.message === 'Tạo tài sản thất bại') {
              setError('generalInfo.propertyCode', {
                type: 'error',
                message: `${err.response?.data?.errors[0]?.propertyCode}`,
              });
            }
          }
        }),
      );
    }
  };

  const onError: SubmitErrorHandler<PayloadCreateRealEstate> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: t(translations.common.errorMessage),
          type: 'error',
        }),
      );
    }
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
      province:
        province || realEstateDetail?.realEstate?.positionInfo?.province,
      key: 'commune',
      district: value as string,
    };

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

  const constructionPermit = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Giấy phép xây dựng (Construction permit)',
        value: '1',
      },
    ];
  }, []);

  const masterPlan1_500 = useMemo(() => {
    return [
      {
        id: 2,
        key: 'Quy hoạch chi tiết 1/500 (Master plan 1/500 approval)',
        value: '2',
      },
    ];
  }, []);

  const masterPlan1_2000 = useMemo(() => {
    return [
      {
        id: 3,
        key: 'Quy hoạch phân khu 1/2000 (Master plan 1/2000 approval)',
        value: '3',
      },
    ];
  }, []);

  const inPrincipleApproval = useMemo(() => {
    return [
      {
        id: 4,
        key: 'Chấp thuận chủ trương đầu tư (In-principal approval)',
        value: '4',
      },
    ];
  }, []);

  const llc_lgd = useMemo(() => {
    return [
      {
        id: 5,
        key: 'HĐ thuê đất, QĐ giao đất (Land lease contract/Land grant decision)',
        value: '5',
      },
    ];
  }, []);

  const dc_ccc = useMemo(() => {
    return [
      {
        id: 6,
        key: 'HĐ đặt cọc/HĐ góp vốn (Deposit contract/Capital contribution contract)',
        value: '6',
      },
    ];
  }, []);

  const spa = useMemo(() => {
    return [
      {
        id: 7,
        key: 'HĐMB (Sales purchase agreement)',
        value: '7',
      },
    ];
  }, []);

  const lurc = useMemo(() => {
    return [
      {
        id: 8,
        key: 'Giấy CN quyền SDĐ (Land use right certificate)',
        value: '8',
      },
    ];
  }, []);

  const removeFileEdit = (fileId: number) => {
    const licenseFiles: LicenseFile[] | undefined =
      realEstateDetail?.realEstate?.legalStatus?.licenses?.filter(
        x => x.file.id !== fileId,
      );
    const realEstateNew: RealEstateItem | undefined | null = JSON.parse(
      JSON.stringify(realEstateDetail),
    );
    if (realEstateNew?.realEstate?.legalStatus?.licenses) {
      realEstateNew.realEstate.legalStatus.licenses = licenseFiles;
    }
    dispatch(realEstateActions.removeFileAttachment(realEstateNew));
  };

  const handlePreviewFile = (file: any) => {
    const objectURL = URL.createObjectURL(file);
    const newWindow = window.open(objectURL, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const handleCancel = () => navigate(path.carrers);
  return (
    <>
      <Box pb={'43px'}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Box
            mt={3}
            display={'flex'}
            justifyContent="space-between"
            position="fixed"
            right="24px"
            bgcolor={theme.palette.grey[300]}
            width="100%"
            zIndex={3}
            p="16px 0px"
            top="55px"
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'none' },
              marginTop: { xs: '0px', sm: '24px' },
              right: { xs: '0px' },
              top: { xs: '55px', sm: '40px', lg: '55px' },
            }}
          >
            <Box
              sx={{
                marginLeft: {
                  xs: '10px',
                  sm: '15px',
                  lg: !isShowSidebar ? '90px' : '295px',
                  xl: !isShowSidebar ? '105px' : '295px',
                },
                marginBottom: { xs: '15px', sm: '0px' },
              }}
            >
              <BreadCrumb list={breadCrumbList} />
            </Box>
            <Box
              sx={{
                marginLeft: { xs: '12px', sm: '0px' },
                marginRight: { xs: '0px', sm: '24px' },
                marginTop: { xs: '0px', sm: '24px' },
                marginBottom: { xs: '0px', sm: '12px' },
              }}
            >
              <CustomButton
                title={t(translations.common.cancel)}
                sxProps={{
                  border: `1px solid ${theme.palette.primary.lighter}`,
                  color: theme.palette.primary.light,
                  mr: 3,
                }}
                variant="outlined"
                handleClick={handleCancel}
              />
              {isEdit && (
                <CustomButton
                  title={
                    realEstateDetail?.status === Status.ACTIVE
                      ? t(translations.common.lock)
                      : t(translations.common.unlock)
                  }
                  sxProps={{
                    border: `1px solid ${theme.palette.primary.lighter}`,
                    color: theme.palette.primary.light,
                    mr: 3,
                  }}
                  variant="outlined"
                  buttonMode="lock"
                  isIcon
                  handleClick={handleOpenDialog}
                />
              )}

              <CustomButton
                title={
                  isEdit
                    ? t(translations.common.save)
                    : t(translations.common.create)
                }
                variant="contained"
                isIcon
                buttonMode="create-click"
                typeButton={'submit'}
                light
                isDisable={isLoadingSubmit}
              />
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={10}>
              <TitleSection>Thông tin bất động sản</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập nguồn dữ liệu"
                        label="1. Nguồn dữ liệu"
                        isRequired
                        name="generalInfo.dataSrc"
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn loại dữ liệu--"
                        label="2. Loại dữ liệu"
                        isRequired
                        control={control}
                        name="generalInfo.dataType"
                        type="select"
                        errors={errors}
                        options={dataSourceType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn loại giao dịch--"
                        label="3. Loại giao dịch"
                        isRequired
                        control={control}
                        name="generalInfo.transactionType"
                        type="select"
                        errors={errors}
                        options={transactionType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn loại hợp đồng--"
                        label="4. Thời gian giao dịch"
                        isRequired
                        control={control}
                        name="generalInfo.transactionTime"
                        type="date"
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập mã bất động sản"
                        label="5. Mã bất động sản"
                        name="generalInfo.propertyCode"
                        control={control}
                        errors={errors}
                        isRequired
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập tên dự án"
                        label="6. Tên dự án"
                        name="generalInfo.projectId"
                        control={control}
                        errors={errors}
                        type="select"
                        options={listRealEstateProject}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Select Evidence Flag"
                        label="7. Evidence Flag"
                        name="generalInfo.evidenceFlag"
                        control={control}
                        errors={errors}
                        type="select"
                        options={evidenceFlagType}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox>
              <TitleSection>Vị trí bất động sản</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập địa chỉ"
                        label="8. Số nhà/Số căn hộ/Số lô"
                        isRequired
                        name="positionInfo.apartmentNumber"
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập địa chỉ"
                        label="9. Đường/Phố"
                        isRequired
                        name="positionInfo.street"
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn địa chỉ"
                        label="10. Xã/Phường"
                        isRequired
                        name="positionInfo.ward"
                        control={control}
                        errors={errors}
                        type="select"
                        options={listCommune}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn địa chỉ"
                        label="11. Quận/Huyện"
                        isRequired
                        name="positionInfo.district"
                        control={control}
                        errors={errors}
                        type="select"
                        options={listDistrict}
                        onChange={handleSelectedDistrict}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn địa chỉ"
                        label="12. Thành phố/Tỉnh"
                        isRequired
                        control={control}
                        name="positionInfo.province"
                        type="select"
                        errors={errors}
                        options={listProvince}
                        onChange={handleSelectedProvince}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập vị trí"
                        label="13. Số Tờ Số Thửa"
                        isRequired
                        control={control}
                        name="positionInfo.location"
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0"
                        label="14. Vĩ độ"
                        name="positionInfo.latitude"
                        control={control}
                        errors={errors}
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0"
                        label="15. Kinh độ"
                        name="positionInfo.longitude"
                        control={control}
                        errors={errors}
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>

          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox>
              <TitleSection>Hiện trạng</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn loại BĐS"
                        label="16. Loại BĐS"
                        isRequired
                        control={control}
                        name="sector"
                        type="select"
                        errors={errors}
                        options={listPropertyType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn hiện trạng BĐS"
                        label="17. Hiện trạng BĐS"
                        control={control}
                        name="statusInfo.status"
                        type="select"
                        errors={errors}
                        options={statusType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="18. Diện tích đất (m2)"
                        control={control}
                        name="statusInfo.area"
                        errors={errors}
                        isRequired
                        type="area"
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="19. Chiều rộng (m)"
                        control={control}
                        name="statusInfo.width"
                        errors={errors}
                        setError={setError}
                        type="area"
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="20. Chiều dài (m)"
                        control={control}
                        name="statusInfo.length"
                        errors={errors}
                        setError={setError}
                        type="area"
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="21. Diện tích đất theo hiện trạng (m2)"
                        control={control}
                        name="statusInfo.currentArea"
                        errors={errors}
                        type="area"
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="22. Diện tích sàn (m2)"
                        control={control}
                        name="statusInfo.gfa"
                        errors={errors}
                        isRequired
                        type="area"
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="23. Hệ số sử dụng đất"
                        control={control}
                        name="statusInfo.plotRatio"
                        errors={errors}
                        type="area"
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn thời hạn"
                        label="24. Thời hạn sử dụng đất"
                        control={control}
                        name="tenureType"
                        errors={errors}
                        type="select"
                        options={tenureType}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Nhập số năm"
                        label=""
                        control={control}
                        name="statusInfo.tenure"
                        errors={errors}
                        disabled={isTerm}
                        format="number"
                        setError={setError}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn hình dáng đất"
                        label="25. Hình dáng đất"
                        name="statusInfo.shape"
                        control={control}
                        errors={errors}
                        type="select"
                        options={shapeType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn lợi thế mặt tiền"
                        label="26. Lợi thế mặt tiền"
                        name="statusInfo.frontageAdvantage"
                        control={control}
                        errors={errors}
                        type="select"
                        options={listRealEstateFrontageAdvantage}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn hướng nhìn"
                        label="27. Hướng nhìn"
                        name="statusInfo.views"
                        control={control}
                        errors={errors}
                        type="selectMultiple"
                        options={listPropertyViewsType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="Chọn các yếu tố khác"
                        label="28. Các yếu tố khác"
                        name="statusInfo.factors"
                        control={control}
                        errors={errors}
                        type="selectMultiple"
                        options={listPropertyFactorsType}
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <Typography
                        color={theme.palette.primary.light}
                        fontSize={'14px'}
                        fontWeight={600}
                        sx={{
                          '& span': {
                            ml: 0.5,
                            color: theme.palette.primary.lighter,
                          },
                        }}
                      >
                        29. Tình trạng pháp lý
                      </Typography>
                      <Box
                        sx={{
                          '& > .MuiFormGroup-root': {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                        }}
                      >
                        <TextFieldCustom
                          name="legalStatus.constructionPermit"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={constructionPermit}
                        />
                        <TextFieldCustom
                          name="legalStatus.masterPlan1_500"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={masterPlan1_500}
                        />
                        <TextFieldCustom
                          name="legalStatus.masterPlan1_2000"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={masterPlan1_2000}
                        />
                        <TextFieldCustom
                          name="legalStatus.inPrincipleApproval"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={inPrincipleApproval}
                        />
                        <TextFieldCustom
                          name="legalStatus.llc_lgd"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={llc_lgd}
                        />
                        <TextFieldCustom
                          name="legalStatus.dc_ccc"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={dc_ccc}
                        />
                        <TextFieldCustom
                          name="legalStatus.spa"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={spa}
                        />
                        <TextFieldCustom
                          name="legalStatus.lurc"
                          control={control}
                          errors={errors}
                          type="checkbox"
                          options={lurc}
                        />
                      </Box>
                      {realEstateDetail?.realEstate?.legalStatus?.licenses?.map(
                        f => (
                          <Box
                            display="flex"
                            mb={1}
                            // onClick={() => handlePreviewFile(f)}
                          >
                            <img
                              alt="file"
                              src={returnFileType(f.file.filename)}
                              width="18px"
                            />
                            <Box
                              sx={{
                                width: '400px',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography
                                ml={1}
                                fontSize="14px"
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {f.file.filename}
                              </Typography>
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="label"
                                sx={{ padding: '0', marginLeft: '4px' }}
                                onClick={() => removeFileEdit(f.file.id)}
                              >
                                <img src={CLOSE_ICON} alt="delete-icon" />
                              </IconButton>
                            </Box>
                          </Box>
                        ),
                      )}
                      {filesAttachment?.map((file, index) => (
                        <Box key={file.type} display="flex" mb={1}>
                          <img
                            alt="file"
                            src={returnFileType(file.name)}
                            width="18px"
                          />
                          <Box
                            sx={{
                              width: '400px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              sx={{
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              ml={1}
                              fontSize="14px"
                              onClick={() => handlePreviewFile(file)}
                            >
                              {file.name}
                            </Typography>
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="label"
                              sx={{ padding: '0', marginLeft: '4px' }}
                              onClick={() => handleRemoveFileImport(index)}
                            >
                              <img src={CLOSE_ICON} alt="delete-icon" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}

                      <CustomButton
                        title="Tải tệp lên"
                        isIcon
                        buttonMode="upload"
                        variant="outlined"
                        sxProps={{
                          border: `1px solid ${theme.palette.primary.lighter}`,
                          padding: '4.5px 8px',
                          height: '34px',
                          mt: 1,
                          '& .MuiTypography-root': {
                            fontSize: '12px',
                          },
                        }}
                        handleClick={handleUploadMultipleFiles}
                      />

                      <Typography
                        mt={1}
                        fontSize={'14px'}
                        color={theme.palette.primary.light}
                        fontStyle={'italic'}
                      >
                        * Định dạng doc, docx, xlsx, pdf. Kích thước không quá
                        5Mb.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <Box>
                        <TextFieldCustom
                          placeholder="Nhập mô tả chung"
                          label="30. Mô tả chung"
                          control={control}
                          name="statusInfo.description"
                          errors={errors}
                          type="textarea"
                          rows={5}
                          isRequired
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox>
              <TitleSection>Giá trị</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0"
                        label="31. Tổng giá trị (VNĐ)"
                        isRequired
                        control={control}
                        name="totalPrice"
                        errors={errors}
                        setError={setError}
                        type="currency"
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="32. Tổng giá trị (USD)"
                        control={control}
                        name="totalPriceUSD"
                        errors={errors}
                        isRequired
                        setError={setError}
                        disabled
                        type="currency"
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="33. Giá trị/ diện tích đất"
                        control={control}
                        name="priceUSDPerLA"
                        errors={errors}
                        disabled
                        type="currency"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0.00"
                        label="34. Giá trị/ diện tích sàn"
                        isRequired
                        name="priceUSDPerGFA"
                        control={control}
                        errors={errors}
                        disabled
                        type="currency"
                      />
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      <TextFieldCustom
                        placeholder="0"
                        label="35. Tỷ giá áp dụng (VNĐ/USD)"
                        name="fx"
                        control={control}
                        errors={errors}
                        setError={setError}
                        type="area"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box mt={3} sx={{ marginLeft: { xs: '20px', lg: '0px' } }}>
            <CustomButton
              handleClick={() => setIsExpand(!isExpand)}
              title={
                isExpand
                  ? t(translations.common.collapse)
                  : t(translations.common.extend)
              }
              variant="outlined"
              isIcon
              buttonMode={isExpand ? 'up' : 'down'}
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
              }}
            />
          </Box>
          {isExpand && (
            <>
              <Box
                sx={{
                  paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
                  paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
                }}
              >
                <LayoutBox>
                  <TitleSection>Hiện trạng</TitleSection>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0"
                            label="36. Số lượng sản phẩm"
                            control={control}
                            name="additionalStatus.units"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="integer"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="37. DT đất thương phẩm (m2)"
                            control={control}
                            name="additionalStatus.netLandArea"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập hiện trạng đất"
                            label="38. Hiện trạng đất"
                            control={control}
                            name="additionalStatus.curLandStatus"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="39. Hiện trạng DT đất ở thấp tầng (m2)"
                            control={control}
                            name="additionalStatus.curLandStatus_RLR"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="40. Hiện trạng DT đất ở cao tầng (m2)"
                            control={control}
                            name="additionalStatus.curLandStatus_RHR"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="41. Hiện trạng DT đất TMDV (m2)"
                            control={control}
                            name="additionalStatus.curLandStatus_Comercial"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="42. Hiện trạng DT đất nghỉ dưỡng (m2)"
                            control={control}
                            name="additionalStatus.curLandStatus_Hospitality"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="43. Hiện trạng DT đất CN (m2)"
                            control={control}
                            name="additionalStatus.curLandStatus_Industrial"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="44. Hiện trạng DT đất NN (m2)"
                            name="additionalStatus.curLandStatus_Agricultural"
                            control={control}
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Chọn năm"
                            label="45. Năm xây dựng"
                            name="additionalStatus.launchYear"
                            control={control}
                            errors={errors}
                            type="select"
                            options={yearOptions}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Chọn năm "
                            label="46. Năm cải tạo"
                            name="additionalStatus.renovateYear"
                            control={control}
                            errors={errors}
                            type="select"
                            options={yearOptions}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Chọn năm"
                            label="47. Năm hoàn thành (dự kiến)"
                            name="additionalStatus.completionYear"
                            control={control}
                            errors={errors}
                            type="yearOnly"
                            isHiddenPastDay
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="48. Số lượng tòa nhà"
                            control={control}
                            name="additionalStatus.noBlock"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="integer"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="49. Số tầng"
                            control={control}
                            name="additionalStatus.noFloor"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="integer"
                          />
                        </Grid>
                      </Grid>

                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="50. Công suất dự án đang hoạt động (%)"
                            control={control}
                            name="additionalStatus.occupancy"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="percent"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </LayoutBox>
              </Box>
              <Box
                sx={{
                  paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
                  paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
                }}
              >
                <LayoutBox>
                  <TitleSection>Giá trị ước tính</TitleSection>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0"
                            label="51. Tiền sử dụng đất ước tính (USD)"
                            control={control}
                            name="estimatePrice.lufs"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="currency"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="52. Tỷ suất vốn hóa (%)"
                            control={control}
                            name="estimatePrice.capitalizationRate"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="percent"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin bên bán"
                            label="53. Bên bán"
                            control={control}
                            name="estimatePrice.seller"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin bên mua"
                            label="54. Bên mua"
                            control={control}
                            name="estimatePrice.buyer"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="55. Price per m² on NLA (USD)"
                            control={control}
                            name="estimatePrice.ppSquareOnNLA"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="currency"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0"
                            label="56. IRR"
                            control={control}
                            name="estimatePrice.irr"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>

                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="57. Market gross rent (USD/m²/mth)"
                            control={control}
                            name="estimatePrice.mgr"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="currency"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="58. Average daily rate"
                            control={control}
                            name="estimatePrice.adr"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="59. Market yield"
                            control={control}
                            name="estimatePrice.marketYield"
                            errors={errors}
                            setError={setError}
                            type="area"
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="0.00"
                            label="60. Price per room"
                            control={control}
                            name="estimatePrice.ppr"
                            errors={errors}
                            format="number"
                            setError={setError}
                            type="currency"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="61. Bank"
                            name="estimatePrice.bank"
                            control={control}
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="62. Bank Instructor - Contact person"
                            name="estimatePrice.bankInstrContactPerson"
                            control={control}
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="63. Bank Instructor - Phone"
                            name="estimatePrice.bankInstrPhone"
                            control={control}
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="64. Bank Instructor - Email"
                            name="estimatePrice.bankInstrEmail"
                            control={control}
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="65. Borrower - Name"
                            control={control}
                            name="estimatePrice.borrowerName"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="66. Borrower - Mail"
                            control={control}
                            name="estimatePrice.borrowerMail"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Nhập thông tin"
                            label="67. Borrower - Phone"
                            control={control}
                            name="estimatePrice.borrowerPhone"
                            errors={errors}
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="Ngày/Tháng/Năm"
                            label="68. Instructed date"
                            control={control}
                            name="estimatePrice.instrDate"
                            type="date"
                            errors={errors}
                            isHiddenFeatureDay
                          />
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <TextFieldCustom
                            placeholder="00:00"
                            label="69. Instructed time"
                            control={control}
                            name="estimatePrice.instrTime"
                            errors={errors}
                            type="time"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </LayoutBox>
              </Box>
            </>
          )}
        </form>
        {isOpenDialog && (
          <ConfirmDialog
            isOpen={isOpenDialog}
            handleClose={handleCloseDialog}
            handleSubmit={handleSubmitDialog}
            actionName={
              realEstateDetail?.status === Status.ACTIVE
                ? t(translations.common.lock)
                : t(translations.common.unlock)
            }
          >
            <Typography
              fontSize={'14px'}
              fontWeight={700}
              color={theme.palette.primary.light}
              mb={5}
            >
              {realEstateDetail?.status === Status.ACTIVE
                ? t(translations.realEstate.lockRealEstateMessage)
                : t(translations.realEstate.unlockRealEstateMessage)}
            </Typography>
          </ConfirmDialog>
        )}
      </Box>
    </>
  );
}
