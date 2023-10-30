import { Fragment, useRef, useState } from 'react';

import { Box, Grid, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import FilterDate from 'app/components/FilterDate';
import FILLTER_ICON from 'assets/background/filter-icon.svg';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';

import { Dayjs } from 'dayjs';

import palette from 'styles/theme/palette';

import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { BoxSearch } from './FilterbarStyled';
import FilterSelect from '../FilterSelect';

interface Props {
  onChangeSearchInput?: (keyword: string) => void;
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
  isHide?: boolean;
}

interface OptionType {
  label: string;
  value: string;
}

export default function FilterBar(props: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isFilter, onChangeSearchInput, filterList, submitFilter } = props;
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
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
      if(onChangeSearchInput){
        onChangeSearchInput(e.target.value.replaceAll('+', '%2B'));
      }
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
        alignItems: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        color: theme.palette.secondary.contrastText,
        bgcolor: palette.primary.barList,
        borderRadius: '8px',
        p: '20px 20px 8px 20px',
        mb: '15px'
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          <BoxSearch
            className="input"
            sx={{
              bgcolor: palette.common.white,
              '& input::placeholder': {
                color: '#AFAFAF',
              },
              border: `1px solid #D3D3D3`,
              borderRadius: '8px',
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
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {filterList?.map(
              action =>
                !action.isHide && (
                  <Fragment key={action.label}>
                    {action.type !== 'date' && (
                      <FilterSelect
                        label={action.label}
                        list={action.options}
                        handleSelected={action.handleSelected}
                      />
                    )}
                  </Fragment>
                ),
            )}
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {filterList?.map(action => (
              <Fragment key={action.label}>
                {action.type === 'date' && (
                  <>
                    {action?.placeholder === 'Đến ngày' && (
                      <Box sx={{ mx: 0.5 }}>~</Box>
                    )}
                    <FilterDate
                      onChange={action.onChange}
                      placeholder={action?.placeholder}
                      sx={{ width: '213px' }}
                    />
                  </>
                )}
              </Fragment>
            ))}
          </Box>
        </Grid>
        <Grid item>
          {isFilter && (
            <CustomButton
              title={t(translations.common.search)}
              buttonMode={'filter'}
              sxProps={{
                background: theme.palette.common.white,
                color: palette.primary.button,
                border: `1px solid ${palette.primary.button}`,
                borderRadius: '8px',
                ':hover': {
                  background: theme.palette.common.white,
                },
              }}
              sxPropsText={{
                fontSize: '16px',
                fontWeight: 400,
              }}
              handleClick={handleFilter}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
