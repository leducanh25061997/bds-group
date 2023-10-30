import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import StatisticItem from '../StatisticItem';
import { useSaleEventControlSlice } from '../../slice';
import { selectSaleEventControl } from '../../slice/selector';

const STATISTIC_INFO = [
  {
    text: {
      title: 'Đơn vị tham gia sự kiện',
      status: 'Đang giao dịch',
    },
    style: {
      textColor: '#2FB350',
      shapeColor: {
        fill: '#EAF9EE',
        stroke: '#71DADA',
        border: '#2FB350',
      },
    },
  },
  {
    text: {
      title: 'Tổng số sản phẩm',
      status: 'Đang mở bán',
    },
    style: {
      textColor: '#1987FF',
      shapeColor: {
        fill: '#E5F1FF',
        stroke: '#99CAFF',
        border: '#1987FF',
      },
    },
  },
  {
    text: {
      title: 'Sản phẩm',
      status: 'Giao dịch thành công giai đoạn 1',
    },
    style: {
      textColor: '#E42B2C',
      shapeColor: {
        fill: '#FFE8E9',
        stroke: '#FF989B',
        border: '#FF595C',
      },
    },
  },
  {
    text: {
      title: 'Sản phẩm',
      status: 'Giao dịch thành công giai đoạn 2',
    },
    style: {
      textColor: '#E42B2C',
      shapeColor: {
        fill: '#FFE8E9',
        stroke: '#FF989B',
        border: '#FF595C',
      },
    },
  },
  {
    text: {
      title: 'Sản phẩm',
      status: 'Đang giao dịch',
    },
    style: {
      textColor: '#2AC8C8',
      shapeColor: {
        fill: '#E7F8F8',
        stroke: '#71DADA',
        border: '#7CE7FF',
      },
    },
  },
  {
    text: {
      title: 'Sản phẩm',
      status: 'Chưa giao dịch',
    },
    style: {
      textColor: '#CCA300',
      shapeColor: {
        fill: '#FFF5CC',
        stroke: '#FFE066',
        border: '#FFEB99',
      },
    },
  },
] as const;

const Statistics = () => {
  const { actions } = useSaleEventControlSlice();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { report } = useSelector(selectSaleEventControl);
  const {
    count_unit,
    phase1_success,
    phase2_success,
    product_inprogress_transaction,
    product_not_transaction,
    total_product,
  } = report.data;

  useEffect(() => {
    if (!id) return;
    dispatch(actions.getEventReport({ id }));
  }, [id, dispatch, actions]);

  return (
    <Grid item container spacing={2.5}>
      <StatisticItem baseInfo={STATISTIC_INFO[0]} data={count_unit} />
      <StatisticItem baseInfo={STATISTIC_INFO[1]} data={total_product} />
      <StatisticItem baseInfo={STATISTIC_INFO[2]} data={phase1_success} />
      <StatisticItem baseInfo={STATISTIC_INFO[3]} data={phase2_success} />
      <StatisticItem
        baseInfo={STATISTIC_INFO[4]}
        data={product_inprogress_transaction}
      />
      <StatisticItem
        baseInfo={STATISTIC_INFO[5]}
        data={product_not_transaction}
      />
    </Grid>
  );
};

export default React.memo(Statistics);
