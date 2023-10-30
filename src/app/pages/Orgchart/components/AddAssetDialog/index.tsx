import React, { useMemo } from 'react';
import { Box, Dialog, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { translations } from 'locales/translations';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { TableHeaderProps } from 'types';

import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { selectOrgchart } from '../../slice/selector';
import { TableFieldKey, TableFieldValueTuple } from '../../slice/types';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  setPropertiesData: (data: TableFieldValueTuple[]) => void;
  propertiesData: TableFieldValueTuple[];
}

export default function AddAssetDialog(props: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isOpen, handleClose, setPropertiesData, propertiesData } = props;
  const { assetSector } = useSelector(selectOrgchart);
  const { t } = useTranslation();
  const { actions: snackbarActions } = useSnackbarSlice();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
  });

  const onSubmit = (data: TableFieldValueTuple) => {
    setPropertiesData([...propertiesData, data]);
    dispatch(
      snackbarActions.updateSnackbar({
        message: 'Thêm thành công',
        type: 'success',
      }),
    );
    handleClose();
  };

  const fieldForPopup: TableHeaderProps[] = useMemo(() => {
    if (assetSector) {
      const arrayFields = assetSector.groups?.[0]?.fields?.[0]?.tableFieldKeys;
      const arrayFieldsSorted: TableFieldKey[] = arrayFields
        ?.slice()
        ?.sort(function (a, b) {
          return +a.id - +b.id;
        });
      const columns: TableHeaderProps[] = [];
      for (let i = 0; i < arrayFieldsSorted?.length; i++) {
        const col: TableHeaderProps = {
          id: arrayFieldsSorted[i].id,
          label: arrayFieldsSorted[i].key + '',
          width: 200,
          align: 'left',
        };
        columns.push(col);
      }
      return columns;
    } else {
      return [];
    }
  }, [assetSector]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        '&.MuiDialog-root': {
          backdropFilter: 'blur(0.5rem)',
        },
        '.MuiDialog-container > div': {
          maxWidth: '500px',
          width: '100%',
          // height: '188px',
          borderRadius: '0px',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ backgroundColor: theme.palette.primary.lighter }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              padding: '10px 24px',
            }}
          >
            Thêm chi tiết máy
          </Typography>
        </Box>
        <Stack px={3} mt={3} spacing={1}>
          {fieldForPopup?.map(tableFieldKey => (
            <Box sx={{ display: 'flex' }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '400',
                  minWidth: '150px',
                  paddingTop: '8.45px',
                }}
              >
                {tableFieldKey.label}
              </Typography>
              <TextFieldCustom
                placeholder="0"
                name={`nameField_${tableFieldKey.id}`}
                control={control}
                errors={errors}
                isRequired
                type={
                  tableFieldKey.label === 'Giá trị (VNĐ)' ? 'currency' : 'text'
                }
              />
            </Box>
          ))}
        </Stack>
        <Box
          mt={4.5}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 24px',
            marginBottom: '24px',
          }}
        >
          <CustomButton
            title={t(translations.common.cancel)}
            variant="outlined"
            handleClick={handleClose}
            sxProps={{
              border: `1px solid ${theme.palette.primary.lighter}`,
              '& p': {
                fontSize: '16px',
                fontWeight: '600',
                color: theme.palette.primary.light,
              },
            }}
          />
          <CustomButton
            title={t(translations.common.add)}
            variant="contained"
            isIcon
            buttonMode="create"
            typeButton={'submit'}
            sxProps={{
              marginLeft: '24px',
              '& p': {
                fontSize: '16px',
                fontWeight: '600',
              },
            }}
          />
        </Box>
      </form>
    </Dialog>
  );
}
