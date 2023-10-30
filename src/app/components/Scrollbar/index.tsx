// material
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  height: '100%',
  // overflowY: 'scroll',
});

interface Props {
  children?: React.ReactNode;
  sx?: object;
  [prop: string]: any;
}

export default function Scrollbar(props: Props) {
  const { children, sx, ...other } = props;

  return (
    <RootStyle {...other} sx={{ ...sx }}>
      {children}
    </RootStyle>
  );
}
