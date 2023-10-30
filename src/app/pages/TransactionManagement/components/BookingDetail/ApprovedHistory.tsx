import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineConnectorClasses,
  timelineContentClasses,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import React, { useCallback, useMemo } from 'react';
import { RecordApprovalStatus, RecordApprovedTickets } from 'types/Transaction';
import dayjs from 'dayjs';

interface ApprovedHistoryProps {
  history: RecordApprovedTickets[];
}

const ApprovedHistory: React.FC<ApprovedHistoryProps> = ({ history }) => {
  const approveStatuses = useMemo(
    () => [
      RecordApprovalStatus.APPROVED_TICKET,
      RecordApprovalStatus.APPROVED_DEPOSIT,
      RecordApprovalStatus.APPROVED_CANCELED,
    ],
    [],
  );

  const getLastText = useCallback(
    (status: RecordApprovalStatus, isSubText: boolean = false) => {
      if (status.startsWith('CREATE')) return '';

      if (!isSubText)
        return approveStatuses.includes(status) ? 'duyệt' : 'trả về';
      else
        return approveStatuses.includes(status) ? 'đã xác nhận' : 'đã từ chối';
    },
    [approveStatuses],
  );

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} marginBottom={1.5}>
        Lịch sử duyệt phiếu
      </Typography>
      <Timeline
        sx={{
          p: 0,
          [`& .${timelineContentClasses.root}`]: {
            px: 1,
            py: 0,
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: '0.3',
            mr: 1,
            maxWidth: 140,
            p: 0,
            py: 0.25,
          },
          // [`& .${timelineConnectorClasses.root}`]: {
          //   backgroundColor: '#2FB350',
          // },
        }}
      >
        {history.map((node, idx) => (
          <TimelineItem
            key={node.id}
            sx={{
              minHeight: 60,
            }}
          >
            <TimelineOppositeContent
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {dayjs(node.createdAt).format('HH:mm DD/MM/YYYY')}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  p: 0,
                  my: 0.5,
                  border: 0,
                  background: 'none',
                  boxShadow: 'none',
                }}
              >
                {approveStatuses.includes(node.status) ||
                node.status.startsWith('CREATE') ? (
                  <CheckCircleIcon
                    sx={{
                      width: 20,
                      height: 20,
                      color: '#2FB350',
                    }}
                  />
                ) : (
                  <CancelIcon
                    sx={{
                      width: 20,
                      height: 20,
                      color: '#E42B2C',
                    }}
                  />
                )}
              </TimelineDot>
              {!(history.length - 1 === idx) && (
                <TimelineConnector
                  sx={{
                    backgroundColor:
                      approveStatuses.includes(node.status) ||
                      node.status.startsWith('CREATE')
                        ? '#2FB350'
                        : '#E42B2C',
                  }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="body2" component="span" fontWeight={700}>
                {`${node.nodeName}`}
              </Typography>
              <Typography variant="caption" component="p">
                {`${node.nodeName} ${getLastText(node.status, true)}`}
              </Typography>
              {node.reason && (
                <Typography variant="caption" component="p">
                  Lý do: {node.reason}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default ApprovedHistory;
