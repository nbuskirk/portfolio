import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListSubheader,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers-pro';
import { ReactNode } from 'react';
import { getHours, getMinutes, set } from 'date-fns';
import { PolicySchedule } from './types';

type SetPolicySchedule = <T extends keyof PolicySchedule>(
  memberName: T,
  memberValue: PolicySchedule[T]
) => void;

interface Props {
  disabled?: boolean;
  policySchedule: PolicySchedule;
  setPolicySchedule: SetPolicySchedule;
}

const ScheduleInput = ({
  disabled = false,
  policySchedule,
  setPolicySchedule
}: Props): ReactNode => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        border: `1px solid ${theme.palette.neutral.dark400}`,
        borderRadius: '3px',
        padding: '1em'
      }}
      alignItems='flex-start'
      spacing='0.5em'
    >
      <Typography fontSize='14px' fontWeight={600}>
        Schedule
      </Typography>
      <FormControlLabel
        disabled={disabled}
        checked={policySchedule.scheduleEnabled}
        onChange={(_e, checked) => {
          setPolicySchedule('scheduleEnabled', checked);
        }}
        slotProps={{
          typography: {
            sx: {
              fontSize: '14px',
              paddingRight: '4px'
            }
          }
        }}
        control={<Switch />}
        label='Schedule Policy'
      />
      <RadioGroup
        name='frequency'
        value={policySchedule.frequency}
        onChange={(e) => {
          setPolicySchedule(
            'frequency',
            e.target.value as PolicySchedule['frequency']
          );
        }}
      >
        <List
          subheader={
            <ListSubheader
              sx={{
                padding: '0',
                lineHeight: '19px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.palette.dark.main
              }}
              component='div'
              id='frequency-header'
            >
              Frequency
            </ListSubheader>
          }
        >
          <ListItem
            sx={{
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FormControlLabel
              disabled={disabled || !policySchedule.scheduleEnabled}
              value='hourly'
              control={<Radio />}
              label='Hourly'
              sx={{
                minWidth: '100px'
              }}
              slotProps={{
                typography: {
                  sx: {
                    fontSize: '14px'
                  }
                }
              }}
            />
            <Stack
              minWidth='220px'
              direction='row'
              gap='8px'
              alignItems='center'
            >
              <Typography
                fontSize='14px'
                textAlign='right'
                sx={{ minWidth: '21px' }}
              >
                every
              </Typography>
              <TextField
                disabled={
                  disabled ||
                  !policySchedule.scheduleEnabled ||
                  policySchedule.frequency !== 'hourly'
                }
                type='number'
                variant='outlined'
                value={policySchedule.hourly.hours}
                InputProps={{
                  inputProps: {
                    max: 23,
                    min: 1,
                    step: 1
                  }
                }}
                onChange={(e) => {
                  const { value, min, max } = e.target as unknown as {
                    value: string;
                    min: number;
                    max: number;
                  };
                  const sanitizedHours = Math.max(
                    Number(min),
                    Math.min(max, Number(value))
                  );
                  setPolicySchedule('hourly', {
                    ...policySchedule.hourly,
                    hours: sanitizedHours
                  });
                }}
              />
              <Typography fontSize='14px'>hour(s)</Typography>
            </Stack>
            <Typography fontSize='14px'>at</Typography>
            <TextField
              disabled={
                disabled ||
                !policySchedule.scheduleEnabled ||
                policySchedule.frequency !== 'hourly'
              }
              type='number'
              variant='outlined'
              value={policySchedule.hourly.mins}
              InputProps={{
                inputProps: {
                  max: 59,
                  min: 0,
                  step: 1
                }
              }}
              onChange={(e) => {
                const { value, min, max } = e.target as unknown as {
                  value: string;
                  min: number;
                  max: number;
                };
                const sanitzedMins = Math.max(
                  Number(min),
                  Math.min(max, Number(value))
                );
                setPolicySchedule('hourly', {
                  ...policySchedule.hourly,
                  mins: sanitzedMins
                });
              }}
            />
            <Typography fontSize='14px'>Minutes past the hour</Typography>
          </ListItem>
          <ListItem
            sx={{
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FormControlLabel
              disabled={disabled || !policySchedule.scheduleEnabled}
              value='daily'
              control={<Radio />}
              label='Daily'
              sx={{
                minWidth: '100px'
              }}
              slotProps={{
                typography: {
                  sx: {
                    fontSize: '14px'
                  }
                }
              }}
            />
            <Stack
              minWidth='220px'
              direction='row'
              gap='8px'
              alignItems='center'
            >
              <Typography
                fontSize='14px'
                textAlign='right'
                sx={{ minWidth: '21px' }}
              >
                every
              </Typography>

              <FormControl
                component='fieldset'
                disabled={
                  disabled ||
                  !policySchedule.scheduleEnabled ||
                  policySchedule.frequency !== 'daily'
                }
              >
                <FormGroup row>
                  {(
                    [
                      'monday',
                      'tuesday',
                      'wednesday',
                      'thursday',
                      'friday',
                      'saturday',
                      'sunday'
                    ] as const
                  ).map((day) => (
                    <Tooltip
                      key={day}
                      title={day[0].toUpperCase() + day.slice(1)}
                      arrow
                      placement='bottom'
                    >
                      <FormControlLabel
                        checked={policySchedule.daily.days?.[day] ?? false}
                        onChange={(_, checked) => {
                          setPolicySchedule('daily', {
                            ...policySchedule.daily,
                            days: {
                              ...policySchedule.daily.days,
                              [day]: checked
                            }
                          });
                        }}
                        sx={{
                          '.MuiCheckbox-root': {
                            padding: 0
                          },
                          margin: '0 2px',
                          '.MuiFormControlLabel-label': {
                            paddingLeft: 0,
                            marginBottom: '-4px'
                          }
                        }}
                        label={day[0].toUpperCase()}
                        labelPlacement='top'
                        control={<Checkbox size='small' />}
                      />
                    </Tooltip>
                  ))}
                </FormGroup>
              </FormControl>
            </Stack>
            <Typography fontSize='14px'>at</Typography>
            <TimeField
              disabled={
                disabled ||
                !policySchedule.scheduleEnabled ||
                policySchedule.frequency !== 'daily'
              }
              value={set(new Date(), {
                hours: policySchedule.daily.hour,
                minutes: policySchedule.daily.min
              })}
              onChange={(time) => {
                if (time !== null) {
                  const min = getMinutes(time);
                  const hour = getHours(time);
                  setPolicySchedule('daily', {
                    ...policySchedule.daily,
                    min,
                    hour
                  });
                }
              }}
              formatDensity='dense'
              size='small'
              format='hh:mm a'
              sx={{
                width: '100px',
                '.MuiInputBase-root': { padding: 0 }
              }}
            />
          </ListItem>
        </List>
      </RadioGroup>
    </Stack>
  );
};

export default ScheduleInput;
