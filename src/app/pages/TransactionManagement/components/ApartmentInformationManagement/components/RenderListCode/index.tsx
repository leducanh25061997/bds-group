import { Box, Grid, Typography } from '@mui/material';
import { SubDataProtype } from '../../slice/types';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useSelector } from 'react-redux';
import { renderBackgroundColorTable } from 'utils/helpers';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';

export const RenderListCode = () => {
  const { apartmentInformation } = useSelector(layoutsSelector);
  const { tableProductInformation } = useSelector(selectApartmentInformation);

  return (
    <Box
      sx={{
        background: '#555E6C',
        borderRadius: '8px',
        padding: '17px',
        mt: 2,
      }}
    >
      {apartmentInformation &&
      typeof apartmentInformation.apartmentId === 'string' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '24px',
                height: '20px',
                background: renderBackgroundColorTable(
                  tableProductInformation?.status,
                ),
                borderRadius: '2px',
              }}
            ></Box>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '20px',
                color: '#FFF',
                ml: 1,
              }}
            >
              {tableProductInformation?.code}
            </Box>
            <Box
              sx={{
                background: '#A8ADB4',
                borderRadius: '4px',
                color: '#FFFFFF',
                padding: '2px 11px',
                ml: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '20px',
                  color: renderBackgroundColorTable(
                    tableProductInformation?.status,
                  ),
                }}
              >
                {tableProductInformation?.status || ''}
              </Typography>
            </Box>
          </Box>
          <Box
            mt={2}
            sx={{
              display: 'flex',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#FFFFFF',
            }}
          >
            <Typography mr={2}>Đơn vị đang sở hữu:</Typography>
            <Typography>
              {tableProductInformation?.orgChart?.name ||
                'Trong kho'}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          {apartmentInformation &&
          Array.isArray(apartmentInformation.apartmentId) ? (
            <Grid container spacing={2}>
              {apartmentInformation.apartmentId.map((item: SubDataProtype) => (
                <Grid item xs={4}>
                  <Box sx={{ display: 'flex', margin: '10px 0' }}>
                    <Box
                      sx={{
                        width: '24px',
                        height: '20px',
                        background: renderBackgroundColorTable(
                          apartmentInformation.status,
                        ),
                        borderRadius: '2px',
                      }}
                    ></Box>
                    <Box
                      sx={{
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '20px',
                        color: '#FFFFFF',
                        ml: 2,
                        borderRadius: '4px',
                      }}
                    >
                      {item.code}
                    </Box>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#FFFFFF',
                  }}
                >
                  <Typography mr={2}>Đơn vị đang sở hữu:</Typography>
                  <Typography>
                    {apartmentInformation.apartmentId[0]?.orgChart?.name ||
                      'Trong kho'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
