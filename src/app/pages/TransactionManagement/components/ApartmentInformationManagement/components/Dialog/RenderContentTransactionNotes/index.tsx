import { Box, Typography } from "@mui/material";
import CustomButton from "app/components/Button";
import TextFieldCustom from "app/components/TextFieldCustom";
import { useForm } from "react-hook-form";
import { useApartmentInformationsSlice } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { selectApartmentInformation } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/selectors';
import { UpdateNoteParams } from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';

export const RenderContentTransactionNotes = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const methods = useForm();
  const { actions: apartmentInformationsAction } = useApartmentInformationsSlice();
  const { tableProductInformation, filterDatatable, apartmentInformation: dataTable } = useSelector(selectApartmentInformation);
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useLayoutsSlice();

  const onSubmit = (data: any) => {
    if (tableProductInformation?.id) {
      const params: UpdateNoteParams = {
        id: tableProductInformation.id,
        note: data.note
      }
      dispatch(
        apartmentInformationsAction.updateNoteTableProduct(
          params,
          (status?: any) => {
            if (status.success) {
              if (filterDatatable?.idProject) {
                dispatch(apartmentInformationsAction.fetchDatatable(filterDatatable));
              }
              dispatch(actions.handleShowBunble(false));
              dispatch(
                actions.showRightBar({
                  isShowRightBar: false,
                  apartmentId: '',
                  status: '',
                }),
              );
              onClose();
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Ghi chú sản phẩm thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Ghi chú sản phẩm không thành công',
                  type: 'error',
                }),
              );
            }
          },
        ),
      );
    }
  }

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
          Vui lòng nhập nội dung bạn muốn ghi chú cho giao dịch này
        </Typography>
        <Box sx={{ mt: 4, position: 'relative', width: '100%' }}>
          <TextFieldCustom
            placeholder="Nhập nội dung"
            label="Nội dung ghi chú"
            control={methods.control}
            name="note"
            type="textarea"
            rows={4}
            errors={methods.formState.errors}
          />
        </Box>
        <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
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
            title="Lưu"
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
