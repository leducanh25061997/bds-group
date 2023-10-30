import { Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { TicketApprove } from 'app/pages/TransactionManagement/slice/type';
import { getLocalTime } from 'utils/helpers';

export const RenderCustomer = ({
  data,
  stt,
  handleRemove,
}: {
  data?: TicketApprove | null;
  stt: string;
  handleRemove?: () => void;
}) => {
  const isPriorityHasBeenAssembled = (data?.customers?.length || 0) > 0;
  const enableClose = isPriorityHasBeenAssembled && !data?.isPriority;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: '#475160',
        border: '1px dashed #A8ADB4',
        borderRadius: '8px',
        position: 'relative',
        padding: '16px 0',
        minHeight: '105px',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '16px',
          height: '16px',
          background: '#1C293D',
          border: '1px dashed #A8ADB4',
          borderRadius: '50%',
          borderBottomColor: '#1C293D',
          borderRightColor: '#1C293D',
          transform: 'rotate(130deg)',
          position: 'absolute',
          top: '49%',
          left: '-8px',
        }}
      ></Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          width: '92%',
          height: '90%',
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            background: '#EF7197',
            height: '20px',
            width: '20px',
          }}
        >
          <Typography
            sx={{
              color: '#FFF',
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '20px',
              textAlign: 'center',
            }}
          >
            {stt}
          </Typography>
        </Box>
        {/* not enable remove option if show `Ưu tiên đã được ráp` */}
        {handleRemove && enableClose && (
          <Box sx={{ cursor: 'pointer' }}>
            <Icon
              icon="mdi:remove"
              color="#d9d9d9"
              width="18"
              onClick={() => handleRemove()}
            />
          </Box>
        )}
      </Box>

      {data && Object.keys(data).length > 0 ? (
        <Box>
          {!isPriorityHasBeenAssembled ? (
            <Typography
              sx={{
                color: '#D45B7A',
                fontSize: '12px',
                lineHeight: '20px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {`Ưu tiên đã được ráp`}
            </Typography>
          ) : (
            <Box sx={{ marginTop: '12px' }}>
              <Typography
                sx={{
                  color: '#FFF',
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
              >
                {`${getLocalTime(data?.createdAt, 'HH:mm DD/MM/YYYY')}`}
              </Typography>
              <Typography
                sx={{
                  color: '#007AFF',
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
              >
                {data.customers.length && data.customers[0].mainCustomer?.code}
              </Typography>
              <Typography
                sx={{
                  color: '#FFF',
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
              >
                {data.customers.length && data.customers[0].mainCustomer?.name}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{ color: '#7E8590', fontSize: '12px', fontWeight: '400' }}
        >{`Chưa có phiếu UT${stt}`}</Box>
      )}

      <Box
        sx={{
          width: '16px',
          height: '16px',
          background: '#1C293D',
          border: '1px dashed #A8ADB4',
          borderRadius: '50%',
          borderBottomColor: '#1C293D',
          borderRightColor: '#1C293D',
          transform: 'rotate(-40deg)',
          position: 'absolute',
          top: '49%',
          right: '-8px',
        }}
      ></Box>
    </Box>
  );
};
