import Cookies from 'js-cookie';
import { AuthProvider, UserIdentity } from 'react-admin';
import { ACCESS_TOKEN_COOKIE_KEY, AUTH_TYPE_COOKIE_KEY } from './constants';
import { getSupabaseClientIfExists } from './supabase';

const supabase = getSupabaseClientIfExists();

if (!supabase) {
  console.warn('Missing Supabase credentials - authentication disabled.');
}

export const authProvider: AuthProvider | undefined = !supabase
  ? undefined
  : {
      login: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        const { access_token: accessToken, refresh_token: refreshToken } =
          data.session ?? {};

        if (!accessToken) {
          throw new Error();
        }

        if (!refreshToken) {
          throw new Error();
        }

        Cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken);
      },
      logout: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
      },
      checkError: async ({ status }) => {
        if ([401, 403].includes(status)) {
          throw new Error();
        }
      },
      checkAuth: async () => {
        // The user has been sent an invite or recovery link. Remove any stored
        // access token to ultimately take them through the password reset flow.
        if (Cookies.get(AUTH_TYPE_COOKIE_KEY)) {
          Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
        }

        if (!Cookies.get(ACCESS_TOKEN_COOKIE_KEY)) {
          throw new Error();
        }
      },
      getPermissions: async () => ['fake-role'],
      getIdentity: async (): Promise<UserIdentity> => {
        const {
          data: { user },
          error: getUserError,
        } = await supabase.auth.getUser();

        if (getUserError) {
          throw getUserError;
        }

        if (!user) {
          throw new Error();
        }

        return {
          id: user.id,
          fullName: user.email,
        };
      },
    };
