import { ReactNode, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  Radio,
  Stack,
  TextField,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  DataGridPremium,
  GridColDef,
  GridRowId
} from '@mui/x-data-grid-premium';
import DataGridQuickFilter from 'components/inc/DataGridQuickFilter';
import { TableDictionaryMemberSchema } from '../schema.types';
import { useTheme } from '@mui/material';
export const tableDictionaryIsValid = (
  value: Record<string, any> | Array<Record<string, any>>,
  isMultiple = false,
  required = true
): boolean => {
  if (!required) {
    return true;
  }
  if (isMultiple) {
    return value.length > 0;
  }
  return true;
};

type Props = Partial<TableDictionaryMemberSchema['props']> & {
  value: Record<string, string> | Array<Record<string, string>>;
  setValue: (
    value: Record<string, string> | Array<Record<string, string>>
  ) => void;
};

const TableDictionaryMember = ({
  value,
  setValue,
  label,
  required = false,
  showRequiredAsterisk = true,
  disabled = false,
  multiSelect = false,
  primaryColumnDef,
  secondaryColumnDef,
  searchPlaceholder,
  rows: inputRows
}: Props): ReactNode => {
  if (searchPlaceholder === undefined) {
    throw new Error('Missing "searchPlaceholder"');
  }
  if (label === undefined) {
    throw new Error('Missing "label"');
  }
  if (inputRows === undefined) {
    throw new Error('Missing "rows"');
  }
  if (primaryColumnDef === undefined) {
    throw new Error('Missing "primaryColumnDef"');
  }
  if (secondaryColumnDef === undefined) {
    throw new Error('Missing "secondaryColumnDef"');
  }

  const [rows, setRows] = useState(() => {
    const r: Array<Record<string, string>> = [];
    if (Array.isArray(value)) {
      inputRows.forEach((iRow) => {
        const matchedRow = value.find(
          (v) => v[primaryColumnDef.field] === iRow[primaryColumnDef.field]
        );
        if (matchedRow) {
          r.push(matchedRow);
        } else {
          r.push(iRow);
        }
      });
    } else {
      inputRows.forEach((iRow) => {
        if (value[primaryColumnDef.field] === iRow[primaryColumnDef.field]) {
          r.push(value);
        } else {
          r.push(iRow);
        }
      });
    }
    return r;
  });

  const theme = useTheme();
  const rowIdToIndex = new Map<string, number>();
  rows.forEach((row, index) => {
    rowIdToIndex.set(row[primaryColumnDef.field], index);
  });

  const selectionModel: GridRowId[] = [];

  if (Array.isArray(value)) {
    inputRows.forEach((iRow) => {
      const matchedRow = value.find(
        (v) => v[primaryColumnDef.field] === iRow[primaryColumnDef.field]
      );
      if (matchedRow) {
        selectionModel.push(matchedRow[primaryColumnDef.field]);
      }
    });
  } else {
    inputRows.forEach((iRow) => {
      if (value[primaryColumnDef.field] === iRow[primaryColumnDef.field]) {
        selectionModel.push(value[primaryColumnDef.field]);
      }
    });
  }

  const columns: GridColDef[] = [];

  if (!multiSelect) {
    columns.push({
      field: 'radio',
      headerName: '',
      width: 40,
      minWidth: 40,
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
      renderCell: ({ row, id }) => {
        const isChecked = selectionModel.includes(id);
        return (
          <FormControl component='fieldset' disabled={disabled}>
            <Radio
              checked={isChecked}
              size='small'
              onChange={(_, checked) => {
                setValue(checked ? row : undefined);
              }}
            />
          </FormControl>
        );
      }
    });
  } else {
    columns.push({
      field: 'checkbox',
      headerName: '',
      width: 40,
      minWidth: 40,
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
      renderHeader: () => {
        const selectableRows = rows.filter((row) => !row.disabled);
        const someChecked = selectionModel.length > 0;
        const allChecked = selectionModel.length === selectableRows.length;
        return (
          <FormControl component='fieldset' disabled={disabled}>
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked && !allChecked}
              onChange={() => {
                setValue(allChecked || someChecked ? [] : [...selectableRows]);
              }}
              size='small'
            />
          </FormControl>
        );
      },
      renderCell: ({ row, id }) => {
        const isChecked = selectionModel.includes(id);
        return (
          <FormControl
            component='fieldset'
            disabled={disabled || row?.disabled}
          >
            <Checkbox
              checked={isChecked}
              size='small'
              onChange={(_, checked) => {
                if (checked) {
                  const rowIsAlreadyInValue = !!(
                    value as Record<string, string>[]
                  ).find(
                    (v) =>
                      v[primaryColumnDef.field] === row[primaryColumnDef.field]
                  );
                  if (!rowIsAlreadyInValue) {
                    setValue([...(value as Record<string, string>[]), row]);
                  }
                } else {
                  setValue(
                    (value as Record<string, string>[]).filter(
                      (v) =>
                        v[primaryColumnDef.field] !==
                        row[primaryColumnDef.field]
                    )
                  );
                }
              }}
            />
          </FormControl>
        );
      }
    });
  }

  columns.push({
    field: primaryColumnDef.field,
    headerName: primaryColumnDef.headerName,
    width: 200,
    minWidth: 150
  });

  secondaryColumnDef.forEach(
    ({ field, headerName, required: colRequired, tooltipText }) => {
      columns.push({
        field,
        headerName: `${headerName} ${showRequiredAsterisk === colRequired && (colRequired ? " *" : "(optional)")}`,
        renderHeader: () => (
          <Stack direction='row' alignItems='center' spacing={0.5}>
            <Typography fontSize={12} fontWeight={600}>
              {headerName}
              {showRequiredAsterisk === colRequired && (colRequired ? ' *' : ' (optional)')}
            </Typography>
            {tooltipText && (
              <Tooltip title={tooltipText} arrow>
                <IconButton size='small'>
                  <InfoIcon fontSize='small' color='secondary' />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
        width: 500,
        minWidth: 150,
        renderCell: ({ id, row }) => {
          const isChecked = selectionModel.includes(id);
          const rowIndex = rowIdToIndex.get(row[primaryColumnDef.field]) ?? 0;
          const isEven = rowIndex % 2 === 0;
          return (
            <TextField
              sx={{
                '.MuiInputBase-input': {
                  pointerEvents: isChecked ? 'auto' : 'none',
                  backgroundColor: isEven ? '#FFFFFF' : theme.palette.neutral.secondary400,
                  borderRadius: '4px'
                },
              }}
              disabled={!isChecked || disabled}
              variant='outlined'
              fullWidth
              defaultValue={row[field]}
              onKeyDown={(e) => {
                if (e.key === ' ') e.stopPropagation();
              }}
              onChange={(e) => {
                const newRowValue = { ...row, [field]: e.target.value };
                if (Array.isArray(value)) {
                  const editRowIndex = value.findIndex(
                    (v) =>
                      v[primaryColumnDef.field] === row[primaryColumnDef.field]
                  );
                  if (editRowIndex > -1) {
                    setValue([
                      ...value.slice(0, editRowIndex),
                      newRowValue,
                      ...value.slice(editRowIndex + 1)
                    ]);
                  }
                } else {
                  setValue(newRowValue);
                }
                setRows((oldRows) => {
                  const editIndex = oldRows.findIndex(
                    (r) =>
                      r[primaryColumnDef.field] === row[primaryColumnDef.field]
                  );
                  if (editIndex > -1) {
                    return [
                      ...oldRows.slice(0, editIndex),
                      newRowValue,
                      ...oldRows.slice(editIndex + 1)
                    ];
                  }
                  return oldRows;
                });
              }}
            />
          );
        }
      });
    }
  );

  const isValid = tableDictionaryIsValid(value, multiSelect, required);

  return (
    <Stack direction='column' gap={1}>
      <Typography fontSize={14} fontWeight={600}>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}

        {!isValid && (
          <Typography
            fontSize={12}
            component='span'
            sx={{
              display: 'block'
            }}
            color='error'
            fontWeight={600}
          >
            Please select at least one row
          </Typography>
        )}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '350px'
        }}
      >
        <DataGridPremium
          slots={{
            toolbar: DataGridQuickFilter
          }}
          slotProps={{
            toolbar: {
              variant: 'outlined',
              placeholder: searchPlaceholder
            }
          }}
          columns={columns}
          rows={rows}
          rowSelection
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={() => {
            if (!disabled && Array.isArray(selectionModel)) {
              setValue(
                rows.filter((row) =>
                  selectionModel.includes(row[primaryColumnDef.field])
                )
              );
            }
          }}
          disableRowSelectionOnClick
          disableMultipleRowSelection={!multiSelect}
          density='compact'
          rowHeight={65}
          hideFooter
          getRowId={(row) => row[primaryColumnDef.field]}
          editMode='row'
          sx={{
            height: '100%',
            '.MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              outline: 'none !important',
              border: 'none !important'
            },
            '.MuiDataGrid-columnHeader': {
              outline: 'none !important',
              border: 'none !important'
            }
          }}
          getRowClassName={(params) => {
            return selectionModel.includes(params.id) ? '' : 'disabled-row';
          }}
        />
      </Box>
    </Stack>
  );
};

export default TableDictionaryMember;
