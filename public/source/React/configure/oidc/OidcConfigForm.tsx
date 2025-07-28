import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  InputLabel,
  Switch,
  TextField,
  useTheme
} from '@mui/material';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { OidcConfig } from 'data-hooks/oidc/oidcConfig.types';
import useMutateUpdateOidcConfig from 'data-hooks/oidc/useMutateUpdateOidcConfig';
import { ChangeEvent, useState } from 'react';

interface Props {
  oidcConfigInitial: any;
}

const OidcConfigForm = ({ oidcConfigInitial }: Props) => {
  const [oidcConfig, setOidcConfig] = useState<OidcConfig>(oidcConfigInitial);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const { showSuccessSnackbar } = useSnackbarContext();
  const theme = useTheme();

  const { mutate } = useMutateUpdateOidcConfig();

  const save = () => {
    setIsSaveLoading(true);
    mutate(
      {
        oidc_enabled: oidcConfig.oidc_enabled!,
        realm: oidcConfig.realm!,
        base_url: oidcConfig.base_url!
      },
      {
        onSuccess: () => {
          showSuccessSnackbar('Success: Saved OIDC Config');
        },
        onSettled: () => {
          setIsSaveLoading(false);
        }
      }
    );
  };

  return (
    <Box
      sx={{
        padding: '14px 22px 0 22px'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={5}>
          <Box
            sx={{
              paddingBottom: '14px',
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(oidcConfig?.oidc_enabled)}
                  onClick={() =>
                    setOidcConfig({
                      ...oidcConfig,
                      oidc_enabled: !oidcConfig.oidc_enabled
                    })
                  }
                />
              }
              label='Enable OIDC'
              sx={{ marginBottom: 1 }}
            />

            <InputLabel>URL</InputLabel>
            <TextField
              sx={{
                width: '100%',
                marginBottom: '1em',
                marginRight: '1em'
              }}
              value={oidcConfig?.base_url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOidcConfig({ ...oidcConfig, base_url: e.target.value })
              }
            />

            <InputLabel>Realm ID</InputLabel>
            <TextField
              sx={{
                width: '100%',
                marginBottom: '1em',
                marginRight: '1em'
              }}
              value={oidcConfig?.realm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOidcConfig({ ...oidcConfig, realm: e.target.value })
              }
            />
          </Box>

          <Box
            sx={{
              float: 'right',
              padding: '14px 0'
            }}
          >
            <Button
              variant='outlined'
              sx={{ marginRight: 2 }}
              onClick={() => setOidcConfig(oidcConfigInitial)}
              disabled={oidcConfig === oidcConfigInitial}
            >
              Discard Changes
            </Button>
            <LoadingButton
              variant='contained'
              onClick={() => save()}
              disabled={oidcConfig === oidcConfigInitial}
              loading={isSaveLoading}
            >
              Save
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OidcConfigForm;
