# React Admin Supabase Next Auth

Integrate [React Admin](https://marmelab.com/react-admin/) with
[Supabase Auth](https://supabase.com/auth) for
[Next.js](https://nextjs.org/) applications.

## Installation

```text
yarn add @jambff/ra-supabase-next-auth
```

Also be sure to install all peer dependencies.

## Setup

In your Supabase project settings go to Authentication > URL Configuration and
add `/auth` to your "Site URL", for example:

```text
http://my.site.com/auth
```

Add a file to your Next.js pages folder at `pages/auth.ts` containing the following:

```ts
import { AuthPage } from '@jambff/ra-supabase-next-auth';

export default AuthPage;
```

Or, if you are using a custom `basename` to serve your admin pages:

```tsx
import { AuthPage } from '@jambff/ra-supabase-next-auth';

const Page = () => <AuthPage basename="/admin" />;

export default Page;
```

Set the `authProvider` and `loginPage` in your React Admin `App.tsx` component, like so:

```tsx
import { FC } from 'react';
import { Admin } from 'react-admin';
import { createClient } from '@supabase/supabase-js';
import { LoginPage, createAuthProvider } from '@jambff/ra-supabase-next-auth';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const authProvider = createAuthProvider(supabase);

const App: FC = () => (
  <Admin
    authProvider={authProvider}
    loginPage={LoginPage}
  >
    <Resource
      name="my-stuff"
    />
  </Admin>
);

export default App;
```

## Authentication

The authentication process will add an `access_token` cookie that can be used
in any subsequent requests that require authentication.

The [`@jambff/supabase-auth-fetch`](https://github.com/jambff/supabase-auth-fetch)
package can be used to generate a fetch client the uses this token.

## Identity

By default this library will create user identity objects with an `id` and
`fullName`, which is populated with the user's email.

If you have additional user data in a separate Supabase table you can merge this
into the user's identity object by passing in a `getIdentity()` function when
creating the auth provider, for example:

```tsx
import { createClient, User } from '@supabase/supabase-js';
import { createAuthProvider } from '@jambff/ra-supabase-next-auth';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const authProvider = createAuthProvider(supabase, {
  getIdentity: async (supabaseUser: User) => {
    const { data, error } = await supabase
      .from('User')
      .select('name, role')
      .eq('guid', supabaseUser.id);

    const { name, role } = data?.[0] ?? {};
    const { id, email } = supabaseUser;

    return {
      id,
      fullName: name ?? email,
      email,
      role,
    };
  },
});
```

The data you return will be attached to the `profile` attribute of the user's
identity object.

## Roles

If the object you return from your custom `getIdentity()` function includes a
`role` property the value of this property will be made available via React
Admin's `usePermissions()` hook
(see [Permissions](https://marmelab.com/react-admin/Permissions.html)).

Additionally, if you pass in an `acceptedRoles` property when creating the
auth provider only users with those roles will be allowed in, for example:

```tsx
import { createClient, User } from '@supabase/supabase-js';
import { createAuthProvider } from '@jambff/ra-supabase-next-auth';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const authProvider = createAuthProvider(supabase, {
  acceptedRoles: ['admin', 'editor'],
  getIdentity: async (supabaseUser: User) => {
    // Get real identity
    return { role: 'admin' };
  },
});
```
