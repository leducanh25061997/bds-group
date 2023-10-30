import { LocalStorageService } from 'services';

export const isAuthenticated = () => {
  const accessToken = LocalStorageService.get<string>(
    LocalStorageService.OAUTH_TOKEN,
  );
  return !!accessToken && accessToken.length > 0;
};
