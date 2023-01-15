import { FC } from 'react';
import { AuthLayout } from './AuthLayout';
import { DynamicAuthForm } from './DynamicAuthForm';

type LoginPageProps = {
  redirectTo?: string;
  className?: string;
  background?: string;
  backgroundImage?: string;
};

export const LoginPage: FC<LoginPageProps> = ({
  redirectTo,
  className,
  background,
  backgroundImage,
}: LoginPageProps) => (
  <AuthLayout background={background} backgroundImage={backgroundImage}>
    <DynamicAuthForm redirectTo={redirectTo} className={className} />
  </AuthLayout>
);
