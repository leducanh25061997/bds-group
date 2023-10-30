import { Box, Typography } from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { TemplateStatusEnum } from 'app/pages/TemplateProject/slice/types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import palette from 'styles/theme/palette';
import { useTransactionManagementSlice } from '../../slice';
import { useDispatch, useSelector } from 'react-redux';
import { PayloadGetListConfirmTicket } from '../../slice/type';
import { ApplicableStatus } from 'types/Enum';
import { selectTransactionManagement } from '../../slice/selector';
import { Option } from 'types/Option';

interface Props {
  isOpenDialog: boolean;
  setIsOpenDialog: (e: any) => void;
  title: string;
  description: string | React.ReactNode;
  actionName: string;
  handleSubmit?: (ticketType: string) => void;
  type: 'deposit' | 'reservation' | 'canceled';
  projectId: string;
}

export function DialogConfirmTicket(props: Props) {
  const {
    isOpenDialog,
    setIsOpenDialog,
    title,
    type,
    description,
    actionName,
    projectId,
    handleSubmit,
  } = props;

  const dispatch = useDispatch();
  const { actions } = useTransactionManagementSlice();
  const { ListPrintTicket } = useSelector(selectTransactionManagement);
  const FormControl = useForm<{ ticketType: string }>({
    mode: 'onBlur',
    defaultValues: {
      ticketType: '',
    },
  });

  const {
    control,
    handleSubmit: handleFormSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = FormControl;

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (projectId) {
      const payload: PayloadGetListConfirmTicket = {
        applicableStatus: ApplicableStatus.APPROVED_TICKET,
        projectId: projectId,
      };
      if (type === 'deposit') {
        payload.applicableStatus = ApplicableStatus.APPROVED_DEPOSIT;
      } else if (type === 'canceled') {
        payload.applicableStatus = ApplicableStatus.APPROVED_CANCELED;
      }
      dispatch(actions.getListPrintTicket(payload));
    }
    
    return () => {
      dispatch(actions.clearListPrintTicket());
    };
  }, [projectId, actions, dispatch]);

  const TemplateConfirmTicketOptions = useMemo(() => {
    const option: Option[] = [];
    if (ListPrintTicket && ListPrintTicket?.length > 0) {
      ListPrintTicket.map(items => {
        option.push({
          key: items?.image?.path,
          value: items.id,
          id: items.id,
        });
      });
    }
    return option;
  }, [ListPrintTicket]);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleSend = () => {
    handleFormSubmit(data => {
      handleSubmit?.(data.ticketType);
    })();
  };

  const handleDeletedTypeEmail = () => {
    setValue('ticketType', '');
  };

  return (
    <ConfirmDialog
      isOpen={isOpenDialog}
      handleClose={handleCloseDialog}
      handleSubmit={handleSend}
      isIcon={false}
      actionName={actionName}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
          mb={2}
          textAlign={'center'}
        >
          {description}
        </Typography>
        <Box sx={{ mr: 1, width: '350px', mb: 4 }}>
          <TextFieldCustom
            control={control}
            isRequired
            placeholder="Chọn mẫu phiếu in"
            label="Mẫu phiếu in"
            name="ticketType"
            type="select"
            errors={errors}
            options={TemplateConfirmTicketOptions}
            handleDeleted={handleDeletedTypeEmail}
          />
        </Box>
      </div>
    </ConfirmDialog>
  );
}
