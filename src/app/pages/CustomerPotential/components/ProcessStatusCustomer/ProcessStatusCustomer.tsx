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
import { ApproveCustomerBigTypeEnum } from 'types/Enum';
import { RecordApprovedTickets } from 'types/Transaction';
import { CustomerItem } from 'types/User';

interface ProcessStatusCustomerProps {
  customerDetail: CustomerItem;
}

const ProcessStatusCustomer: React.FC<ProcessStatusCustomerProps> = ({
  customerDetail,
}) => {

  const currentNode = useMemo(() => {
    if (!customerDetail?.customerBigApprove[0]?.currentNodeId) return 0;

    return customerDetail.workFlow.workFlows.findIndex(
      node => node.id === customerDetail?.customerBigApprove[0]?.currentNodeId,
    );
  }, [customerDetail?.customerBigApprove[0]?.currentNodeId, customerDetail.workFlow.workFlows]);

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
    return customerDetail.workFlow.workFlows.map(step => {
      const lastIndexOfApprovedStep = findLastIndex(
        customerDetail.workFlowCustomerBigHistory,
        (el: RecordApprovedTickets) =>
          el.nodeId === step.id && el.status.startsWith(ApproveCustomerBigTypeEnum.APPROVED),
        true,
      );

      if (lastIndexOfApprovedStep < 0) {
        return {};
      }

      return customerDetail.workFlowCustomerBigHistory[lastIndexOfApprovedStep];
    });
  }, [customerDetail.workFlow.workFlows, customerDetail.workFlowCustomerBigHistory]);

  const renderDate = (idx: number) => {
    if (idx === 0)
      return dayjs(customerDetail.createdAt).format('HH:mm, DD/MM/YYYY');

    if (currentNode < idx || !approvalTimes[idx].createdAt) return '';

    return dayjs(approvalTimes[idx].createdAt).format('HH:mm, DD/MM/YYYY');
  };

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
        {customerDetail.workFlow.workFlows.map((step, idx) => {
          return (
            <Step key={step.name}>
              <EllipsisText
                text={`${step.name}`}
                line={1}
                sx={{ textAlign: 'center', typography: 'body2', mx: 'auto' }}
              />
              <StepLabel
                sx={{
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

export default ProcessStatusCustomer;
