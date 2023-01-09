import { FC, ReactNode, useEffect } from 'react';
import { Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { AuthForm } from './AuthForm';
import { AuthSecondaryButton } from './AuthSecondaryButton';
import { AUTH_ERROR_COOKIE_KEY } from '../constants';

type FeedbackProps = {
  onBackToSignInClick: () => void;
  children: ReactNode;
};

export const Feedback: FC<FeedbackProps> = ({
  onBackToSignInClick,
  children,
}: FeedbackProps) => {
  // Once the feedback is shown remove the auth error cookie (if present). This
  // here as react admin/admin seems to re-render the login component, meaning
  // anything we might otherwise have stored in state and passed down to this
  // component would be lost.
  useEffect(() => {
    Cookies.remove(AUTH_ERROR_COOKIE_KEY);
  }, []);

  return (
    <AuthForm>
      <Typography paragraph align="center">
        {children}
      </Typography>
      <AuthSecondaryButton onClick={onBackToSignInClick}>
        Back to sign in
      </AuthSecondaryButton>
    </AuthForm>
  );
};
