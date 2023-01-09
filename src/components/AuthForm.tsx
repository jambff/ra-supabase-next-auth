import { styled } from '@mui/material/styles';
import { CardContent } from '@mui/material';
import { Form } from 'react-admin';
import { FC, ReactNode } from 'react';

type AuthFormProps = {
  onSubmit?: (formData: Record<string, any>) => void;
  validate?: (formData: Record<string, any>) => Object;
  children: ReactNode;
  className?: string;
};

const PREFIX = 'RaAuthForm';

const LoginFormClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
  link: `${PREFIX}-link`,
};

const StyledForm = styled(Form, {
  name: PREFIX,
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  [`& .${LoginFormClasses.content}`]: {
    width: 400,
  },
  [`& .${LoginFormClasses.button}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${LoginFormClasses.link}`]: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

export const AuthForm: FC<AuthFormProps> = ({
  children,
  className,
  onSubmit,
  validate,
}: AuthFormProps) => (
  <StyledForm
    onSubmit={onSubmit}
    mode="onChange"
    validate={validate}
    noValidate={!validate}
    className={className}>
    <CardContent className={LoginFormClasses.content}>{children}</CardContent>
  </StyledForm>
);
