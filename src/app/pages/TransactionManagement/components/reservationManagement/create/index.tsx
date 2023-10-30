import { Box, Grid, Typography, useTheme } from '@mui/material';
import {
  Fragment,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

import BACK_ICON from 'assets/background/backleft-icon.svg';
import WARNING_ICON_MESSAGE from 'assets/background/warning-icon-message.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomButton from 'app/components/Button';
import palette from 'styles/theme/palette';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useProjectSlice } from 'app/pages/Projects/slice';
import { selectProject } from 'app/pages/Projects/slice/selector';
import { useProfile } from 'app/hooks';
import { useCustomerSlice } from 'app/pages/CustomerPotential/slice';
import { FilterParams } from 'types';
import { selectCustomer } from 'app/pages/CustomerPotential/slice/selector';
import { CustomerItem, ProjectCustomerType, Province } from 'types/User';
import { Gender, ProductTicketTypeEnum, TYPEIdentification } from 'types/Enum';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import {
  CustomerInReservation,
  PayloadGetListReservationApproved,
  StatusReservation,
} from 'types/Transaction';
import { ProjectTypeEnum } from 'types/Project';
import { selectStaff } from 'app/pages/Staff/slice/selector';
import { useStaffSlice } from 'app/pages/Staff/slice';
import moment from 'moment';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { default as documentService } from 'services/api/document';

import CoOwnerCustomer from '../../coOwnerCustomer';
import { LegalEntityInfo } from '../../legalEntityInfo';
import { AddressInfo } from '../../addressInfo';
import { PaymentInfo } from '../../paymentInfo';
import { OtherInfo } from '../../otherInfo';
import SelectSearch from '../../select-search';
import { BusinessInfo } from '../../businessInfo';
import { SubLegalEntityInfo } from '../../legalEntityInfo/SubLegalEntityInfo';
interface CreateReservationProps {
  isEdit?: boolean;
  isTable?: boolean;
  isCopy?: boolean;
  isPopup?: boolean;
  onClose?: (v?: boolean) => void;
  projectId?: string;
  handleCallbackData?: (data: any) => void;
}
interface StateLocationProps {
  typeCreate?: StatusReservation;
}

