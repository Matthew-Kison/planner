"use client";

import { useState } from "react";
import { Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import TodoList from "@/components/todo-list";
import AddTodoModal from "@/components/add-todo-modal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <TodoList />

      <Fab color="primary" style={{ position: "fixed", right: "30px", bottom: "30px" }} onClick={() => setIsModalOpen(true)}>
        <AddIcon />
      </Fab>

      <AddTodoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
