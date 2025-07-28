import {
  DateRange,
  DateRangePicker as DRP,
  SingleInputDateRangeField
} from '@mui/x-date-pickers-pro';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DateRangePicker = ({
  start,
  end,
  handleChange
}: {
  start: Date;
  end: Date;
  handleChange: (value: DateRange<Date>) => void;
}) => {
  return (
    <DRP
      format='MMMM dd, yyyy'
      defaultValue={[start, end]}
      slots={{ field: SingleInputDateRangeField }}
      onChange={handleChange}
      slotProps={{
        textField: {
          InputProps: { endAdornment: <CalendarTodayIcon /> },
          variant: 'outlined',
          sx: {
            width: '350px'
          }
        }
      }}
    />
  );
};

export default DateRangePicker;
