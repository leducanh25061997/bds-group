import { Avatar, Box, Typography } from '@mui/material';
import STAFF_ICON from 'assets/background/icon-staff-pink.svg';

interface Props {
  listEmp: any;
}

export function RenderAvatar(props: Props) {
  const { listEmp } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {listEmp.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={STAFF_ICON} alt="img" width={16} height={10} />
          <Typography sx={{ fontSize: '10px' }}>
            {listEmp.length} nhân sự
          </Typography>
        </Box>
      )}
      <Box
        sx={{ display: 'flex', position: 'relative', bottom: '12px', left: 20 }}
      >
        {listEmp[0] && (
          <Avatar
            src={listEmp[0].avatar}
            sx={{
              width: '28px',
              height: '28px',
              position: 'absolute',
              top: 0,
              left: 0,
              border: '1px solid white',
            }}
          />
        )}
        {listEmp[1] && (
          <Avatar
            src={listEmp[1].avatar}
            sx={{
              width: '28px',
              height: '28px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(60%, 0%)',
              border: '1px solid white',
            }}
          />
        )}
        {listEmp[2] && (
          <Avatar
            src={listEmp[1].avatar}
            sx={{
              width: '28px',
              height: '28px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(120%, 0%)',
              border: '1px solid white',
            }}
          />
        )}
        {listEmp[3] && (
          <Box
            sx={{
              width: '28px',
              height: '28px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(180%, 0%)',
              border: '1px solid white',
              borderRadius: '60px',
              background: '#FFD9EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: '12px', fontWeight: 500, color: '#D6465F' }}
            >
              +{listEmp.length - 3}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
