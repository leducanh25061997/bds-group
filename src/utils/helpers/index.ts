import DEFAULT_IMAGE from 'assets/background/default-image.svg';
import DOC_ICON from 'assets/background/doc-icon.svg';
import EXEL_ICON from 'assets/background/exel-icon.svg';
import IMAGE_ICON from 'assets/background/icon-image.svg';
import PDF_ICON from 'assets/background/pdf-icon.svg';
import dayjs from 'dayjs';
import moment from 'moment';
import { FilterParams } from 'types';
import {
  ContractTypeView,
  CustomerGroupType,
  DialogProtype,
  Gender,
  ProductType,
  StaffLevelType,
  StatusProductEnum,
  TYPEIdentification,
  TypeCardEnum,
  StatusTakeCareEnum,
  ApproveCustomerBigTypeEnum,
} from 'types/Enum';
import { v4 as uuidv4 } from 'uuid';
import { ProjectCustomerType } from '../../types/User';

export const getSort = ({
  filter,
  property,
}: {
  filter: FilterParams;
  property: string;
}) => {
  if (filter.sort && filter.sort.length > 0) {
    const currentSort = filter.sort.find(
      item => item && item.split(',')[0] === property,
    );
    const newSort = [...filter.sort];
    if (currentSort) {
      const newSortType =
        currentSort?.split(',')[1] === 'desc' ? 'asc' : 'desc';
      const currentIndex = newSort.findIndex(s => s.split(',')[0] === property);
      newSort.splice(currentIndex, 1);
      newSort.push(`${property},${newSortType}`);
      return newSort;
    }
  }
  return [`${property},desc`];
};

export const getOrder = ({
  filter,
  property,
}: {
  filter: FilterParams;
  property: string;
}) => {
  if (filter.orderBy && filter.orderBy.length > 0) {
    const currentSort = filter?.orderBy?.find(item => item?.includes(property));
    const newSort = [...filter.orderBy];
    if (currentSort) {
      const newSortType = currentSort.includes('%2B')
        ? `-${currentSort.replace('%2B', '')}`
        : `%2B${currentSort.replace('-', '')}`;
      const currentIndex = newSort?.findIndex(item => item?.includes(property));
      newSort.splice(currentIndex, 1);
      newSort.push(newSortType);
      return newSort;
    }
  }
  return [`${property} desc`];
};

export const serialize = (params: any) => {
  const str = [];
  for (const p in params)
    if (params.hasOwnProperty(p)) {
      if (params[p] !== '') {
        str.push(encodeURIComponent(p) + '=' + params[p]);
      }
    }
  return str.join('&');
};

export const renderContent = (_data?: string | number | null) => {
  return _data ? _data : '--';
};

export const formatDate = (newValue: any) => {
  return newValue
    ? dayjs(newValue, 'YYYY-MM-DDThh:mm:ss').format('YYYY-MM-DDThh:mm:ss') + 'Z'
    : '';
};

export const getLocalTime = (value?: string, format?: string) => {
  if (!value) return null;
  return moment
    .utc(value)
    .local()
    .format(format ? format : 'HH:mm DD/MM/YYYY');
};

export const renderFile = (id?: number | string, type?: string) => {
  if (id) {
    if (type) {
      return `${process.env.REACT_APP_API_URL}/${type}/${id}`;
    }
    return `${process.env.REACT_APP_API_URL}/${id}`;
  }
  return DEFAULT_IMAGE;
};

export const getLinkPdfContract = (
  id: string | number | undefined,
  type: ContractTypeView,
) => {
  if (!id) return null;
  let url = '';
  if (type === ContractTypeView.SERVICE) {
    url = `${process.env.REACT_APP_API_URL}/local-files/get-contract-pdf/MASTER/${id}`;
  }
  if (type === ContractTypeView.LIQUIDATION) {
    url = `${process.env.REACT_APP_API_URL}/local-files/get-contract-pdf/LIQUIDATE/${id}`;
  }
  if (type === ContractTypeView.ATTACHMENT) {
    url = `${process.env.REACT_APP_API_URL}/local-files/${id}`;
  }
  return url;
};

