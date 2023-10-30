import { Box } from '@mui/material';
import React, { Fragment, useCallback, useEffect } from 'react';
import { FileWithPath } from 'react-dropzone';

import { v4 as uuidv4 } from 'uuid';

import { getDimensionsOfImage } from 'utils/helpers';

import { GroundProductTableData } from '../../slice/types';
import FileInfo from '../FileInfo';

interface GroundTableEditorProps {
  currentGroundImage: FileWithPath | null;
  groundProductTableData: GroundProductTableData | undefined | null;
  onDelete: () => void;
  isDisable?: boolean;
}

const GroundTableEditor: React.FC<GroundTableEditorProps> = ({
  currentGroundImage,
  groundProductTableData,
  onDelete,
  isDisable,
}) => {
  const handleInitEditor = useCallback(async () => {
    const randId = uuidv4();

    if (
      groundProductTableData &&
      groundProductTableData.jsonGround &&
      groundProductTableData?.file
    ) {
      const initValue = JSON.parse(groundProductTableData?.jsonGround);
      initValue.artboards[0].image_url = currentGroundImage
        ? URL.createObjectURL(currentGroundImage)
        : `${
            process.env.REACT_APP_API_URL
          }${groundProductTableData?.file.substring(4)}`;

      localStorage.setItem('imageMapProLastSave', initValue.id);
      localStorage.setItem('imageMapProSaves', JSON.stringify([initValue]));

      return;
    }

    if (currentGroundImage) {
      try {
        const imageUrl = URL.createObjectURL(currentGroundImage);
        const { width, height } = await getDimensionsOfImage(imageUrl);

        const initValue = [
          {
            id: randId,
            artboards: [
              {
                background_type: 'image',
                image_url: imageUrl,
                use_image_size: true,
                width,
                height,
                children: [
                  {
                    id: uuidv4(),
                    title: 'Block A',
                    type: 'group',
                  },
                ],
              },
            ],
            version: '6.0.8',
            general: {
              name: 'Untitled',
            },
            lastSaved: new Date().getTime(),
          },
        ];

        localStorage.setItem('imageMapProLastSave', randId);
        localStorage.setItem('imageMapProSaves', JSON.stringify(initValue));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }, [currentGroundImage, groundProductTableData]);

  useEffect(() => {
    handleInitEditor();

    return () => {
      localStorage.removeItem('imageMapProLastSave');
      localStorage.removeItem('imageMapProSaves');
    };
  }, [currentGroundImage, groundProductTableData, handleInitEditor]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = true;

    document.body.appendChild(script);
    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
      window.ImageMapPro = undefined;
    };
  }, [currentGroundImage]);

  return (
    <Fragment>
      <FileInfo
        onDelete={() => !!onDelete && onDelete()}
        currentGroundImage={currentGroundImage}
        groundProductTableData={groundProductTableData}
        isDisable={isDisable}
      />
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 300px)',
        }}
        id="image-map-pro-editor"
      ></Box>
    </Fragment>
  );
};

export default GroundTableEditor;
