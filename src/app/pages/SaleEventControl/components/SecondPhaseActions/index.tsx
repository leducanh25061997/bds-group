import React, { useEffect, useState } from 'react';
import Button from 'app/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import EventSales from 'services/api/eventSales';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { snackbarActions } from 'app/components/Snackbar/slice';

import {
  MovingProducts,
  PayloadGetMovingProducts,
  SaleControlEnum,
} from '../../slice/types';
import { selectSaleEventControl } from '../../slice/selector';
import MoveProductsDialog from '../MoveProductsDialog';

interface SecondPhaseActionsProps {
  onEndClick: (type: SaleControlEnum) => void;
}

const SecondPhaseActions = (props: SecondPhaseActionsProps) => {
  const { onEndClick } = props;
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<MovingProducts>({
    freeProducts: [],
    priorityProducts: [],
  });

  const { eventSale } = useSelector(selectSaleEventControl);

  useEffect(() => {
    if (!id || eventSale?.currentPhase !== SaleControlEnum.START_PHASE2) return;

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

  const handleEndClick = (type: SaleControlEnum) => {
    onEndClick(type);
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
      {eventSale?.currentPhase === SaleControlEnum.START_PHASE2 && (
        <Button
          title="Kết thúc giai đoạn 2"
          handleClick={() => handleEndClick(SaleControlEnum.END_PHASE2)}
          sxProps={{
            borderRadius: '8px',
            background: '#FCA43D',
            height: { xs: '44px' },
            ml: '16px',

            '&:hover': {
              background: '#FCA43D',
            },
          }}
          sxPropsText={{ fontSize: '14px', fontWeight: 700 }}
        />
      )}
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

export default SecondPhaseActions;
