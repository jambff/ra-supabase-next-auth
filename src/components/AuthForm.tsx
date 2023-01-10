import { CardContent } from '@mui/material';
import { Form } from 'react-admin';
import { FC, ReactNode } from 'react';

type AuthFormProps = {
  onSubmit?: (formData: Record<string, any>) => void;
  validate?: (formData: Record<string, any>) => Object;
  children: ReactNode;
  className?: string;
};

export const AuthForm: FC<AuthFormProps> = ({
  children,
  className,
  onSubmit,
  validate,
}: AuthFormProps) => (
  <Form
    onSubmit={onSubmit}
    mode="onChange"
    validate={validate}
    noValidate={!validate}
    className={className}>
    <CardContent sx={{ width: '400px' }}>{children}</CardContent>
  </Form>
);
