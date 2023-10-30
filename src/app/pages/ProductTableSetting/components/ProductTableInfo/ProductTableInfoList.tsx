import { Box, Paper, Typography, useTheme } from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter, useProfile } from 'app/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams, TableHeaderProps } from 'types';
import { debounce } from 'lodash';

import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import { useNavigate, useParams } from 'react-router-dom';
import { ReservationItem } from 'types/Transaction';
import { ProjectTypeEnum } from 'types/Project';
import { formatNumber } from 'utils/helpers';

import { selectProductTable } from '../../slice/selectors';
import {
  AdditionalProductItem,
  ProductItem,
  ProductTableOfProject,
} from '../../slice/types';
import ProductDetailDialog from '../ProductDetailDialog';
import { DeleteProductDialog } from '../DeleteProductDialog';
import { useProductTableActionsSlice } from '../../slice';
import EditProductForm from '../EditProductForm';

import ProductTableInfoTop from './ProductTableInfoTop';

export interface TypePopupActionTicket {
  isOpen: boolean;
  rowSelected?: ReservationItem | null;
}

interface ProductTableInfoListProps {
  projectType: ProjectTypeEnum;
  productTableOfProject: ProductItem[];
  isDisable?: boolean;
}

interface FilterProps {
  block: string;
  floor: string;
  search: string;
}

