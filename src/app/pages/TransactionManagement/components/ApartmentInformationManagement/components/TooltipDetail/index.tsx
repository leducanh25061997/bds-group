import { Box, Divider, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { TicketApprove } from 'app/pages/TransactionManagement/slice/type';
import { formatCurrency, renderBackgroundColorTable } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { ProjectTypeEnum } from 'types/Project';
import useResponsive from 'app/hooks/useResponsive';

import { SubDataProtype } from '../../slice/types';
import { selectApartmentInformation } from '../../slice/selectors';

export const TooltipDetail = ({
  id,
  data,
  isPriority,
}: {
  id: string;
  data: SubDataProtype;
  isPriority: boolean;
}) => {
  const [priorityFirst, setPriorityFirst] = useState<TicketApprove | null>(
    null,
  );
  const [prioritySecond, setPrioritySecond] = useState<TicketApprove | null>(
    null,
  );
  const [priorityThree, setPriorityThree] = useState<TicketApprove | null>(
    null,
  );
  const { apartmentInformation } = useSelector(selectApartmentInformation);

  const isApartment =
    apartmentInformation?.infProject.type === ProjectTypeEnum.APARTMENT;

  useEffect(() => {
    if (data && isPriority) {
      convertData(data, 1, setPriorityFirst);
      convertData(data, 2, setPrioritySecond);
      convertData(data, 3, setPriorityThree);
    }
  }, [data, isPriority]);

  const convertData = (
    dataConvert: SubDataProtype,
    order: number,
    setState: (v: TicketApprove) => void,
  ) => {
    if (dataConvert.priorities && dataConvert.priorities?.length > 0) {
      const priority = dataConvert.priorities.filter(
        item => item.order === order,
      );
      if (priority.length > 0) {
        setState(priority[0].ticket);
      }
    }
  };

  const isDesktop = useResponsive('up', 'lg');
  if (!isDesktop) return <></>;

  return (
    <ReactTooltip
      id={id}
      place="bottom"
      style={{
        zIndex: 9999,
        backgroundColor: '#2E3643',
        borderRadius: '8px',
        opacity: '1',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1000 }}>
          <Box
            sx={{
              background: renderBackgroundColorTable(data?.status),
              borderRadius: '2px',
              width: ' 16px',
              height: '12px',
            }}
          ></Box>
          <Box
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '20px',
              marginLeft: '8px',
            }}
          >
            {data.code}
          </Box>
        </Box>
        <Box
          sx={{
            background: '#475160',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 12px',
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '20px',
            margin: '10px 0',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography variant="caption" fontWeight={500}>
              {data.block}
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ background: '#FFFFFF', margin: '2px 16px', width: '2px' }}
            />
            <Typography variant="caption" fontWeight={500}>
              {isApartment ? `Tầng ${data.floor}` : `View ${data.subscription}`}
            </Typography>
            {isApartment && (
              <>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: '#FFFFFF',
                    margin: '2px 16px',
                    width: '2px',
                  }}
                />

                <Typography variant="caption" fontWeight={500}>
                  {data.bedRoom}PN
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Typography variant="caption" fontWeight={500}>
              {data.direction}
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ background: '#FFFFFF', margin: '2px 16px', width: '2px' }}
            />
            {isApartment ? (
              <Typography variant="caption" fontWeight={500}>
                {data.subscription}
              </Typography>
            ) : (
              <Typography variant="caption" fontWeight={500}>
                Lô góc: {data.corner}
              </Typography>
            )}
          </Box>
        </Box>
        <Stack spacing={0.5}>
          {data?.orgChart?.name ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
                  Đơn vị bán hàng:{' '}
                </Typography>
                <Typography variant="caption" ml={1} sx={{ color: '#FFFFFF' }}>
                  {`${data.orgChart.name}`}
                </Typography>
              </Box>
            </>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
              Diện tích tim tường:{' '}
            </Typography>
            <Typography variant="caption" ml={1} sx={{ color: '#FFFFFF' }}>
              {`${data?.builtUpArea || 0} m`}
              <sup>2</sup>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
              Diện tích thông thủy:{' '}
            </Typography>
            <Typography variant="caption" ml={1} sx={{ color: '#FFFFFF' }}>
              {`${data?.carpetArea || 0} m`}
              <sup>2</sup>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
              Đơn giá (chưa VAT):{' '}
            </Typography>
            {data?.unitPrice ? (
              <Typography variant="caption" ml={1} sx={{ color: '#FFFFFF' }}>
                {`${formatCurrency(data?.unitPrice)} vnđ/m`}
                <sup>2</sup>
              </Typography>
            ) : (
              <Typography>{`-`}</Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
              Đơn giá (VAT):{' '}
            </Typography>
            {data?.unitPriceVat ? (
              <Typography variant="caption" ml={1} sx={{ color: '#FFFFFF' }}>
                {`${formatCurrency(data?.unitPriceVat)} vnđ/m`}
                <sup>2</sup>
              </Typography>
            ) : (
              <Typography>{`-`}</Typography>
            )}
          </Box>
          {isPriority && (
            <>
              {priorityFirst && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '20px',
                    marginTop: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
                    Ưu tiên 1:{' '}
                  </Typography>
                  <Typography
                    ml={1}
                    sx={{ color: '#FFFFFF', fontSize: '12px' }}
                  >
                    {priorityFirst.code}
                    {/* {`-`} */}
                  </Typography>
                </Box>
              )}
              {prioritySecond && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '20px',
                    marginTop: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
                    Ưu tiên 2:{' '}
                  </Typography>
                  <Typography
                    ml={1}
                    sx={{ color: '#FFFFFF', fontSize: '12px' }}
                  >
                    {prioritySecond.code}
                    {/* {`-`} */}
                  </Typography>
                </Box>
              )}
              {priorityThree && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '20px',
                    marginTop: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#A8ADB4' }}>
                    Ưu tiên 3:{' '}
                  </Typography>
                  <Typography
                    ml={1}
                    sx={{ color: '#FFFFFF', fontSize: '12px' }}
                  >
                    {priorityThree.code}
                    {/* {`-`} */}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
      </Box>
    </ReactTooltip>
  );
};
