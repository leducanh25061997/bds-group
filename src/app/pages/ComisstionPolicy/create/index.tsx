import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import Toogle from 'app/components/Toogle';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import path from 'app/routes/path';
import ADD_ICON from 'assets/background/add-icon.svg';
import PLUS_ICON from 'assets/background/add-pink-icon.svg';
import ARROW_RIGHT_ICON from 'assets/background/arrow-right-icon.svg';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import BIGGEREQUAL_ICON from 'assets/background/bigger-equal-icon.svg';
import BIGGER_ICON from 'assets/background/bigger-icon.svg';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import FROM_ICON from 'assets/background/form-text-icon.svg';
import WARNING_ICON from 'assets/background/warning-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import {
  Beneficiary,
  ComisstionRules,
  CreateIndirectUnit,
  CreateSalesUnit,
  IndirectUnitPercent,
  ListConditionApply,
  OtherBenefitsPercent,
  Project,
} from 'types/Comisstion';
import {
  ComissionStaffType,
  CustomerType,
  EnjoymentType,
  SaleRulesType,
} from 'types/Enum';
import { OptionAutocomplete } from 'types/Option';

import documentService from 'services/api/document';

import { TooltipText } from 'app/components/Tooltip';

import ComissionUnit from '../components/ComissionUnit';
import ItemComisstionSales from '../components/Comisstion/sales';
import { useComisstionPolicySlice } from '../slice';
import { selectComisstion } from '../slice/selector';
import { PayloadCreateComisstionPolicy } from '../slice/types';
interface Props {
  isEdit?: boolean;
}

