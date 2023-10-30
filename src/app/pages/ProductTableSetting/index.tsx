import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  Stack,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { FileWithPath, useDropzone } from 'react-dropzone';
import useTabs from 'app/hooks/useTabs';

import BACK_ICON from 'assets/background/backleft-icon.svg';

import path from 'app/routes/path';

import TextFieldCustom from 'app/components/TextFieldCustom';
import ProductTable from 'services/api/productTable';

import { ProjectTypeEnum } from 'types/Project';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';

import { useGroundProductTableSlice } from '../GroundProductTable/slice';
import { useProjectSlice } from '../Projects/slice';
import { selectProject } from '../Projects/slice/selector';
import { GroundProductTable } from '../GroundProductTable';

import ProductTableForm from './components/ProductTableForm';
import ProductTableUploader from './components/ProductTableUploader';
import { ProductTableProvider } from './context/RootContext';

import { selectProductTable } from './slice/selectors';
import { useProductTableActionsSlice } from './slice';
import UploadButton from './UploadButton';
import UploadErrorDialog, {
  ProductError,
} from './components/UploadErrorDialog';
import { AdditionalProductItem } from './slice/types';
import UploadDuplicateDialog from './components/UploadDuplicateDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  [key: string]: any;
}

interface StateLocationProps {
  tabActive?: number;
}

