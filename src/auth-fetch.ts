import fetch, { UnfetchRequestInit, UnfetchResponse } from 'unfetch';
import Cookies from 'js-cookie';
import { SupabaseClient } from '@supabase/supabase-js';

const ACCESS_TOKEN_COOKIE_KEY = 'access_token';

const getOptionsWithAuth = (options?: UnfetchRequestInit) => ({
  ...options,
  headers: {
    ...options?.headers,
    Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN_COOKIE_KEY)}`,
  },
});

/**
 * If an API call fails attempt to refresh the session and retry.
 */
export const createAuthenticatedFetch = (supabase: SupabaseClient) => {
  const signOut = async () => {
    await supabase.auth.signOut();
    Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);

    throw new Error('Unauthorized');
  };

  const handleAuth = async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession) {
      signOut();

      return;
    }

    const {
      data: { session: newSession },
    } = await supabase.auth.setSession(currentSession);

    if (!newSession?.access_token) {
      signOut();

      return;
    }

    Cookies.set(ACCESS_TOKEN_COOKIE_KEY, newSession.access_token);
  };

  const authenticatedFetch = async (
    url: string | URL,
    options?: UnfetchRequestInit,
    _retried?: boolean,
  ): Promise<UnfetchResponse> => {
    const res = await fetch(url, getOptionsWithAuth(options));

    if (res?.status && [401, 403].includes(res.status)) {
      if (_retried) {
        await signOut();
      }

      await handleAuth();

      return authenticatedFetch(url, options, true);
    }

    return res;
  };

  return authenticatedFetch;
};
