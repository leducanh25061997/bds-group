import {
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FEF4FA',
    color: '#1E1E1E',
    padding: '2px',
    fontSize: 12,
  },
  [`&.${tableCellClasses.head}:first-child`]: {
    backgroundColor: '#FFD9EA',
    maxWidth: '80px',
    minWidth: '70px',
    width: '100px',
    fontSize: 14,
    fontWeight: 600,
    color: '#000'
  },
  [`&.${tableCellClasses.head}:last-child`]: {
    width: '40px',
  },
}));

interface Props {
  activeTab?: string;
  quanlityProduct: string[];
}

export const TableHeadComponent = ({ activeTab, quanlityProduct }: Props) => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell align="center">{activeTab}</StyledTableCell>
        {quanlityProduct.map((item: string) => (
          <StyledTableCell key={item} align="center" width="100px">
            {item}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
