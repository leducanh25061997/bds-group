import { TextField, Typography } from '@mui/material';
import { borderColor } from '@mui/system';
import ConfirmDialog from 'app/components/ConfirmDialog';
import palette from 'styles/theme/palette';
import { ReservationItem } from 'types/Transaction';

interface Props {
  isOpenDialogSendRequest: boolean;
  setIsOpenDialogSendRequest: (e: any) => void;
  title: string;
  description: string | React.ReactNode;
  actionName: string;
  handleSubmit?: () => void;
  isReject?: boolean;
}

export function DialogRequest(props: Props) {
  const {
    isOpenDialogSendRequest,
    setIsOpenDialogSendRequest,
    title,
    description,
    actionName,
    handleSubmit,
    isReject,
  } = props;

  const handleCloseDialogSendRequest = () => {
    setIsOpenDialogSendRequest({ isOpen: false, rowSelected: null });
  };

  const handleSend = () => {
    handleSubmit?.();
  };

  return (
    <ConfirmDialog
      isOpen={isOpenDialogSendRequest}
      handleClose={handleCloseDialogSendRequest}
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
          mb={5}
          textAlign={'center'}
        >
          {description}
        </Typography>
        {isReject && (
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
            label="Lý do từ chối"
            placeholder="Nhập lý do từ chối"
            focused
            fullWidth
          />
        )}
      </div>
    </ConfirmDialog>
  );
}
