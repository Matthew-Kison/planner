"use client";

import { useCategoryStore } from "@/store/category-store";
import { useThemeStore } from "@/store/theme-store";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
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
    category_id?: string | null;
  };
  onEdit: (id: string, title: string, description?: string, category_id?: string | null) => void;
  isCopying?: boolean;
}

interface TodoFormData {
  title: string;
  description?: string;
  category_id?: string | null;
}

export default function EditTodoModal({ open, onClose, todo, onEdit, isCopying = false }: EditTodoModalProps) {
  const { isDarkMode } = useThemeStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TodoFormData>({
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      category_id: todo.category_id,
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setValue("title", todo.title);
    setValue("description", todo.description || "");
    setValue("category_id", todo.category_id);
  }, [todo, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TodoFormData) => {
    try {
      await onEdit(todo.id, data.title, data.description, data.category_id);
      reset();
      onClose();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      }}
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
          maxWidth: "800px",
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
              disabled={isSubmitting}
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
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={categories.find((cat) => cat.id === selectedCategoryId) || null}
              onChange={(_, newValue) => {
                setValue("category_id", newValue?.id);
              }}
              disabled={isSubmitting}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="카테고리"
                  className={isDarkMode ? "text-white" : ""}
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
              )}
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              placeholder="설명 (선택사항)"
              {...register("description")}
              className={isDarkMode ? "text-white" : ""}
              disabled={isSubmitting}
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
          <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : isCopying ? "복사하기" : "수정하기"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
