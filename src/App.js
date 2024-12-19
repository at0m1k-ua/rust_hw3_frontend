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
    await fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await fetchTasks();
  };

  const exportTasks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tasks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importTasks = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          for (const task of importedTasks) {
            await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(task),
            });
          }
          fetchTasks();
        } catch (error) {
          alert("Невірний формат файлу");
        }
      };
      reader.readAsText(file);
    }
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
        <button onClick={exportTasks}>Експорт</button>
        <input
          type="file"
          accept=".json"
          onChange={importTasks}
          style={{ display: "inline-block", marginLeft: "10px" }}
        />
      </div>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{ textDecoration: task.completed ? "line-through" : "none" }}
            >
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
