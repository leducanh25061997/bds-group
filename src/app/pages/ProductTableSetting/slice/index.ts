import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { FileWithPath } from 'react-dropzone';
import { generateIdForObject } from 'utils/helpers';

import { productTableSaga } from './saga';

import {
  PayloadCheckUploadedFileSuccess,
  PayloadDeleteProductIsCreated,
  PayloadGetProductOfProject,
  PayloadGetProductTable,
  PayloadProductTable,
  PayloadUploadProductTable,
  ProductOfProject,
  ProductTableState,
  TableProductItem,
  PayloadCheckFileUpload,
  AdditionalProductItem,
} from './types';

const initialProductList = {
  data: {
    products: [],
    duplicate: [],
    error: [],
  },
};

export const initialState: ProductTableState = {
  uploadedProductTableProjectList: [],
  uploadedProductTableList: initialProductList,
};

const slice = createSlice({
  name: 'productTableSlice',
  initialState,
  reducers: {
    getProductTable: {
      reducer(state) {
        state.isLoading = true;
        return state;
      },
      prepare(params: PayloadGetProductTable, meta?: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    getProductTableSuccess: (
      state,
      action: PayloadAction<TableProductItem[]>,
    ) => {
      state.productTableData = action.payload;
      state.isLoading = false;
    },
    createProductTable: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadProductTable, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    checkFileUpload: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCheckFileUpload, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    checkFileUploadSuccess: (
      state,
      action: PayloadAction<PayloadCheckUploadedFileSuccess>,
    ) => {
      const productTableList = action.payload.result;

      const modifiedProductTableList = {
        ...state.uploadedProductTableList,
        data: {
          ...state.uploadedProductTableList.data,
          products: productTableList.data.products.map(item =>
            generateIdForObject(item, 'uuid'),
          ),
        },
      };

      state.uploadedProductTableList = modifiedProductTableList;

      if (action.payload.id && state.uploadedProductTableProjectList) {
        const { id } = action.payload;

        const objToUpdate = {
          id,
          uploadedProductTableList: modifiedProductTableList,
        };

        const index = state.uploadedProductTableProjectList.findIndex(
          item => item.id === id,
        );

        if (index !== -1) {
          state.uploadedProductTableProjectList[index] = objToUpdate;
        } else {
          state.uploadedProductTableProjectList.push(objToUpdate);
        }
      }
    },

    deleteProducts: (state, action: PayloadAction<AdditionalProductItem[]>) => {
      const deletedProductList = action.payload;
      const { products } = state.uploadedProductTableList.data;
      const newProducts = products.filter(
        item => !deletedProductList.some(delItem => delItem.uuid === item.uuid),
      );

      state.uploadedProductTableList.data.products = newProducts;
    },

    editProduct: (state, action: PayloadAction<AdditionalProductItem>) => {
      const newInfo = action.payload;
      const { products } = state.uploadedProductTableList.data;
      const index = products.findIndex(item => item.uuid === newInfo.uuid);
      products[index] = {
        ...products[index],
        ...newInfo,
      };
    },

    clearCurrentUploadedFile: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      state.currentUploadedFile = null;

      const { id } = action.payload;

      const deletedIndex = state.uploadedProductTableProjectList.findIndex(
        item => item.id === id,
      );

      if (deletedIndex !== -1) {
        state.uploadedProductTableProjectList.splice(deletedIndex, 1);
      }
    },
    // updateProductTable: {
    //   reducer(state) {
    //     return state;
    //   },
    //   prepare(params: PayloadProductTable, meta: (error?: any) => void) {
    //     return { payload: params, meta };
    //   },
    // },
    clearProductTableData: state => {
      state.productTableData = null;
    },
    deleteProductIsCreated: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadDeleteProductIsCreated,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },

    clearUploadedProductTable: state => {
      state.uploadedProductTableList = initialProductList;
    },

    getProductOfProject: (
      state,
      action: PayloadAction<PayloadGetProductOfProject>,
    ) => {},
    getProductOfProjectSuccess: (
      state,
      action: PayloadAction<ProductOfProject>,
    ) => {
      if (state.uploadedProductTableList) {
        state.uploadedProductTableList.data.products = action.payload.data.map(
          item => {
            const newObject = {
              id: item.id,
              code: item.code,
              block: item.block,
              floor: item.floor,
              position: item.position,
              type: item.type,
              status: item.status,
              bedRoom: item.bedRoom,
              area: item.area,
              subscription: item.subscription,
              direction: item.direction,
              corner: item.corner,
              carpetArea: item.carpetArea,
              builtUpArea: item.builtUpArea,
              unitPrice: item.unitPrice,
              unitPriceVat: item.unitPriceVat,
              price: item.price,
              priceVat: item.price,
              showPrice: item.showPrice,
            };

            return generateIdForObject(newObject, 'uuid');
          },
        );
      }
    },
  },
});

export const { actions: productTableActions } = slice;

export const useProductTableActionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productTableSaga });
  return { actions: slice.actions };
};
