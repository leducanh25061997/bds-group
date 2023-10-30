import React from 'react';
import Button from '@mui/material/Button';
import { SxProps, Typography, useTheme } from '@mui/material';
import FILTER_ICON from 'assets/table/filter-icon.svg';
import CREATE_ICON from 'assets/table/create-icon.svg';
import CREATE_ICON_LIGHT from 'assets/table/create-icon-light.svg';
import LOCK_ICON_LIGHT from 'assets/background/lock-icon-action.svg';
import LOCK_ICON from 'assets/background/lock-icon-light.svg';
import PREVIEW_ICON from 'assets/background/preview-icon.svg';
import DOWNLOAD_ICON from 'assets/background/download_icon.svg';
import CREATE_CLICK_ICON from 'assets/background/create-click-icon.svg';
import CREATE_CLICK_ICON_LIGHT from 'assets/background/create-click-icon-light.svg';
import UPLOAD_ICON from 'assets/background/save-icon.svg';
import UPLOAD_EVENT from 'assets/background/icon-event.svg';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import EDIT_ICON_LIGHT from 'assets/background/edit-icon-light.svg';
import EDIT_ICON_DISABLED from 'assets/background/edit-icon-disable.svg';
import COLLAPSE_ICON from 'assets/background/collapse-icon.svg';
import DROPDOWN_ICON from 'assets/background/icon-dropdown.svg';
import EXPAND_ICON from 'assets/background/expand-icon.svg';
import UP_ICON from 'assets/background/up-icon.svg';
import DOWN_ICON from 'assets/background/down-icon.svg';
import DOWN_ICON_LIGHT from 'assets/background/down-icon-light.svg';
import TRASH_ICON from 'assets/background/trash-icon.svg';
import SEND_ICON from 'assets/background/send-icon.svg';
import SEND_ICON_LIGHT from 'assets/background/send-icon-light.svg';
import SETTING_ICON from 'assets/background/setting.svg';
import PRE_ICON from 'assets/background/previous.svg';
import EXCEL_ICON from 'assets/background/exceltemp_icon.svg';
import APPRPVAL_PROCESS_ICON from 'assets/background/icon-approval-process.svg';
import PRINT_ICON from 'assets/background/print-icon.svg';
import VIRTUAL_ICON from 'assets/icons/virtual-table.svg';
import EVENT_EXCEL from 'assets/background/event-excel.svg';
import VIRTUAL from 'assets/background/icon-virtual.svg';
import palette from 'styles/theme/palette';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import VIEW_ICON from 'assets/icons/view.svg';
import { EllipsisText } from '../EllipsisText';

interface Props {
  title?: string;
  isDisable?: boolean;
  isHide?: boolean;
  fullWidth?: boolean;
  handleClick?: (e?: any) => void;
  typeButton?: any;
  isIcon?: boolean;
  isDropdown?: boolean;
  width?: number;
  ariaDescribedby?: any;
  buttonMode?:
    | 'create'
    | 'edit'
    | 'remove'
    | 'filter'
    | 'lock'
    | 'preview'
    | 'create-click'
    | 'upload'
    | 'download'
    | 'up'
    | 'down'
    | 'expand'
    | 'collapse'
    | 'send'
    | 'setting'
    | 'previous'
    | 'send'
    | 'excel'
    | 'event'
    | 'process'
    | 'print'
    | 'event-report'
    | 'virtual'
    | 'view'
    | 'unset';
  sxProps?: SxProps;
  sxPropsText?: SxProps;
  variant?: 'text' | 'contained' | 'outlined';
  light?: boolean;
  propRef?: any;
  iconNode?: React.ReactNode;
  isLoading?: boolean;
}

