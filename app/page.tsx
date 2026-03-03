"use client";

import useTodo from "@/hooks/useTodo";

export default function Home() {
  const { data } = useTodo();
  return (
    <div>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}> {todo.title} </li>
        ))}
      </ul>
    </div>
  );
}
