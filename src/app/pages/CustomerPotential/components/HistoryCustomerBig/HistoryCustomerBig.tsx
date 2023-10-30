import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineContentClasses,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Box, Stack, Typography, Link as MuiLink } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { ApproveCustomerBigTypeEnum } from 'types/Enum';
import { CustomerItem } from 'types/User';

interface HistoryCustomerBigProps {
  customerDetail: CustomerItem;
}

const HistoryCustomerBig: React.FC<HistoryCustomerBigProps> = ({
  customerDetail,
}) => {
  const approveStatuses = useMemo(
    () => [
      ApproveCustomerBigTypeEnum.CREATE,
      ApproveCustomerBigTypeEnum.WAIT_APPROVE,
      ApproveCustomerBigTypeEnum.APPROVED,
    ],
    [],
  );

  const getlinkAttacment = (file: any) => {
    if (!file) return;
    if (!file?.name) {
      return process.env.REACT_APP_API_URL + `/${file?.path}`;
    }
    if (file?.name) {
      const url = URL.createObjectURL(file);
      return url;
    }
  };

  const renderFileAttachment = (attachments: any[]) => {
    if (!attachments?.length) return;
    return (
      <>
        {attachments?.map((e: any, index: number) => (
          <MuiLink
            key={index}
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#006EE6',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '40vw',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
            href={getlinkAttacment(e)}
            target="_blank"
          >
            <AttachFileIcon
              sx={{
                width: '1rem',
                height: '1rem',
                mr: 0.5,
                transform: 'rotate(45deg) scaleY(-1)',
              }}
            />
            <span>{e?.path}</span>
          </MuiLink>
        ))}
      </>
    );
  };

  return (
    <Box mt={2}>
      {customerDetail?.workFlowCustomerBigHistory.length > 0 && (
        <Typography variant="body2" fontWeight={700} marginBottom={1.5} ml={4}>
          Lịch sử duyệt KH lớn
        </Typography>
      )}
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
        }}
      >
        {customerDetail?.workFlowCustomerBigHistory.map((node, idx) => (
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
              {!(
                customerDetail?.workFlowCustomerBigHistory.length - 1 ===
                idx
              ) && (
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
              {node.reason && (
                <Stack flexDirection={'row'}>
                  <Typography variant="caption" component="p" fontWeight={700}>
                    Bình luận:
                  </Typography>
                  <Typography variant="caption" component="p" ml={0.5}>
                    {node.reason}
                  </Typography>
                </Stack>
              )}
              {node?.filesVip.length > 0 && (
                <Stack flexDirection={'row'}>
                  <Typography variant="caption" component="p" fontWeight={700}>
                    Tập tin:
                  </Typography>
                  <Typography variant="caption" component="p" ml={0.5}>
                    {renderFileAttachment(node?.filesVip)}
                  </Typography>
                </Stack>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default HistoryCustomerBig;
