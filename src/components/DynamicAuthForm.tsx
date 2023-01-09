import { FC, useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LoginForm } from './LoginForm';
import { SetPasswordForm } from './SetPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AUTH_ERROR_COOKIE_KEY, AUTH_TYPE_COOKIE_KEY } from '../constants';
import { Feedback } from './Feedback';

type DynamicAuthFormProps = {
  redirectTo?: string;
  className?: string;
};

type DynamicAuthFormType =
  | 'login'
  | 'reset-password'
  | 'set-password'
  | 'feedback';

export const DynamicAuthForm: FC<DynamicAuthFormProps> = ({
  redirectTo,
  className,
}: DynamicAuthFormProps) => {
  const [displayedForm, setDisplayedForm] = useState<DynamicAuthFormType>();
  const [feedback, setFeedback] = useState<string>();

  useEffect(() => {
    const authType = Cookies.get(AUTH_TYPE_COOKIE_KEY);
    const authFeedback = Cookies.get(AUTH_ERROR_COOKIE_KEY);

    if (authType && ['invite', 'recovery'].includes(authType)) {
      setDisplayedForm('set-password');

      return;
    }

    if (authFeedback) {
      setFeedback(authFeedback);
      setDisplayedForm('feedback');

      return;
    }

    setDisplayedForm('login');
  }, []);

  const onResetPasswordClick = useCallback(() => {
    setDisplayedForm('reset-password');
  }, []);

  const onBackToSignInClick = useCallback(() => {
    setDisplayedForm('login');
  }, []);

  const showFeedback = useCallback((str: string) => {
    setFeedback(str);
    setDisplayedForm('feedback');
  }, []);

  if (!displayedForm) {
    return null;
  }

  if (displayedForm === 'set-password') {
    return <SetPasswordForm />;
  }

  if (displayedForm === 'reset-password') {
    return (
      <ResetPasswordForm
        onBackToSignInClick={onBackToSignInClick}
        showFeedback={showFeedback}
      />
    );
  }

  if (displayedForm === 'feedback' && feedback) {
    return (
      <Feedback onBackToSignInClick={onBackToSignInClick}>{feedback}</Feedback>
    );
  }

  return (
    <LoginForm
      redirectTo={redirectTo}
      className={className}
      onResetPasswordClick={onResetPasswordClick}
    />
  );
};
