import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

declare module '@mui/material' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#C1C1C1',
  200: '#EDEDED',
  300: '#f3f3f3',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY = {
  lighter: '#001D6E',
  light: '#3D423C',
  main: '#183D84',
  dark: '',
  darker: '#49A299',
  contrastText: '#D9F8FC',
  button: '#D45B7A',
  text: '#000000',
  barList: '#FEF4FA',
  highlight: '#007AFF',
  hint: '#7A7A7A',
  darkRed: '#D6465F',
  lightRed: '#FDEAF4',
  warningText: '#E42B2C',
  label: '#222222',
};

const BUTTON_STATUS = {
  textSpending: '#CCA300',
  textComplete: '#2A9F47',
  textEmpty: '#CD0006',
  bgSpending: '#FFEB99',
  bgComplete: '#D6F4DE',
  bgEmpty: '#FFD1D2',
  bgEvent: '#11AFAF',
  greyLight: '#D9D9D9',
  greyLighter: '#7A7A7A',
  btnUnActive: '#A8ADB4',
};

const BACKGROUND_HEADER_TABLE = {
  lighter: '#475160',
  light: '#E0E1E4',
};

const SECONDARY = {
  lighter: '#F2F6FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#F4F4F4',
  darker: '#091A7A',
  contrastText: '#223250',
};
const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};
const SUCCESS = {
  lighter: '#49A299',
  light: '#39C24F',
  main: '#39C24F',
  dark: '#00901f',
  darker: '#08660D',
  contrastText: GREY[800],
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};
const ERROR = {
  lighter: '#DA5264',
  light: '#ff5a36',
  main: '#FF0000',
  dark: '#c20000',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
};

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  button: { ...BUTTON_STATUS },
  grey: GREY as any,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
  background: {
    ...BACKGROUND_HEADER_TABLE,
    paper: '#fff',
    default: '#fff',
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
