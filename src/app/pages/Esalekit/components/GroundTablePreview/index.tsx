import { Box } from '@mui/material';
import React, { Fragment, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';

import { useEsalekitSlice } from '../../slice';
import { selectEsalekit } from '../../slice/selectors';
import './css/image-map-pro.css';

interface GroundTableEditorProps {
  id: string;
}

const GroundTablePreview: React.FC<GroundTableEditorProps> = ({ id }) => {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { HeaderDetail } = useSelector(selectEsalekit);

  useEffect(() => {
    fetchGalleryHeader();
  }, []);

  useEffect(() => {
    if(id){
      const fetchGalleryHeader = async () => {
        dispatch(EsalekitActions.getHeadertab({ id }));
      };
  
      const initializeImageMapPro = () => {
        const script = document.createElement('script');
        script.src = '/js/image-map-pro.min.js';
        script.async = true;
        script.onload = () => {
          if (HeaderDetail?.data) {
            const data = JSON.parse(HeaderDetail.data);
            if (data) {
              const initValue = data[0];
              localStorage.setItem('imageMapProLastSave', initValue.id);
              localStorage.setItem(
                'imageMapProSaves',
                JSON.stringify([initValue]),
              );
  
              window.ImageMapProInstances = window.ImageMapProInstances || [];
              window.ImageMapProInstances.push({
                initValue,
              });
  
              window.ImageMapPro.init('#image-map-pro', initValue);
            }
          }
        };
  
        document.body.appendChild(script);
      };
  
      const checkElementExistence = () => {
        const element = document.getElementById('image-map-pro');
        if (!element) {
          setTimeout(checkElementExistence, 100);
        } else {
          initializeImageMapPro();
        }
      };
      fetchGalleryHeader();
      checkElementExistence();
    }
   
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
          width: '100%',
          height: '100%',
        }}
        id="image-map-pro"
      ></Box>
    </Fragment>
  );
};

export default GroundTablePreview;
