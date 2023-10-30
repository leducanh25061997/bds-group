import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';

import palette from 'styles/theme/palette';
import { useForm, FormProvider } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useDispatch, useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import { PayloadSendNoti } from 'app/pages/SalesProgram/slice/types';
import { omit } from 'lodash';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { snackbarActions } from 'app/components/Snackbar/slice';
import SalesProgram from 'services/api/salesProgram';

import { selectSaleEventControl } from '../../slice/selector';
import SaleUnitsPicker from '../SaleUnitsPicker';
import { useSaleEventControlSlice } from '../../slice';

interface FormFields {
  to: string;
  message: string;
  orgChartId?: string;
}

const SendNotification = () => {
  const { eventSale } = useSelector(selectSaleEventControl);
  const [saleUnitsPickerOpen, setSaleUnitsPickerOpen] =
    useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSaleEventControlSlice();

  const form = useForm<FormFields>({
    defaultValues: {
      to: 'all',
      message: '',
      orgChartId: '',
    },
    shouldUnregister: true,
  });

  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    watch,
    unregister,
    reset,
    setValue,
  } = form;

  const sendTo = watch('to');

  useEffect(() => {
    if (sendTo === 'all') {
      unregister('orgChartId');
    }
  }, [unregister, sendTo]);

  const handleSubmitNotification = (data: FormFields) => {
    if (data.to === 'units') {
      setSaleUnitsPickerOpen(true);
      return;
    }
    handleSendNotification(data);
  };

  const handleSendClick = (data: FormFields) => {
    const orgChartId = data.orgChartId
      ?.split(',')
      .filter(item => item.trim().toLowerCase() !== 'all')
      .join(',');
    handleSendNotification({ ...data, orgChartId });
  };

  const handleSendNotification = async (data: FormFields) => {
    if (!id) return;
    try {
      const payload: PayloadSendNoti = {
        settingSalesProgramId: id,
        ...omit(data, 'to'),
      };

      const res = await SalesProgram.sendNoti(payload);

      if (!res.error) {
        reset();
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Gửi thông báo thành công',
            type: 'success',
          }),
        );
        dispatch(actions.getNotification({ id }));
      }

      if (saleUnitsPickerOpen) {
        setSaleUnitsPickerOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          snackbarActions.updateSnackbar({
            message: error.response?.data.message,
            type: 'error',
          }),
        );
      }
    }
  };

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [isSubmitSuccessful, reset]);

  return (
    <FormProvider {...form}>
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2.5,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: 'primary.darkRed',
            }}
          >
            {eventSale?.salesProgram.name}
          </Typography>
          <Typography
            fontWeight={700}
            sx={{
              mt: 2.5,
            }}
          >
            Thông báo sự kiện
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 2.5,
            }}
          >
            Gửi thông báo sự kiện đến
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(handleSubmitNotification)}
            sx={{
              mt: 2.5,
            }}
          >
            <TextFieldCustom
              name="to"
              type="radio"
              control={control}
              errors={errors}
              options={[
                {
                  value: 'all',
                  id: 'all',
                  key: 'Tất cả',
                  isDefault: true,
                },
                {
                  value: 'units',
                  id: 'units',
                  key: 'Đơn vị bán hàng/ Sàn giao dịch',
                  isDefault: false,
                },
                // {
                //   value: 'client',
                //   id: 'client',
                //   key: 'Khách hàng',
                //   isDefault: false,
                // },
              ]}
              sxProps={{
                '& .MuiFormGroup-root label + label': {
                  ml: { xs: 2, lg: 8 },
                },
              }}
            />
            <Grid container spacing={2.5}>
              <Grid item xs>
                <TextFieldCustom
                  name="message"
                  isRequired
                  placeholder="Nhập nội dung thông báo cần gửi"
                  control={control}
                  errors={errors}
                  sxProps={{
                    '&.MuiFormControl-root': {
                      my: 0,
                    },
                  }}
                />
              </Grid>
              <Grid item xs="auto">
                <Button
                  variant="outlined"
                  type="submit"
                  startIcon={<SendNotiIcon />}
                  sx={{
                    px: '14px',
                    py: '9px',
                    color: 'primary.darkRed',
                    border: '1px solid',
                    borderColor: 'primary.darkRed',

                    '&:hover': {
                      borderColor: 'primary.darkRed',
                      backgroundColor: 'rgb(214, 70, 95, 0.08)',
                    },
                  }}
                >
                  Gửi thông báo
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      {sendTo === 'units' && (
        <SaleUnitsPicker
          open={saleUnitsPickerOpen}
          onClose={() => {
            setSaleUnitsPickerOpen(false);
            setValue('orgChartId', '');
          }}
          onSend={handleSendClick}
        />
      )}
    </FormProvider>
  );
};

const SendNotiIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      {...props}
    >
      <path
        d="M7.48072 13.8932L5.47939 12.9374L3.78965 17.11C3.78439 17.1231 3.77931 17.1365 3.77491 17.1498C3.56031 17.7936 3.60802 18.3787 3.9095 18.7967C4.17082 19.1594 4.5909 19.3593 5.09242 19.3593H5.0926C5.33002 19.3593 5.58518 19.3143 5.8509 19.2258C5.86438 19.2214 5.87772 19.2165 5.89071 19.2112L10.0633 17.5215L9.10761 15.5199C8.85196 14.9849 8.0158 14.1487 7.48072 13.8932ZM22.9433 1.01023L9.8046 14.1489C10.0227 14.4175 10.2044 14.6895 10.3237 14.9391L13.6587 21.9225C14.1068 22.8607 14.6974 23.0007 15.0094 23.0007H15.0096C15.2884 23.0007 15.9772 22.8794 16.3519 21.7557L22.8672 2.20932C23.0132 1.77096 23.0375 1.35996 22.9433 1.01023H22.9433ZM8.85164 13.196L21.9909 0.0566931C21.8532 0.019317 21.7054 0 21.5498 0C21.312 0 21.0568 0.0449232 20.7912 0.133557L1.24501 6.64877C0.210881 6.99365 0.0224283 7.59558 0.00207804 7.92356C-0.0182722 8.25173 0.0945301 8.8722 1.07812 9.34179L8.06158 12.677C8.3109 12.7963 8.58296 12.978 8.8516 13.1961L8.85164 13.196Z"
        fill="#D45B7A"
      />
    </SvgIcon>
  );
};

export default React.memo(SendNotification);
