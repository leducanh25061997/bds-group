import Button from 'app/components/Button';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSales from 'services/api/eventSales';
import { useParams } from 'react-router-dom';
import { PriorityStatusEnum } from 'types/Enum';
import { snackbarActions } from 'app/components/Snackbar/slice';
import axios from 'axios';

import { SaleControlEnum } from '../../slice/types';

import { selectSaleEventControl } from '../../slice/selector';
import { ActionsDialog } from '../ActionsDialog';
import { useSaleEventControlSlice } from '../../slice';

interface PhaseOneStartProps {
  onEndClick: (type: SaleControlEnum) => void;
}

const FirstPhaseActions = (props: PhaseOneStartProps) => {
  const { onEndClick } = props;

  const { id } = useParams();
  const { eventSale } = useSelector(selectSaleEventControl);
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();

  const [isOpen, setIsOpen] = useState(false);
  const [priorityType, setPriorityType] = useState<SaleControlEnum | null>(
    eventSale?.currentPriority || null,
  );

  const handleEndClick = (type: SaleControlEnum) => {
    onEndClick(type);
  };

  const buttonText = React.useMemo(() => {
    const textMapping = {
      [SaleControlEnum.START_PRIORITY1]: 'Kết thúc ưu tiên 1',
      [SaleControlEnum.END_PRIORITY1]: 'Bắt đầu ưu tiên 2',
      [SaleControlEnum.START_PRIORITY2]: 'Kết thúc ưu tiên 2',
      [SaleControlEnum.END_PRIORITY2]: 'Bắt đầu ưu tiên 3',
      [SaleControlEnum.START_PRIORITY3]: 'Kết thúc ưu tiên 3',
    };

    return (
      textMapping[eventSale?.currentPriority as keyof typeof textMapping] || ''
    );
  }, [eventSale]);

  // const handlePriorityClick = () => {
  //   const nextPriorityMap = {
  //     [SaleControlEnum.START_PRIORITY1]: SaleControlEnum.END_PRIORITY1,
  //     [SaleControlEnum.END_PRIORITY1]: SaleControlEnum.START_PRIORITY2,
  //     [SaleControlEnum.START_PRIORITY2]: SaleControlEnum.END_PRIORITY2,
  //     [SaleControlEnum.END_PRIORITY2]: SaleControlEnum.START_PRIORITY3,
  //     [SaleControlEnum.START_PRIORITY3]: SaleControlEnum.END_PRIORITY3,
  //   };

  //   if (eventSale?.currentPriority) {
  //     const nextPriorityStatus =
  //       nextPriorityMap[
  //         eventSale?.currentPriority as keyof typeof nextPriorityMap
  //       ];

  //     if (nextPriorityStatus) {
  //       if (nextPriorityStatus.startsWith('END_')) {
  //         setPriorityType(nextPriorityStatus);
  //         setIsOpen(true);
  //         return;
  //       } else {
  //         handleUpdatePriority(nextPriorityStatus);
  //         return;
  //       }
  //     }
  //   }
  // };

  const handlePriorityClick = () => {
    const priorityMap: Partial<{ [key in SaleControlEnum]: SaleControlEnum }> =
      {
        [SaleControlEnum.START_PRIORITY1]: SaleControlEnum.END_PRIORITY1,
        [SaleControlEnum.END_PRIORITY1]: SaleControlEnum.START_PRIORITY2,
        [SaleControlEnum.START_PRIORITY2]: SaleControlEnum.END_PRIORITY2,
        [SaleControlEnum.END_PRIORITY2]: SaleControlEnum.START_PRIORITY3,
        [SaleControlEnum.START_PRIORITY3]: SaleControlEnum.END_PRIORITY3,
      };

    const currentPriority = eventSale?.currentPriority;

    if (currentPriority) {
      const nextPriorityStatus = priorityMap[currentPriority];

      if (nextPriorityStatus) {
        if (
          typeof nextPriorityStatus === 'string' &&
          nextPriorityStatus.startsWith('END_')
        ) {
          setPriorityType(nextPriorityStatus);
          setIsOpen(true);
        } else {
          handleUpdatePriority(nextPriorityStatus);
        }
      }
    }
  };

  const handleUpdatePriority = async (type: SaleControlEnum) => {
    if (!id) return;

    try {
      const res = await EventSales.updateEventPriority({
        id,
        priority: type,
      });

      setIsOpen(false);

      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );
      dispatch(actions.fetchEventSalesInfo({ id }));
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: error.response?.data.message,
            type: 'error',
          }),
        );
      }
    }

    // console.log(type);
  };

  return (
    <>
      <Button
        title="Kết thúc giai đoạn 1"
        handleClick={() => handleEndClick(SaleControlEnum.END_PHASE1)}
        sxProps={{
          borderRadius: '8px',
          background: '#FCA43D',
          height: { xs: '44px' },
          marginRight: '16px',
          '&:hover': {
            background: '#FCA43D',
          },
        }}
        sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
      />
      {eventSale?.currentPriority !== SaleControlEnum.END_PRIORITY3 && (
        <Button
          title={buttonText}
          handleClick={() => handlePriorityClick()}
          sxProps={{
            borderRadius: '8px',
            background: '#11AFAF',
            height: { xs: '44px' },

            '&:hover': {
              background: '#11AFAF',
            },
          }}
          sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
        />
      )}
      {isOpen && (
        <ActionsDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          handleSubmit={() => {
            if (priorityType) {
              handleUpdatePriority(priorityType);
            }
          }}
          type={priorityType}
        />
      )}
    </>
  );
};

export default React.memo(FirstPhaseActions);
