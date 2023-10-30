import { Box, Typography } from '@mui/material';

export default function WebViewProvise() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        sx={{
          fontWeight: 700,
          color: '#1E1E1E',
          fontSize: 16,
          fontFamily: 'Inter',
        }}
      >
        1. Điều khoản sử dụng
      </Typography>
      <Typography>
        Quyền được phép sử dụng CT Lotus và Dịch Vụ có hiệu lực cho đến khi bị
        chấm dứt. Quyền được phép sử dụng sẽ bị chấm dứt theo Điều Khoản Dịch Vụ
        này hoặc trường hợp Người Sử Dụng vi phạm bất cứ điều khoản hoặc điều
        kiện nào được quy định tại Điều Khoản Dịch Vụ này. Trong trường hợp đó,
        CT Lotus có thể chấm dứt việc sử dụng của Người Sử Dụng bằng hoặc không
        cần thông báo. Người Sử Dụng chấp thuận và đồng ý rằng CT Lotus có thể
        truy cập, duy trì và tiết lộ thông tin Tài Khoản của Người Sử Dụng trong
        trường hợp pháp luật có yêu cầu hoặc theo lệnh của tòa án hoặc cơ quan
        chính phủ hoặc cơ quan nhà nước có thẩm quyền yêu cầu CT Lotus hoặc
        những nguyên nhân khác theo quy định pháp luật:
        <li>(a) tuân thủ các thủ tục pháp luật;</li>{' '}
        <li>(b) thực thi Điều Khoản Dịch Vụ;</li>{' '}
        <li>
          (c) phản hồi các khiếu nại về việc Nội Dung xâm phạm đến quyền lợi của
          bên thứ ba;
        </li>{' '}
        <li>
          (d) phản hồi các yêu cầu của Người Sử Dụng liên quan đến chăm sóc
          khách hàng; hoặc
        </li>{' '}
        <li>
          (e) bảo vệ các quyền, tài sản hoặc an toàn của CT Lotus, Người Sử Dụng
          và/hoặc cộng đồng.
        </li>
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
        2. Vi phạm điều khoản dịch vụ
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
