import { Box, Typography } from '@mui/material';

export default function WebViewIntroduce() {
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography
        sx={{
          fontWeight: 700,
          color: '#1E1E1E',
          fontSize: 16,
          fontFamily: 'Inter',
        }}
      >
        1. Giới thiệu
      </Typography>
      <Typography>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum
      </Typography>
      <Typography
        sx={{
          mt: 2,
          fontWeight: 700,
          color: '#1E1E1E',
          fontSize: 16,
          fontFamily: 'Inter',
        }}
      >
        2. Đặc quyền cùng CT Lotus
      </Typography>
      <Typography>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum
      </Typography>
    </Box>
  );
}
