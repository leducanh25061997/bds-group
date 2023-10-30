import { useEffect, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import pluginWeb from 'grapesjs-preset-webpage';
import pluginCkeditor from 'grapesjs-plugin-ckeditor';
import pluginform from 'grapesjs-plugin-forms';
import pluginBasic from 'grapesjs-blocks-basic';
import pluginCustomcode from 'grapesjs-custom-code';
import pluginCountdonwn from 'grapesjs-component-countdown';
import pluginExport from 'grapesjs-plugin-export';
import pluginTooltip from 'grapesjs-tooltip';
import pluginImage from 'grapesjs-tui-image-editor';
import pluginStyleBg from 'grapesjs-style-bg';
import axios from 'axios';
import { createService } from 'services/api/axios';
import document from 'services/api/document';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbarSlice } from '../Snackbar/slice';
import { useEsalekitSlice } from 'app/pages/Esalekit/slice';
import { TabMediaTypeEnum } from 'types/Enum';
import { PayloadCreateGallery } from 'app/pages/Esalekit/slice/types';
import { selectEsalekit } from 'app/pages/Esalekit/slice/selectors';
import { renderFile } from 'utils/helpers';

const instance = createService(process.env.REACT_APP_API_URL);
interface Props {
  id: string;
  esalekitId: string | undefined;
}
declare class Asset {
	static getDefaults(): any;
	defaults(): {
		type: string;
		src: string;
	};
	/**
	 * Get asset type.
	 * @returns {String}
	 * @example
	 * // Asset: { src: 'https://.../image.png', type: 'image' }
	 * asset.getType(); // -> 'image'
	 * */
	getType(): any;
	/**
	 * Get asset URL.
	 * @returns {String}
	 * @example
	 * // Asset: { src: 'https://.../image.png'  }
	 * asset.getSrc(); // -> 'https://.../image.png'
	 * */
	getSrc(): any;
	/**
	 * Get filename of the asset (based on `src`).
	 * @returns {String}
	 * @example
	 * // Asset: { src: 'https://.../image.png' }
	 * asset.getFilename(); // -> 'image.png'
	 * // Asset: { src: 'https://.../image' }
	 * asset.getFilename(); // -> 'image'
	 * */
	getFilename(): any;
	/**
	 * Get extension of the asset (based on `src`).
	 * @returns {String}
	 * @example
	 * // Asset: { src: 'https://.../image.png' }
	 * asset.getExtension(); // -> 'png'
	 * // Asset: { src: 'https://.../image' }
	 * asset.getExtension(); // -> ''
	 * */
	getExtension(): any;
}

function Editor(props: Props) {
  const { id, esalekitId } = props;
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: EsalekitActions } = useEsalekitSlice();
  const { GalleryHeaderManager } = useSelector(selectEsalekit);
  const [gallery, setGallery]= useState([]);

  const handleCheckCapacityFile = (files: File[]) => {
    if (!files.length) return;
    if (files.length > 5) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tối đa chỉ được tải lên 5 tệp!',
          type: 'error',
        }),
      );
      return;
    }
  };

  // useEffect(()=>{
  //   if(GalleryHeaderManager){
  //     let gallery: any = []
  //     GalleryHeaderManager.forEach((element)=>{
  //       gallery.push({
  //         category: element.id,
  //         src: renderFile(element.url),
  //         type: 'image',
  //         height: 100,
  //         width: 200,    
  //       })
  //     });
  //     console.log('gallery', gallery);
      
  //     setGallery(gallery);
  //   }
  // },[GalleryHeaderManager])

  useEffect(() => {
    dispatch(EsalekitActions.getGalleryHeader({ id: id }));
    const editor = grapesjs.init({
      container: '#gjs',
      height: '700px',
      width: '100%',
      plugins: [
        pluginWeb,
        pluginCkeditor,
        pluginform,
        pluginBasic,
        pluginCustomcode,
        pluginCountdonwn,
        pluginExport,
        pluginTooltip,
        pluginImage,
        // pluginStyleBg, // option này làm web bị blank trên device của apple (ipad, safari)
      ],
      storageManager: {
        id: `gjs-${id}`,
        type: 'remote',
        autosave: true,
      },
      assetManager: {
        assets: [],
        embedAsBase64: true,
        dropzone: true,
        openAssetsOnDrop: true,
        showUrlInput: true,
        uploadFile: async function (e: any) {
          var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          handleCheckCapacityFile(files);
          const fileId = await document.uploadFilesPath(files);
          if (fileId?.length && fileId) {
            await fileId.forEach((element: any) => {
              editor.AssetManager.add({src: renderFile(element?.path), id: element?.id});
            });
          }
        },
        multiUpload: true
      },
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'Desktop',
            width: '',
          },
          {
            id: 'tablet',
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            id: 'mobilePortrait',
            name: 'Mobile portrait',
            width: '320px',
            widthMedia: '575px',
          },
        ],
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css?family=Archivo+Narrow:400,400i,700,700i|Roboto:300,300i,400,400i,500,500i,700,700i&s...tin-ext',
        ],
      },
      pluginsOpts: {
        'grapesjs-blocks-basic': {
          blocksBasicOpts: {
            blocks: [
              'column1',
              'column2',
              'column3',
              'column3-7',
              'divider',
              'text',
              'link',
              'image',
              'video',
              'map',
              'link-block',
              'quote',
              'text-basic',
              'form',
              'input',
              'textarea',
              'select',
              'button',
              'label',
              'checkbox',
              'radio',
            ],
            flexGrid: 1,
          },
          blocks: [
            'column1',
            'column2',
            'column3',
            'column3-7',
            'divider',
            'text',
            'link',
            'image',
            'video',
            'map',
            'link-block',
            'quote',
            'text-basic',
            'form',
            'input',
            'textarea',
            'select',
            'button',
            'label',
            'checkbox',
            'radio',
          ],
        },
      },
    });

    editor.on('asset:upload:start', () => {
      console.log('getGalleryHeaderaaaaaa');
    });

    editor.on('asset:upload:end', () => {
      console.log('getGalleryHeaderaaaaaa');
    });

    editor.Storage.add('remote', {
      async load() {
        const respone = await instance.get(
          `/api/preview-esalekit/header-tab/${id}`,
        );
        return JSON.parse(respone.data?.data);
      },

      async store(data) {
        const textComp = editor.getHtml();
        const cssComp = editor.getCss();
        return await instance.patch(`/api/esalekit/header-tab/${id}`, {
          data: JSON.stringify(data),
          html: textComp + `<style>${cssComp}</style>`,
        });
      },
    });
  }, [id]);

  return <div id="gjs"></div>;
}
export default Editor;
