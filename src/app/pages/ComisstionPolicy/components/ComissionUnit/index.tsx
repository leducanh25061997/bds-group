import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import ADD_ICON from 'assets/background/add-icon.svg';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';
import { Beneficiary } from 'types/Comisstion';
import { OptionAutocomplete, OptionCustom } from 'types/Option';

import { useState } from 'react';

import ComissionUnitDialog from '../ComissionUnitDialog';

interface Props {
  handleCloseDialog: () => void;
  handleSubmitDialog: () => void;
  handleSelectedUnits: (id: string | number | string[]) => void;
  hanldeAddBeneficiary: () => void;
  hanldeRemoveBeneficiary: (index: number) => void;
  isOpenDialog: boolean;
  listOrgChart: any;
  comissitonStaff: number;
  listStaff: OptionAutocomplete[];
  listBeneficiary: Beneficiary[];
  control: any;
  errors: any;
  setError: any;
  watch: any;
  isIndirect?: boolean;
  isEditUnit: boolean;
}

export default function ComissionUnit(props: Props) {
  const {
    handleCloseDialog,
    isOpenDialog,
    comissitonStaff,
    handleSubmitDialog,
    hanldeAddBeneficiary,
    hanldeRemoveBeneficiary,
    listOrgChart,
    listStaff,
    handleSelectedUnits,
    listBeneficiary,
    control,
    errors,
    setError,
    watch,
    isIndirect,
    isEditUnit,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ComissionUnitDialog
      isOpen={isOpenDialog}
      handleClose={handleCloseDialog}
      handleSubmit={handleSubmitDialog}
      actionName={t(translations.common.unlock)}
    >
      <Typography
        fontSize={'24px'}
        fontWeight={700}
        color={theme.palette.primary.light}
      >
        {isEditUnit ? 'Chỉnh sửa ' : 'Thêm '}
        {isIndirect ? 'đơn vị gián tiếp' : 'đơn vị bán hàng'}
      </Typography>
      <Box mt={4}>
        <TextFieldCustom
          placeholder={
            isIndirect ? 'Chọn đơn vị gián tiếp' : 'Chọn đơn vị bán hàng'
          }
          label={isIndirect ? 'Đơn vị gián tiếp' : 'Đơn vị bán hàng'}
          type="select"
          options={listOrgChart}
          name="saleUnits"
          control={control}
          errors={errors}
          onChange={handleSelectedUnits}
          setError={setError}
          sxProps={{ width: { md: '507px' } }}
        />
      </Box>
      <Box
        mt={1}
        sx={{
          border: '1px solid #E0E1E4',
          borderRadius: '8px',
          minHeight: '87px',
          width: { md: '507px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: '10px 45px 10px 20px',
            background: '#FDEAF4',
          }}
        >
          <Typography
            fontSize={'14px'}
            fontWeight={500}
            color={theme.palette.common.black}
          >
            Chức danh
          </Typography>
          <Typography
            fontSize={'14px'}
            fontWeight={500}
            color={theme.palette.common.black}
          >
            Hoa hồng
          </Typography>
        </Box>
        <Box p={'5px 19px 12px 19px'}>
          {!isIndirect && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginRight: '28px',
                m: '15px 45px 15px 0px',
              }}
            >
              <Typography fontSize={'14px'} color={theme.palette.common.black}>
                Nhân viên kinh doanh
              </Typography>
              <Typography
                fontSize={'16px'}
                fontWeight={500}
                color={theme.palette.common.black}
              >
                {watch('commissionStaff')}%
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginRight: '28px',
              m: '15px 45px 15px 0px',
            }}
          >
            <Typography fontSize={'14px'} color={theme.palette.common.black}>
              {isIndirect
                ? 'Tổng hoa hồng người đại diện'
                : 'Tổng hoa hồng người thụ hưởng'}
            </Typography>
            <Typography
              fontSize={'16px'}
              fontWeight={500}
              color={palette.primary.button}
            >
              {comissitonStaff}%
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mt: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <TextFieldCustom
                placeholder={
                  isIndirect ? 'Chọn người đại diện' : 'Chọn người thụ hưởng'
                }
                label={isIndirect ? 'Người đại diện' : 'Người thụ hưởng'}
                type="selectcustom"
                optionAutoComplete={listStaff}
                name="beneficiaryPerson"
                control={control}
                errors={errors}
                setError={setError}
                sxProps={{ width: { md: '240px' }, height: '40px' }}
              />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ mr: '12px' }}>
                <TextFieldCustom
                  placeholder="---"
                  name="beneficiaryPercent"
                  max={100}
                  control={control}
                  endAdornment={'%'}
                  errors={errors}
                  setError={setError}
                  sxProps={{
                    '& .MuiInputBase-root': {
                      width: { md: '110px' },
                      borderRadius: '8px',
                      background: theme.palette.common.white,
                      color: theme.palette.common.black,
                      height: '40px',
                      fontSize: '14px',
                      border: `1px solid #D3D3D3`,
                      '& input': {
                        padding: '9px 0px 9px 9px',
                      },
                    },
                  }}
                />
              </Box>
              <IconButton sx={{ p: 0 }} onClick={hanldeAddBeneficiary}>
                <img src={ADD_ICON} />
              </IconButton>
            </Box>
          </Box>
          <Box>
            {listBeneficiary?.map((item, index) => (
              <Box display={'flex'}>
                <Box
                  sx={{
                    background: '#FEF4FA',
                    borderRadius: '8px',
                    mb: '4px',
                    p: '2px 13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: { md: '438px' },
                    mr: '12px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: '28px', height: '28px' }}
                      src={item.avatar}
                    />
                    <Box ml={'5px'}>
                      <Typography
                        fontWeight={700}
                        fontSize={'14px'}
                        color={theme.palette.common.black}
                      >
                        {item.name}
                      </Typography>
                      <Typography fontSize={'10px'} color={'#7A7A7A'}>
                        {item.position}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontSize={'14px'} color={'#D6465F'}>
                      {item.persent * 100}%
                    </Typography>
                    <Typography
                      fontSize={'14px'}
                      m={'5px'}
                      color={theme.palette.common.black}
                    >
                      x
                    </Typography>
                    <Typography
                      fontSize={'14px'}
                      color={theme.palette.common.black}
                    >
                      {watch('commissionBenefit')}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => hanldeRemoveBeneficiary(index)}
                >
                  <img src={CLOSE_ICON} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </ComissionUnitDialog>
  );
}
