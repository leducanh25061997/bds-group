import { Box } from '@mui/material';
import { StatusProductEnum, StatusProductCorlorEnum } from 'types/Enum';

interface Status {
  background: StatusProductCorlorEnum;
  name: StatusProductEnum;
}

export const RenderStatus = () => {
  const data: Status[] = [
    {
      background: StatusProductCorlorEnum.OPEN,
      name: StatusProductEnum.OPEN,
    },
    {
      background: StatusProductCorlorEnum.SIGN_UP,
      name: StatusProductEnum.SIGN_UP,
    },
    {
      background: StatusProductCorlorEnum.BOOKING,
      name: StatusProductEnum.BOOKING,
    },
    {
      background: StatusProductCorlorEnum.WAIT_FILE,
      name: StatusProductEnum.WAIT_FILE,
    },
    {
      background: StatusProductCorlorEnum.SOLD_OUT,
      name: StatusProductEnum.SOLD_OUT,
    },
  ];
  return (
    <Box
      sx={{
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        background: '#FFF',
        borderRadius: '8px',
        maxHeight: '38px',
        padding: '6px 12px',
        display: 'flex',
        color: '#1E1E1E',
        fontSize: '12px',
      }}
    >
      {data.map((item: Status, index: number) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', ml: index > 0 ? 1 : 0 }}
        >
          <Box
            sx={{
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              background: item.background,
            }}
          ></Box>
          <Box ml={1}>{item.name}</Box>
        </Box>
      ))}
    </Box>
  );
};
