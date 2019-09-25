import React from 'react';
import PageLayout from 'components/common/PageLayout';
import GoogleLoginButton from './GoogleLoginButton';
import PasswordLoginForm from './PasswordLoginForm';
import LoginRedirect from './LoginRedirect';

const LoginView: React.FC = () => {
  return (
    <PageLayout maxWidth="xs">
      <LoginRedirect />
      <PasswordLoginForm>
        <GoogleLoginButton />
      </PasswordLoginForm>
    </PageLayout>
  );
};

export default LoginView;
