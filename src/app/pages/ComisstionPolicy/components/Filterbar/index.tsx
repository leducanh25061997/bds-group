import React, { Fragment, useRef, useState } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import FILLTER_ICON from 'assets/background/filter-icon.svg';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import palette from 'styles/theme/palette';

import FilterSelect from '../../../../components/FilterSelect';

import { BoxSearch } from './FilterbarStyled';

interface Props {
  onChangeSearchInput: (keyword: string) => void;
  placeholder: string;
  isFilter?: boolean;
  submitFilter?: () => void;
  filterList: FilterListActions[];
  filterListPhase?: FilterListActions[];
}

interface FilterListActions {
  label: string;
  options: OptionType[];
  handleSelected: (value: string) => void;
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
    filterListPhase,
    isFilter,
    submitFilter,
    filterList,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [valueInput, setValueInput] = useState(() => {
    if (searchParams?.get('query'))
      return searchParams?.get('query')?.replace('%2B', '+');
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
        flexDirection: { xs: 'column', md: 'row' },
        color: theme.palette.secondary.contrastText,
        bgcolor: palette.primary.barList,
        borderRadius: '8px',
        mb: '15px',
        p: '20px 20px 8px 20px',
        // height: {
        //   xs: '198px',
        //   sm: '100px',
        //   md: '72px',
        // },
      }}
    >
      <BoxSearch
        className="input"
        sx={{
          bgcolor: palette.common.white,
          '& input::placeholder': {
            color: '#AFAFAF',
          },
          border: `1px solid #D3D3D3`,
          borderRadius: '8px',
          mr: '15px',
          width: {
            md: '258px',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: '#222222',
            background: theme.palette.common.white,
            p: '0px 8px 0px 8px',
            mb: '45px',
            ml: '12px',
            position: 'absolute',
          }}
        >
          Từ khoá tìm kiếm
        </Typography>
        <input
          style={{
            borderRadius: '8px',
            backgroundColor: palette.common.white,
            fontSize: 14,
            fontWeight: 400,
            paddingRight: '15px',
          }}
          type="text"
          placeholder={'Nhập từ khoá tìm kiếm'}
          onChange={handleChangeSearchInput}
          value={valueInput}
        />
      </BoxSearch>
      <Box
        sx={{
          marginTop: { xs: '12px', md: '0px' },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: '12px', sm: '0px' },
        }}
      >
        {filterList?.map(action => (
          <Fragment key={action.label}>
            <FilterSelect
              label={action.label}
              list={action.options}
              handleSelected={action.handleSelected}
            />
          </Fragment>
        ))}
        {filterListPhase?.map(action => (
          <Fragment key={action.label}>
            <FilterSelect
              label={action.label}
              list={action.options}
              handleSelected={action.handleSelected}
            />
          </Fragment>
        ))}

        {isFilter && (
          <CustomButton
            title={t(translations.common.search)}
            buttonMode={'filter'}
            sxProps={{
              background: theme.palette.common.white,
              color: palette.primary.button,
              border: `1px solid ${palette.primary.button}`,
              borderRadius: '8px',
              mr: '80px',
              width: '134px',
              ':hover': {
                background: theme.palette.common.white,
              },
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
            }}
            handleClick={handleFilter}
          />
        )}
        <img src={FILLTER_ICON} style={{ height: 30, cursor: 'pointer' }} />
      </Box>
    </Box>
  );
}
