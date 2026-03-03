import apiClient from "@/lib/api-client";
import { Todo } from "@/types/todo";
import { useQuery } from "@tanstack/react-query";

const useTodo = () =>
  useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => apiClient.get("/todos").then((res) => res.data),
  });

export default useTodo;
