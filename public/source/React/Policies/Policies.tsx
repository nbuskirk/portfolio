import Layout from 'components/layout';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  children: ReactNode;
}

const Policies = ({ children }: Props): ReactNode => {
  return (
    <Layout>
      <Helmet>
        <title>Policies</title>
      </Helmet>
      {children}
    </Layout>
  );
};

export default Policies;
