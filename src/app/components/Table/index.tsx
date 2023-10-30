/**
 *
 * Table
 *
 */
import { memo, useState, useEffect, ReactNode, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty, isUndefined } from 'lodash';
import {
  Table as MuiTable,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Grid,
  TableFooter,
  PaginationItem,
  Pagination,
  useTheme,
  Box,
  Checkbox,
  Radio,
} from '@mui/material';
import {
  TableHeaderProps,
  TableHeaderConfigurationPopup,
  TypeCheckBoxTable,
} from 'types';
import styled from 'styled-components';
import NODATA_ICON from 'assets/table/nodata-icon.svg';
import CHECK_ICON from 'assets/background/checkgreen_icon.svg';
import { translations } from 'locales/translations';
import { tableCellClasses } from '@mui/material/TableCell';

import KeyboardDoubleArrowRightSharpIcon from '@mui/icons-material/KeyboardDoubleArrowRightSharp';
import KeyboardDoubleArrowLeftSharpIcon from '@mui/icons-material/KeyboardDoubleArrowLeftSharp';

import PageSizeControl from './PageSizeControl';

import TableHead from './TableHeader';

export const LoadingScreen = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: '#FFFFFF',
    minWidth: '50px',
    right: 0,
    position: 'sticky',
    zIndex: 1000,
  },
}));

interface Props {
  headers: TableHeaderProps[];
  limitElement?: number;
  pageNumber?: number;
  items?: any[];
  totalElements?: number;
  renderItem: (item: any, index: number) => any[];
  onSelectRow?: (rowData: any) => void;
  onRequestSort?: (event: any, property: string) => void;
  onPageChange?: (page: number, limit?: number) => void;
  hasCheckbox?: boolean;
  sort?: string[];
  hidePagination?: boolean;
  onChangeHeaders?: (headers: TableHeaderProps[]) => void;
  onResetHeaders?: () => void;
  mainHeaders?: TableHeaderConfigurationPopup;
  additionalRow?: ReactNode;
  totalRow?: ReactNode;
  onPageSizeChange?: (take: number) => void;
  className?: string;
  hiddenPagination?: boolean;
  onClickRow?: (rowData: any) => void;
  onSelectCheckbox?: (rowData: any[]) => void;
  isFilter?: boolean;
  listSelected?: any[];
  filterList?: any[];
  onChecked?: (event: string) => void;
  countDisabledList?: number;
  fullHeight?: boolean;
  typeCheckBox?: TypeCheckBoxTable;
  setHeight?: string;
  isLoading?: boolean;
  dataType?: string;
  listCheckBox?: any[];
  isSelect?: boolean;
  selectList?: any[];
  handleSelectTable?: (value: any) => void;
  defaultSelect?: string;
  headerBackgroundColor?: string;
  minHeight?: string;
  selectBy?: string;
}