const ProductTableInfoList: React.FC<ProductTableInfoListProps> = ({
  projectType,
  productTableOfProject,
  isDisable,
}) => {
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useProductTableActionsSlice();
  const [isOpenDetail, setIsOpenDetail] = useState<{
    open: boolean;
    item: AdditionalProductItem | null;
  }>({
    open: false,
    item: null,
  });
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  const { uploadedProductTableList } = useSelector(selectProductTable);
  const [pageFilter, setPageFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    block: '',
    floor: '',
    search: '',
  });

  const [selectedProducts, setSelectedProducts] = useState<
    AdditionalProductItem[]
  >([]);

  const startIndex = (pageFilter.page - 1) * pageFilter.limit;
  const endIndex = startIndex + pageFilter.limit;

  const searchByFilters = (arr: ProductItem[], filters: FilterProps) => {
    const { search, block, floor } = filters;

    const regex = new RegExp(search, 'i'); // 'i' flag for case-insensitive search

    return arr.filter(item => {
      const nameMatch = regex.test(item.code.toLowerCase());
      const blockMatch =
        !block || item.block.toLowerCase() === block.toLowerCase();
      const floorMatch = !floor || item.floor === floor;

      return nameMatch && blockMatch && floorMatch;
    });
  };

  const filteredData = useMemo(() => {
    return searchByFilters(
      uploadedProductTableList?.data.products || [],
      filters,
    );
  }, [uploadedProductTableList?.data.products, filters]);

  const currentData = filteredData.slice(startIndex, endIndex);

  const isGroundType = projectType === ProjectTypeEnum.GROUND;

  let header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã sản phẩm',
        align: 'left',
        width: 140,
      },
      {
        id: 'block',
        label: isGroundType ? 'Phân khu' : 'Block',
        align: 'center',
        width: 100,
      },
      {
        id: 'floor',
        label: isGroundType ? 'Lô' : 'Tầng',
        width: 100,
        align: 'center',
      },
      {
        id: 'position',
        label: 'Vị trí căn',
        width: 100,
        align: 'center',
      },
      {
        id: 'status',
        label: 'Trạng thái',
        width: 140,
        align: 'center',
      },
      {
        id: 'bedroom',
        label: 'Phòng ngủ',
        width: 120,
        align: 'center',
      },
      {
        id: 'direction',
        label: 'Hướng',
        width: 115,
        align: 'center',
      },
      {
        id: 'view1',
        label: 'View',
        width: 200,
        align: 'center',
      },
      // {
      //   id: 'view2',
      //   label: 'View 2',
      //   width: 90,
      //   align: 'center',
      // },
      {
        id: 'corner',
        label: isGroundType ? 'Lô góc' : 'Căn góc',
        width: 112,
        align: 'center',
      },
      {
        id: 'carpetArea',
        label: (
          <span>
            Diện tích thông thuỷ (m<sup>2</sup>)
          </span>
        ),
        width: 140,
        align: 'center',
      },
      {
        id: 'buildUpArea',
        label: (
          <span>
            Diện tích Tim tường (m<sup>2</sup>)
          </span>
        ),
        width: 140,
        align: 'center',
      },
      {
        id: 'pricePerSquareMetreNoVAT',
        label: (
          <span>
            Đơn giá/(m<sup>2</sup>)
            <br />
            (Chưa VAT)
          </span>
        ),
        width: 140,
        align: 'center',
      },
      {
        id: 'pricePerSquareMetreHasVAT',
        label: (
          <span>
            Đơn giá/(m<sup>2</sup>)
            <br />
            (Có VAT)
          </span>
        ),
        width: 140,
        align: 'center',
      },
      {
        id: 'priceNoVAT',
        label: (
          <>
            Giá
            <br />
            (Chưa VAT)
          </>
        ),
        width: 160,
        align: 'center',
      },
      {
        id: 'priceHasVAT',
        label: (
          <>
            Giá
            <br />
            (Có VAT)
          </>
        ),
        width: 160,
        align: 'center',
      },
    ],
    [isGroundType],
  );

  header = header.filter(column =>
    isGroundType ? !['position', 'bedroom', 'floor'].includes(column.id) : true,
  );

  // const { filter, onFilterToQueryString } = useFilter({
  //   onFetchData: (params: FilterParams) => {
  //     fetchDataForPage({ ...params, status: 'RESERVATION', projectId: id });
  //   },
  //   defaultFilter: initialFilter,
  // });

  // const fetchListReservationLoading =
  //   isLoading[actions.fetchListReservation.type];

  // const fetchDataForPage = (params: FilterParams) => {
  //   dispatch(actions.fetchListReservation(params));
  // };
  const handleSelectRow = (item: AdditionalProductItem) => {
    setIsOpenDetail({
      open: true,
      item,
    });
  };

  const handleCloseDetailDialog = () => {
    setIsOpenDetail({
      open: false,
      item: null,
    });
  };

  const handleSelectedProduct = (item: AdditionalProductItem[]) => {
    setSelectedProducts(item);
  };

  const handleDeleteProducts = () => {
    dispatch(actions.deleteProducts(selectedProducts));
    setIsOpenDelete(false);
    setSelectedProducts([]);

    const maxPageSize = Math.ceil(filteredData.length / pageFilter.limit);

    if (pageFilter.page === maxPageSize) {
      setPageFilter({
        ...pageFilter,
        page: pageFilter.page - 1,
      });
    }
  };

  const renderItem = (item: AdditionalProductItem, index: number) => {
    if (projectType === ProjectTypeEnum.APARTMENT) {
      return [
        <EllipsisText
          text={item.code}
          line={1}
          color={'#007AFF'}
          handleClick={event => {
            event.stopPropagation();
            handleSelectRow(item);
          }}
        />,
        <EllipsisText text={item.block} line={1} />,
        <EllipsisText text={item.floor} line={1} />,
        <EllipsisText text={item.position} line={1} />,
        <EllipsisText text={item.status} line={1} />,
        <EllipsisText text={item.bedRoom} line={1} />,
        <EllipsisText text={item.direction} line={1} />,
        <EllipsisText text={item.subscription} line={1} />,
        // <EllipsisText text={`-`} line={1} />,
        <EllipsisText text={item.corner} line={1} />,
        <EllipsisText text={formatNumber(item.carpetArea)} line={1} />,
        <EllipsisText text={formatNumber(item.builtUpArea)} line={1} />,
        <EllipsisText text={formatNumber(item.unitPrice)} line={1} />,
        <EllipsisText text={formatNumber(item.unitPriceVat)} line={1} />,
        <EllipsisText text={formatNumber(item.price)} line={1} />,
        <EllipsisText text={formatNumber(item.priceVat)} line={1} />,
      ];
    } else {
      return [
        <EllipsisText
          text={item.code}
          line={1}
          color={'#007AFF'}
          handleClick={event => {
            event.stopPropagation();
            handleSelectRow(item);
          }}
        />,
        <EllipsisText text={item.block} line={1} />,
        // <EllipsisText text={item.floor} line={1} />,
        <EllipsisText text={item.status} line={1} />,
        <EllipsisText text={item.direction} line={1} />,
        <EllipsisText text={item.subscription} line={1} />,
        <EllipsisText text={item.corner} line={1} />,
        <EllipsisText text={formatNumber(item.carpetArea)} line={1} />,
        <EllipsisText text={formatNumber(item.builtUpArea)} line={1} />,
        <EllipsisText text={formatNumber(item.unitPrice)} line={1} />,
        <EllipsisText text={formatNumber(item.unitPriceVat)} line={1} />,
        <EllipsisText text={formatNumber(item.price)} line={1} />,
        <EllipsisText text={formatNumber(item.priceVat)} line={1} />,
      ];
    }
  };

  const onPageChange = (page: number) => {
    setPageFilter({
      ...pageFilter,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    setPageFilter({
      ...pageFilter,
      limit,
    });
  };

  const handleFilterChange = useCallback(
    (value: string, key: string) => {
      setFilters({
        ...filters,
        [key]: value,
      });
      setPageFilter({
        ...pageFilter,
        page: 1,
      });
    },
    [filters, pageFilter],
  );

  const debounceFilterChange = useMemo(() => {
    return debounce(handleFilterChange, 500);
  }, [handleFilterChange]);

  return (
    <>
      <ProductTableInfoTop
        productTableOfProject={productTableOfProject}
        onFilterChange={debounceFilterChange}
        isDisable={isDisable}
        isGround={isGroundType}
      />

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          padding: '14px 0px 0px 0px',
          position: 'relative',
        }}
      >
        <Table
          headers={header}
          renderItem={renderItem}
          // onClickRow={handleSelectRow}
          items={currentData}
          pageNumber={pageFilter.page}
          totalElements={filteredData.length}
          // sort={filter.orderBy}
          limitElement={pageFilter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // isLoading={fetchListReservationLoading}
          listSelected={selectedProducts}
          selectList={selectedProducts}
          hasCheckbox={!isDisable}
          selectBy="uuid"
          onSelectCheckbox={handleSelectedProduct}
        />
        {selectedProducts.length > 0 && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 80,
              right: 0,
              backgroundColor: 'primary.button',
              borderRadius: 9999,
              fontWeight: 700,
              color: 'white',
              px: 1.5,
              py: 1.25,
              cursor: 'pointer',
            }}
            onClick={() => setIsOpenDelete(true)}
          >
            Xoá {selectedProducts.length} sản phẩm
          </Typography>
        )}
      </Paper>
      {isOpenDetail.open && isOpenDetail.item && (
        <ProductDetailDialog
          open={isOpenDetail.open}
          item={isOpenDetail.item}
          onClose={() => handleCloseDetailDialog()}
          onOpenEdit={() => setIsOpenEdit(true)}
          isGround={isGroundType}
          isDisable={isDisable}
        />
      )}
      {isOpenDelete && (
        <DeleteProductDialog
          open={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          handleSubmit={() => handleDeleteProducts()}
          selectedProducts={selectedProducts}
        />
      )}
      {isOpenEdit && isOpenDetail.item && (
        <EditProductForm
          open={isOpenEdit}
          onClose={() => {
            setIsOpenEdit(false);
          }}
          onSave={() => {
            setIsOpenEdit(false);
            handleCloseDetailDialog();
          }}
          item={isOpenDetail.item}
          isGround={isGroundType}
        />
      )}
    </>
  );
};

export default ProductTableInfoList;
