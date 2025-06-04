import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, description?: string) => Promise<void>;
  updateTodo: (id: string, title: string, description?: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  reorderTodos: (dragIndex: number, hoverIndex: number) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ todos: data || [] });
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (title: string, description?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
      user_id: user.id,
    };

    // Optimistic update
    set((state) => ({
      todos: [newTodo, ...state.todos],
    }));

    try {
      const { error } = await supabase.from("todos").insert([newTodo]);
      if (error) throw error;
    } catch (error) {
      // Rollback on error
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== newTodo.id),
      }));
      console.error("Error adding todo:", error);
      throw error;
    }
  },

  updateTodo: async (id: string, title: string, description?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title, description } : todo
      ),
    }));

    try {
      const { error } = await supabase
        .from("todos")
        .update({ title, description })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      // Rollback on error
      const { fetchTodos } = get();
      await fetchTodos();
      console.error("Error updating todo:", error);
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Store the todo for potential rollback
    const todoToDelete = get().todos.find((todo) => todo.id === id);

    // Optimistic update
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));

    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      // Rollback on error
      if (todoToDelete) {
        set((state) => ({
          todos: [...state.todos, todoToDelete],
        }));
      }
      console.error("Error deleting todo:", error);
      throw error;
    }
  },

  toggleTodo: async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));

    try {
      const todo = get().todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      // Rollback on error
      const { fetchTodos } = get();
      await fetchTodos();
      console.error("Error toggling todo:", error);
      throw error;
    }
  },

  reorderTodos: async (dragIndex: number, hoverIndex: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const todos = [...get().todos];
    const [draggedTodo] = todos.splice(dragIndex, 1);
    todos.splice(hoverIndex, 0, draggedTodo);

    // Optimistic update
    set({ todos });

    try {
      const { error } = await supabase
        .from("todos")
        .upsert(
          todos.map((todo, index) => ({
            ...todo,
            order: index,
          }))
        );

      if (error) throw error;
    } catch (error) {
      // Rollback on error
      const { fetchTodos } = get();
      await fetchTodos();
      console.error("Error reordering todos:", error);
      throw error;
    }
  },
}));
