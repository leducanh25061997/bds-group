import Button from 'app/components/Button';
import React, { useState } from 'react';
import palette from 'styles/theme/palette';

import StartDialog from '../StartDialog';

const InitActions = ({ canStart = false }) => {
  const [isStartOpen, setIsStartOpen] = useState(false);

  return (
    <>
      <Button
        title="Bắt đầu sự kiện"
        isIcon
        buttonMode="event"
        handleClick={() => {
          if (!canStart) {
            return;
          }
          setIsStartOpen(true);
        }}
        sxProps={{
          borderRadius: '8px',
          background: canStart ? palette.button.bgEvent : 'grey',
          height: { xs: '44px' },
          '&:hover': {
            background: canStart ? palette.button.bgEvent : 'grey',
          },
        }}
        sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
      />
      {isStartOpen && (
        <StartDialog open={isStartOpen} onClose={() => setIsStartOpen(false)} />
      )}
    </>
  );
};

export default React.memo(InitActions);
