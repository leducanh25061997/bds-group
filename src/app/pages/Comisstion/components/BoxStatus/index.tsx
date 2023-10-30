import { Box, SxProps, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TransactionStatusType } from 'types/Enum';

interface Props {
  status: string;
}

export default function BoxStatus(props: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { status } = props;
  const renderBoxStatus = () => {
    const view = [];
    switch (status) {
      case TransactionStatusType.PAID:
        view.push(
          <Box
            sx={{
              display: 'flex',
              background: '#D6F4DE',
              p: '4px 10px',
              borderRadius: '4px',
              height: '24px',
              minWidth: '78px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#2A9F47',
              }}
            >
              Đã chi
            </Typography>
          </Box>,
        );
        break;
      case TransactionStatusType.UNPAID:
        view.push(
          <Box
            sx={{
              display: 'flex',
              background: '#FFD1D2',
              p: '4px 10px',
              borderRadius: '4px',
              height: '24px',
              minWidth: '78px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#CD0006',
              }}
            >
              Chưa chi
            </Typography>
          </Box>,
        );
        break;
      case TransactionStatusType.PAYING:
        view.push(
          <Box
            sx={{
              display: 'flex',
              background: '#FFEB99',
              p: '4px 10px',
              borderRadius: '4px',
              height: '24px',
              minWidth: '78px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#CCA300',
              }}
            >
              Đang chi
            </Typography>
          </Box>,
        );
        break;
      default:
        break;
    }
    return view;
  };

  return <Box>{renderBoxStatus()}</Box>;
}
