import React, { Fragment, useRef, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEARCH_ICON from 'assets/table/search-table-icon.svg';
import CustomButton from 'app/components/Button';
import FilterDate from 'app/components/FilterDate';

import { translations } from 'locales/translations';

import { Dayjs } from 'dayjs';

import FilterSelect from '../../../../components/FilterSelect';

import { BoxSearchIconImage, Search } from './FilterBarStyled';

interface Props {
  onChangeSearchInput: (keyword: string) => void;
  placeholder: string;
  isFilter?: boolean;
  submitFilter?: () => void;
  filterList: FilterListActions[];
}

interface FilterListActions {
  label: string;
  options: OptionType[];
  type?: string;
  placeholder?: string;
  handleSelected?: (value: string) => void;
  onChange?: (date: Dayjs | null) => void;
}

interface OptionType {
  label: string;
  value: string;
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
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', xl: 'row' },
        color: theme.palette.secondary.contrastText,
        marginBottom: '10px',
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
          bgcolor: theme.palette.secondary.light,
          '& input::placeholder': {
            color: theme.palette.primary.light,
          },
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleChangeSearchInput}
          value={valueInput}
        />
        <BoxSearchIconImage src={SEARCH_ICON} alt="search icon" />
      </Search>
      <Box
        sx={{
          marginTop: { xs: '12px', sm: '0px' },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: '12px', sm: '0px' },
        }}
      >
        {filterList?.map(action => (
          <Fragment key={action.label}>
            {action.type === 'date' ? (
              <FilterDate
                onChange={action.onChange}
                placeholder={action?.placeholder}
              />
            ) : (
              <FilterSelect
                label={action.label}
                list={action.options}
                handleSelected={action.handleSelected}
              />
            )}
          </Fragment>
        ))}
        {isFilter && (
          <CustomButton
            title={t(translations.common.filter)}
            isIcon
            buttonMode={'filter'}
            sxProps={{
              background: theme.palette.primary.lighter,
            }}
            handleClick={handleFilter}
          />
        )}
      </Box>
    </Box>
  );
}
