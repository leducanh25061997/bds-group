import { Box, Stack, Typography, useTheme } from '@mui/material';
import EXEL_ICON from 'assets/background/exel-icon.svg';
import PDF_ICON from 'assets/background/pdf-icon.svg';
import DOC_ICON from 'assets/background/doc-icon.svg';

interface Props {
  title: string;
  description?: string | number | null;
  border?: boolean;
  attachFile?: boolean;
}

const BoxContent = (props: Props) => {
  const theme = useTheme();
  const { title, description, border, attachFile } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '12px 0',
        borderBottom: border ? `1px solid #ccc` : 'none',
        color: theme.palette.primary.light,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Box sx={{ flex: '1' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: { sm: '1', md: '0.5', lg: '1' },
          marginTop: { xs: '10px', sm: '0px' },
        }}
      >
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {description}
        </Typography>
        {attachFile && (
          <Stack mt={3} direction="column" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                border: '1px solid #ccc',
                width: 'fit-content',
                padding: '2px 4px',
                alignItems: 'center',
              }}
            >
              <img src={EXEL_ICON} alt="file-icon"></img>
              <Typography
                sx={{
                  marginLeft: '8px',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '16px',
                }}
              >
                Quy hoạch chi tiết 1/500.xlsx
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                border: '1px solid #ccc',
                width: 'fit-content',
                padding: '2px 4px',
                alignItems: 'center',
              }}
            >
              <img src={DOC_ICON} alt="file-icon"></img>
              <Typography
                sx={{
                  marginLeft: '8px',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '16px',
                }}
              >
                Deposit cont…contract (1).doc
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                border: '1px solid #ccc',
                width: 'fit-content',
                padding: '2px 4px',
                alignItems: 'center',
              }}
            >
              <img src={PDF_ICON} alt="file-icon"></img>
              <Typography
                sx={{
                  marginLeft: '8px',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '16px',
                }}
              >
                Giấy CN quyền SDĐ.pdf
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default BoxContent;
