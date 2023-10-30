import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  EventStatusEnum,
  PhaseStatusEnum,
  PhaseStatusEnumVN,
  PriorityStatus,
  PriorityStatusEnum,
  PriorityStatusEnumVN,
} from 'types/Enum';
import SPEAKER_BLUE from 'assets/icons/speaker-blue.svg';
import SPEAKER_GREEN from 'assets/icons/speaker-green.svg';
import LOCK_RED from 'assets/icons/lock-red.svg';
import SPEAKER_RED from 'assets/icons/speaker-red.svg';
import { get } from 'lodash';

import { selectTransactionManagement } from '../../slice/selector';
import { selectApartmentInformation } from '../ApartmentInformationManagement/slice/selectors';

export const RenderPriorityStatus = () => {
  const { priorityStatus } = useSelector(selectTransactionManagement);
  const { apartmentInformation } = useSelector(selectApartmentInformation);

  return (
    <>
      {apartmentInformation && (
        <Box>
          {apartmentInformation?.infProject.eventSales &&
          apartmentInformation?.infProject.eventSales?.status !==
            EventStatusEnum.NOT_START ? (
            <>
              {apartmentInformation?.infProject.eventSales?.status ===
                EventStatusEnum.STARTING && (
                <>
                  {apartmentInformation?.infProject.eventSales
                    .currentPriority ? (
                    <Box
                      sx={{
                        background:
                          apartmentInformation?.infProject.eventSales
                            .currentPriority ===
                            PriorityStatusEnum.END_PRIORITY1 ||
                          apartmentInformation?.infProject.eventSales
                            .currentPriority ===
                            PriorityStatusEnum.END_PRIORITY2 ||
                          apartmentInformation?.infProject.eventSales
                            .currentPriority ===
                            PriorityStatusEnum.END_PRIORITY3
                            ? '#FFD9EA'
                            : '#D6F4DE',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                        padding: '2px 10px',
                        marginRight: '16px',
                      }}
                    >
                      <Box sx={{ marginRight: '10px' }}>
                        {apartmentInformation?.infProject.eventSales
                          .currentPriority ===
                          PriorityStatusEnum.END_PRIORITY1 ||
                        apartmentInformation?.infProject.eventSales
                          .currentPriority ===
                          PriorityStatusEnum.END_PRIORITY2 ||
                        apartmentInformation?.infProject.eventSales
                          .currentPriority ===
                          PriorityStatusEnum.END_PRIORITY3 ? (
                          <img src={SPEAKER_RED} alt="Icon" />
                        ) : (
                          <img src={SPEAKER_GREEN} alt="Icon" />
                        )}
                      </Box>
                      {apartmentInformation?.infProject.eventSales && (
                        <Box
                          sx={{
                            color:
                              apartmentInformation?.infProject.eventSales
                                .currentPriority ===
                                PriorityStatusEnum.END_PRIORITY1 ||
                              apartmentInformation?.infProject.eventSales
                                .currentPriority ===
                                PriorityStatusEnum.END_PRIORITY2 ||
                              apartmentInformation?.infProject.eventSales
                                .currentPriority ===
                                PriorityStatusEnum.END_PRIORITY3
                                ? '#D6465F'
                                : '#34C759',
                            fontWeight: '500',
                            fontSize: '14px',
                          }}
                        >
                          {`${get(
                            PhaseStatusEnumVN,
                            `${apartmentInformation?.infProject.eventSales.currentPhase}`,
                          )} - ${get(
                            PriorityStatusEnumVN,
                            `${apartmentInformation?.infProject.eventSales.currentPriority}`,
                          )}`}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        background:
                          apartmentInformation?.infProject.eventSales
                            .currentPhase === PhaseStatusEnum.END_PHASE1 ||
                          apartmentInformation?.infProject.eventSales
                            .currentPhase === PhaseStatusEnum.END_PHASE2
                            ? '#FFD9EA'
                            : '#D6F4DE',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                        padding: '2px 10px',
                        marginRight: '16px',
                      }}
                    >
                      <Box sx={{ marginRight: '10px' }}>
                        {apartmentInformation?.infProject.eventSales
                          .currentPhase === PhaseStatusEnum.END_PHASE1 ||
                        apartmentInformation?.infProject.eventSales
                          .currentPhase === PhaseStatusEnum.END_PHASE2 ? (
                          <img src={SPEAKER_RED} alt="Icon" />
                        ) : (
                          <img src={SPEAKER_GREEN} alt="Icon" />
                        )}
                      </Box>
                      {apartmentInformation?.infProject.eventSales && (
                        <Box
                          sx={{
                            color:
                              apartmentInformation?.infProject.eventSales
                                .currentPhase === PhaseStatusEnum.END_PHASE1 ||
                              apartmentInformation?.infProject.eventSales
                                .currentPhase === PhaseStatusEnum.END_PHASE2
                                ? '#D6465F'
                                : '#34C759',
                            fontWeight: '500',
                            fontSize: '14px',
                          }}
                        >
                          {`${get(
                            PhaseStatusEnumVN,
                            `${apartmentInformation?.infProject.eventSales.currentPhase}`,
                          )}`}
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}
              {apartmentInformation?.infProject.eventSales?.status ===
                EventStatusEnum.ENDED && (
                <Box
                  sx={{
                    background: '#FFD9EA',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    padding: '2px 10px',
                    marginRight: '16px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    <img src={SPEAKER_RED} alt="Icon" />
                  </Box>
                  <Box
                    sx={{
                      color: '#D6465F',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    Sự kiện đã kết thúc
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <>
              {priorityStatus === PriorityStatus.OPEN_PRIORITY && (
                <Box
                  sx={{
                    background: '#D6F4DE',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    padding: '2px 10px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    <img src={SPEAKER_GREEN} alt="Icon" />
                  </Box>
                  <Box sx={{ color: '#2A9F47' }}>Đang mở ráp ưu tiên</Box>
                </Box>
              )}
              {priorityStatus === PriorityStatus.LOCK_PRIORITY && (
                <Box
                  sx={{
                    background: '#FFD1D2',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    padding: '2px 10px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    <img src={LOCK_RED} alt="Icon" />
                  </Box>
                  <Box sx={{ color: '#E42B2C' }}>Đã khóa ráp ưu tiên</Box>
                </Box>
              )}
              {priorityStatus === PriorityStatus.OPEN_PRIORITY_ADDITIONAL && (
                <Box
                  sx={{
                    background: '#CCE4FF',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    padding: '2px 10px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    <img src={SPEAKER_BLUE} alt="Icon" />
                  </Box>
                  <Box sx={{ color: '#006EE6' }}>
                    Đang mở ráp bổ sung ưu tiên
                  </Box>
                </Box>
              )}
              {priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL && (
                <Box
                  sx={{
                    background: '#FFD1D2',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    padding: '2px 10px',
                  }}
                >
                  <Box sx={{ marginRight: '10px' }}>
                    <img src={LOCK_RED} alt="Icon" />
                  </Box>
                  <Box sx={{ color: '#E42B2C' }}>
                    Đã khóa ráp bổ sung ưu tiên
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
};
