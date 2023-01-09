import { FC, ReactNode } from 'react';
import { Login } from 'react-admin';

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
}: AuthLayoutProps) => (
  <Login
    sx={{
      backgroundImage:
        'radial-gradient(circle farthest-corner at 0% 100%, #ff0090, #fd8624)',
    }}>
    {children}
  </Login>
);