const CustomButton = (props: Props) => {
  const theme = useTheme();
  const {
    isDisable,
    isHide,
    fullWidth,
    title,
    handleClick,
    typeButton,
    isIcon,
    isDropdown,
    buttonMode,
    sxProps,
    sxPropsText,
    variant,
    light,
    propRef,
    iconNode,
    isLoading = false,
    ariaDescribedby,
  } = props;
  const renderIcon = () => {
    if (!isIcon) return null;
    switch (buttonMode) {
      case 'create': {
        return (
          <img src={light ? CREATE_ICON_LIGHT : CREATE_ICON} alt="icon table" />
        );
      }
      case 'filter': {
        return <img src={FILTER_ICON} alt="icon table" />;
      }
      case 'up': {
        return <img src={UP_ICON} alt="icon table" />;
      }
      case 'down': {
        return <img src={DOWN_ICON} alt="icon table" />;
      }
      case 'lock': {
        return (
          <img src={light ? LOCK_ICON_LIGHT : LOCK_ICON} alt="icon table" />
        );
      }
      case 'preview': {
        return <img src={PREVIEW_ICON} alt="icon table" />;
      }
      case 'create-click': {
        return (
          <img
            src={light ? CREATE_CLICK_ICON : CREATE_CLICK_ICON_LIGHT}
            alt="icon table"
          />
        );
      }
      case 'download': {
        return (
          <img src={light ? DOWN_ICON_LIGHT : DOWNLOAD_ICON} alt="icon table" />
        );
      }
      case 'upload': {
        return <img src={UPLOAD_ICON} alt="icon table" />;
      }
      case 'edit': {
        if (isDisable) {
          return <img src={EDIT_ICON_DISABLED} alt="icon table" />;
        }
        return (
          <img src={light ? EDIT_ICON_LIGHT : EDIT_ICON} alt="icon table" />
        );
      }
      case 'expand': {
        return <img src={EXPAND_ICON} alt="icon table" />;
      }
      case 'collapse': {
        return <img src={COLLAPSE_ICON} alt="icon table" />;
      }
      case 'excel': {
        return <img src={EXCEL_ICON} alt="icon table" />;
      }
      case 'remove': {
        return <img src={TRASH_ICON} alt="icon table" />;
      }
      case 'send': {
        return (
          <img src={light ? SEND_ICON_LIGHT : SEND_ICON} alt="icon table" />
        );
      }
      case 'setting': {
        return <img src={SETTING_ICON} alt="setting icon" />;
      }
      case 'previous': {
        return <img src={PRE_ICON} alt="icon table" />;
      }
      case 'event': {
        return <img src={UPLOAD_EVENT} alt="icon table" />;
      }
      case 'process': {
        return <img src={APPRPVAL_PROCESS_ICON} alt="icon table" />;
      }
      case 'print': {
        return <img src={PRINT_ICON} alt="icon print" />;
      }
      case 'event': {
        return <img src={EVENT_EXCEL} alt="icon export" />;
      }
      case 'event-report': {
        return <img src={EVENT_EXCEL} alt="icon export" />;
      }
      case 'virtual': {
        return <img src={VIRTUAL} alt="icon virtual" />;
      }
      case 'view': {
        return <img src={VIEW_ICON} alt="icon view" />;
      }
      case 'unset': {
        return '';
      }
      default:
        return <img src={UPLOAD_ICON} alt="icon table" />;
    }
  };

  return !isLoading ? (
    <Button
      disabled={isDisable || false}
      type={typeButton}
      fullWidth={fullWidth}
      ref={propRef}
      aria-describedby={ariaDescribedby}
      onClick={handleClick && handleClick}
      sx={{
        textTransform: 'none',
        boxShadow: 'none',
        fontWeight: 600,
        height: '41px',
        border: variant === 'outlined' ? '1px solid #D45B7A' : 'none',
        p: '16px',
        color:
          variant === 'outlined' ? palette.common.black : theme.palette.grey[0],
        background: variant === 'outlined' ? 'unset' : palette.primary.button,
        ':hover': {
          background: variant === 'outlined' ? 'unset' : palette.primary.button,

          // '& .MuiTypography-root': {
          //   color: '#ffffff',
          // },
          // Đứng ở ngoài trỏ css vô mà đè css đừng sửa component chung ảnh hưởng chỗ khác e
        },
        ':disabled': {
          // nên đồng nhất để khỏi mỗi nơi set 1 màu từ ngoài vào
          background: variant === 'outlined' ? 'unset' : '#A0A0A0',
          color: '#212121',
          opacity: '0.5',
          border: variant === 'outlined' ? '1px solid #A0A0A0' : 'none',
        },
        display: isHide ? 'none' : '',
        borderRadius: 'unset',
        ...sxProps,
      }}
    >
      {iconNode || renderIcon()}
      {title && (
        // <EllipsisText text={title} sx={{ marginLeft: isIcon ? '8px' : 0, fontSize: '16px', fontWeight: 600, ...sxPropsText }} />
        <Typography
          sx={{ fontSize: '16px', fontWeight: 600, ...sxPropsText }}
          ml={isIcon ? 1 : 0}
        >
          {title}
        </Typography>
      )}
      {isDropdown && <img src={DROPDOWN_ICON} style={{ marginLeft: '8px' }} />}
    </Button>
  ) : (
    <LoadingButton
      color="secondary"
      loading={isLoading}
      loadingPosition="start"
      variant="contained"
      sx={{
        textTransform: 'unset',
        py: 1,
      }}
    >
      <Typography
        sx={{ fontSize: '16px', fontWeight: 600, ...sxPropsText }}
        ml={isIcon ? 1 : 0}
      >
        {title}
      </Typography>
    </LoadingButton>
  );
};

export default React.memo(CustomButton);
