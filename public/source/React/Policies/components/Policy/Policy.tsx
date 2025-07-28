import { useParams } from 'react-router';
import Layout from 'components/layout';

const Policy = () => {
  const { id } = useParams();
  return (
    <Layout>
      <p>Showing Policy: {id}</p>
    </Layout>
  );
};

export default Policy;
