import { FC, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { TextInput, required, useLogin, useNotify } from 'react-admin';
import { AuthForm } from './AuthForm';

type LoginFormProps = {
  redirectTo?: string;
  className?: string;
  onResetPasswordClick: () => void;
};

export const LoginForm: FC<LoginFormProps> = ({
  redirectTo,
  className,
  onResetPasswordClick,
}: LoginFormProps) => {
  const login = useLogin();
  const notify = useNotify();
  const theme = useTheme();

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      try {
        await login(values, redirectTo);
      } catch (error) {
        const msg =
          typeof error === 'string' ? error : (error as Error).message;

        notify(msg, {
          type: 'error',
          messageArgs: {
            _: msg,
          },
        });
      }
    },
    [login, notify, redirectTo],
  );

  return (
    <AuthForm onSubmit={onSubmit} className={className}>
      <TextInput fullWidth autoFocus source="email" validate={required()} />
      <TextInput
        fullWidth
        source="password"
        type="password"
        autoComplete="current-password"
        validate={required()}
      />

      <Button variant="contained" type="submit" color="primary" fullWidth>
        Sign in
      </Button>
      <Button
        onClick={onResetPasswordClick}
        sx={{
          display: 'flex',
          margin: `${theme.spacing(2)} auto 0px auto`,
        }}>
        Forgotten your password?
      </Button>
    </AuthForm>
  );
};
