import { Grid, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectCustomerType, Province } from 'types/User';
import { default as documentService } from 'services/api/document';
import { CustomerInReservation } from 'types/Transaction';
import { useSelector } from 'react-redux';

import { selectTransactionManagement } from '../../slice/selector';

interface BusinessInfoProps {
  fullWidth?: boolean;
  formControl: UseFormReturn;
}
export function BusinessInfo(props: BusinessInfoProps) {
  const { formControl } = props;
  const { bookingDetail } = useSelector(selectTransactionManagement);
  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = formControl;

  const [listProvince, setListProvince] = useState<Province[]>([]);
  const isRequired = useMemo(
    () =>
      watch('typeMainCustomer', ProjectCustomerType.PERSONAL) ===
      ProjectCustomerType.BUSINESS,
    [watch],
  );

  const getProvinces = async () => {
    const data = await documentService.getProvince({
      key: 'province',
      province: '0',
      district: '0',
    });
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListProvince(newData);
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (bookingDetail) {
      const mainCustomerObject = bookingDetail?.customers?.filter(
        (customer: CustomerInReservation) => customer?.mainCustomer != null,
      );
      setValue(
        'companyName',
        mainCustomerObject?.[0]?.mainCustomer?.companyName,
      );
      setValue(
        'companyCode',
        mainCustomerObject?.[0]?.mainCustomer?.companyCode,
      );
      setValue(
        'companyDateRange',
        mainCustomerObject?.[0]?.mainCustomer?.companyDateRange,
      );
      if (listProvince?.length) {
        setValue(
          'companyIssuedBy',
          mainCustomerObject?.[0]?.mainCustomer?.companyIssuedBy,
        );
      }
      setValue('position', mainCustomerObject?.[0]?.mainCustomer?.position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDetail, listProvince]);

  return (
    <Fragment>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Thông tin doanh nghiệp'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <TextFieldCustom
              placeholder="Nhập tên công ty"
              label="Tên công ty"
              name="companyName"
              type="text"
              isRequired={isRequired}
              control={control}
              errors={errors}
              setError={setError}
            />
          </Grid>
          <Grid item md={4}>
            <TextFieldCustom
              placeholder="Nhập mã số doanh nghiệp"
              label="Mã số doanh nghiệp"
              name="companyCode"
              type="text"
              isRequired={isRequired}
              control={control}
              errors={errors}
              setError={setError}
            />
          </Grid>
          <Grid item md={4}>
            <TextFieldCustom
              placeholder="Chọn ngày cấp"
              label="Ngày cấp"
              type="date"
              isRequired={isRequired}
              name="companyDateRange"
              control={control}
              errors={errors}
              setError={setError}
              sxProps={{ marginTop: 0 }}
            />
          </Grid>
          <Grid item md={4}>
            <TextFieldCustom
              placeholder="Chọn nơi cấp"
              label="Nơi cấp"
              type="select"
              isRequired={isRequired}
              name="companyIssuedBy"
              options={listProvince}
              control={control}
              errors={errors}
              setError={setError}
            />
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
