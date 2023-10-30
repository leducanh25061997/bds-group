import {
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import Button from 'app/components/Button';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { useCallback, useMemo } from 'react';
import palette from 'styles/theme/palette';

import { SaleControlEnum } from '../../slice/types';

interface Props {
  open: boolean;
  onClose: () => void;
  // setIsOpenDialogSendRequest: (e: any) => void;
  // title: string;
  // description: string | React.ReactNode;
  // actionName: string;
  type: SaleControlEnum | string | null;
  handleSubmit?: () => void;
}

export function ActionsDialog(props: Props) {
  const {
    open,
    onClose,
    // setIsOpenDialogSendRequest,
    // title,
    // description,
    // actionName,
    type,
    handleSubmit,
  } = props;

  const handleCloseActionDialog = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    handleSubmit?.();
  };

  const dialogText = useMemo(() => {
    const text = {
      [SaleControlEnum.END_PHASE1]: {
        title: 'Kết thúc giai đoạn 1',
        description: 'Bạn có chắc chắn muốn kết thúc giai đoạn 1 ngay bây giờ?',
        actionName: 'Kết thúc GĐ1',
      },
      [SaleControlEnum.END_PHASE2]: {
        title: 'Kết thúc giai đoạn 2',
        description: 'Bạn có chắc chắn muốn kết thúc giai đoạn 2 ngay bây giờ?',
        actionName: 'Kết thúc GĐ2',
      },
      [SaleControlEnum.END_PRIORITY1]: {
        title: 'Kết thúc giao dịch ưu tiên 1',
        description:
          'Bạn có chắc chắn muốn kết thúc giao dịch ưu tiên 1 ngay bây giờ?',
        actionName: 'Kết thúc UT1',
      },
      [SaleControlEnum.END_PRIORITY2]: {
        title: 'Kết thúc giao dịch ưu tiên 2',
        description:
          'Bạn có chắc chắn muốn kết thúc giao dịch ưu tiên 2 ngay bây giờ?',
        actionName: 'Kết thúc UT2',
      },
      [SaleControlEnum.END_PRIORITY3]: {
        title: 'Kết thúc giao dịch ưu tiên 3',
        description:
          'Bạn có chắc chắn muốn kết thúc giao dịch ưu tiên 3 ngay bây giờ?',
        actionName: 'Kết thúc UT3',
      },
      [SaleControlEnum.SEND_EMAIL]: {
        title: 'Gửi Email xác nhận kết thúc giao dịch',
        description:
          'Xác nhận gửi email kết thúc giao dịch đến tất cả các đơn vị tham gia bán hàng trong sự kiện',
        actionName: 'Gửi Email',
      },
      [SaleControlEnum.MOVE_PRODUCT]: {
        title: 'Chuyển sản phẩm sang giai đoạn 2',
        description: (
          <>
            Các sản phẩm chưa giao dịch ở giai đoạn 1 sẽ được tự động chuyển
            thành sản phẩm giao dịch tự do ở giai đoạn 2.
            <br /> Bạn có chắc chắn muốn chuyển?
          </>
        ),
        actionName: 'Chuyển',
      },
      [SaleControlEnum.ENDED]: {
        title: 'Kết thúc sự kiện',
        description: 'Bạn có chắc chắn muốn kết thúc sự kiện ngay bây giờ?',
        actionName: 'Kết thúc',
      },
      [SaleControlEnum.EXPORT_EVENT_REPORT]: {
        title: 'Xuất báo cáo sự kiện',
        description: 'Bạn có muốn xuất báo cáo sự kiện?',
        actionName: 'Xuất báo cáo',
      },
      default: {
        title: '',
        description: '',
        actionName: '',
      },
    };

    return text[type as keyof typeof text] || text.default;
  }, [type]);

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={open}
      onClose={handleCloseActionDialog}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: '#1E1E1E',
          pt: 5,
          pb: 2,
        }}
        variant="h4"
      >
        {dialogText.title}
        <IconButton
          aria-label="close"
          onClick={handleCloseActionDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '10px 24px' }}>
        <Box mb={2}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              padding: '0 24px',
            }}
          >
            {dialogText.description}
          </Typography>

          <Box mt={3} mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              title="Hủy"
              variant="outlined"
              handleClick={() => handleCloseActionDialog()}
              sxProps={{
                borderRadius: '8px',
                minWidth: '135px',
                marginRight: '42px',
                ':hover': {
                  border: `1px solid ${palette.primary.button}`,
                  color: palette.common.white,
                  background: palette.primary.button,
                },
              }}
              sxPropsText={{ fontWeight: 400 }}
            />
            <Button
              title={dialogText.actionName}
              typeButton="submit"
              sxProps={{
                background: '#D45B7A',
                borderRadius: '8px',
                minWidth: '135px',
              }}
              sxPropsText={{ color: '#FFFFFF' }}
              handleClick={() => handleConfirm()}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
