import { FC, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { required, useNotify, PasswordInput, useRedirect } from 'react-admin';
import Cookies from 'js-cookie';
import { AuthForm } from './AuthForm';
import { getSupabaseClient } from '../supabase';
import {
  ACCESS_TOKEN_COOKIE_KEY,
  AUTH_SESSION_COOKIE_KEY,
  AUTH_TYPE_COOKIE_KEY,
} from '../constants';

const PASSWORD_NAME = 'password';
const CONFIRM_PASSWORD_NAME = 'confirmPassword';

export const SetPasswordForm: FC = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!values[PASSWORD_NAME]) {
      errors[PASSWORD_NAME] = 'Required';
    }

    if (!values[CONFIRM_PASSWORD_NAME]) {
      errors[CONFIRM_PASSWORD_NAME] = 'Required';
    }

    if (
      values[PASSWORD_NAME] &&
      values[CONFIRM_PASSWORD_NAME] &&
      values[PASSWORD_NAME] !== values[CONFIRM_PASSWORD_NAME]
    ) {
      errors[PASSWORD_NAME] = 'Passwords do not match';
    }

    return errors;
  };

  const removeCookies = () => {
    Cookies.remove(AUTH_SESSION_COOKIE_KEY);
    Cookies.remove(AUTH_TYPE_COOKIE_KEY);
  };

  const handleError = useCallback(
    (err: unknown) => {
      const msg = typeof err === 'string' ? err : (err as Error).message;

      console.error(err);
      removeCookies();
      notify(msg, {
        type: 'error',
        messageArgs: {
          _: msg,
        },
      });
    },
    [notify],
  );

  const onSubmit = useCallback(
    async ({ password }: Record<string, any>) => {
      const supabase = getSupabaseClient();
      const newSession = Cookies.get(AUTH_SESSION_COOKIE_KEY);

      if (!newSession) {
        handleError('Missing new session data');

        return;
      }

      let error;
      let session;

      // Set the session data for the new session, based on the access_token
      // and refresh_token passed as part of the invite or recovery flow.
      try {
        ({
          error,
          data: { session },
        } = await supabase.auth.setSession(JSON.parse(newSession)));
      } catch (err) {
        handleError(err);

        return;
      }

      if (error) {
        handleError(error);

        return;
      }

      // Update the user's password.
      try {
        ({ error } = await supabase.auth.updateUser({ password }));
      } catch (err) {
        handleError(err);

        return;
      }

      if (error) {
        handleError(error);

        return;
      }

      // If successfully updated set the access token for the new session.
      if (session?.access_token) {
        Cookies.set(ACCESS_TOKEN_COOKIE_KEY, session.access_token);
      }

      removeCookies();
      redirect('/');
    },
    [redirect, handleError],
  );

  return (
    <AuthForm onSubmit={onSubmit} validate={validate}>
      <Typography paragraph align="center">
        Please set a password to sign in.
      </Typography>
      <PasswordInput
        fullWidth
        autoFocus
        source={PASSWORD_NAME}
        validate={required()}
      />
      <PasswordInput
        fullWidth
        source={CONFIRM_PASSWORD_NAME}
        autoComplete="current-password"
        validate={required()}
      />
      <Button variant="contained" type="submit" color="primary" fullWidth>
        Sign in
      </Button>
    </AuthForm>
  );
};
