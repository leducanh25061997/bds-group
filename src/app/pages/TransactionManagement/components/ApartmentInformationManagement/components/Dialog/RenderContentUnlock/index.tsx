import { Box, Typography } from "@mui/material"
import CustomButton from "app/components/Button"
import { layoutsSelector } from "app/pages/Layouts/slice/selectors";
import { useDispatch, useSelector } from "react-redux";
import { selectApartmentInformation } from "../../../slice/selectors";
import { RenderListCode } from "../../RenderListCode";
import { useParams } from 'react-router';
import { useSnackbarSlice } from "app/components/Snackbar/slice";
import { StatusProductEnum } from "types/Enum";
import { useApartmentInformationsSlice } from "../../../slice";
import { UpdateStatusTableProductParams, ApartmentInformationSParams } from "../../../slice/types";
import { useLayoutsSlice } from "app/pages/Layouts/slice";

export const RenderContentUnlock = ({ onClose }: { onClose: () => void }) => {
  const { apartmentInformation } = useSelector(layoutsSelector);
  const { tableProductInformation, filterDatatable } = useSelector(selectApartmentInformation);
  const params = useParams();
  const dispatch = useDispatch();
  const { actions: layoutActions } = useLayoutsSlice();
  const { id: idParam } = params;
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =useApartmentInformationsSlice();

  const handleClick = (id: any) => {
    const ids: string[] = typeof id === 'string' ? [] : id.map((item: any) => item.id)
    if (typeof id === 'string') {
      ids.push(id)
    }
    const param: UpdateStatusTableProductParams = {
      ids: ids,
      status: 0,
      settingSalesProgramId: filterDatatable?.saleId || '',
      projectId: filterDatatable?.idProject || ''
    }
    dispatch(
      apartmentInformationsAction.updateStatusTableProduct(
        param,
        (err?: any) => {
          if (err.success) {

            if (filterDatatable?.idProject) {
              dispatch(apartmentInformationsAction.fetchDatatable(filterDatatable));
            }
            // if (typeof id === 'string') {
            //   dispatch(
            //     apartmentInformationsAction.fetchTableProductInformation(
            //       id,
            //     ),
            //   );
            // } else {
            //   dispatch(
            //     actions.showRightBar({
            //       isShowRightBar: true,
            //       apartmentId: id,
            //       status: StatusProductEnum.WARE_HOUSE,
            //     }),
            //   );
            // }
            dispatch(
              layoutActions.showRightBar({
                isShowRightBar: false,
                apartmentId: '',
                status: '',
              }),
            );
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
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
        },
      ),
    );
  }

  return (
    <Box mb={2}>
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
            Bạn có chắc chắn muốn mở khóa sản phẩm{' '}
            <span style={{ fontWeight: 700 }}>
              {tableProductInformation?.code}
            </span>{' '}
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
              {`Bạn có chắc chắn muốn mở khóa ${
                apartmentInformation &&
                Array.isArray(apartmentInformation.apartmentId)
                  ? apartmentInformation.apartmentId.length
                  : ''
              } sản phẩm này không?`}
            </Typography>
            <RenderListCode />
          </Box>
        ))}
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
          title="Mở khóa"
          handleClick={() => {
            if (apartmentInformation && apartmentInformation.apartmentId) {
              handleClick(apartmentInformation.apartmentId)
            }
          }}
          sxProps={{
            background: '#D45B7A',
            borderRadius: '8px',
            width: '128px',
          }}
          sxPropsText={{ color: '#FFFFFF' }}
        />
      </Box>
    </Box>
  );
};
