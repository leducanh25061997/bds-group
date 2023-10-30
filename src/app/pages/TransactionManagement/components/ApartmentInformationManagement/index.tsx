import { Box, Radio, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { useLayoutsSlice } from 'app/pages/Layouts/slice';

import NODATA_ICON from 'assets/table/nodata-icon.svg';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ProjectTypeEnum } from 'types/Project';
import { selectGroundProductTable } from 'app/pages/GroundProductTable/slice/selectors';
import { selectProject } from 'app/pages/Projects/slice/selector';

import { useTransactionManagementSlice } from '../../slice';
import { selectTransactionManagement } from '../../slice/selector';

import { selectApartmentInformation } from './slice/selectors';
import { SettingTableProduct } from './slice/types';
import { useApartmentInformationsSlice } from './slice';
import { ApartmentInformation } from './components/ApartmentInformation';
import GroundPreview from './components/GroundPreview';
import PrioritiesList from './components/PrioritiesList';
import { GroundInformation } from './components/GroundInformation/indext';

const initialSelectedValue = {
  block: '',
  dataFloor: '',
  dataQuanlityProduct: '',
  projectId: '',
  jsonGround: '',
};

export const ApartmentInformationManagement = ({
  heightTable,
}: {
  heightTable: number;
}) => {
  const [selectedValue, setSelectedValue] =
    React.useState<SettingTableProduct>(initialSelectedValue);
  const dispatch = useDispatch();
  const { actions } = useApartmentInformationsSlice();
  const { actions: layoutActions } = useLayoutsSlice();
  const { actions: transactionManagementActions } =
    useTransactionManagementSlice();
  const { settingTableProduct, apartmentInformation } = useSelector(
    selectApartmentInformation,
  );
  const { groundProductTableData, isLoading } = useSelector(
    selectGroundProductTable,
  );
  const { ProjectDetail } = useSelector(selectProject);
  const { isDetail } = useSelector(selectTransactionManagement);
  const [blocks, setBlocks] = useState<SettingTableProduct[]>([]);
  const params = useParams();
  const { id } = params;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      dispatch(actions.handleClearDataTableProductInformation());
      dispatch(actions.handleClearDataTableProductInformation());
      dispatch(layoutActions.showRightBar(false));
      dispatch(layoutActions.handleShowBunble(false));
      dispatch(transactionManagementActions.clearDatatableProirity());
      dispatch(transactionManagementActions.changeView(true));
    };
  }, []);

  useEffect(() => {
    if (settingTableProduct && settingTableProduct.length > 0) {
      setBlocks(settingTableProduct);
      dispatch(actions.handleSelectBlock(settingTableProduct[0]));
      setSelectedValue(settingTableProduct[0]);
    }
  }, [settingTableProduct]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (blocks) {
      const data: SettingTableProduct[] = blocks?.filter(
        (item: SettingTableProduct) => item.block === value,
      );
      if (data.length > 0) {
        dispatch(actions.handleSelectBlock(data[0]));
        setSelectedValue(data[0]);
      }
    }
  };

  const controlProps = (item: string) => ({
    checked: selectedValue?.block === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const RenderItem = (
    item: SettingTableProduct,
    apartmentInformation: any,
    height: number,
  ) => {
    return (
      <ApartmentInformation
        block={item}
        dataApartmentInformation={apartmentInformation}
        maxHeight={height}
      />
    );
  };

  const renderNoValue = () => {
    return (
      <React.Fragment>
        <Box
          width="100%"
          height={'calc(75vh - 92.08px)'}
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
      </React.Fragment>
    );
  };

  const renderApartmentInformation = () => {
    return (
      <>
        {isDetail ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingLeft: '10px',
                width: '70px',
                maxHeight: `calc(${heightTable}px - 150px)`,
                overflow: 'auto',

                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    height: '70px',
                    border: '1px dashed rgba(214, 70, 95, 1)',
                    width: '1px',
                  }}
                ></Box>
                {blocks &&
                  blocks.map((item: SettingTableProduct, index: number) => (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'row-reverse',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            transform: 'rotate(-90deg)',
                            marginLeft: '-25px',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              fontWeight: 600,
                              fontSize: '12px',
                              lineHeight: '20px',
                              color: '#000000',
                              height: !item.block ? '20px' : 'unset',
                              width: 'max-content',
                            }}
                          >
                            {item.block}
                          </Box>
                          <Radio
                            {...controlProps(item.block)}
                            sx={{
                              padding: '0',
                              width: 'max-content',
                              color: 'rgba(214, 70, 95, 1)',
                              '&.Mui-checked': {
                                color: 'rgba(214, 70, 95, 1)',
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: '120px',
                          border: '1px dashed rgba(214, 70, 95, 1)',
                          width: '1px',
                        }}
                      ></Box>
                    </React.Fragment>
                  ))}
              </Box>
            </Box>
            <Box sx={{ width: 'calc(100% - 70px)' }}>
              {RenderItem(selectedValue, apartmentInformation, heightTable)}
            </Box>
          </>
        ) : (
          <PrioritiesList heightTable={heightTable} />
        )}
      </>
    );
  };

  const renderGroundInformation = () => {
    return (
      <>
        {isDetail ? (
          <>
            <Box sx={{ width: '100%' }}>
              {/* {/* {RenderItem(
              selectedValue,
              apartmentInformation,
              heightTable,
            )} */}
              {/* {RenderItem(
              blocks[1],
              apartmentInformation,
              heightTable,
            )} */}
              <GroundInformation
                block={selectedValue}
                dataApartmentInformation={apartmentInformation}
                maxHeight={heightTable}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <GroundPreview
              sx={{
                maxHeight: `calc(${heightTable}px - 150px)`,

                marginInline: 'auto',
              }}
            />
          </Box>
        )}
      </>
    );
  };

  const renderTable = () => {
    if (!ProjectDetail) {
      return renderNoValue();
    }

    if (ProjectDetail.type === ProjectTypeEnum.APARTMENT) {
      if (settingTableProduct && settingTableProduct.length > 0) {
        return renderApartmentInformation();
      } else {
        return renderNoValue();
      }
    } else {
      if (groundProductTableData && groundProductTableData.data.length > 0) {
        return renderGroundInformation();
      } else {
        return renderNoValue();
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'auto' }}>
      {renderTable()}
    </Box>
  );
};