export default function CreateComisstionRule(props: Props) {
  const { isEdit } = props;
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { managermentList, ComisstionPolicyDetail } =
    useSelector(selectComisstion);
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const { actions } = useComisstionPolicySlice();
  const { projectList } = useSelector(selectAuth);
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
  const { t } = useTranslation();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const navigate = useNavigate();

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenDialogIndirect, setIsOpenDialogIndirect] =
    useState<boolean>(false);
  const [checkStatus, setcheckStatus] = useState(true);
  const [listProject, setListProject] = useState<Project[]>([]);
  const [listSalesUnits, setListSalesUnits] = useState<CreateSalesUnit[]>([]);
  const [listIndirectUnits, setListIndirectUnits] = useState<
    CreateIndirectUnit[]
  >([]);
  const [lisRulesPaid, setLisRulesPaids] = useState<ComisstionRules[]>([
    {
      targetBegin: 0,
      targetEnd: 0,
      result: 0,
      name: '',
      sign: '',
    },
  ]);
  const [listBeneficiary, setlistBeneficiary] = useState<Beneficiary[]>([]);
  const [listRepresentative, setlistRepresentative] = useState<Beneficiary[]>(
    [],
  );
  const [listOrgChart, setlistOrgChart] = useState<Project[]>([]);
  const [listStaff, setlistStaff] = useState<OptionAutocomplete[]>([]);
  const [comissitonStaff, setComissitonStaff] = useState<number>(0);
  const [comissitonBo, setComissitonBo] = useState<number>(0);
  const [orgchartSelectedID, setorgchartSelectedID] = useState<string>('');
  const [isEditUnit, setIsEditUnit] = useState<boolean>(false);
  const [isSaleValid, setIsSaleValid] = useState<boolean>(false);
  const [isDirectValid, setIsDirectValid] = useState<boolean>(false);

  useEffect(() => {
    !isEdit && dispatch(actions.fetchRoleList());
    fetchListOrgchart();
    const newData: Project[] = [];
    projectList?.data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item.name,
        value: item.id,
      });
    });
    setListProject(newData);
  }, [actions, dispatch, isEdit]);

  const fetchListOrgchart = () => {
    dispatch(OrgchartActions.fetchListOrgchart());
  };

  useEffect(() => {
    return () => {
      dispatch(actions.clearDataComisstion());
    };
  }, [actions, dispatch]);

  useEffect(() => {
    const newData: OptionAutocomplete[] = [];
    managermentList?.forEach(item => {
      if (item) {
        if (isEditUnit) {
          let isCheck = false;
          if (isOpenDialog) {
            isCheck =
              listBeneficiary.findIndex(element => element.id === item.id) >=
                0 ?? true;
          } else {
            isCheck =
              listRepresentative.findIndex(element => element.id === item.id) >=
                0 ?? true;
          }
          newData.push({
            id: item?.id,
            key: item?.id,
            value: item?.code,
            isCheck,
            avatar: '',
            position: 'Nhân viên kinh doanh',
            name: item?.fullName,
            label: item?.fullName,
          });
        } else {
          newData.push({
            id: item?.id,
            key: item?.id,
            value: item?.code,
            isCheck: false,
            avatar: '',
            position: 'Nhân viên kinh doanh',
            name: item?.fullName,
            label: item?.fullName,
          });
        }
      }
    });
    setlistStaff(newData);
  }, [managermentList]);

  useEffect(() => {
    const orgchart: Project[] = [];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        id: parseInt(item.code),
        key: item.name,
        value: item.id,
        name: item.name,
      });
    });
    setlistOrgChart(orgchart);
  }, [OrgchartManagement]);

  const breadCrumbList = useMemo(() => {
    if (isEdit) {
      return [
        {
          label: t(translations.Comisstion.ComisstionAccount),
          path: path.ComisstionsAccount,
        },
        {
          label: t(translations.common.edit),
          path: `/Comisstions-account/edit/${id}`,
          isActive: true,
        },
      ];
    } else {
      return [
        {
          label: t(translations.Comisstion.ComisstionAccount),
          path: path.ComisstionsAccount,
        },
        {
          label: t(translations.Comisstion.createAccount),
          path: path.ComisstionRules,
          isActive: true,
        },
      ];
    }
  }, [t, isEdit, id]);

  useEffect(() => {
    if (isEdit && ComisstionPolicyDetail) {
      const salesUnits: CreateSalesUnit[] = [];
      const indirectUnits: CreateIndirectUnit[] = [];
      setValue('code', ComisstionPolicyDetail?.code);
      setValue('name', ComisstionPolicyDetail?.name);
      setValue('projectId', ComisstionPolicyDetail?.projectId);
      setValue('startDate', ComisstionPolicyDetail?.startDate);
      setValue('endDate', ComisstionPolicyDetail?.endDate);
      setValue('hotTranfer', ComisstionPolicyDetail?.hotTranfer);
      setValue('hotBooking', ComisstionPolicyDetail?.hotBooking);
      setValue('supportCost', ComisstionPolicyDetail?.supportCost);
      setValue(
        'tax',
        parseFloat((ComisstionPolicyDetail?.tax * 100).toFixed(2)),
      );
      setValue(
        'commissionBO',
        parseFloat((ComisstionPolicyDetail?.commissionBO * 100).toFixed(2)),
      );
      setValue(
        'commissionManager',
        parseFloat(
          (ComisstionPolicyDetail?.commissionManager * 100).toFixed(2),
        ),
      );
      setValue(
        'commissionStaff',
        parseFloat((ComisstionPolicyDetail?.commissionStaff * 100).toFixed(2)),
      );
      setValue(
        'totalCommission',
        parseFloat((ComisstionPolicyDetail?.totalCommission * 100).toFixed(2)),
      );
      setValue('rulesbonus.name', ComisstionPolicyDetail?.conditionApply?.name);
      setValue('rulesbonus.sign', ComisstionPolicyDetail?.conditionApply?.sign);
      setValue(
        'rulesbonus.target',
        parseFloat(
          (ComisstionPolicyDetail?.conditionApply?.target * 100).toFixed(2),
        ),
      );
      setValue(
        'commissionBenefit',
        parseFloat((ComisstionPolicyDetail?.totalCommission * 100).toFixed(2)) -
          parseFloat(
            (ComisstionPolicyDetail?.commissionStaff * 100).toFixed(2),
          ),
      );

      ComisstionPolicyDetail.listIndirect.forEach(item => {
        const _itemIndirectUnit: CreateIndirectUnit = {
          indirectUnitId: item.orgChartId,
          name: item.key,
          totalPercentUnit: 0,
          indirectUnitPercents: [],
        };
        const IndirectUnitPercent: IndirectUnitPercent[] = [];
        let totalPercentUnit = 0;
        item.listStaff.forEach(element => {
          if (
            element.typeCommissionPolicyStaff ===
            ComissionStaffType.INDIRECT_UNIT
          ) {
            totalPercentUnit += element.percent;
            IndirectUnitPercent.push({
              staffId: element.staffId,
              percent: element.percent,
              avatar: element.avatar,
              staffName: element.staff.fullName,
              staffPosition: element.staff.position,
            });
          }
        });
        _itemIndirectUnit.totalPercentUnit = totalPercentUnit;
        _itemIndirectUnit.indirectUnitPercents = IndirectUnitPercent;
        indirectUnits.push(_itemIndirectUnit);
      });

      ComisstionPolicyDetail.listSale.forEach(item => {
        const _itemSalestUnit: CreateSalesUnit = {
          orgChartId: item.orgChartId,
          name: item.key,
          totalPercentUnit: 0,
          staffPercent: ComisstionPolicyDetail?.commissionStaff,
          otherBenefitsPercents: [],
        };
        const SalesUnitPercent: OtherBenefitsPercent[] = [];
        let totalPercentUnit = 0;
        item.listStaff.forEach(element => {
          if (
            element.typeCommissionPolicyStaff ===
            ComissionStaffType.OTHER_BENEFITS
          ) {
            totalPercentUnit += element.percent;
            SalesUnitPercent.push({
              staffId: element.staffId,
              percent: element.percent,
              avatar: element.avatar,
              staffName: element.staff.fullName,
              staffPosition: element.staff.position,
            });
          }
        });
        _itemSalestUnit.totalPercentUnit = totalPercentUnit;
        _itemSalestUnit.otherBenefitsPercents = SalesUnitPercent;
        salesUnits.push(_itemSalestUnit);
      });
      setComissitonBo(ComisstionPolicyDetail?.commissionBO * 100);
      setListSalesUnits(salesUnits);
      setListIndirectUnits(indirectUnits);
      setLisRulesPaids(ComisstionPolicyDetail?.conditionPayments);
      ComisstionPolicyDetail?.conditionPayments?.forEach((item, index) => {
        if (item.sign === SaleRulesType.BETWEEN) {
          setValue(`rulespaid.end.${index}`, item.targetEnd * 100);
          setValue(`rulespaid.begin.${index}`, item.targetBegin * 100);
        } else {
          setValue(`rulespaid.end.${index}`, item.targetBegin * 100);
          setValue(`rulespaid.begin.${index}`, item.targetEnd * 100);
        }
        setValue(`rulespaid.result.${index}`, item.result * 100);
        setValue(`rulespaid.sign.${index}`, item.sign);
        setValue(`rulespaid.name.${index}`, item.name);
      });
      setcheckStatus(ComisstionPolicyDetail?.CheckStatus);
    }
  }, [isEdit, ComisstionPolicyDetail, setValue, dispatch, actions]);

  useEffect(() => {
    if (!isEdit) {
      getGenerateCode();
    }
  }, [isEdit]);

  const listConditionInfluence = useMemo(() => {
    return [
      {
        id: 1,
        key: BIGGER_ICON,
        value: SaleRulesType.THAN,
        isDefault: true,
      },
      {
        id: 2,
        key: BIGGEREQUAL_ICON,
        value: SaleRulesType.THAN_OR_EQUAL,
      },
    ];
  }, []);

  const listConditionPayment = useMemo(() => {
    return [
      {
        id: 1,
        key: BIGGER_ICON,
        value: SaleRulesType.THAN,
        isDefault: true,
      },
      {
        id: 2,
        key: BIGGEREQUAL_ICON,
        value: SaleRulesType.THAN_OR_EQUAL,
      },
      {
        id: 3,
        key: FROM_ICON,
        value: SaleRulesType.BETWEEN,
      },
    ];
  }, []);

  const listInfluence = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Đạt',
        value: EnjoymentType.QUALIFIED,
        isDefault: true,
      },
    ];
  }, []);

  const handleCancel = () => navigate(-1);

  function checkComisstion() {
    const comissionTotal = watch('totalCommission') || 0;
    const comissionStaff = watch('commissionStaff') || 0;
    const comissionManager = watch('commissionManager') || 0;
    const comissionBo = watch('commissionBO') || 0;

    if (
      !comissionTotal ||
      !comissionStaff ||
      !comissionManager ||
      !comissionBo
    ) {
      return false;
    }
    return true;
  }

  const handleEditIndirectUnit = (item: CreateIndirectUnit) => {
    const Listrepresent: Beneficiary[] = [];
    let totalStaffPersent = 0;
    item.indirectUnitPercents.forEach((element, index) => {
      totalStaffPersent += element.percent * 100 ?? 0;
      Listrepresent.push({
        name: element.staffName,
        avatar: element.avatar,
        persent: element.percent,
        id: element.staffId,
        isCheck: true,
        position: element.staffPosition,
        orgChartId: item.indirectUnitId,
      });
    });
    setIsDirectValid(false);
    setComissitonBo(watch('commissionBO') - totalStaffPersent);
    setorgchartSelectedID(item.indirectUnitId ?? '');
    dispatch(actions.getListManagementeData({ id: item.indirectUnitId }));
    setValue('saleUnits', item.indirectUnitId);
    setlistRepresentative(Listrepresent);
    setIsEditUnit(true);
    setIsOpenDialogIndirect(true);
  };

  const handleEditSaleUnit = (item: CreateSalesUnit) => {
    const Listrepresent: Beneficiary[] = [];
    let totalStaffPersent = 0;

    item.otherBenefitsPercents.forEach((element, index) => {
      totalStaffPersent += element.percent * 100 ?? 0;
      Listrepresent.push({
        name: element.staffName,
        avatar: element.avatar,
        persent: element.percent,
        id: element.staffId,
        isCheck: true,
        position: element.staffPosition,
        orgChartId: item.orgChartId,
      });
    });
    setIsSaleValid(false);
    setComissitonStaff(watch('commissionManager') - totalStaffPersent);
    setorgchartSelectedID(item.orgChartId ?? '');
    dispatch(actions.getListManagementeData({ id: item.orgChartId }));
    setValue('saleUnits', item.orgChartId);
    setlistBeneficiary(Listrepresent);
    setIsEditUnit(true);
    setIsOpenDialog(true);
  };

  const handleOpenDialog = () => {
    if (checkComisstion()) {
      setError('beneficiaryPercent', { message: '' });
      setComissitonStaff(watch('commissionManager'));
      setlistBeneficiary([]);
      setlistStaff([]);
      setValue('saleUnits', '');
      setValue('beneficiaryPerson', '');
      setValue('beneficiaryPercent', '');
      setIsOpenDialog(true);
      setIsEditUnit(false);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng điền đầy đủ thông tin hoa hồng',
          type: 'error',
        }),
      );
    }
  };

  const handleOpenDialogIndirect = () => {
    if (checkComisstion()) {
      setError('beneficiaryPercent', { message: '' });
      // setComissitonBo(watch('commissionBO'));
      setlistRepresentative([]);
      setlistStaff([]);
      setValue('saleUnits', '');
      setValue('beneficiaryPerson', '');
      setValue('beneficiaryPercent', '');
      setIsEditUnit(false);
      setIsOpenDialogIndirect(true);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng điền đầy đủ thông tin hoa hồng',
          type: 'error',
        }),
      );
    }
  };

  const getGenerateCode = async () => {
    const genarateCode = { generateCode: 'CS' };
    const data = await documentService.postGenarateCode(genarateCode);
    setValue('code', data);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleCloseDialogIndirect = () => {
    setIsOpenDialogIndirect(false);
  };

  const handleSubmitDialog = () => {
    const staffPercent = watch('commissionStaff');
    const orgChart = listOrgChart.find(
      item => item.value === orgchartSelectedID,
    );
    const OtherBenefitsPercent: OtherBenefitsPercent[] = [];
    const newListSalesUnits = [...listSalesUnits];
    let totalPercentUnit = 0;

    if (listBeneficiary.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa thêm người thụ hưởng',
          type: 'error',
        }),
      );
      return;
    }

    listBeneficiary.forEach(element => {
      totalPercentUnit += element.persent;
      OtherBenefitsPercent.push({
        staffId: element.id,
        percent: element.persent,
        avatar: element.avatar,
        staffName: element.name,
        staffPosition: element.position,
      });
    });

    const itemSaleUnit: CreateSalesUnit = {
      orgChartId: orgChart?.value,
      name: orgChart?.name,
      staffPercent: staffPercent / 100,
      totalPercentUnit,
      otherBenefitsPercents: OtherBenefitsPercent,
    };

    const checkExist = newListSalesUnits.findIndex(
      item => item.orgChartId === itemSaleUnit.orgChartId,
    );

    if (checkExist >= 0) {
      newListSalesUnits[checkExist] = itemSaleUnit;
    } else {
      newListSalesUnits.push(itemSaleUnit);
    }

    if (isEditUnit) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Chỉnh sửa vị bán hàng thành công',
          type: 'success',
        }),
      );
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Thêm đơn vị bán hàng thành công',
          type: 'success',
        }),
      );
    }

    setListSalesUnits(newListSalesUnits);
    setIsOpenDialog(false);
  };

  const handleSubmitDialogIndirect = () => {
    const orgChart = listOrgChart.find(
      item => item.value === orgchartSelectedID,
    );
    const IndirectUnitPercent: IndirectUnitPercent[] = [];
    const newListIndirectUnits = [...listIndirectUnits];
    let totalPercentUnit = 0;

    if (listRepresentative.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa thêm người đại diện',
          type: 'error',
        }),
      );
      return;
    }

    listRepresentative.forEach(element => {
      totalPercentUnit += element.persent;
      IndirectUnitPercent.push({
        staffId: element.id,
        percent: element.persent,
        avatar: element.avatar,
        staffName: element.name,
        staffPosition: element.position,
      });
    });

    const itemIndirectUnit: CreateIndirectUnit = {
      indirectUnitId: orgChart?.value,
      name: orgChart?.name,
      totalPercentUnit,
      indirectUnitPercents: IndirectUnitPercent,
    };

    const checkExist = newListIndirectUnits.findIndex(
      item => item.indirectUnitId === itemIndirectUnit.indirectUnitId,
    );

    if (checkExist >= 0) {
      newListIndirectUnits[checkExist] = itemIndirectUnit;
    } else {
      newListIndirectUnits.push(itemIndirectUnit);
    }

    if (isEditUnit) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Chỉnh sửa đơn vị gián tiếp thành công',
          type: 'success',
        }),
      );
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Thêm đơn vị gián tiếp thành công',
          type: 'success',
        }),
      );
    }

    setListIndirectUnits(newListIndirectUnits);
    setIsOpenDialogIndirect(false);
  };

  const submit = async (data: PayloadCreateComisstionPolicy) => {
    setIsLoading(true);

    const listConditionApply: ListConditionApply = {
      name: watch('rulesbonus.name'),
      sign: watch('rulesbonus.sign'),
      target: parseFloat(watch('rulesbonus.target')) / 100,
    };
    const conditionPayments: ComisstionRules[] = [];
    const tax = parseFloat(watch('tax')) / 100;
    const totalCommission = parseFloat(watch('totalCommission')) / 100;
    const commissionStaff = parseFloat(watch('commissionStaff')) / 100;
    const commissionManager = parseFloat(watch('commissionManager')) / 100;
    const commissionBO = parseFloat(watch('commissionBO')) / 100;
    const supportCost = watch('supportCost') || 0;
    const hotTranfer = watch('hotTranfer') || 0;
    const hotBooking = watch('hotBooking') || 0;

    if (
      listSalesUnits.findIndex(
        item =>
          parseFloat(item.totalPercentUnit.toString()).toFixed(3) >
          parseFloat(commissionManager.toString()).toFixed(3),
      ) >= 0
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Tỉ lệ hoa hồng đã được thay đổi, vui lòng cập nhật tỉ lệ chia cho các đơn vị thụ hưởng.',
          type: 'success',
        }),
      );
      setIsSaleValid(true);
      return;
    }

    if (
      listIndirectUnits.findIndex(
        item =>
          parseFloat(item.totalPercentUnit.toString()).toFixed(3) >
          parseFloat(commissionBO.toString()).toFixed(3),
      ) >= 0
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Tỉ lệ hoa hồng đã được thay đổi, vui lòng cập nhật tỉ lệ chia cho các đơn vị thụ hưởng.',
          type: 'success',
        }),
      );
      setIsDirectValid(true);
      return;
    }

    lisRulesPaid.forEach((element, index) => {
      const result = parseFloat(watch(`rulespaid.result.${index}`)) / 100 || 0;
      let targetBegin = parseFloat(watch(`rulespaid.end.${index}`)) / 100 || 0;
      let targetEnd = parseFloat(watch(`rulespaid.begin.${index}`)) / 100 || 0;
      const sign = watch(`rulespaid.sign.${index}`);
      const name = watch(`rulespaid.name.${index}`);

      if (sign === SaleRulesType.BETWEEN) {
        targetBegin = targetEnd;
        targetEnd = parseFloat(watch(`rulespaid.end.${index}`)) / 100 || 0;
      }
      if (!result || !targetEnd) {
        setError(`rulespaid.name.${index}`, {
          message: 'Vui lòng nhập đủ điều kiện',
        });
        return;
      }
      conditionPayments.push({ name, sign, targetBegin, targetEnd, result });
    });

    const requestPayload = {
      ...data,
      tax,
      checkStatus,
      listConditionApply,
      conditionPayments,
      totalCommission,
      commissionStaff,
      commissionManager,
      commissionBO,
      commissionPolicyId: id,
      createSalesUnits: listSalesUnits,
      createIndirectUnits: listIndirectUnits,
      supportCost,
      hotTranfer,
      hotBooking,
    };

    await dispatch(
      actions.createComisstion(requestPayload, (res?: any) => {
        if (res) {
          if (res?.success) {
            if (isEdit) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật thành công',
                  type: 'success',
                }),
              );
              navigate(path.ComisstionRules);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo thành công',
                  type: 'success',
                }),
              );
              navigate(path.ComisstionRules);
            }
          } else {
            if (isEdit) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Cập nhật không thành công',
                  type: 'error',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }
        setIsLoading(false);
      }),
    );
  };

  const onError: SubmitErrorHandler<PayloadCreateComisstionPolicy> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const hanldeAddRulesPaid = () => {
    const item: ComisstionRules = {
      targetBegin: 0,
      targetEnd: 0,
      result: 0,
      name: '',
      sign: '',
    };
    if (lisRulesPaid.length > 2) {
      return;
    }
    const arr = [...lisRulesPaid].concat(item);
    setLisRulesPaids(arr);
  };

  const hanldeRemoveRulesPaid = (index: number) => {
    const arr = [...lisRulesPaid];
    arr.splice(index, 1);
    setLisRulesPaids(arr);
  };

  const hanldeAddBeneficiary = () => {
    const beneficiaryPercent = watch('beneficiaryPercent');
    const beneficiaryPerson = watch('beneficiaryPerson');

    if (parseInt(beneficiaryPercent) <= 0 || !beneficiaryPercent) {
      setError('beneficiaryPercent', { message: 'Sai định dạng' });
      return;
    }

    if (parseFloat(beneficiaryPercent) > comissitonStaff) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Hoa hồng thụ hưởng không đủ',
          type: 'error',
        }),
      );
      return;
    }

    const newListStaff = [...listStaff];
    newListStaff[
      newListStaff.findIndex(item => item.id === beneficiaryPerson)
    ].isCheck = true;

    const staff = listStaff.find(item => item.id === beneficiaryPerson);
    const item: Beneficiary = {
      id: staff?.id,
      name: staff?.name,
      avatar: staff?.avatar,
      position: staff?.position,
      persent: beneficiaryPercent / 100,
      orgChartId: orgchartSelectedID,
    };

    if (listBeneficiary.find(item => item.id === staff?.id)) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Nhân viên này đã thêm thụ hưởng',
          type: 'error',
        }),
      );
      return;
    }
    setComissitonStaff(comissitonStaff - parseFloat(beneficiaryPercent));
    setlistBeneficiary([...listBeneficiary].concat(item));
    setlistStaff(newListStaff);
  };

  const hanldeRemoveBeneficiary = (index: number) => {
    const newlistBeneficiary = [...listBeneficiary];
    const newListStaff = [...listStaff];
    const beneficiaryPersent = listBeneficiary[index].persent || 0;

    newListStaff[
      newListStaff.findIndex(item => item.id === newlistBeneficiary[index].id)
    ].isCheck = false;
    newlistBeneficiary.splice(index, 1);

    const comissitonPersent =
      parseFloat(comissitonStaff.toString()) +
      parseFloat(beneficiaryPersent.toString()) * 100;

    setComissitonStaff(comissitonPersent);
    setlistStaff(newListStaff);
    setlistBeneficiary(newlistBeneficiary);
  };

  const hanldeRemoveRepresentative = (index: number) => {
    const newlistBeneficiary = [...listRepresentative];
    const newListStaff = [...listStaff];
    const beneficiaryPersent = listRepresentative[index].persent || 0;

    const comissitonPersent =
      parseFloat(comissitonBo.toString()) +
      parseFloat(beneficiaryPersent.toString()) * 100;

    newListStaff[
      newListStaff.findIndex(item => item.id === newlistBeneficiary[index].id)
    ].isCheck = false;
    newlistBeneficiary.splice(index, 1);

    setComissitonBo(comissitonPersent);
    setlistStaff(newListStaff);
    setlistRepresentative(newlistBeneficiary);
  };

  const hanldeAddRepresentative = () => {
    const beneficiaryPercent = watch('beneficiaryPercent');
    const beneficiaryPerson = watch('beneficiaryPerson');

    if (parseInt(beneficiaryPercent) < 0 || !beneficiaryPercent) {
      setError('beneficiaryPercent', { message: 'Sai định dạng' });
      return;
    }

    if (parseFloat(beneficiaryPercent) > comissitonBo) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Hoa hồng thụ hưởng không đủ',
          type: 'error',
        }),
      );
      return;
    }

    const newListStaff = [...listStaff];
    newListStaff[
      newListStaff.findIndex(item => item.id === beneficiaryPerson)
    ].isCheck = true;

    const staff = listStaff.find(item => item.id === beneficiaryPerson);
    const item: Beneficiary = {
      id: staff?.id,
      name: staff?.name,
      avatar: staff?.avatar,
      position: staff?.position,
      persent: beneficiaryPercent / 100,
      orgChartId: orgchartSelectedID,
    };

    if (listRepresentative.find(item => item.id === staff?.id)) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Nhân viên này đã thêm thụ hưởng',
          type: 'error',
        }),
      );
      return;
    }

    setComissitonBo(comissitonBo - parseFloat(beneficiaryPercent));
    setlistRepresentative([...listRepresentative].concat(item));
    setlistStaff(newListStaff);
  };

  const handleSelectedUnits = async (id: string | number | string[]) => {
    setlistBeneficiary([]);
    setlistRepresentative([]);
    setorgchartSelectedID(id.toString());
    dispatch(actions.getListManagementeData({ id }));
  };

  const onchangeComisstionStaff = (value: string | number) => {
    const totalCommission = watch('totalCommission') || 0;
    if (
      parseFloat(totalCommission) <= parseFloat(value.toString()) ||
      parseFloat(value.toString()) < 0 ||
      !value
    ) {
      setError?.('commissionStaff', { message: 'Sai định dạng' });
      setValue('commissionBenefit', '');
    } else {
      setValue(
        'commissionBenefit',
        `${parseFloat(totalCommission) - parseFloat(value.toString())}%`,
      );
      setError('commissionStaff', { message: '' });
    }
  };

  const onchangeComisstionTotal = (value: string | number) => {
    const commissionStaff = watch('commissionStaff') || 0;
    if (
      parseFloat(commissionStaff) >= parseFloat(value.toString()) ||
      parseFloat(value.toString()) < 0 ||
      parseFloat(value.toString()) > 100 ||
      !value
    ) {
      setError('totalCommission', { message: 'Sai định dạng' });
      setValue('commissionBenefit', '');
    } else {
      setValue(
        'commissionBenefit',
        `${parseFloat(value.toString()) - parseFloat(commissionStaff)}%`,
      );
      setError('totalCommission', { message: '' });
    }
  };

  const handleRemoveIndirect = (index: number) => {
    const indirectUnits = [...listIndirectUnits];

    const comissitonPersent =
      parseFloat(comissitonBo.toString()) +
      listIndirectUnits[index].totalPercentUnit * 100;
    indirectUnits.splice(index, 1);

    setComissitonBo(comissitonPersent);
    setListIndirectUnits(indirectUnits);
  };

  const handleRemoveSales = (index: number) => {
    const salesUnits = [...listSalesUnits];
    salesUnits.splice(index, 1);
    setListSalesUnits(salesUnits);
  };

  const onchangeSignRules = (index: number) => {
    const sign = watch(`rulespaid.sign.${index}`);
    const lisRules = [...lisRulesPaid];
    lisRules[index].sign = sign;
    setLisRulesPaids(lisRules);
  };

  const onBlurCommissionManager = () => {
    const commissionManager = parseFloat(watch('commissionManager'));
    const commissionBO = parseFloat(watch('commissionBO'));

    if (commissionManager + commissionBO > 100) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tỉ lệ hoa hồng vượt quá 100%, vui lòng kiểm tra lại.',
          type: 'error',
        }),
      );
      setError('commissionManager', { message: 'Lỗi nhập liệu' });
      return;
    }

    if (
      listSalesUnits.findIndex(
        item => item.totalPercentUnit * 100 > commissionManager,
      ) >= 0
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Tỉ lệ hoa hồng đã được thay đổi, vui lòng cập nhật tỉ lệ chia cho các đơn vị thụ hưởng.',
          type: 'success',
        }),
      );
      setIsSaleValid(true);
      return;
    } else {
      setIsSaleValid(false);
    }
  };

  const onBlurCommissionBO = () => {
    const commissionBO = parseFloat(watch('commissionBO'));
    const commissionManager = parseFloat(watch('commissionManager'));
    setComissitonBo(watch('commissionBO'));

    if (commissionManager + commissionBO > 100) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tỉ lệ hoa hồng vượt quá 100%, vui lòng kiểm tra lại.',
          type: 'error',
        }),
      );
      setError('commissionBO', { message: 'Lỗi nhập liệu' });
      return;
    }

    if (
      listIndirectUnits.findIndex(
        item => item.totalPercentUnit * 100 > commissionBO,
      ) >= 0
    ) {
      dispatch(
        snackbarActions.updateSnackbar({
          message:
            'Tỉ lệ hoa hồng đã được thay đổi, vui lòng cập nhật tỉ lệ chia cho các đơn vị thụ hưởng.',
          type: 'success',
        }),
      );
      setIsDirectValid(true);
      return;
    } else {
      setIsDirectValid(false);
    }
  };

  const renderRules = () => {
    return (
      <Box>
        <IconButton sx={{ p: 0, position: 'absolute', mt: '20px' }}>
          <img src={ADD_ICON} onClick={hanldeAddRulesPaid} />
        </IconButton>
        {lisRulesPaid?.map((item, index) => (
          <Box sx={{ mt: '10px', display: 'flex', marginLeft: '16px' }}>
            <Box ml={'12px'}>
              <TextFieldCustom
                placeholder="Nhập nội dung"
                label={index === 0 && 'Điều kiện chi'}
                name={`rulespaid.name.${index}`}
                defaultValue={item.name}
                isRequired
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{
                  '& .MuiInputBase-root': {
                    width: { md: '200px' },
                    borderRadius: '8px',
                    background: theme.palette.common.white,
                    color: theme.palette.common.black,
                    height: '44px',
                    fontSize: '14px',
                    border: `1px solid #D3D3D3`,
                    '& input': {
                      padding: '9px',
                    },
                  },
                }}
              />
            </Box>
            <Box m={'0px 8px'}>
              <TextFieldCustom
                name={`rulespaid.sign.${index}`}
                defaultValue={item.sign}
                options={listConditionPayment}
                onChange={() => onchangeSignRules(index)}
                control={control}
                errors={errors}
                type="select"
                format="image"
                max={100}
                setError={setError}
                sxProps={{
                  width: { md: '80px' },
                }}
              />
            </Box>
            <Box>
              <TextFieldCustom
                name={`rulespaid.begin.${index}`}
                control={control}
                endAdornment={'%'}
                errors={errors}
                max={100}
                setError={setError}
                sxProps={{
                  '& .MuiInputBase-root': {
                    width: { md: '90px' },
                    borderRadius: '8px',
                    background: theme.palette.common.white,
                    color: theme.palette.common.black,
                    height: '44px',
                    fontSize: '14px',
                    border: `1px solid #D3D3D3`,
                    '& input': {
                      padding: '9px',
                    },
                  },
                }}
              />
            </Box>
            {item.sign === SaleRulesType.BETWEEN ? (
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ alignSelf: 'center', p: '6px' }}>
                  ~
                </Typography>
                <TextFieldCustom
                  name={`rulespaid.end.${index}`}
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  max={100}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '90px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px',
                      },
                    },
                  }}
                />
              </Box>
            ) : (
              <Box width={'112px'} />
            )}
            <img src={ARROW_RIGHT_ICON} style={{ margin: '0px 8px' }} />
            <Box>
              <TextFieldCustom
                name={`rulespaid.result.${index}`}
                control={control}
                errors={errors}
                endAdornment={'%'}
                max={100}
                setError={setError}
                sxProps={{
                  '& .MuiInputBase-root': {
                    width: { md: '106px' },
                    borderRadius: '8px',
                    background: theme.palette.common.white,
                    color: theme.palette.common.black,
                    height: '44px',
                    fontSize: '14px',
                    border: `1px solid #D3D3D3`,
                    '& input': {
                      padding: '9px',
                    },
                  },
                }}
              />
            </Box>
            {index > 0 && (
              <IconButton sx={{ p: 0, ml: '15px' }}>
                <img
                  src={CLOSE_ICON}
                  onClick={() => hanldeRemoveRulesPaid(index)}
                />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
    );
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
              {isEdit
                ? `Chính sách - ${ComisstionPolicyDetail?.code}`
                : 'Tạo mới chính sách hoa hồng'}
            </Typography>
          </Box>
          <Stack flexDirection={'row'} alignItems={'center'}>
            {isEdit && (
              <Toogle
                selected={checkStatus}
                onChange={() => setcheckStatus(!checkStatus)}
                sxProps={{ mr: 3 }}
              />
            )}
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
          </Stack>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid
            item
            xs={12}
            sm={7.45}
            bgcolor={theme.palette.grey[0]}
            p={'15px 24px'}
            sx={{
              marginBottom: { xs: '24px', md: '0px' },
              borderRadius: '8px',
              marginTop: '16px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                color: palette.primary.button,
              }}
            >
              Thông tin chính sách
            </Typography>
            <Grid item xs={12} md={12} mt={2} sx={{ display: 'flex' }}>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="TVV-0245445"
                  label="Mã chính sách"
                  isRequired
                  disabled
                  name="code"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4} mx={2}>
                <TextFieldCustom
                  placeholder="Nhập tên chính sách"
                  label="Tên chính sách"
                  isRequired
                  name="name"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Chọn dự án"
                  label="Dự án"
                  isRequired
                  type="select"
                  options={listProject}
                  name="projectId"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex' }} mt={2}>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Chọn thời gian"
                  label="Thời gian bắt đầu"
                  isRequired
                  name="startDate"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4} mx={2}>
                <TextFieldCustom
                  label="Thời gian kết thúc"
                  placeholder="Chọn thời gian"
                  isRequired
                  name="endDate"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập số tiền"
                  label="Phí hỗ trợ"
                  type={'currency'}
                  endAdornment={'VNĐ'}
                  name="supportCost"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} mt={2} sx={{ display: 'flex' }}>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập số tiền"
                  label="Bonus giao dịch"
                  isRequired
                  type={'currency'}
                  name="hotTranfer"
                  control={control}
                  endAdornment={'VNĐ'}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4} mx={2}>
                <TextFieldCustom
                  placeholder="Nhập số tiền"
                  label="Bonus Booking"
                  type={'currency'}
                  name="hotBooking"
                  control={control}
                  endAdornment={'VNĐ'}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  label="Thuế TNCN"
                  placeholder="Nhập thuế TNCN"
                  name="tax"
                  isRequired
                  max={100}
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4.48}
            bgcolor={theme.palette.grey[0]}
            p={'15px 20px'}
            sx={{
              marginBottom: { xs: '24px', md: '0px' },
              borderRadius: '8px',
              marginTop: '16px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                color: palette.primary.button,
              }}
            >
              Thông tin hoa hồng
            </Typography>
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  color: palette.common.black,
                }}
              >
                Tổng hoa hồng
              </Typography>
              <Box>
                <TextFieldCustom
                  placeholder="Nhập số"
                  name="totalCommission"
                  control={control}
                  max={100}
                  onBlur={onchangeComisstionTotal}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  color: palette.common.black,
                }}
              >
                Hoa hồng NVKD
              </Typography>
              <Box>
                <TextFieldCustom
                  placeholder="Nhập số"
                  name="commissionStaff"
                  max={100}
                  onBlur={onchangeComisstionStaff}
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', mt: '15px' }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '14px',
                    color: palette.common.black,
                  }}
                >
                  Hoa hồng QLKD
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '12px',
                    color: palette.common.black,
                  }}
                >
                  [HHQL]
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldCustom
                  placeholder="Nhập số"
                  name="commissionManager"
                  max={100}
                  control={control}
                  onBlur={onBlurCommissionManager}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
                <Typography sx={{ fontSize: '14px', m: '0px 6px' }}>
                  X
                </Typography>
                <TextFieldCustom
                  name="commissionBenefit"
                  control={control}
                  disabled
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', mt: '15px' }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '14px',
                    color: palette.common.black,
                  }}
                >
                  Hoa hồng QLBO
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '12px',
                    color: palette.common.black,
                  }}
                >
                  [HHBO]
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldCustom
                  placeholder="Nhập số"
                  max={100}
                  name="commissionBO"
                  onBlur={onBlurCommissionBO}
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
                <Typography sx={{ fontSize: '14px', m: '0px 6px' }}>
                  X
                </Typography>
                <TextFieldCustom
                  name="commissionBenefit"
                  disabled
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item xs={4} sm={4}>
            <Grid
              item
              xs={12}
              sm={12}
              bgcolor={theme.palette.grey[0]}
              sx={{
                marginBottom: { xs: '24px', md: '0px' },
                borderRadius: '8px',
                marginTop: '8px',
                height: { sm: '320px' },
                border: isSaleValid ? '1px solid #D45B7A' : 'none',
              }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                p={'24px 24px 0px 24px'}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: palette.primary.button,
                      mr: '8px',
                    }}
                  >
                    Đơn vị bán hàng
                  </Typography>
                  {isSaleValid && (
                    <TooltipText
                      text={
                        'Tỉ lệ hoa hồng chia cho đơn vị bán hàng không trùng khớp.'
                      }
                      children={<img src={WARNING_ICON} />}
                    />
                  )}
                </Box>

                <Button
                  sx={{ p: '4px' }}
                  startIcon={<img src={PLUS_ICON} />}
                  onClick={handleOpenDialog}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '14px',
                      color: palette.primary.button,
                    }}
                  >
                    Thêm
                  </Typography>
                </Button>
              </Stack>
              <ItemComisstionSales
                dataList={listSalesUnits}
                type={CustomerType.SALES}
                handleOpen={handleEditSaleUnit}
                handleRemove={handleRemoveSales}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              bgcolor={theme.palette.grey[0]}
              sx={{
                marginBottom: { xs: '24px', md: '0px' },
                borderRadius: '8px',
                marginTop: '8px',
                height: { sm: '320px' },
                border: isDirectValid ? '1px solid #D45B7A' : 'none',
              }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                p={'24px 24px 0px 24px'}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: palette.primary.button,
                      mr: '8px',
                    }}
                  >
                    Đơn vị gián tiếp
                  </Typography>
                  {isDirectValid && (
                    <TooltipText
                      text={
                        'Tỉ lệ hoa hồng chia cho đơn vị bán hàng không trùng khớp.'
                      }
                      children={<img src={WARNING_ICON} />}
                    />
                  )}
                </Box>
                <Button
                  sx={{ p: '4px' }}
                  startIcon={<img src={PLUS_ICON} />}
                  onClick={handleOpenDialogIndirect}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '14px',
                      color: palette.primary.button,
                    }}
                  >
                    Thêm
                  </Typography>
                </Button>
              </Stack>
              <ItemComisstionSales
                dataList={listIndirectUnits}
                handleOpen={handleEditIndirectUnit}
                type={CustomerType.INDIRECT}
                handleRemove={handleRemoveIndirect}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={7.94}
            sm={7.94}
            bgcolor={theme.palette.grey[0]}
            p={'24px'}
            sx={{
              marginBottom: { xs: '24px', md: '0px' },
              borderRadius: '8px',
              marginTop: '8px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                color: palette.primary.button,
              }}
            >
              Điều kiện áp dụng
            </Typography>
            <Box sx={{ display: 'flex', mt: '22px', ml: '16px' }}>
              <IconButton sx={{ p: 0, display: 'none' }}>
                <img src={ADD_ICON} />
              </IconButton>
              <Box ml={'12px'}>
                <TextFieldCustom
                  placeholder="Nhập nội dung"
                  label="Điều kiện hưởng"
                  name="rulesbonus.name"
                  isRequired
                  control={control}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '200px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px',
                      },
                    },
                  }}
                />
              </Box>
              <Box m={'0px 8px'}>
                <TextFieldCustom
                  name="rulesbonus.sign"
                  options={listConditionInfluence}
                  control={control}
                  errors={errors}
                  type="select"
                  format="image"
                  max={100}
                  setError={setError}
                  sxProps={{ width: { md: '80px' } }}
                />
              </Box>
              <Box>
                <TextFieldCustom
                  name="rulesbonus.target"
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  max={100}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '90px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '44px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px',
                      },
                    },
                  }}
                />
              </Box>
              <img src={ARROW_RIGHT_ICON} style={{ margin: '0px 8px' }} />
              <Box>
                <TextFieldCustom
                  name="rulesbonus.result"
                  options={listInfluence}
                  control={control}
                  errors={errors}
                  type="select"
                  max={100}
                  setError={setError}
                  sxProps={{ width: { md: '130px' } }}
                />
              </Box>
            </Box>
            {renderRules()}
          </Grid>
        </Grid>
      </form>
      <ComissionUnit
        isOpenDialog={isOpenDialog}
        handleCloseDialog={handleCloseDialog}
        handleSubmitDialog={handleSubmitDialog}
        listOrgChart={listOrgChart}
        handleSelectedUnits={handleSelectedUnits}
        comissitonStaff={comissitonStaff}
        listStaff={listStaff}
        hanldeAddBeneficiary={hanldeAddBeneficiary}
        listBeneficiary={listBeneficiary}
        hanldeRemoveBeneficiary={hanldeRemoveBeneficiary}
        control={control}
        errors={errors}
        setError={setError}
        watch={watch}
        isEditUnit={isEditUnit}
      />
      <ComissionUnit
        isOpenDialog={isOpenDialogIndirect}
        handleCloseDialog={handleCloseDialogIndirect}
        handleSubmitDialog={handleSubmitDialogIndirect}
        listOrgChart={listOrgChart}
        handleSelectedUnits={handleSelectedUnits}
        comissitonStaff={comissitonBo}
        listStaff={listStaff}
        hanldeAddBeneficiary={hanldeAddRepresentative}
        listBeneficiary={listRepresentative}
        hanldeRemoveBeneficiary={hanldeRemoveRepresentative}
        control={control}
        errors={errors}
        setError={setError}
        watch={watch}
        isEditUnit={isEditUnit}
        isIndirect
      />
    </Box>
  );
}
