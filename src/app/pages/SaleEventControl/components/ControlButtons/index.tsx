import { Grid } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Button from 'app/components/Button';
import path from 'app/routes/path';
import moment from 'moment';
import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import { useProfile } from 'app/hooks';

import { selectSaleEventControl } from '../../slice/selector';
import { SaleControlEnum } from '../../slice/types';
import FirstPhaseActions from '../FirstPhaseActions';
import EndFirstPhaseActions from '../EndFirstPhaseActions';
import SecondPhaseActions from '../SecondPhaseActions';
import InitActions from '../InitActions';

interface ControlButtonsProps {
  onOpenActionDialog: (type: SaleControlEnum) => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onOpenActionDialog,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { eventSale, permission } = useSelector(selectSaleEventControl);
  const userInfo = useProfile();

  const handleOpenDialog = React.useCallback(
    (type: SaleControlEnum) => {
      onOpenActionDialog?.(type);
    },
    [onOpenActionDialog],
  );

  const renderActionButton = useCallback(() => {
    if (!eventSale || eventSale.status === SaleControlEnum.ENDED) return null;
    const startEventTime = moment(
      eventSale?.salesProgram?.startDate?.replace('.000Z', '') || '',
    );
    const diffTime = startEventTime.diff(moment(), 'milliseconds');
    const canStart = diffTime < 0;
    if (eventSale?.status === SaleControlEnum.NOT_START)
      return <InitActions canStart={canStart} />;

    switch (eventSale.currentPhase) {
      case SaleControlEnum.START_PHASE1:
        return <FirstPhaseActions onEndClick={handleOpenDialog} />;
      case SaleControlEnum.END_PHASE1:
        return <EndFirstPhaseActions onEndClick={handleOpenDialog} />;
      case SaleControlEnum.START_PHASE2:
        return <SecondPhaseActions onEndClick={handleOpenDialog} />;
      default:
        return null;
    }
  }, [eventSale, handleOpenDialog]);

  return (
    <Grid
      container
      // md={8}
      spacing={2}
      sx={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      {permission &&
        permission.isAdmin &&
        checkPermissionExist(PermissionKeyEnum.EVENT_SALES_OPEN, userInfo) && (
          <Grid item>
            <Link
              to={`${path.saleEvent}/project/${eventSale?.salesProgram.projectId}/transaction/${id}/virtual`}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Button
                title="Bảng hàng ảo"
                isIcon
                buttonMode="virtual"
                // handleClick={() => {
                //   navigate(`${path.saleEvent}/project/${eventSale?.salesProgram.projectId}/transaction/${id}/virtual`);
                // }}
                sxProps={{
                  borderRadius: '8px',
                  background:
                    'linear-gradient(314deg, rgba(115, 66, 237, 0.85) 0%, rgba(189, 95, 216, 0.85) 65.65%, rgba(255, 121, 198, 0.85) 100%)',
                  height: { xs: '44px' },

                  '&:hover': {
                    background:
                      'linear-gradient(314deg, rgba(115, 66, 237, 0.85) 0%, rgba(189, 95, 216, 0.85) 65.65%, rgba(255, 121, 198, 0.85) 100%)',
                  },
                }}
                sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
              />
            </Link>
          </Grid>
        )}

      {eventSale?.status === SaleControlEnum.ENDED && (
        <Grid item>
          <Button
            title="Xuất báo cáo sự kiện"
            isIcon
            buttonMode="event-report"
            variant="outlined"
            handleClick={() =>
              handleOpenDialog(SaleControlEnum.EXPORT_EVENT_REPORT)
            }
            sxProps={{
              borderRadius: '8px',
              background: '#ffffff',
              height: { xs: '44px' },
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'primary.darkRed',
            }}
          />
        </Grid>
      )}
      {(eventSale?.currentPhase === SaleControlEnum.END_PHASE1 ||
        eventSale?.currentPhase === SaleControlEnum.END_PHASE2 ||
        eventSale?.status === SaleControlEnum.ENDED) && (
        <Grid item>
          <Button
            title="Gửi Email XN kết thúc giao dịch"
            variant="outlined"
            handleClick={() => handleOpenDialog(SaleControlEnum.SEND_EMAIL)}
            sxProps={{
              borderRadius: '8px',
              background: '#ffffff',
              height: { xs: '44px' },
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'primary.darkRed',
            }}
          />
        </Grid>
      )}
      {eventSale?.status === SaleControlEnum.STARTING && (
        <Grid item>
          <Button
            title="Kết thúc sự kiện"
            handleClick={() => handleOpenDialog(SaleControlEnum.ENDED)}
            sxProps={{
              borderRadius: '8px',
              background: '#FF595C',
              height: { xs: '44px' },

              '&:hover': {
                background: '#FF595C',
              },
            }}
            sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
          />
        </Grid>
      )}
      {renderActionButton() && <Grid item>{renderActionButton()}</Grid>}
      <Grid item>
        <Link
          to={`${path.saleEvent}/project/${eventSale?.salesProgram.projectId}/transaction/${id}`}
          target="_blank"
          style={{ textDecoration: 'none' }}
        >
          <Button
            title="Danh sách giao dịch"
            // handleClick={() => navigate(`${path.saleEvent}/${id}/transaction`)}
            sxProps={{
              borderRadius: '8px',
              height: { xs: '44px' },
            }}
            sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
          />
        </Link>
      </Grid>
    </Grid>
  );
};

export default React.memo(ControlButtons);
