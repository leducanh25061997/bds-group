/* eslint-disable no-nested-ternary */
import { Box, Divider, Grid, Typography, Stack } from '@mui/material';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import {
  ApplicableStatus,
  ColorPriority,
  DialogProtype,
  EventStatusEnum,
  PriorityStatus,
  StatusProductEnum,
} from 'types/Enum';
import { renderBackgroundColorTable } from 'utils/helpers';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Badge, { BadgeProps } from '@mui/material/Badge';
import GIFT_ICON from 'assets/icons/gift-icon.svg';
import { Icon } from '@iconify/react';
import { LoadingScreen } from 'app/components/Table';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import { selectGroundProductTable } from 'app/pages/GroundProductTable/slice/selectors';

import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import NODATA_ICON from 'assets/table/nodata-icon.svg';
import TRANFER_ICON from 'assets/icons/tranfer-red.svg';

import { ProductPriorityAssemblyDialog } from '../../../ProductPriorityAssemblyDialog';
import { TooltipDetail } from '../TooltipDetail';
import { SettingTableProduct, SubDataProtype } from '../../slice/types';
import { PriorityAssemblyDetailsDialog } from '../../../ProductPriorityAssemblyDialog/PriorityAssemblyDetailsDialog';
import { selectApartmentInformation } from '../../slice/selectors';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: '#FFFFFF',
    border: '1px solid #D6465F',
    color: '#D6465F',
    width: 'max-content',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FEF4FA',
    color: '#1E1E1E',
    // minWidth: '120px',
    padding: '2px',
  },
  [`&.${tableCellClasses.head}:first-child`]: {
    backgroundColor: '#FFD9EA',
    maxWidth: '80px',
    minWidth: '70px',
    width: '100px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.body} tr:last-child`]: {
    marginBottom: '10px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child': {
    marginBottom: '10px',
  },
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  '& td:first-child': {
    backgroundColor: '#FEF4FA',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '20px',
    color: '#1E1E1E',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    borderBottom: 0,
    padding: '2px',
    paddingBottom: '0px',
    // minHeight: '40px',
    minWidth: '60px',
  },
  '&:first-of-type td': {
    paddingTop: '10px',
  },
  '&:last-of-type td': {
    paddingBottom: '14px',
  },
  '& td:nth-of-type(2)': {
    paddingLeft: '10px',
  },
}));

