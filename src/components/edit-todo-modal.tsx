"use client";

import { useTodoStore, Todo } from "@/store/todo-store";
import { Modal, Box, TextField, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useThemeStore } from "@/store/theme-store";

interface EditTodoModalProps {
  open: boolean;
  onClose: () => void;
  todo: Todo;
}

interface TodoFormData {
  title: string;
  description?: string;
}

export default function EditTodoModal({ open, onClose, todo }: EditTodoModalProps) {
  const { updateTodo } = useTodoStore();
  const { isDarkMode } = useThemeStore();
  const { register, handleSubmit, reset } = useForm<TodoFormData>({
    defaultValues: {
      title: todo.title,
      description: todo.description,
    },
  });

  const onSubmit = (data: TodoFormData) => {
    updateTodo(todo.id, data.title, data.description);
    reset();
    onClose();
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
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose} className={isDarkMode ? "text-gray-300 border-gray-600 hover:bg-gray-800" : ""}>
                취소
              </Button>
              <Button type="submit" variant="contained" className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}>
                수정
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