const Table = memo((props: Props) => {
  const {
    headers,
    limitElement = 10,
    listCheckBox,
    pageNumber,
    items,
    renderItem,
    totalElements = 0,
    onSelectRow,
    onPageChange,
    hasCheckbox,
    sort = [],
    onRequestSort,
    hidePagination,
    onChangeHeaders,
    onResetHeaders,
    mainHeaders,
    additionalRow,
    totalRow,
    onPageSizeChange,
    className,
    hiddenPagination,
    onClickRow,
    onSelectCheckbox,
    isFilter,
    listSelected,
    filterList,
    onChecked,
    countDisabledList,
    fullHeight = false,
    typeCheckBox = TypeCheckBoxTable.CHECKBOX,
    setHeight,
    dataType,
    isLoading = false,
    isSelect,
    selectList,
    handleSelectTable,
    defaultSelect,
    headerBackgroundColor,
    minHeight,
    selectBy,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const [page, setPage] = useState<number>(pageNumber || 1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<any[]>([]);
  const [itemListSelected, setItemListSelected] = useState<any>([]);

  useEffect(() => {
    if (limitElement) {
      setRowsPerPage(limitElement);
    }
  }, [limitElement]);

  useEffect(() => {
    setPage(pageNumber || 0);
  }, [pageNumber]);

  useEffect(() => {
    if (listSelected) {
      setSelected(listSelected);
      setItemListSelected(listSelected);
    }
  }, [listSelected]);

  const handleRequestSort = (event: any, property: string) => {
    if (onRequestSort) onRequestSort(event, property);
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      const newSelectedItems = !!items?.length ? items : [];
      setSelected(newSelectedItems);
      setItemListSelected(newSelectedItems);
      onSelectCheckbox?.(newSelectedItems);
      return;
    }
    resetListChoose();
  };

  const renderTextNodata = () => {
    switch (dataType) {
      default:
        return t(translations.common.nodata);
    }
  };

  const handleClick = (event: any, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    if (onPageChange) {
      setPage(newPage);
      onPageChange(newPage, rowsPerPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowPerPage);
    if (onPageChange) {
      onPageChange(page, newRowPerPage);
    }
  };

  const handleClickChecbox = (event: any, item: any) => {
    if (event.target.checked) {
      setSelected([...itemListSelected, item]);
      setItemListSelected([...itemListSelected, item]);
      onSelectCheckbox?.([...itemListSelected, item]);
    } else {
      const keyToCompare = selectBy ?? 'id';

      const itemSelected = itemListSelected?.find(
        (_selected: any) => _selected[keyToCompare] === item[keyToCompare],
      );
      setSelected(
        itemListSelected?.filter(
          (_selected: any) =>
            _selected[keyToCompare] !== itemSelected?.[keyToCompare],
        ),
      );
      setItemListSelected(
        itemListSelected?.filter(
          (_selected: any) =>
            _selected[keyToCompare] !== itemSelected?.[keyToCompare],
        ),
      );
      onSelectCheckbox?.(
        itemListSelected?.filter(
          (_selected: any) =>
            _selected[keyToCompare] !== itemSelected?.[keyToCompare],
        ),
      );
    }
  };

  const resetListChoose = () => {
    setSelected([]);
    setItemListSelected([]);
    onSelectCheckbox?.([]);
  };

  const handleClickRadioBox = (event: any, item: any) => {
    if (event.target.checked) {
      setSelected([item]);
      setItemListSelected([item]);
      onSelectCheckbox?.([item]);
    }
  };

  const handleSelectRow = (rowData: any) => {
    if (onSelectRow) {
      onSelectRow(rowData);
    }
  };

  const handleClickRow = (rowData: any) => {
    onClickRow?.(rowData);
  };

  const showHeader = (isShow?: boolean) => {
    return isShow !== undefined ? isShow : true;
  };

  const checkSelected = (rowData: any) => {
    const keyToCompare = selectBy ?? 'id';

    if (selected?.length) {
      if (
        selected.findIndex(e => rowData[keyToCompare] === e?.[keyToCompare]) >=
        0
      ) {
        return true;
      }
      return false;
    }
    return false;
  };
  if (isLoading) {
    return (
      <TableContainer
        sx={{
          // eslint-disable-next-line no-nested-ternary
          maxHeight: fullHeight ? 'unset' : setHeight ? setHeight : '62vh',
          minHeight: minHeight || '300px',
          '& .MuiTable-root': {
            // borderSpacing: '0px 8px',
            borderCollapse: 'collapse',
            '& tbody .MuiTableRow-root': {
              borderBottom: '1px solid #E0E1E4',
            },
          },
        }}
      >
        <LoadingScreen>
          <img
            src="/static/loader/spinner.svg"
            alt=""
            width={100}
            height={100}
          />
        </LoadingScreen>
      </TableContainer>
    );
  }

  return (
    <Grid>
      {isEmpty(items) ? (
        <>
          {isUndefined(items) ? (
            <LoadingScreen>
              <img
                src="/static/loader/spinner.svg"
                alt=""
                width={100}
                height={100}
              />
            </LoadingScreen>
          ) : (
            <Fragment>
              <Box
                height={setHeight ? setHeight : 'calc(75vh - 92.08px)'}
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
                    {renderTextNodata()}
                  </Typography>
                </Box>
              </Box>
            </Fragment>
          )}
        </>
      ) : (
        <>
          <TableContainer
            className={className}
            sx={{
              // eslint-disable-next-line no-nested-ternary
              maxHeight: fullHeight ? 'unset' : setHeight ? setHeight : '62vh',
              minHeight: minHeight || '300px',
              '& .MuiTable-root': {
                // borderSpacing: '0px 8px',
                borderCollapse: 'collapse',
                '& tbody .MuiTableRow-root': {
                  borderBottom: '1px solid #E0E1E4',
                },
              },
            }}
          >
            <MuiTable stickyHeader>
              <TableHead
                sort={sort}
                onChangeHeaders={onChangeHeaders}
                onResetHeaders={onResetHeaders}
                headLabel={headers}
                mainHeaders={mainHeaders}
                rowCount={totalElements}
                numSelected={selected.length}
                selected={selected}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                isFilter={isFilter}
                filterList={filterList}
                onChecked={onChecked}
                countDisabledList={countDisabledList}
                hasCheckbox={hasCheckbox}
                typeCheckBox={typeCheckBox}
                limitElement={limitElement}
                isSelect={isSelect}
                selectList={selectList}
                handleSelectTable={handleSelectTable}
                defaultSelect={defaultSelect}
                headerBackgroundColor={headerBackgroundColor}
                items={items}
                selectBy={selectBy}
              />
              <TableBody
                sx={{
                  '.MuiTypography-root': {
                    fontSize: 14,
                  },
                }}
              >
                {items?.map((item, index) => {
                  const isCheck = listCheckBox?.includes(item);
                  return (
                    <TableRow
                      key={index}
                      onClick={event => handleSelectRow(item)}
                      sx={{
                        ':hover': {
                          cursor: 'pointer',
                          background: onClickRow
                            ? theme.palette.secondary.dark
                            : theme.palette.secondary.lighter,
                        },
                        background: 'white',
                        '& .MuiTableCell-root': {
                          padding: '8.3px 15px !important',
                          borderBottom: 'unset',
                        },
                      }}
                    >
                      {hasCheckbox && (isCheck || item.isPaid) ? (
                        <Box sx={{ display: 'flex', mt: '16px' }}>
                          <img src={CHECK_ICON} />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#2FB350',
                              ml: '8.5px',
                            }}
                          >
                            Đã chi
                          </Typography>
                        </Box>
                      ) : (
                        hasCheckbox && (
                          <TableCell padding="checkbox">
                            {typeCheckBox === TypeCheckBoxTable.RADIO ? (
                              <Radio
                                checked={checkSelected(item)}
                                onClick={event => {
                                  resetListChoose();
                                  handleClickRadioBox(event, item);
                                }}
                              />
                            ) : (
                              <Checkbox
                                color="success"
                                checked={checkSelected(item)}
                                onClick={event => {
                                  handleClickChecbox(event, item);
                                }}
                              />
                            )}
                          </TableCell>
                        )
                      )}
                      {renderItem(item, index).map((col, index) => {
                        if (headers[index]?.isFixed) {
                          return (
                            <StickyTableCell
                              sx={{
                                wordBreak: 'none',
                                whiteSpace: headers?.[index]?.hasNotWrap
                                  ? 'none'
                                  : 'nowrap',
                                position: headers?.[index]?.position
                                  ? '-webkit-sticky'
                                  : null,
                              }}
                              key={index}
                              align={headers?.[index]?.align}
                              style={{
                                width: headers?.[index]?.width || '100%',
                                ...headers?.[index]?.style,
                                position: headers?.[index]?.position,
                                left: headers?.[index]?.left,
                                // padding: headers[index] && '24px 30px',
                                padding: headers?.[index] && '24px 15px',
                              }}
                              onClick={event => {
                                handleClickRow(item);
                                if (headers?.[index]?.disable) {
                                  event.stopPropagation();
                                }
                              }}
                            >
                              {col}
                            </StickyTableCell>
                          );
                        }
                        return (
                          showHeader(headers[index]?.isShow) && (
                            <TableCell
                              sx={{
                                wordBreak: 'none',
                                whiteSpace: headers?.[index]?.hasNotWrap
                                  ? 'none'
                                  : 'nowrap',
                                position: headers?.[index]?.position
                                  ? '-webkit-sticky'
                                  : null,
                              }}
                              key={index}
                              align={headers?.[index]?.align}
                              style={{
                                width: headers?.[index]?.width,
                                ...headers?.[index]?.style,
                                position: headers?.[index]?.position,
                                left: headers?.[index]?.left,
                                // padding: headers[index] && '24px 30px',
                                padding: headers?.[index] && '24px 15px',
                              }}
                              onClick={event => {
                                handleClickRow(item);
                                if (headers?.[index]?.disable) {
                                  event.stopPropagation();
                                }
                              }}
                            >
                              {col}
                            </TableCell>
                          )
                        );
                      })}
                    </TableRow>
                  );
                })}
                {additionalRow && additionalRow}
                {totalRow && totalRow}
              </TableBody>
            </MuiTable>
          </TableContainer>
          <TableFooter
            sx={{
              display: hiddenPagination ? 'none' : 'block',
              background: theme.palette.grey[0],
            }}
          >
            {!hidePagination && (
              <Stack direction="row" justifyContent="space-between" p={2}>
                <Typography
                  sx={{
                    alignItems: 'center',
                    color: '#676a6c',
                    fontSize: '14px',
                    lineHeight: '19px',
                  }}
                >
                  {`Tổng: ${totalElements}`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <PageSizeControl
                    page={page}
                    onPageSizeChange={onPageSizeChange}
                    pageSize={limitElement}
                    rowsPerPageOptions={[10, 20, 30, 50]}
                    rowCount={totalElements}
                  />
                  <Pagination
                    showFirstButton
                    shape="rounded"
                    showLastButton
                    className="pagination"
                    count={
                      totalElements
                        ? Math.ceil(totalElements / limitElement)
                        : 0
                    }
                    page={page}
                    onChange={(e, page) => onPageChange && onPageChange(page)}
                    renderItem={item => (
                      <PaginationItem
                        components={{
                          first: KeyboardDoubleArrowLeftSharpIcon,
                          last: KeyboardDoubleArrowRightSharpIcon,
                        }}
                        sx={{
                          '&.Mui-selected': {
                            color: 'primary.darkRed',
                          },
                          '&.MuiPaginationItem-previousNext, &.MuiPaginationItem-firstLast':
                            {
                              color: 'primary.darkRed',
                            },
                        }}
                        {...item}
                      />
                    )}
                  />
                </Box>
              </Stack>
            )}
          </TableFooter>
        </>
      )}
    </Grid>
  );
});

export default Table;
