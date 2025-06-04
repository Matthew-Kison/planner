"use client";

import { useThemeStore } from "@/store/theme-store";
import { Todo } from "@/store/todo-store";
import { Box, Button, Modal, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

interface EditTodoModalProps {
  open: boolean;
  onClose: () => void;
  todo: Todo;
  onEdit: (id: string, title: string, description?: string) => Promise<void>;
}

interface TodoFormData {
  title: string;
  description?: string;
}

export default function EditTodoModal({ open, onClose, todo, onEdit }: EditTodoModalProps) {
  const { isDarkMode } = useThemeStore();
  const { register, handleSubmit, reset } = useForm<TodoFormData>({
    defaultValues: {
      title: todo.title,
      description: todo.description,
    },
  });

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
    <Modal open={open} onClose={onClose}>
      <Box 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 rounded-lg shadow-lg"
        sx={{
          backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField 
              fullWidth 
              label="할 일" 
              {...register("title", { required: true })}
              className={isDarkMode ? "text-white" : ""}
              InputLabelProps={{
                className: isDarkMode ? "text-gray-400" : ""
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
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
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                },
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outlined">
                취소
              </Button>
              <Button type="submit" variant="contained">
                저장
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
