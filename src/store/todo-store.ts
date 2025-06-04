import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, description?: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, title: string, description?: string) => void;
  toggleTodo: (id: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (title: string, description?: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              title,
              description,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateTodo: (id: string, title: string, description?: string) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title, description } : todo)),
        })),
      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
        })),
      reorderTodos: (startIndex: number, endIndex: number) =>
        set((state) => {
          const result = Array.from(state.todos);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { todos: result };
        }),
    }),
    {
      name: "todo-storage",
    }
  )
);
