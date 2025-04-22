import React from "react";
import { useParams } from "react-router-dom";
import { TaskState } from "../types/Task"; // Typy stanu zadania
import { useAppLogic } from "../logicfunction/useAppLogic"; // Hook z logiką aplikacji

import "../styles/TaskDetailsView.css"; // Stylowanie

function TaskDetailsView() {
  const { taskId } = useParams<{ taskId: string }>(); // Pobierz taskId z parametrów URL

  const {
    tasks,
    handleAssignUser,
    handleUpdateTask,
    handleChangeTaskState,
  } = useAppLogic(); // Logika aplikacji do obsługi zadań

  // Wyszukaj zadanie na podstawie taskId
  const task = tasks.find((t) => t.id === parseInt(taskId ?? ""));

  if (!task) {
    return <div>Ładowanie zadania...</div>; // Jeśli zadanie jest ładowane
  }

  const handleAssign = (role: "devops" | "developer") => {
    // Przypisz osobę do zadania
    handleAssignUser(task.id, role);
    // Zmień stan zadania na "doing" i ustaw datę rozpoczęcia
    const updatedTask = { ...task, state: "in-progress" as TaskState, startDate: new Date().toISOString() };
    handleUpdateTask(updatedTask);
  };

  return (
    <div>
      <h3 className="section-title">Szczegóły zadania</h3>
      <div className="task-details-container">
        {/* Informacje o zadaniu */}
        <div className="task-info">
          <p><strong>Nazwa zadania:</strong> {task.name}</p>
          <p><strong>Opis:</strong> {task.description}</p>
          <p><strong>Priorytet:</strong> {task.priority}</p>
          <p><strong>Przypisana historyjka:</strong> {task.storyid}</p>
          <p><strong>Data rozpoczęcia:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
          <p><strong>Zrealizowane roboczogodziny:</strong> {task.workedHours} h</p>
          <p><strong>Przewidywane godziny:</strong> {task.estimatedHours} h</p>
          <p><strong>Przypisana osoba:</strong> {task.assignedUser ? `${task.assignedUser.name} (${task.assignedUser.role})` : "Brak przypisanej osoby"}</p>
        </div>

        {/* Akcje dla zadania */}
        <div className="task-actions">
          <button onClick={() => handleAssign("devops")} className="assign-devops-button">
            Przypisz DevOps
          </button>
          <button onClick={() => handleAssign("developer")} className="assign-developer-button">
            Przypisz Developer
          </button>
          <button onClick={() => handleChangeTaskState(task.id)} className="change-status-button">
            Zmień status
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsView;
