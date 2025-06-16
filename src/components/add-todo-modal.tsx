import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Autocomplete } from "@mui/material";
import { useForm } from "react-hook-form";
import { useThemeStore } from "@/store/theme-store";
import { useCategoryStore } from "@/store/category-store";
import { useEffect, useRef } from "react";

interface AddTodoModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, description?: string, category_id?: string) => void;
}

interface TodoFormData {
  title: string;
  description?: string;
  category_id?: string;
}

export default function AddTodoModal({ open, onClose, onAdd }: AddTodoModalProps) {
  const { isDarkMode } = useThemeStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TodoFormData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TodoFormData) => {
    try {
      await onAdd(data.title, data.description, data.category_id);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding todo:", error);
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
      <DialogTitle style={{ color: isDarkMode ? "white" : "inherit" }}>할 일 추가</DialogTitle>
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
            {isSubmitting ? "저장 중..." : "추가"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
