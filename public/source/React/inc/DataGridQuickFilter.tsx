import { Box } from '@mui/material';
import {
  GridToolbarQuickFilter,
  GridToolbarQuickFilterProps
} from '@mui/x-data-grid-premium';

interface Props {
  variant: GridToolbarQuickFilterProps['variant'];
  placeholder: GridToolbarQuickFilterProps['placeholder'];
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    variant: GridToolbarQuickFilterProps['variant'];
    placeholder: GridToolbarQuickFilterProps['placeholder'];
  }
}
const getDynamicWidth = (text: string) => {
  const baseWidth = 100;
  const charWidth = 8;
  return (baseWidth + text.length * charWidth);
};
const DataGridQuickFilter = ({ variant, placeholder }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        padding:'10px',
      }}
    >
      <GridToolbarQuickFilter
        variant={variant}
        placeholder={placeholder}
        sx={{
          width: '100%',
          maxWidth: `${getDynamicWidth(placeholder ?? '')}px`,
          height: '35px',
        }}
      />
    </Box>
  );
};

export default DataGridQuickFilter;
