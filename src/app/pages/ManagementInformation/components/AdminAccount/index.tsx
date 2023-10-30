import { Avatar, Box, Grid, Typography } from '@mui/material';
import { ControlledAutocomplete } from 'app/components/ControlledAutocomplete';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import palette from 'styles/theme/palette';
import ADD_ICON from 'assets/icons/user-icon.svg';
import { useSelector } from 'react-redux';
import { selectStaff } from 'app/pages/Staff/slice/selector';
import { StaffItem } from 'types/Staff';
import { renderFile } from 'utils/helpers';
import { Icon } from '@iconify/react';

import { selectManagementInformation } from '../../slice/selectors';
import { ProjectManager } from '../../slice/types';
interface EmployeePrototype extends ProjectManager {
  name: string;
}

export const AdminAccount: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { staffManagement } = useSelector(selectStaff);
  const [employees, setEmployees] = useState<EmployeePrototype[]>([]);
  const { informationProject } = useSelector(selectManagementInformation);

  useEffect(() => {
    if (informationProject && Object.keys(informationProject).length > 0) {
      const employee: EmployeePrototype[] = [];
      for (let i = 0; i < informationProject.projectManager.length; i++) {
        employee.push({
          ...informationProject.projectManager[i],
          name: informationProject.projectManager[i].fullName,
        });
      }
      setProjectLeader(employee);
    }
  }, [informationProject]);

  useEffect(() => {
    if (staffManagement && staffManagement?.data?.length > 0) {
      const data: any[] = [...staffManagement.data];
      const employee: EmployeePrototype[] = [];
      for (let i = 0; i < data.length; i++) {
        employee.push({
          ...data[i],
          name: data[i].fullName,
        });
      }
      setEmployees(employee);
    }
  }, [staffManagement?.data]);

  useEffect(() => {
    if (informationProject && Object.keys(informationProject).length > 0) {
      const employee: EmployeePrototype[] = [];
      for (let i = 0; i < informationProject.supportDepartment.length; i++) {
        employee.push({
          ...informationProject.supportDepartment[i],
          name: informationProject.supportDepartment[i].fullName,
        });
      }
      setSupportDepartment(employee);
    }
  }, [informationProject]);

  const [projectLeader, setProjectLeader] = useState<EmployeePrototype[]>([]);
  const [supportDepartment, setSupportDepartment] = useState<
    EmployeePrototype[]
  >([]);

  const handleBlurProjectLeader = (value?: string) => {
    if (value) {
      const values = value.split(',');
      const leaders = employees.filter(function (item) {
        return values.includes(item.id);
      });
      setProjectLeader(leaders);
    }
  };

  const handleBlursupportDepartment = (value?: string) => {
    if (value) {
      const values = value.split(',');
      const data = employees.filter(function (item) {
        return values.includes(item.id);
      });
      setSupportDepartment(data);
    }
  };

  const handleRemove = (
    id: string,
    data: EmployeePrototype[],
    setData: (values: EmployeePrototype[]) => void,
    fieldName: string,
  ) => {
    const newData = data.filter(item => item.id !== id);
    const _newData = newData.map(item => item.id);
    setValue(fieldName, _newData.toString().replace(/\s/g, ''));
    setData(newData);
  };

  const RenderValueEmployee = (
    datas: EmployeePrototype[],
    setDatas: (values: EmployeePrototype[]) => void,
    fieldName: string,
  ) => {
    return (
      <Box
        mt={1}
        sx={{
          background: '#FEF8FC',
          borderRadius: '8px',
          height: '156px',
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {datas.map((data: EmployeePrototype) => (
          <Box
            mt={1}
            sx={{
              padding: '7px 7px 7px 4px',
              background: '#FFD9EA',
              borderRadius: '30px',
              maxWidth: 'max-content',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              ml: 2,
            }}
          >
            <Box>
              <Avatar sx={{ width: 28, height: 28 }}>H</Avatar>
            </Box>
            <Box
              ml={1}
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '20px',
                color: '#000000',
              }}
            >
              {data.fullName}
            </Box>
            {canEdit && (
              <Box
                sx={{
                  ml: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon
                  icon="ph:x"
                  color="#d6465f"
                  onClick={() =>
                    handleRemove(data.id, datas, setDatas, fieldName)
                  }
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            color: palette.primary.button,
          }}
        >
          Tài khoản quản trị
        </Typography>
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <ControlledAutocomplete
          name="projectManagerIds"
          control={control}
          label="Trưởng dự án"
          options={employees}
          handleBlur={handleBlurProjectLeader}
          placeholder="Trưởng dự án"
          disabled={!canEdit}
          endAdornment={<img src={ADD_ICON} alt="icon table" />}
        />
        {RenderValueEmployee(
          projectLeader,
          setProjectLeader,
          'projectManagerIds',
        )}
      </Grid>
      <Grid item xs={6} md={6} mt={1}>
        <ControlledAutocomplete
          name="supportDepartmentIds"
          control={control}
          label="Phòng ban hỗ trợ"
          options={employees}
          handleBlur={handleBlursupportDepartment}
          placeholder="Người hỗ trợ"
          disabled={!canEdit}
          endAdornment={<img src={ADD_ICON} alt="icon table" />}
        />
        {RenderValueEmployee(
          supportDepartment,
          setSupportDepartment,
          'supportDepartmentIds',
        )}
      </Grid>
    </Grid>
  );
};
