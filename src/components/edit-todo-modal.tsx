"use client";

import { useThemeStore } from "@/store/theme-store";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

interface EditTodoModalProps {
  open: boolean;
  onClose: () => void;
  todo: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    user_id: string;
  };
  onEdit: (id: string, title: string, description?: string) => void;
  isCopying?: boolean;
}

interface TodoFormData {
  title: string;
  description?: string;
}

export default function EditTodoModal({ open, onClose, todo, onEdit, isCopying = false }: EditTodoModalProps) {
  const { isDarkMode } = useThemeStore();
  const { register, handleSubmit, reset, setValue } = useForm<TodoFormData>({
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("title", todo.title);
    setValue("description", todo.description || "");
  }, [todo, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TodoFormData) => {
    try {
      await onEdit(todo.id, data.title, data.description);
      reset();
      onClose();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          onTransitionEnd: () => {
            inputRef.current?.focus();
          },
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "400px",
        },
      }}
    >
      <DialogTitle style={{ color: isDarkMode ? "white" : "inherit" }}>{isCopying ? "할 일 복사" : "할 일 수정"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="할 일"
              {...register("title", { required: true })}
              className={isDarkMode ? "text-white" : ""}
              inputRef={inputRef}
              InputLabelProps={{
                className: isDarkMode ? "text-gray-400" : "",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode ? "#2d2d2d" : "white",
                  "& fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="설명 (선택사항)"
              {...register("description")}
              className={isDarkMode ? "text-white" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode ? "#2d2d2d" : "white",
                  "& fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            취소
          </Button>
          <Button type="submit" variant="contained">
            {isCopying ? "복사하기" : "수정하기"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
