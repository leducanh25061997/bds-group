import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Typography,
  useTheme,
  TypographyProps,
  Stack,
  StackProps,
  Link as MuiLink,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Divider,
  Stepper,
  Step,
  StepLabel,
  stepLabelClasses,
  StepIcon,
  stepConnectorClasses,
  StepConnector,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import React, { useEffect } from 'react';
import palette from 'styles/theme/palette';
import { Link } from 'react-router-dom';
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
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from 'app/components/Button';

import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';

import ProjectBaseInfo from '../../../Projects/components/ProjectBaseInfo';

interface BookingDetailProps {
  bookingId: string;
  isOpen: boolean;
  onClose?: () => void;
  type: 'deposit' | 'reservation';
}

const fakeSteps = [
  {
    name: 'Khởi tạo',
    date: '11:31, 14/05/2023',
  },
  {
    name: 'Admin',
    date: '13:10, 14/05/2023',
  },
  {
    name: 'ĐVBH',
    date: '',
  },
  {
    name: 'Dịch vụ KH',
    date: '',
  },
  {
    name: 'Kế toán',
    date: '',
  },
];

const fakeApprovalHistory = [
  {
    date: '13:10, 14/05/2023',
    title: 'Admin sàn 1',
    desc: 'Admin đã xác nhận',
    approve: true,
  },
  {
    date: '16/07/2022 - 22:10',
    title: 'Giám đốc sàn 1',
    desc: 'Chờ ĐVBH xác nhận',
    approve: true,
  },
  {
    date: '16/07/2022 - 22:10',
    title: 'Dịch vụ khách hàng',
    desc: 'Dịch vụ khách hàng đã từ chối',
    approve: false,
  },
];

