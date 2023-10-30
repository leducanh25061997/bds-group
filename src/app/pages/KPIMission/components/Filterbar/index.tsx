import React, { Fragment, useRef, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import SEARCH_ICON from 'assets/table/icon-search.svg';

import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';

import FilterSelect from '../../../../components/FilterSelect';
import FilterDateRange from '../FilterDateRange';

import { BoxSearchIconImage, Search } from './FilterBarStyled';

interface Props {
  onChangeSearchInput: (keyword: string) => void;
  placeholder: string;
  isFilter?: boolean;
  submitFilter?: () => void;
  filterList: FilterListActions[];
  valueSelected?: string;
}

interface FilterListActions {
  label: string;
  options: OptionType[];
  type?: string;
  icon?: string;
  placeholder?: string;
  handleSelected?: (value: string | any) => void;
  onChange?: (date: Dayjs | null) => void;
}

interface OptionType {
  label: string;
  value: string;
  getValue?: any;
}

export default function FilterBar(props: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    onChangeSearchInput,
    placeholder,
    isFilter,
    submitFilter,
    filterList,
    valueSelected,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [valueInput, setValueInput] = useState(() => {
    if (searchParams?.get('keyword'))
      return searchParams?.get('keyword')?.replace('%2B', '+');
    return '';
  });
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
    timeoutId.current && clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      onChangeSearchInput(e.target.value.replaceAll('+', '%2B'));
    }, 500);
  };
  const handleFilter = () => {
    submitFilter?.();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: { xs: 'column', xl: 'row', sm: 'row', lg: 'row' },
        color: theme.palette.secondary.contrastText,
        height: {
          xs: '240px',
          sm: '96px',
          xl: '48px',
        },
      }}
    >
      <Search
        className="input"
        sx={{
          bgcolor: '#FFFFFF !important',
          '& input::placeholder': {
            color: theme.palette.primary.light,
          },
          borderRadius: '8px',
          width: '100%',
        }}
      >
        <BoxSearchIconImage src={SEARCH_ICON} alt="search icon" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleChangeSearchInput}
          value={valueInput}
          style={{ background: '#FFFFFF' }}
        />
      </Search>
      <Box
        sx={{
          marginTop: { xs: '12px', sm: '0px' },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: '12px', sm: '0px' },
          width: '100%',
          alignItems: 'center',
        }}
      >
        {filterList?.map(action => (
          <Fragment key={action.label}>
            <Box sx={{ marginLeft: '16px' }}>
              <FilterSelect
                list={action.options}
                handleSelected={action.handleSelected}
                isIcon
                iconURL={action.icon}
                valueSelected={valueSelected}
                type={action.type}
                placeholder={action.placeholder}
              />
            </Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
