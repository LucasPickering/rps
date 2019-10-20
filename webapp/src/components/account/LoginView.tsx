import React from 'react';
import PageLayout from 'components/common/PageLayout';
import GoogleLoginButton from './GoogleLoginButton';
import PasswordLoginForm from './PasswordLoginForm';

const LoginView: React.FC = () => {
  return (
    <PageLayout maxWidth="xs" restriction="notLoggedIn">
      <PasswordLoginForm>
        <GoogleLoginButton />
      </PasswordLoginForm>
    </PageLayout>
  );
};

export default LoginView;
