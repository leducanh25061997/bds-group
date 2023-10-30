import { Box, Collapse } from '@mui/material';
import { CollapseTitle } from 'app/components/CollapseTitle';
import { translations } from 'locales/translations';
import React, { useState } from 'react';
import MapImage from 'assets/background/map.png';
import { useTranslation } from 'react-i18next';

import CardWrapper from '../CardWrapper';

const Map = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <CardWrapper>
      <CollapseTitle
        open={open}
        className={{
          child: 'text-[#001D6E] text-[14px] font-semibold',
        }}
        label={`VI. ${t(translations.dashboard.map)}`}
        onClick={() => setOpen(prev => !prev)}
        isUpper
      />
      <Collapse in={open}>
        <Box marginTop={'16px'}>
          <img
            style={{ width: '100%', height: '468px' }}
            src={MapImage}
            alt="Map"
          />
        </Box>
      </Collapse>
    </CardWrapper>
  );
};

export default Map;
