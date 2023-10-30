import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import OrgChartManagement from 'app/pages/Orgchart/components/chart/chartManagement';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  idShowOrgChart: string;
}

export default function PopupShowOrgChart(props: Props) {
  const { isOpen, handleClose, idShowOrgChart } = props;

  return (
    <Dialog
      sx={{
        '&.MuiDialog-root': {
          backdropFilter: 'blur(0.5rem)',
        },
      }}
      fullWidth
      maxWidth="lg"
      open={isOpen}
      // onClose={handleClose}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          p: 1,
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 'bold', color: '#1E1E1E' }}>
          Sơ đồ tổ chức đơn vị làm việc
        </Typography>
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
      <OrgChartManagement idShowOrgChart={idShowOrgChart} />
    </Dialog>
  );
}
