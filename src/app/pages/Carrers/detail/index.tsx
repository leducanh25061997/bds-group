import { Box, Grid, Typography, useTheme, Skeleton, List } from '@mui/material';
import BreadCrumb from 'app/components/BreadCrumb';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { Fragment, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import {
  Status,
  DataTypeRealEstate,
  EvidenceFlag,
  TransactionRealEstate,
} from 'types/Enum';
import { LicenseFile, Factor, View } from 'types/RealEstate';
import {
  formatCurrency,
  formatCurrencyAndDecimal,
  renderContent,
  returnFileType,
} from 'utils/helpers';
import moment from 'moment';

import ConfirmDialog from 'app/components/ConfirmDialog';

import { useRealEstateSlice } from '../slice/index';
import { selectRealEstate } from '../slice/selectors';

interface RealEstateDetailProps {
  RealEstateIdProps?: string;
}

export function RealEstateDetail(props: RealEstateDetailProps) {
  const { RealEstateIdProps } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { actions } = useRealEstateSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { isLoading, realEstateDetail } = useSelector(selectRealEstate);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [realEstateId, setRealEstateId] = useState<string | number>('');
  const { isShowSidebar } = useSelector(layoutsSelector);

  useEffect(() => {
    if (RealEstateIdProps) {
      dispatch(actions.getDetailRealEstate({ id: RealEstateIdProps }));
      setRealEstateId(RealEstateIdProps);
    } else if (id) {
      dispatch(actions.getDetailRealEstate({ id }));
      setRealEstateId(id);
    }
  }, [RealEstateIdProps, actions, dispatch, id]);

  const LayoutBox = styled(Box)<{ mt?: number | string }>`
    padding: 24px 24px 12px 24px;
    margin-top: ${props => `${(props?.mt && props?.mt) || '21px'}`};
    background: ${theme.palette.grey[0]};
  `;

  const TitleSection = styled(Typography)({
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
    color: theme.palette.primary.lighter,
  });

  const TitleItem = styled(Typography)({
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '17px',
    color: theme.palette.primary.light,
    '& span': {
      fontWeight: 400,
    },
  });

  const ResultItem = styled(Typography)({
    fontSize: '14px',
    lineHeight: '17px',
    color: theme.palette.primary.light,
  });

  const breadCrumbList = useMemo(() => {
    return [
      {
        label: 'QL tài sản',
        path: path.carrers,
      },
      {
        label: 'Bất động sản',
        path: path.carrers,
      },
      {
        label: 'Xem chi tiết',
        path: `/assets/real-estates/detail/${id}`,
        isActive: true,
      },
    ];
  }, [id]);

  const renderFiles = (files: LicenseFile[]) => {
    if (!files?.length) return;
    return files.map((file: LicenseFile) => (
      <Box
        key={file.file.filename}
        sx={{
          alignItems: 'center',
          display: 'flex',
          border: `1px solid ${theme.palette.primary.light}`,
          width: '250px',
          padding: '2px 4px',
          marginBottom: '16px',
        }}
      >
        <img
          width="18px"
          src={returnFileType(file.file.filename)}
          alt="file-icon"
        />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.primary.light,
            marginLeft: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {file.file.filename}
        </Typography>
      </Box>
    ));
  };

  const renderFieldData = (
    title: string,
    value?: string | number,
    nonBorder?: boolean,
    nonPb?: boolean,
    files?: LicenseFile[],
  ) => {
    return (
      <Grid
        container
        item
        sm={12}
        sx={{
          borderBottom: {
            xs: `1px solid ${theme.palette.grey[100]}`,
            md: nonBorder ? 'unset' : `1px solid ${theme.palette.grey[100]}`,
          },
          paddingBottom: {
            xs: '12px',
            md: nonPb ? 'unset' : '12px',
          },
        }}
      >
        <Grid item xs={12} sm={6}>
          <TitleItem>{title}</TitleItem>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ mt: { xs: '10px', sm: '0px' } }}>
          <ResultItem>
            {value?.toString().includes('\n') ? (
              <List
                sx={{
                  lineHeight: '20px',
                  paddingLeft: { xs: '8px' },
                  paddingRight: { xs: '8px' },
                }}
              >
                {value
                  ?.toString()
                  .split('\n')
                  .map(string => (
                    <li key={string}>{string}</li>
                  ))}
              </List>
            ) : (
              <ResultItem>
                {value === 'Invalid date' ? '--' : renderContent(value)}
              </ResultItem>
            )}
          </ResultItem>
          {!!files?.length && (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: { xs: 'none', md: 'absolute' },
                  maxHeight: { xs: '70px', md: '250px' },
                  overflowY: 'scroll',
                }}
                mt={4}
              >
                {files ? renderFiles(files) : null}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    );
  };
  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleSubmitDialog = () => {
    const payload = {
      id: realEstateId,
      status:
        realEstateDetail?.status === Status.ACTIVE
          ? Status.INACTIVE
          : Status.ACTIVE,
    };
    dispatch(
      actions.updateStatusRealEstate(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                realEstateDetail?.status === Status.ACTIVE
                  ? t(translations.realEstate.lockRealEstate)
                  : t(translations.realEstate.unlockRealEstate),
              type: 'success',
            }),
          );
          dispatch(actions.getDetailRealEstate({ id }));
          handleCloseDialog();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: t(translations.common.errorOccurred),
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const updateStatusExpanded = () => setIsExpanded(!isExpanded);
  const checkData = (data: string | undefined | number | null) => {
    if (data || data === 0) {
      return data;
    } else {
      return '--';
    }
  };

  const checkShape = (data: string | undefined) => {
    if (data === 'SQUARE') {
      return 'Vuông vắn';
    } else if (data === 'DISPROPORTIONATE') {
      return 'Không cân đối';
    } else if (data === 'L_SHAPE') {
      return 'Hình chữ L';
    } else if (data === 'TRIANGLE') {
      return 'Tam giác';
    } else if (data === 'TRAPEZIUM') {
      return 'Tóp hậu';
    }
  };
  return (
    <Box pb={3}>
      {!RealEstateIdProps && (
        <Box
          mt={3}
          display={'flex'}
          justifyContent="space-between"
          position="fixed"
          right="24px"
          bgcolor={theme.palette.grey[300]}
          width="100vw"
          zIndex={3}
          p="16px 0px"
          top="55px"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'none' },
            marginTop: { xs: '0px', sm: '24px' },
            right: { xs: '0px' },
            top: { xs: '55px', sm: '40px', lg: '55px' },
          }}
        >
          <Box
            sx={{
              marginLeft: {
                xs: '10px',
                sm: '15px',
                lg: !isShowSidebar ? '90px' : '295px',
                xl: !isShowSidebar ? '105px' : '295px',
              },
              marginBottom: { xs: '15px', sm: '0px' },
            }}
          >
            <BreadCrumb list={breadCrumbList} />
          </Box>
          <Box
            mt={4}
            sx={{
              marginLeft: { xs: '12px', sm: '0px' },
              marginRight: { xs: '0px', sm: '24px' },
              marginTop: { xs: '0px', sm: '24px' },
              marginBottom: { xs: '0px', sm: '12px' },
            }}
          >
            <CustomButton
              title={
                realEstateDetail?.status === Status.ACTIVE
                  ? t(translations.common.lock)
                  : t(translations.common.unlock)
              }
              isIcon
              handleClick={handleOpenDialog}
              buttonMode="lock"
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
                mr: 3,
              }}
              variant="outlined"
            />
            <CustomButton
              title={t(translations.common.edit)}
              variant="contained"
              isIcon
              buttonMode="edit"
              light
              handleClick={() => navigate(`/assets/real-estates/edit/${id}`)}
              typeButton={'submit'}
            />
          </Box>
        </Box>
      )}
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={!RealEstateIdProps ? '85px' : '0px'}>
              <TitleSection>Thông tin dữ liệu chung</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '1. Nguồn dữ liệu',
                        `${checkData(
                          realEstateDetail?.realEstate?.generalInfo?.dataSrc,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '2. Loại dữ liệu',
                        `${
                          checkData(
                            realEstateDetail?.realEstate?.generalInfo?.dataType,
                          ) === DataTypeRealEstate.VALUATION
                            ? 'Valuation'
                            : 'Market'
                        }`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '3. Loại giao dịch',
                        `${
                          checkData(
                            realEstateDetail?.realEstate?.generalInfo
                              ?.transactionType,
                          ) === TransactionRealEstate.AP
                            ? 'AP (Asking price)'
                            : 'SP (Selling price)'
                        }`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '4. Thời gian giao dịch',
                        `${moment(
                          realEstateDetail?.realEstate?.generalInfo
                            ?.transactionTime,
                        ).format('DD/MM/YYYY')}`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '5. Mã bất động sản',
                        `${checkData(
                          realEstateDetail?.realEstate?.generalInfo
                            ?.propertyCode,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '6. Tên dự án',
                        `${checkData(
                          realEstateDetail?.realEstate?.generalInfo
                            ?.realEstateProject?.name,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '7. Evidence Flag',
                        `${
                          checkData(
                            realEstateDetail?.realEstate?.generalInfo
                              ?.evidenceFlag,
                          ) === EvidenceFlag.SINGLE
                            ? 'Riêng lẻ'
                            : 'Dự án'
                        }`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
              <TitleSection>Vị trí bất động sản</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '8. Số nhà/Số căn hộ/Số lô *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo
                            ?.apartmentNumber,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '9. Đường/Phố *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.street,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '10. Xã/Phường *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.ward,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '11. Quận/Huyện *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.district,
                        )}`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {/* {renderFieldData(
                        '12. Quận/Huyện *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.district,
                        )}`,
                      )} */}
                      {renderFieldData(
                        '12. Thành phố/Tỉnh *',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.province,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '13. Số Tờ Số Thửa',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.location,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '14. Vĩ độ',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.latitude,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '15. Kinh độ',
                        `${checkData(
                          realEstateDetail?.realEstate?.positionInfo?.longitude,
                        )}`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
              <TitleSection>Diện tích và tình trạng pháp lý</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '16. Loại BĐS *',
                        `${checkData(
                          realEstateDetail?.realEstate?.sector?.name,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '17. Hiện trạng BĐS',
                        `${
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.status,
                          ) === 'OPERATING'
                            ? 'Operating'
                            : 'Vacant_Land'
                        }`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '18. Diện tích đất (m2)',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.area,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '19. Chiều rộng (m)',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.width,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '20. Chiều dài (m)',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.length,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '21. Diện tích đất theo hiện trạng (m2)',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo
                              ?.currentArea,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '22. Diện tích sàn (m2)',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.gfa,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '23. Hệ số sử dụng đất',
                        `${formatCurrencyAndDecimal(
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.plotRatio,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '24. Thời hạn sử dụng đất',
                        `${
                          checkData(
                            realEstateDetail?.realEstate?.statusInfo?.tenure,
                          ) === realEstateDetail?.realEstate?.statusInfo?.tenure
                            ? `Có thời hạn ${realEstateDetail?.realEstate?.statusInfo?.tenure} năm`
                            : '--'
                        }`,
                        false,
                        false,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '25. Hình dáng đất',
                        `${checkData(
                          checkShape(
                            realEstateDetail?.realEstate?.statusInfo?.shape,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '26. Lợi thế mặt tiền',
                        `${checkData(
                          realEstateDetail?.realEstate?.statusInfo
                            ?.frontageAdvantage?.name,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '27. Hướng nhìn',
                        `${realEstateDetail?.realEstate?.statusInfo?.realEstateViews.map(
                          (v: View) => v.view.name,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '28. Các yếu tố khác',
                        `${realEstateDetail?.realEstate?.statusInfo?.realEstateFactors.map(
                          (f: Factor) => f.factor.name,
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '29. Tình trạng pháp lý',
                        '',
                        true,
                        false,
                        realEstateDetail?.realEstate?.legalStatus?.licenses,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '30. Mô tả chung',
                        `${checkData(
                          realEstateDetail?.realEstate?.statusInfo?.description,
                        )}`,
                        false,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
              <TitleSection>Giá trị</TitleSection>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '31. Tổng giá trị (VNĐ) *',
                        `${formatCurrency(
                          checkData(realEstateDetail?.realEstate?.totalPrice),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '32. Tổng giá trị (USD) *',
                        `${formatCurrency(
                          checkData(
                            realEstateDetail?.realEstate?.totalPriceUSD,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '33. Giá trị/ diện tích đất',
                        `${formatCurrency(
                          checkData(
                            realEstateDetail?.realEstate?.priceUSDPerLA,
                          ),
                        )}`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '34. Giá trị/ diện tích sàn',
                        `${formatCurrency(
                          checkData(
                            realEstateDetail?.realEstate?.priceUSDPerGFA,
                          ),
                        )}`,
                      )}
                    </Grid>
                  </Grid>
                  <Grid container mt={2}>
                    <Grid item xs={12}>
                      {renderFieldData(
                        '35. Tỷ giá áp dụng (VNĐ/USD)',
                        `${formatCurrency(
                          checkData(realEstateDetail?.realEstate?.fx),
                        )}`,
                        true,
                        true,
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </LayoutBox>
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <CustomButton
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
              isIcon
              buttonMode={isExpanded ? 'collapse' : 'expand'}
              light
              sxProps={{
                border: `1px solid ${theme.palette.primary.lighter}`,
                color: theme.palette.primary.light,
                mr: 3,
                mt: '22px',
                ml: !RealEstateIdProps ? 0 : 3,
              }}
              variant="outlined"
              handleClick={updateStatusExpanded}
            />
          </Box>
          {isExpanded && (
            <Fragment>
              <Box
                sx={{
                  paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
                  paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
                }}
              >
                <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
                  <TitleSection>Hiện trạng</TitleSection>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} xl={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '36. Số lượng sản phẩm',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.units,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '37. DT đất thương phẩm (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.netLandArea,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '38. Hiện trạng đất',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.curLandStatus,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '39. Hiện trạng DT đất ở thấp tầng (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.curLandStatus_RLR,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '40. Hiện trạng DT đất ở cao tầng (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.curLandStatus_RHR,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '41. Hiện trạng DT đất TMDV (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.curLandStatus_Comercial,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '42. Hiện trạng DT đất nghỉ dưỡng (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.curLandStatus_Hospitality,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '43. Hiện trạng DT đất CN (m2)',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.additionalStatus
                                  ?.curLandStatus_Industrial,
                              ),
                            ),
                            true,
                            true,
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} xl={6}>
                      <Grid container mt={2}>
                        <Grid container>
                          <Grid item xs={12}>
                            {renderFieldData(
                              '44. Hiện trạng DT đất NN (m2)',
                              formatCurrencyAndDecimal(
                                checkData(
                                  realEstateDetail?.realEstate?.additionalStatus
                                    ?.curLandStatus_Agricultural,
                                ),
                              ),
                            )}
                          </Grid>
                        </Grid>
                        <Grid container mt={2}>
                          <Grid item xs={12}>
                            {renderFieldData(
                              '45. Năm xây dựng',
                              realEstateDetail?.realEstate?.additionalStatus
                                ?.launchYear,
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '46. Năm cải tạo',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.renovateYear,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '47. Năm hoàn thành (dự kiến)',
                            moment(
                              realEstateDetail?.realEstate?.additionalStatus
                                ?.completionYear,
                            ).format('YYYY'),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '48. Số lượng tòa nhà',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.noBlock,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '49. Số tầng',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.noFloor,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '50. Công suất dự án đang hoạt động (%)',
                            realEstateDetail?.realEstate?.additionalStatus
                              ?.occupancy,
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </LayoutBox>
              </Box>
              <Box
                sx={{
                  paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
                  paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
                }}
              >
                <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
                  <TitleSection>Giá trị ước tính</TitleSection>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} xl={6}>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '51. Tiền sử dụng đất ước tính (USD)',
                            formatCurrency(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.lufs,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '52. Tỷ suất vốn hóa (%)',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.capitalizationRate,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '53. Bên bán',
                            realEstateDetail?.realEstate?.estimatePrice?.seller,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '54. Bên mua',
                            realEstateDetail?.realEstate?.estimatePrice?.buyer,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '55. Price per m² on NLA (USD)',
                            formatCurrency(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.ppSquareOnNLA,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '56. IRR',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.irr,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '57. Market gross rent (USD/m²/mth)',
                            formatCurrency(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.mgr,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '58. Average daily rate',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.adr,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '59. Market yield',
                            formatCurrencyAndDecimal(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.marketYield,
                              ),
                            ),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '60. Price per room',
                            formatCurrency(
                              checkData(
                                realEstateDetail?.realEstate?.estimatePrice
                                  ?.ppr,
                              ),
                            ),
                            true,
                            true,
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} xl={6}>
                      <Grid container mt={2}>
                        <Grid container>
                          <Grid item xs={12}>
                            {renderFieldData(
                              '61. Bank',
                              realEstateDetail?.realEstate?.estimatePrice?.bank,
                            )}
                          </Grid>
                        </Grid>
                        <Grid container mt={2}>
                          <Grid item xs={12}>
                            {renderFieldData(
                              '62. Bank Instructor - Contact person',
                              realEstateDetail?.realEstate?.estimatePrice
                                ?.bankInstrContactPerson,
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '63. Bank Instructor - Phone',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.bankInstrPhone,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '64. Bank Instructor - Email',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.bankInstrEmail,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '65. Borrower - Name',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.borrowerName,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '66. Borrower - Mail',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.borrowerMail,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '67. Borrower - Phone',
                            realEstateDetail?.realEstate?.estimatePrice
                              ?.borrowerPhone,
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '68. Instructed date',
                            moment(
                              realEstateDetail?.realEstate?.estimatePrice
                                ?.instrDateTime,
                            ).format('DD/MM/YYYY'),
                          )}
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          {renderFieldData(
                            '69. Instructed time',
                            moment(
                              realEstateDetail?.realEstate?.estimatePrice
                                ?.instrDateTime,
                            ).format('hh:mm a'),
                            true,
                            true,
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </LayoutBox>
              </Box>
            </Fragment>
          )}
          <Box
            sx={{
              paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
              paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
            }}
          >
            <LayoutBox mt={!RealEstateIdProps ? '21px' : '0px'}>
              <TitleSection>Tình trạng</TitleSection>
              <TitleItem mt={2}>
                Tình trạng:
                <span style={{ marginLeft: '8px' }}>
                  {realEstateDetail?.status === Status.ACTIVE
                    ? 'Đang sử dụng'
                    : 'Ngưng sử dụng'}
                </span>
              </TitleItem>
            </LayoutBox>
          </Box>
        </>
      )}
      {isOpenDialog && (
        <ConfirmDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={
            realEstateDetail?.status === Status.ACTIVE
              ? t(translations.common.lock)
              : t(translations.common.unlock)
          }
        >
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            color={theme.palette.primary.light}
            mb={5}
          >
            {realEstateDetail?.status === Status.ACTIVE
              ? t(translations.realEstate.lockRealEstateMessage)
              : t(translations.realEstate.unlockRealEstateMessage)}
          </Typography>
        </ConfirmDialog>
      )}
    </Box>
  );
}
