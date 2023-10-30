import { Box, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { SubDataProtype } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { EllipsisText } from 'app/components/EllipsisText';
import TableContainer from '@mui/material/TableContainer';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FDEAF4',
    color: '#1E1E1E',
    padding: '8px 20px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.body} tr:last-child`]: {
    marginBottom: '10px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child': {
    marginBottom: '10px',
  },
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  '& td:first-child': {
    // backgroundColor: '#FEF4FA',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '20px',
    color: '#1E1E1E',
    padding: '8px 20px',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    borderBottom: '1px solid #B5BAC0',
    paddingBottom: '0px',
    // minHeight: '40px',
    minWidth: '60px',
    padding: '8px 20px',
  },
}));

const initialHeader = [
  {
    label: 'Mã sản phẩm',
    align: 'left',
  },
  {
    label: 'Block',
    align: 'left',
  },
  {
    label: 'Tầng',
    align: 'left',
  },
  {
    label: 'Ưu tiên 1',
    align: 'left',
    count: 0,
  },
  {
    label: 'Ưu tiên 2',
    align: 'left',
    count: 0,
  },
  {
    label: 'ưu tiên 3',
    align: 'left',
    count: 0,
  },
];

const PrioritiesList = ({ heightTable }: { heightTable: number }) => {
  const { apartmentInformation } = useSelector(selectApartmentInformation);
  const [list, setList] = useState<SubDataProtype[]>([]);
  const [headers, setHeader] = useState<any[]>(initialHeader);

  useEffect(() => {
    if (apartmentInformation && apartmentInformation.data) {
      const dataObj = apartmentInformation.data;
      const _data: any[] = [];
      (Object.keys(dataObj) as (keyof typeof dataObj)[]).forEach(
        (key, index) => {
          if (dataObj[key].length > 0) {
            _data.push(...dataObj[key]);
          }
        },
      );
      let countPriority1 = 0;
      let countPriority2 = 0;
      let countPriority3 = 0;
      for (let index = 0; index < _data.length; index++) {
        const element = _data[index];
        if (
          element.priorities &&
          element.priorities.filter(
            (element: { order: number }) => element.order === 1,
          )[0]?.customerName
        ) {
          countPriority1 += 1;
        }
        if (
          element.priorities &&
          element.priorities.filter(
            (element: { order: number }) => element.order === 2,
          )[0]?.customerName
        ) {
          countPriority2 += 1;
        }
        if (
          element.priorities &&
          element.priorities.filter(
            (element: { order: number }) => element.order === 3,
          )[0]?.customerName
        ) {
          countPriority3 += 1;
        }
      }

      const _header = [
        {
          label: 'Mã sản phẩm',
          align: 'left',
        },
        {
          label: 'Block',
          align: 'left',
        },
        {
          label: 'Tầng',
          align: 'left',
        },
        {
          label: `Ưu tiên 1`,
          align: 'left',
          count: countPriority1,
        },
        {
          label: `Ưu tiên 2`,
          align: 'left',
          count: countPriority2,
        },
        {
          label: `Ưu tiên 3`,
          align: 'left',
          count: countPriority3,
        },
      ];
      setHeader(_header);
      setList(_data);
    }
  }, [apartmentInformation]);

  const renderItem = (item: any) => {
    const priority1 =
      (item &&
        item.priorities &&
        item.priorities.filter(
          (item: { order: number }) => item.order === 1,
        )[0]) ||
      null;
    const priority2 =
      (item &&
        item.priorities &&
        item.priorities.filter(
          (item: { order: number }) => item.order === 2,
        )[0]) ||
      null;
    const priority3 =
      (item &&
        item.priorities &&
        item.priorities.filter(
          (item: { order: number }) => item.order === 3,
        )[0]) ||
      null;

    const RenderBorderBottom = (status: string) => {
      switch (status) {
        case 'RED':
          return `4px solid #D6465F`;
        case 'RED':
          return `4px solid #007AFF`;
        default:
          return `1px solid #B5BAC0`;
      }
    };

    return [
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'start',
        }}
      >
        <Box
          sx={{
            borderRadius: '4px',
            border: '1px solid #B5BAC0',
            width: 'max-content',
            padding: '4px 8px',
            borderBottom: RenderBorderBottom(item.colorPriority),
            // borderBottom: item.colorPriority === 'WHITE' ? '1px solid #B5BAC0' : `4px solid ${item.colorPriority}`,
          }}
        >
          {item.code}
        </Box>
      </Box>,
      <EllipsisText text={item.block} line={1} />,
      <EllipsisText text={item.floor} line={1} />,
      <Box sx={{ fontSize: '14px', lineHeight: '24px' }}>
        <Box sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '24px' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority1 && priority1?.ticket?.customers.length > 0
              ? priority1?.ticket.customers[0].mainCustomer.name
              : priority1?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority1?.ticket?.staff?.orgChart?.name || priority1?.saleUnitName}
        </Typography>
      </Box>,
      <Box sx={{ fontSize: '14px', lineHeight: '24px' }}>
        <Box sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '24px' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority2 && priority2?.ticket?.customers.length > 0
              ? priority2?.ticket.customers[0].mainCustomer.name
              : priority2?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority2?.ticket?.staff?.orgChart?.name || priority2?.saleUnitName}
        </Typography>
      </Box>,
      <Box sx={{ fontSize: '14px', lineHeight: '24px' }}>
        <Box sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '24px' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
            {priority3 && priority3?.ticket?.customers.length > 0
              ? priority3?.ticket.customers[0].mainCustomer.name
              : priority3?.customerName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {priority3?.ticket?.staff?.orgChart?.name || priority3?.saleUnitName}
        </Typography>
      </Box>,
    ];
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer
        sx={{
          maxHeight: heightTable ? `calc(${heightTable}px - 150px)` : 400,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headers.map((header: any) => {
                if (header.count && header.count > 0) {
                  return (
                    <StyledTableCell align="left">
                      {header.label}<span style={{ marginLeft: '2px', color: '#D6465F' }}>{`(${header.count})`}</span>
                    </StyledTableCell>
                  );
                }
                return (
                  <StyledTableCell align="left">{header.label}</StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item: SubDataProtype) => (
              <StyledTableRow key={item.id}>
                {renderItem(item).map((col, index) => {
                  return <StyledTableCell key={index}>{col}</StyledTableCell>;
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PrioritiesList;
