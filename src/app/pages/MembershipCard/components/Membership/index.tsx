import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import { translations } from 'locales/translations';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FilterParams, TableHeaderProps } from 'types';
import { Status, TypeCardEnum } from 'types/Enum';

import RenderStatus from 'app/components/RenderStatus';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useCityStarSlice } from 'app/pages/CityStar/slice';
import { selectCityStar } from 'app/pages/CityStar/slice/selector';
import { PayloadPostCodeGenerate } from 'app/pages/CityStar/slice/types';
import QRCODE_ICON from 'assets/background/ic-qrcode.svg';
import dayjs, { Dayjs } from 'dayjs';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';
import { MembershipItem } from 'types/CityStar';
import { RenderTitleMembershipCard, formatDateTime2 } from 'utils/helpers';
import CreateMembershipDialog from '../CreateMembershipDialog';
import ViewImageDialog from 'app/components/ViewImageDialog';
import FilterBar from 'app/components/Filterbar';

export type OpenFromParent = {
  openFromParent: () => void;
};

type Props = {};

const Membership = forwardRef<OpenFromParent, Props>((props, ref) => {
  const { actions } = useCityStarSlice();
  const navigate = useNavigate();
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CityStarManagement, isLoading } = useSelector(selectCityStar);

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenImageDialog, setIsOpenImageDialog] = useState<boolean>(false);
  const [qrcode, setQrcode] = useState<string>('');
  const [listMembershipCard, setMembershipCard] = useState<MembershipItem[]>(
    [],
  );

  const {
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm();
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'stt',
        label: 'STT',
        align: 'center',
        width: 60,
      },
      {
        id: 'code',
        label: 'Mã thẻ thành viên',
        align: 'left',
        width: 150,
      },
      {
        id: 'card_type',
        label: 'Loại thẻ',
        width: 110,
        align: 'center',
      },
      {
        id: 'qr_code',
        label: 'Mã QR',
        width: 110,
        align: 'left',
      },
      {
        id: 'date_start',
        label: 'Ngày tạo',
        width: 130,
        align: 'left',
      },
      {
        id: 'date_upadte',
        label: 'Ngày cập nhật',
        width: 130,
        align: 'left',
      },
      {
        id: 'expiration',
        label: 'Hạn sử dụng',
        width: 130,
        align: 'left',
      },
      {
        id: 'usage_status',
        label: 'Tình trạng sử dụng',
        width: 150,
        align: 'center',
      },
    ],
    [t],
  );

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListCityStar(params));
  };

  const handleRequestSort = (event: any, property: string) => {
    onFilterToQueryString({
      ...filter,
      sortByName: filter?.sortByName === 'true' ? 'false' : 'true',
    });
  };

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };

  const handleSubmitDialog = async () => {
    if (listMembershipCard.length > 0) {
      const columns = [
        { header: 'Mã thẻ', key: 'code' },
        { header: 'Loại thẻ', key: 'typeCard' },
        { header: 'Link', key: 'linkDowloadQrCode' },
        { header: 'Hạn thẻ', key: 'expiryDate' },
      ];

      const workbook = new Excel.Workbook();
      try {
        const fileName = 'CityStar';
        const worksheet = workbook.addWorksheet('Sheet-1');
        worksheet.columns = columns;
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((column: any) => {
          column.width = column.header.length + 10;
          column.alignment = { horizontal: 'center' };
        });

        listMembershipCard.forEach(singleData => {
          worksheet.addRow(singleData);
        });

        worksheet.eachRow({ includeEmpty: false }, (row: any) => {
          const currentCell = row._cells;

          currentCell.forEach((singleCell: any) => {
            const cellAddress = singleCell._address;

            worksheet.getCell(cellAddress).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });

        const buf = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buf]), `${fileName}.xlsx`);
        handleCloseDialog();
      } catch (error) {
        console.error('<<<ERRROR>>>', error);
      } finally {
        workbook.removeWorksheet('Sheet-1');
      }
    }
    const count = parseInt(watch('count'));
    const typeCard = watch('typeCard');

    const payloadActiveMembership: PayloadPostCodeGenerate = {
      count,
      typeCard,
    };

    dispatch(
      actions.postCodeGenerate(payloadActiveMembership, (err?: any) => {
        if (err?.success && err?.response) {
          setMembershipCard(err?.response?.data);
        } else {
          handleCloseDialog();
          let message = err?.response?.data?.message;
          dispatch(
            snackbarActions.updateSnackbar({
              message: message || 'Tạo mã thẻ không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseImageDialog = () => {
    setIsOpenImageDialog(false);
  };

  const handleOpenImageDialog = (qrcode: string) => {
    setQrcode(qrcode);
    setIsOpenImageDialog(true);
  };

  useImperativeHandle(ref, () => ({
    openFromParent() {
      handleOpenDialog();
    },
  }));

  const handleCloseDialog = () => {
    setMembershipCard([]);
    setValue('typeCard', '');
    setValue('count', '');
    setIsOpenDialog(false);
  };

  const renderItem = (item: MembershipItem, index: number) => {
    return [
      <EllipsisText text={`${index + 1}`} line={1} />,
      <EllipsisText text={`${item?.code}`} line={1} color={'#007AFF'} />,
      <EllipsisText
        text={`${RenderTitleMembershipCard(item.typeCard)}`}
        line={1}
      />,
      <IconButton onClick={() => handleOpenImageDialog(item?.qrCode)}>
        <img src={QRCODE_ICON} />
      </IconButton>,
      <EllipsisText text={`${formatDateTime2(item.createdAt)}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.updatedAt)}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.expiryDate)}`} line={1} />,
      <RenderStatus status={item.isActive ? Status.USED : Status.NOTUSED} />,
    ];
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
    });
  };

  const cardTypeSource = useMemo(() => {
    return [
      {
        id: 1,
        key: 'Bạc',
        value: TypeCardEnum.SIVER,
      },
      {
        id: 2,
        key: 'Vàng',
        value: TypeCardEnum.GOLD,
      },
      {
        id: 3,
        key: 'Kim Cương',
        value: TypeCardEnum.DIAMOND,
      },
      {
        id: 4,
        key: 'Bạch Kim',
        value: TypeCardEnum.PLATINUM,
      },
      {
        id: 5,
        key: 'Đối Tác',
        value: TypeCardEnum.PARTNER,
      },
      {
        id: 6,
        key: 'Đại Sứ',
        value: TypeCardEnum.AMBASSADOR,
      },
    ];
  }, []);

  const filterList = useMemo(() => {
    return [
      {
        label: 'Tình trạng sử dụng',
        options: [
          {
            label: 'Chọn tình trạng',
            value: '',
          },
          {
            label: 'Đang sử dụng',
            value: Status.ACTIVE,
          },
          {
            label: 'Chưa sử dụng',
            value: Status.INACTIVE,
          },
        ],
        handleSelected: (value: any) => {
          setFilterSelect({
            ...filterSelect,
            isActive: value === Status.ACTIVE,
          });
        },
      },
      {
        label: 'Từ ngày',
        type: 'date',
        placeholder: 'Từ ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              startDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.startDate;
            setFilterSelect(filterSelect);
          }
        },
      },
      {
        label: '',
        type: 'date',
        placeholder: 'Đến ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              endDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.endDate;
            setFilterSelect(filterSelect);
          }
        },
      },
    ];
  }, [filterSelect]);

  const renderListMembershipCard = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography fontSize={'14px'} fontWeight={500} my={2}>
          Số mã được tạo: {listMembershipCard.length}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FEF4FA',
            height: '45px',
            borderRadius: '8px',
            px: 2,
            width: '100%',
          }}
        >
          <Box width="15%">
            <Typography fontSize={'14px'} fontWeight={700}>
              STT
            </Typography>
          </Box>
          <Box width="20%">
            <Typography fontSize={'14px'} fontWeight={700}>
              Loại thẻ
            </Typography>
          </Box>
          <Box width="45%">
            <Typography fontSize={'14px'} fontWeight={700}>
              Mã thẻ thành viên
            </Typography>
          </Box>
          <Box width="20%">
            <Typography fontSize={'14px'} fontWeight={700}>
              Mã QR
            </Typography>
          </Box>
        </Box>
        <Box style={{ height: '45vh', overflow: 'auto' }}>
          {listMembershipCard.map((item, index) => (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  width: '100%',
                }}
              >
                <Box width="15%">
                  <Typography fontSize={'14px'} fontWeight={400}>
                    {index + 1}
                  </Typography>
                </Box>
                <Box width="20%">
                  <Typography fontSize={'14px'} fontWeight={400}>
                    {item?.typeCard}
                  </Typography>
                </Box>
                <Box width="45%">
                  <Typography
                    fontSize={'14px'}
                    fontWeight={400}
                    color={'#007AFF'}
                  >
                    {item?.code}
                  </Typography>
                </Box>
                <Box
                  width="20%"
                  onClick={() => handleOpenImageDialog(item?.qrCode)}
                >
                  <IconButton>
                    <img src={QRCODE_ICON} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <FilterBar
        placeholder={t(translations.common.search)}
        isFilter
        filterList={filterList}
        submitFilter={submitFilter}
      />
      <Table
        headers={header}
        onRequestSort={handleRequestSort}
        renderItem={renderItem}
        items={CityStarManagement?.data}
        pageNumber={filter.page}
        totalElements={CityStarManagement?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
        fullHeight
      />
      {isOpenImageDialog && (
        <ViewImageDialog
          isOpen={isOpenImageDialog}
          handleClose={handleCloseImageDialog}
        >
          <img src={qrcode} style={{ height: '100%', width: '100%' }} />
        </ViewImageDialog>
      )}

      {isOpenDialog && (
        <CreateMembershipDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={listMembershipCard.length > 0 ? 'Tải mã thẻ' : 'Tạo mã'}
          hideCancelButton={!(listMembershipCard.length > 0)}
        >
          <Typography fontWeight={700} fontSize={'24px'}>
            Tạo mã thẻ thành viên CT Star
          </Typography>
          {listMembershipCard.length > 0 ? (
            renderListMembershipCard()
          ) : (
            <Stack flexDirection={'row'} mt={4} width={'100%'}>
              <Box width={'50%'}>
                <TextFieldCustom
                  placeholder="Chọn loại thẻ"
                  label="Loại thẻ"
                  isRequired
                  name="typeCard"
                  control={control}
                  errors={errors}
                  setError={setError}
                  type="select"
                  options={cardTypeSource}
                />
              </Box>
              <Box ml={2} width={'50%'}>
                <TextFieldCustom
                  placeholder="Nhập số lượng"
                  label="Số lượng tạo mã"
                  isRequired
                  name="count"
                  control={control}
                  format="number"
                  errors={errors}
                  setError={setError}
                  endAdornment={'Mã'}
                />
              </Box>
            </Stack>
          )}
        </CreateMembershipDialog>
      )}
    </Paper>
  );
});

export default Membership;
