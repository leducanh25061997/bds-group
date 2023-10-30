import React, { useEffect, useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  DialogActions,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from 'app/components/Button';
import { useFormContext } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { SaleControlEnum } from '../../slice/types';
import { ActionsDialog } from '../ActionsDialog';
import { useSaleEventControlSlice } from '../../slice';
import { selectSaleEventControl } from '../../slice/selector';

interface SaleUnitsPickerProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: any) => void;
}

const SaleUnitsPicker: React.FC<SaleUnitsPickerProps> = ({
  open,
  onClose,
  onSend,
}) => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { actions } = useSaleEventControlSlice();
  const { currentOrgChart } = useSelector(selectSaleEventControl);

  const selectedUnits = useMemo(() => {
    return currentOrgChart && currentOrgChart.length > 0
      ? currentOrgChart.filter(item => selectedUnitIds.includes(item.id))
      : [];
  }, [currentOrgChart, selectedUnitIds]);

  // console.log(selectedUnits);

  useEffect(() => {
    if (id) {
      dispatch(actions.getOrgChart({ id }));
    }
  }, [id]);

  const handleClose = () => {
    setSelectedUnitIds([]);
    onClose?.();
  };

  const handleSend = () => {
    const formData = getValues();
    onSend(formData);
  };

  const handleRemoveUnit = (id: string) => {
    const _values = [...selectedUnitIds];
    const _arr = _values.filter(item => item !== id && item !== 'all');
    setSelectedUnitIds(_arr);
    // setValue('salesUnitIds', _arr);
    setValue('orgChartId', _arr.toString().replace(/\s/g, ''));
  };

  const handlerBlurPicker = (value?: string) => {
    if (value) setSelectedUnitIds(value.split(','));
    else setSelectedUnitIds([]);
  };

  // const handleBlurProjectLeader = (value?: string) => {
  //   if (value) {
  //     const values = value.split(',');
  //     const leaders = employees.filter(function (item) {
  //       return values.includes(item.id);
  //     });
  //     setProjectLeader(leaders);
  //   }
  // };
  // console.log(selectedUnitIds, 'selectedUnits');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={'sm'}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
        },
      }}
      // scroll="paper"
    >
      <DialogTitle
        sx={{
          m: 0,
          pt: 4,
          pb: 2,
          px: 3.5,
          textAlign: 'center',
          color: '#1E1E1E',
        }}
        variant="h4"
      >
        Gửi thông báo
        {!!onClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent
        sx={{
          overflow: 'unset',
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            padding: '0 48px',
          }}
        >
          Vui lòng chọn đơn vị bán hàng/sàn giao dịch nhận thông báo này trước
          khi gửi đi
        </Typography>
        <ControlledAutocomplete
          name="orgChartId"
          label="Đơn vị nhận thông báo"
          placeholder="Chọn đơn vị nhận thông báo"
          control={control}
          handleBlur={handlerBlurPicker}
          options={currentOrgChart || []}
          hasSelectAll
        />

        <Grid
          container
          spacing={2}
          sx={{
            mt: -0.5,
          }}
        >
          {selectedUnits.length > 0 &&
            selectedUnits.map((unit: any) => (
              <Grid
                item
                key={unit.id}
                xs={6}
                // md={2.4}
                // mt={1}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: 'primary.lightRed',
                    borderRadius: '9px',
                    padding: '6px 0 6px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {unit.name}
                  </Typography>

                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveUnit(unit.id)}
                    disableRipple
                    sx={{
                      color: 'primary.darkRed',
                      p: '6px 12px',
                      borderRadius: 0,
                      borderLeft: '1px solid white',
                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Button
            title="Huỷ"
            variant="outlined"
            handleClick={handleClose}
            sxProps={{
              borderRadius: '8px',
              minWidth: { md: '128px' },
            }}
            sxPropsText={{
              fontWeight: 400,
            }}
          />
          <Button
            title="Gửi"
            // variant="outlined"
            handleClick={() => handleSend()}
            sxProps={{
              borderRadius: '8px',
              minWidth: { md: '128px' },
            }}
          />
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default SaleUnitsPicker;
