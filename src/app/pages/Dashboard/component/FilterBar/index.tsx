import { Box, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import FilterSelect from 'app/components/FilterSelect';
import { FilterListActions } from 'app/pages/Leads/slice/types';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { translations } from 'locales/translations';
import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
interface FilterProps {
  isTitle?: boolean;
  isNoTitle?: boolean;
  submitFilter?: () => void;
  filterList: FilterListActions[];
  handleCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked?: boolean;
}
const FilterBar: FC<FilterProps> = ({
  isTitle,
  filterList,
  submitFilter,
  isChecked,
  handleCheck,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
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
        marginBottom: '10px',
        height: {
          xs: '140px',
          sm: '96px',
          md: '48px',
        },
      }}
    >
      {isTitle && (
        <FormGroup>
          <FormControlLabel
            sx={{
              '& .MuiFormControlLabel-label': {
                color: theme.palette.primary.light,
                fontWeight: '600',
                fontSize: '14px',
                lineHeight: '17px',
              },
            }}
            control={<Checkbox checked={isChecked} onChange={handleCheck} />}
            label={t(translations.dashboard.deadline)}
          />
        </FormGroup>
      )}
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
        <CustomButton
          title={t(translations.common.filter)}
          isIcon
          buttonMode={'filter'}
          sxProps={{
            background: theme.palette.primary.lighter,
          }}
          handleClick={handleFilter}
        />
      </Box>
    </Box>
  );
};

export default FilterBar;
