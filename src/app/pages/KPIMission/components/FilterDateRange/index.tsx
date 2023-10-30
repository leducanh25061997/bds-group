import React from 'react';
import {
  FormControl,
  SelectChangeEvent,
  TextField,
  IconButton,
  Box,
  Select,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import DateAdapter from '@mui/lab/AdapterDayjs';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import palette from 'styles/theme/palette';
import MuiDateRangePickerDay from '@mui/lab/DateRangePickerDay';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import MenuPopover from 'app/components/MenuPopover';
import { useSafeState } from 'app/hooks/useSafeState';

interface OptionType {
  label: string;
  value: string;
  getValue?: any;
}

interface Props {
  list: OptionType[];
  handleSelected?: (value: string | any) => void;
  field?: string;
  label?: string;
  isIcon?: boolean;
  iconURL?: string;
  valueSelected?: string;
  type?: string;
  handleRemove?: () => void;
  placeholder?: string;
}

const DateRangePickerDay = styled(MuiDateRangePickerDay)(
  ({ theme, isHighlighting, isStartOfHighlighting, isEndOfHighlighting }) => ({
    ...(isHighlighting && {
      borderRadius: 0,
      backgroundColor: palette.primary.lightRed,
      //   color: theme.palette.common.white,
      '&:hover, &:focus': {
        backgroundColor: palette.primary.darkRed,
        borderRadius: '50%',
      },
    }),
    ...(isStartOfHighlighting && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(isEndOfHighlighting && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
    ...{
      '& .Mui-selected': {
        color: `${palette.common.white} !important`,
        backgroundColor: `${palette.primary.darkRed} !important`,
      },
      '& .MuiButtonBase-root': {
        color: palette.common.black,
      },
    },
  }),
);

export enum CurrentFilter {
  PREV_WEEK = 'prev_week',
  CURRENT_WEEK = 'week',
  MONTH = 'month',
  QUARTER_YEAR = 'quarter_year',
  DAY = 'day',
}

export default function FilterDateRange(props: Props) {
  const {
    list,
    handleSelected,
    label,
    isIcon,
    iconURL,
    valueSelected,
    type,
    field,
    handleRemove,
    placeholder,
  } = props;
  const [valuesFilterCur, setValuesFilterCur] = React.useState<CurrentFilter>(
    CurrentFilter.DAY,
  );
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);
  const [inputProp, setInputProp] = React.useState<string>('');
  const anchorRef = React.useRef(null);
  const [open, setOpen] = useSafeState<boolean>(false);

  const handleChange = (event: SelectChangeEvent) => {
    handleSelected?.(event.target.value);
  };
  const handleRemoveValue = () => {
    handleRemove && handleRemove();
  };
  const handleResetRange = () => {
    setValue([null, null]);
    setInputProp('');
    handleClose();
    handleSelected?.({ type: '', value: '' });
  };

  const renderWeekPickerDay = (date: any, dateRangePickerDayProps: any) => {
    return <DateRangePickerDay {...dateRangePickerDayProps} />;
  };

  React.useEffect(() => {
    let stringInput = '';
    if (value?.[0]) {
      stringInput = value?.[0].format('DD/MM/YYYY') + ' - ';
    }
    if (value?.[1]) {
      stringInput += value?.[1].format('DD/MM/YYYY');
    }
    setInputProp(stringInput);
    if (value?.[0] && value?.[1]) {
      handleSelected?.({ type: valuesFilterCur, value });
    }
  }, [value]);

  const renderFragmentDatePicker = () => {
    return (
      <Box
        sx={{
          padding: '10px 0px',
        }}
      >
        <FormControl
          sx={{
            width: {
              xs: '96vw',
              sm: '300px',
            },
            '& .MuiInputBase-root': {
              height: '45px',
              background: palette.common.white,
            },
            '>div': {
              background: 'unset',
            },
          }}
        >
          <LocalizationProvider dateAdapter={DateAdapter}>
            <StaticDateRangePicker //DateRangePicker
              displayStaticWrapperAs="desktop"
              open={true}
              calendars={1}
              startText=""
              endText=""
              inputFormat="DD/MM/YYYY"
              value={value}
              onChange={newValue => {
                if (newValue[0] && newValue[1]) {
                  const param: any = {
                    start_date: newValue[0]?.format('YYYY-MM-DD'),
                    end_date: newValue[1]?.format('YYYY-MM-DD'),
                  };
                }
                setValue(newValue);
                setValuesFilterCur(CurrentFilter.DAY);
              }}
              // disableHighlightToday
              renderDay={renderWeekPickerDay}
              renderInput={({ inputProps, ...startProps }, endProps) => {
                const startValue = inputProps?.value;
                delete inputProps?.value;
                // setInputProp(
                //   startValue || endProps?.inputProps?.value
                //     ? `${startValue} - ${endProps?.inputProps?.value}`
                //     : '',
                // );
                return (
                  <TextField
                    {...startProps}
                    inputProps={inputProps}
                    value={
                      startValue || endProps?.inputProps?.value
                        ? `${startValue} - ${endProps?.inputProps?.value}`
                        : ''
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleResetRange}>
                          <Icon
                            icon="eva:close-fill"
                            width="24px"
                            height="24px"
                          />
                        </IconButton>
                      ),
                    }}
                  />
                );
              }}
            />
          </LocalizationProvider>
        </FormControl>
      </Box>
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        '& .MuiFormControl-root .MuiInputBase-root': {
          padding: '9px 12px 9px 12px',
          width: '100%',
          minWidth: '200px',
          fontSize: '14px',
          color: '#3D423C',
          backgroundColor: '#fff',
          border: '1px solid #D3D3D3',
          borderRadius: '8px',
          height: '43px',
          '& >input': {
            ml: '8px',
            maxWidth: '150px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        },
      }}
    >
      <TextField
        ref={anchorRef}
        onClick={handleOpen}
        defaultValue={inputProp}
        value={inputProp}
        placeholder={placeholder}
        InputProps={{
          endAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {inputProp && (
                <IconButton onClick={handleResetRange} sx={{ padding: '4px' }}>
                  <Icon icon="eva:close-fill" width="20px" height="20px" />
                </IconButton>
              )}
              <Box
                sx={{
                  ml: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <Icon icon="mingcute:down-line" width="18" />
              </Box>
            </Box>
          ),
          startAdornment: isIcon && (
            <img
              src={iconURL}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
              }}
            />
          ),
        }}
      />

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 'max-content' }}
        hiddenArrowStyle
      >
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              margin: '8px',
              background: palette.primary.lightRed,
              borderRadius: '8px',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
              {list?.map((e, i) => (
                <Button
                  key={i}
                  variant="text"
                  sx={{
                    ml: '8px',
                    pl: '8px',
                    borderBottomRightRadius: '0px',
                    borderTopRightRadius: '0px',
                    color: palette.common.black,
                    fontWeight: 400,
                    background:
                      (e.value as CurrentFilter) === valuesFilterCur
                        ? palette.common.white
                        : 'unset',
                  }}
                  onClick={() => {
                    setValuesFilterCur(e.value as CurrentFilter);
                    if (e?.getValue) {
                      setValue([e?.getValue()?.[0], e?.getValue()?.[1]]);
                    } else {
                      setValue([null, null]);
                    }
                  }}
                >
                  {e.label}
                </Button>
              ))}
            </Box>
          </Box>
          {renderFragmentDatePicker()}
        </Box>
      </MenuPopover>
    </Box>

    // <Select
    //   displayEmpty
    //   onChange={handleChange}
    //   defaultValue={inputProp}
    //   value={inputProp}
    //   sx={{
    //     '& .MuiSelect-select': {
    //       paddingRight: '50px !important',
    //     },
    //   }}
    //   IconComponent={() => (
    //     <>
    //       {value && (
    //         <Box
    //           sx={{
    //             position: 'absolute',
    //             right: 30,
    //             cursor: 'pointer',
    //             fontSize: '20px',
    //           }}
    //           onClick={() => handleRemoveValue()}
    //         >
    //           <Icon icon="mdi:remove" color="#d6465f" width="18" />
    //         </Box>
    //       )}
    //       <Box
    //         sx={{
    //           position: 'absolute',
    //           right: 10,
    //           cursor: 'pointer',
    //           // fontSize: '20px',
    //         }}
    //       >
    //         <Icon icon="mingcute:down-line" width="18" />
    //       </Box>
    //       {isIcon && (
    //         <img
    //           src={iconURL}
    //           style={{
    //             position: 'absolute',
    //             left: 10,
    //             cursor: 'pointer',
    //             fontSize: '20px',
    //           }}
    //         />
    //       )}
    //     </>
    //   )}
    // >
    //   <Box sx={{ display: 'flex' }}>
    //     <Box
    //       sx={{
    //         margin: '8px',
    //         background: palette.primary.lightRed,
    //         borderRadius: '8px',
    //       }}
    //     >
    //       <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
    //         {list?.map((e, i) => (
    //           <Button
    //             key={i}
    //             variant="text"
    //             sx={{
    //               ml: '8px',
    //               pl: '8px',
    //               borderBottomRightRadius: '0px',
    //               borderTopRightRadius: '0px',
    //               color: palette.common.black,
    //               fontWeight: 400,
    //               background:
    //                 (e.value as CurrentFilter) === valuesFilterCur
    //                   ? palette.common.white
    //                   : 'unset',
    //             }}
    //             onClick={() => {
    //               setValuesFilterCur(e.value as CurrentFilter);
    //               if (e?.getValue) {
    //                 setValue([e?.getValue()?.[0], e?.getValue()?.[1]]);
    //               } else {
    //                 setValue([null, null]);
    //               }
    //             }}
    //           >
    //             {e.label}
    //           </Button>
    //         ))}
    //       </Box>
    //     </Box>
    //     {renderFragmentDatePicker()}
    //   </Box>
    // </Select>
  );
}
