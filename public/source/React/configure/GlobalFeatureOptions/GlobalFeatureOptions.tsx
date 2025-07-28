import { Container, Divider, Typography, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';
import useIsVendor from 'hooks/useIsVendor';
import { QueryClient } from '@tanstack/react-query';
import { loadCanAccess } from 'lib/loadCanAccess';
import { LoaderFunction, redirect } from 'react-router-dom';
import { getCustomizationQuery } from 'data-hooks/config/useCustomization';
import YARAFeatureOption from './components/YARAFeatureOption';
import DellDBAFeatureOption from './components/DellDBAFeatureOption';
import sx from './global-feature-options.module.scss';

const GlobalOptions = () => {
  const theme = useTheme();
  const intl = useIntl();

  const { vendor: vendorIsDell } = useIsVendor('dell');

  return (
    <Container
      className={sx.body}
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        background: theme.palette.white.main
      }}
    >
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'globalfeatureoptions.title' })}
        </title>
      </Helmet>
      <Typography
        sx={{
          margin: '0 -20px',
          padding: '0 20px 14px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.12)'
        }}
        fontSize={16}
        fontWeight={600}
        lineHeight='22px'
        variant='h1'
      >
        {intl.formatMessage({ id: 'globalfeatureoptions.title' })}
      </Typography>
      {vendorIsDell && (
        <>
          <DellDBAFeatureOption />
          <Divider />
        </>
      )}
      <YARAFeatureOption />
    </Container>
  );
};

export default GlobalOptions;

export const globalFeatureOptionsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    await queryClient.ensureQueryData(getCustomizationQuery());
    const canAccess = await loadCanAccess(queryClient);
    if (!(canAccess('policyjob') || canAccess('alertmgmt'))) {
      return redirect('..');
    }
    return null;
  };
