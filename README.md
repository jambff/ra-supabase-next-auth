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
import type { NextPage } from 'next';

export default AuthPage;
```

Set the `authProvider` and `loginPage` in your React Admin `App.tsx` component, like so:

```tsx
import { FC } from 'react';
import { Admin } from 'react-admin';
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

## Tokens

The authentication process will add an `access_token` cookie that can be used
in any subsequent requests that require authentication.
