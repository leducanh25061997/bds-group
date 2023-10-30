import { Box, Collapse } from '@mui/material';
import CustomButton from 'app/components/Button';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { translations } from 'locales/translations';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CardWrapper from '../CardWrapper';

const KPIStaff = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`III. ${t(translations.dashboard.KpiStaff)}`}
        onClick={() => setOpen(prev => !prev)}
        isUpper
      />
      <Collapse in={open}>
        <Box
          sx={{ marginTop: { xs: '16px', sm: '0px' } }}
          display="flex"
          justifyContent={'flex-end'}
        >
          <CustomButton
            title={t(translations.dashboard.downloaded)}
            variant="contained"
            isIcon
            buttonMode="download"
            typeButton={'download'}
            // isDisable={isLoading}
            light
          />
        </Box>
      </Collapse>
    </CardWrapper>
  );
};

export default KPIStaff;
