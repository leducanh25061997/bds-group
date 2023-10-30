import React, { useEffect, useState } from 'react';
import Button from 'app/components/Button';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EventSales from 'services/api/eventSales';
import { snackbarActions } from 'app/components/Snackbar/slice';
import { Product } from 'types/ProductTable';
import axios from 'axios';

import {
  MovingProducts,
  PayloadGetMovingProducts,
  SaleControlEnum,
} from '../../slice/types';
import MoveProductsDialog from '../MoveProductsDialog';
import { useSaleEventControlSlice } from '../../slice';
import { selectSaleEventControl } from '../../slice/selector';

interface EndFirstPhaseActionsProps {
  onEndClick: (type: SaleControlEnum) => void;
}

const EndFirstPhaseActions = (props: EndFirstPhaseActionsProps) => {
  const { onEndClick } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();
  const { eventSale } = useSelector(selectSaleEventControl);

  const [products, setProducts] = useState<MovingProducts>({
    freeProducts: [],
    priorityProducts: [],
  });

  useEffect(() => {
    if (!id || eventSale?.currentPhase !== SaleControlEnum.END_PHASE1) return;

    getMovingProducts({
      id,
    });
  }, [eventSale?.currentPhase, id]);

  const getMovingProducts = async (params: PayloadGetMovingProducts) => {
    try {
      const res = await EventSales.getMovingProducts(params);
      setProducts(res);
    } catch (error) {}
  };

  const handleEndClick = (type: SaleControlEnum) => {
    onEndClick(type);
  };

  const handleUpdateEvent = async () => {
    if (!id) return;

    try {
      const res = await EventSales.updateEventPhase({
        id,
        phase: SaleControlEnum.START_PHASE2,
      });

      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );
      dispatch(actions.fetchEventSalesInfo({ id }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: error.response?.data.message,
            type: 'error',
          }),
        );
      }
    }
  };

  const handleMoveProducts = async (products: string[]) => {
    if (!id) return;

    try {
      const res = await EventSales.moveProductsToSecondPhase({
        id,
        productIds: products,
      });

      dispatch(
        snackbarActions.updateSnackbar({
          message: res.message,
          type: 'success',
        }),
      );

      setIsOpen(false);
      getMovingProducts({ id });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Có lỗi xảy ra',
              type: 'error',
            }),
          );
          return;
        }

        dispatch(
          snackbarActions.updateSnackbar({
            message: error.response?.data.message,
            type: 'error',
          }),
        );
      }
    }
  };

  return (
    <>
      <Button
        title="Chuyển SP &#10132; Giai đoạn 2"
        variant="outlined"
        handleClick={() => setIsOpen(true)}
        sxProps={{
          borderRadius: '8px',
          background: '#ffffff',
          height: { xs: '44px' },
          marginRight: '16px',
        }}
        sxPropsText={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'primary.darkRed',
        }}
      />
      <Button
        title="Kết thúc giai đoạn 2"
        handleClick={() => handleEndClick(SaleControlEnum.END_PHASE2)}
        sxProps={{
          borderRadius: '8px',
          background: '#FCA43D',
          height: { xs: '44px' },

          '&:hover': {
            background: '#FCA43D',
          },
        }}
        sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
      />
      {/* <Button
        title="Bắt đầu giai đoạn 2"
        handleClick={() => handleUpdateEvent()}
        sxProps={{
          borderRadius: '8px',
          background: '#11AFAF',
          height: { xs: '44px' },

          '&:hover': {
            background: '#11AFAF',
          },
        }}
        sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
      /> */}
      {isOpen && (
        <MoveProductsDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onMoveProducts={handleMoveProducts}
          products={products}
        />
      )}
    </>
  );
};

export default EndFirstPhaseActions;
