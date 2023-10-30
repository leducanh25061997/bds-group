import {
  Box,
  Divider,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import CHECK_ICON from 'assets/background/checksuccess-icon.svg';
import EXCEL_ICON from 'assets/background/excel_icon.svg';
import TRASH_ICON from 'assets/background/trash-icon.svg';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import palette from 'styles/theme/palette';
import { UpLoadFileStatus } from 'types/Enum';

import { Link } from 'react-router-dom';

import { useComisstionSlice } from '../../slice';

import { UploadFileItem } from '../../slice/types';

import ListUploadComisstions from './list';
import DragDrop from './uploadlib';

export default function UploadComisstions() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useComisstionSlice();
  const [uploadStatus, setUploadStatus] = useState<UpLoadFileStatus>(
    UpLoadFileStatus.EMPTY,
  );
  const [comissionUploadList, setComissionUploadList] = useState<
    UploadFileItem[]
  >([]);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 50,
      sortByName: 'false',
    };
  }, []);

  const onchangeStatusSpending = () => {
    dispatch(actions.fetchListComisstion(initialFilter));
    setUploadStatus(UpLoadFileStatus.SUCCESS);
  };

  const onchangeStatusDone = () => {
    setUploadStatus(UpLoadFileStatus.SUCCESS);
  };
  const onchangeStatusEMP = () => {
    setUploadStatus(UpLoadFileStatus.EMPTY);
  };

  const callbackFileUpload = (file: UploadFileItem[]) => {
    setComissionUploadList(file);
  };

  const renderBoxStatus = () => {
    const view = [];
    if (uploadStatus === UpLoadFileStatus.EMPTY) {
      view.push(
        <DragDrop
          onchangeStatusSpending={onchangeStatusSpending}
          callbackFileUpload={callbackFileUpload}
        />,
      );
    } else if (uploadStatus === UpLoadFileStatus.SPENDING) {
      view.push(
        <Box
          sx={{
            width: '65%',
            border: `1px dashed #A8ADB4`,
            p: '25px 25px 25px 44px',
            borderRadius: '12px',
          }}
        >
          <Typography
            fontSize={'16px'}
            fontWeight={400}
            color={palette.primary.text}
          >
            Đang tải lên...
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '35px' }}>
            <img src={EXCEL_ICON} alt="icon excel" />
            <Typography
              ml={'15px'}
              fontSize={'14px'}
              color={palette.primary.hint}
            >
              Filename.XML
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={'5px'}>
            <Box width="100%" mr={2}>
              <LinearProgress
                variant="determinate"
                sx={{
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: palette.primary.button,
                  },
                }}
              />
            </Box>
            <Box minWidth={35}>
              <Typography fontSize={'12px'}>{`${Math.round(25)}%`}</Typography>
            </Box>
          </Box>
        </Box>,
      );
    } else {
      view.push(
        <Box
          sx={{
            width: '65%',
            border: `1px dashed #A8ADB4`,
            p: '25px 25px 25px 44px',
            borderRadius: '12px',
          }}
        >
          <Typography
            fontSize={'16px'}
            fontWeight={400}
            color={palette.primary.text}
          >
            Tải lên thành công
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: '20px',
              background: '#ECECEE',
              p: '10px 15px',
              justifyContent: 'space-between',
            }}
          >
            <Box display={'flex'} alignItems={'center'}>
              <img src={EXCEL_ICON} alt="icon excel" />
              <Typography
                ml={'15px'}
                fontSize={'14px'}
                color={palette.primary.hint}
              >
                Filename.XML
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'}>
              <img
                src={CHECK_ICON}
                alt="icon check success"
                style={{ marginRight: '15px' }}
              />
              <img
                src={TRASH_ICON}
                style={{ cursor: 'pointer' }}
                alt="icon trash"
                onClick={onchangeStatusEMP}
              />
            </Box>
          </Box>
        </Box>,
      );
    }
    return view;
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ mt: '30px', mb: '20px' }}>
        <Divider />
        <Box display={'flex'} sx={{ alignItems: 'center', mt: '12px' }}>
          <Typography
            fontSize={'20px'}
            fontWeight={700}
            lineHeight={'24px'}
            color={palette.primary.button}
          >
            Upload danh sách giao dịch
          </Typography>
          <Typography
            fontSize={'16px'}
            fontWeight={400}
            fontStyle={'italic'}
            lineHeight={'19px'}
            ml={'21px'}
            color={palette.primary.hint}
          >
            Vui lòng tải lên danh sách giao dịch để thực hiện chia hoa hồng
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mt: '16px' }}>
          {renderBoxStatus()}

          <Box ml={'45px'}>
            <Typography
              fontSize={'16px'}
              fontWeight={700}
              color={palette.primary.text}
            >
              Lưu ý:
            </Typography>
            <Typography
              fontSize={'16px'}
              display={'list-item'}
              ml={'20px'}
              lineHeight={'32px'}
              color={palette.primary.text}
            >
              File upload có định dạng xml. Đúng định dạng theo template mẫu
            </Typography>
            <Typography
              fontSize={'16px'}
              display={'list-item'}
              lineHeight={'32px'}
              ml={'20px'}
              color={palette.primary.text}
            >
              Dung lượng không quá 5Mb
            </Typography>
            <Typography
              display={'list-item'}
              fontSize={'16px'}
              lineHeight={'32px'}
              ml={'20px'}
              color={palette.primary.text}
            >
              Chưa có template? Tải{' '}
              <Link
                style={{ color: 'transparent' }}
                to={'/static/template/template_HoaHong.xlsx'}
                download="template_HoaHong"
                target="_blank"
              >
                <span
                  style={{
                    textDecoration: 'underline',
                    color: palette.primary.highlight,
                    cursor: 'pointer',
                  }}
                >
                  tại đây
                </span>
              </Link>
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: '20px' }} />
      </Box>
      <Typography
        fontSize={'20px'}
        fontWeight={700}
        lineHeight={'24px'}
        color={palette.primary.button}
      >
        Thông tin chia hoa hồng
      </Typography>
      <ListUploadComisstions comissionUploadList={comissionUploadList} />
    </Paper>
  );
}
