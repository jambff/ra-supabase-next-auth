import { FC, ReactNode } from 'react';
import { Button, useTheme } from '@mui/material';

type AuthSecondaryButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export const AuthSecondaryButton: FC<AuthSecondaryButtonProps> = ({
  onClick,
  children,
}: AuthSecondaryButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        display: 'flex',
        margin: `${theme.spacing(2)} auto 0px auto`,
      }}>
      {children}
    </Button>
  );
};
