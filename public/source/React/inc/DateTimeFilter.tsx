import { DateRange } from '@mui/lab';
import { Box } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid-premium';
import {
  DateRangePicker,
  SingleInputDateRangeField
} from '@mui/x-date-pickers-pro';
import { useId, useImperativeHandle, useRef } from 'react';
import { parseISO } from 'date-fns';

/*
  This is an uncontrolled component based on the default implementation
  for the filter system.
*/
const DateTimeFilter = ({
  item,
  applyValue,
  focusElementRef
}: GridFilterInputValueProps) => {
  const id = useId();
  const datetimeRef = useRef<HTMLDivElement | null>(null);

  // Parse dates if they're strings and create a DateRange tuple
  const getDateValue = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return parseISO(value.toString());
  };
  const defaultValue: DateRange<Date> | undefined = item?.value
    ? [getDateValue(item.value[0]), getDateValue(item.value[1])]
    : undefined;

  useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      datetimeRef.current
        ?.querySelector<HTMLInputElement>(`#${CSS.escape(id)}`)
        ?.focus();
    }
  }));

  const handleFilterChange = (newValue: DateRange<Date> | null) => {
    // Only apply the filter if both dates in the range are present
    if (newValue && !newValue.some((v) => v === null)) {
      applyValue({ ...item, value: newValue });
    }
  };

  return (
    <Box>
      <DateRangePicker
        ref={datetimeRef}
        label='Value'
        defaultValue={defaultValue}
        slots={{ field: SingleInputDateRangeField }}
        onChange={handleFilterChange}
        slotProps={{
          textField: {
            variant: 'standard',
            sx: {
              width: '100%'
            },
            id
          }
        }}
      />
    </Box>
  );
};

export default DateTimeFilter;
