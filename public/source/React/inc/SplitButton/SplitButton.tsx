import { useRef, useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material';

interface Props {
  options: string[];
  onClick: (option: string) => void;
  disabled?: boolean;
}

/**
 * This component is adapted from
 * https://v5.mui.com/material-ui/react-button-group/#split-button
 */
const SplitButton = ({ options, onClick, disabled }: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const option = (e.target as HTMLButtonElement).textContent;
    if (option) {
      onClick(option);
    }
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant='contained' ref={anchorRef}>
        <Button size='small' onClick={handleClick} disabled={disabled}>
          {options[selectedIndex]}
        </Button>
        <Button
          size='small'
          onClick={handleToggle}
          sx={{
            padding: 0,
            margin: 0,
            borderColor: 'white'
          }}
          style={{
            minWidth: '30px',
            borderLeftColor: theme.palette.neutral.white200
          }}
          disabled={disabled}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SplitButton;
