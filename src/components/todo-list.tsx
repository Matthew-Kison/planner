"use client";

import { useTodoStore } from "@/store/todo-store";
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import EditTodoModal from "./edit-todo-modal";
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { useThemeStore } from "@/store/theme-store";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (dragId: string, hoverId: string) => void;
}

function TodoItem({ todo, onToggle, onEdit, onDelete, onMove }: TodoItemProps) {
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
    hover: (item: { id: string }) => {
      if (item.id !== todo.id) {
        onMove(item.id, todo.id);
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`group transition-all duration-200 ${isDragging ? "opacity-50" : ""} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
      <ListItem
        onClick={() => onEdit(todo.id)}
        className={isDarkMode ? "hover:text-gray-100" : "hover:text-gray-900"}
        secondaryAction={
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
        <div className="flex items-start">
          <Checkbox
            edge="start"
            checked={todo.completed}
            onChange={(e) => {
              e.stopPropagation();
              onToggle(todo.id);
            }}
          />
          <div className="flex-1">
            <ListItemText
              primary={
                <div className="flex justify-between items-center gap-2">
                  <span className={`${todo.completed ? "line-through text-gray-500" : ""} font-medium`}>{todo.title}</span>
                  <span className="text-sm text-gray-500">{getRelativeTime(todo.createdAt)}</span>
                </div>
              }
            />
            {todo.description && (
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-200">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-2 block`}>{todo.description}</span>
              </div>
            )}
          </div>
        </div>
      </ListItem>
    </div>
  );
}

export default function TodoList() {
  const { todos, toggleTodo, removeTodo, reorderTodos } = useTodoStore();
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);

  const planTodos = todos.filter((todo) => !todo.completed);
  const doneTodos = todos.filter((todo) => todo.completed);

  const moveTodo = (dragId: string, hoverId: string) => {
    const dragIndex = todos.findIndex((todo) => todo.id === dragId);
    const hoverIndex = todos.findIndex((todo) => todo.id === hoverId);
    reorderTodos(dragIndex, hoverIndex);
  };

  return (
    <div className="space-y-4">
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Plan ({planTodos.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {planTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onEdit={setEditingTodo} onDelete={setDeletingTodo} onMove={moveTodo} />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Done ({doneTodos.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {doneTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onEdit={setEditingTodo} onDelete={setDeletingTodo} onMove={moveTodo} />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {editingTodo && <EditTodoModal open={true} onClose={() => setEditingTodo(null)} todo={todos.find((t) => t.id === editingTodo)!} />}

      {deletingTodo && (
        <DeleteConfirmDialog
          open={true}
          onClose={() => setDeletingTodo(null)}
          onConfirm={() => {
            removeTodo(deletingTodo);
            setDeletingTodo(null);
          }}
          title={todos.find((t) => t.id === deletingTodo)?.title || ""}
        />
      )}
    </div>
  );
}
