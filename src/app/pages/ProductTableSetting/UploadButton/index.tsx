import { Box } from '@mui/material';
import { snackbarActions } from 'app/components/Snackbar/slice';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CustomButton from 'app/components/Button';
import { ProjectTypeEnum } from 'types/Project';
import { selectProject } from 'app/pages/Projects/slice/selector';

import { useProductTableActionsSlice } from '../slice';
import { ProductError } from '../components/UploadErrorDialog';
import { AdditionalProductItem } from '../slice/types';

interface UploadButtonProps {
  onError: (err: ProductError[]) => void;
  onOpenError: (open: boolean) => void;
  onDuplicateProducts: (duplicateProducts: AdditionalProductItem[]) => void;
  onOpenDuplicate: (open: boolean) => void;
  isDisable?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onError,
  onOpenError,
  onDuplicateProducts,
  onOpenDuplicate,
  isDisable,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions: productTableActions } = useProductTableActionsSlice();
  const { ProjectDetail } = useSelector(selectProject);

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length)
        return dispatch(
          snackbarActions.updateSnackbar({
            message: 'File không đúng định dạng',
            type: 'error',
          }),
        );

      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('sheetName', 'Sheet1');
      formData.append('firstRow', '2');
      formData.append('projectId', id || '');

      if (ProjectDetail && ProjectDetail.type === ProjectTypeEnum.GROUND) {
        formData.append('isGround', 'true');
      }

      dispatch(
        productTableActions.checkFileUpload({ id, formData }, (res?: any) => {
          if (res?.success) {
            //   const data = await ProductTable.checkFileUpload(formData);
            // dispatch(
            //   snackbarActions.updateSnackbar({
            //     message: data.message,
            //     type: 'success',
            //   }),
            // );
            // onUploadStateChange(true);
            if (
              res.response &&
              res.response.data.duplicate &&
              res.response.data.duplicate.length > 0
            ) {
              const duplicateProducts: AdditionalProductItem[] =
                res.response.data.duplicate;
              onDuplicateProducts(duplicateProducts);
              onOpenDuplicate(true);
            }

            if (
              res.response &&
              res.response.data.error &&
              res.response.data.error.length > 0
            ) {
              const errList: any[] = res.response.data.error;
              onError(errList);
              onOpenError(true);
            }
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Tải file lên không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    },

    [onError, onOpenError, id],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxFiles: 1,
  });
  return (
    <Box {...getRootProps()}>
      <input
        {...getInputProps()}
        id="upload"
        hidden
        type="file"
        accept="*"
        max-file-size="5120"
      />
      <CustomButton
        title="Tải lên bảng hàng"
        buttonMode="excel"
        isIcon
        handleClick={open}
        isDisable={isDisable}
        sxProps={{
          ml: '16px',
          borderRadius: '8px',
          width: { xs: 'auto' },
          height: { xs: '44px' },
        }}
        sxPropsText={{ fontSize: '14px' }}
      />
    </Box>
  );
};

export default UploadButton;
