"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import TodoList from "@/components/todo-list";
import AuthForm from "@/components/auth-form";
import { CircularProgress, Box } from "@mui/material";

export default function Home() {
  const { user, getSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getSession();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [getSession]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <TodoList />
    </main>
  );
}
