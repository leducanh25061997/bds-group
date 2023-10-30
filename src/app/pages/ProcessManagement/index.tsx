import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';

import { DialogProcess } from './dialog';
import { ListProcess } from './listProcess';

export function ProcessManagement() {
  const navigate = useNavigate();
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState(false);
  const [typeProcess, setTypeProcess] = useState();
  const [nameProcess, setNameProcess] = useState();

  const handleCreate = () => {
    navigate(
      `${path.createProcessManagement}?type=${typeProcess}&name=${nameProcess}`,
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          mb: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          fontSize={'18px'}
          fontWeight={700}
          color={palette.common.black}
        >
          {'Quản lý quy trình'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomButton
            title="Tạo quy trình"
            isIcon
            buttonMode="create"
            variant="outlined"
            light
            sxProps={{
              ml: '16px',
              borderRadius: '8px',
              width: { xs: 'auto' },
              height: { xs: '44px' },
            }}
            sxPropsText={{
              fontSize: '14px',
              color: palette.primary.button,
              fontWeight: 700,
            }}
            handleClick={() => setIsOpenDialogCreate(true)}
          />
          {/* <CustomButton
            title="Lưu cập nhật"
            isIcon
            sxProps={{
              ml: '16px',
              borderRadius: '8px',
              width: { xs: 'auto' },
              height: { xs: '44px' },
            }}
            sxPropsText={{ fontSize: '14px' }}
          /> */}
        </Box>
      </Box>
      <ListProcess />
      <DialogProcess
        actionName="Tạo"
        description=""
        isOpenDialog={isOpenDialogCreate}
        title="Tạo mới quy trình duyệt"
        setIsOpenDialog={setIsOpenDialogCreate}
        handleSubmit={handleCreate}
        isCreate
      />
    </Fragment>
  );
}
