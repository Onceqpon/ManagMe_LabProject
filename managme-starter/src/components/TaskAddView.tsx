import React, { useState, useEffect } from "react";
import { useAppLogic } from "../logicfunction/useAppLogic"; // Importujemy logikę aplikacji
import "../styles/TaskAdd.css"; // Stylowanie dla tego widoku
import { TaskState } from "../types/Task"; // Typy stanu zadania
import { ActiveHistory } from "../utils/ActiveHistory"; // Importujemy ActiveHistory

const TaskAddView: React.FC = () => {
  const { handleAddTask } = useAppLogic(); // Hook do zarządzania zadaniami
  const [taskName, setTaskName] = useState(""); // Nazwa zadania
  const [taskDescription, setTaskDescription] = useState(""); // Opis zadania
  const [taskPriority, setTaskPriority] = useState<"niski" | "średni" | "wysoki">("średni"); // Priorytet zadania
  const [assignedUser, setAssignedUser] = useState<"devops" | "developer" | null>(null); // Przypisana osoba
  const [selectedStory, setSelectedStory] = useState<string | null>(null); // Wybrana historyjka

  // Używamy efektu, aby ustawić aktywną historyjkę na załadowanie komponentu
  useEffect(() => {
    const activeHistory = ActiveHistory.getActive(); // Pobieramy aktywną historyjkę
    setSelectedStory(activeHistory); // Ustawiamy ją jako wybraną historyjkę w formularzu
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !selectedStory || !assignedUser) {
      alert("Wszystkie pola są wymagane.");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      storyid: selectedStory,
      state: "todo" as TaskState,
      startDate: "",
      workedHours: 0,
      estimatedHours: 0,
      assignedUser: { name: "", role: "" },
    };

    handleAddTask(newTask); // Przekazujemy zadanie do logiki aplikacji
    setTaskName(""); // Resetujemy formularz
    setTaskDescription("");
    setTaskPriority("średni");
    setAssignedUser(null);
    setSelectedStory(null);
  };

  return (
    <div>
      <h3 className="section-title">Dodaj nowe zadanie</h3>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="taskName">Nazwa zadania:</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskDescription">Opis zadania:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskPriority">Priorytet:</label>
          <select
            id="taskPriority"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value as "niski" | "średni" | "wysoki")}
            className="input-field"
            required
          >
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignedUser">Przypisz osobę:</label>
          <select
            id="assignedUser"
            value={assignedUser || ""}
            onChange={(e) => setAssignedUser(e.target.value as "devops" | "developer")}
            className="input-field"
            required
          >
            <option value="" disabled>Wybierz osobę</option>
            <option value="devops">DevOps</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="storySelect">Wybierz historyjkę:</label>
          <select
            id="storySelect"
            value={selectedStory || ""}
            onChange={(e) => setSelectedStory(e.target.value)}
            className="input-field"
            required
          >
            <option value="" disabled>Wybierz historyjkę</option>
            {/* Wyświetlamy tylko aktywną historyjkę */}
            {selectedStory && <option value={selectedStory}>{selectedStory}</option>}
          </select>
        </div>

        <button type="submit" className="submit-button">Dodaj zadanie</button>
      </form>
    </div>
  );
};

export default TaskAddView;
