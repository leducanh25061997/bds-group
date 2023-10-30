import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { DataWorkDone } from 'types/Comisstion';

import { EllipsisText } from 'app/components/EllipsisText';
import { useParams } from 'react-router-dom';
import Table from 'app/components/Table';
import { TableHeaderProps } from 'types';
import { formatCurrency } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ContractSumary from '../ContractSumary';
import { selectComisstion } from '../../slice/selector';
import { useComisstionPolicySlice } from '../../slice';

const JobHasBeen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, managermentList } = useSelector(selectComisstion);
  const [isConstractPrecious, setIsContractPrecious] = useState<boolean>(false);
  const [isTotalContract, setIsTotalContract] = useState<boolean>(false);
  const [isValuation, setIsValuation] = useState<boolean>(false);
  const { actions } = useComisstionPolicySlice();
  const theme = useTheme();
  const { t } = useTranslation();

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'targets',
        label: t(translations.Comisstion.targets),
        align: 'left',
        width: 215,
      },
      {
        id: 'value',
        label: t(translations.Comisstion.value),
        align: 'right',
        width: 75,
      },
    ],
    [t],
  );

  const handleChangeTable = (index: number) => {
    if (index === 0) {
      setIsContractPrecious(true);
    } else if (index === 1) {
      setIsTotalContract(true);
    } else {
      setIsValuation(true);
    }
  };

  useEffect(() => {
    if (id) {
      const params = {
        fields: ['name', 'email', 'phone'],
        staffId: id,
        byCurrentQuarter: isConstractPrecious ? 'true' : '',
      };
      dispatch(actions.getListManagementeData({ id }));
      dispatch(actions.getListTotalContractOrThisQuarter(params));
    }
  }, [actions, dispatch, id, isConstractPrecious]);

  const renderItem = (item: DataWorkDone, index: number) => {
    return [
      <EllipsisText
        text={item.contract}
        line={1}
        handleClick={() => handleChangeTable(index)}
      />,
      <EllipsisText
        text={item.value}
        color={theme.palette.primary.lighter}
        underLine="underline"
        handleClick={() => handleChangeTable(index)}
        line={1}
      />,
    ];
  };
  return (
    <Fragment>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <Box sx={{ padding: { xs: '0px', sm: '15px', md: '15px' } }}>
          {isConstractPrecious || isTotalContract || isValuation ? (
            <ContractSumary
              isConstractPrecious={isConstractPrecious}
              isTotalContract={isTotalContract}
            />
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  paddingBottom: '16px',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '86px',
                    border: `2px solid ${theme.palette.primary.lighter}`,
                    filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.08))',
                  }}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={'14px'}
                    lineHeight={'17px'}
                    textAlign="center"
                    color={theme.palette.primary.light}
                    sx={{ padding: '16px 0px 20px 0px' }}
                  >
                    {t(translations.Comisstion.revenue)}
                  </Typography>
                  <Typography
                    fontWeight={400}
                    fontSize={'14px'}
                    lineHeight={'17px'}
                    textAlign="center"
                    color={theme.palette.primary.light}
                  ></Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: '86px',
                    border: `2px solid ${theme.palette.primary.lighter}`,
                    filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.08))',
                  }}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={'14px'}
                    lineHeight={'17px'}
                    textAlign="center"
                    color={theme.palette.primary.light}
                    sx={{ padding: '16px 0px 20px 0px' }}
                  >
                    {t(translations.Comisstion.totalValueProperty)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default JobHasBeen;
