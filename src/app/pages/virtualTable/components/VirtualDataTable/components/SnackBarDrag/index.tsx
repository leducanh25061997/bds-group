import { Box, Snackbar, styled } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { Product } from 'types/ProductTable';
import GIFT_ICON from 'assets/icons/gift-icon.svg';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: '#FFFFFF',
    border: '1px solid #D6465F',
    color: '#D6465F',
    width: 'max-content',
  },
}));

interface SnackBarDragProps {
  openSnackbar: boolean;
  itemSelectedDrag: Product[];
  handleClick: (v: Product[]) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const SnackBarDrag = ({
  openSnackbar,
  handleClick,
  handleDrop,
  handleDragOver,
  itemSelectedDrag,
}: SnackBarDragProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={openSnackbar}
      sx={{
        '& .MuiSnackbarContent-root': {
          background:
            'linear-gradient(143.72deg, #D6465F 15.94%, #FF8CA0 98.27%)',
          borderRadius: '25px',
        },
      }}
      key={'bottom' + 'right'}
    >
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => itemSelectedDrag.length > 0 && handleClick(itemSelectedDrag)}
        sx={{
          cursor: 'pointer',
          background:
            'linear-gradient(143.72deg, #D6465F 15.94%, #FF8CA0 98.27%)',
          borderRadius: '9999px',
          display: 'flex',
          padding: '6px 12px',
        }}
      >
        <Box>
          <StyledBadge badgeContent={itemSelectedDrag.length || 0}>
            <img src={GIFT_ICON} alt="Gift Icon" />
          </StyledBadge>
        </Box>
      </Box>
    </Snackbar>
  );
};
