import { Box, Button, List, ListItem, Typography } from '@mui/material';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import palette from 'styles/theme/palette';
import { CreateIndirectUnit, CreateSalesUnit } from 'types/Comisstion';
import { CustomerType } from 'types/Enum';

interface Props {
  dataList: any;
  type: string;
  handleRemove: (index: number) => void;
  handleOpen: (items: any) => void;
}

export default function ItemComisstionSales(props: Props) {
  const { dataList, type, handleRemove, handleOpen } = props;

  const renderEmpty = (type: string) => {
    let text = 'Chưa có đơn vị bán hàng';
    if (type === CustomerType.SALES) {
      text = 'Chưa có đơn vị bán hàng';
    } else {
      text = 'Chưa có đơn vị gián tiếp';
    }
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '250px',
        }}
      >
        <Typography
          sx={{ fontWeight: 400, fontSize: '14px', color: '#AFAFAF' }}
        >
          {text}
        </Typography>
      </Box>
    );
  };

  if (dataList.length === 0) return renderEmpty(type);
  return (
    <Box
      sx={{
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        overflow: 'auto',
        maxHeight: '220px',
        position: 'relative',
        padding: '0px 20px',
      }}
    >
      {dataList?.map((item: any, index: number) => (
        <Box
          sx={{
            background: '#FDEAF4',
            width: { sm: '155px' },
            mb: '8px',
            borderRadius: '8px',
            display: 'flex',
            mr: index % 2 === 0 ? '16px' : '0px',
          }}
        >
          <Button
            style={{
              padding: '13px 0px 13px 18px',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'baseline',
            }}
            onClick={() => handleOpen(item)}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                color: palette.common.black,
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                textAlign: 'left',
              }}
            >
              {item.name}
            </Typography>
          </Button>
          <Box
            onClick={() => handleRemove(index)}
            style={{
              padding: '0px 13px',
              justifyContent: 'center',
              borderLeft: '1px solid #fff',
              cursor: 'pointer',
              height: '75%',
              alignSelf: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <img src={CLOSE_ICON} width={18} height={18} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
