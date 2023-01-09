import { FC } from 'react';
import { AuthLayout } from './AuthLayout';
import { DynamicAuthForm } from './DynamicAuthForm';

type LoginPageProps = {
  redirectTo?: string;
  className?: string;
};

export const LoginPage: FC<LoginPageProps> = ({
  redirectTo,
  className,
}: LoginPageProps) => (
  <AuthLayout>
    <DynamicAuthForm redirectTo={redirectTo} className={className} />
  </AuthLayout>
);
