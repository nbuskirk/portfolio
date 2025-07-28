import { GridRowId } from '@mui/x-data-grid-premium';
import { useState } from 'react';

const useSingleRowExpansion = () => {
  const [expandedRowId, setExpandedRowId] = useState<GridRowId[]>([]);

  const handleExpansionChange = (rowIds: GridRowId[]) => {
    // Ensure only one row is expanded
    let selectedIds: GridRowId[] = rowIds;
    if (rowIds.length > 1) {
      selectedIds = rowIds.filter(
        (id: GridRowId) => !expandedRowId.includes(id)
      );
    }
    setExpandedRowId(selectedIds);
  };

  return {
    expandedRowId,
    handleExpansionChange
  };
};

export default useSingleRowExpansion;
