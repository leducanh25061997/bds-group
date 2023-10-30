import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ProjectTypeEnum } from 'types/Project';
import UPLOAD_FILE_ICON from 'assets/background/upload-file-icon.svg';
import { snackbarActions } from 'app/components/Snackbar/slice';
import { useDropzone } from 'react-dropzone';
import { selectProject } from 'app/pages/Projects/slice/selector';

import ProductTableInfo from '../ProductTableInfo';
import { selectProductTable } from '../../slice/selectors';
import { useProductTableActionsSlice } from '../../slice';
import { ProductError } from '../UploadErrorDialog';
import { AdditionalProductItem } from '../../slice/types';

interface ProductTableUploaderProps {
  type: ProjectTypeEnum;
  isDisable?: boolean;
  onError: (err: ProductError[]) => void;
  onOpenError: (open: boolean) => void;
  onDuplicateProducts: (duplicateProducts: AdditionalProductItem[]) => void;
  onOpenDuplicate: (open: boolean) => void;
}

const ProductTableUploader: React.FC<ProductTableUploaderProps> = ({
  type,
  isDisable,
  onError,
  onOpenError,
  onDuplicateProducts,
  onOpenDuplicate,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProductTableActionsSlice();
  const { ProjectDetail } = useSelector(selectProject);

  const { uploadedProductTableList } = useSelector(selectProductTable);

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
        actions.checkFileUpload({ id, formData }, (res?: any) => {
          if (res?.success) {
            //   const data = await ProductTable.checkFileUpload(formData);
            // dispatch(
            //   snackbarActions.updateSnackbar({
            //     message: data.message,
            //     type: 'success',
            //   }),
            // );
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
            // dispatch(
            //   snackbarActions.updateSnackbar({
            //     message: 'Tải file lên không thành công',
            //     type: 'error',
            //   }),
            // );
          }
        }),
      );
    },

    [id, onError, onOpenError],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxFiles: 1,
  });

  const products = uploadedProductTableList?.data.products || [];

  useEffect(() => {
    if (!id) return;
    dispatch(actions.getProductOfProject({ projectId: id }));
  }, [id]);

  // const productTableOfProject = useMemo(() => {
  //   const currentProjectIndex = uploadedProductTableProjectList.findIndex(
  //     p => p.id === id,
  //   );

  //   if (currentProjectIndex !== -1) {
  //     return uploadedProductTableProjectList[currentProjectIndex];
  //   } else return null;
  // }, [id, uploadedProductTableProjectList]);

  // const handleUpload = (val: boolean) => {
  //   setIsUploaded(val);
  // };

  // const handleChangeFile = (newFile: File | null) => {
  //   setCurrentFile(newFile);
  // };

  // useEffect(() => {
  //   return () => {
  //     dispatch(actions.clearCurrentUploadedFile({ id: id ?? '' }));
  //   };
  // }, [dispatch, actions, id]);

  return (
    <Box>
      {products?.length === 0 && !isDisable ? (
        <Box
          sx={{
            height: '100%',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          {...getRootProps()}
        >
          <Box component="label">
            <input
              {...getInputProps()}
              id="upload"
              hidden
              type="file"
              accept="*"
              max-file-size="5120"
            />
          </Box>
          <img src={UPLOAD_FILE_ICON} alt="" />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              textAlign: 'center',
              mb: 2,
              mt: 1.75,
            }}
          >
            Kéo thả file hoặc nhấn vào nút <b>Tải lên bảng hàng</b> để tải file
            bảng hàng lên
          </Typography>
        </Box>
      ) : (
        <ProductTableInfo
          productTableOfProject={products || []}
          projectType={type}
          isDisable={isDisable}
        />
      )}
    </Box>
  );
};

export default ProductTableUploader;