const BookingDetail: React.FC<BookingDetailProps> = props => {
  const { bookingId, type, isOpen, onClose } = props;

  const dispatch = useDispatch();
  const { actions } = useTransactionManagementSlice();

  useEffect(() => {
    console.log(bookingId);
  }, [bookingId]);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth={'md'}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle
        sx={{
          m: 0,
          py: 2,
          px: 3.5,
          textAlign: 'center',
          color: '#1E1E1E',
        }}
        variant="h4"
      >
        {type === 'reservation'
          ? 'Chi tiết phiếu giữ chỗ'
          : 'Chi tiết phiếu đặt cọc'}
        {onClose ? (
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
            <Close />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', p: '14px 8px 0 8px' }}>
          <Stepper
            activeStep={1}
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
            {fakeSteps.map(step => (
              <Step key={step.name}>
                <Typography variant="body2" textAlign="center">
                  {step.name}
                </Typography>
                <StepLabel
                  sx={{
                    [`& .${stepLabelClasses.iconContainer}`]: {
                      '&.Mui-completed, &.Mui-active': {
                        color: '#34C759',
                      },
                      '&.Mui-disabled': {
                        color: '#7E8590',
                      },
                    },
                    [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]:
                      {
                        mt: 1,
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                      },
                  }}
                  StepIconComponent={CheckCircleIcon}
                >
                  {step.date}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <ProjectBaseInfo />

        <Box sx={{ mt: 2.5 }}>
          <Typography
            fontWeight={700}
            color={palette.primary.button}
            marginBottom={1.5}
          >
            Thông tin khách hàng
          </Typography>
          <Stack spacing={1.5}>
            <FieldInfo label="Mã sản phẩm (nếu có):" content={'A1-12-04'} />
            <FieldInfo label="Loại khách hàng" content={'Cá nhân'} />
            <FieldInfo
              label="Mã khách hàng (nếu có):"
              content={
                <MuiLink
                  component={Link}
                  to="#"
                  underline="hover"
                  sx={{
                    color: '#006EE6',
                  }}
                >
                  KH-000110406
                </MuiLink>
              }
            />
            <FieldInfo
              label="Tên khách hàng:"
              content={'Nguyễn Hoàng Ngọc Thủy'}
            />
            <FieldInfo label="Giới tính:" content={'Nữ'} />
            <FieldInfo label="Ngày sinh:" content={'01/01/1990'} />
            <FieldInfo
              label="Địa chỉ Email:"
              content={'thuyhoang.nguyen@gmail.com'}
            />
            <FieldInfo label="Số điện thoại:" content={'0987654321'} />
            <FieldInfo
              label="Số CCCD/CMND/Pastport:"
              content={'109846573205'}
            />
            <FieldInfo label="Ngày cấp:" content={'15/01/2021'} />
            <FieldInfo
              label="Nơi cấp:"
              content={'Cục quản lý trật tự xã hội'}
            />
            <FieldInfo
              label="Địa chỉ liên hệ:"
              content={
                '111, Phan Văn Trị, Phường 25, Quận Gò Vấp, Thành Phố Hồ Chí Minh'
              }
            />
            <FieldInfo label="Mã số thuế:" content={'11076545666'} />
            <FieldInfo
              label="Ngân hàng:"
              content={
                'Ngân hàng thương mại cổ phần ngoại thương Việt Nam - Vietcombank'
              }
            />
            <FieldInfo
              label="Số tài khoản ngân hàng:"
              content={'96950003593942'}
            />
            <FieldInfo
              label="Nơi cấp:"
              content={'Cục quản lý trật tự xã hội'}
            />
            <FieldInfo label="Mã số thuế:" content={'11076545666'} />
            <FieldInfo
              label="Ngân hàng:"
              content={
                'Ngân hàng thương mại cổ phần ngoại thương Việt Nam - Vietcombank'
              }
            />
          </Stack>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {[...new Array(2)].map((_, idx) => (
            <Accordion
              key={idx}
              sx={{
                backgroundColor: '#F4F5F6',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#1E1E1E' }} />}
                aria-controls="panel2a-content"
              >
                <Typography fontWeight={700} color={palette.primary.button}>
                  Khách hàng đồng sở hữu {idx + 1}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <FieldInfo
                    label="Mã khách hàng (nếu có):"
                    content={
                      <MuiLink
                        component={Link}
                        to="#"
                        underline="hover"
                        sx={{
                          color: '#006EE6',
                        }}
                      >
                        KH-000110406
                      </MuiLink>
                    }
                  />
                  <FieldInfo
                    label="Tên khách hàng:"
                    content={'Nguyễn Hoàng Ngọc Thủy'}
                  />
                  <FieldInfo label="Giới tính:" content={'Nữ'} />
                  <FieldInfo label="Ngày sinh:" content={'01/01/1990'} />
                  <FieldInfo
                    label="Địa chỉ Email:"
                    content={'thuyhoang.nguyen@gmail.com'}
                  />
                  <FieldInfo label="Số điện thoại:" content={'0987654321'} />
                  <FieldInfo
                    label="Số CCCD/CMND/Pastport:"
                    content={'109846573205'}
                  />
                  <FieldInfo label="Ngày cấp:" content={'15/01/2021'} />
                  <FieldInfo
                    label="Nơi cấp:"
                    content={'Cục quản lý trật tự xã hội'}
                  />
                  <FieldInfo
                    label="Địa chỉ liên hệ:"
                    content={
                      '111, Phan Văn Trị, Phường 25, Quận Gò Vấp, Thành Phố Hồ Chí Minh'
                    }
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Typography
            fontWeight={700}
            color={palette.primary.button}
            marginBottom={1.5}
          >
            Thông tin khác
          </Typography>
          <Box>
            <Typography variant="body2" fontWeight={700} marginBottom={1.5}>
              Khảo sát nhu cầu khách hàng
            </Typography>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2.5}
              >
                <Typography variant="body2">
                  Khách hàng có nhu cầu vay ngân hàng không?
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="no"
                      control={
                        <Radio
                          sx={{
                            color: palette.primary.button,
                            '&.Mui-checked': {
                              color: palette.primary.button,
                            },
                          }}
                        />
                      }
                      label="Không"
                    />
                    <FormControlLabel
                      value="yes"
                      control={
                        <Radio
                          sx={{
                            color: palette.primary.button,
                            '&.Mui-checked': {
                              color: palette.primary.button,
                            },
                          }}
                          disabled={true}
                        />
                      }
                      label="Có"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2.5}
              >
                <Typography variant="body2">Dự án quan tâm khác</Typography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="no"
                      control={
                        <Radio
                          sx={{
                            color: palette.primary.button,
                            '&.Mui-checked': {
                              color: palette.primary.button,
                            },
                          }}
                        />
                      }
                      label="Không"
                    />
                    <FormControlLabel
                      value="yes"
                      control={
                        <Radio
                          sx={{
                            color: palette.primary.button,
                            '&.Mui-checked': {
                              color: palette.primary.button,
                            },
                          }}
                        />
                      }
                      label="Có"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={700} marginBottom={1.5}>
              Ghi chú thêm
            </Typography>
            <Typography variant="body2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book
            </Typography>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="body2" fontWeight={700} marginBottom={1.5}>
              Chứng từ liên quan (nếu có)
            </Typography>
            <MuiLink
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#006EE6',
                cursor: 'pointer',
              }}
            >
              <AttachFileIcon
                sx={{
                  width: '1.25rem',
                  height: '1.25rem',
                  mr: 0.5,
                  transform: 'rotate(45deg) scaleY(-1)',
                }}
              />
              <span>hoadonchuyentiendatcoc-12-05.jpg</span>
            </MuiLink>
          </Box>
        </Box>
        <Divider
          sx={{
            my: 3,
          }}
        />
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
              [`& .${timelineConnectorClasses.root}`]: {
                backgroundColor: '#2FB350',
              },
            }}
          >
            {fakeApprovalHistory.map((e, idx) => (
              <TimelineItem
                key={e.title}
                sx={{
                  minHeight: 60,
                }}
              >
                <TimelineOppositeContent
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  {e.date}
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
                    {e.approve ? (
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
                  {fakeApprovalHistory.length - 2 >= idx && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="body2" component="span" fontWeight={700}>
                    {e.title}
                  </Typography>
                  <Typography variant="caption" component="p">
                    {e.desc}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <CustomButton
            variant="outlined"
            title="Từ chối"
            sxProps={{
              borderRadius: '8px',
              minWidth: 130,

              backgroundColor: '#FFE8E9',
            }}
            sxPropsText={{ color: '#1E1E1E' }}
          />
          <CustomButton
            variant="outlined"
            title="Duyệt"
            sxProps={{
              borderRadius: '8px',
              minWidth: 130,

              borderColor: '#2FB350',
              backgroundColor: '#D6F4DE',
            }}
            sxPropsText={{ color: '#2FB350' }}
          />
          <CustomButton
            title="In phiếu"
            isIcon
            buttonMode="print"
            sxProps={{
              borderRadius: '8px',
              minWidth: 130,
            }}
          />
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export const FieldInfo: React.FC<{
  containerProps?: StackProps;
  label: string;
  labelProps?: TypographyProps;
  content: React.ReactNode | string;
  contentProps?: TypographyProps;
}> = ({ label, content, contentProps, containerProps, labelProps }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <Typography variant="body2" {...contentProps}>
          {content}
        </Typography>
      );
    }
    return content;
  };

  return (
    <Stack direction="row" spacing={2} {...containerProps}>
      <Typography
        variant="body2"
        {...labelProps}
        sx={{
          fontWeight: 700,
          minWidth: 185,
          ...(labelProps?.sx && labelProps.sx),
        }}
      >
        {label}
      </Typography>
      <Box>{renderContent()}</Box>
    </Stack>
  );
};

export default BookingDetail;
