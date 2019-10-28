import React from 'react';
import useSplashMessage, { notFoundSplashes } from 'hooks/useSplashMessage';
import PageLayout from './common/PageLayout';

const NotFoundView: React.FC = () => {
  const message = useSplashMessage(notFoundSplashes);
  return <PageLayout title="Not Found" subtitle={message} />;
};

export default NotFoundView;
