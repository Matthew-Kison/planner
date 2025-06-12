import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  thumbnail?: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, thumbnail?: File) => Promise<void>;
  updateCategory: (id: string, name: string, thumbnail?: File) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (name: string, thumbnail?: File) => {
    set({ isLoading: true, error: null });
    try {
      let thumbnailUrl: string | undefined;

      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("category-thumbnails").upload(fileName, thumbnail);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("category-thumbnails").getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, thumbnail: thumbnailUrl }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ categories: [...state.categories, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id: string, name: string, thumbnail?: File) => {
    set({ isLoading: true, error: null });
    try {
      let thumbnailUrl: string | undefined;

      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("category-thumbnails").upload(fileName, thumbnail);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("category-thumbnails").getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const { data, error } = await supabase.from("categories").update({ name, thumbnail: thumbnailUrl }).eq("id", id).select().single();

      if (error) throw error;
      set((state) => ({
        categories: state.categories.map((category) => (category.id === id ? data : category)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
