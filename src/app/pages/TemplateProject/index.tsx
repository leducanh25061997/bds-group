import { Box, styled } from '@mui/material';
import { Fragment, useEffect } from 'react';
import palette from 'styles/theme/palette';
import { useDispatch } from 'react-redux';

import DocumentPrinted from './components/DocumentPrinted';
import TemplateEmail from './components/TemplateEmail';
import TemplateMessageSMS from './components/TemplateMessageSMS';
import { useManagementTemplateSlice } from './slice';

interface TemplateProjectProps {}
export const TitleFragment = styled(Box)(({ theme }) => ({
  width: '100%',
  fontSize: '16px',
  color: palette.primary.darkRed,
  fontFamily: 'Inter',
}));
export const TemplateProject = (props: TemplateProjectProps) => {
  const dispatch = useDispatch();
  const { actions } = useManagementTemplateSlice();

  useEffect(() => {
    return () => {
      dispatch(actions.clearListTemplateProject());
    };
  }, []);

  return (
    <Fragment>
      <DocumentPrinted />
      <TemplateEmail />
      <TemplateMessageSMS />
    </Fragment>
  );
};
