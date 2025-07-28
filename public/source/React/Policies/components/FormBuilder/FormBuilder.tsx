import { FormEventHandler, ReactNode, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  InputBase,
  Paper,
  Stack,
  TextFieldProps,
  Typography,
  useTheme
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavigateNext } from '@mui/icons-material';
import LinkRouter from 'components/inc/LinkRouter';
import FormRenderer from './FormRenderer';
import { DEMO_JSON } from './demo.schema';
// eslint-disable-next-line
import { JsonTemplateSchema } from './schema.types';
import { MemberData } from '../PolicyEditor/types';
import {
  buildMemberDataStructureFromTemplate,
  formMembersIsValid,
  splitOffTransitionMembers
} from '../PolicyEditor/util';
// eslint-disable-next-line
import SchemaContactDocs from './schema.types.ts?raw';
import TransitionModalMember, {
  ModalTransitionState
} from './members/TransitionModalMember';

const FormBuilder = (): ReactNode => {
  const theme = useTheme();
  const [json, setJson] = useState<string>(DEMO_JSON);
  const [parsedJson, setParsedJson] = useState<JsonTemplateSchema>();
  const [error, setError] = useState<Error>();
  const [memberData, setMemberData] = useState<MemberData>({});
  const [payload, setPayload] = useState<string>();
  const [modalTransitionState, setModalTransitionState] = useState<
    Omit<ModalTransitionState, 'close'>
  >({
    open: false,
    state: 'transition'
  });

  const closeTransitionModal = () => {
    setModalTransitionState((s) => ({
      ...s,
      open: false
    }));
  };

  useEffect(() => {
    setError(undefined);
    try {
      const result: JsonTemplateSchema = JSON.parse(json);
      setParsedJson(result);
      setMemberData(buildMemberDataStructureFromTemplate(result));
    } catch (e) {
      setError(e as Error);
    }
  }, [json]);

  const handleChange: TextFieldProps['onChange'] = (event) => {
    setJson(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (parsedJson === undefined) {
      return;
    }
    const isValid = formMembersIsValid(parsedJson, memberData);
    if (!isValid) {
      return;
    }
    try {
      setPayload(JSON.stringify(memberData, null, 2));
    } catch (e) {
      setError(e as Error);
    }
  };

  const handleChangeMemberData = (
    memberName: string,
    memberValue: MemberData[string]
  ) => {
    setMemberData((oldMemberData) => {
      return {
        ...oldMemberData,
        [memberName]: memberValue
      };
    });
  };

  const triggerTransition = (state: ModalTransitionState['state']) => () => {
    setModalTransitionState((s) => ({
      ...s,
      state: 'transition',
      open: true
    }));

    setTimeout(() => {
      setModalTransitionState((s) => ({
        ...s,
        state
      }));
    }, 4_000);
  };

  const { jsonTemplateSchema, transitionMembers } =
    splitOffTransitionMembers(parsedJson);

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Paper
          sx={{
            boxShadow: 'none'
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
              padding: '1em'
            }}
          >
            <Typography fontSize='16px' fontWeight='600'>
              Form Builder
            </Typography>
            <Breadcrumbs
              sx={{
                '.MuiBreadcrumbs-separator': {
                  margin: '4px'
                }
              }}
              separator={<NavigateNext sx={{ fontSize: '14px' }} />}
            >
              <LinkRouter
                underline='hover'
                to='..'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                Policies
              </LinkRouter>
              <Typography
                fontSize='12px'
                fontWeight='600'
                color={theme.palette.primary.main}
              >
                Form Builder
              </Typography>
            </Breadcrumbs>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container sx={{ p: 2 }} spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  This page will help you build forms for the custom module
                  system. Click the &#39;submit&#39; button to see the payload
                  output.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    sx={{ fontWeight: 600 }}
                    expandIcon={<ExpandMore />}
                  >
                    JSON Typescript Schema Contract
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ fontSize: '12px' }}>{SchemaContactDocs}</pre>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  sx={{
                    width: '100%'
                  }}
                >
                  <FormLabel>JSON Structure</FormLabel>
                  <InputBase
                    multiline
                    rows={10}
                    value={json}
                    sx={{
                      fontFamily: 'monospace !important',
                      padding: '8px',
                      fontSize: '0.875rem',
                      border: '1px solid #000'
                    }}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert
                    severity='error'
                    variant='outlined'
                    sx={{
                      border: '1px solid rgb(229, 115, 115)',
                      color: 'rgb(229, 115, 115)',
                      fontWeight: 800
                    }}
                  >
                    Unable to parse JSON structure. {error?.message}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {!error && parsedJson && (
                <Grid item xs={12}>
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    sx={{ marginBottom: 2 }}
                  >
                    Rendered Form
                  </Typography>
                  {jsonTemplateSchema !== undefined && (
                    <FormRenderer
                      jsonTemplateSchema={jsonTemplateSchema}
                      disabled={false}
                      memberData={memberData}
                      changeMemberData={handleChangeMemberData}
                    />
                  )}
                  {transitionMembers !== undefined &&
                    transitionMembers.length > 0 && (
                      <TransitionModalMember
                        {...modalTransitionState}
                        close={closeTransitionModal}
                        {...transitionMembers[0].props}
                      />
                    )}
                  <Stack
                    direction='row'
                    justifyContent='flex-end'
                    gap='15px'
                    sx={{ marginTop: '10px' }}
                  >
                    <Button onClick={triggerTransition('error')}>
                      Trigger Transition: Error
                    </Button>
                    <Button onClick={triggerTransition('success')}>
                      Trigger Transition: Success
                    </Button>
                    <Button type='submit' variant='contained'>
                      Submit
                    </Button>
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {!error && payload !== undefined && (
                <Grid item xs={12}>
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    sx={{ marginBottom: 2 }}
                  >
                    Submit Payload
                  </Typography>
                  <pre>{payload}</pre>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export { FormBuilder as Component };
