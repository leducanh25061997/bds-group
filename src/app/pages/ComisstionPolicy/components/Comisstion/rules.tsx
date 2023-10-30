import { Box, Button, List, ListItem, Typography } from '@mui/material';
import CLOSE_ICON from 'assets/background/close-button-icon.svg';
import palette from 'styles/theme/palette';
import { CustomerType } from 'types/Enum';

interface Props {
  dataList: any;
  type: string;
}

export default function ItemComisstionRules(props: Props) {
  const { dataList, type } = props;

  return (
    <Box
      sx={{
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        overflow: 'auto',
        maxHeight: '220px',
        position: 'relative',
        padding: '0px 24px',
      }}
    ></Box>
  );
}
