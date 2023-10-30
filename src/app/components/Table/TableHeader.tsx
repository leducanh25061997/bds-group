// material
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  Select,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
  FormControl,
} from '@mui/material';
import DocumentIcon from 'assets/icons/documents.svg';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { isUndefined } from 'lodash';
import * as React from 'react';
import palette from 'styles/theme/palette';
import {
  TableHeaderConfigurationPopup,
  TableHeaderProps,
  TypeCheckBoxTable,
} from 'types';
// ----------------------------------------------------------------------

interface Props {
  rowCount: number;
  headLabel: TableHeaderProps[];
  numSelected: number;
  onRequestSort: (event: any, property: string) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  hasCheckbox?: boolean;
  headerBackgroundColor?: string;
  color?: string;
  onChangeHeaders?: (headers: TableHeaderProps[]) => void;
  onResetHeaders?: () => void;
  mainHeaders?: TableHeaderConfigurationPopup;
  sort: string[];
  isFilter?: boolean;
  filterList?: any[];
  onChecked?: (event: string) => void;
  countDisabledList?: number;
  typeCheckBox?: TypeCheckBoxTable;
  limitElement: number;
  isSelect?: boolean;
  selectList?: any[];
  handleSelectTable?: (value?: any) => void;
  defaultSelect?: string;
  selected?: any[];
  items?: any[];
  selectBy?: string;
}

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    right: 0,
    position: 'sticky',
    zIndex: 1200,
    padding: '0px 16px',
  },
}));

