import { TextField, Box, InputAdornment } from '@mui/material';
import SPEAKER_RED from 'assets/icons/speaker-red.svg';
import SPEAKER_GREEN from 'assets/icons/speaker-green.svg';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { useParams } from 'react-router';
import { debounce, get } from 'lodash';
import {
  EventStatusEnum,
  PhaseStatusEnum,
  PhaseStatusEnumVN,
  PriorityStatusEnum,
  PriorityStatusEnumVN,
} from 'types/Enum';

import { selectSaleEventTransaction } from '../../slice/selector';
import { TransactionParams, EventSales } from '../../slice/types';
import { useSaleEventTransactionSlice } from '../../slice';

export const Header = () => {
  // const { saleEventTransaction } = useSelector(selectSaleEventTransaction);
  const { saleEventTransactionPriority, saleEventTransactionFree } =
    useSelector(selectSaleEventTransaction);
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const { actions: saleEventTransactionActions } =
    useSaleEventTransactionSlice();
  const [eventSale, setEventSales] = React.useState<EventSales>();

  React.useEffect(() => {
    if (saleEventTransactionPriority) {
      setEventSales(saleEventTransactionPriority.eventSales);
    }
    if (saleEventTransactionFree) {
      setEventSales(saleEventTransactionFree.eventSales);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    saleEventTransactionPriority?.eventSales,
    saleEventTransactionFree?.eventSales,
  ]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (id) {
      const freeParams: TransactionParams = {
        id,
        isPriority: false,
        search: value,
      };
      const priorityParams: TransactionParams = {
        id,
        isPriority: true,
        search: value,
      };
      dispatch(saleEventTransactionActions.setSearchKey(freeParams));
      dispatch(
        saleEventTransactionActions.fetchSaleEventTransaction(freeParams),
      );
      dispatch(
        saleEventTransactionActions.fetchSaleEventTransaction(priorityParams),
      );
    }
  };

  const debounceOnChange = debounce(handleSearch, 350);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ color: '#1E1E1E', fontWeight: '700', fontSize: '20px' }}>
        {/* Mở bán dự án Metro Star đợt 1 20/07/2023 */}
        {eventSale?.salesProgram.name || ''}
      </Box>
      {eventSale?.isStart ? (
        <Box sx={{ display: 'flex' }}>
          {eventSale?.status === EventStatusEnum.NOT_START && (
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
                sx={{ color: '#D6465F', fontWeight: '500', fontSize: '14px' }}
              >
                Sự kiện chưa bắt đầu
              </Box>
            </Box>
          )}
          {eventSale?.status === EventStatusEnum.STARTING && (
            <>
              {eventSale.currentPriority ? (
                <Box
                  sx={{
                    background:
                      eventSale.currentPriority ===
                        PriorityStatusEnum.END_PRIORITY1 ||
                      eventSale.currentPriority ===
                        PriorityStatusEnum.END_PRIORITY2 ||
                      eventSale.currentPriority ===
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
                    {eventSale.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY1 ||
                    eventSale.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY2 ||
                    eventSale.currentPriority ===
                      PriorityStatusEnum.END_PRIORITY3 ? (
                      <img src={SPEAKER_RED} alt="Icon" />
                    ) : (
                      <img src={SPEAKER_GREEN} alt="Icon" />
                    )}
                  </Box>
                  {eventSale && (
                    <Box
                      sx={{
                        color:
                          eventSale.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY1 ||
                          eventSale.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY2 ||
                          eventSale.currentPriority ===
                            PriorityStatusEnum.END_PRIORITY3
                            ? '#D6465F'
                            : '#34C759',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {`${get(
                        PhaseStatusEnumVN,
                        `${eventSale.currentPhase}`,
                      )} - ${get(
                        PriorityStatusEnumVN,
                        `${eventSale.currentPriority}`,
                      )}`}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    background:
                      eventSale.currentPhase === PhaseStatusEnum.END_PHASE1 ||
                      eventSale.currentPhase === PhaseStatusEnum.END_PHASE2
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
                    {eventSale.currentPhase === PhaseStatusEnum.END_PHASE1 ||
                    eventSale.currentPhase === PhaseStatusEnum.END_PHASE2 ? (
                      <img src={SPEAKER_RED} alt="Icon" />
                    ) : (
                      <img src={SPEAKER_GREEN} alt="Icon" />
                    )}
                  </Box>
                  {eventSale && (
                    <Box
                      sx={{
                        color:
                          eventSale.currentPhase ===
                            PhaseStatusEnum.END_PHASE1 ||
                          eventSale.currentPhase === PhaseStatusEnum.END_PHASE2
                            ? '#D6465F'
                            : '#34C759',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {`${get(PhaseStatusEnumVN, `${eventSale.currentPhase}`)}`}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
          {eventSale?.status === EventStatusEnum.ENDED && (
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
                sx={{ color: '#D6465F', fontWeight: '500', fontSize: '14px' }}
              >
                Sự kiện đã kết thúc
              </Box>
            </Box>
          )}
          <Box>
            <TextField
              id="search"
              type="search"
              placeholder="Nhập từ khóa"
              // value={inputValue}
              sx={{ width: '222px', height: '44px' }}
              InputProps={{
                style: {
                  height: '44px',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={debounceOnChange}
            />
          </Box>
        </Box>
      ) : (
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
          <Box sx={{ color: '#D6465F', fontWeight: '500', fontSize: '14px' }}>
            Sự kiện chưa bắt đầu
          </Box>
        </Box>
      )}
    </Box>
  );
};
