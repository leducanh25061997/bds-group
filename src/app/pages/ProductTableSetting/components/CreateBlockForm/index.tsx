import { Grid } from '@mui/material';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import React, { useCallback, useEffect } from 'react';
import {
  FieldArrayMethodProps,
  FieldArrayWithId,
  useForm,
} from 'react-hook-form';

import CREATE_ICON from 'assets/background/colored-create-icon.svg';

import palette from 'styles/theme/palette';

import { BlockFields } from '../../slice/types';

interface CreateBlockFormProps {
  fields: FieldArrayWithId<
    {
      data: BlockFields[];
    },
    'data',
    'id'
  >[];
  append: (
    value: Partial<BlockFields> | Partial<BlockFields>[],
    options?: FieldArrayMethodProps,
  ) => void;
  isDisable?: boolean;
}

interface CreateBlockFields {
  name: string;
  numberOfFloors: number | string;
  productsPerFloors: number | string;
}

const CreateBlockForm: React.FC<CreateBlockFormProps> = ({
  append,
  fields,
  isDisable,
}) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateBlockFields>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      numberOfFloors: '',
      productsPerFloors: '',
    },
  });

  // Reset form after submit
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const generateOutput = useCallback((input: number) => {
    let output = '';

    for (let i = 1; i <= input; i++) {
      const number = i.toString().padStart(3, '0');
      output += number + ', ';
    }

    // Remove the trailing comma and space
    output = output.slice(0, -2);

    return output;
  }, []);

  const checkBlockNameExisted = (value: string) => {
    return (
      fields.every(field => field.block.trim() !== value.trim()) ||
      'Tên block đã tồn tại'
    );
  };

  const handleSubmitBlock = (data: CreateBlockFields) => {
    clearErrors();

    if (+data.numberOfFloors <= 0) {
      setError('numberOfFloors', {
        type: 'custom',
        message: 'Số tầng phải lớn hơn 0',
      });
    }
    if (+data.productsPerFloors <= 0) {
      setError('productsPerFloors', {
        type: 'custom',
        message: 'Số sản phẩm phải lớn hơn 0',
      });
    }

    if (+data.numberOfFloors <= 0 || +data.productsPerFloors <= 0) {
      return;
    }

    append({
      block: data.name.trim(),
      dataFloor: generateOutput(+data.numberOfFloors),
      dataQuanlityProduct: generateOutput(+data.productsPerFloors),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitBlock)}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextFieldCustom
            name="name"
            label="Tên block"
            placeholder="Nhập tên block"
            isRequired
            disabled={isDisable}
            control={control}
            errors={errors}
            rules={{
              validate: {
                isBlockNameValid: checkBlockNameExisted,
                isNotEmpty: (v: string) =>
                  v.trim().length > 0 || 'Tên block không được để trống',
              },
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextFieldCustom
            name="numberOfFloors"
            label="Số tầng"
            placeholder="Nhập số tầng"
            endAdornment={'Tầng'}
            format="number"
            max={200}
            isRequired
            disabled={isDisable}
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs>
          <TextFieldCustom
            name="productsPerFloors"
            label="Số SP/Tầng"
            placeholder="Nhập số sản phẩm/tầng"
            endAdornment={'Sản phẩm'}
            format="number"
            max={200}
            isRequired
            disabled={isDisable}
            control={control}
            errors={errors}
            setError={setError}
          />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton
            typeButton="submit"
            title="Thêm block"
            isIcon
            isDisable={isDisable}
            variant="outlined"
            buttonMode="create"
            iconNode={<img src={CREATE_ICON} alt="Plus Icon" />}
            sxProps={{
              // background: palette.common.white,
              color: palette.primary.button,
              // border: '1px solid',
              // borderColor: palette.primary.button,
              borderRadius: '8px',
              mt: 1,
              width: '100%',
              flexShrink: '0',
            }}
            sxPropsText={{
              fontWeight: 400,
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateBlockForm;
