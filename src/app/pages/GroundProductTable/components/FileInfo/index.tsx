import React, { Fragment, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import palette from 'styles/theme/palette';
import { FileWithPath } from 'react-dropzone';
import ConfirmDialog from 'app/components/ConfirmDialog';

import CHECK_ICON from 'assets/background/checksuccess-icon.svg';
import TRASH_ICON from 'assets/background/trash-icon.svg';
import UPLOAD_ICON from 'assets/background/upload-image-icon.svg';

import { GroundProductTableData } from '../../slice/types';

interface FileInfoProps {
  currentGroundImage: FileWithPath | null;
  groundProductTableData: GroundProductTableData | undefined | null;
  onDelete: () => void;
  isDisable?: boolean;
}

const FileInfo: React.FC<FileInfoProps> = ({
  currentGroundImage,
  groundProductTableData,
  onDelete,
  isDisable,
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleDeleteFile = () => {
    onDelete?.();
  };

  return (
    <Fragment>
      <Stack
        direction="row"
        alignItems="center"
        spacing={5}
        sx={{
          py: 1.25,
          px: 3,
          mb: 2,
          borderRadius: 1,
          border: '1px solid #C8CBCF',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Box
            component="img"
            src={UPLOAD_ICON}
            alt="icon excel"
            sx={{
              width: 35,
              height: 35,
            }}
          />
          <Typography
            color="primary.hint"
            sx={{
              ml: 1.25,
            }}
          >
            {!currentGroundImage?.path
              ? `${
                  process.env.REACT_APP_API_URL
                }${groundProductTableData?.file!.substring(4)}`
              : currentGroundImage?.path}
          </Typography>
        </Box>
        {!isDisable && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={CHECK_ICON}
              alt="icon check success"
              style={{ marginRight: '28px' }}
            />
            <img
              src={TRASH_ICON}
              style={{ cursor: 'pointer' }}
              alt="icon trash"
              onClick={() => setIsOpenDialog(true)}
            />
          </Box>
        )}
      </Stack>
      <ConfirmDialog
        isOpen={isOpenDialog}
        handleClose={() => setIsOpenDialog(false)}
        handleSubmit={handleDeleteFile}
        isIcon={false}
        actionName={'Xác nhận'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            fontSize={'24px'}
            fontWeight={700}
            width={400}
            color={palette.primary.text}
            mx="auto"
            mb={2}
            mt={2}
            textAlign={'center'}
          >
            Xoá ảnh mặt bằng
          </Typography>
          <Typography
            fontSize={'16px'}
            fontWeight={400}
            color={palette.primary.text}
            mb={5}
            textAlign={'center'}
          >
            Bạn có chắc chắc muốn xoá ảnh mặt bằng hiện tại không?
          </Typography>
        </div>
      </ConfirmDialog>
    </Fragment>
  );
};

export default FileInfo;
