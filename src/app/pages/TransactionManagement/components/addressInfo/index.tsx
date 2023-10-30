import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FilterParams } from 'types';
import { default as documentService } from 'services/api/document';
import { ProjectCustomerType, Province } from 'types/User';

import palette from '../../../../../styles/theme/palette';

interface AddressInfoProps {
  fullWidth?: boolean;
  fieldNameObject: fieldNameAddress;
  formControl: UseFormReturn;
}
interface fieldNameAddress {
  province: string;
  district: string;
  ward: string;
  street: string;
  provinceBorn?: any;
  districtBorn?: any;
  wardBorn?: any;
  streetBorn?: any;
}

export function AddressInfo(props: AddressInfoProps) {
  const { fieldNameObject, formControl } = props;
  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
    clearErrors
  } = formControl;

  const isRequired = useMemo(
    () =>
      watch('typeMainCustomer', ProjectCustomerType.PERSONAL) ===
      ProjectCustomerType.PERSONAL,
    [watch],
  );
  const [provinceSelect, setProvinceSelect] = useState<string>('');
  const [listProvince, setListProvince] = useState<Province[]>([]);
  const [listDistrict, setListDistrict] = useState<Province[]>([]);
  const [listCommune, setListCommune] = useState<Province[]>([]);

  const [checked, setChecked] = useState<boolean>(true);
  const [provinceBornSelect, setProvinceBornSelect] = useState<string>('');
  const [listProvinceBorn, setListProvinceBorn] = useState<Province[]>([]);
  const [listDistrictBorn, setListDistrictBorn] = useState<Province[]>([]);
  const [listCommuneBorn, setListCommuneBorn] = useState<Province[]>([]);
  const [paramsFilter, setParamsFilter] = useState<FilterParams>({
    key: 'province',
    province: '0',
    district: '0',
  });

  const getProvinces = async () => {
    const data = await documentService.getProvince(paramsFilter);
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListProvince(newData);
    setListProvinceBorn(newData);
    setParamsFilter({
      key: 'province',
      province: '0',
      district: '0',
    });
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    initDistrictObject({
      ...paramsFilter,
      key: 'district',
      province: watch(`${fieldNameObject.province}`),
    });
  }, [watch(`${fieldNameObject.province}`)]);

  useEffect(() => {
    initWardObject({
      ...paramsFilter,
      key: 'commune',
      province: watch(`${fieldNameObject.province}`),
      district: watch(`${fieldNameObject.district}`),
    });
  }, [
    watch(`${fieldNameObject.province}`) &&
      watch(`${fieldNameObject.district}`),
  ]);
  useEffect(() => {
    initWardObject({
      ...paramsFilter,
      key: 'commune',
      province: watch(`${fieldNameObject.province}`),
      district: watch(`${fieldNameObject.district}`),
    });
  }, [
    watch(`${fieldNameObject.province}`) &&
      watch(`${fieldNameObject.district}`) &&
      watch(`${fieldNameObject.ward}`),
  ]);

  useEffect(() => {
    initDistrictBornObject({
      ...paramsFilter,
      key: 'district',
      province: watch(`${fieldNameObject.provinceBorn}`),
    });
  }, [watch(`${fieldNameObject.provinceBorn}`)]);

  useEffect(() => {
    initWardBornObject({
      ...paramsFilter,
      key: 'commune',
      province: watch(`${fieldNameObject.provinceBorn}`),
      district: watch(`${fieldNameObject.districtBorn}`),
    });
  }, [
    watch(`${fieldNameObject.provinceBorn}`) &&
      watch(`${fieldNameObject.districtBorn}`),
  ]);
  useEffect(() => {
    initWardBornObject({
      ...paramsFilter,
      key: 'commune',
      province: watch(`${fieldNameObject.provinceBorn}`),
      district: watch(`${fieldNameObject.districtBorn}`),
    });
  }, [
    watch(`${fieldNameObject.provinceBorn}`) &&
      watch(`${fieldNameObject.districtBorn}`) &&
      watch(`${fieldNameObject.wardBorn}`),
  ]);

  // useEffect(() => {
  //   if (watch(`${fieldNameObject.province}`)) {
  //     initDistrictObject({
  //       ...paramsFilter,
  //       key: 'district',
  //       province: watch(`${fieldNameObject.province}`),
  //     });
  //     if (watch(`${fieldNameObject.district}`)) {
  //       initWardObject({
  //         ...paramsFilter,
  //         key: 'commune',
  //         province: watch(`${fieldNameObject.province}`),
  //         district: watch(`${fieldNameObject.district}`),
  //       });
  //     }
  //   }
  // }, [fieldNameObject.district, fieldNameObject.province, paramsFilter, watch]);

  const initDistrictObject = async (params: FilterParams) => {
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListDistrict(newData);
    setListCommune([]);
  };

  const handleSelectedProvince = async (value: string | number | string[]) => {
    const params = {
      key: 'district',
      province: value as string,
      district: '0',
    };
    setProvinceSelect(value as string);
    initDistrictObject(params);
    setParamsFilter(params);
  };
  const handleDeleteProvince = () => {
    setValue(fieldNameObject.province, '');
    setValue(fieldNameObject.district, '');
    setValue(fieldNameObject.ward, '');
    setListDistrict([]);
    setListCommune([]);
  };

  const initWardObject = async (params: FilterParams) => {
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListCommune(newData);
  };

  const handleSelectedDistrict = async (value: string | number | string[]) => {
    const params = {
      key: 'commune',
      district: value as string,
      province: provinceSelect,
    };
    initWardObject(params);
    setParamsFilter(params);
  };
  const handleDeleteDistrict = () => {
    setValue(fieldNameObject.district, '');
    setValue(fieldNameObject.ward, '');
    setListCommune([]);
  };

  const handleSelectedProvinceBorn = async (
    value: string | number | string[],
  ) => {
    const params = {
      key: 'district',
      province: value as string,
      district: '0',
    };
    setProvinceBornSelect(value as string);
    initDistrictBornObject(params);
    setParamsFilter(params);
  };
  const initDistrictBornObject = async (params: FilterParams) => {
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListDistrictBorn(newData);
    setListCommuneBorn([]);
  };
  const handleDeleteProvinceBorn = () => {
    setValue(fieldNameObject?.provinceBorn, '');
    setValue(fieldNameObject?.districtBorn, '');
    setValue(fieldNameObject?.wardBorn, '');
    /* setListDistrictBorn([]);
    setListCommuneBorn([]);*/
  };

  const handleSelectedDistrictBorn = async (
    value: string | number | string[],
  ) => {
    const params = {
      key: 'commune',
      district: value as string,
      province: provinceBornSelect,
    };
    initWardBornObject(params);
    setParamsFilter(params);
  };
  const handleDeleteDistrictBorn = () => {
    setValue(fieldNameObject.districtBorn, '');
    setValue(fieldNameObject.wardBorn, '');
    setListCommuneBorn([]);
  };

  const initWardBornObject = async (params: FilterParams) => {
    const data = await documentService.getProvince(params);
    const newData: Province[] = [];
    data.forEach((item, index) => {
      newData.push({
        id: index,
        key: item,
        value: item,
      });
    });
    setListCommuneBorn(newData);
  };

  const handleSetAddressBorn = async (checked: boolean) => {
    if (checked) {
      const params = {
        key: 'district',
        province: watch(fieldNameObject.province),
        district: '0',
      };
      initDistrictBornObject(params);
      const param_for_ward = {
        key: 'commune',
        district: watch(fieldNameObject.district),
        province: watch(fieldNameObject.province),
      };
      initWardBornObject(param_for_ward);
      setValue(fieldNameObject.provinceBorn, watch(fieldNameObject.province));
      setValue(fieldNameObject.districtBorn, watch(fieldNameObject.district));
      setValue(fieldNameObject.wardBorn, watch(fieldNameObject.ward));
      setValue(fieldNameObject.streetBorn, watch(fieldNameObject.street));
    }
  };

  return (
    <Fragment>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Địa chỉ liên hệ'}
        </Typography>
        <Grid container spacing={2} mt={0}>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Tỉnh/ Thành phố"
              label="Tỉnh/ Thành phố"
              name={fieldNameObject.province}
              type="select"
              isRequired={isRequired}
              options={listProvince}
              control={control}
              errors={errors}
              setError={setError}
              handleDeleted={handleDeleteProvince}
              onChange={handleSelectedProvince}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Quận/ Huyện"
              label="Quận/ Huyện"
              type="select"
              isRequired={isRequired}
              options={listDistrict}
              name={fieldNameObject.district}
              control={control}
              errors={errors}
              handleDeleted={handleDeleteDistrict}
              setError={setError}
              onChange={handleSelectedDistrict}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Phường/ Xã"
              label="Phường/ Xã"
              isRequired={isRequired}
              type="select"
              name={fieldNameObject.ward}
              options={listCommune}
              control={control}
              errors={errors}
              setError={setError}
              handleDeleted={() => {
                setValue(fieldNameObject.ward, '');
              }}
            />
          </Grid>
        </Grid>
        <Grid container mt={1}>
          <TextFieldCustom
            label="Đường, hẻm, tòa nhà..."
            placeholder="Nhập đường, hẻm, tòa nhà..."
            name={fieldNameObject.street}
            control={control}
            isRequired={isRequired}
            errors={errors}
            setError={setError}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Địa chỉ thường trú'}
        </Typography>
        <Grid container mt={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!checked}
                  onChange={() => {
                    if (checked) {
                      handleSetAddressBorn(checked);
                      clearErrors();
                    } else {
                      handleDeleteProvinceBorn();
                      setValue(fieldNameObject.streetBorn, '');
                    }
                    setChecked(!checked);
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                      color: palette.primary.button,
                    },
                  }}
                />
              }
              label={
                <Typography fontSize={'14px'} color={'black'}>
                  Chọn địa chỉ liên hệ làm địa chỉ thường trú
                </Typography>
              }
            />
          </FormGroup>
        </Grid>
        <Grid container spacing={2} mt={0}>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Tỉnh/ Thành phố"
              label="Tỉnh/ Thành phố"
              name={fieldNameObject.provinceBorn}
              type="select"
              isRequired={isRequired}
              options={listProvinceBorn}
              control={control}
              errors={errors}
              setError={setError}
              handleDeleted={handleDeleteProvinceBorn}
              onChange={handleSelectedProvinceBorn}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Quận/ Huyện"
              label="Quận/ Huyện"
              type="select"
              isRequired={isRequired}
              options={listDistrictBorn}
              name={fieldNameObject.districtBorn}
              control={control}
              errors={errors}
              handleDeleted={handleDeleteDistrictBorn}
              setError={setError}
              onChange={handleSelectedDistrictBorn}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn Phường/ Xã"
              label="Phường/ Xã"
              isRequired={isRequired}
              type="select"
              name={fieldNameObject.wardBorn}
              options={listCommuneBorn}
              control={control}
              errors={errors}
              setError={setError}
              handleDeleted={() => {
                setValue(fieldNameObject.wardBorn, '');
              }}
            />
          </Grid>
        </Grid>
        <Grid container mt={1}>
          <TextFieldCustom
            label="Đường, hẻm, tòa nhà..."
            placeholder="Nhập đường, hẻm, tòa nhà..."
            name={fieldNameObject.streetBorn}
            control={control}
            isRequired={isRequired}
            errors={errors}
            setError={setError}
            fullWidth
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
