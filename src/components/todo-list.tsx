"use client";

import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { useTodoStore } from "@/store/todo-store";
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import AddTodoModal from "./add-todo-modal";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import EditTodoModal from "./edit-todo-modal";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    user_id: string;
    category_id?: string;
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (dragId: string, hoverId: string) => void;
  onCopy: (todo: TodoItemProps["todo"]) => void;
}

function TodoItem({ todo, onToggle, onEdit, onDelete, onMove, onCopy }: TodoItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, date);
    const diffInHours = differenceInHours(now, date);
    const diffInDays = differenceInDays(now, date);

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${diffInDays}일 전`;
  };

  const [{ isDragging }, drag] = useDrag({
    type: "TODO",
    item: { id: todo.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TODO",
    drop: (item: { id: string }) => {
      if (item.id !== todo.id) {
        onMove(item.id, todo.id);
      }
    },
  });

  drag(drop(ref));

  const handleItemClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".MuiCheckbox-root") || (e.target as HTMLElement).closest(".MuiIconButton-root")) {
      return;
    }
    onEdit(todo.id);
  };

  return (
    <div
      ref={ref}
      className={`group transition-all duration-200 ${isDragging ? "opacity-50" : ""} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
    >
      <ListItem
        onClick={handleItemClick}
        className={isDarkMode ? "hover:text-gray-100" : "hover:text-gray-900"}
        secondaryAction={
          <div className="flex items-center space-x-2">
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(todo);
              }}
            >
              <CopyIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Checkbox
            checked={todo.completed}
            sx={{
              width: "20px",
              height: "20px",
            }}
            onChange={(e) => {
              e.stopPropagation();
              onToggle(todo.id);
            }}
          />
          <div className="flex-1">
            <ListItemText
              primary={
                <div className="flex items-center gap-2">
                  <Tooltip title={todo.description} placement="right">
                    <span className={`${todo.completed ? "line-through text-gray-500" : ""} font-semibold`}>{todo.title}</span>
                  </Tooltip>
                  <span className="text-sm text-gray-500">{getRelativeTime(todo.created_at)}</span>
                </div>
              }
            />
          </div>
        </div>
      </ListItem>
    </div>
  );
}

export default function TodoList() {
  const { todos, toggleTodo, deleteTodo, reorderTodos, fetchTodos, isLoading, addTodo, updateTodo } = useTodoStore();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyingTodo, setCopyingTodo] = useState<{ title: string; description?: string; category_id?: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  const planTodos = todos.filter((todo) => !todo.completed);
  const doneTodos = todos.filter((todo) => todo.completed);

  const moveTodo = (dragId: string, hoverId: string) => {
    const dragIndex = todos.findIndex((todo) => todo.id === dragId);
    const hoverIndex = todos.findIndex((todo) => todo.id === hoverId);
    reorderTodos(dragIndex, hoverIndex);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setDeletingTodo(null);
    } catch (error) {
      setError("할 일을 삭제하는 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      setError("할 일 상태를 변경하는 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleEdit = async (id: string, title: string, description?: string, category_id?: string) => {
    try {
      await updateTodo(id, title, description, category_id);
      setEditingTodo(null);
    } catch (error) {
      setError("할 일을 수정하는 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleAdd = async (title: string, description?: string, category_id?: string) => {
    try {
      await addTodo(title, description, category_id);
      setIsAddModalOpen(false);
    } catch (error) {
      setError("할 일을 추가하는 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleCopy = async (todo: TodoItemProps["todo"]) => {
    setCopyingTodo({
      title: todo.title,
      description: todo.description,
      category_id: todo.category_id,
    });
  };

  const handleCopyConfirm = async (title: string, description?: string, category_id?: string) => {
    try {
      await addTodo(title, description, category_id);
      setCopyingTodo(null);
    } catch (error) {
      setError("할 일을 복사하는 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <span className="sr-only">닫기</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="div" className={isDarkMode ? "text-white" : ""}>
          Todo List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          추가
        </Button>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" fontWeight={600} className="text-gray-400">
            Planned ({planTodos.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {planTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={setDeletingTodo}
                onMove={moveTodo}
                onCopy={handleCopy}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" fontWeight={600} className="text-green-500">
            Done ({doneTodos.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {doneTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={setDeletingTodo}
                onMove={moveTodo}
                onCopy={handleCopy}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {editingTodo && (
        <EditTodoModal open={true} onClose={() => setEditingTodo(null)} todo={todos.find((t) => t.id === editingTodo)!} onEdit={handleEdit} />
      )}

      {deletingTodo && <DeleteConfirmDialog open={true} onClose={() => setDeletingTodo(null)} onConfirm={() => handleDelete(deletingTodo)} />}

      <AddTodoModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAdd} />

      {copyingTodo && (
        <EditTodoModal
          open={true}
          onClose={() => setCopyingTodo(null)}
          todo={{
            id: "",
            title: copyingTodo.title,
            description: copyingTodo.description,
            completed: false,
            created_at: new Date().toISOString(),
            user_id: user?.id || "",
            category_id: copyingTodo.category_id,
          }}
          onEdit={(_, title, description) => handleCopyConfirm(title, description, copyingTodo.category_id)}
          isCopying={true}
        />
      )}
    </div>
  );
}
