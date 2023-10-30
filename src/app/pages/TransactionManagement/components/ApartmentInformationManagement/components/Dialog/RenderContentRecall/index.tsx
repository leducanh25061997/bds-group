import { Box, Typography } from "@mui/material";
import CustomButton from "app/components/Button";
import { useParams } from 'react-router';
import { StatusProductEnum } from "types/Enum";
import { useDispatch, useSelector } from 'react-redux';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { UpdateStatusTableProductParams, ApartmentInformationSParams, MoveProductToSaleProgramParams } from "../../../slice/types";
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useApartmentInformationsSlice } from '../../../slice';
import { selectApartmentInformation } from "../../../slice/selectors";
import { RenderListCode } from "../../RenderListCode";

export const RenderContentRecall = ({ onClose }: { onClose: () => void }) => {
  const params = useParams();
  const { id } = params;
  const { tableProductInformation, filterDatatable } = useSelector(selectApartmentInformation);
  const { apartmentInformation } = useSelector(layoutsSelector);
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();

  const handleRecal = (idUpdate: any) => {
    const ids: string[] = typeof idUpdate === 'string' ? [] : idUpdate.map((item: any) => item.id)
    if (typeof idUpdate === 'string') {
      ids.push(idUpdate)
    }

    const param: MoveProductToSaleProgramParams = {
      id,
      productIds: ids,
    };
    dispatch(
      apartmentInformationsAction.removeProductToSaleProgram(
        param,
        (err?: any) => {
          if (err.success) {
            if (filterDatatable?.idProject) {
              dispatch(apartmentInformationsAction.fetchDatatable(filterDatatable));
            }
            if (typeof idUpdate === 'string') {
              dispatch(
                apartmentInformationsAction.fetchTableProductInformation(
                  idUpdate,
                ),
              );
            } else {
              dispatch(
                actions.showRightBar({
                  isShowRightBar: true,
                  apartmentId: idUpdate,
                  status: StatusProductEnum.WARE_HOUSE,
                }),
              );
            }
            onClose();
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Thay đổi thông tin thành công',
                type: 'success',
              }),
            );
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
            Bạn có chắc chắn muốn thu hồi sản phẩm{' '}
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
              {`Bạn có chắc chắn muốn thu hồi ${
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
          title="Thu hồi"
          handleClick={() => {
            if (apartmentInformation?.apartmentId) {
              handleRecal(apartmentInformation.apartmentId)
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
