import { Box, Grid, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { useParams } from 'react-router';

import { useLayoutsSlice } from 'app/pages/Layouts/slice';

import { useApartmentInformationsSlice } from '../../../slice';
import { selectApartmentInformation } from '../../../slice/selectors';
import {
  ApartmentInformationSParams,
  ChangeOrgChartProductRequest,
  SubDataProtype,
} from '../../../slice/types';
import { RenderListCode } from '../../RenderListCode';
import { FilterParams } from 'types';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';

export const RenderContentTranfer = ({ onClose }: { onClose: () => void }) => {
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { apartmentInformation } = useSelector(layoutsSelector);
  const { OrgchartManagementFilter } = useSelector(selectOrgchart);
  const { tableProductInformation, filterDatatable } = useSelector(
    selectApartmentInformation,
  );
  const dispatch = useDispatch();
  const [ids, setIds] = useState<string[]>([]);
  const { actions } = useApartmentInformationsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const methods = useForm();
  const params = useParams();
  const { id } = params;
  const { actions: layoutActions } = useLayoutsSlice();
  const [orgcharts, setOrgcharts] = useState<any[]>([]);
  const { actions: projectSettingActions } = useManagementInformationActionsSlice();
  const { informationProject } = useSelector(
    selectManagementInformation,
  );

  useEffect(() => {
    if (id) {
      dispatch(projectSettingActions.fetchInformationProject(id));
    }
  }, [id]);

  useEffect(() => {
    const params: FilterParams = {
      projectSettingId: informationProject?.id
    }
    dispatch(OrgchartActions.fetchListOrgchartFilter(params));
  }, [informationProject]);

  useEffect(() => {
    if (OrgchartManagementFilter?.data?.length) {
      if (filterDatatable?.saleId) {
        const _org = [
          ...OrgchartManagementFilter?.data,
          { name: 'Kho sản phẩm', id: '' },
        ];
        setOrgcharts(_org);
      } else {
        setOrgcharts(OrgchartManagementFilter.data);
      }
    }
  }, [OrgchartManagementFilter]);

  useEffect(() => {
    if (apartmentInformation) {
      if (typeof apartmentInformation.apartmentId === 'string') {
        setIds([apartmentInformation.apartmentId]);
      } else {
        if (Array.isArray(apartmentInformation.apartmentId)) {
          const data: string[] = apartmentInformation.apartmentId.map(
            (item: any) => item.id,
          );
          setIds(data);
        }
      }
    }
  }, [apartmentInformation]);
  // CH-01-02

  const onSubmit = (data: any) => {
    const param: ChangeOrgChartProductRequest = {
      ids,
      orgChartId: data.orgChartId === 'Kho sản phẩm' ? '' : data.orgChartId,
      settingSalesProgramId: filterDatatable?.saleId || ''
    };
    dispatch(
      actions.changeOrgChartProduct(param, (status?: any) => {
        if (status.success) {
          if (filterDatatable?.idProject) {
            dispatch(actions.fetchDatatable(filterDatatable));
          }
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi thông tin thành công',
              type: 'success',
            }),
          );

          dispatch(
            layoutActions.showRightBar({
              isShowRightBar: false,
              apartmentId: '',
              status: '',
            }),
          );
          onClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi thông tin không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {apartmentInformation &&
        (typeof apartmentInformation.apartmentId === 'string' ? (
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
            {/* <span style={{ fontWeight: 700 }}>
              {tableProductInformation?.code}
            </span>{' '} */}
            này không?
          </Typography>
        ) : (
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
              }}
            >
              {`Bạn có chắc chắn muốn chuyển ${
                apartmentInformation &&
                Array.isArray(apartmentInformation.apartmentId)
                  ? apartmentInformation.apartmentId.length
                  : ''
              } sản phẩm này không?`}
            </Typography>
          </Box>
        ))}
      <RenderListCode />
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
