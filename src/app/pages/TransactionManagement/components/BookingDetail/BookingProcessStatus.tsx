import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  stepConnectorClasses,
  stepLabelClasses,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { BookingDetail, RecordApprovedTickets } from 'types/Transaction';
import { CustomerItem } from 'types/User';

interface BookingProcessStatusProps {
  bookingDetail: BookingDetail;
}

const BookingProcessStatus: React.FC<BookingProcessStatusProps> = ({
  bookingDetail,
}) => {
  // const { WorkFlowDetail } = useSelector(selectProcessManagement);
  // const { actions: processManagementActions } = useProcessManagementSlice();
  // const dispatch = useDispatch();

  // const sortedWorkflows = useMemo(() => {
  //   if (!WorkFlowDetail) return [];

  //   const arrangedArray = [];
  //   const workflowMap = new Map();

  //   WorkFlowDetail.workFlows.forEach(workflow => {
  //     workflowMap.set(workflow.id, workflow);
  //   });

  //   let currentNode = WorkFlowDetail.workFlows.find(
  //     workflow => !workflow.backNode,
  //   );

  //   while (currentNode) {
  //     arrangedArray.push(currentNode);
  //     currentNode = workflowMap.get(currentNode.nextNode?.id);
  //   }

  //   return arrangedArray;
  // }, [WorkFlowDetail]);

  // const approvedNodes = useMemo(() => {
  //   return bookingDetail.recordApproveTickets.filter(
  //     node => node.status !== RecordApprovalStatus.REFUSE_TICKET,
  //   );
  // }, [bookingDetail.recordApproveTickets]);

  const currentNode = useMemo(() => {
    if (!bookingDetail.currentNodeId) return 0;

    return bookingDetail.workFlow.workFlows.findIndex(
      node => node.id === bookingDetail.currentNodeId,
    );
  }, [bookingDetail.currentNodeId, bookingDetail.workFlow.workFlows]);

  const findLastIndex = (array: any, condition: any, reverse = false) => {
    const startIndex = reverse ? array.length - 1 : 0;
    const endIndex = reverse ? -1 : array.length;
    const step = reverse ? -1 : 1;

    for (let i = startIndex; i !== endIndex; i += step) {
      if (condition(array[i])) {
        return i;
      }
    }
    return -1;
  };

  const approvalTimes: RecordApprovedTickets[] | any[] = useMemo(() => {
    return bookingDetail.workFlow.workFlows.map(step => {
      const lastIndexOfApprovedStep = findLastIndex(
        bookingDetail.recordApproveTickets,
        (el: RecordApprovedTickets) =>
          el.nodeId === step.id && el.status.startsWith('APPROVED_'),
        true,
      );

      if (lastIndexOfApprovedStep < 0) {
        return {};
      }

      return bookingDetail.recordApproveTickets[lastIndexOfApprovedStep];
    });
  }, [bookingDetail.workFlow.workFlows, bookingDetail.recordApproveTickets]);

  const renderDate = (idx: number) => {
    if (idx === 0)
      return dayjs(bookingDetail.createdAt).format('HH:mm, DD/MM/YYYY');

    if (currentNode < idx || !approvalTimes[idx].createdAt) return '';

    return dayjs(approvalTimes[idx].createdAt).format('HH:mm, DD/MM/YYYY');
  };

  // useEffect(() => {
  //   if (bookingDetail.workFlow.id) {
  //     dispatch(
  //       processManagementActions.getDetailWorkFlow({
  //         id: bookingDetail.workFlow.id,
  //       }),
  //     );
  //   } else {
  //     dispatch(processManagementActions.clearDataProcess());
  //   }
  // }, [bookingDetail.workFlow.id, dispatch, processManagementActions]);

  return (
    <Box sx={{ width: '100%', p: '14px 8px 0 8px' }}>
      <Stepper
        activeStep={currentNode}
        alternativeLabel
        sx={{
          [`& .${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              borderColor: '#34C759',
            },
          },
          [`& .${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              borderColor: '#34C759',
            },
          },
        }}
        connector={
          <StepConnector
            sx={{
              top: '36px',

              '&.Mui-disabled + .MuiTypography-root': {
                color: '#7A7A7A',
              },
            }}
          />
        }
      >
        {bookingDetail.workFlow.workFlows.map((step, idx) => {
          return (
            <Step key={step.name}>
              <EllipsisText
                text={`${step.name}`}
                line={1}
                sx={{ textAlign: 'center', typography: 'body2', mx: 'auto' }}
              />

              {/* <Typography variant="body2" textAlign="center">
                {step.name}
              </Typography> */}
              <StepLabel
                sx={{
                  // [`& .${stepLabelClasses.iconContainer}`]: {
                  //   '&.Mui-completed, &.Mui-active': {
                  //     color: '#34C759',
                  //   },
                  //   '&.Mui-disabled': {
                  //     color: '#7E8590',
                  //   },
                  // },
                  [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]:
                    {
                      mt: 1,
                      fontSize: '0.75rem',
                      lineHeight: 1.5,
                    },
                }}
                StepIconComponent={QontoStepIcon}
              >
                {renderDate(idx)}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

function QontoStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <CheckCircleIcon
      sx={{
        color: active || completed ? '#2FB350' : '#7E8590',
      }}
    />
  );
}

export default BookingProcessStatus;
