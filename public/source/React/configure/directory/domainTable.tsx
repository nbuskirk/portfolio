import { Grid, Checkbox } from '@mui/material';
import {
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
  GridColDef,
  GridColumnVisibilityModel,
  GridLogicOperator,
  getGridStringOperators,
  DataGridPremium
} from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { AD_CONFIG } from 'constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { DomainInterface } from 'data-hooks/config/useActiveDirectoryConfig';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import domainTableToolbar from './domainTableToolbar';
import sx from './directory.module.scss';

const equalsOnly = getGridStringOperators().filter(
  (op) => op.value === 'equals'
);

const filterColumns = ({
  field,
  columns: currentColumns,
  currentFilters
}: FilterColumnsArgs) => {
  const filteredFields = currentFilters?.map((item) => item.field);
  return currentColumns
    .filter(
      (colDef) =>
        colDef.filterable &&
        (colDef.field === field || !filteredFields.includes(colDef.field))
    )
    .map((column) => column.field);
};

const getColumnForNewFilter = ({
  currentFilters,
  columns: currentColumns
}: GetColumnForNewFilterArgs) => {
  const filteredFields = currentFilters?.map(({ field }) => field);
  const columnForNewFilter = currentColumns
    .filter(
      (colDef) => colDef.filterable && !filteredFields.includes(colDef.field)
    )
    .find((colDef) => colDef.filterOperators?.length);
  return columnForNewFilter ? columnForNewFilter.field : null;
};

interface TableProps {
  all_domains: DomainInterface[];
  ADLoading: boolean;
  domainMutation: any;
}

const DomainTable: React.FC<TableProps> = ({
  all_domains,
  ADLoading,
  domainMutation
}) => {
  const [rows, setRows] = useState<any[]>([]);
  const [prevFlags, setPrevFlags] = useState<any[]>([]);
  const [change, setChange] = useState(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  useEffect(() => {
    if (all_domains) {
      setRows(all_domains);
      const prevTemp = [];
      for (let i = 0; i < all_domains.length; i += 1) {
        prevTemp.push({
          domid: all_domains[i].domid,
          changed: false,
          flags: all_domains[i].flags
        });
      }
      setPrevFlags(prevTemp);
    }
  }, [all_domains]);

  const [visibilityModel, setVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      segment: false
    });

  const queryClient = useQueryClient();

  const statusMapping: Record<number, string> = {};
  statusMapping[0] = 'Successful';
  statusMapping[1] = 'Pending';
  statusMapping[2] = 'Not Queryable';

  const columns: GridColDef[] = [
    {
      field: 'flags',
      headerName: 'QUERY DOMAIN',
      width: 280,
      filterable: true,
      filterOperators: equalsOnly,
      sortable: true,
      aggregable: false,
      groupable: true,
      renderCell: (params) => (
        <Checkbox
          disabled={ADLoading}
          checked={params.value === 28 || params.value === 20}
          onChange={(event) => {
            setChange(true);
            const id = params.row.domid;
            const tempRows = [...rows];
            const tempPrev = [...prevFlags];
            const indexRows = tempRows.findIndex((item) => item.domid === id);
            const indexPrev = tempPrev.findIndex((item) => item.domid === id);
            tempPrev[indexPrev].changed = !tempPrev[indexPrev].changed;
            if (event.target.checked) {
              if (tempPrev[indexPrev].changed) {
                tempRows[indexRows].flags = 20;
              } else {
                tempRows[indexRows].flags = tempPrev[indexPrev].flags;
              }
            } else if (tempPrev[indexPrev].changed) {
              tempRows[indexRows].flags = 16;
            } else {
              tempRows[indexRows].flags = tempPrev[indexPrev].flags;
            }
            setRows(tempRows);
            setPrevFlags(tempPrev);
          }}
        />
      )
    },
    {
      field: 'name',
      headerName: 'DOMAIN NAME',
      width: 280,
      filterable: true,
      filterOperators: equalsOnly,
      sortable: true,
      aggregable: false,
      groupable: true
    },
    {
      field: 'dnsname',
      headerName: 'DNS NAME',
      width: 280,
      filterable: true,
      filterOperators: equalsOnly,
      sortable: true,
      aggregable: false,
      groupable: true
    },
    {
      field: 'queryable',
      headerName: 'QUERY STATUS',
      width: 280,
      filterable: true,
      filterOperators: equalsOnly,
      sortable: true,
      aggregable: false,
      groupable: true,
      renderCell: (params) => statusMapping[params.value]
    }
  ];

  function invalidation() {
    const queryKey: any = AD_CONFIG;
    queryClient.invalidateQueries(queryKey);
  }

  const onSave = () => {
    setChange(false);
    const body = rows.map((obj) => {
      const { queryable, ...rest } = obj;
      return rest;
    });
    domainMutation.mutate(
      {
        body
      },
      {
        onSuccess: () => {
          invalidation();
          showSuccessSnackbar('Success: Saved Active Directory domains');
        }
      }
    );
  };

  return (
    <Grid
      sx={{
        padding: '10px',
        marginTop: '10px'
      }}
    >
      <Grid container spacing={2}>
        <Grid item style={{ height: 500, width: '100%' }}>
          <DataGridPremium
            className={sx.table}
            rowHeight={70}
            columnHeaderHeight={90}
            slots={{
              toolbar: domainTableToolbar
            }}
            slotProps={{
              toolbar: { onSave, change },
              filterPanel: {
                filterFormProps: {
                  filterColumns
                },
                logicOperators: [GridLogicOperator.And],
                getColumnForNewFilter
              }
            }}
            sx={{
              '& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitle': {
                fontSize: '12px',
                fontWeight: '600'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#6CACE429',
                border: '1px solid transparent'
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                border: '1px solid transparent'
              },
              '& .MuiDataGrid-cellContent': {
                fontSize: '12px',
                fontWeight: '400'
              }
            }}
            getRowId={(row) => row.domid}
            columnVisibilityModel={visibilityModel}
            onColumnVisibilityModelChange={setVisibilityModel}
            loading={ADLoading}
            rows={rows}
            columns={columns}
            density='compact'
            hideFooterSelectedRowCount
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DomainTable;
