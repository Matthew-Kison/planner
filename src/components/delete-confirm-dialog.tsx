"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({ open, onClose, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>할 일 삭제</DialogTitle>
      <DialogContent>
        <Typography>삭제하시겠습니까?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}
