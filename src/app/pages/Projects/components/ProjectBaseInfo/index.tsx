import React from 'react';
import { Stack, Typography, Box, BoxProps } from '@mui/material';

import palette from 'styles/theme/palette';

import { ProjectItem } from 'types/Project';
import FieldInfo from 'app/pages/TransactionManagement/components/BookingDetail/FieldInfo';

interface ProjectBaseInfoProps {
  projectInfo?: ProjectItem | undefined | null;
  boxProps?: BoxProps;
}

const ProjectBaseInfo: React.FC<ProjectBaseInfoProps> = ({
  projectInfo,
  boxProps,
}) => {
  const address =
    (projectInfo?.address ? `${projectInfo.address}, ` : '') +
    `${projectInfo?.ward}, ${projectInfo?.district}, ${projectInfo?.province}, Việt Nam`;

  return (
    <Box sx={{ mt: 2.5 }} {...boxProps}>
      <Typography
        fontWeight={700}
        color={palette.primary.button}
        marginBottom={1.5}
      >
        Thông tin dự án
      </Typography>
      <Stack
        spacing={1.25}
        bgcolor="#475160"
        borderRadius={1}
        sx={{
          py: 2,
          px: 1.375,
          color: 'white',
        }}
      >
        <FieldInfo
          label="Tên dự án:"
          labelProps={{
            sx: {
              fontWeight: 500,
              minWidth: 80,
            },
          }}
          content={projectInfo?.name}
          contentProps={{
            sx: {
              fontWeight: 700,
              textTransform: 'uppercase',
            },
            variant: 'body1',
          }}
        />
        <FieldInfo
          label="Địa chỉ:"
          labelProps={{
            sx: {
              fontWeight: 500,
              minWidth: 80,
            },
          }}
          content={address}
          contentProps={{
            sx: {
              fontWeight: 700,
            },
          }}
        />
        <FieldInfo
          label="Loại dự án:"
          labelProps={{
            sx: {
              fontWeight: 500,
              minWidth: 80,
            },
          }}
          content={projectInfo?.type}
          contentProps={{
            sx: {
              fontWeight: 700,
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default React.memo(ProjectBaseInfo);