export default function TableHeader(props: Props) {
  const theme = useTheme();
  const {
    headLabel,
    rowCount,
    numSelected,
    onRequestSort,
    onSelectAllClick,
    hasCheckbox,
    headerBackgroundColor,
    isFilter,
    filterList,
    onChecked,
    countDisabledList = 4,
    // color,
    // onChangeHeaders,
    // mainHeaders,
    // onResetHeaders,
    sort,
    typeCheckBox,
    limitElement,
    isSelect,
    selectList,
    handleSelectTable,
    defaultSelect,
    selected,
    items,
    selectBy,
  } = props;
  const ref = React.useRef(null);
  const [isOpenFilter, setIsOpenFilter] = React.useState<boolean>(false);
  // const [open, setOpen] = React.useState(false);
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const onClose = () => {
  //   setOpen(false);
  // };
  const createSortHandler = (
    event: React.MouseEvent<HTMLElement>,
    property: string,
    hasSort?: boolean,
  ) => {
    // if (property === 'morevert') {
    //   setAnchorEl(event.currentTarget);
    //   setOpen(previousOpen => !previousOpen);
    // }
    if (hasSort) {
      onRequestSort(event, property);
    }
  };

  const isSelectedAll = () => {
    if (numSelected !== limitElement || numSelected === 0) {
      return false;
    }

    const key = selectBy || 'id';

    if (!items?.length || !selected?.length) {
      return false;
    }

    return items?.every(item => selected?.some(s => s[key] === item[key]));
  };

  const handleSelectAllClick = (event: any, checked: boolean) => {
    if (isSelectedAll()) {
      onSelectAllClick?.(event, false);
    } else {
      onSelectAllClick?.(event, true);
    }
  };
  return (
    <>
      <TableHead
        sx={{
          '& th:first-of-type': {
            borderRadius: '0.5rem 0 0 0.5rem',
          },

          '& th:last-of-type': {
            borderRadius: '0 0.5rem 0.5rem 0.5rem',
          },
          borderBottom: headerBackgroundColor ? '1px solid #E0E1E4' : '',
        }}
      >
        <TableRow>
          {hasCheckbox && (
            <TableCell sx={{ bgcolor: palette.primary.barList }}>
              {typeCheckBox === TypeCheckBoxTable.RADIO ? (
                <Radio checked={false} onClick={event => {}} />
              ) : (
                <Checkbox
                  color="success"
                  disabled={countDisabledList >= rowCount}
                  checked={isSelectedAll()}
                  onChange={handleSelectAllClick}
                />
              )}
            </TableCell>
          )}
          {headLabel.map((headCell: TableHeaderProps) => {
            const currentSort = sort.find(
              s => s && s.split(' ')[0] === headCell.id,
            );
            const sortType = currentSort
              ? (currentSort.split(' ')[1] as any)
              : 'desc';
            const sortBy = currentSort ? currentSort.split(' ')[0] : '';
            if (isUndefined(headCell.isShow) || headCell.isShow) {
              if (headCell.isFixed) {
                return (
                  <StickyTableCell
                    key={headCell.id}
                    style={{
                      minWidth: headCell.width,
                      background:
                        headerBackgroundColor || palette.primary.barList,
                      color: palette.primary.text,
                      whiteSpace: headCell.hasNotWrap ? 'nowrap' : 'normal',
                      zIndex: headCell.position && 999,
                      left: headCell.left || 0,
                      fontSize: '14px',
                      fontWeight: '600px',
                      borderBottom: 0,
                    }}
                    align={headCell.align}
                  >
                    {headCell.label}
                  </StickyTableCell>
                );
              }
              return (
                <TableCell
                  key={headCell.id}
                  sortDirection={sortBy === headCell.id ? sortType : false}
                  style={{
                    minWidth: headCell.width,
                    background:
                      headerBackgroundColor || palette.primary.barList,
                    color: palette.primary.text,
                    whiteSpace: headCell.hasNotWrap ? 'nowrap' : 'normal',
                    zIndex: headCell.position && 999,
                    left: headCell.left || 0,
                    fontSize: '14px',
                    fontWeight: '600px',
                    borderBottom: 0,
                  }}
                  align={headCell.align}
                >
                  {headCell.isSelect ? (
                    <FormControl
                      sx={{
                        width: '100%',
                        '& .MuiSelect-select': {
                          width: '100%',
                          //180px
                          // width: { xs: '100%', sm: '12.500vw' },
                          fontSize: '16px',
                          border: '1px solid rgb(254, 244, 250)',
                          borderRadius: '8px',
                          fontWeight: 700,
                        },
                        '& .MuiFormLabel-root': {
                          display: 'none',
                        },
                        '& .MuiInputBase-root': {
                          borderRadius: '0px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    >
                      <Select
                        displayEmpty
                        onChange={handleSelectTable}
                        defaultValue={selectList && selectList[0]?.value}
                        value={
                          selectList &&
                          selectList.filter(
                            item => item.value === defaultSelect,
                          )[0].id
                        }
                        IconComponent={() => (
                          <>
                            <KeyboardArrowDownIcon
                              sx={{
                                position: 'absolute',
                                right: 10,
                                cursor: 'pointer',
                                fontSize: '20px',
                              }}
                            />
                          </>
                        )}
                      >
                        {selectList &&
                          selectList.length > 0 &&
                          selectList?.map(item => (
                            <MenuItem
                              sx={{
                                fontSize: '14px',
                                height: '30px',
                                color: 'black',
                                fontWeight: '400',
                                m: '3px',
                                '&.Mui-selected': {
                                  backgroundColor: '#FDEAF4',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                },
                              }}
                              key={item.label}
                              value={item.id}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TableSortLabel
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          color: headCell.hasSort
                            ? palette.primary.button[600]
                            : palette.primary.button[0],
                        },
                        '&:focus': {
                          color: headCell.hasSort
                            ? palette.primary.button[600]
                            : palette.primary.button[0],
                        },
                      }}
                      hideSortIcon={!headCell.hasSort}
                      direction={sortBy === headCell.id ? sortType : 'desc'}
                      active={sortBy === headCell.id && headCell.hasSort}
                      onClick={event =>
                        createSortHandler(event, headCell.id, headCell.hasSort)
                      }
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                  {headCell.subLable && (
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: '14px',
                        // fontStyle: 'italic',
                        color: '#7A7A7A',
                      }}
                    >
                      {headCell.subLable}
                    </Typography>
                  )}
                </TableCell>
              );
            }
            return null;
          })}

          {isFilter && filterList && (
            <TableCell
              sx={{
                bgcolor: theme.palette.primary.lighter,
                minWidth: '50px',
                textAlign: 'right',
              }}
            >
              <TableSortLabel hideSortIcon={true}>
                <img
                  ref={ref}
                  className="mr-1"
                  src={DocumentIcon}
                  alt="document-icon"
                  onClick={() => {
                    setIsOpenFilter(true);
                  }}
                />
                <Menu
                  open={isOpenFilter}
                  anchorEl={ref.current}
                  onClose={() => setIsOpenFilter(false)}
                  PaperProps={{
                    sx: { maxWidth: '100%' },
                  }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {filterList?.map((item, index) => (
                    <MenuItem
                      key={item?.id}
                      sx={{ color: 'text.secondary' }}
                      disabled={index < countDisabledList}
                    >
                      <ListItemIcon>
                        <Checkbox
                          onChange={() => {
                            onChecked?.(item.target);
                          }}
                          checked={item.display}
                          disabled={index < countDisabledList}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.target}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </TableSortLabel>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
    </>
  );
}
