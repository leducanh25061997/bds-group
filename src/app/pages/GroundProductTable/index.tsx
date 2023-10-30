import { Box, Typography, Stack } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import React, { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingScreen } from 'app/components/Table';

import { useGroundProductTableSlice } from './slice';
import GroundImageUploader from './components/GroundImageUploader';
import GroundTableEditor from './components/GroundTableEditor';
import { selectGroundProductTable } from './slice/selectors';

declare global {
  interface Window {
    ImageMapPro: any; // Adjust the type according to the 'ImageMapPro' object
    ImageMapProInstances: any;
  }
}

interface GroundProductTableProps {
  onFileChange: (file: FileWithPath | null) => void;
  currentGroundImage: FileWithPath | null;
  isDisable?: boolean;
}

export const GroundProductTable: React.FC<GroundProductTableProps> = ({
  onFileChange,
  currentGroundImage,
  isDisable,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useGroundProductTableSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const [isTempEdit, setIsTempEdit] = useState(false);

  const { groundProductTableData, isLoading } = useSelector(
    selectGroundProductTable,
  );

  const hasData =
    !!groundProductTableData && groundProductTableData.data.length > 0;

  const handleFileChange = (file: FileWithPath | null) => {
    onFileChange(file);
    // setIsTempEdit(true);
  };

  const handleDelete = () => {
    setIsTempEdit(true);
    handleFileChange(null);
  };

  useEffect(() => {
    if (id) {
      dispatch(
        actions.getGroundProductTable({ id }, (err: any) => {
          if (!err?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Lấy thông tin bảng hàng không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  }, [dispatch, id, actions]);

  // if (isLoading) {
  //   return (
  //     <LoadingScreen key={'hey'}>
  //       <img src="/static/loader/spinner.svg" alt="" width={100} height={100} />
  //     </LoadingScreen>
  //   );
  // }

  const renderUI = () => {
    if (isLoading) {
      return (
        <LoadingScreen key={'hey'}>
          <img
            src="/static/loader/spinner.svg"
            alt=""
            width={100}
            height={100}
          />
        </LoadingScreen>
      );
    }

    if (!isLoading && hasData) {
      if (isTempEdit && !currentGroundImage) {
        return <GroundImageUploader onFileChange={handleFileChange} />;
      }

      if (isTempEdit && currentGroundImage) {
        return (
          <GroundTableEditor
            onDelete={handleDelete}
            currentGroundImage={currentGroundImage}
            groundProductTableData={groundProductTableData}
            isDisable={isDisable}
          />
        );
      }

      if (isTempEdit) {
        return <GroundImageUploader onFileChange={handleFileChange} />;
      } else {
        return (
          <GroundTableEditor
            onDelete={handleDelete}
            currentGroundImage={currentGroundImage}
            groundProductTableData={groundProductTableData}
            isDisable={isDisable}
          />
        );
      }
    } else {
      if (!currentGroundImage) {
        return <GroundImageUploader onFileChange={handleFileChange} />;
      } else {
        return (
          <GroundTableEditor
            onDelete={handleDelete}
            currentGroundImage={currentGroundImage}
            groundProductTableData={groundProductTableData}
            isDisable={isDisable}
          />
        );
      }
    }
  };

  return <>{renderUI()}</>;
};
