import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { BoxProps } from '@mui/system';
import { selectGroundProductTable } from 'app/pages/GroundProductTable/slice/selectors';

import { TooltipDetail } from '../TooltipDetail';
import { selectApartmentInformation } from '../../slice/selectors';

interface GroundPreviewProps extends BoxProps {}

const GroundPreview: React.FC<GroundPreviewProps> = props => {
  const { apartmentInformation } = useSelector(selectApartmentInformation);
  const { groundProductTableData } = useSelector(selectGroundProductTable);
  const ref = useRef<any>(null);
  const [popupData, setPopupData] = React.useState<any[]>([]);
  const [elements, setElements] = React.useState<any[]>([]);

  useEffect(() => {
    if (!ref.current) {
      ref.current = document.createElement('script');
      ref.current.src = '/js/image-map-pro.min.js';
      ref.current.async = true;
      ref.current.onload = onloadScript;
      document.body.appendChild(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onloadScript = () => {
    if (groundProductTableData?.jsonGround && groundProductTableData.file) {
      const data = JSON.parse(groundProductTableData.jsonGround);
      if (data) {
        data.artboards[0].image_url = `${
          process.env.REACT_APP_API_URL
        }${groundProductTableData.file.substring(4)}`;
        window.ImageMapProInstances = window.ImageMapProInstances || [];
        window.ImageMapProInstances.push({
          data,
        });
        setTimeout(() => {
          checkDataAndInitPopup(data);
        }, 500);
        window.ImageMapPro.init('#image-map-pro', data);
      }
      document.body.removeChild(ref.current);
    }
  };

  const checkDataAndInitPopup = (data: any) => {
    const dataRect: any[] = [];
    data.artboards.forEach((element: any) => {
      element.children.forEach((e: any) =>
        e.children.forEach((e2: any) => dataRect.push(e2)),
      );
    });
    const listTiles = dataRect.map((e: any) => e.title);
    const listElement = document.getElementsByClassName('imp-object');
    const jsonGrounds: any[] = [];
    const keys = Object.keys(apartmentInformation?.data || {});
    keys.forEach(e => {
      apartmentInformation?.data[e].forEach((e2: any) => jsonGrounds.push(e2));
    });

    const listPopupData: any[] = [];
    const listElements: any[] = [];
    for (let i = 0; i < listElement.length; i++) {
      const title = listElement[i].getAttribute('data-title');
      listElements.push({ title, data: listElement[i] });
      if (
        title &&
        listTiles.includes(title) &&
        jsonGrounds.map((e: any) => e.code).includes(title) &&
        !listPopupData.includes(jsonGrounds.find(e => e.code === title))
      ) {
        const data = jsonGrounds.find(e => e.code === title);
        listPopupData.push(data);
      }
    }
    setPopupData(listPopupData);
    setElements(listElements);
    // setTimeout(() => {
    //   const impCanvas = document.getElementsByClassName('imp-canvas');
    //   const custom_elements = document.getElementById('custom_elements');
    //   if (impCanvas && custom_elements) {
    //     // const impCanvasHtml = impCanvas[0] as HTMLElement;
    //     // custom_elements.style.width = impCanvasHtml.style.width;
    //     // custom_elements.style.height = impCanvasHtml.style.height;
    //     // custom_elements.style.position = 'relative';
    //     // custom_elements.style.marginTop = `-${impCanvasHtml.style.height}`;
    //   }
    // }, 100);
  };

  const renderBoxElement = (element: HTMLElement, dataKey: string) => {
    const boxKey = dataKey + 'box';
    const data = popupData.find(e => dataKey.includes(e.code));

    // console.log(boxKey);

    setTimeout(() => {
      const _element = document.getElementById(boxKey);

      if (_element) {
        // delete all child of element except polygon
        const nodes = element.childNodes;
        if (nodes.length > 0) {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeName.toLowerCase() !== 'polygon') {
              element.removeChild(node);
            }
          }
        }

        element.setAttribute('data-tooltip-id', dataKey);
        element.insertAdjacentHTML('beforeend', _element.outerHTML);
      }
    }, 100);
    return (
      <Box key={boxKey} id={boxKey}>
        {data && <TooltipDetail id={dataKey} data={data} isPriority={false} />}
      </Box>
    );
  };

  return (
    <Box id="image-map-pro" {...props}>
      {elements.length > 0 && (
        <Box id="custom_elements">
          {elements.map((e, index) => {
            const dataKey = `${e.title}_popup_custom_${index}`;
            return renderBoxElement(e.data, dataKey);
          })}
        </Box>
      )}
    </Box>
  );
};

export default GroundPreview;
