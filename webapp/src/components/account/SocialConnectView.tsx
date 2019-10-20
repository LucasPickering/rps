import React from 'react';
import PageLayout from 'components/common/PageLayout';
import GoogleLoginButton from './GoogleLoginButton';
import Form from 'components/common/Form';

const SocialConnectView: React.FC = () => {
  return (
    <PageLayout maxWidth="xs" restriction="loggedIn">
      <Form>
        <GoogleLoginButton connect />
      </Form>
    </PageLayout>
  );
};

export default SocialConnectView;
