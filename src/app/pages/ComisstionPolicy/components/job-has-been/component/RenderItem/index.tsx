import { Box, Button, useTheme } from '@mui/material';

interface SubProps {
  title: string;
  value: number;
  type:
    | 'contractsPerformedInYheQuarter'
    | 'summaryOfPerformanceContracts'
    | 'targets';
  renderTable: (value: string) => void;
}

export function RenderItem(props: SubProps) {
  const theme = useTheme();
  const { title, value, type, renderTable } = props;

  return (
    <Box
      mt={2}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        background: theme.palette.secondary.lighter,
        color: theme.palette.secondary.contrastText,
        padding: '6px 24px',
      }}
    >
      <Box color={theme.palette.primary.light}>{title}</Box>
      <Button
        onClick={() => renderTable(type)}
        variant="text"
        sx={{
          padding: '0',
          '&:hover': {
            background: '#ffff',
          },
        }}
      >
        {value}
      </Button>
    </Box>
  );
}
