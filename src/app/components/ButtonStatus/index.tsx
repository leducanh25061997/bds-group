import { SxProps, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';

interface Props {
  isDisable?: boolean;
  fullWidth?: boolean;
  handleClick?: (e?: any) => void;
  typeButton?: any;
  isIcon?: boolean;
  width?: number;
  buttonMode?: 'spending' | 'complete' | 'empty';
  sxProps?: SxProps;
  variant?: 'text' | 'contained' | 'outlined';
  light?: boolean;
}

const ButtonStatus = (props: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    isDisable,
    fullWidth,
    handleClick,
    typeButton,
    buttonMode,
    sxProps,
    variant,
    light,
  } = props;
  const renderText = () => {
    switch (buttonMode) {
      case 'spending': {
        return t(translations.button.spending);
      }
      case 'complete': {
        return t(translations.button.complete);
      }
      case 'empty': {
        return t(translations.button.empty);
      }
      default:
        return t(translations.button.empty);
    }
  };

  const renderTextColor = () => {
    switch (buttonMode) {
      case 'spending': {
        return palette.button.textSpending;
      }
      case 'complete': {
        return palette.button.textComplete;
      }
      case 'empty': {
        return palette.button.textEmpty;
      }
      default:
        return palette.button.textEmpty;
    }
  };

  const renderBgColor = () => {
    switch (buttonMode) {
      case 'spending': {
        return palette.button.bgSpending;
      }
      case 'complete': {
        return palette.button.bgComplete;
      }
      case 'empty': {
        return palette.button.bgEmpty;
      }
      default:
        return palette.button.bgEmpty;
    }
  };

  return (
    <Button
      disabled={isDisable || false}
      type={typeButton}
      fullWidth={fullWidth}
      onClick={handleClick && handleClick}
      sx={{
        boxShadow: 'none',
        height: '24px',
        width: '78px',
        border: variant === 'outlined' ? 'unset' : 'none',
        p: '14px',
        color: renderTextColor(),
        background: renderBgColor(),
        '&:hover': {
          backgroundColor: renderBgColor(),
        },
        borderRadius: '4px',
        ...sxProps,
      }}
    >
      <Typography fontSize={'16px'} fontWeight={600}>
        {renderText()}
      </Typography>
    </Button>
  );
};

export default ButtonStatus;
