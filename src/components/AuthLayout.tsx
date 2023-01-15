import { FC, ReactNode } from 'react';
import { Login } from 'react-admin';

type AuthLayoutProps = {
  children: ReactNode;
  background?: string;
  backgroundImage?: string;
};

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  background,
  backgroundImage,
}: AuthLayoutProps) => (
  <Login backgroundImage={backgroundImage} sx={{ background }}>
    {children}
  </Login>
);
