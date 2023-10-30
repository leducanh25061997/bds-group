/* eslint-disable jsx-a11y/img-redundant-alt */
import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import React, { Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TransferTextStatus } from 'types/Enum';
import { get } from 'lodash';
import IMAGE_LICENSE from 'assets/background/image-license.svg';
import Skeleton from '@mui/material/Skeleton';
import { renderContent, renderFile } from 'utils/helpers';
import moment from 'moment';

import { useComisstionPolicySlice } from '../../slice';
import { selectComisstion } from '../../slice/selector';

export default function Information() {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useComisstionPolicySlice();
  const { isLoading, ComisstionPolicyDetail } = useSelector(selectComisstion);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailComisstion({ id }));
    }
  }, [actions, dispatch, id]);

  const redirectToEditPage = () => navigate(`/Comisstions-account/edit/${id}`);

  return (
    <Box
      sx={{
        paddingLeft: { xs: '0px', sm: '31px', md: '61px' },
      }}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <Fragment>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <CustomButton
              title="Chỉnh sửa"
              variant="contained"
              isIcon
              buttonMode="edit"
              typeButton={'submit'}
              light
              handleClick={redirectToEditPage}
            />
          </Box>
        </Fragment>
      )}
    </Box>
  );
}
