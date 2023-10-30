import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import path from 'app/routes/path';

import Page from '../../components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <RootStyle>
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <h1>PAGE 404 NOT FOUND</h1>
          <Button
            to={path.root}
            size="large"
            variant="contained"
            component={RouterLink}
            sx={{
              color: theme.palette.primary.main,
              background: theme.palette.warning.light,
            }}
          >
            {t('notFoundPage.goToHome')}
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
