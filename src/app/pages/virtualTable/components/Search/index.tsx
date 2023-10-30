import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { FilterParams } from '../../slice/types';
import { useVirtualTableSlice } from '../../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectVirtualTable } from '../../slice/selectors';

export const Search = () => {
  const dispatch = useDispatch();
  const { actions: virtualTableActions } = useVirtualTableSlice();
  const { filterParams } = useSelector(selectVirtualTable);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (filterParams?.idProject) {
      const params: FilterParams = {...filterParams, code: value};
      dispatch(virtualTableActions.handleFilter(params));
      dispatch(virtualTableActions.fetchDatatable(params));
    }

  };


  const debounceOnChange = debounce(handleSearch, 350);

  return (
    <Box mr={2}>
      <TextField
        id="search"
        type="search"
        placeholder="Nhập từ khóa"
        // value={inputValue}
        sx={{ width: '222px', height: '44px' }}
        InputProps={{
          style: {
            height: '44px',
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={debounceOnChange}
      />
    </Box>
  );
};
