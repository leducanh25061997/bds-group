import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import TextFieldCustom from 'app/components/TextFieldCustom';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Close } from '@mui/icons-material';
import palette from 'styles/theme/palette';
import { useSalesProgramSlice } from 'app/pages/SalesProgram/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectSalesProgram } from 'app/pages/SalesProgram/slice/selectors';
import { useNavigate } from 'react-router-dom';
import path from 'app/routes/path';
import { useProfile } from 'app/hooks';
import {
  selectPermission,
  selectSaleEventControl,
} from 'app/pages/SaleEventControl/slice/selector';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';

interface ChooseSaleEventDialogProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
}

const ChooseSaleEventDialog: React.FC<ChooseSaleEventDialogProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const navigate = useNavigate();
  const { actions } = useSalesProgramSlice();
  const dispatch = useDispatch();
  const userInfo = useProfile();
  const permission = useSelector(selectPermission);

  const { salesProgramManagement, isLoading } = useSelector(selectSalesProgram);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<{ salesProgramId: string }>();

  // useEffect(() => {
  //   dispatch(
  //     actions.fetchListSalesProgram({
  //       ...{ page: 1, limit: 100 },
  //       projectID: projectId,
  //     }),
  //   );
  // }, [projectId]);

  const handleClose = () => {
    onClose?.();
  };

  const handleRedirect = (data: { salesProgramId: string }) => {
    if (!data.salesProgramId || !projectId) return;

    if (
      permission?.isAdmin &&
      checkPermissionExist(PermissionKeyEnum.EVENT_SALES_OPEN, userInfo)
    ) {
      navigate(`${path.saleEvent}/${data.salesProgramId}/control`);
    } else {
      navigate(
        `${path.saleEvent}/project/${projectId}/transaction/${data.salesProgramId}`,
      );
    }
  };

  return (
    <Dialog fullWidth maxWidth={'sm'} open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: '#1E1E1E',
          pt: 5,
          pb: 2,
        }}
        variant="h4"
      >
        Bán hàng sự kiện
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '10px 24px' }}>
        <Box mb={2}>
          <form onSubmit={handleSubmit(handleRedirect)}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                padding: '0 48px',
              }}
            >
              Vui lòng chọn chương trình bán hàng để thực hiện bán hàng sự kiện
            </Typography>
            <Box sx={{ mt: 4, position: 'relative', width: '100%' }}>
              <TextFieldCustom
                placeholder="Chọn chương trình"
                label="Chương trình bán hàng"
                control={control}
                name="salesProgramId"
                type="select"
                errors={errors}
                options={salesProgramManagement?.data || []}
                isDefaultId={true}
              />
            </Box>
            <Box
              mt={3}
              mb={2}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CustomButton
                title="Hủy"
                variant="outlined"
                handleClick={() => handleClose()}
                sxProps={{
                  borderRadius: '8px',
                  width: '128px',
                  marginRight: '42px',
                  ':hover': {
                    border: `1px solid ${palette.primary.button}`,
                    color: palette.common.white,
                    background: palette.primary.button,
                  },
                }}
                sxPropsText={{ fontWeight: 400 }}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseSaleEventDialog;
