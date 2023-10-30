import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import {
  Box,
  DialogActions,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import palette from 'styles/theme/palette';
import { red } from '@mui/material/colors';
import CustomButton from 'app/components/Button';
import { Close as CloseIcon } from '@mui/icons-material';

interface SalesUnitProps {
  id: string;
  isCheck: boolean;
  key: string;
  name: string;
  value: string;
}

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  data: SalesUnitProps;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, data } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth={'sm'}
      sx={{ padding: '24px' }}
    >
      <DialogTitle
        variant="h4"
        sx={{ textAlign: 'center', padding: '36px', lineHeight: 1 }}
      >
        {`Chi tiết ${data.name}`}

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '20px 44px',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            lineHeight: '22px',
            color: '#1E1E1E',
          }}
        >
          Thông tin chia hoa hồng
        </Typography>
        <Box
          mt={2}
          sx={{
            border: '1px solid #E0E1E4',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'primary.lightRed',
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              Chức danh
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              Hoa hồng
            </Typography>
          </Box>
          <Box
            mt={1}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '14px 16px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              Nhân viên kinh doanh
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              2.0%
            </Typography>
          </Box>

          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '14px 16px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              Người hưởng thụ khác
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '16px',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
              <Box ml={2}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: '#1E1E1E',
                  }}
                >
                  Phan Thị Thu Hằng
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#7A7A7A',
                  }}
                >
                  Trưởng phòng kinh doanh
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#000000',
              }}
            >
              %
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      {/* <DialogActions
        sx={{ display: 'flex', justifyContent: 'center', padding: '18px' }}
      >
        <CustomButton
          title={'Chỉnh sửa'}
          sxProps={{
            background: palette.primary.button,
            color: palette.common.white,
            borderRadius: '8px',
          }}
          sxPropsText={{
            fontSize: '14px',
            fontWeight: 700,
          }}
          handleClick={() => console.log('11111')}
        />
      </DialogActions> */}
    </Dialog>
  );
}

export default SimpleDialog;
