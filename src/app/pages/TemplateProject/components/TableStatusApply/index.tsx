import { Box, IconButton, Typography } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import Table from 'app/components/Table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterParams, TableHeaderProps } from 'types';
import CloseIcon from '@mui/icons-material/Close';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import ICON_DELETE from 'assets/background/icon-delete-file-light.svg';
import palette from 'styles/theme/palette';
import { useDispatch, useSelector } from 'react-redux';
import { useFilter, useProfile } from 'app/hooks';
import { ApplicableStatus, TransferTextApplicableStatus } from 'types/Enum';
import { get } from 'lodash';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useParams } from 'react-router-dom';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import { ChipItemSelect } from '../DocumentPrinted';
import TemplateProjectDialog from '../TemplateProjectDialog';
import { useManagementTemplateSlice } from '../../slice';
import { selectManagementTemplate } from '../../slice/selectors';
import { PayloadUpdateFileDocument, fileDocumentitem } from '../../slice/types';

interface PopupDeleteProps {
  isOpen: boolean;
  itemSelect?: fileDocumentitem | null;
}

export default function TableStatusApply() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useManagementTemplateSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { documentManagement, isLoading } = useSelector(
    selectManagementTemplate,
  );
  const { id } = useParams();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      projectID: id,
    };
  }, [id]);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [showPopupDelete, setShowPopupDelete] = useState<PopupDeleteProps>({
    isOpen: false,
    itemSelect: null,
  });

  const userInfo = useProfile();

  const canEdit = checkPermissionExist(
    PermissionKeyEnum.PROJECT_SETTING_UPDATE,
    userInfo,
  );

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListTemplateDocument(params));
  };
  // const { filter, onFilterToQueryString } = useFilter({
  //   onFetchData: (params: FilterParams) => {
  //     fetchDataForPage(params);
  //   },
  //   defaultFilter: initialFilter,
  // });

  useEffect(() => {
    fetchDataForPage(filterSelect);
  }, [filterSelect]);

  const onPageChange = (page: number) => {
    setFilterSelect({ ...filterSelect, page });
  };

  const onPageSizeChange = (limit: number) => {
    setFilterSelect({ ...filterSelect, page: 1, limit });
  };
  const [isOpenEditDocument, setIsOpenEditDocument] =
    useState<PopupDeleteProps>({
      itemSelect: null,
      isOpen: false,
    });
  const renderStatusSelected = (itemStatus: ApplicableStatus) => {
    return (
      <ChipItemSelect>
        <Typography
        // sx={{ mr: '10px' }}
        >
          {get(TransferTextApplicableStatus, itemStatus)}
        </Typography>
        {/* <CloseIcon
          sx={{
            width: '16px',
            height: '16px',
            color: palette.primary.darkRed,
            cursor: 'pointer',
          }}
          onClick={() => {}}
        /> */}
      </ChipItemSelect>
    );
  };
  const header: TableHeaderProps[] = useMemo(() => {
    return canEdit
      ? [
          {
            id: 'id',
            label: 'STT',
            align: 'left',
            width: 100,
          },
          {
            id: 'id',
            label: 'Tên file',
            align: 'left',
            width: 300,
          },
          {
            id: 'id',
            label: 'Trạng thái áp dụng',
            align: 'left',
            width: 500,
          },
          {
            id: 'options',
            label: '',
            width: 150,
            align: 'left',
          },
        ]
      : [
          {
            id: 'id',
            label: 'STT',
            align: 'left',
            width: 100,
          },
          {
            id: 'id',
            label: 'Tên file',
            align: 'left',
            width: 300,
          },
          {
            id: 'id',
            label: 'Trạng thái áp dụng',
            align: 'left',
            width: 500,
          },
        ];
  }, [canEdit]);

  const handleClosePopupDeleteDocumentPrint = () => {
    setShowPopupDelete({
      isOpen: false,
      itemSelect: null,
    });
  };
  const handleConfirmDeleteDocumentPrint = () => {
    if (showPopupDelete.itemSelect) {
      const payload = {
        id: showPopupDelete.itemSelect?.id,
      };
      dispatch(
        actions.deleteTemplateDocumentPrint(payload, (err?: any) => {
          if (err?.success) {
            handleClosePopupDeleteDocumentPrint();
            dispatch(actions.fetchListTemplateDocument(filterSelect));
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Xóa tài liệu in thành công',
                type: 'success',
              }),
            );
          } else {
            let message = err?.response?.data?.message;
            if (err?.code === 500) {
              message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
            }
            dispatch(
              snackbarActions.updateSnackbar({
                message: message || 'Xóa tài liệu in không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  const renderItem = (item: fileDocumentitem, index: number) => {
    return canEdit
      ? [
          <EllipsisText text={`${index + 1}`} line={1} />,
          <EllipsisText
            text={`${item?.image?.path || ''}`}
            line={2}
            color={'#007AFF'}
            handleClick={event => {
              event.stopPropagation();
              // const url = item?.image?.path
              //   ? process.env.REACT_APP_API_URL + `/${item?.image?.path}`
              //   : '';
              // if (url) {
              //   window.open(url, '_blank');
              // }
            }}
          />,
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {item?.applicableStatus?.map(e => renderStatusSelected(e))}
          </Box>,
          <Box style={{ display: 'flex' }}>
            <IconButton
              sx={{ ml: 2 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setIsOpenEditDocument({
                  isOpen: true,
                  itemSelect: item,
                });
              }}
            >
              <img alt="edit icon" src={EDIT_ICON} />
            </IconButton>
            <IconButton
              sx={{ ml: 2 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setShowPopupDelete({
                  isOpen: true,
                  itemSelect: item,
                });
              }}
            >
              <img alt="delete icon" src={ICON_DELETE} />
            </IconButton>
          </Box>,
        ]
      : [
          <EllipsisText text={`${index + 1}`} line={1} />,
          <EllipsisText
            text={`${item?.image?.path || ''}`}
            line={2}
            color={'#007AFF'}
            handleClick={event => {
              event.stopPropagation();
              // const url = item?.image?.path
              //   ? process.env.REACT_APP_API_URL + `/${item?.image?.path}`
              //   : '';
              // if (url) {
              //   window.open(url, '_blank');
              // }
            }}
          />,
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {item?.applicableStatus?.map(e => renderStatusSelected(e))}
          </Box>,
        ];
  };
  const handleClosePopup = () => {
    setIsOpenEditDocument({
      isOpen: false,
      itemSelect: null,
    });
    dispatch(actions.clearDataDocumentDetail());
  };
  const handleSubmit = (payload: PayloadUpdateFileDocument) => {
    dispatch(
      actions.updateTemplateDocumentPrint(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'cập nhật tài liệu in thành công',
              type: 'success',
            }),
          );
          dispatch(actions.fetchListTemplateDocument(filterSelect));
        } else {
          let message = err?.response?.data?.message;
          if (err?.code === 500) {
            message = 'Đã có lỗi xảy ra. Hãy thử lại sau!';
          }
          dispatch(
            snackbarActions.updateSnackbar({
              message: message || 'cập nhật tài liệu in không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
    handleClosePopup();
  };
  return (
    <Box
      sx={{
        my: '8px',
        '& .MuiGrid-root .MuiTableContainer-root': {
          minHeight: 'unset',
        },
      }}
    >
      <Table
        headers={header}
        renderItem={renderItem}
        // onClickRow={handleSelectRow}
        items={documentManagement?.data}
        totalElements={documentManagement?.total}
        sort={filterSelect.orderBy}
        limitElement={filterSelect.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading[actions.fetchListTemplateDocument.type]}
      />

      <TemplateProjectDialog
        isOpen={isOpenEditDocument.isOpen}
        itemSelect={isOpenEditDocument.itemSelect}
        title={'Chỉnh sửa tài liệu in'}
        handleClose={handleClosePopup}
        handleSubmit={handleSubmit}
        type={'document'}
        maxWidth="md"
      />
      <ConfirmDialog
        isOpen={showPopupDelete.isOpen}
        handleClose={handleClosePopupDeleteDocumentPrint}
        handleSubmit={handleConfirmDeleteDocumentPrint}
        buttonMode="unset"
        actionName="Xác nhận"
      >
        <Box
          sx={{
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400,
            mb: '16px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '24px',
              mb: '16px',
            }}
          >
            Xóa tài liệu in
          </Typography>
          <span>
            Bạn có chắc chắn muốn xóa tài liệu in{' '}
            <strong>{showPopupDelete?.itemSelect?.image?.path}</strong> này hay
            không?
          </span>
        </Box>
      </ConfirmDialog>
    </Box>
  );
}
