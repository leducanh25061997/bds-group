import { Close } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useStaffSlice } from 'app/pages/Staff/slice';
import { selectStaff } from 'app/pages/Staff/slice/selector';
import SelectSearch from 'app/pages/TransactionManagement/components/select-search';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/theme/palette';
import { FilterParams } from 'types';
import { StaffItem } from 'types/Staff';

import { selectProcessManagement } from '../slice/selector';

interface Props {
  nodesDetail: any;
  setNodesDetail: (nodesDetail: any) => void;
  nodes: any;
  setNodes: (nodes: any) => void;
  listStaffSelect: any;
  setListStaffSelect: (listStaffSelect: any) => void;
}

export function CreatePanel(props: Props) {
  const {
    nodesDetail,
    setNodesDetail,
    nodes,
    setNodes,
    listStaffSelect,
    setListStaffSelect,
  } = props;
  const [listEmp, setListEmp] = useState<any>();
  const dispatch = useDispatch();
  const { actions: staffSlice } = useStaffSlice();
  const { staffManagement } = useSelector(selectStaff);
  const { WorkFlowDetail } = useSelector(selectProcessManagement);
  const [staffSelected, setStaffSelected] = useState<any[]>([]);
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    setValue('name', nodesDetail[0]?.data.name);
    setListEmp(nodesDetail[0]?.data.staff);
  }, [nodesDetail]);

  useEffect(() => {
    const newNodeDetail = [...nodesDetail];
    setNodesDetail(newNodeDetail);
    const newListStaff: any[] = [];
    listStaffSelect.forEach((element: { staffSelect: any[] }) => {
      element.staffSelect.forEach((staff: any) => {
        newListStaff.push(staff);
      });
    });
    setStaffSelected(newListStaff);
  }, [listStaffSelect]);

  const handleChangeName = (value: string | number) => {
    const newNodeDetail = [...nodesDetail];
    newNodeDetail[0].data.name = value;
    setNodesDetail(newNodeDetail);
  };

  const handleSelectedStaff = (staff: StaffItem) => {
    let updateListStaff = [...listStaffSelect];
    if (
      updateListStaff.filter((item: any) => item.id === nodesDetail[0].id)
        .length > 0
    ) {
      for (let index = 0; index < updateListStaff.length; index++) {
        const element = updateListStaff[index];
        if (element.id === nodesDetail[0].id) {
          element.staffSelect = [...element.staffSelect, staff];
        }
      }
      setListStaffSelect(updateListStaff);
    }
  };

  const handleSearchingStaff = (value: string) => {
    const params: FilterParams = {
      page: 1,
      limit: 10000,
      fields: ['code'],
      search: value,
    };
    dispatch(staffSlice.fetchListStaff(params));
  };

  const handleDeletedStaff = () => {
    // dispatch(customerActions.resetCustomerList());
  };

  const handleRemoveStaff = (item: any) => {
    let newListStaff = [...listStaffSelect];
    newListStaff.forEach(data => {
      data.staffSelect = data?.staffSelect.filter(
        (staff: any) => staff.id !== item.id,
      );
    });
    setListStaffSelect(newListStaff);
  };

  return (
    <Box
      sx={{
        minWidth: '20%',
        maxWidth: '40%',
        border: '1px solid #C8CBCF',
        mt: '5px',
        p: 3,
        borderRadius: '0px 16px 16px 0px',
        height: '95%',
        background: palette.background.default,
      }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>
          Thêm mới
        </Typography>
      </Box>
      <Box mt={2}>
        <TextFieldCustom
          placeholder="Nhập tên bước"
          label="Title/ tên bước"
          name="name"
          control={control}
          errors={errors}
          defaultValue={getValues('name')}
          onChange={handleChangeName}
          disabled={!!WorkFlowDetail?.isUsed}
          // setError={setError}
        />
      </Box>
      {!nodesDetail[0]?.data.isFirst && (
        <Box
          mt={4}
          sx={{
            position: 'relative',
            '& .MuiInputBase-root': {
              width: 'auto !important',
            },
          }}
        >
          <SelectSearch
            // placeholder={WorkFlowDetail?.isUsed ? '' : 'Chọn nhân sự'}
            placeholder={'Chọn nhân sự'}
            label="Người duyệt"
            control={control}
            errors={errors}
            name="staffCode"
            // disabled={!!WorkFlowDetail?.isUsed}
            // options={
            //   nodesDetail[0]?.data?.staffSelect &&
            //   nodesDetail[0]?.data?.staffSelect.length > 0
            //     ? staffManagement?.data.filter(
            //         item =>
            //           !staffSelected.some(
            //             (newItem: { id: string }) => newItem.id === item.id,
            //           ),
            //       )
            //     : staffManagement?.data
            // }
            options={staffManagement?.data.filter(
              item =>
                !staffSelected.some(
                  (newItem: { id: string }) => newItem.id === item.id,
                ),
            )}
            handleSelected={handleSelectedStaff}
            onChange={handleSearchingStaff}
            handleDeleted={handleDeletedStaff}
          />
          {listStaffSelect && (
            <Box
              sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
            >
              {listStaffSelect.filter(
                (item: any) => item.id === nodesDetail[0].id,
              )[0]?.staffSelect.length > 0 &&
                listStaffSelect
                  .filter((item: any) => item.id === nodesDetail[0].id)[0]
                  ?.staffSelect.map((item: any, index: number) => (
                    <div>
                      <Box
                        sx={{
                          border: '1px solid #FF9EB6',
                          background: '#FDEAF4',
                          borderRadius: '16px',
                          mr: '5px',
                          padding: '4px 6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <Typography
                          fontSize={12}
                          fontWeight={700}
                          color={'#000000'}
                          marginTop={'2px'}
                        >
                          {item.fullName}
                        </Typography>
                        <Typography
                          sx={{
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#D6465F',
                            marginLeft: '8px',
                          }}
                        >
                          <div onClick={() => handleRemoveStaff(item)}>x</div>
                        </Typography>
                      </Box>
                    </div>
                  ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
