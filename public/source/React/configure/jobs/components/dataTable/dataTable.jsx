import { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  DataGridPremium,
  useGridApiRef,
  gridFocusCellSelector
} from '@mui/x-data-grid-premium';

import { styled, useTheme } from '@mui/material/styles';

const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
  border: 0,
  borderRadius: 0,
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',

  '& .MuiDataGrid-virtualScroller': {
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '10px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'none',
      borderRadius: '2px',
      backgroundColor: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      border: '3px solid transparent',
      borderRadius: '100px',
      backgroundColor: theme.palette.neutral.dark400,
      backgroundClip: 'content-box',
      transition: 'background-color 256ms ease-in-out'
    },
    '&::-webkit-scrollbar-thumb:hover ': {
      border: '3px solid transparent',
      borderRadius: '100px',
      backgroundClip: 'content-box'
    }
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none'
  },
  '& .MuiDataGrid-columnHeaders': {
    border: `none`,
    borderRadius: '0px',
    height: '24px',
    maxHeight: '24px',
    minHeight: '24px',
    lineHeight: '24px',
    backgroundColor: theme.palette.neutral.secondary300,
    padding: '0px 6px'
  },
  '& .MuiDataGrid-row': {
    border: `none`,
    height: '48px',
    maxHeight: '48px',
    minHeight: '48px',
    lineHeight: '48px',
    padding: '0px 6px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.neutral.secondary300
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.neutral.secondary400,
      '&:hover': {
        backgroundColor: theme.palette.neutral.secondary300
      }
    }
  },
  '& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitle': {
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  '& .MuiDataGrid-cellContent': {
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    border: `none`,
    padding: '0px 6px',

    '&:focus': {
      outline: 'none'
    }
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: 'none'
  },
  '&. .MuiDataGrid-cell:focus': {
    outline: 'none'
  }
}));

const DataTable = ({
  columns,

  tableData,
  totalTableLength,

  tableLoading,

  initialState,

  sortingMode,
  onSortModelChange,

  pageSize,
  paginationMode,

  toolbar,
  footer,
  filterMode,
  onFilterModelChange,

  onRowClick,
  preprocessData,

  onMenuOpen
}) => {
  const handleRowClick = (e) => {
    if (onRowClick) {
      onRowClick(e);
    }
  };
  const theme = useTheme();

  const tableColumns = preprocessData?.(columns, tableData) ?? columns;

  const apiRef = useGridApiRef();

  useEffect(() => {
    const handleCleanFocus = () => {
      const cell = gridFocusCellSelector(apiRef);

      // If the focused cell is in a row which does not exist anymore, then remove the focus
      if (cell && !apiRef.current.getRow(cell.id)) {
        apiRef.current.setState((state) => ({
          ...state,
          focus: { cell: null, columnHeader: null }
        }));
      }
    };
    return apiRef.current.subscribeEvent('rowsSet', handleCleanFocus);
  }, []);

  return (
    tableData && (
      <StyledDataGrid
        theme={theme}
        columns={tableColumns}
        rows={tableData}
        apiRef={apiRef}
        pagination
        loading={tableLoading}
        initialState={initialState}
        sortingMode={sortingMode}
        onSortModelChange={onSortModelChange}
        paginationMode={paginationMode}
        rowCount={totalTableLength}
        pageSize={pageSize}
        disableSelectionOnClick
        disableColumnSelector
        disableRowSelector
        disableDensitySelector
        disableColumnFilter={!filterMode}
        disableColumnMenu={!filterMode}
        headerHeight={24}
        rowHeight={48}
        onRowClick={handleRowClick}
        components={{ Toolbar: toolbar, Footer: footer }}
        componentsProps={{ filterPanel: { logicOperators: ['and'] } }}
        filterMode={filterMode}
        onFilterModelChange={onFilterModelChange}
        onMenuOpen={onMenuOpen}
      />
    )
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf.isRequired,
  tableData: PropTypes.arrayOf.isRequired,
  totalTableLength: PropTypes.number.isRequired,
  tableLoading: PropTypes.bool.isRequired
};

export default DataTable;
