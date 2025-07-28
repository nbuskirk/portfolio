import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip
} from '@mui/material';
import {
  GridSlots,
  GridToolbarContainer,
  GridToolbarFilterButton,
  PropsFromSlot,
  useGridApiContext
  // useGridApiContext
} from '@mui/x-data-grid-premium';
import { ReactNode, useRef, useState } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { format } from 'date-fns';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    filePrefix?: string;
  }
}

/*
  Just like the normal export toolbar,
  except it changes the filename of the saved asset to be...
  [prefix][timestamp]

  where prefix is `filePrefix`
  and timestamp is the machines local time
*/
const CustomLocalExportToolbar = ({
  filePrefix
}: PropsFromSlot<GridSlots['toolbar']>): ReactNode => {
  const apiRef = useGridApiContext();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleDownloadCSV = () => {
    const date = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `${filePrefix}${date}`;
    apiRef.current.exportDataAsCsv({
      fileName
    });
    setOpen(false);
  };

  const handleDownloadExcel = () => {
    const date = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `${filePrefix}${date}`;
    apiRef.current.exportDataAsExcel({
      fileName
    });
    setOpen(false);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <Tooltip title='Export'>
        <Button
          size='small'
          sx={{ display: 'flex', gap: 0.5 }}
          ref={anchorRef}
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          <FileDownloadOutlinedIcon fontSize='small' />
          Export
        </Button>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='bottom-start'
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  aria-labelledby='composition-button'
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleDownloadCSV}>
                    Download as CSV
                  </MenuItem>
                  <MenuItem onClick={handleDownloadExcel}>
                    Download as Excel
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </GridToolbarContainer>
  );
};
export default CustomLocalExportToolbar;
