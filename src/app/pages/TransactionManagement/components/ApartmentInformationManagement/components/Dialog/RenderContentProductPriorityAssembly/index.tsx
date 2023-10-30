import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSalesProgramSlice } from 'app/pages/SalesProgram/slice';
import { selectSalesProgram } from 'app/pages/SalesProgram/slice/selectors';
import { useForm } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import CustomButton from 'app/components/Button';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import { ChangeStatusPriorityParams } from 'types/ProductTable';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { PriorityStatus, SalesProgramStatusEnum } from 'types/Enum';

import { ApartmentInformationSParams } from '../../../slice/types';
import { useApartmentInformationsSlice } from '../../../slice';

const initialFilter = {
  page: 1,
  limit: 1000,
  type: SalesProgramStatusEnum.ENABLED,
};

export const RenderContentProductPriorityAssembly = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSalesProgramSlice();
  const { actions: transactionManagementAction } =
    useTransactionManagementSlice();
  const { salesProgramPriorityManagement } = useSelector(selectSalesProgram);
  const { actions: snackbarActions } = useSnackbarSlice();
  const methods = useForm();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();

  useEffect(() => {
    dispatch(
      actions.fetchListSalesProgram({ ...initialFilter, projectID: id }),
    );
  }, []);

  const onSubmit = (data: any) => {
    if (!data.salesProgramId) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng chọn chương trình bán hàng.',
          type: 'error',
        }),
      );
      return;
    }
    const salesUnit = salesProgramPriorityManagement?.data.filter(
      item => item.id === data.salesProgramId,
    );
    const params: ChangeStatusPriorityParams = {
      isOpen: true,
      settingSalesProgramId: data.salesProgramId,
    };
    dispatch(
      transactionManagementAction.setSettingSalesProgramId(data.salesProgramId),
    );
    if (salesUnit && salesUnit.length > 0) {
      const saleUnit = salesUnit[0];
      if (id) {
        const params: ApartmentInformationSParams = {
          idProject: id,
          isPriority: true,
          saleId: data.salesProgramId,
        };
        dispatch(apartmentInformationsAction.fetchDatatable(params));
      }
      switch (saleUnit.priorityStatus) {
        case PriorityStatus.NOT_OPENED_PRIORITY:
          dispatch(
            transactionManagementAction.setPriorityStatus(
              PriorityStatus.OPEN_PRIORITY,
            ),
          );
          dispatch(
            transactionManagementAction.changeStatusPriority(
              params,
              (status: any) => {
                if (status.success) {
                  dispatch(
                    snackbarActions.updateSnackbar({
                      message: 'Ráp ưu tiên thành công',
                      type: 'success',
                    }),
                  );
                  onClose();
                } else {
                  dispatch(
                    snackbarActions.updateSnackbar({
                      message: status.message,
                      type: 'error',
                    }),
                  );
                }
              },
            ),
          );
          break;
        case PriorityStatus.OPEN_PRIORITY:
          dispatch(
            transactionManagementAction.setPriorityStatus(
              PriorityStatus.OPEN_PRIORITY,
            ),
          );
          break;
        case PriorityStatus.LOCK_PRIORITY:
          dispatch(
            transactionManagementAction.setPriorityStatus(
              PriorityStatus.LOCK_PRIORITY,
            ),
          );
          break;
        case PriorityStatus.OPEN_PRIORITY_ADDITIONAL:
          dispatch(
            transactionManagementAction.setPriorityStatus(
              PriorityStatus.OPEN_PRIORITY_ADDITIONAL,
            ),
          );
          break;
        case PriorityStatus.LOCK_PRIORITY_ADDITIONAL:
          dispatch(
            transactionManagementAction.setPriorityStatus(
              PriorityStatus.LOCK_PRIORITY_ADDITIONAL,
            ),
          );
          break;
        default:
          break;
      }
    }
    onClose();
    // const paramFetch: DatatablePriorityParam = {
    //   settingSalesProgramId: data.salesProgramId,
    // };
  };

  return (
    <Box mb={2}>
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
          Vui lòng chọn chương trình bán hàng để thực hiện ráp ưu tiên sản phẩm
        </Typography>
        <Box sx={{ mt: 4, position: 'relative', width: '100%' }}>
          <TextFieldCustom
            placeholder="Chọn chương trình"
            label="Chương trình bán hàng"
            control={methods.control}
            name="salesProgramId"
            type="select"
            errors={methods.formState.errors}
            options={
              salesProgramPriorityManagement?.data.filter(
                item =>
                  (!item.priorityStatus ||
                    item.priorityStatus ===
                      PriorityStatus.NOT_OPENED_PRIORITY) &&
                  !item.isOpenSales,
              ) || []
            }
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
            title="Ráp ưu tiên"
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
    </Box>
  );
};
