import {
  Box,
  Grid,
  Tabs,
  Tab,
  Paper,
  TableContainer,
  Table,
  TableRow,
  styled,
  TableBody,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVirtualTable } from '../../slice/selectors';
import { RenderNoValue } from '../RenderNoValue';
import { SettingTableProduct, Product } from 'types/ProductTable';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { renderBackgroundColorTable } from 'utils/helpers';
import { FilterParams, ViewType } from '../../slice/types';
import { useVirtualTableSlice } from '../../slice';

import { Modal } from '../Modal';
import { ControlledCheckbox } from '../../Table/components/ControlledCheckbox';
import { TableHeadComponent } from './components/TableHeadComponent';
import { CustomTabPanel } from './components/CustomTabPanel';
import { Icon } from '@iconify/react';
import { SnackBarDrag } from './components/SnackBarDrag';
import { RenderStatus } from '../../View/components/RenderStatus';
interface Props {
  heightContainer: number;
  type: ViewType;
}

const minHeightTab = '40px';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
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
interface ModalType {
  isOpen: boolean;
  product?: Product | Product[] | null;
}

export function VirtualDataTable(props: Props) {
  const { heightContainer, type } = props;
  const { virtualDataTable, settingTableProduct, filterParams } =
    useSelector(selectVirtualTable);
  const [valueTab, setValueTab] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>();
  const [dataTable, setDataTable] = useState<any[][]>([]);
  const [quanlityProduct, setQuanlityProduct] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { actions: virtualTableActions } = useVirtualTableSlice();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalType>({
    isOpen: false,
    product: null,
  });
  // const [isDragging, setIsDragging] = useState(false);
  const handleDragging = (dragging: boolean) => {};
  const [itemSelectedDrag, setItemSelectedDrag] = useState<Product[]>([]);

  useEffect(() => {
    if (
      virtualDataTable &&
      settingTableProduct &&
      settingTableProduct.length > 0
    ) {
      if (filterParams && filterParams?.block) {
        setActiveTab(filterParams?.block);
        handleConvertData(filterParams.block);
      } else {
        setActiveTab(settingTableProduct[0].block);
        handleConvertData(settingTableProduct[0].block);
      }
    }
  }, [virtualDataTable, settingTableProduct, filterParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (settingTableProduct) {
      const data = settingTableProduct[newValue];
      if (filterParams?.idProject) {
        const params: FilterParams = { ...filterParams, block: data.block };
        dispatch(virtualTableActions.handleFilter(params));
        setActiveTab(data.block);
      }
    }
    setValueTab(newValue);
  };

  const handleConvertData = (block?: string) => {
    if (
      block &&
      virtualDataTable &&
      settingTableProduct &&
      settingTableProduct.length > 0
    ) {
      let blocks: Product[] = virtualDataTable?.data[block];
      const tableProducts = settingTableProduct.filter(
        item => item.block === block,
      );
      if (tableProducts.length) {
        const floors = tableProducts[0].dataFloor?.split(',').slice().reverse();
        const _quanlityProduct = tableProducts[0].dataQuanlityProduct;
        if (_quanlityProduct) {
          const titles = _quanlityProduct.split(',');
          setQuanlityProduct([...titles, '']);
        }
        const quanlityProducts = _quanlityProduct?.split(',');
        const rows: any = [];
        for (let i = 0; i < floors.length; i++) {
          rows[i] = [];
          rows[i][0] = floors[i];
          for (let j = 0; j <= quanlityProducts.length; j++) {
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
          setDataTable(rows);
        }
      }
    }
  };

  const handleChangeCheckbox = (isChecked: boolean) => {
    if (!isChecked) {
      setItemSelectedDrag([]);
    }
    setOpenSnackbar(isChecked);
  };

  const handleClick = (product: Product | Product[]) => {
    setModal({
      isOpen: true,
      product: product,
    });
  };

  const handleCloseModal = (isReload?: boolean) => {
    if (isReload) {
      setItemSelectedDrag([]);
      setOpenSnackbar(false);
    }
    setModal({
      isOpen: false,
      product: null,
    });
  };

  const handleDragEnd = () => {
    handleDragging(false);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    data: Product,
  ) => {
    e.dataTransfer.setData('text', JSON.stringify(data));
    handleDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    const filters = itemSelectedDrag.filter(
      (item: Product) => item.id === data.id,
    );
    if (filters.length === 0) {
      setItemSelectedDrag([...itemSelectedDrag, data]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  return (
    <Box mt={1}>
      {settingTableProduct && settingTableProduct.length > 0 ? (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Grid item xs={5} md={7}>
              <Box sx={{ display: 'flex', overflow: 'auto' }}>
                {settingTableProduct.map(
                  (tab: SettingTableProduct, index: number) => (
                    <Box
                      key={tab.block}
                      sx={{
                        '&:hover': { cursor: 'pointer' },
                        borderRadius: '12px 12px 0px 0px',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        marginRight: '4px',
                        background: activeTab === tab.block ? 'FFF' : '#FAFBFC',
                        fontSize: '14px',
                        fontWeight: activeTab === tab.block ? 700 : 400,
                        color: activeTab === tab.block ? 'D6465F' : '#000',
                        minHeight: minHeightTab,
                        minWidth: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div onClick={e => handleChange(e, index)}>
                        {tab.block}
                      </div>
                    </Box>
                  ),
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={7}
              md={5}
              sx={{ display: 'flex', justifyContent: 'end' }}
            >
              {type === ViewType.TABLE && (
                <ControlledCheckbox
                  handleChangeCheckbox={handleChangeCheckbox}
                  checked={openSnackbar}
                />
              )}
              {type === ViewType.VIEW && <RenderStatus />}
            </Grid>
          </Grid>

          <CustomTabPanel value={valueTab} index={valueTab}>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '0px 0px 8px 8px ',
              }}
            >
              <TableContainer
                sx={{
                  maxHeight: heightContainer
                    ? `calc(${heightContainer}px - 100px)`
                    : 400,
                }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHeadComponent
                    activeTab={activeTab}
                    quanlityProduct={quanlityProduct}
                  />
                  <TableBody>
                    {dataTable.map((rows: any[], indexRow: number) => (
                      <StyledTableRow key={`${indexRow}_table-row`}>
                        {rows.map((item: Product, index: number) => (
                          <StyledTableCell
                            align="center"
                            key={`${indexRow}_${index}_table-cell`}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor:
                                  index === 0 || index === rows.length - 1
                                    ? 'auto'
                                    : 'pointer',
                                border:
                                  index > 0 && index !== rows.length - 1
                                    ? '1px solid #C8CBCF'
                                    : '',
                                borderRadius: '4px',
                                padding: '0',
                                minWidth: '70px',
                                minHeight: '22px',
                                maxHeight: '40px',
                                fontSize: '12px',
                                position: 'relative',
                                background:
                                  index === 0 || index === rows.length - 1
                                    ? 'unset'
                                    : item.code
                                    ? renderBackgroundColorTable(
                                        item.virtualStatus,
                                      )
                                    : '#ECECEE',
                              }}
                              onClick={() => {
                                if (
                                  index > 0 &&
                                  item.code &&
                                  type === ViewType.TABLE
                                ) {
                                  handleClick(item);
                                }
                              }}
                              draggable={
                                index > 0 && openSnackbar && item.code
                                  ? true
                                  : false
                              }
                              onDragStart={e => handleDragStart(e, item)}
                              onDragEnd={handleDragEnd}
                            >
                              {index > 0 && item.status !== item.virtualStatus && (
                                <Box
                                  sx={{
                                    width: '0',
                                    height: '0',
                                    borderStyle: 'solid',
                                    borderWidth: '7px 9px 0 0',
                                    borderRadius: '2px 0 0 0 ',
                                    borderColor:
                                      '#BA0001 transparent transparent transparent',
                                    position: 'absolute',
                                    left: '0px',
                                    top: '0px',
                                  }}
                                ></Box>
                              )}
                              {index === 0 ? item : item.code}
                              {index > 0 &&
                              itemSelectedDrag.length > 0 &&
                              itemSelectedDrag.filter(
                                (data: Product) => data.id === item.id,
                              ).length > 0 ? (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-5px',
                                    borderRadius: '50%',
                                    width: '10px',
                                    height: '10px',
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
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                    <SnackBarDrag
                      handleDrop={handleDrop}
                      handleDragOver={handleDragOver}
                      handleClick={handleClick}
                      itemSelectedDrag={itemSelectedDrag}
                      openSnackbar={openSnackbar}
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </CustomTabPanel>
        </Box>
      ) : (
        <RenderNoValue />
      )}
      {modal.isOpen && modal.product && (
        <Modal
          onClose={handleCloseModal}
          open={modal.isOpen}
          product={modal.product}
        />
      )}
    </Box>
  );
}
