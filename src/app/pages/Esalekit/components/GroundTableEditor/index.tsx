import { Box, Typography, useTheme } from '@mui/material';
import React, { Fragment, useCallback, useEffect } from 'react';
import CustomButton from 'app/components/Button';
import { FileWithPath } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { GroundProductTableData } from 'app/pages/GroundProductTable/slice/types';
import { getDimensionsOfImage } from 'utils/helpers';

import { useDispatch, useSelector } from 'react-redux';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { useEsalekitSlice } from '../../slice';
import { PayloadCreateGround } from '../../slice/types';
import { selectEsalekit } from '../../slice/selectors';

interface GroundTableEditorProps {
  id: string;
}

const GroundTableEditor: React.FC<GroundTableEditorProps> = ({ id }) => {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { HeaderDetail } = useSelector(selectEsalekit);

  useEffect(() => {
    return () => {
      localStorage.removeItem('imageMapProLastSave');
      localStorage.removeItem('imageMapProSaves');
    };
  }, []);

  const handleInitEditor = () => {
    const randId = uuidv4();
    if (!HeaderDetail?.data) {
      return;
    }
    const data = JSON.parse(HeaderDetail?.data);
    if (data) {
      const initValue = data[0];
      localStorage.setItem('imageMapProLastSave', initValue.id);
      localStorage.setItem('imageMapProSaves', JSON.stringify([initValue]));
    }
  };

  useEffect(() => {
    fetchGalleryHeader();
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      window.ImageMapPro = undefined;
    };
  }, []);

  useEffect(() => {
    handleInitEditor();
  }, [HeaderDetail?.data]);

  const fetchGalleryHeader = () => {
    if(id){
      dispatch(EsalekitActions.getHeadertab({ id }));
    }
  };

  return (
    <Fragment>
      <Box
        sx={{
          textAlign: 'right',
        }}
      >
        <img />
        <Typography
          sx={{
            fontSize: '14px',
            textAlign: 'right',
            color: '#E42B2C',
          }}
        >
          *Lưu ý: ảnh sử dụng có kích thước chuẩn tối thiểu 1366x768 hoặc theo
          tỉ lệ 16:9 để đảm bảo hiển thị không bị lỗi
        </Typography>
        {/* <CustomButton
          title="Lưu"
          variant="contained"
          isIcon
          buttonMode="create-click"
          handleClick={handleSave}
          light
          sxProps={{
            borderRadius: '5px',
            marginBottom: '8px',
          }}
        /> */}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '70vh',
        }}
        id="image-map-pro-editor"
      ></Box>
    </Fragment>
  );
};

export default GroundTableEditor;
