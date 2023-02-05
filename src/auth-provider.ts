import { SupabaseClient, User } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import { AuthProvider, UserIdentity } from 'react-admin';
import { ACCESS_TOKEN_COOKIE_KEY, AUTH_TYPE_COOKIE_KEY } from './constants';

type CreateAuthProviderOptions = {
  getIdentity?: (supabaseUser: User) => Record<string, any>;
};

export const createAuthProvider = (
  supabase: SupabaseClient,
  options: CreateAuthProviderOptions = {},
): AuthProvider => ({
  supabase,
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
      console.error(error);
    }

    Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
  },
  checkError: async ({ status }) => {
    if ([401, 403].includes(status)) {
      throw new Error('Unauthorized');
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
    const token = Cookies.get(ACCESS_TOKEN_COOKIE_KEY);

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      throw new Error('Failed to get identity.');
    }

    if (options.getIdentity) {
      return {
        ...(await options.getIdentity(user)),
        id: user.id,
      };
    }

    return {
      id: user.id,
      fullName: user.email,
    };
  },
});
