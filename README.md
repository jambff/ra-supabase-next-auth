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

## Fetching

The authentication process will add an `access_token` cookie that can be used
in any subsequent requests that require authentication.

The library also exports a `createAuthenticatedFetch()` function that can be
used from your data provider. It creates a `fetch()` implementation that appends
the `Authorization` header to any requests and, if a request fails with a 401 or
403 status code, refreshes the Supabase session before trying again.

```ts
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const authenticatedFetch = createAuthenticatedFetch();
const res = await authenticatedFetch('http://api.com/example', { method: 'POST' });

await res.json();
```