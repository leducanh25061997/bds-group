import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  EventStatusEnum,
  PhaseStatusEnum,
  PhaseStatusEnumVN,
  PriorityStatusEnum,
  PriorityStatusEnumVN,
} from 'types/Enum';
import { selectVirtualTable } from '../../slice/selectors';
import SPEAKER_RED from 'assets/icons/speaker-red.svg';
import SPEAKER_GREEN from 'assets/icons/speaker-green.svg';
import { EventSales } from '../../../../../types/Transaction';
import { get } from 'lodash';

export const EventSaleStatus = () => {
  const { virtualDataTable } = useSelector(selectVirtualTable);
  const eventSales: EventSales | undefined =
    virtualDataTable?.infProject.eventSales;

  return (
    <Box>
      {eventSales && (
        <Box>
          {eventSales.status === EventStatusEnum.NOT_START && (
            <Box
              sx={{
                background: '#FFD9EA',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                padding: '10px 12px',
                marginRight: '16px',
              }}
            >
              <Box sx={{ marginRight: '10px' }}>
                <img src={SPEAKER_RED} alt="Icon" />
              </Box>
              <Box
                sx={{ color: '#D6465F', fontWeight: '500', fontSize: '14px' }}
              >
                Sự kiện chưa bắt đầu
              </Box>
            </Box>
          )}
          {eventSales.status === EventStatusEnum.STARTING && (
            <>
              {eventSales.currentPriority ? (
                <Box
                  sx={{
                    background:
                      eventSales.currentPriority ===
                        PriorityStatusEnum.END_PRIORITY1 ||
                      eventSales.currentPriority ===
                        PriorityStatusEnum.END_PRIORITY2 ||
                      eventSales.currentPriority ===
                        PriorityStatusEnum.END_PRIORITY3
                        ? '#FFD9EA'
                        : '#D6F4DE',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginRight: '16px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    {eventSales.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY1 ||
                    eventSales.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY2 ||
                    eventSales.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY3 ? (
                      <img src={SPEAKER_RED} alt="Icon" />
                    ) : (
                      <img src={SPEAKER_GREEN} alt="Icon" />
                    )}
                  </Box>
                  {eventSales && (
                    <Box
                      sx={{
                        color:
                          eventSales.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY1 ||
                          eventSales.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY2 ||
                          eventSales.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY3
                            ? '#D6465F'
                            : '#34C759',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {`${get(
                        PhaseStatusEnumVN,
                        `${eventSales.currentPhase}`,
                      )} - ${get(
                        PriorityStatusEnumVN,
                        `${eventSales.currentPriority}`,
                      )}`}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    background:
                      eventSales.currentPhase === PhaseStatusEnum.END_PHASE1 ||
                      eventSales.currentPhase === PhaseStatusEnum.END_PHASE2
                        ? '#FFD9EA'
                        : '#D6F4DE',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginRight: '16px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    {eventSales.currentPhase === PhaseStatusEnum.END_PHASE1 ||
                    eventSales.currentPhase === PhaseStatusEnum.END_PHASE2 ? (
                      <img src={SPEAKER_RED} alt="Icon" />
                    ) : (
                      <img src={SPEAKER_GREEN} alt="Icon" />
                    )}
                  </Box>
                  {eventSales && (
                    <Box
                      sx={{
                        color:
                          eventSales.currentPhase ===
                            PhaseStatusEnum.END_PHASE1 ||
                          eventSales.currentPhase === PhaseStatusEnum.END_PHASE2
                            ? '#D6465F'
                            : '#34C759',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {`${get(
                        PhaseStatusEnumVN,
                        `${eventSales.currentPhase}`,
                      )}`}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
          {virtualDataTable?.infProject.eventSales.status ===
            EventStatusEnum.ENDED && (
            <Box
              sx={{
                background: '#FFD9EA',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                padding: '10px 12px',
                marginRight: '16px',
              }}
            >
              <Box sx={{ marginRight: '10px' }}>
                <img src={SPEAKER_RED} alt="Icon" />
              </Box>
              <Box
                sx={{ color: '#D6465F', fontWeight: '500', fontSize: '14px' }}
              >
                Sự kiện đã kết thúc
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
