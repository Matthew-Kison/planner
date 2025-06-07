import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Category {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.from("categories").select("*").order("name");

      if (error) throw error;

      set({ categories: data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: "카테고리를 불러오는 중 오류가 발생했습니다.", isLoading: false });
    }
  },
}));