export function ProductTableSetting() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userInfo = useProfile();
  const { actions } = useProjectSlice();
  const { ProjectDetail } = useSelector(selectProject);
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const createProductTableRef = useRef<HTMLFormElement>(null);
  const [showPrice, setShowPrice] = useState(true);
  const [currentGroundImage, setCurrentGroundImage] =
    useState<FileWithPath | null>(null);
  const { handleTabChange, activeTab, setActiveTab } = useTabs(0);
  const { uploadedProductTableList } = useSelector(selectProductTable);

  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: groundActions } = useGroundProductTableSlice();
  const { actions: productTableActions } = useProductTableActionsSlice();

  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<ProductError[]>([]);

  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [duplicateProducts, setDuplicateProducts] = useState<
    AdditionalProductItem[]
  >([]);

  const locationProps = state as StateLocationProps;

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailProject({ id }));
    }

    return () => {
      dispatch(actions.clearDataProject());
      dispatch(productTableActions.clearUploadedProductTable());
    };
  }, [actions, dispatch, id]);

  useEffect(() => {
    if (locationProps?.tabActive) {
      setActiveTab(locationProps?.tabActive);
    }
  }, [locationProps?.tabActive, setActiveTab]);

  useEffect(() => {
    if (
      !uploadedProductTableList ||
      uploadedProductTableList.data.products.length === 0
    )
      return;

    const isShowPrice = uploadedProductTableList.data.products[0].showPrice;

    setShowPrice(isShowPrice ?? true);
  }, [uploadedProductTableList]);

  const handleCancel = () => navigate(path.project);

  const handleGroundImageChange = (file: FileWithPath | null) => {
    setCurrentGroundImage(file);
  };

  // const isShapeNamed = (shape: any) => {
  //   return shape.tooltip_content && shape.tooltip_content[0].text.trim() !== '';
  // };

  const isGroupValid = (groups: any) => (fn: any) => {
    return groups.artboards[0].children.every(fn);
  };

  const isGroundDataValid = () => {
    const currentSaveId = localStorage.getItem('imageMapProLastSave');
    if (!currentSaveId) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Chưa có thông tin bảng hàng',
          type: 'error',
        }),
      );
      return;
    }

    const rawGroundData = localStorage.getItem('imageMapProSaves');
    if (!rawGroundData) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'An error has been occurred',
          type: 'error',
        }),
      );
      return;
    }

    const groundData: any[] = JSON.parse(rawGroundData);
    const currentGroundData = groundData.find(
      (d: any) => d.id === currentSaveId,
    );

    if (!currentGroundData.artboards[0].children) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Chưa có phân khu nào',
          type: 'error',
        }),
      );
      return;
    }

    // const allHaveGroup = currentGroundData.artboards[0].children.every(
    //   (child: any) => child.type === 'group',
    // );

    const providedGroups = isGroupValid(currentGroundData);

    const allHaveGroup = providedGroups((child: any) => child.type === 'group');
    if (!allHaveGroup) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Một hoặc nhiều sản phẩm chưa được thêm vào phân khu',
          type: 'error',
        }),
      );
      return;
    }

    const allGroupHaveName = providedGroups(
      (child: any) => child.title.trim() !== '',
    );
    if (!allGroupHaveName) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Một hoặc nhiều phân khu chưa được đặt tên',
          type: 'error',
        }),
      );
      return;
    }

    const allGroupHaveChild = providedGroups(
      (child: any) => child.children && child.children.length > 0,
    );
    if (!allGroupHaveChild) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Một hoặc nhiều phân khu chưa có sản phẩm',
          type: 'error',
        }),
      );
      return;
    }

    const allGroupChildIsElement = providedGroups(
      (child: any) =>
        allGroupHaveChild &&
        child.children.every((item: any) => item.type !== 'group'),
    );
    if (!allGroupChildIsElement) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Một hoặc nhiều phân khu đang bị lồng nhau',
          type: 'error',
        }),
      );
      return;
    }

    return currentGroundData;
  };

  const handleSaveGroundProductTable = async () => {
    const validData = isGroundDataValid();
    if (validData && id) {
      const formData = new FormData();
      formData.append('json', JSON.stringify(validData));
      if (currentGroundImage) formData.append('file', currentGroundImage);
      dispatch(
        groundActions.createGroundProductTable(
          { projectId: id, formData },
          (err: any) => {
            if (err.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo bảng hàng đất nền thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Tạo bảng hàng đất nền không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
  };

  const handleCreateProductTable = (type: ProjectTypeEnum | undefined) => {
    switch (type) {
      case ProjectTypeEnum.APARTMENT:
        createProductTableRef.current?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
        return;
      case ProjectTypeEnum.GROUND:
        handleSaveGroundProductTable();
        break;
      default:
        console.log('Error');
    }
  };

  const handleSaveProducts = async () => {
    if (!id) return;
    try {
      const productsPayload = uploadedProductTableList.data.products.map(
        item => {
          const { uuid, ...rest } = item;
          return rest;
        },
      );

      const data = await ProductTable.uploadProductTable({
        projectId: id,
        data: productsPayload,
        showPrice,
      });
      dispatch(productTableActions.getProductOfProject({ projectId: id }));
      dispatch(
        snackbarActions.updateSnackbar({
          message: data.message,
          type: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Lưu không thành công',
          type: 'error',
        }),
      );
    }
  };

  // handle upload error
  const handleOpenErrorDialog = (open: boolean) => {
    setOpenErrorDialog(open);
  };

  const handleChangeError = (error: ProductError[]) => {
    setUploadErrors(error);
  };

  const handleOpenDuplicateDialog = (open: boolean) => {
    setOpenDuplicateDialog(open);
  };

  const handleDuplicateProducts = (
    duplicateProducts: AdditionalProductItem[],
  ) => {
    setDuplicateProducts(duplicateProducts);
  };

  return (
    <>
      <Fragment>
        <Box
          sx={{
            display: 'flex',
            mb: 3,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
              <img src={BACK_ICON} onClick={handleCancel} alt="" />
            </Box>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              {'Thiết lập bảng hàng'}
            </Typography>
          </Box>
          <ChildrenTab value={activeTab} index={0}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomButton
                title="Lưu cập nhật"
                isIcon
                isDisable={!canEdit}
                typeButton={'submit'}
                sxProps={{
                  ml: '16px',
                  borderRadius: '8px',
                  width: { xs: 'auto' },
                  height: { xs: '44px' },
                }}
                sxPropsText={{ fontSize: '14px' }}
                handleClick={() =>
                  handleCreateProductTable(ProjectDetail?.type)
                }
              />
            </Box>
          </ChildrenTab>
          <ChildrenTab value={activeTab} index={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UploadButton
                isDisable={!canEdit}
                onError={handleChangeError}
                onOpenError={handleOpenErrorDialog}
                onDuplicateProducts={handleDuplicateProducts}
                onOpenDuplicate={handleOpenDuplicateDialog}
              />
              {canEdit ? (
                <Link
                  style={{ color: 'transparent' }}
                  to={`/static/template/${
                    ProjectDetail?.type === ProjectTypeEnum.APARTMENT
                      ? 'template_ProductTable'
                      : 'template_GroundProductTable'
                  }.xlsx`}
                  download="Template_BangHang"
                  target="_blank"
                >
                  <CustomButton
                    title="Tải về mẫu"
                    buttonMode="download"
                    isIcon
                    sxProps={{
                      ml: '16px',
                      borderRadius: '8px',
                      width: { xs: 'auto' },
                      height: { xs: '44px' },
                    }}
                    sxPropsText={{ fontSize: '14px' }}
                  />
                </Link>
              ) : (
                <CustomButton
                  title="Tải về mẫu"
                  buttonMode="download"
                  isIcon
                  isDisable={!canEdit}
                  sxProps={{
                    ml: '16px',
                    borderRadius: '8px',
                    width: { xs: 'auto' },
                    height: { xs: '44px' },
                  }}
                  sxPropsText={{ fontSize: '14px' }}
                />
              )}

              <CustomButton
                title="Lưu cập nhật"
                isIcon
                isDisable={!canEdit}
                typeButton={'submit'}
                sxProps={{
                  ml: '16px',
                  borderRadius: '8px',
                  width: { xs: 'auto' },
                  height: { xs: '44px' },
                }}
                sxPropsText={{ fontSize: '14px' }}
                handleClick={handleSaveProducts}
              />
            </Box>
          </ChildrenTab>
        </Box>

        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              width: '100%',
              height: '100%',

              '& .MuiTab-root.Mui-selected': {
                color: theme.palette.common.black,
                fontWeight: 700,
              },
              background: theme.palette.grey[300],
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: palette.primary.button,
              },
            }}
          >
            <Tab
              sx={{ fontSize: '16px', fontWeight: 400 }}
              label="Tạo bảng hàng"
            />
            <Tab
              sx={{ fontSize: '16px', fontWeight: 400 }}
              label="Quản lý sản phẩm"
            />
          </Tabs>
        </Paper>
        <Box
          sx={{
            // backgroundColor: theme.palette.grey[0],
            marginTop: '8px',
            // borderRadius: '20px',
            height: '100%',
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ChildrenTab value={activeTab} index={0}>
            <Stack
              sx={{
                p: 3,
                height: '100%',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '20px',
              }}
            >
              {ProjectDetail && (
                <>
                  {ProjectDetail.type === ProjectTypeEnum.APARTMENT && (
                    <ProductTableForm
                      ref={createProductTableRef}
                      isDisable={!canEdit}
                    />
                  )}
                  {ProjectDetail.type === ProjectTypeEnum.GROUND && (
                    <GroundProductTable
                      currentGroundImage={currentGroundImage}
                      onFileChange={handleGroundImageChange}
                      isDisable={!canEdit}
                    />
                  )}
                </>
              )}
            </Stack>
          </ChildrenTab>
          <ChildrenTab
            value={activeTab}
            index={1}
            sx={{
              height: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 2,
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '20px',
                flex: 1,
              }}
            >
              <ProductTableProvider
                value={{
                  showPrice,
                  setShowPrice,
                }}
              >
                {ProjectDetail && (
                  <>
                    <ProductTableUploader
                      type={ProjectDetail.type}
                      onError={handleChangeError}
                      onOpenError={handleOpenErrorDialog}
                      onDuplicateProducts={handleDuplicateProducts}
                      onOpenDuplicate={handleOpenDuplicateDialog}
                      isDisable={!canEdit}
                    />
                    <UploadErrorDialog
                      isOpen={openErrorDialog}
                      onClose={() => setOpenErrorDialog(false)}
                      err={uploadErrors}
                    />
                    <UploadDuplicateDialog
                      isOpen={openDuplicateDialog}
                      onClose={() => setOpenDuplicateDialog(false)}
                      duplicateProducts={duplicateProducts}
                    />
                  </>
                )}
              </ProductTableProvider>
            </Box>
          </ChildrenTab>
          <ChildrenTab value={activeTab} index={2}>
            {/* <ListDeposit /> */}
          </ChildrenTab>
        </Box>
      </Fragment>
    </>
  );
}

const ChildrenTab = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <>
      {value === index && (
        <Box
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          sx={{
            height: '100%',
          }}
          {...other}
        >
          {children}
        </Box>
      )}
    </>
  );
};
