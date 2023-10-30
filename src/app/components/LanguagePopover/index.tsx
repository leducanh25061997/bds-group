import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LANG_ICON from 'assets/background/lang-icon.svg';
import {
  Box,
  MenuItem,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';

import MenuPopover from 'app/components/MenuPopover';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const theme = useTheme();
  const LANGS = useMemo(
    () => [
      {
        value: 'vi',
        label: 'VI',
        index: 1,
      },
      {
        value: 'en',
        label: 'EN',
      },
    ],
    [],
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const currentLanguage = useMemo(() => {
    return LANGS.find(lang => i18n.language === lang.value) || LANGS[0];
  }, [i18n.language, LANGS]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          height: 36,
          ...(open && {
            bgcolor: theme => theme.palette.secondary.dark,
          }),
          borderRadius: 'unset',
          p: 1,
        }}
      >
        <Typography
          fontSize={'16px'}
          fontWeight={600}
          color={theme.palette.primary.lighter}
          mr={1}
        >
          {currentLanguage.label}
        </Typography>
        <img src={LANG_ICON} alt="Lang icon" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          width: '80px',
        }}
      >
        <Box>
          {LANGS.map(option => (
            <MenuItem
              key={option.value}
              selected={option.value === i18n.language}
              onClick={() => handleChangeLanguage(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemText
                primaryTypographyProps={{ variant: 'body2' }}
                data-language={option.value}
              >
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
