import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { Fragment, useEffect, useState, useMemo } from 'react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import palette from 'styles/theme/palette';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CustomerItem, ProjectCustomerType } from 'types/User';
import { useCustomerSlice } from 'app/pages/CustomerPotential/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCustomer } from 'app/pages/CustomerPotential/slice/selector';
import { FilterParams } from 'types';
import { Gender, TYPEIdentification } from 'types/Enum';

import { LegalEntityInfo } from '../legalEntityInfo';
import { AddressInfo } from '../addressInfo';
import SelectSearch from '../select-search';

interface CoOwnerCustomerProps {
  formControl: UseFormReturn;
  isEdit: boolean;
}
export default function CoOwnerCustomer(props: CoOwnerCustomerProps) {
  const { formControl, isEdit } = props;
  const { actions: customerActions } = useCustomerSlice();
  const { customerManager } = useSelector(selectCustomer);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState<boolean>(false);
  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = formControl;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'listCoOwnerCustomer',
  });
  const genderOptions = useMemo(
    () => [
      { id: 0, value: Gender.MALE, key: 'Nam' },
      { id: 1, value: Gender.FEMALE, key: 'Nữ' },
    ],
    [],
  );

  useEffect(() => {
    if (isEdit) return;
    fields.length &&
      fields.forEach((item, index) => {
        setValue(
          `listCoOwnerCustomer.${index}.identifierType`,
          TYPEIdentification.CITIZEN_IDENTIFICATION,
        );
      });
  }, [isEdit, fields]);

  useEffect(() => {
    if (!fields?.length && checked) {
      setChecked(false);
    }
    if (watch()?.listCoOwnerCustomer?.length) {
      setChecked(true);
    }
  }, [checked, fields?.length]);

  const handleAddCoOwnerCustomer = () => {
    append({
      subCustomerId: '',
      code: '',
      name: '',
      gender: Gender.MALE,
      birth: '',
      email: '',
      phoneNumber: '',
      identifierType: '',
      identityNumber: '',
      dateRange: '',
      issuedBy: '',
      province: '',
      district: '',
      ward: '',
      street: '',
      type: ProjectCustomerType.PERSONAL,
      isMainCustomer: false,
    });
  };

  const handleSelectedCustomer = (
    customer: CustomerItem,
    indexArray?: number,
  ) => {
    if (customer) {
      const objectAppend = {
        subCustomerId: customer.id,
        code: customer.code,
        name: customer.name,
        gender: customer.gender,
        birth: customer.birth,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        identifierType: customer.typeIdentification,
        identityNumber: customer.identityNumber,
        dateRange: customer.dateRange,
        issuedBy: customer.issuedBy,
        province: customer.province,
        district: customer.district,
        ward: customer.ward,
        street: customer.street,
        type: ProjectCustomerType.PERSONAL,
        isMainCustomer: false,
      };
      setValue(`listCoOwnerCustomer.${indexArray}`, objectAppend);
    }
  };
  const handleDeletedCustomer = (index: number) => {
    setValue(`listCoOwnerCustomer.${index}.code`, '');
    setValue(`listCoOwnerCustomer.${index}.name`, '');
    setValue(`listCoOwnerCustomer.${index}.gender`, Gender.MALE);
    setValue(`listCoOwnerCustomer.${index}.birth`, '');
    setValue(`listCoOwnerCustomer.${index}.email`, '');
    setValue(`listCoOwnerCustomer.${index}.phoneNumber`, '');
    setValue(
      `listCoOwnerCustomer.${index}.identifierType`,
      TYPEIdentification.CITIZEN_IDENTIFICATION,
    );
    setValue(`listCoOwnerCustomer.${index}.identityNumber`, '');
    setValue(`listCoOwnerCustomer.${index}.dateRange`, '');
    setValue(`listCoOwnerCustomer.${index}.issuedBy`, '');
    setValue(`listCoOwnerCustomer.${index}.dateRange`, '');
    setValue(`listCoOwnerCustomer.${index}.province`, '');
    setValue(`listCoOwnerCustomer.${index}.district`, '');
    setValue(`listCoOwnerCustomer.${index}.ward`, '');
    setValue(`listCoOwnerCustomer.${index}.street`, '');
    setValue(`listCoOwnerCustomer.${index}.provinceBorn`, '');
    setValue(`listCoOwnerCustomer.${index}.districtBorn`, '');
    setValue(`listCoOwnerCustomer.${index}.streetBorn`, '');

    dispatch(customerActions.resetCustomerList());
    const params: FilterParams = {
      page: 1,
      limit: 50,
      fields: ['name', 'phoneNumber', 'code'],
      search: '',
    };
    dispatch(customerActions.fetchListCustomer(params));
  };
  const handleSearchingCustomer = (value: string, name?: string) => {
    const params: FilterParams = {
      page: 1,
      limit: 50,
      fields: ['name', 'phoneNumber', 'code'],
      search: value,
    };
    dispatch(customerActions.fetchListCustomer(params));
    if (name) {
      setValue(name, value);
    }
  };

  const renderElementCoOwnerCustomer = (index: number) => {
    return (
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={'16px'}
              color={palette.primary.darkRed}
            >
              {`Khách hàng đồng sở hữu`}
            </Typography>
            <Tooltip title="Xóa">
              <IconButton aria-label="delete" onClick={() => remove(index)}>
                <RemoveIcon sx={{ color: palette.primary.button }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4} md={4}>
          <SelectSearch
            placeholder="Nhập hoặc tìm mã khách hàng"
            label="Mã khách hàng (nếu có)"
            control={control}
            errors={errors}
            name={`listCoOwnerCustomer.${index}.code`}
            options={customerManager?.data?.filter(
              e => e?.id !== watch('mainCustomerId'),
            )}
            handleSelected={handleSelectedCustomer}
            onChange={handleSearchingCustomer}
            handleDeleted={() => handleDeletedCustomer(index)}
            indexArray={index}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <TextFieldCustom
            placeholder="Nhập tên khách hàng"
            label="Tên khách hàng"
            isRequired
            name={`listCoOwnerCustomer.${index}.name`}
            type="upper"
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs={4} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextFieldCustom
            name={`listCoOwnerCustomer.${index}.gender`}
            type="radio"
            options={genderOptions}
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <TextFieldCustom
            placeholder="Chọn ngày sinh"
            label="Ngày sinh"
            name={`listCoOwnerCustomer.${index}.birth`}
            isRequired
            type="date"
            control={control}
            errors={errors}
            setError={setError}
            sxProps={{ marginTop: 0 }}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <TextFieldCustom
            placeholder="Nhập địa chỉ Email"
            label="Địa chỉ Email"
            name={`listCoOwnerCustomer.${index}.email`}
            isRequired
            type="text"
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <TextFieldCustom
            placeholder="Nhập số điện thoại"
            label="Số điện thoại"
            name={`listCoOwnerCustomer.${index}.phoneNumber`}
            type="text"
            isRequired
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <LegalEntityInfo
            isRequired
            formControl={formControl}
            fullWidth
            fieldNameObject={{
              identifierType: `listCoOwnerCustomer.${index}.identifierType`,
              identityNumber: `listCoOwnerCustomer.${index}.identityNumber`,
              dateRange: `listCoOwnerCustomer.${index}.dateRange`,
              issuedBy: `listCoOwnerCustomer.${index}.issuedBy`,
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AddressInfo
            formControl={formControl}
            fullWidth
            fieldNameObject={{
              province: `listCoOwnerCustomer.${index}.province`,
              district: `listCoOwnerCustomer.${index}.district`,
              ward: `listCoOwnerCustomer.${index}.ward`,
              street: `listCoOwnerCustomer.${index}.street`,
              provinceBorn: `listCoOwnerCustomer.${index}.provinceBorn`,
              districtBorn: `listCoOwnerCustomer.${index}.districtBorn`,
              wardBorn: `listCoOwnerCustomer.${index}.wardBorn`,
              streetBorn: `listCoOwnerCustomer.${index}.streetBorn`,
            }}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Fragment>
      <Grid item xs={12} md={12} mt={2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={() => {
                  if (!checked) {
                    handleAddCoOwnerCustomer();
                  } else {
                    if (fields?.length) {
                      fields?.forEach((e, index) => {
                        remove(0);
                      });
                    }
                  }
                  // setChecked(!checked);
                }}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                    color: palette.primary.button,
                  },
                }}
              />
            }
            label="Khách hàng đồng sở hữu"
          />
        </FormGroup>
      </Grid>
      {checked && (
        <Grid
          container
          mt={2}
          sx={{
            backgroundColor: '#F4F5F6',
            borderRadius: '12px',
          }}
        >
          {fields.map((item, index) => {
            return (
              <Grid item md={12} key={item.id}>
                {renderElementCoOwnerCustomer(index)}
              </Grid>
            );
          })}
        </Grid>
      )}
    </Fragment>
  );
}
