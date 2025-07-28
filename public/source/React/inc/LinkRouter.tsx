import { Link, LinkProps } from '@mui/material';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom';

type Props = LinkProps & RouterLinkProps;

const LinkRouter = (props: Props) => {
  return <Link {...props} component={RouterLink} />;
};

export default LinkRouter;
