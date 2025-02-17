import { useState, useEffect } from "react";
import "./App.css";
import TimeDisplay from "./TimeDisplay";

const GRAPHQL_ENDPOINT = "http://localhost:3000/graphql";

type Todo = { id: number; title: string };

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  //初回レンダリング時にデータを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  //関数①（データを表示する）
  const fetchTodos = async () => {
    const query = `
      query {
        posts { 
          id
          title
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.data && result.data.posts) {
      setTodos(result.data.posts);
    } else {
      console.error("Error fetching todos:", result.errors);
    }
  };

  //関数②（新しいTodoを追加）
  const addTodo = async () => {
    if (newTodo === "") {
      return;
    }

    const mutation = `
      mutation {
        createPost(title: "${newTodo}") {
          id
          title
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.data && result.data.createPost) {
      setTodos((prevTodos) => [...prevTodos, result.data.createPost]);
      setNewTodo("");
    } else {
      console.error("Error creating todo:", result.errors);
    }
  };

  //関数③（Todoを削除）
  const removeTodo = async (id: number) => {
    const mutation = `
      mutation {
        removePost(id: ${id})
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.data && result.data.removePost) {
      fetchTodos(); // ✅ 成功時のみデータを再取得
    } else {
      console.error("Error deleting todo:", result.errors);
    }
  };

  //表示部分
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1 className="app-title">My Todos</h1>
        <TimeDisplay />
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-title">{todo.title}</span>
              <button className="remove-button" onClick={() => removeTodo(todo.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="todo-input-container">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
          />
          <button className="add-button" onClick={addTodo}>Add Todo</button>
        </div>
      </div>
    </div>
  );
}
