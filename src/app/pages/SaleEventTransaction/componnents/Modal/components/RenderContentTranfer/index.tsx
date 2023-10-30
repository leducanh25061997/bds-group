import { Box, Grid, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { useParams } from 'react-router';

import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { Product } from 'types/ProductTable';
import { ChangeOrgChartProductRequest } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import { FilterParams } from 'types';

export const RenderContentTranfer = ({
  onClose,
  product,
  salesProgramId,
}: {
  onClose: (v?: boolean) => void;
  product: Product;
  salesProgramId?: string;
}) => {
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { OrgchartManagementFilter } = useSelector(selectOrgchart);
  const dispatch = useDispatch();
  const [ids, setIds] = useState<string[]>([]);
  const { actions } = useApartmentInformationsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const methods = useForm();
  const [orgcharts, setOrgcharts] = useState<any[]>([]);

  useEffect(() => {
    const params: FilterParams = {
      projectSettingId: product.project.projectSettingId
    }
    dispatch(OrgchartActions.fetchListOrgchartFilter(params));
  }, [product]);

  useEffect(() => {
    if (
      OrgchartManagementFilter &&
      OrgchartManagementFilter.data.length
    ) {
      setOrgcharts(OrgchartManagementFilter.data);
    }
  }, [OrgchartManagementFilter]);

  useEffect(() => {
    if (product) {
      setIds([product.id]);
    }
  }, [product]);

  const onSubmit = (data: any) => {
    const param: ChangeOrgChartProductRequest = {
      ids,
      orgChartId: data.orgChartId,
      settingSalesProgramId: salesProgramId,
    };
    dispatch(
      actions.changeOrgChartProduct(param, (status?: any) => {
        if (status.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Chuyển đơn vị thành công',
              type: 'success',
            }),
          );
          onClose(true);
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Chuyển đơn vị không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          textAlign: 'center',
          padding: '0 48px',
        }}
      >
        Bạn có chắc chắn muốn chuyển sản phẩm{' '}
        <span style={{ fontWeight: 700 }}>{product?.code}</span> này không?
      </Typography>
      <Box sx={{ mt: 4, position: 'relative', width: '100%' }}>
        <TextFieldCustom
          placeholder="Chọn đơn vị chuyển đến"
          label="Đơn vị chuyển đến"
          control={methods.control}
          name="orgChartId"
          type="select"
          errors={methods.formState.errors}
          options={orgcharts || []}
        />
      </Box>
      <Box mt={3} mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <CustomButton
          title="Hủy"
          handleClick={() => onClose()}
          sxProps={{
            background: '#FFFFFF',
            border: '1px solid #D6465F',
            borderRadius: '8px',
            width: '128px',
            marginRight: '42px',
          }}
          sxPropsText={{ color: '#1E1E1E' }}
        />
        <CustomButton
          title="Xác nhận"
          typeButton="submit"
          sxProps={{
            background: '#D45B7A',
            borderRadius: '8px',
            width: '128px',
          }}
          sxPropsText={{ color: '#FFFFFF' }}
        />
      </Box>
    </form>
  );
};
