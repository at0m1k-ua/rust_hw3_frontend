import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://127.0.0.1:1488/tasks";

  const fetchTasks = async () => {
    setIsLoading(true);
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
    setIsLoading(false);
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newTask }),
    });

    setNewTask("");
    fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Список завдань</h1>

      <div>
        <input
          type="text"
          placeholder="Нове завдання"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Додати</button>
      </div>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              <span onClick={() => toggleComplete(task.id, task.completed)}>
                {task.description}
              </span>
              <button onClick={() => deleteTask(task.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
