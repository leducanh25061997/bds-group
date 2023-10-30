import { Icon } from '@iconify/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  outlinedInputClasses,
  useTheme,
} from '@mui/material';
import { useFilter } from 'app/hooks';
import { debounce } from 'lodash';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { FilterParams } from 'types';

import palette from 'styles/theme/palette';

import ICON_FILTER from 'assets/table/icon-filter.svg';
import MyProjectList from './list';
import { useProjectSlice } from './slice';

export function Project() {
  const theme = useTheme();
  const { actions } = useProjectSlice();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>('');
  const urlParams = new URLSearchParams(window.location.search);
  const [valueSort, setValueSort] = useState<string>(
    urlParams.get('sort') || 'des',
  );

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 1000,
    };
  }, []);
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  useEffect(() => {
    onFilterToQueryString({
      ...initialFilter,
      sort: valueSort,
      search: search,
    });
  }, [valueSort]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    debounceQueryString(val, urlParams.get('sort') || valueSort);
  };

  const debounceQueryString = useCallback(
    debounce(
      (val: string, valSort: string) =>
        onFilterToQueryString({
          ...initialFilter,
          search: val,
          sort: valSort,
        }),
      300,
    ),
    [],
  );

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListProject(params));
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          fontSize={'18px'}
          fontWeight={700}
          color={palette.common.black}
        >
          {'Quản lý dự án'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            // mb: 3,
          }}
        >
          <Search search={search} onSearchChange={handleSearchChange} />
          <Box sx={{ marginLeft: '16px' }}>
            <SortProject sort={valueSort} setValueSort={setValueSort} />
          </Box>
        </Box>
      </Box>
      <MyProjectList />
    </Fragment>
  );
}

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
        width: '222px',
        height: '44px',

        [`& .${outlinedInputClasses.root}`]: {
          backgroundColor: '#fff',

          '&.Mui-focused, &:hover': {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: '#AFAFAF',
            },
          },
        },

        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: '#AFAFAF',
        },
      }}
      InputProps={{
        style: {
          height: '44px',
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

const SortProject: React.FC<{
  sort: string;
  setValueSort: (val: string) => void;
}> = ({ sort, setValueSort }) => {
  const theme = useTheme();

  const handleChange = (e: any) => {
    setValueSort(e.target.value);
  };
  const DATA_OPTION = [
    {
      label: 'Mới nhất',
      value: 'des',
    },
    {
      label: 'Cũ nhất',
      value: 'asc',
    },
  ];

  return (
    <FormControl
      sx={{
        '& .MuiSelect-select': {
          padding: '9px 12px 9px 32px',
          minWidth: '80px',
          fontSize: '14px',
          color: theme.palette.primary.light,
          bgcolor: theme.palette.common.white,
          border: '1px solid #D3D3D3',
          borderRadius: '8px',
        },
        '& .MuiFormLabel-root': {
          display: 'none',
        },
        '& .MuiInputBase-root': {
          borderRadius: '0px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        mr: { xs: 0, sm: '15px' },
      }}
    >
      <Select
        displayEmpty
        onChange={handleChange}
        defaultValue={DATA_OPTION[0].value}
        value={sort}
        sx={{
          '& .MuiSelect-select': {
            paddingRight: '50px !important',
          },
        }}
        IconComponent={() => (
          <>
            <Box
              sx={{
                position: 'absolute',
                right: 10,
                cursor: 'pointer',
              }}
            >
              <Icon icon="mingcute:down-line" width="18" />
            </Box>
            <img
              src={ICON_FILTER}
              style={{
                position: 'absolute',
                left: 10,
                cursor: 'pointer',
                fontSize: '20px',
              }}
            />
          </>
        )}
      >
        {DATA_OPTION?.map(item => (
          <MenuItem
            sx={{
              fontSize: '14px',
              height: '30px',
              color: 'black',
              fontWeight: '400',
              m: '3px',
              '&.Mui-selected': {
                backgroundColor: '#FDEAF4',
                borderRadius: '6px',
                fontWeight: '600',
              },
            }}
            disabled={item.value === 'null'}
            key={item.label}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