export const getLinkDownloadTemplateContract = () => {
  return `${process.env.REACT_APP_API_URL}/local-files/contract-appendix-template`;
};

export const formatCurrency = (n?: string | number) => {
  if (n === 0) return '0';
  if (!n) return '';
  const money = typeof n === 'string' ? n : Math.round(n).toString();
  const thousands = /\B(?=(\d{3})+(?!\d))/g;
  return money.replace(thousands, '.');
};

export const formatCurrencyAndDecimal = (text: string | number) => {
  const value = text?.toString();
  if (value === '0') return '0';
  const indexDot = value?.indexOf('.');
  if (indexDot > -1) {
    return `${formatCurrency(value?.slice(0, indexDot))},${value?.slice(
      indexDot + 1,
      value?.length,
    )}`;
  }
  return text;
};

const ONE_MB = Math.pow(1024, 2);
export const MAX_FILE_SIZE = 3 * ONE_MB;

export const FILE_ERROR_MESSAGES = {
  required: 'File không được để trống',
  invalid: (fileName: string) => `${fileName} không hợp lệ`,
  oversize: 'File vượt quá kích thước',
};

const readGroup = (group: string) => {
  const readDigit = [
    ' Không',
    ' Một',
    ' Hai',
    ' Ba',
    ' Bốn',
    ' Năm',
    ' Sáu',
    ' Bảy',
    ' Tám',
    ' Chín',
  ];
  let temp = '';
  if (group === '000') return '';
  temp = readDigit[parseInt(group.substring(0, 1))] + ' Trăm';
  if (group.substring(1, 2) === '0')
    if (group.substring(2, 3) === '0') return temp;
    else {
      temp += ' Lẻ' + readDigit[parseInt(group.substring(2, 3))];
      return temp;
    }
  else temp += readDigit[parseInt(group.substring(1, 2))] + ' Mươi';
  if (group.substring(2, 3) === '5') temp += ' Lăm';
  else if (group.substring(2, 3) !== '0')
    temp += readDigit[parseInt(group.substring(2, 3))];
  return temp;
};

export const readMoney = (num: string, isVnd: boolean) => {
  if (num == null || num === '') return '';
  let temp = '';
  while (num.length < 18) {
    num = '0' + num;
  }
  const g1 = num.substring(0, 3);
  const g2 = num.substring(3, 6);
  const g3 = num.substring(6, 9);
  const g4 = num.substring(9, 12);
  const g5 = num.substring(12, 15);
  const g6 = num.substring(15, 18);
  if (g1 !== '000') {
    temp = readGroup(g1);
    temp += ' Triệu';
  }
  if (g2 !== '000') {
    temp += readGroup(g2);
    temp += ' Nghìn';
  }
  if (g3 !== '000') {
    temp += readGroup(g3);
    temp += ' Tỷ';
  } else if ('' !== temp) {
    temp += ' Tỷ';
  }
  if (g4 !== '000') {
    temp += readGroup(g4);
    temp += ' Triệu';
  }
  if (g5 !== '000') {
    temp += readGroup(g5);
    temp += ' Nghìn';
  }
  temp = temp + readGroup(g6);
  temp = temp.replaceAll('Một Mươi', 'Mười');
  temp = temp.trim();
  temp = temp.replaceAll('Không Trăm', '');
  temp = temp.trim();
  temp = temp.replaceAll('Mười Không', 'Mười');
  temp = temp.trim();
  temp = temp.replaceAll('Mươi Không', 'Mươi');
  temp = temp.trim();
  if (temp.indexOf('Lẻ') === 0) temp = temp.substring(2);
  temp = temp.trim();
  temp = temp.replaceAll('Mươi Một', 'Mươi Mốt');
  temp = temp.trim();
  const result =
    temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
  return (
    (result === '' ? 'Không' : result) +
    `${isVnd ? ' đồng chẵn' : ' đô la Mỹ chẵn'}`
  );
};

export async function dataUrlToFile(
  dataUrl: string,
  fileName: string,
): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
}

export const returnFileType = (name: string) => {
  const file = name.split('.').pop();
  if (file === 'docx' || file === 'doc') {
    return DOC_ICON;
  } else if (file === 'pdf') {
    return PDF_ICON;
  } else if (file === 'xlsx') {
    return EXEL_ICON;
  } else {
    return IMAGE_ICON;
  }
};

