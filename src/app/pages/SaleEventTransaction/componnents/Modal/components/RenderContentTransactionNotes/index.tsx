import { Box, Typography } from "@mui/material";
import CustomButton from "app/components/Button";
import TextFieldCustom from "app/components/TextFieldCustom";
import { useApartmentInformationsSlice } from "app/pages/TransactionManagement/components/ApartmentInformationManagement/slice";
import { UpdateNoteParams } from "app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types";
import { useForm } from "react-hook-form";
import { Product } from 'types/ProductTable';
import { useDispatch } from 'react-redux';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

export const RenderContentTransactionNotes = ({
  onClose,
  product
}: {
  onClose: (v?: boolean) => void;
  product: Product;
}) => {
  const methods = useForm();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();

  const onSubmit = (data: any) => {
    if (product.id) {
      const params: UpdateNoteParams = {
        id: product.id,
        note: data.note
      }
      dispatch(
        apartmentInformationsAction.updateNoteTableProduct(
          params,
          (status?: any) => {
            if (status.success) {
              onClose(true);
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
            placeholder="Nội dung ghi chú"
            label="Nhập nội dung"
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
