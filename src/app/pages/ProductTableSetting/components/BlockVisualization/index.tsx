import { Box, Grid, GridProps, Stack } from '@mui/material';
import React, { Fragment } from 'react';
import { FieldArrayWithId } from 'react-hook-form';

import palette from 'styles/theme/palette';

import { BlockFields } from '../../slice/types';

import FloorLabels from './FloorLabels';
import ProductLabels from './ProductLabels';

interface BlockVisualizationProps {
  fields: FieldArrayWithId<
    {
      data: BlockFields[];
    },
    'data',
    'id'
  >[];
}

export const BlockVisualization: React.FC<BlockVisualizationProps> = ({
  fields,
}) => {
  const renderCells = (floors: string[], productPerFloor: string[]) => {
    return (
      <>
        <Grid container rowSpacing={0.5} direction="column">
          {floors
            .slice()
            .reverse()
            .map((outerItem, outerIndex, outerArr) => (
              <Grid
                key={`${outerItem}-${outerIndex}`}
                container
                item
                columnSpacing={0.5}
                flexWrap="nowrap"
                // sx={{
                //   display: 'flex',
                //   rowGap: '4px',
                // }}
              >
                {productPerFloor.map((innerItem, innerIndex) => (
                  <Cell
                    key={`${innerItem}-${innerIndex}`}
                    product={innerItem}
                    floor={outerItem}
                  />
                ))}
              </Grid>
            ))}
        </Grid>
      </>
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          borderRadius: '12px',
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C8CBCFFF' stroke-width='3' stroke-dasharray='4%2c11' stroke-dashoffset='11' stroke-linecap='square'/%3e%3c/svg%3e")`,
          px: 2.25,
          py: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            scrollSnapType: 'x mandatory',
            gap: '20px',
            overflowX: 'auto',
          }}
        >
          {fields.map((block, idx) => {
            const floors = block.dataFloor
              .split(',')
              .filter((str: string) => str.trim() !== '')
              .map(b => b.trim());
            const productsPerFloor = block.dataQuanlityProduct
              .split(',')
              .filter((str: string) => str.trim() !== '')
              .map(p => p.trim());

            return (
              <Stack key={block.id}>
                <Box
                  sx={{
                    typography: 'button',
                    textAlign: 'center',
                    backgroundColor: palette.primary.button,
                    borderRadius: '6px',
                    color: 'white',
                    mb: 0.5,
                  }}
                >
                  {block.block}
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 1.75,
                    border: '1px solid #D45B7A',
                    borderRadius: 1,
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      // gridTemplateColumns: '40px 1fr',
                      // alignItems: 'flex-end',
                    }}
                  >
                    <FloorLabels floors={floors} />
                    <Box
                    // sx={{
                    //   flex: '1',
                    // }}
                    >
                      {renderCells(floors, productsPerFloor)}
                    </Box>
                  </Box>
                  <ProductLabels products={productsPerFloor} />
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Box>
    </Fragment>
  );
};

{
  /* <ProductLabels products={productPerFloor} /> */
}

const Cell: React.FC<{ product: string; floor: string } & GridProps> = ({
  product,
  floor,
  ...props
}) => {
  return (
    <Grid item {...props}>
      <Box
        sx={{
          borderRadius: 0.5,
          border: '1px solid #E0E1E4',
          width: '28px',
          height: '28px',
        }}
      >
        {/* {floor}-{product} */}
      </Box>
    </Grid>
  );
};
