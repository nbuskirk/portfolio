import React from 'react';
import { Drawer } from '@mui/material';

const SideBar = ({
  children,
  side = 'right', 
  open,
  onClose
}: {
  children: React.ReactNode;
  side?: 'left' | 'right';
  open: boolean;
  onClose: (e: object, r: string) => void;
}) => {
  return (
    <Drawer anchor={side} open={open} onClose={(e, r) => onClose(e, r)}>
      {children}
    </Drawer>
  );
};

export default SideBar;
