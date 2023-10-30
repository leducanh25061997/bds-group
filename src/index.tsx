/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Use consistent styling
// import 'sanitize.css/sanitize.css';
import './index.css';
// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';
import { configureAppStore } from 'store/configureStore';
import reportWebVitals from 'reportWebVitals';
import 'styles/css/global.css';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
// Initialize languages
import './locales/i18n';
import { msalConfig } from 'utils/authConfig';

export const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <HelmetProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </HelmetProvider>
    </Provider>
  </MsalProvider>,

  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}
reportWebVitals();
