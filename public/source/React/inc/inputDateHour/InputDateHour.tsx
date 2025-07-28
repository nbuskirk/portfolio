import { useState, useRef, ReactNode } from 'react';

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Popover,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  BaseSelectProps
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

import { SELECT_MENU_PROPS } from 'constants/constants';
import sx from './input-date-hour.module.scss';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

const isDay = (value: unknown): value is (typeof DAYS)[number] => {
  if (typeof value === 'string') {
    return DAYS.includes(value as any);
  }
  return false;
};

const HOURS = [
  '12 am',
  '1 am',
  '2 am',
  '3 am',
  '4 am',
  '5 am',
  '6 am',
  '7 am',
  '8 am',
  '9 am',
  '10 am',
  '11 am',
  '12 pm',
  '1 pm',
  '2 pm',
  '3 pm',
  '4 pm',
  '5 pm',
  '6 pm',
  '7 pm',
  '8 pm',
  '9 pm',
  '10 pm',
  '11 pm'
] as const;

const isHour = (value: unknown): value is (typeof HOURS)[number] => {
  if (typeof value === 'string') {
    return HOURS.includes(value as any);
  }
  return false;
};

export interface IEDate {
  day: (typeof DAYS)[number];
  hour: (typeof HOURS)[number];
}

interface Props {
  label?: string;
  id: string;
  onChange: (date: IEDate) => void;
  date: IEDate;
  disabled?: boolean;
}

const InputDateHour = ({
  label = '',
  id,
  onChange = () => {},
  date: initialDate,
  disabled = false
}: Props): ReactNode => {
  const theme = useTheme();
  const [popoverIsOpen, setPopOverIsOpen] = useState(false);
  const [date, setDate] = useState(initialDate);
  const inputRef = useRef();

  const handleDayChange: BaseSelectProps['onChange'] = (e) => {
    const { value } = e.target;
    if (isDay(value)) {
      setDate((oldDate) => ({
        ...oldDate,
        day: value
      }));
    }
  };

  const handleHourChange: BaseSelectProps['onChange'] = (e) => {
    const { value } = e.target;
    if (isHour(value)) {
      setDate((oldDate) => ({
        ...oldDate,
        hour: value
      }));
    }
  };

  const handleIsOpen = (isOpen: boolean) => {
    setPopOverIsOpen(isOpen);
  };

  const closePopOver = () => {
    setPopOverIsOpen(false);
    onChange(date);
  };

  return (
    <>
      <FormControl variant='outlined' fullWidth>
        <InputLabel shrink htmlFor={id}>
          <span>
            <span>{label}</span>
          </span>
        </InputLabel>
        <OutlinedInput
          inputRef={inputRef}
          sx={{ cursor: 'pointer!important', paddingRight: 0 }}
          notched={false}
          placeholder='Select day and hour'
          value={date ? `${date.day} at ${date.hour}` : 'Not set'}
          id={id}
          onClick={() => handleIsOpen(!disabled)}
          readOnly
          endAdornment={
            <InputAdornment position='end'>
              <InsertInvitationIcon
                sx={{
                  color: disabled
                    ? theme.palette.neutral.primary300
                    : theme.palette.primary.main
                }}
              />
            </InputAdornment>
          }
        />
      </FormControl>
      {inputRef !== null && (
        <Popover
          id={id}
          open={popoverIsOpen}
          anchorEl={inputRef.current}
          onClose={closePopOver}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Stack className={sx.stack__dropdown}>
            <FormControl fullWidth>
              <InputLabel id={`${id}selectDayLabel`}>Day of week</InputLabel>
              <Select
                labelId={`${id}selectDayLabel`}
                id={`${id}selectDay`}
                value={date.day}
                notched={false}
                variant='outlined'
                label='Select Day'
                onChange={handleDayChange}
                MenuProps={SELECT_MENU_PROPS}
                required
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id={`${id}selectHourLabel`}>Hour</InputLabel>
              <Select
                labelId={`${id}selectHourLabel`}
                id={`${id}selectHour`}
                value={date.hour}
                notched={false}
                variant='outlined'
                label='Select Hour'
                onChange={handleHourChange}
                MenuProps={SELECT_MENU_PROPS}
                required
              >
                {HOURS.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Popover>
      )}
    </>
  );
};

export default InputDateHour;
