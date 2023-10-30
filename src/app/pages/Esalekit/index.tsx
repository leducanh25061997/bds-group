import { Box, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
// import Editor from 'app/components/Editor';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function Esalekit() {
  const theme = useTheme();
  const navigate = useNavigate();
  const redirectToCreatePage = () => navigate(path.createCarrers);
  const { t } = useTranslation();
  return (
    <Fragment>
      <Box
        sx={{
          marginLeft: { xs: '12px', sm: '18px', lg: '0px' },
          marginRight: { xs: '12px', sm: '18px', lg: '0px' },
        }}
      >
        {/* <Editor id="1" /> */}
      </Box>
    </Fragment>
  );
}
