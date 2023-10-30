import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  outlinedInputClasses,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';

import SearchIcon from '@mui/icons-material/Search';

import ConfirmDialog from 'app/components/ConfirmDialog';
import SelectBar from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/components/SelectBar';

import { selectProductTable } from '../../slice/selectors';
import { useProductTableActionsSlice } from '../../slice';
import { ProductItem, ProductTableOfProject } from '../../slice/types';
import { useProductTableContext } from '../../context/RootContext';
interface ProductTableInfoTopProps {
  isDisable?: boolean;
  productTableOfProject: ProductItem[];
  onFilterChange: (value: string, key: string) => void;
  isGround?: boolean;
}

interface Option {
  label: string;
  value: string;
}

const ProductTableInfoTop: React.FC<ProductTableInfoTopProps> = ({
  productTableOfProject,
  onFilterChange,
  isDisable,
  isGround,
}) => {
  const dispatch = useDispatch();
  const { actions } = useProductTableActionsSlice();
  const { showPrice, setShowPrice } = useProductTableContext();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [blockFilter, setBlockFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [search, setSearch] = useState('');

  // const handleDeleteFile = () => {
  //   // onUploadStateChange(false);
  //   dispatch(
  //     actions.clearCurrentUploadedFile({ id: productTableOfProject.id }),
  //   );
  // };

  const createOptions = (
    data: { [key: string]: any }[] | undefined,
    propertyName: string,
  ): Option[] => {
    const options: Option[] = [];
    const lookup: { [key: string]: boolean } = {};

    if (!data || data.length === 0) return options;

    for (let i = 0; i < data.length; ++i) {
      const value = data[i][propertyName];
      if (value && !lookup[value]) {
        lookup[value] = true;
        options.push({
          value,
          label: value,
        });
      }
    }

    return options.sort((a, b) => a.label.localeCompare(b.label));
  };

  const blockList: Option[] = useMemo(() => {
    return createOptions(productTableOfProject ?? [], 'block');
  }, [productTableOfProject]);

  const floorList: Option[] = useMemo(() => {
    return createOptions(productTableOfProject ?? [], 'floor');
  }, [productTableOfProject]);

  const handleFilterChange = (value: string, key: string) => {
    onFilterChange(value, key);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleFilterChange(value, 'search');
  };

  return (
    <>
      <Stack
        direction={'row'}
        spacing={2}
        sx={{
          backgroundColor: 'primary.barList',
          px: 2,
          py: '6px',
          borderRadius: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flex: 1,
          }}
        >
          <Search search={search} onSearchChange={handleSearchChange} />
          <Box
            sx={{
              maxWidth: '220px',
            }}
          >
            <SelectBar
              list={blockList}
              placeholder="Block"
              valueSelected={blockFilter}
              handleSelected={(value: string) => {
                setBlockFilter(value);
                handleFilterChange(value, 'block');
              }}
              handleRemove={() => {
                setBlockFilter('');
                handleFilterChange('', 'block');
              }}
            />
          </Box>
          {!isGround && (
            <Box
              sx={{
                maxWidth: '250px',
              }}
            >
              <SelectBar
                list={floorList}
                placeholder="Tầng"
                valueSelected={floorFilter}
                handleSelected={(value: string) => {
                  setFloorFilter(value);
                  handleFilterChange(value, 'floor');
                }}
                handleRemove={() => {
                  setFloorFilter('');
                  handleFilterChange('', 'floor');
                }}
              />
            </Box>
          )}
        </Stack>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              height: '100%',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Giá sản phẩm:
            </Typography>
            <Box
              height={36}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #C8CBCF',
                borderRadius: '999px',
                padding: '1px',
                ml: 1.75,
                backgroundColor: '#ffffff',
              }}
            >
              <SwitchChild
                showPrice={showPrice}
                isDisable={isDisable}
                onShowPriceClick={() => setShowPrice(true)}
              >
                Hiển thị
              </SwitchChild>
              <SwitchChild
                showPrice={!showPrice}
                isDisable={isDisable}
                onShowPriceClick={() => setShowPrice(false)}
              >
                Ẩn
              </SwitchChild>
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* <ConfirmDialog
        isOpen={isOpenDialog}
        handleClose={() => setIsOpenDialog(false)}
        handleSubmit={handleDeleteFile}
        isIcon={false}
        actionName={'Xác nhận'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            fontSize={'24px'}
            fontWeight={700}
            width={400}
            color={palette.primary.text}
            mx="auto"
            mb={2}
            mt={2}
            textAlign={'center'}
          >
            Xoá bảng hàng
          </Typography>
          <Typography
            fontSize={'16px'}
            fontWeight={400}
            color={palette.primary.text}
            mb={5}
            textAlign={'center'}
          >
            Bạn có chắc chắc muốn xoá bảng hàng hiện tại không?
          </Typography>
        </div>
      </ConfirmDialog> */}
    </>
  );
};

const SwitchChild: React.FC<{
  showPrice: boolean;
  isDisable?: boolean;
  onShowPriceClick: () => void;
}> = ({ isDisable, showPrice, onShowPriceClick, children }) => {
  return (
    <Box
      typography="body2"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minWidth: '60px',
        px: 1,
        backgroundColor: showPrice
          ? isDisable
            ? 'grey'
            : 'primary.button'
          : 'transparent',
        color: showPrice ? 'white' : 'black',
        fontWeight: '600',
        borderRadius: 'inherit',
        cursor: 'pointer',
        lineHeight: 1,
      }}
      onClick={isDisable ? () => null : onShowPriceClick}
    >
      {children}
    </Box>
  );
};
const Search: React.FC<{
  search: string;
  onSearchChange: (val: string) => void;
}> = ({ search, onSearchChange }) => {
  const handleSearchChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    onSearchChange(e.target.value);
  };

  return (
    <TextField
      id="search"
      type="search"
      placeholder="Nhập từ khóa"
      sx={{
        width: '220px',
        height: '43px',

        [`& .${outlinedInputClasses.root}`]: {
          backgroundColor: '#fff',

          '&.Mui-focused, &:hover': {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: '#D3D3D3',
              borderWidth: '1px',
            },
          },
        },

        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: '#D3D3D3',
        },
      }}
      InputProps={{
        style: {
          height: '43px',
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon
              sx={{
                color: '#1E1E1E',
              }}
            />
          </InputAdornment>
        ),
      }}
      value={search}
      onChange={e => handleSearchChange(e)}
    />
  );
};

export default ProductTableInfoTop;
