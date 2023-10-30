import { Box, Dialog, Grid, TextField, Typography } from '@mui/material';
import { borderColor } from '@mui/system';
import CustomButton from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import TextFieldCustom from 'app/components/TextFieldCustom';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { WorkflowType } from 'types/Enum';
import { Option } from 'types/Option';

interface Props {
  isOpenDialog: boolean;
  setIsOpenDialog: (isOpenDialog: boolean) => void;
  title: string;
  description: string;
  actionName: string;
  handleSubmit: () => void;
  type?: string;
  nameDetail?: string;
  isDelete?: boolean;
  isCreate?: boolean;
  idProcess?: string;
}

const DATA_PROCESS_TYPES = [
  {
    id: 1,
    value: 'Quy trình giữ chỗ',
    name: 'Quy trình giữ chỗ',
    description: 'Quy trình giữ chỗ',
    isDefault: false,
    type: 'RESERVATION',
  },
  {
    id: 2,
    value: 'Quy trình đặt cọc',
    name: 'Quy trình đặt cọc',
    description: 'Quy trình đặt cọc',
    isDefault: false,
    type: 'DEPOSIT',
  },
  {
    id: 3,
    value: 'Quy trình hủy chỗ, hoàn tiền',
    name: 'Quy trình hủy chỗ, hoàn tiền',
    description: 'Quy trình hủy chỗ, hoàn tiền',
    isDefault: false,
    type: 'CANCELED_TICKET',
  },
  {
    id: 4,
    value: 'Quy trình tạo hợp đồng',
    name: 'Quy trình tạo hợp đồng',
    description: 'Quy trình tạo hợp đồng',
    isDefault: false,
    type: 'CONTRACT',
  },
  {
    id: 4,
    value: 'Quy trình duyệt khách hàng lớn',
    name: 'Quy trình duyệt khách hàng lớn',
    description: 'Quy trình duyệt khách hàng lớn',
    isDefault: false,
    type: 'APPROVAL_CUSTOMER_BIG',
  },
];

export function DialogProcess(props: Props) {
  const {
    isOpenDialog,
    setIsOpenDialog,
    title,
    description,
    actionName,
    handleSubmit,
    type,
    nameDetail,
    isDelete,
    isCreate,
    idProcess,
  } = props;
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });
  const { t } = useTranslation();
  const [processType, setProcessType] = useState<string>('');
  const [typeCreate, setTypeCreate] = useState<string>('');
  const [processName, setProcessName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (type) {
      setProcessType(get(WorkflowType, type));
      setTypeCreate(type);
      setValue('processType', get(WorkflowType, type));
      setProcessName(nameDetail || '');
    }
  }, [type, nameDetail, idProcess]);

  const handleCloseDialogSendRequest = () => {
    setIsOpenDialog(false);
    setProcessName('');
    setProcessType('');
    setValue('processType', '');
  };

  const hanldeSend = () => {
    handleSubmit();
  };

  const handleCreate = () => {
    navigate(
      `${path.createProcessManagement}?type=${typeCreate}&name=${processName}`,
    );
  };

  const handleCopy = () => {
    navigate(
      `/process-management/copy/${idProcess}?type=${typeCreate}&name=${processName}`,
    );
  };

  const onChangeType = (value: any) => {
    setProcessType(value);
    const type = DATA_PROCESS_TYPES.filter(item => item.name === value)[0].type;
    setTypeCreate(type);
  };

  const onChangeName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') {
      setProcessName('');
      return;
    }
    setProcessName(e.target.value);
  };

  return (
    <Dialog
      open={isOpenDialog}
      onClose={handleCloseDialogSendRequest}
      onSubmit={hanldeSend}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '25px',
        }}
      >
        <Typography
          fontSize={'24px'}
          fontWeight={700}
          width={400}
          color={palette.primary.text}
          mb={2}
          mt={2}
          textAlign={'center'}
        >
          {title}
        </Typography>
        <Typography
          fontSize={'16px'}
          fontWeight={400}
          color={palette.primary.text}
          mb={1}
          textAlign={'center'}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: description.replace(
                '@',
                `<strong>${get(WorkflowType, type || '')}</strong>`,
              ),
            }}
          />
        </Typography>
        {!isDelete && (
          <Grid container mb={3} sx={{ width: '446px' }}>
            <Grid item xs={12}>
              <TextFieldCustom
                placeholder="Chọn loại quy trình"
                label="Loại quy trình"
                control={control}
                name="processType"
                type="select"
                errors={errors}
                options={DATA_PROCESS_TYPES}
                onChange={onChangeType}
                sxProps={{ width: '100%' }}
                disabled={type ? true : false}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                sx={{
                  mb: 2,
                  '& label.Mui-focused': {
                    color: palette.primary.text,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: `#D3D3D3 !important`,
                    },
                }}
                label="Tên quy trình"
                placeholder="Nhập tên quy trình"
                focused
                defaultValue={processName}
                fullWidth
                onChange={onChangeName}
              />
            </Grid>
          </Grid>
        )}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <CustomButton
          title={t(translations.common.cancel)}
          variant="outlined"
          handleClick={handleCloseDialogSendRequest}
          sxProps={{
            borderRadius: '8px',
            minWidth: { md: '128px' },
          }}
        />
        <CustomButton
          title={actionName || t(translations.common.confirm)}
          buttonMode={'lock'}
          sxProps={{
            ml: 3.5,
            borderRadius: '8px',
            minWidth: { md: '128px' },
            background:
              (processType && processName) || isDelete ? '#D45B7A' : '#C8CBCF',
          }}
          sxPropsText={{ color: 'white' }}
          handleClick={
            isCreate ? handleCreate : isDelete ? handleSubmit : handleCopy
          }
          light
          isDisable={(processType && processName) || isDelete ? false : true}
        />
      </Box>
    </Dialog>
  );
}
