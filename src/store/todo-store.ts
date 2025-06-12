import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  order: number;
}

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, description?: string, category_id?: string) => Promise<void>;
  updateTodo: (id: string, title: string, description?: string, category_id?: string) => Promise<void>;
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
      const { data, error } = await supabase.from("todos").select("*").eq("user_id", user.id).order("order", { ascending: true });

      if (error) throw error;
      set({ todos: data || [] });
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (title: string, description?: string, category_id?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const currentTodos = get().todos;
    const maxOrder = currentTodos.length > 0 ? Math.max(...currentTodos.map((todo) => todo.order)) : -1;
    const newOrder = maxOrder + 1;
    const now = new Date().toISOString();

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      description,
      category_id,
      completed: false,
      created_at: now,
      updated_at: now,
      user_id: user.id,
      order: newOrder,
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

  updateTodo: async (id: string, title: string, description?: string, category_id?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title, description, category_id } : todo)),
    }));

    try {
      const { error } = await supabase.from("todos").update({ title, description, category_id }).eq("id", id).eq("user_id", user.id);

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
      const { error } = await supabase.from("todos").delete().eq("id", id).eq("user_id", user.id);

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

    // 원래 상태에서 todo를 찾음
    const originalTodo = get().todos.find((t) => t.id === id);
    if (!originalTodo) return;

    const now = new Date().toISOString();

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed, updated_at: now } : todo)),
    }));

    try {
      // 서버에 보낼 때는 원래 상태의 반전된 값을 사용
      const { error } = await supabase
        .from("todos")
        .update({
          completed: !originalTodo.completed,
          updated_at: now,
        })
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
      const { error } = await supabase.from("todos").upsert(
        todos.map((todo, index) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description || null,
          completed: todo.completed,
          created_at: todo.created_at,
          updated_at: todo.updated_at,
          user_id: todo.user_id,
          category_id: todo.category_id || null,
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