export const GroundInformation = ({
  block,
  dataApartmentInformation,
  maxHeight,
}: {
  block: SettingTableProduct;
  dataApartmentInformation: any;
  maxHeight: number;
}) => {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const [dataQuanlityProduct, setDataQuanlityProduct] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<any[][] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [listItems, setListItems] = useState<SubDataProtype[]>([]);
  const handleDragging = (dragging: boolean) => setIsDragging(dragging);
  const { isMultipleSelectTable, apartmentInformation: apartmentsInfo } =
    useSelector(layoutsSelector);
  const [statusSelected, setStatusSelected] =
    useState<StatusProductEnum | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isPriority, setIsPririty] = React.useState(false);
  const [product, setProduct] = useState<SubDataProtype | null>(null);
  const containerRef: any = useRef(null);
  const { t } = useTranslation();
  const { priorityStatus } = useSelector(selectTransactionManagement);

  // const { settingTableProduct } = useSelector(selectApartmentInformation);
  const { groundProductTableData } = useSelector(selectGroundProductTable);
  const [isShowDataPriority, setIsShowDataPriority] = useState<boolean>(false);

  useEffect(() => {
    if (
      priorityStatus &&
      (priorityStatus === PriorityStatus.OPEN_PRIORITY ||
        priorityStatus === PriorityStatus.OPEN_PRIORITY_ADDITIONAL)
    ) {
      setIsShowDataPriority(true);
    } else {
      setIsShowDataPriority(false);
    }
  }, [priorityStatus]);
  const findObjData = useCallback(
    (block: string, dataQuanlityProduct: string) => {
      if (!dataApartmentInformation || !dataApartmentInformation.data[block]) {
        // Block not found in obj1, return an array of null values
        const positions = dataQuanlityProduct.split(',');
        return new Array(positions.length).fill(null);
      }

      const positions = dataQuanlityProduct.split(',');
      const data = positions.map(code => {
        const foundObj = dataApartmentInformation.data[block].find(
          (item: any) => item.code === code,
        );

        return foundObj ? foundObj : null;
      });

      return data;
    },
    [dataApartmentInformation],
  );

  const groundRows: any[] = useMemo(() => {
    setTimeout(() => {
      checkAndAlignBoxWidth();
    }, 100);
    if (!groundProductTableData?.data) return [];

    const rows = groundProductTableData.data.map(
      ({ block, dataQuanlityProduct }) => {
        const data = findObjData(block, dataQuanlityProduct);
        return { block, data };
      },
    );
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groundProductTableData, findObjData]);

  useEffect(() => {
    if (
      apartmentsInfo &&
      typeof apartmentsInfo.apartmentId !== 'string' &&
      Array.isArray(apartmentsInfo?.apartmentId)
    ) {
      setListItems(apartmentsInfo.apartmentId);

      if (apartmentsInfo?.status) {
        if (apartmentsInfo?.apartmentId.length === 0) {
          setStatusSelected(null);
        } else {
          setStatusSelected(apartmentsInfo.status);
        }
      }

      if (apartmentsInfo?.apartmentId.length === 0) {
        setStatusSelected(null);
      }
    } else {
      setListItems([]);
      setStatusSelected(null);
    }
  }, [apartmentsInfo]);

  useEffect(() => {
    setDataRows(null);
    if (dataApartmentInformation?.infProject) {
      setIsPririty(dataApartmentInformation?.infProject.isPriority);
    }
    // if (block && dataApartmentInformation?.data) {
    //   // console.log('block', block);
    //   if (block.block) {
    //     const blocks = dataApartmentInformation?.data[block.block];
    //     const valueQuanlityProduct = block.dataQuanlityProduct;
    //     const _dataFloor = block.dataFloor;
    //     const floors = _dataFloor?.split(',').slice().reverse();
    //     if (valueQuanlityProduct) {
    //       setDataQuanlityProduct(valueQuanlityProduct.split(','));
    //     }
    //     const quanlityProducts = valueQuanlityProduct?.split(',');
    //     const rows: any = [];
    //     for (let i = 0; i < floors.length; i++) {
    //       rows[i] = [];
    //       rows[i][0] = floors[i];
    //       for (let j = 0; j < quanlityProducts.length; j++) {
    //         if (blocks) {
    //           const filter = blocks.filter(
    //             (block: any) =>
    //               block.floor === floors[i] &&
    //               block.position === quanlityProducts[j],
    //           );

    //           if (filter.length > 0) {
    //             rows[i][j + 1] = filter[0];
    //           } else {
    //             rows[i][j + 1] = '';
    //           }
    //         } else {
    //           rows[i][j + 1] = '';
    //         }
    //       }
    //     }
    //     setDataRows(rows);
    //   } else {
    //     setDataRows([]);
    //   }
    // }
  }, [block, dataApartmentInformation]);

  const handleClick = (id: string) => {
    dispatch(
      actions.showRightBar({
        isShowRightBar: true,
        apartmentId: id,
      }),
    );
  };
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    const filters = listItems.filter(item => item.id === data.id);
    if (filters.length === 0) {
      setListItems([...listItems, data]);
    }
  };

  const [itemSelectedDrag, setItemSelectedDrag] = useState<any>(null);
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    data: SubDataProtype,
  ) => {
    e.dataTransfer.setData('text', JSON.stringify(data));
    setItemSelectedDrag(data);
    setStatusSelected(data.status);
    handleDragging(true);
  };
  const handleDragEnd = () => {
    setItemSelectedDrag(null);
    handleDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleClickBundle = () => {
    dispatch(actions.handleShowBunble(false));
    dispatch(
      actions.showRightBar({
        isShowRightBar: true,
        apartmentId: listItems,
        status: statusSelected,
      }),
    );
  };

  const handleClose = () => {
    setOpen(false);
    setProduct(null);
  };

  const handleShowPopup = (data: SubDataProtype) => {
    setOpen(true);
    setProduct(data);
  };

  const RenderBorder = (status: ColorPriority) => {
    switch (status) {
      case ColorPriority.BLUE:
        return `3px solid #3395FF`;

        break;
      case ColorPriority.RED:
        return `3px solid #D6465F`;
        break;
      default:
        return ``;
        break;
    }
  };

  // console.log('dataRows', dataRows, dataRows?.[0]);
  const [listW] = useState<number[]>([]);
  const checkAndAlignBoxWidthInit = () => {
    if (listW.length > 0) return;
    for (let i = 0; i < 1000; i++) {
      const element = document.getElementById(`box_class_name_${i}`);
      if (!element) break;
      listW.push(element.offsetWidth);
    }
  };
  const checkAndAlignBoxWidth = () => {
    checkAndAlignBoxWidthInit();
    const element = document.getElementById(`box_class_name_group`);
    const listWExp = [...listW];
    if (element && listW.length > 0) {
      const fullW = element.offsetWidth;
      let sumW = 0;
      let lastIdx = 0;
      for (let i = 0; i < listW.length; i++) {
        // nếu out max width
        if (sumW + listW[i] > fullW) {
          if (lastIdx === i) {
            const element = document.getElementById(`box_class_name_${i}`);
            if (element) element.style.width = fullW + 'px';
            listWExp[i] = fullW;
          } else {
            for (let k = lastIdx; k < i; k++) {
              const offset = (fullW - sumW) / (i - lastIdx);
              const element = document.getElementById(`box_class_name_${k}`);
              if (element) element.style.width = listW[k] + offset + 'px';
              listWExp[k] = listW[k] + offset;
            }
          }
          sumW = listW[i];
          lastIdx = lastIdx === i ? i + 1 : i;
        } else {
          sumW += listW[i];
        }
      }
      if (lastIdx < listW.length - 1) {
        for (let k = lastIdx; k < listW.length; k++) {
          const offset = (fullW - sumW) / (listW.length - lastIdx);
          const element = document.getElementById(`box_class_name_${k}`);
          if (element) element.style.width = listW[k] + offset + 'px';
        }
      } else if (
        lastIdx === listW.length - 1 &&
        listW[listW.length - 1] < listWExp[0]
      ) {
        const element = document.getElementById(
          `box_class_name_${listW.length - 1}`,
        );
        if (element) element.style.width = listWExp[0] + 'px';
      }
    }
  };

  return (
    <Box
      ref={containerRef}
      id="box_class_name_group"
      sx={{
        maxHeight: `calc(${maxHeight}px - 150px)`,
        overflow: 'auto',
      }}
    >
      {groundRows.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {groundRows.map((block, indexRow: number) => {
              return (
                <Grid item id={`box_class_name_${indexRow}`}>
                  <Box
                    sx={{
                      py: 2.25,
                      px: 2,
                      borderRadius: 0.5,
                      border: '1px solid',
                      borderColor: 'primary.darkRed',
                      backgroundColor: '#FEF4FA',
                    }}
                  >
                    <Typography
                      fontWeight={700}
                      textTransform="uppercase"
                      textAlign="center"
                      sx={{
                        py: 6,
                      }}
                    >
                      {block.block}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      overflow="auto hidden"
                      sx={{
                        margin: -1,
                        padding: 1,
                      }}
                    >
                      {block.data.map((item: any, index: number) => (
                        <Box
                          key={`${indexRow}_${index}_table-cell`}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Box
                            id={`${indexRow}_${index}_table-cell`}
                            data-tooltip-id={`${indexRow}_${index}_table-cell`}
                            onClick={() => {
                              if (item && !isMultipleSelectTable) {
                                if (
                                  dataApartmentInformation?.infProject
                                    .eventSales == null
                                ) {
                                  if (
                                    priorityStatus &&
                                    priorityStatus != null
                                  ) {
                                    if (
                                      priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.NOT_OPENED_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY_ADDITIONAL
                                    ) {
                                      handleClick(item.id);
                                    } else {
                                      handleShowPopup(item);
                                    }
                                  } else {
                                    handleClick(item.id);
                                  }
                                } else {
                                  if (
                                    dataApartmentInformation?.infProject
                                      .eventSales?.status === 'NOT_START'
                                  ) {
                                    if (
                                      priorityStatus &&
                                      priorityStatus != null
                                    ) {
                                      if (
                                        priorityStatus ===
                                          PriorityStatus.LOCK_PRIORITY ||
                                        priorityStatus ===
                                          PriorityStatus.NOT_OPENED_PRIORITY ||
                                        priorityStatus ===
                                          PriorityStatus.LOCK_PRIORITY_ADDITIONAL
                                      ) {
                                        handleClick(item.id);
                                      } else {
                                        handleShowPopup(item);
                                      }
                                    } else {
                                      handleClick(item.id);
                                    }
                                  } else {
                                    handleClick(item.id);
                                  }
                                }
                              }
                            }}
                            draggable={
                              item
                                ? statusSelected
                                  ? statusSelected === item.status
                                  : true
                                : false
                            }
                            onDragStart={e => handleDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              border:
                                isDragging &&
                                item &&
                                itemSelectedDrag.id === item.id
                                  ? '1px dashed #D6465F'
                                  : '1px solid #C8CBCF',
                              borderRadius: '4px',
                              padding: '0',
                              width: 24,
                              height: 60,
                              writingMode: 'vertical-lr',
                              transform: 'scale(-1)',
                              // fontSize: index > 0 ? '8px' : '12px',
                              fontSize: '12px',
                              position: 'relative',
                              // overflow: 'hidden',
                              borderBottom:
                                dataApartmentInformation?.infProject
                                  .eventSales == null
                                  ? priorityStatus && priorityStatus != null
                                    ? priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.NOT_OPENED_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY_ADDITIONAL
                                      ? ''
                                      : item?.colorPriority &&
                                        RenderBorder(item.colorPriority)
                                    : ''
                                  : dataApartmentInformation?.infProject
                                      .eventSales?.status === 'NOT_START'
                                  ? priorityStatus && priorityStatus != null
                                    ? priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.NOT_OPENED_PRIORITY ||
                                      priorityStatus ===
                                        PriorityStatus.LOCK_PRIORITY_ADDITIONAL
                                      ? ''
                                      : item?.colorPriority &&
                                        RenderBorder(item.colorPriority)
                                    : ''
                                  : '',
                              // fontWeight: item.orgChart?.name ? '900' : 'unset',
                              background:
                                // item && item.code
                                //   ? isPriority &&
                                //     item.colorPriority &&
                                //     priorityStatus &&
                                //     priorityStatus !==
                                //       PriorityStatus.LOCK_PRIORITY
                                //     ? '#FFF'
                                //     : renderBackgroundColorTable(item.status)
                                //   : '#ECECEE',
                                item && item.code
                                  ? dataApartmentInformation?.infProject
                                      ?.eventSales?.status !==
                                      EventStatusEnum.NOT_START ||
                                    !priorityStatus ||
                                    priorityStatus ===
                                      PriorityStatus.NOT_OPENED_PRIORITY ||
                                    priorityStatus ===
                                      PriorityStatus.LOCK_PRIORITY ||
                                    priorityStatus ===
                                      PriorityStatus.LOCK_PRIORITY_ADDITIONAL
                                    ? renderBackgroundColorTable(item.status)
                                    : '#FFF'
                                  : '#ECECEE',
                            }}
                          >
                            {item && item.orgChart?.name && (
                              <Box
                                sx={{
                                  width: '0',
                                  height: '0',
                                  borderStyle: 'solid',
                                  borderWidth: '7px 9px 0 0',
                                  borderRadius: '2px 0 0 0 ',
                                  borderColor:
                                    '#007bff transparent transparent transparent',
                                  position: 'absolute',
                                  left: '0px',
                                  top: '0px',
                                }}
                              ></Box>
                            )}

                            {(item?.status === StatusProductEnum.WAIT_FILE ||
                              item?.status === StatusProductEnum.BOOKING) &&
                              !(
                                item?.customerProduct?.tiket?.status ===
                                  ApplicableStatus.APPROVED_DEPOSIT ||
                                item?.customerProduct?.tiket?.status ===
                                  ApplicableStatus.APPROVED_TICKET
                              ) && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: '-5px',
                                    left: '-5px',
                                    width: '12px',
                                    transform: 'rotate(180deg)',
                                  }}
                                >
                                  <img src={TRANFER_ICON} alt="Icon" />
                                </Box>
                              )}

                            {item ? item.code : ''}
                            {listItems.length > 0 &&
                            listItems.filter(
                              data => item && data.id === item.id,
                            ).length > 0 ? (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: '-5px',
                                  right: '-5px',
                                  borderRadius: '50%',
                                  transform: 'rotate(180deg)',
                                  width: '12px',
                                  height: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Icon
                                  icon="teenyicons:tick-circle-solid"
                                  color="#2fb350"
                                  width="10"
                                  height="10"
                                />
                              </Box>
                            ) : null}
                          </Box>
                          {!isDragging && item && item.code && (
                            <TooltipDetail
                              id={`${indexRow}_${index}_table-cell`}
                              data={item}
                              isPriority={isShowDataPriority}
                            />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Box
          width="100%"
          sx={{
            padding: '100px 0',
          }}
          // height={'calc(75vh - 92.08px)'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          <img alt="No data" src={NODATA_ICON} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: '20px',
            }}
          >
            <Typography
              ml={'16px'}
              fontSize={'14px'}
              fontWeight={'400'}
              lineHeight={'28px'}
            >
              {t(translations.common.nodata)}
            </Typography>
          </Box>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isMultipleSelectTable}
        // onClose={handleClose}
        sx={{
          '& .MuiSnackbarContent-root': {
            background:
              'linear-gradient(143.72deg, #D6465F 15.94%, #FF8CA0 98.27%)',
            borderRadius: '25px',
          },
        }}
        key={'bottom' + 'right'}
      >
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            if (listItems.length > 0) {
              handleClickBundle();
            }
          }}
          sx={{
            cursor: 'pointer',
            background:
              'linear-gradient(143.72deg, #D6465F 15.94%, #FF8CA0 98.27%)',
            borderRadius: '25px',
            display: 'flex',
            // minWidth: '200px',
            padding: '16px 25px',
          }}
        >
          {/* <Box
            mr={1}
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            Sản phẩm đã chọn
          </Box> */}
          <Box>
            <StyledBadge badgeContent={listItems.length || 0}>
              <img src={GIFT_ICON} alt="Gift Icon" />
            </StyledBadge>
          </Box>
        </Box>
      </Snackbar>
      {open && product && Object.keys(product).length > 0 && product.id && (
        <>
          {priorityStatus === PriorityStatus.LOCK_PRIORITY ||
          priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL ? (
            <PriorityAssemblyDetailsDialog
              open={open}
              onClose={handleClose}
              product={product}
            />
          ) : (
            <ProductPriorityAssemblyDialog
              open={open}
              onClose={handleClose}
              product={product}
            />
          )}
        </>
      )}
    </Box>
  );
};
