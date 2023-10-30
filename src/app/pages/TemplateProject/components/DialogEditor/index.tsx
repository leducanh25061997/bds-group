import ConfirmDialog from 'app/components/ConfirmDialog';
import { Box, FormHelperText, Grid, Typography, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { EditorMessage } from '../EditorMessage/EditorMessage';

interface Props {
  title: string;
  isOpen: boolean;
  method: any;
  name: string;
  handleClose: () => void;
  handleSubmit: () => void;
  maxWidth?: 'md' | 'xs' | 'sm' | 'lg' | 'xl';
  placeholder?: string;
  actionName?: string;
}
const DialogEditor = (props: Props) => {
  const {
    title,
    isOpen,
    method,
    name,
    handleSubmit,
    handleClose,
    maxWidth,
    placeholder = 'Nhập nội dung',
    actionName = 'Lưu',
  } = props;
  const theme = useTheme();

  return (
    <ConfirmDialog
      isOpen={isOpen}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      buttonMode="unset"
      actionName={actionName}
      maxWidth={maxWidth}
    >
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 400,
          mb: '16px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '24px',
            mb: '24px',
          }}
        >
          {title}
        </Typography>
        <Grid>
          <Box
            sx={{
              marginLeft: { xs: '12px', sm: '18px', lg: '0px' },
              marginRight: { xs: '12px', sm: '18px', lg: '0px' },
            }}
          >
            <Controller
              name={name}
              control={method.control}
              rules={{
                required: `${'Vui lòng nhập nội dung'}`,
              }}
              render={({ field, fieldState }) => {
                return (
                  <div>
                    <EditorMessage
                      value={method.watch('content')}
                      placeholder={placeholder}
                      onChangeEdit={e => {
                        e && field.onChange(e);
                      }}
                    />
                    {fieldState?.error && (
                      <FormHelperText
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.error.light,
                          marginLeft: '10px',
                        }}
                      >
                        {fieldState?.error}
                      </FormHelperText>
                    )}
                  </div>
                );
              }}
            />
          </Box>
        </Grid>
      </Box>
    </ConfirmDialog>
  );
};

export default DialogEditor;