export const roundCustom = (num: number, numDigits: number) => {
  try {
    if (numDigits >= 0) {
      return Number.parseFloat(num.toFixed(parseInt(numDigits + '')));
    } else {
      let res = 0;
      res = Math.round(num / Math.pow(10, Math.abs(parseInt(numDigits + ''))));
      res *= Math.pow(10, Math.abs(parseInt(numDigits + '')));
      return Number.parseFloat(res.toFixed(Math.abs(parseInt(numDigits + ''))));
    }
  } catch (e) {
    return 'NaN';
  }
};

export const createMinute = (ms: string) => {
  const date = new Date();
  const createMili = Date.parse(ms);
  const milliseconds = Date.parse(`${date}`) - createMili;
  const mins = Math.floor(milliseconds / 60000);
  if (mins <= 1) {
    return 'Just now';
  } else if (mins >= 60 && mins < 1440) {
    return Math.floor(mins / 60) + 'h';
  } else if (mins >= 1440 && mins < 2880) {
    return Math.floor(mins / 1440) + ' day ago';
  } else if (mins >= 2880) {
    return Math.floor(mins / 1440) + ' days ago';
  } else {
    return mins + 'm';
  }
};

export const formatDateTime = (newValue: any) => {
  // return dayjs(newValue, 'YYYY-MM-DDThh:mm:ss').format('DD-MM-YYYY');
  if (!newValue) return;
  return moment.utc(newValue).local().format('DD-MM-YYYY');
};

export const formatDateTime2 = (newValue: any) => {
  // return dayjs(newValue, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
  if (!newValue) return;
  return moment.utc(newValue).local().format('DD/MM/YYYY');
};

export const formatDateTime3 = (newValue: any) => {
  // return dayjs(newValue, 'YYYY-MM-DDThh:mm:ss').format('hh:mm, DD/MM/YYYY');
  if (!newValue) return;
  return moment.utc(newValue).local().format('HH:mm, DD/MM/YYYY');
};

export const checkTimeCurrent = () => {
  const hours = new Date().getHours();
  const isDayTime = hours > 5 && hours < 11;
  if (isDayTime) {
    return 'Chào Buổi Sáng!';
  } else {
    return 'Chào bạn!';
  }
};

export const checkPermissionExist = (permissionKey: string, userInfo: any) => {
  const permission = userInfo?.role?.permissions.find(
    (element: any) => element.key === permissionKey,
  );
  if (permission) {
    return true;
  }
  return false;
};

export const renderIdentifier = (isIdentifier: any) => {
  let text = '-';
  switch (isIdentifier) {
    case TYPEIdentification.CITIZEN_IDENTIFICATION:
      text = 'CCCD';
      break;
    case TYPEIdentification.IDENTITY_CARD:
      text = 'CMND';
      break;
    case TYPEIdentification.PASSPORT:
      text = 'Passport';
      break;
    default:
      break;
  }
  return text;
};

export const renderCustomerGroup = (customerGroupType?: CustomerGroupType) => {
  let text = '-';
  switch (customerGroupType) {
    case CustomerGroupType.DAILY:
      text = 'KH phát sinh hằng ngày';
      break;
    case CustomerGroupType.INTERESTED:
      text = 'KH quan tâm';
      break;
    case CustomerGroupType.POTENTIAL:
      text = 'KH tiềm năng';
      break;
    case CustomerGroupType.BIG:
      text = 'KH lớn';
      break;
    default:
      break;
  }
  return text;
};

export const renderStatusCustomerBig = (customer?: any) => {
  let text = '-';
  if (customer.groupType === CustomerGroupType.BIG) {
    switch (customer.customerBigApprove[0]?.status) {
      case ApproveCustomerBigTypeEnum.WAIT_APPROVE:
        text = `Chờ ${customer.customerBigApprove[0]?.nodeName} duyệt`;
        break;
      case ApproveCustomerBigTypeEnum.APPROVED:
        text = 'Đã duyệt';
        break;
      default:
        text = 'Chờ gửi duyệt';
        break;
    }
  }
  return text;
};

