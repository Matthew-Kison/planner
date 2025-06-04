"use client";

import { useTodoStore, Todo } from "@/store/todo-store";
import { Modal, Box, TextField, Button, TextareaAutosize, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

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
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField fullWidth label="할 일" {...register("title", { required: true })} />
            <TextareaAutosize
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] resize-none"
              placeholder="설명 (선택사항)"
              {...register("description")}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" variant="contained">
                수정
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
