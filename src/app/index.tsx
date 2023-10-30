/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import GlobalStyle from 'styles/theme/globalStyles';
import ThemeConfig from 'styles/theme';
import Snackbar from 'app/components/Snackbar';

import Routes from './routes';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <ThemeConfig>
        <Helmet
          titleTemplate="CTLotus"
          defaultTitle="CTLotus"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="A Ctlotus application" />
        </Helmet>
        <Routes />
        <Snackbar />
        <GlobalStyle />
      </ThemeConfig>
    </BrowserRouter>
  );
}
