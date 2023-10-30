export interface SnackbarState {
  open?: boolean;
  message?: string;
  type?: 'success' | 'error' | 'warning';
}
