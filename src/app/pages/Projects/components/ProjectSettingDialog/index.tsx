import { Box, Dialog, Stack, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useProfile } from 'app/hooks';
import { useSaleEventControlSlice } from 'app/pages/SaleEventControl/slice';
import { selectSaleEventControl } from 'app/pages/SaleEventControl/slice/selector';
import deleteIcon from 'assets/background/close-icon.svg';
import EDIT_ICON from 'assets/background/edit-project-icon.svg';
import LOCATION_ICON from 'assets/background/location-icon.svg';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import { PermissionKeyEnum } from 'types/Permission';
import { ProjectItem } from 'types/Project';
import {
  RenderClassicProduct,
  checkPermissionExist,
  renderFile,
} from 'utils/helpers';

import { useProjectSlice } from '../../slice';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  hanldeSettingTable: (id: string) => void;
  handleSettingProject: (id: string) => void;
  hanldeManagerTransfer: (id: string) => void;
  hanldeManagerEsalekit: (item: any) => void;
  hanldePreviewProject: (item: any) => void;
  hanldeSaleEvent: () => void;
  hanldeEditProject: (id: any) => void;
  actionName: string;
  actionCancel?: string;
  isIcon?: boolean;
  data?: ProjectItem;
}

export default function ProjectSettingDialog(props: Props) {
  const {
    isOpen,
    handleClose,
    hanldeSettingTable,
    handleSettingProject,
    hanldeManagerTransfer,
    hanldeManagerEsalekit,
    hanldeSaleEvent,
    hanldePreviewProject,
    hanldeEditProject,
    data,
  } = props;
  const { t } = useTranslation();
  const userInfo = useProfile();
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();
  const { permission } = useSelector(selectSaleEventControl);
  const { actions: actionsProject } = useProjectSlice();

  const isShowEventSaleButton = useMemo(() => {
    return (
      (permission?.isAdmin &&
        checkPermissionExist(PermissionKeyEnum.EVENT_SALES_OPEN, userInfo)) ||
      permission?.isSupport ||
      permission?.salesUnit.isManager ||
      permission?.salesUnit.isStaff
    );
  }, [permission, userInfo]);

  useEffect(() => {
    if (data?.id) {
      dispatch(actions.checkEventSalesPermission({ projectId: data.id }));
      dispatch(actionsProject.getDetailProject({ id: data.id }));
    }
  }, [data?.id]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          height: 'max-content',
          padding: '20px 16px 25px 20px',
          width: { md: '405px' },
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {checkPermissionExist(PermissionKeyEnum.PROJECT_UPDATE, userInfo) && (
          <img
            className="absolute cursor-pointer top-4 right-12"
            src={EDIT_ICON}
            onClick={() => hanldeEditProject(data?.id)}
          />
        )}

        <img
          src={deleteIcon}
          alt="delete-icon"
          className="absolute cursor-pointer top-4 right-4"
          onClick={handleClose}
          height={20}
          width={20}
        />

        <Stack sx={{ flexDirection: 'row', mt: 2.5 }}>
          <Box>
            <img
              style={{ borderRadius: '12px', width: '102px', height: '84px' }}
              src={`${renderFile(data?.image?.path)}`}
            />
          </Box>
          <Box ml={1.5}>
            <Typography
              fontWeight={700}
              fontSize={'20px'}
              color={palette.common.black}
            >
              {data?.name}
            </Typography>
            <Box
              p={'3px 9px'}
              sx={{
                background: '#CCE4FF',
                borderRadius: '30px',
                display: data?.classification ? 'inline-flex' : 'none',
                mb: '6px',
              }}
            >
              <Typography color={'#0042C1'} fontSize={'10px'}>
                {RenderClassicProduct(data?.classification)}
              </Typography>
            </Box>
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                mt: '3px',
                width: { md: '262px' },
              }}
            >
              <img src={LOCATION_ICON} alt="icon location" />
              <Typography
                fontSize={'12px'}
                color={palette.common.black}
                ml={'5px'}
              >
                {data?.address}
                {data?.address && ', '}
                {data?.ward}
                {data?.ward && ', '}
                {data?.district}
                {data?.district && ', '}
                {data?.province}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Box mt={2.5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CustomButton
            variant="outlined"
            title={'Quản lý giao dịch'}
            sxPropsText={{ fontWeight: 400 }}
            handleClick={() =>
              hanldeManagerTransfer(data?.id?.toString() || '')
            }
            isHide={
              !checkPermissionExist(PermissionKeyEnum.TICKET_READ, userInfo)
            }
            sxProps={{
              borderRadius: '8px',
              width: { md: '369px' },
              ':hover': {
                border: `1px solid ${palette.primary.button}`,
                color: palette.common.white,
                background: palette.primary.button,
              },
            }}
          />
          <CustomButton
            title={
              checkPermissionExist(PermissionKeyEnum.ESALEKIT_CREATE, userInfo)
                ? 'Quản lý Esalekit'
                : 'Esalekit'
            }
            variant="outlined"
            sxProps={{
              borderRadius: '8px',
              width: { md: '369px' },
              mt: 1.5,
              ':hover': {
                border: `1px solid ${palette.primary.button}`,
                color: palette.common.white,
                background: palette.primary.button,
              },
            }}
            isHide={!data?.isEsalekit}
            sxPropsText={{ fontWeight: 400 }}
            handleClick={() => {
              checkPermissionExist(PermissionKeyEnum.ESALEKIT_CREATE, userInfo)
                ? hanldeManagerEsalekit(data)
                : hanldePreviewProject(data);
            }}
          />
          <CustomButton
            title={'Thiết lập dự án'}
            variant="outlined"
            sxProps={{
              borderRadius: '8px',
              width: { md: '369px' },
              mt: 1.5,
              ':hover': {
                border: `1px solid ${palette.primary.button}`,
                color: palette.common.white,
                background: palette.primary.button,
              },
            }}
            sxPropsText={{ fontWeight: 400 }}
            handleClick={() => handleSettingProject(data?.id?.toString() || '')}
            isHide={
              !checkPermissionExist(
                PermissionKeyEnum.PROJECT_SETTING_READ,
                userInfo,
              )
            }
          />
          <CustomButton
            title={'Thiết lập bảng hàng'}
            variant="outlined"
            sxProps={{
              borderRadius: '8px',
              width: { md: '369px' },
              mt: 1.5,
              ':hover': {
                border: `1px solid ${palette.primary.button}`,
                color: palette.common.white,
                background: palette.primary.button,
              },
            }}
            isHide={
              !checkPermissionExist(PermissionKeyEnum.PRODUCT_CREATE, userInfo)
            }
            sxPropsText={{ fontWeight: 400 }}
            handleClick={() => hanldeSettingTable(data?.id?.toString() || '')}
          />

          <CustomButton
            title={'Bán hàng sự kiện'}
            variant="outlined"
            sxProps={{
              borderRadius: '8px',
              width: { md: '369px' },
              mt: 1.5,
              ':hover': {
                border: `1px solid ${palette.primary.button}`,
                color: palette.common.white,
                background: palette.primary.button,
              },
            }}
            isHide={!isShowEventSaleButton}
            sxPropsText={{ fontWeight: 400 }}
            handleClick={hanldeSaleEvent}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