export const renderCustomerTransaction = (
  CustomerTransactionType?: ProjectCustomerType,
) => {
  let text = '-';
  switch (CustomerTransactionType) {
    case ProjectCustomerType.PERSONAL:
      text = 'Cá nhân';
      break;
    case ProjectCustomerType.BUSINESS:
      text = 'Doanh nghiệp';
      break;
    default:
      break;
  }
  return text;
};

export const renderPosition = (status: StaffLevelType) => {
  let text = '-';
  switch (status) {
    case StaffLevelType.C1:
      text = 'C1';
      break;
    case StaffLevelType.C2:
      text = 'C2';
      break;
    case StaffLevelType.D1:
      text = 'D1';
      break;
    case StaffLevelType.E1:
      text = 'E1';
      break;
    case StaffLevelType.E2:
      text = 'E2';
      break;
    case StaffLevelType.E3:
      text = 'E3';
      break;
    case StaffLevelType.M1:
      text = 'M1';
      break;
    case StaffLevelType.M2:
      text = 'M2';
      break;
    case StaffLevelType.M3:
      text = 'M3';
      break;
    default:
      break;
  }
  return text;
};

// Functions for product table
export const isItemValid = (inputString: string) => {
  // Regular expression pattern to match alphanumeric characters
  const pattern = /^[a-zA-Z0-9]{3}$/;

  // Test if the inputString matches the pattern
  return pattern.test(inputString);
};

export const isBlockValid = (v: string) =>
  v
    .split(',')
    .filter((str: string) => str.trim() !== '')
    .map((str: string) => str.trim())
    .every(isItemValid) || 'Sai định dạng';

export const formatBlockField = (value: string) => {
  return value
    .split(',')
    .filter((str: string) => str.trim() !== '')
    .map((str: string) => str.trim())
    .join(',');
};

//////////////

export function isNullOrEmpty(value: any): boolean {
  return value == null || value === undefined || value.trim() === '';
}

export const renderBackgroundColorTable = (status?: StatusProductEnum) => {
  switch (status) {
    case StatusProductEnum.BOOKING:
      return '#7CE7FF';
    case StatusProductEnum.CONSTRACT:
      return '#F7ACD5';
    case StatusProductEnum.LIQUIDATION:
      return '#34C759';
    case StatusProductEnum.OPEN:
      return '#FFEB99';
    case StatusProductEnum.SIGN_UP:
      return '#D687F2';
    case StatusProductEnum.SOLD_OUT:
      return '#FF595C';
    case StatusProductEnum.TRANSFER:
      return '#6BA7DF';
    case StatusProductEnum.WAIT_FILE:
      return '#FFB168';
    case StatusProductEnum.WARE_HOUSE:
      return '#ECECEE';
    case StatusProductEnum.LOCK:
      return '#B5BAC0';
    case StatusProductEnum.CLOSE:
      return '#FFFFFF';
    default:
      return 'unset';
  }
};

export const RenderTitleDialog = (type: DialogProtype) => {
  switch (type) {
    case DialogProtype.ENTER_CUSTOMER_INFORMATION:
      return 'Đăng ký thông tin khách hàng';
    case DialogProtype.REGISTER:
      return 'Đăng ký sản phẩm';
    case DialogProtype.RETURN:
      return 'Trả về sản phẩm';
    case DialogProtype.BOOKING:
      return 'Xác nhận giao dịch';
    case DialogProtype.TRANSACTION_NOTES:
      return 'Ghi chú giao dịch';
    case DialogProtype.CREATE_CONTRACT:
      return 'Tạo hợp đồng giao dịch';
    case DialogProtype.OPEN_SELL:
      return 'Mở bán sản phẩm';
    case DialogProtype.TRANFER:
      return 'Chuyển sản phẩm';
    case DialogProtype.LOCK_UP:
      return 'Khóa sản phẩm';
    case DialogProtype.RECALL:
      return 'Thu hồi sản phẩm';
    case DialogProtype.UN_LOCK:
      return 'Mở khóa sản phẩm';
    case DialogProtype.PRODUCT_PRIORITY_ASSEMBLY:
      return 'Mở ráp ưu tiên sản phẩm';
    case DialogProtype.TRANSFER_PRODUCT_TO_SALE_PROGRAM:
      return 'Chuyển sản phẩm';
    case DialogProtype.SEND_REQUIRE:
      return 'Gửi yêu cầu';
    case DialogProtype.TRANSFER_PRODUCT_TO_SALE_PROGRAM:
      return 'Xác nhận';
    case DialogProtype.CONFIRM_SIGN_UP:
      return 'Xác nhận giao dịch';
    default:
      return 'Đăng ký sản phẩm';
  }
};

