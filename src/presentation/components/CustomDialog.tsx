import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  children,
  actions,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = true,
}) => (
  <Dialog
    open={open}
    onClose={(event, reason) => {
      console.log(event);
      if (disableBackdropClick && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
      onClose();
    }}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
    disableEscapeKeyDown={disableBackdropClick}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </Dialog>
);

export default CustomDialog; 