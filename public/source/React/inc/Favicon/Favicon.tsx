import { useCustomAssets } from 'lib/context/CustomAssetContext';
import { Helmet } from 'react-helmet-async';

/*
  Include the Favicon from Theme.
*/
const Favicon = (): JSX.Element | false => {
  const assets = useCustomAssets();
  return (
    <Helmet>
      <link
        rel='icon'
        href={assets.icons.favicon.icon}
        type={assets.icons.favicon.type}
      />
    </Helmet>
  );
};

export default Favicon;
