/* eslint-disable no-nested-ternary */
import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
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
import TRANFER_ICON from 'assets/icons/tranfer-red.svg';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import NODATA_ICON from 'assets/table/nodata-icon.svg';

import { ProductPriorityAssemblyDialog } from '../../../ProductPriorityAssemblyDialog';
import { TooltipDetail } from '../TooltipDetail';
import { SettingTableProduct, SubDataProtype } from '../../slice/types';
import { PriorityAssemblyDetailsDialog } from '../../../ProductPriorityAssemblyDialog/PriorityAssemblyDetailsDialog';

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
    minWidth: '70px',
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

export const ApartmentInformation = ({
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
  const [isShowDataPriority, setIsShowDataPriority] = useState<boolean>(false);

  useEffect(() => {
    if (priorityStatus && (priorityStatus === PriorityStatus.OPEN_PRIORITY || priorityStatus === PriorityStatus.OPEN_PRIORITY_ADDITIONAL)) {
      setIsShowDataPriority(true)
    } else {
      setIsShowDataPriority(false)
    }
  }, [priorityStatus])

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
    if (block && dataApartmentInformation?.data) {
      if (block.block) {
        const blocks = dataApartmentInformation?.data[block.block];
        const valueQuanlityProduct = block.dataQuanlityProduct;
        const _dataFloor = block.dataFloor;
        const floors = _dataFloor?.split(',').slice().reverse();
        if (valueQuanlityProduct) {
          setDataQuanlityProduct(valueQuanlityProduct.split(','));
        }
        const quanlityProducts = valueQuanlityProduct?.split(',');
        const rows: any = [];
        for (let i = 0; i < floors.length; i++) {
          rows[i] = [];
          rows[i][0] = floors[i];
          for (let j = 0; j < quanlityProducts.length; j++) {
            if (blocks) {
              const filter = blocks.filter(
                (block: any) =>
                  block.floor === floors[i] &&
                  block.position === quanlityProducts[j],
              );

              if (filter.length > 0) {
                rows[i][j + 1] = filter[0];
              } else {
                rows[i][j + 1] = '';
              }
            } else {
              rows[i][j + 1] = '';
            }
          }
        }
        setDataRows(rows);
      } else {
        setDataRows([]);
      }
    }
  }, [block, dataApartmentInformation]);

  const handleClick = (id: string) => {
    dispatch(
      actions.showRightBar({
        isShowRightBar: true,
        apartmentId: id,
      }),
    );
  };
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
      case ColorPriority.RED:
        return `3px solid #D6465F`;
      default:
        return ``;
    }
  };

  return (
    <Paper ref={containerRef} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer
        sx={{
          border: '1px solid #D45B7A',
          borderRadius: '20px',
          maxHeight: maxHeight ? `calc(${maxHeight}px - 150px)` : 400,
        }}
      >
        {dataRows ? (
          <>
            {dataRows.length > 0 ? (
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      {block.block}
                    </StyledTableCell>
                    {dataQuanlityProduct.map(item => (
                      <StyledTableCell key={item} align="center" width="100px">
                        {item}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows.map((row: any[], indexRow: number) => (
                    <StyledTableRow key={`${indexRow}_table-row`}>
                      {row.map((item: SubDataProtype, index: number) => (
                        <StyledTableCell
                          align="center"
                          key={`${indexRow}_${index}_table-cell`}
                          // sx={{ cursor: index === 0 ? 'auto' : 'pointer' }}
                        >
                          <Box
                            id={`${indexRow}_${index}_table-cell`}
                            data-tooltip-id={`${indexRow}_${index}_table-cell`}
                            onClick={() => {
                              if (index === 0) return;
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
                              index > 0
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
                              cursor: index === 0 ? 'auto' : 'pointer',
                              border:
                                index > 0
                                  ? isDragging &&
                                    itemSelectedDrag.id === item.id
                                    ? '1px dashed #D6465F'
                                    : '1px solid #C8CBCF'
                                  : '',
                              borderRadius: '4px',
                              padding: '0',
                              minHeight: '22px',
                              maxHeight: '40px',
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
                                      : item.colorPriority &&
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
                                      : item.colorPriority &&
                                        RenderBorder(item.colorPriority)
                                    : ''
                                  : '',

                              // !dataApartmentInformation?.infProject.eventSales || dataApartmentInformation?.infProject.eventSales?.status === EventStatusEnum.NOT_START
                              //   ? priorityStatus &&
                              //     (priorityStatus ===
                              //       PriorityStatus.LOCK_PRIORITY ||
                              //       priorityStatus ===
                              //         PriorityStatus.NOT_OPENED_PRIORITY)
                              //     ? item?.colorPriority &&
                              //       RenderBorder(item.colorPriority)
                              //     : ''
                              //   : '',
                              // fontWeight: item.orgChart?.name ? '900' : 'unset',
                              background: index === 0 ? 'unset' : item.code ? (dataApartmentInformation?.infProject?.eventSales?.status !== EventStatusEnum.NOT_START || !priorityStatus || (priorityStatus === PriorityStatus.NOT_OPENED_PRIORITY || priorityStatus === PriorityStatus.LOCK_PRIORITY || priorityStatus === PriorityStatus.LOCK_PRIORITY_ADDITIONAL) ) ? renderBackgroundColorTable(item.status) : '#FFF' : '#ECECEE',

                              // background:
                              //   index === 0
                              //     ? 'unset'
                              //     : item.code
                              //     ? isPriority &&
                              //       item.colorPriority &&
                              //       priorityStatus &&
                              //       !(
                              //         priorityStatus ===
                              //           PriorityStatus.LOCK_PRIORITY ||
                              //         priorityStatus ===
                              //           PriorityStatus.NOT_OPENED_PRIORITY
                              //       )
                              //       ? '#FFF'
                              //       : renderBackgroundColorTable(item.status)
                              //     : '#ECECEE',
                            }}
                          >
                            {index > 0 && item.orgChart?.name && (
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
                            {(item.status === StatusProductEnum.WAIT_FILE ||
                              item.status === StatusProductEnum.BOOKING) &&
                              !(
                                item?.customerProduct?.tiket?.status ===
                                  ApplicableStatus.APPROVED_DEPOSIT ||
                                item?.customerProduct?.tiket?.status ===
                                  ApplicableStatus.APPROVED_TICKET
                              ) && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-3px',
                                    width: '10px',
                                  }}
                                >
                                  <img src={TRANFER_ICON} alt="Icon" />
                                </Box>
                              )}
                            {index === 0 ? item : item.code}
                            {index > 0 &&
                            listItems.length > 0 &&
                            listItems.filter(data => data.id === item.id)
                              .length > 0 ? (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '-6px',
                                  right: '-5px',
                                  borderRadius: '50%',
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
                          {!isDragging && item.code && (
                            <TooltipDetail
                              id={`${indexRow}_${index}_table-cell`}
                              data={item}
                              isPriority={isShowDataPriority}
                            />
                          )}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
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
          </>
        ) : (
          <LoadingScreen>
            <img
              src="/static/loader/spinner.svg"
              alt=""
              width={100}
              height={100}
            />
          </LoadingScreen>
        )}
      </TableContainer>
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
            borderRadius: '9999px',
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
    </Paper>
  );
};
