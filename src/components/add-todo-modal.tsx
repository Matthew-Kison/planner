import { useTodoStore } from "@/store/todo-store";
import { Modal, Box, TextField, Button, TextareaAutosize, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

interface AddTodoModalProps {
  open: boolean;
  onClose: () => void;
}

interface TodoFormData {
  title: string;
  description?: string;
}

export default function AddTodoModal({ open, onClose }: AddTodoModalProps) {
  const { addTodo } = useTodoStore();
  const { register, handleSubmit, reset } = useForm<TodoFormData>();

  const onSubmit = (data: TodoFormData) => {
    addTodo(data.title, data.description);
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
            <div className="flex justify-end space-x-2">
              <Button variant="outlined" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" variant="contained">
                추가
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