export function CreateReservation(props: CreateReservationProps) {
  const {
    isEdit,
    isCopy,
    isPopup,
    onClose,
    projectId,
    handleCallbackData,
    isTable,
  } = props;
  const theme = useTheme();
  const { id, reservationId } = useParams();
  const { state } = useLocation();
  const locationProps = state as StateLocationProps;
  //slice
  const { actions: projectActions } = useProjectSlice();
  const { actions: customerActions } = useCustomerSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useTransactionManagementSlice();
  // selector
  const { ProjectDetail } = useSelector(selectProject);
  // console.log(ProjectDetail, 'ProjectDetail')
  const { customerManager } = useSelector(selectCustomer);
  const { actions: staffActions } = useStaffSlice();
  const { staffManagement } = useSelector(selectStaff);
  const userInfo = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      staffActions.fetchListStaff({
        page: 1,
        limit: 10000,
        orgChartId: userInfo?.staff?.orgChart?.id || '',
      }),
    );
  }, [userInfo, staffActions]);

  const {
    bookingDetail,
    reservationApprovedManagement,
    isLoading,
    reservationManagement,
    listProductSale,
    ListStaffInProject,
  } = useSelector(selectTransactionManagement);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const FormControl = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      mainIdentifierTypeCustomer: TYPEIdentification.CITIZEN_IDENTIFICATION,
      listCoOwnerCustomer: [],
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    getValues,
    watch,
    reset,
  } = FormControl;
  const typeCustomerReservation = useMemo(
    () => [
      { id: 1, value: ProjectCustomerType.PERSONAL, key: 'Cá nhân' },
      { id: 2, value: ProjectCustomerType.BUSINESS, key: 'Doanh nghiệp' },
    ],
    [],
  );
  const genderOptions = useMemo(
    () => [
      { id: 0, value: Gender.MALE, key: 'Nam' },
      { id: 1, value: Gender.FEMALE, key: 'Nữ' },
    ],
    [],
  );
  const [listStaffProject, setListStaffProject] = useState<any[]>([]);
  const [listTicketApprove, setListTicketApprove] = useState<any[]>([]);
  const [listProductSaleArr, setListProductSaleArr] = useState<any[]>([]);
  const [listCountry, setListCountry] = useState<any[]>([]);

  const [productIdExist, setProductIdExist] = useState<boolean>(false);

  const hasProductId = watch('productId');

  const showStaffInChargeInfo = useMemo(() => {
    if (userInfo?.role == null) return false;
    return userInfo?.role?.permissions?.filter(e => e.key === 'ticket.support')
      ?.length;
  }, [userInfo?.role]);

  useEffect(() => {
    if (!checkPermissionExist(PermissionKeyEnum.TICKET_CREATE, userInfo) && !isPopup) {
      navigate(`/project/transaction-management/${id}`);
    }
  }, [userInfo, id, isPopup]);

  useEffect(() => {
    if (projectId) {
      const params: PayloadGetListReservationApproved = isPopup
        ? { projectId, limit: 1000, page: 1, isSignUp: true }
        : {
            projectId,
            limit: 1000,
            page: 1,
            isProduct: !!hasProductId
              ? ProductTicketTypeEnum.NO
              : ProductTicketTypeEnum.YES,
          };

      dispatch(actions.fetchListReservationApproved(params));
    }
  }, [projectId, isPopup, hasProductId]);

  useEffect(() => {
    if (id) {
      if (!isTable) {
        dispatch(projectActions.getDetailProject({ id }));
      }
      //

      dispatch(
        actions.fetchListProductSale({
          projectId: id,
          type: locationProps?.typeCreate,
        }),
      );

      if (showStaffInChargeInfo) {
        dispatch(actions.getListStaffInProject({ projectId: id }));
      }
    }

    return () => {
      if (!isTable) {
        dispatch(projectActions.clearDataProject());
      }
    };
  }, [projectActions, dispatch, id, isTable]);

  useEffect(() => {
    if (id) {
      if (locationProps?.typeCreate === StatusReservation.DEPOSIT) {
        const params: PayloadGetListReservationApproved = isPopup
          ? { projectId: id, limit: 1000, page: 1, isSignUp: true }
          : {
              projectId: id,
              limit: 1000,
              page: 1,
              isProduct: !!hasProductId
                ? ProductTicketTypeEnum.NO
                : ProductTicketTypeEnum.YES,
            };
        dispatch(actions.fetchListReservationApproved(params));
      }
    }
  }, [id, isPopup, hasProductId]);

  useEffect(() => {
    if (hasProductId) {
      setProductIdExist(true);
    }
  }, []);

  useEffect(() => {
    dispatch(
      customerActions.fetchListCustomerInTicket({
        page: 1,
        limit: 1000,
        fields: ['code'],
      }),
    );
    setValue('customerMainGender', Gender.MALE);
    setValue('typeMainCustomer', ProjectCustomerType.PERSONAL);
  }, []);

  useEffect(() => {
    const listStaffConvert: SetStateAction<any[]> = [];
    if (staffManagement?.data?.length) {
      staffManagement?.data?.forEach(e => {
        listStaffConvert.push({
          id: e.code,
          label: `${e.code} - ${e.email}`,
          code: e.code,
          staffId: e.id,
          fullName: e?.fullName,
        });
      });
    }
    // if (ListStaffInProject?.data?.length) {
    //   ListStaffInProject?.data?.forEach(e => {
    //     listStaffConvert.push({
    //       id: e.code,
    //       label: `${e.code} - ${e.email}`,
    //       code: e.code,
    //       staffId: e.id,
    //       fullName: e?.fullName,
    //     });
    //   });
    // }

    setListStaffProject(listStaffConvert);
  }, [ListStaffInProject, isPopup, staffManagement]);

  useEffect(() => {
    const listTicketConvert: SetStateAction<any[]> = [];
    if (reservationApprovedManagement?.data?.length) {
      reservationApprovedManagement?.data.map(e => {
        listTicketConvert.push({
          id: e.id,
          code: e.id,
          key: e.code,
          ticketId: e.id,
        });
      });
    }
    setListTicketApprove(listTicketConvert);
  }, [reservationApprovedManagement, reservationManagement, isPopup]);

  useEffect(() => {
    const listProductSaleTemp: SetStateAction<any[]> = [];
    if (listProductSale?.data?.length) {
      listProductSale?.data.map(e => {
        listProductSaleTemp.push({
          id: e?.id,
          code: e?.code,
          key: e?.code,
          productId: e?.id,
        });
      });
    }
    setListProductSaleArr(listProductSaleTemp);
  }, [listProductSale]);

  useEffect(() => {
    if (
      isEdit &&
      locationProps?.typeCreate === StatusReservation.DEPOSIT &&
      bookingDetail?.id &&
      listTicketApprove.length
    ) {
      const optionSelectTicketApprove = listTicketApprove.filter(
        e => e.id === bookingDetail?.id,
      );
      if (optionSelectTicketApprove?.length) {
        setValue('ticketCode', optionSelectTicketApprove?.[0]?.code);
      }
    }
  }, [bookingDetail?.id, isEdit, listTicketApprove, locationProps?.typeCreate]);

  const getCountry = async () => {
    const data = await documentService.getCountry();
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListCountry(newData);
  };

  useEffect(() => {
    getCountry();
    setValue('nationality', 'Vietnam');
  }, []);

  useEffect(() => {
    if ((isEdit || isCopy) && bookingDetail) {
      const mainCustomerObject = bookingDetail?.customers?.filter(
        (customer: CustomerInReservation) => customer?.mainCustomer != null,
      );
      const arrCoOwnerCustomerObject: Partial<CustomerItem>[] = [];
      const listCoOwnerCustomerObject = bookingDetail?.customers?.filter(
        (customer: CustomerInReservation) => customer?.subCustomer != null,
      );
      if (listCoOwnerCustomerObject?.length) {
        listCoOwnerCustomerObject?.forEach(e => {
          const { typeIdentification, ...rest } = e.subCustomer;

          arrCoOwnerCustomerObject.push({
            ...rest,
            subCustomerId: rest.id,
            identifierType: typeIdentification,
          });
        });
      }
      setValue('note', bookingDetail?.note || '');
      setValue('tax', bookingDetail?.tax || '');
      setValue('payments', bookingDetail?.payments || '');
      setValue('paymentMethod', bookingDetail?.paymentMethod || '');
      setValue('bank', bookingDetail?.bank || '');
      setValue('accountNumber', bookingDetail?.accountNumber || '');
      setValue('bankLoanNeeds', bookingDetail?.bankLoanNeeds ? 1 : 0);
      setValue('otherProjects', bookingDetail?.otherProjects ? 1 : 0);
      // staff
      setValue('staffCode', bookingDetail?.staff?.code);
      setValue('staffName', bookingDetail?.staff?.fullName);
      setValue('staffId', bookingDetail?.staff?.id);
      //main customer
      setValue('mainCustomerId', mainCustomerObject?.[0]?.mainCustomer?.id);
      setValue('mainCustomerCode', mainCustomerObject?.[0]?.mainCustomer?.code);
      setValue('customerMainName', mainCustomerObject?.[0]?.mainCustomer?.name);
      setValue('typeMainCustomer', mainCustomerObject?.[0]?.mainCustomer?.type);
      setValue(
        'customerMainGender',
        mainCustomerObject?.[0]?.mainCustomer?.gender,
      );
      setValue(
        'customerMainDate',
        mainCustomerObject?.[0]?.mainCustomer?.birth,
      );
      setValue(
        'customerMainEmail',
        mainCustomerObject?.[0]?.mainCustomer?.email,
      );
      setValue(
        'customerMainphone',
        mainCustomerObject?.[0]?.mainCustomer?.phoneNumber,
      );
      setValue(
        'mainIdentifierTypeCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.typeIdentification,
      );
      setValue(
        'mainIdentityNumberCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.identityNumber,
      );
      setValue(
        'mainDateRangCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.dateRange,
      );
      setValue(
        'mainIssuedByCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.issuedBy,
      );
      setValue('mainProvince', mainCustomerObject?.[0]?.mainCustomer?.province);
      setValue('mainDistrict', mainCustomerObject?.[0]?.mainCustomer?.district);
      setValue('mainWard', mainCustomerObject?.[0]?.mainCustomer?.ward);
      setValue('mainStreet', mainCustomerObject?.[0]?.mainCustomer?.street);

      setValue(
        'mainProvinceBorn',
        mainCustomerObject?.[0]?.mainCustomer?.provinceBorn,
      );
      setValue(
        'mainDistrictBorn',
        mainCustomerObject?.[0]?.mainCustomer?.districtBorn,
      );
      setValue('mainWardBorn', mainCustomerObject?.[0]?.mainCustomer?.wardBorn);
      setValue(
        'mainStreetBorn',
        mainCustomerObject?.[0]?.mainCustomer?.streetBorn,
      );
      setValue(
        'nationality',
        mainCustomerObject?.[0]?.mainCustomer?.nationality,
      );
      //company
      setValue(
        'companyName',
        mainCustomerObject?.[0]?.mainCustomer?.companyName,
      );
      setValue(
        'companyCode',
        mainCustomerObject?.[0]?.mainCustomer?.companyCode,
      );
      setValue(
        'companyDateRange',
        mainCustomerObject?.[0]?.mainCustomer?.companyDateRange,
      );
      setValue(
        'companyIssuedBy',
        mainCustomerObject?.[0]?.mainCustomer?.companyIssuedBy,
      );
      setValue('position', mainCustomerObject?.[0]?.mainCustomer?.position);
      //list coOwner customer
      setValue(
        'listCoOwnerCustomer',
        arrCoOwnerCustomerObject?.length ? arrCoOwnerCustomerObject : [],
      );

      // setValue(
      //   'files',
      //   bookingDetail?.files?.length
      //     ? bookingDetail?.files.map(e => e?.id)
      //     : [],
      // );
      setValue('ticketId', bookingDetail?.id);
      setValue('ticketCode', bookingDetail?.code);
      setValue('productId', bookingDetail?.productId);
    }
  }, [isEdit, bookingDetail, locationProps?.typeCreate]);

  const submit = (data: any) => {
    const mainCustomerPayload = {
      id: data?.mainCustomerId ?? '',
      code: data?.mainCustomerCode,
      name: data?.customerMainName,
      gender: data?.customerMainGender,
      birth: moment(data?.customerMainDate).format('YYYY-MM-DD'),
      email: data?.customerMainEmail,
      phoneNumber: data?.customerMainphone,
      typeIdentification: data?.mainIdentifierTypeCustomer,
      identityNumber: data?.mainIdentityNumberCustomer,
      dateRange: moment(data?.mainDateRangCustomer).format('YYYY-MM-DD'),
      issuedBy: data?.mainIssuedByCustomer,
      nationality: data?.nationality,
      province: data?.mainProvince,
      district: data?.mainDistrict,
      ward: data?.mainWard,
      street: data?.mainStreet,
      provinceBorn: data?.mainProvinceBorn,
      districtBorn: data?.mainDistrictBorn,
      wardBorn: data?.mainWardBorn,
      streetBorn: data?.mainStreetBorn,
      type: data?.typeMainCustomer,
      isMainCustomer: true,
    };
    if (isPopup && !mainCustomerPayload.id) {
      delete mainCustomerPayload.id;
    }
    const subCustomer: any[] = [];
    if (data?.listCoOwnerCustomer?.length) {
      data?.listCoOwnerCustomer.forEach((e: any) => {
        const { subCustomerId, identifierType, ...rest } = e;
        subCustomer.push({
          ...rest,
          id: subCustomerId,
          isMainCustomer: false,
          typeIdentification: identifierType,
        });
      });
    }
    const infoCustomerBusiness = {
      companyName: data?.companyName,
      companyCode: data?.companyCode,
      companyDateRange: data?.companyDateRange,
      companyIssuedBy: data?.companyIssuedBy,
      position: data?.position,
    };
    const mainCustomerFinalPayload =
      data?.typeMainCustomer === ProjectCustomerType.BUSINESS
        ? { ...mainCustomerPayload, ...infoCustomerBusiness }
        : mainCustomerPayload;

    const payload = {
      projectId: id,
      staffId: data?.staffId,
      note: data?.note,
      tax: data?.tax,
      payments: data?.payments,
      paymentMethod: data?.paymentMethod,
      bank: data?.bank,
      accountNumber: data?.accountNumber,
      bankLoanNeeds: data?.bankLoanNeeds
        ? !!Number(data?.bankLoanNeeds)
        : false,
      otherProjects: data?.otherProjects
        ? !!Number(data?.otherProjects)
        : false,
      // mainCustomerCode: data?.mainCustomerCode,
      listCustomers: [...subCustomer, mainCustomerFinalPayload],
      status: locationProps?.typeCreate ?? '',
      files: data?.files ?? [],
      ticketId: data?.ticketId,
      productId: data?.productId,
    };
    let titleApi = '';
    if (locationProps?.typeCreate === StatusReservation.RESERVATION) {
      titleApi = 'đặt chỗ';
    } else if (locationProps?.typeCreate === StatusReservation.DEPOSIT) {
      titleApi = 'đặt cọc';
    }
    if (isPopup && handleCallbackData) {
      handleCallbackData(payload);
    } else {
      if (!isEdit || isCopy) {
        if (
          !payload.productId &&
          !payload.ticketId &&
          locationProps?.typeCreate === StatusReservation.DEPOSIT
        ) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: `Mã sản phẩm hoặc mã phiếu không được để trống`,
              type: 'error',
            }),
          );
          return;
        }
        dispatch(
          actions.createTicketReservation(payload, (err?: any) => {
            if (err?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: `Tạo phiếu ${titleApi} thành công`,
                  type: 'success',
                }),
              );
              handleCancel();
            } else {
              let message = err?.response?.data?.message;
              if (err?.code === 500) {
                message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
              }
              dispatch(
                snackbarActions.updateSnackbar({
                  message: message || `Tạo phiếu ${titleApi} không thành công`,
                  type: 'error',
                }),
              );
            }
          }),
        );
      } else {
        if (reservationId) {
          const newPayload = {
            id: reservationId,
            payload,
          };
          if (
            !payload.productId &&
            !payload.ticketId &&
            locationProps?.typeCreate === StatusReservation.DEPOSIT
          ) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: `Mã sản phẩm hoặc mã phiếu không được để trống`,
                type: 'error',
              }),
            );
            return;
          }
          dispatch(
            actions.updateTicketReservation(newPayload, (err?: any) => {
              if (err?.success) {
                dispatch(
                  snackbarActions.updateSnackbar({
                    message: `Cập nhật phiếu ${titleApi} thành công`,
                    type: 'success',
                  }),
                );
                handleCancel();
              } else {
                let message = err?.response?.data?.message;
                if (err?.code === 500) {
                  message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
                }
                dispatch(
                  snackbarActions.updateSnackbar({
                    message:
                      message || `Cập nhật phiếu ${titleApi} không thành công`,
                    type: 'error',
                  }),
                );
              }
            }),
          );
        }
      }
    }
  };

  const onError = () => {};

  const handleCancel = () => {
    let activeTab = 0;
    if (locationProps?.typeCreate === StatusReservation.RESERVATION) {
      activeTab = 1;
    } else if (locationProps?.typeCreate === StatusReservation.DEPOSIT) {
      activeTab = 2;
    }
    navigate(`/project/transaction-management/${id}`, {
      state: {
        tabActive: activeTab,
      },
    });
  };

  const handleSelectedStaff = (staff: any) => {
    setValue('staffCode', staff?.code);
    setValue('staffId', staff?.staffId || staff?.id);
    setValue('staffName', staff?.fullName);
  };

  const handleDeletedStaff = () => {
    setValue('staffCode', '');
    setValue('staffId', '');
    setValue('staffName', '');
    const params: FilterParams = {
      page: 1,
      limit: 10000,
      orgChartId: userInfo?.staff?.orgChart?.id || '',
      search: '',
    };
    dispatch(staffActions.fetchListStaff(params));
  };

  const handleSelectedProduct = (product: any) => {
    if (getValues('ticketCode') && !productIdExist) {
      handleDeleteTicketCode();
    }
    setProductIdExist(true);
    setValue('productId', product);
  };

  const handleSelectedCustomer = (customer: CustomerItem | any) => {
    if (customer) {
      setValue('mainCustomerId', customer.id);
      setValue('mainCustomerCode', customer.code);
      setValue('customerMainName', customer.name);
      setValue('typeMainCustomer', customer.type);
      setValue('customerMainGender', customer.gender);
      setValue('customerMainDate', customer.birth);
      setValue('customerMainEmail', customer.email);
      setValue('customerMainphone', customer.phoneNumber);
      setValue('mainIdentifierTypeCustomer', customer.typeIdentification);
      setValue('mainIdentityNumberCustomer', customer.identityNumber);
      setValue('mainDateRangCustomer', customer.dateRange);
      setValue('mainIssuedByCustomer', customer.issuedBy);
      setValue('mainProvince', customer.province);
      setValue('mainDistrict', customer.district);
      setValue('mainWard', customer.ward);
      setValue('mainStreet', customer.street);
      setValue('mainProvinceBorn', customer.provinceBorn);
      setValue('mainDistrictBorn', customer.districtBorn);
      setValue('mainWardBorn', customer.wardBorn);
      setValue('mainStreetBorn', customer.streetBorn);
      if (customer.type === ProjectCustomerType.BUSINESS) {
        setValue('companyName', customer.companyName);
        setValue('companyCode', customer.companyCode);
        setValue('companyDateRange', customer.companyDateRange);
        setValue('companyIssuedBy', customer.companyIssuedBy);
        setValue('position', customer.position);
      }
    }
  };
  const handleDeletedCustomer = () => {
    dispatch(customerActions.resetCustomerList());
    setValue('mainCustomerId', '');
    setValue('mainCustomerCode', '');
    setValue('customerMainName', '');
    setValue('typeMainCustomer', ProjectCustomerType.PERSONAL);
    setValue('customerMainGender', Gender.MALE);
    setValue('customerMainDate', '');
    setValue('customerMainEmail', '');
    setValue('customerMainphone', '');
    setValue(
      'mainIdentifierTypeCustomer',
      TYPEIdentification.CITIZEN_IDENTIFICATION,
    );
    setValue('mainIdentityNumberCustomer', '');
    setValue('mainDateRangCustomer', '');
    setValue('mainIssuedByCustomer', '');
    setValue('mainProvince', '');
    setValue('mainDistrict', '');
    setValue('mainWard', '');
    setValue('mainStreet', '');
    setValue('mainProvinceBorn', '');
    setValue('mainDistrictBorn', '');
    setValue('mainWardBorn', '');
    setValue('mainStreetBorn', '');
    setValue('companyName', '');
    setValue('companyCode', '');
    setValue('companyDateRange', '');
    setValue('companyIssuedBy', '');
    setValue('position', '');
    const params: FilterParams = {
      page: 1,
      limit: 50,
      fields: ['name', 'phoneNumber', 'code'],
      search: '',
    };
    dispatch(customerActions.fetchListCustomer(params));
  };
  const handleSearchingCustomer = (value: string) => {
    setValue('mainCustomerCode', value);
    const params: FilterParams = {
      page: 1,
      limit: 50,
      fields: ['name', 'phoneNumber', 'code'],
      search: value,
    };
    dispatch(customerActions.fetchListCustomer(params));
  };

  const handleSeachingStaff = (value: string) => {
    setValue('staffCode', value);
    const params: FilterParams = {
      page: 1,
      limit: 10000,
      orgChartId: userInfo?.staff?.orgChart?.id || '',
      search: value,
    };
    dispatch(staffActions.fetchListStaff(params));
  };

  const handleSearchingTicketApprove = (value: string) => {
    setValue('ticketCode', value);
    if (id) {
      const params: FilterParams = {
        projectId: id,
        limit: 1000,
        page: 1,
        isSignUp: true,
        search: value,
      };
      dispatch(actions.fetchListReservationApproved(params));
    }
  };

  const handleDeleteTicketCode = () => {
    setValue('ticketCode', '');

    setValue('note', '');
    setValue('tax', '');
    setValue('payments', '');
    setValue('paymentMethod', '');
    setValue('bank', '');
    setValue('accountNumber', '');
    setValue('bankLoanNeeds', 0);
    setValue('otherProjects', 0);
    // staff
    setValue('staffCode', '');
    setValue('staffName', '');
    setValue('staffId', '');
    //main customer
    handleDeletedCustomer();
    // setValue('mainCustomerId', '');
    // setValue('mainCustomerCode', '');
    // setValue('customerMainName', '');
    // setValue('typeMainCustomer', ProjectCustomerType.PERSONAL);
    // setValue('customerMainGender', Gender.MALE);
    // setValue('customerMainDate', '');
    // setValue('customerMainEmail', '');
    // setValue('customerMainphone', '');
    // setValue(
    //   'mainIdentifierTypeCustomer',
    //   TYPEIdentification.CITIZEN_IDENTIFICATION,
    // );
    // setValue('mainIdentityNumberCustomer', '');
    // setValue('mainDateRangCustomer', '');
    // setValue('mainIssuedByCustomer', '');
    // setValue('mainProvince', '');
    // setValue('mainDistrict', '');
    // setValue('mainWard', '');
    // setValue('mainStreet', '');
    //company
    setValue('companyName', '');
    setValue('companyCode', '');
    setValue('companyDateRange', '');
    setValue('companyIssuedBy', '');
    setValue('position', '');
    //list coOwner customer
    setValue('listCoOwnerCustomer', []);
  };
  const handleSelectedTicketCode = (ticket: any) => {
    setValue('ticketId', ticket);
    const infoTicket = reservationApprovedManagement?.data?.find(
      e => e.id === ticket,
    );
    if (infoTicket) {
      const mainCustomerObject = infoTicket?.customers?.filter(
        (customer: CustomerInReservation) => customer?.mainCustomer != null,
      );
      const arrCoOwnerCustomerObject: CustomerItem[] = [];
      const listCoOwnerCustomerObject = infoTicket?.customers?.filter(
        (customer: CustomerInReservation) => customer?.subCustomer != null,
      );
      if (listCoOwnerCustomerObject?.length) {
        listCoOwnerCustomerObject?.forEach(e =>
          arrCoOwnerCustomerObject.push({
            ...e.subCustomer,
            subCustomerId: e.subCustomer.id,
          }),
        );
      }
      setValue('note', infoTicket?.note || '');
      setValue('tax', infoTicket?.tax || '');
      setValue('payments', infoTicket?.payments || '');
      setValue('paymentMethod', infoTicket?.paymentMethod || '');
      setValue('bank', infoTicket?.bank || '');
      setValue('accountNumber', infoTicket?.accountNumber || '');
      setValue('bankLoanNeeds', infoTicket?.bankLoanNeeds ? 1 : 0);
      setValue('otherProjects', infoTicket?.otherProjects ? 1 : 0);
      // staff
      setValue('staffCode', infoTicket?.staff?.code);
      setValue('staffName', infoTicket?.staff?.fullName);
      setValue('staffId', infoTicket?.staff?.id);
      //main customer
      setValue('mainCustomerId', mainCustomerObject?.[0]?.mainCustomer?.id);
      setValue('mainCustomerCode', mainCustomerObject?.[0]?.mainCustomer?.code);
      setValue('customerMainName', mainCustomerObject?.[0]?.mainCustomer?.name);
      setValue('typeMainCustomer', mainCustomerObject?.[0]?.mainCustomer?.type);

      setValue(
        'customerMainGender',
        mainCustomerObject?.[0]?.mainCustomer?.gender,
      );
      setValue(
        'customerMainDate',
        mainCustomerObject?.[0]?.mainCustomer?.birth,
      );
      setValue(
        'customerMainEmail',
        mainCustomerObject?.[0]?.mainCustomer?.email,
      );
      setValue(
        'customerMainphone',
        mainCustomerObject?.[0]?.mainCustomer?.phoneNumber,
      );
      setValue(
        'mainIdentifierTypeCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.typeIdentification,
      );
      setValue(
        'mainIdentityNumberCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.identityNumber,
      );
      setValue(
        'mainDateRangCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.dateRange,
      );
      setValue(
        'mainIssuedByCustomer',
        mainCustomerObject?.[0]?.mainCustomer?.issuedBy,
      );
      setValue('mainProvince', mainCustomerObject?.[0]?.mainCustomer?.province);
      setValue('mainDistrict', mainCustomerObject?.[0]?.mainCustomer?.district);
      setValue('mainWard', mainCustomerObject?.[0]?.mainCustomer?.ward);
      setValue('mainStreet', mainCustomerObject?.[0]?.mainCustomer?.street);

      //main customer born
      setValue(
        'mainProvinceBorn',
        mainCustomerObject?.[0]?.mainCustomer?.provinceBorn,
      );
      setValue(
        'mainDistrictBorn',
        mainCustomerObject?.[0]?.mainCustomer?.districtBorn,
      );
      setValue('mainWardBorn', mainCustomerObject?.[0]?.mainCustomer?.wardBorn);
      setValue(
        'mainStreetBorn',
        mainCustomerObject?.[0]?.mainCustomer?.streetBorn,
      );
      setValue(
        'nationality',
        mainCustomerObject?.[0]?.mainCustomer?.nationality,
      );
      //company
      setValue(
        'companyName',
        mainCustomerObject?.[0]?.mainCustomer?.companyName,
      );
      setValue(
        'companyCode',
        mainCustomerObject?.[0]?.mainCustomer?.companyCode,
      );
      setValue(
        'companyDateRange',
        mainCustomerObject?.[0]?.mainCustomer?.companyDateRange,
      );
      setValue(
        'companyIssuedBy',
        mainCustomerObject?.[0]?.mainCustomer?.companyIssuedBy,
      );
      setValue('position', mainCustomerObject?.[0]?.mainCustomer?.position);
      //list coOwner customer
      setValue(
        'listCoOwnerCustomer',
        arrCoOwnerCustomerObject?.length ? arrCoOwnerCustomerObject : [],
      );
    }
  };

  const renderProjectInfo = () => {
    let typeProject = '';
    switch (ProjectDetail?.type) {
      case ProjectTypeEnum.APARTMENT:
        typeProject = 'Căn hộ';
        break;
      case ProjectTypeEnum.GROUND:
        typeProject = 'Đất nền';
        break;
      case ProjectTypeEnum.VILLA:
        typeProject = 'Biệt thự';
        break;
      case ProjectTypeEnum.RESORT:
        typeProject = 'Khu nghỉ dưỡng/ Khu phức hợp';
        break;
      case ProjectTypeEnum.SHOP_HOUSE:
        typeProject = 'Shophouse/ Nhà phố';
        break;
      case ProjectTypeEnum.COMMERCIAL_AREA:
        typeProject = 'Khu đô thị thương mại';
        break;
      default:
        typeProject = '-';
        break;
    }

    let address = '';
    if (ProjectDetail?.address) {
      address += `${ProjectDetail?.address}, `;
    }
    if (ProjectDetail?.ward) {
      address += `${ProjectDetail?.ward}, `;
    }
    if (ProjectDetail?.district) {
      address += `${ProjectDetail?.district}, `;
    }
    if (ProjectDetail?.province) {
      address += `${ProjectDetail?.province}`;
    }
    return (
      <Grid item md={12} mt={2}>
        {!isPopup && (
          <Box sx={{ width: '100%' }}>
            <Typography
              fontWeight={700}
              fontSize={'16px'}
              color={palette.primary.darkRed}
            >
              {'Thông tin dự án'}
            </Typography>
          </Box>
        )}
        {!isPopup && (
          <Grid
            item
            sx={{
              p: '16px 22px',
              mt: '12px',
              background: palette.background.lighter,
              color: theme.palette.common.white,
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter',
              borderRadius: '8px',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Grid item xs={1} sx={{ minWidth: '100px' }}>
                Tên dự án:
              </Grid>
              <Grid item xs={10} sx={{ fontSize: '16px', fontWeight: 700 }}>
                {ProjectDetail?.name}
              </Grid>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Grid item xs={1} sx={{ minWidth: '100px' }}>
                Địa chỉ:
              </Grid>
              <Grid item xs={10} sx={{ fontSize: '16px', fontWeight: 700 }}>
                {address}
              </Grid>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Grid item xs={1} sx={{ minWidth: '100px' }}>
                Loại dự án:
              </Grid>
              <Grid item xs={10} sx={{ fontSize: '16px', fontWeight: 700 }}>
                {typeProject}
              </Grid>
            </Box>
          </Grid>
        )}
        {!isPopup && (
          <Grid
            item
            md={8}
            mt={4}
            sx={{ '& .MuiInputBase-root': { width: '100%' } }}
          >
            <TextFieldCustom
              placeholder="Chọn mã sản phẩm"
              label="Mã sản phẩm"
              name="productId"
              // isRequired
              type="select"
              options={listProductSaleArr}
              control={control}
              errors={errors}
              handleDeleted={() => {
                setValue('productId', null);
                handleDeleteTicketCode();
                setProductIdExist(false);
              }}
              onChange={handleSelectedProduct}
              setError={setError}
            />
          </Grid>
        )}
      </Grid>
    );
  };
  const renderStaffInChargeInfo = () => {
    if (isPopup) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography
              fontWeight={700}
              fontSize={'16px'}
              color={palette.primary.darkRed}
            >
              {'Thông tin nhân viên phụ trách'}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Box sx={{ width: '100%', position: ' relative' }}>
              <SelectSearch
                placeholder="Nhập hoặc tìm mã nhân viên"
                label="Mã nhân viên"
                control={control}
                errors={errors}
                // isRequired
                name="staffCode"
                options={staffManagement?.data}
                handleSelected={handleSelectedStaff}
                onChange={handleSeachingStaff}
                handleDeleted={handleDeletedStaff}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextFieldCustom
              placeholder="Nhập tên nhân viên"
              label="Tên nhân viên"
              name="staffName"
              type="text"
              control={control}
              errors={errors}
              setError={setError}
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container md={8} mt={'24px'}>
        <Typography
          fontWeight={700}
          fontSize={'16px'}
          color={palette.primary.darkRed}
        >
          {'Thông tin nhân viên phụ trách'}
        </Typography>
        <Grid container mt={0} spacing={2}>
          <Grid item xs={6} md={6}>
            <TextFieldCustom
              placeholder="Nhập hoặc tìm mã nhân viên"
              label="Mã nhân viên"
              name="staffCode"
              type="selectsearch"
              isRequired
              optionAutoComplete={listStaffProject}
              control={control}
              errors={errors}
              setError={setError}
              handleSelected={handleSelectedStaff}
              handleDeleted={handleDeletedStaff}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextFieldCustom
              placeholder="Nhập tên nhân viên"
              label="Tên nhân viên"
              name="staffName"
              type="text"
              control={control}
              errors={errors}
              setError={setError}
              disabled
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderCustomerInfo = () => {
    if (isPopup) {
      return (
        <Grid container mt={2} sx={{ position: 'relative' }}>
          <Typography
            fontWeight={700}
            fontSize={'16px'}
            color={palette.primary.darkRed}
          >
            {'Thông tin khách hàng'}
          </Typography>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={6} md={6}>
              <TextFieldCustom
                placeholder="Nhập hoặc chọn mã phiếu đặt chỗ"
                label="Mã phiếu đặt chỗ (nếu có)"
                type="select"
                options={listTicketApprove}
                name="ticketCode"
                control={control}
                errors={errors}
                handleDeleted={handleDeleteTicketCode}
                setError={setError}
                onChange={handleSelectedTicketCode}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <SelectSearch
                placeholder="Nhập hoặc tìm mã khách hàng"
                label="Mã khách hàng (nếu có)"
                control={control}
                errors={errors}
                // isRequired
                name="mainCustomerCode"
                options={customerManager?.data}
                handleSelected={handleSelectedCustomer}
                onChange={handleSearchingCustomer}
                handleDeleted={handleDeletedCustomer}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextFieldCustom
                placeholder="Nhập tên khách hàng"
                label={
                  watch('typeMainCustomer') === ProjectCustomerType.BUSINESS
                    ? 'Người đại diện'
                    : 'Tên khách hàng'
                }
                type="upper"
                isRequired
                name="customerMainName"
                // type="text"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TextFieldCustom
                name="customerMainGender"
                type="radio"
                isRequired={
                  watch('typeMainCustomer') === ProjectCustomerType.PERSONAL
                }
                options={genderOptions}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextFieldCustom
                placeholder="Chọn ngày sinh"
                label="Ngày sinh"
                name="customerMainDate"
                isRequired
                isHiddenFeatureDay
                type="date"
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{ marginTop: 0 }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextFieldCustom
                placeholder="Nhập địa chỉ Email"
                label="Địa chỉ Email"
                name="customerMainEmail"
                isRequired
                type="text"
                control={control}
                errors={errors}
                setError={setError}
                format="email"
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextFieldCustom
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                name="customerMainphone"
                type="text"
                format="phone"
                isRequired
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          </Grid>
          <Grid container>
            <SubLegalEntityInfo
              formControl={FormControl}
              fieldNameObject={{
                identifierType: 'mainIdentifierTypeCustomer',
                identityNumber: 'mainIdentityNumberCustomer',
                dateRange: 'mainDateRangCustomer',
                issuedBy: 'mainIssuedByCustomer',
              }}
            />
          </Grid>
          <Grid container>
            {watch('typeMainCustomer') === ProjectCustomerType.BUSINESS ? (
              <BusinessInfo formControl={FormControl} />
            ) : (
              <AddressInfo
                formControl={FormControl}
                fieldNameObject={{
                  province: 'mainProvince',
                  district: 'mainDistrict',
                  ward: 'mainWard',
                  street: 'mainStreet',
                  provinceBorn: 'mainProvinceBorn',
                  districtBorn: 'mainDistrictBorn',
                  wardBorn: 'mainWardBorn',
                  streetBorn: 'mainStreetBorn',
                }}
              />
            )}
          </Grid>
          <Grid container>
            <PaymentInfo formControl={FormControl} />
          </Grid>
          <Grid container>
            <CoOwnerCustomer
              formControl={FormControl}
              isEdit={isEdit || isCopy || false}
            />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container mt={2}>
        <Typography
          fontWeight={700}
          fontSize={'16px'}
          color={palette.primary.darkRed}
        >
          {'Thông tin khách hàng'}
        </Typography>
        <Grid container spacing={2} mt={0}>
          {locationProps?.typeCreate === StatusReservation.DEPOSIT && (
            <Grid item xs={4} md={4}>
              {isEdit ? (
                <TextFieldCustom
                  label="Mã giữ chỗ (nếu có)"
                  type="text"
                  name="ticketCode"
                  control={control}
                  errors={errors}
                  disabled
                  // handleDeleted={handleDeleteTicketCode}
                  // setError={setError}
                  // onChange={handleSelectedTicketCode}
                />
              ) : (
                <TextFieldCustom
                  placeholder="Chọn mã giữ chỗ"
                  label="Mã giữ chỗ (nếu có)"
                  type="select"
                  options={listTicketApprove}
                  name="ticketCode"
                  control={control}
                  errors={errors}
                  handleDeleted={handleDeleteTicketCode}
                  setError={setError}
                  onChange={handleSelectedTicketCode}
                />
              )}
            </Grid>
          )}
          <Grid item xs={4} md={4}>
            <SelectSearch
              placeholder="Nhập hoặc tìm mã khách hàng"
              label="Mã khách hàng (nếu có)"
              control={control}
              errors={errors}
              // isRequired
              name="mainCustomerCode"
              options={customerManager?.data}
              handleSelected={handleSelectedCustomer}
              onChange={handleSearchingCustomer}
              handleDeleted={handleDeletedCustomer}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn loại khách hàng"
              label="Loại khách hàng"
              isRequired
              name="typeMainCustomer"
              type="select"
              options={typeCustomerReservation}
              control={control}
              errors={errors}
              handleDeleted={() => {
                setValue('typeMainCustomer', '');
              }}
              setError={setError}
            />
          </Grid>
          {locationProps?.typeCreate !== StatusReservation.DEPOSIT && (
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Nhập tên khách hàng"
                label={
                  watch('typeMainCustomer') === ProjectCustomerType.BUSINESS
                    ? 'Người đại diện'
                    : 'Tên khách hàng'
                }
                type="upper"
                isRequired
                name="customerMainName"
                // type="text"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          )}
        </Grid>
        <Grid container mt={0} spacing={2}>
          {locationProps?.typeCreate === StatusReservation.DEPOSIT && (
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Nhập tên khách hàng"
                label={
                  watch('typeMainCustomer') === ProjectCustomerType.BUSINESS
                    ? 'Người đại diện'
                    : 'Tên khách hàng'
                }
                type="upper"
                isRequired
                name="customerMainName"
                // type="text"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          )}
          {watch('typeMainCustomer') === ProjectCustomerType.PERSONAL && (
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Chọn quốc tịch"
                label="Quốc tịch"
                isRequired
                name="nationality"
                type="select"
                options={listCountry}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          )}
          {watch('typeMainCustomer') === ProjectCustomerType.BUSINESS && (
            <Grid item xs={4} md={4}>
              <TextFieldCustom
                placeholder="Nhập chức vụ"
                label="Chức vụ"
                isRequired
                name="position"
                type="text"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          )}
          {watch('typeMainCustomer') === ProjectCustomerType.PERSONAL && (
            <Grid
              item
              xs={4}
              md={4}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TextFieldCustom
                name="customerMainGender"
                type="radio"
                isRequired={
                  watch('typeMainCustomer') === ProjectCustomerType.PERSONAL
                }
                options={genderOptions}
                control={control}
                errors={errors}
                setError={setError}
              />
            </Grid>
          )}
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn ngày sinh"
              label="Ngày sinh"
              name="customerMainDate"
              isHiddenFeatureDay
              isRequired
              type="date"
              control={control}
              errors={errors}
              setError={setError}
              sxProps={{ marginTop: 0 }}
            />
          </Grid>
          {locationProps?.typeCreate !== StatusReservation.DEPOSIT && (
            <>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập địa chỉ Email"
                  label="Địa chỉ Email"
                  name="customerMainEmail"
                  isRequired
                  type="text"
                  control={control}
                  errors={errors}
                  setError={setError}
                  format="email"
                />
              </Grid>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  name="customerMainphone"
                  type="text"
                  format="phone"
                  isRequired
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </>
          )}
          {locationProps?.typeCreate === StatusReservation.DEPOSIT && (
            <>
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập địa chỉ Email"
                  label="Địa chỉ Email"
                  name="customerMainEmail"
                  isRequired
                  type="text"
                  control={control}
                  errors={errors}
                  setError={setError}
                  format="email"
                />
              </Grid>
              {/* <Grid item md={4}></Grid> */}
              <Grid item xs={4} md={4}>
                <TextFieldCustom
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  name="customerMainphone"
                  type="text"
                  format="phone"
                  isRequired
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Grid>
            </>
          )}
        </Grid>
        <LegalEntityInfo
          isRequired
          formControl={FormControl}
          fieldNameObject={{
            identifierType: 'mainIdentifierTypeCustomer',
            identityNumber: 'mainIdentityNumberCustomer',
            dateRange: 'mainDateRangCustomer',
            issuedBy: 'mainIssuedByCustomer',
          }}
        />
        {watch('typeMainCustomer') === ProjectCustomerType.BUSINESS ? (
          <BusinessInfo formControl={FormControl} />
        ) : (
          <AddressInfo
            formControl={FormControl}
            fieldNameObject={{
              province: 'mainProvince',
              district: 'mainDistrict',
              ward: 'mainWard',
              street: 'mainStreet',
              provinceBorn: 'mainProvinceBorn',
              districtBorn: 'mainDistrictBorn',
              wardBorn: 'mainWardBorn',
              streetBorn: 'mainStreetBorn',
            }}
          />
        )}
        <PaymentInfo formControl={FormControl} />
        <CoOwnerCustomer
          formControl={FormControl}
          isEdit={isEdit || isCopy || false}
        />
      </Grid>
    );
  };

  return (
    <Fragment>
      <Box pb={isPopup ? '0px' : '43px'} mt={0}>
        <form onSubmit={handleSubmit(submit, onError)}>
          <Grid container>
            <Grid
              container
              bgcolor={theme.palette.grey[0]}
              p={isPopup ? '24px 0' : '24px'}
              pb={isPopup ? 2 : 10}
              sx={{
                marginBottom: { xs: '24px', md: '0px' },
                borderRadius: 3,
              }}
            >
              {!isPopup && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box display={'flex'} sx={{ alignItems: 'center' }}>
                    <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
                      <img src={BACK_ICON} onClick={handleCancel} alt="" />
                    </Box>
                    <Typography
                      fontSize={'20px'}
                      fontWeight={700}
                      lineHeight={'24px'}
                    >
                      {isEdit
                        ? `Chỉnh sửa phiếu ${
                            locationProps?.typeCreate ===
                            StatusReservation.RESERVATION
                              ? 'giữ chỗ'
                              : 'đặt cọc'
                          }`
                        : `Tạo phiếu ${
                            locationProps?.typeCreate ===
                            StatusReservation.RESERVATION
                              ? 'giữ chỗ'
                              : 'đặt cọc'
                          }`}
                    </Typography>
                  </Box>
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
                    // handleClick={submit}
                    isLoading={
                      isLoading?.[
                        `transactionManagementSlice/${
                          isEdit ? 'update' : 'create'
                        }Ticket`
                      ]
                    }
                  />
                </Grid>
              )}
              {!isPopup && (
                <Grid
                  sx={{
                    display: 'flex',
                    background: palette.primary.lightRed,
                    color: palette.primary.warningText,
                    fontWeight: 400,
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    p: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  <img src={WARNING_ICON_MESSAGE} alt="" />
                  {locationProps?.typeCreate ===
                  StatusReservation.RESERVATION ? (
                    <Typography
                      sx={{ ml: '14px', '& >span': { fontWeight: 700 } }}
                    >
                      Vui lòng nhập <span>đầy đủ và chính xác</span> các thông
                      tin trên phiếu giữ chỗ. Khi phiếu giữ chỗ được xác nhận
                      thành công, thông tin trên phiếu sẽ không thể thay đổi
                      dưới bất kỳ mọi hình thức nào.
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ ml: '14px', '& >span': { fontWeight: 700 } }}
                    >
                      Vui lòng nhập <span>đầy đủ và chính xác</span> các thông
                      tin trên phiếu đặt cọc. Các thông tin này sẽ liên quan đến
                      hợp đồng giao dịch của khách hàng. Khi phiếu cọc được xác
                      nhận thành công, thông tin trên phiếu sẽ không thể thay
                      đổi dưới bất kỳ mọi hình thức nào.
                    </Typography>
                  )}
                </Grid>
              )}
              <Grid container md={isPopup ? 12 : 10}>
                {renderProjectInfo()}

                {!!showStaffInChargeInfo && renderStaffInChargeInfo()}
                {renderCustomerInfo()}
                <OtherInfo
                  formControl={FormControl}
                  isCopy={isCopy}
                  isPopup={isPopup}
                />
              </Grid>
              {isPopup && (
                <Grid
                  container
                  mt={3}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <CustomButton
                    title="Hủy"
                    handleClick={() => onClose && onClose()}
                    sxProps={{
                      background: '#FFFFFF',
                      border: '1px solid #D6465F',
                      borderRadius: '8px',
                      width: '128px',
                      marginRight: '42px',
                    }}
                    sxPropsText={{ color: '#1E1E1E' }}
                  />
                  <CustomButton
                    title="Đăng ký"
                    typeButton="submit"
                    // handleClick={() => handleOpenRegister(product.id)}
                    sxProps={{
                      background: '#D45B7A',
                      borderRadius: '8px',
                      width: '128px',
                    }}
                    sxPropsText={{ color: '#FFFFFF' }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Fragment>
  );
}
