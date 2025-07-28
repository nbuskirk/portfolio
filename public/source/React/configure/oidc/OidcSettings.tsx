import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoaderFunction, redirect, useLoaderData } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { loadCanAccess } from 'lib/loadCanAccess';
import useQueryOidcConfig, {
  queryOidcConfig
} from 'data-hooks/oidc/useQueryOidcConfig';
import { OIDC_CONFIG } from 'constants/queryKeys';
import { OidcConfig } from 'data-hooks/oidc/oidcConfig.types';
import OidcConfigForm from './OidcConfigForm';
import ServerCertification from './ServerCertification/ServerCertification';
import PublicKeys from './PublicKeys/PublicKeys';

const OidcSettings = () => {
  const theme = useTheme();

  const { data: oidcConfigInitial, dataUpdatedAt } = useQueryOidcConfig({
    initialData: useLoaderData() as OidcConfig
  });

  return (
    <>
      <Helmet>
        <title>OIDC</title>
      </Helmet>
      <Stack direction='column' width='100%'>
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral.dark500}`,
            bgcolor: theme.palette.white.main,
            marginBottom: 5
          }}
        >
          <Typography
            display='flex'
            alignItems='center'
            sx={{
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
              padding: '14px 22px 14px 22px',
              fontWeight: 600,
              lineHeight: '22px'
            }}
          >
            OIDC
          </Typography>
          <OidcConfigForm
            key={dataUpdatedAt}
            oidcConfigInitial={oidcConfigInitial}
          />
        </Box>

        <Accordion sx={{ padding: '0 15px 0 20px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight='bold'>Server Certification</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ marginBottom: '1em' }}>
            <ServerCertification
              serverCertificates={oidcConfigInitial?.server_certificates ?? []}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ padding: '0 15px 0 20px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight='bold'>Public Keys</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ marginBottom: '1em' }}>
            <PublicKeys publicKeys={oidcConfigInitial?.public_keys ?? []} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
};

export default OidcSettings;

export const oidcSettingsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('admin') || !OIDC_UI_FEATURE_ENABLED) {
      return redirect('..');
    }

    // TODO! use queryClient.ensureQueryData
    return (
      queryClient.getQueryData([OIDC_CONFIG]) ??
      (await queryClient.fetchQuery({
        queryKey: [OIDC_CONFIG],
        queryFn: queryOidcConfig
      }))
    );
  };
