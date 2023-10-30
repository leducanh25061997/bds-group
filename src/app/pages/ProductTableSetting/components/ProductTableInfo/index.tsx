import { useState } from 'react';

import { ProjectTypeEnum } from 'types/Project';

import { ProductItem, ProductTableOfProject } from '../../slice/types';

import ProductTableInfoTop from './ProductTableInfoTop';
import ProductTableInfoList from './ProductTableInfoList';

interface ProductTableInfoProps {
  productTableOfProject: ProductItem[];
  projectType: ProjectTypeEnum;
  isDisable?: boolean;
}

const ProductTableInfo: React.FC<ProductTableInfoProps> = ({
  productTableOfProject,
  projectType,
  isDisable,
}) => {
  return (
    <ProductTableInfoList
      projectType={projectType}
      productTableOfProject={productTableOfProject}
      isDisable={isDisable}
    />
  );
};

export default ProductTableInfo;
