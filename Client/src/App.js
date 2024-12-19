import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import "./App.css";

const GET_TODOS_QUERY = gql`
  query GetTodos {
    getTodos {
      title
      completed
      user {
        name
        email
        phone
      }
    }
  }
`;

const TodosList = () => {
  const { loading, error, data } = useQuery(GET_TODOS_QUERY);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="todos-container">
      <h2>Todos List</h2>
      {data.getTodos.map((todo, index) => (
        <div
          key={index}
          className={`todo-item ${todo.completed ? "completed" : "pending"}`}
        >
          <h3>{todo.title}</h3>
          <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
          {todo.user && (
            <div className="user-details">
              <h4>User Details</h4>
              <p><strong>Name:</strong> {todo.user.name}</p>
              <p><strong>Email:</strong> {todo.user.email}</p>
              <p><strong>Phone:</strong> {todo.user.phone}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [buttonText, setButtonText] = useState("Show Todos");

  const toggleTodos = () => {
    setButtonText((prevText) => (prevText === "Show Todos" ? "Hide Todos" : "Show Todos"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + GraphQL Todos</h1>
        <button className="header-btn" onClick={toggleTodos}>{buttonText}</button>
      </header>
      <main>
        {buttonText === "Hide Todos" && <TodosList />}
      </main>
    </div>
  );
}

export default App;
