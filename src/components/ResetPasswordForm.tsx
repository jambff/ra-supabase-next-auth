import { FC, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { TextInput, required, useNotify, useAuthProvider } from 'react-admin';
import { AuthForm } from './AuthForm';
import { AuthSecondaryButton } from './AuthSecondaryButton';
import { AUTH_ROUTE } from '../constants';

type ResetPasswordFormProps = {
  onBackToSignInClick: () => void;
  showFeedback: (feedback: string) => void;
};

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  onBackToSignInClick,
  showFeedback,
}: ResetPasswordFormProps) => {
  const notify = useNotify();
  const { supabase } = useAuthProvider();

  const onSubmit = useCallback(
    async ({ email }: Record<string, any>) => {
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: new URL(AUTH_ROUTE, window.location.origin).href,
        });
      } catch (error) {
        const msg =
          typeof error === 'string' ? error : (error as Error).message;

        notify(msg, {
          type: 'error',
          messageArgs: {
            _: msg,
          },
        });

        return;
      }

      showFeedback(
        "If you're registered with us you'll receive an email with instructions on how to reset your password.",
      );
    },
    [notify, showFeedback, supabase],
  );

  return (
    <AuthForm onSubmit={onSubmit}>
      <Typography paragraph align="center">
        Enter your registered email address and we will help you reset your
        password.
      </Typography>
      <TextInput fullWidth autoFocus source="email" validate={required()} />
      <Button variant="contained" type="submit" color="primary" fullWidth>
        Reset Password
      </Button>
      <AuthSecondaryButton onClick={onBackToSignInClick}>
        Back to sign in
      </AuthSecondaryButton>
    </AuthForm>
  );
};
