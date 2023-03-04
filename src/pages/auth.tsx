import Cookies from 'js-cookie';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import {
  AUTH_ERROR_COOKIE_KEY,
  AUTH_SESSION_COOKIE_KEY,
  AUTH_TYPE_COOKIE_KEY,
} from '../constants';

type AuthPageProps = {
  basename?: string;
};

const handleAuth = async (basename: string = '/') => {
  // Clear any cookies from previous requests.
  Cookies.remove(AUTH_TYPE_COOKIE_KEY);
  Cookies.remove(AUTH_ERROR_COOKIE_KEY);
  Cookies.remove(AUTH_SESSION_COOKIE_KEY);

  // Parse the access token from the URL, which will look something like this:
  // http://example.com/auth#access_token=123&type=recovery
  const hashParams = new URLSearchParams(window.location.href.split('#')[1]);
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  const authType = hashParams.get('type');

  // Handle confirmation or password reset requests by storing cookies to
  // be picked up from the custom react admin login route. The refresh token
  // should really be made HTTP-only, but there's no way of doing this from the
  // client-side. It's tricky to work around react admin's hash router and the
  // way Supabase also sends these parameters as hash params. This cookie is
  // at least deleted once consumed.
  if (
    accessToken &&
    refreshToken &&
    authType &&
    ['invite', 'recovery'].includes(authType)
  ) {
    Cookies.set(AUTH_TYPE_COOKIE_KEY, authType);
    Cookies.set(
      AUTH_SESSION_COOKIE_KEY,
      JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    );
  }

  // Handle errors, such as expired password reset links.
  if (hashParams.get('error')) {
    Cookies.set(
      AUTH_ERROR_COOKIE_KEY,
      String(hashParams.get('error_description')),
    );
  }

  window.location.assign(new URL(basename, window.location.origin));
};

export const AuthPage: NextPage<AuthPageProps> = ({
  basename,
}: AuthPageProps) => {
  useEffect(() => {
    handleAuth(basename);
  }, [basename]);

  return null;
};
