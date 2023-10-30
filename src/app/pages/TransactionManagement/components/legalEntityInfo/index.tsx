import { Box, Grid, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TYPEIdentification } from 'types/Enum';
import { Province } from 'types/User';
import { default as documentService } from 'services/api/document';

interface LegalEntityInfoProps {
  fullWidth?: boolean;
  fieldNameObject: fieldNameLegalEntity;
  formControl: UseFormReturn;
  isRequired: boolean
}
interface fieldNameLegalEntity {
  identifierType: string;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
}
export function LegalEntityInfo(props: LegalEntityInfoProps) {
  const { fullWidth, fieldNameObject, formControl, isRequired } = props;
  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = formControl;
  const [listProvince, setListProvince] = useState<Province[]>([]);
  const typeIdentificationOptions = useMemo(
    () => [
      {
        id: 0,
        value: TYPEIdentification.CITIZEN_IDENTIFICATION,
        key: 'Căn cước công dân',
      },
      {
        id: 1,
        value: TYPEIdentification.IDENTITY_CARD,
        key: 'Chứng minh nhân dân',
      },
      { id: 2, value: TYPEIdentification.PASSPORT, key: 'Hộ chiếu/ Passport' },
    ],
    [],
  );
  const _widthScr = useMemo(() => (!!fullWidth ? 12 : 10), [fullWidth]);

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
    setListProvince([
      ...[
        {
          id: newData.length,
          key: 'Cục quản lý trật tự xã hội',
          value: 'Cục quản lý trật tự xã hội',
        },
      ],
      ...newData,
    ]);
  };

  useEffect(() => {
    getProvinces();
  }, []);

  return (
    <Fragment>
      <Grid container mt={2}>
        <Typography fontWeight={700} fontSize={'14px'} color={'#1E1E1E'}>
          {'Thông tin pháp nhân'}
        </Typography>
        <Grid container>
          <Box
            sx={{
              '& .MuiFormControl-root .MuiFormGroup-root .MuiFormControlLabel-root':
                {
                  mr: '80px',
                },
            }}
          >
            <TextFieldCustom
              name={fieldNameObject.identifierType}
              control={control}
              type="radio"
              options={typeIdentificationOptions}
              errors={errors}
              setError={setError}
            />
          </Box>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder={
                watch(`${fieldNameObject.identifierType}`) ===
                TYPEIdentification.PASSPORT
                  ? 'Nhập số hộ chiếu/ Passport'
                  : 'Nhập số CMND/CCCD'
              }
              label={
                watch(`${fieldNameObject.identifierType}`) ===
                TYPEIdentification.PASSPORT
                  ? 'Hộ chiếu/ Passport'
                  : 'Số CMND/CCCD'
              }
              name={fieldNameObject.identityNumber}
              type="text"
              isRequired={isRequired}
              control={control}
              errors={errors}
              setError={setError}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn ngày cấp"
              label="Ngày cấp"
              type="date"
              isRequired={isRequired}
              isHiddenFeatureDay
              name={fieldNameObject.dateRange}
              control={control}
              errors={errors}
              setError={setError}
              sxProps={{ marginTop: 0 }}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextFieldCustom
              placeholder="Chọn nơi cấp"
              label="Nơi cấp"
              type="select"
              isRequired={isRequired}
              name={fieldNameObject.issuedBy}
              // options={[{ id: 0, value: 0, key: 'Cục quản lý trật tự xã hội' }]}
              handleDeleted={() => {
                setValue(fieldNameObject.issuedBy, '');
              }}
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