export const getDimensionsOfImage = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function () {
      const { width, height } = image;
      resolve({ height, width });
    });
  });
};

export const RenderTitleMembershipCard = (type: TypeCardEnum) => {
  switch (type) {
    case TypeCardEnum.SIVER:
      return 'Bạc';
    case TypeCardEnum.GOLD:
      return 'Vàng';
    case TypeCardEnum.DIAMOND:
      return 'Kim Cương';
    case TypeCardEnum.PLATINUM:
      return 'Bạch Kim';
    case TypeCardEnum.PARTNER:
      return 'Đối Tác';
    case TypeCardEnum.AMBASSADOR:
      return 'Đại Sứ';
    default:
      return '-';
  }
};

export const RenderTitleMembershipCardColor = (type: TypeCardEnum) => {
  switch (type) {
    case TypeCardEnum.SIVER:
      return '#C0C0C0';
    case TypeCardEnum.GOLD:
      return '#FFD700';
    case TypeCardEnum.DIAMOND:
      return '#b9f2ff';
    case TypeCardEnum.PLATINUM:
      return '#e5e4e2';
    case TypeCardEnum.PARTNER:
      return '#D45B7A';
    case TypeCardEnum.AMBASSADOR:
      return '#826AF9';
    default:
      return '#C0C0C0';
  }
};

export const RenderTitleGender = (type: any) => {
  switch (type) {
    case Gender.MALE:
      return 'Nam';
    case Gender.FEMALE:
      return 'Nữ';
    default:
      return '-';
  }
};

export const RenderClassicProduct = (type: any) => {
  switch (type) {
    case ProductType.LUXURY:
      return 'Căn hộ cao cấp';
    case ProductType.STUDIO:
      return 'Căn hộ Studio';
    case ProductType.APARTMENT:
      return 'Căn hộ chung cư';
    default:
      return '-';
  }
};

export const generateIdForObject = (object: any, key: string) => {
  return {
    ...object,
    [key]: uuidv4(),
  };
};

export const formatNumber = (number: string | number) =>
  Intl.NumberFormat('vi-VN').format(+number);

export const renderStatusLead = (type: StatusTakeCareEnum) => {
  switch (type) {
    case StatusTakeCareEnum.NOT_CREEN:
      return 'Chưa sàng lọc';
    case StatusTakeCareEnum.UNALLOCATED:
      return 'Chưa phân bổ';
    case StatusTakeCareEnum.NOT_RECEIVE:
      return 'Chưa tiếp nhận';
    case StatusTakeCareEnum.TAKE_CARE:
      return 'Chăm sóc';
    case StatusTakeCareEnum.LEAD_VITUAL:
      return 'Lead ảo';
    case StatusTakeCareEnum.LEAD_NOT_INTERESTED:
      return 'Lead không có nhu cầu';
    case StatusTakeCareEnum.LEAD_CAN_NOT_CONTACT:
      return 'Lead không liên lạc được';
    case StatusTakeCareEnum.LEAD_GOODWILL:
      return 'Lead thiện chí của dự án';
    case StatusTakeCareEnum.LEAD_INTERESTED:
      return 'Lead quan tâm BĐS';
    case StatusTakeCareEnum.LEAD_CONSULTED_DIRECTLY:
      return 'Lead đã tư vấn trực tiếp';
    case StatusTakeCareEnum.LEAD_POTENTIAL:
      return 'Lead tiềm năng';
    case StatusTakeCareEnum.LEAD_POTENTIAL:
      return 'Lead tiềm năng';
    case StatusTakeCareEnum.LEAD_BIG:
      return 'Lead KH lớn';
    default:
      return 'Lead tiềm năng';
  }
};
