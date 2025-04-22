import { useState, useEffect } from 'react';
import { ProjectStorage } from '../services/localStorage';
import { UserSession } from '../services/UserSession';
import { Task, User, Story } from '../types/types';
import Navbar from './Navbar';
import '../styles/taskdetails.css';

interface TaskDetailsProps {
  taskId: string;
  onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [users] = useState<User[]>(UserSession.getAllUsers().filter((u) => u.role === 'devops' || u.role === 'developer'));
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchedTask = ProjectStorage.getTaskById(taskId);
    if (fetchedTask) {
      setTask(fetchedTask);
      setEditTask(fetchedTask);
      const fetchedStory = ProjectStorage.getStoryById(fetchedTask.storyId);
      setStory(fetchedStory || null);
      const projectId = fetchedStory?.projectId;
      if (projectId) {
        setStories(ProjectStorage.getAllStories(projectId));
      }
    }
  }, [taskId]);

  const calculateWorkHours = (task: Task): number => {
    if (!task.startedAt) return 0;
    const start = new Date(task.startedAt);
    const end = task.finishedAt ? new Date(task.finishedAt) : new Date();
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Number(hours.toFixed(2));
  };

  const handleAssignUser = (userId: string) => {
    if (task) {
      const updatedTask: Task = {
        ...task,
        assignedUserId: userId,
        status: 'doing',
        startedAt: new Date().toISOString(),
      };
      ProjectStorage.updateTask(updatedTask);
      setTask(updatedTask);
      setEditTask(updatedTask);
    }
  };

  const handleMarkAsDone = () => {
    if (task) {
      const updatedTask: Task = {
        ...task,
        status: 'done',
        finishedAt: new Date().toISOString(),
      };
      ProjectStorage.updateTask(updatedTask);
      setTask(updatedTask);
      setEditTask(updatedTask);
    }
  };

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleUpdateTask = () => {
    if (editTask) {
      ProjectStorage.updateTask(editTask);
      setTask(editTask);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTask(task);
  };

  if (!task) {
    return (
      <div>
        <Navbar />
        <div className="container">Task not found</div>
      </div>
    );
  }

  const assignedUser = users.find((u) => u.id === task.assignedUserId);

  return (
    <div>
      <Navbar />
      <div className="container">
        <button onClick={onBack} className="button button-cancel">
          Back
        </button>
        <h1 className="title">Task Details</h1>
        <div className="form-section">
          {isEditing ? (
            <>
              <h2 className="form-title">Edit Task</h2>
              <input
                type="text"
                placeholder="Task Name"
                value={editTask?.name || ''}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, name: e.target.value })
                }
                className="input"
              />
              <textarea
                placeholder="Task Description"
                value={editTask?.description || ''}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, description: e.target.value })
                }
                className="textarea"
              />
              <select
                value={editTask?.priority || task.priority}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, priority: e.target.value as Task['priority'] })
                }
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={editTask?.storyId || ''}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, storyId: e.target.value })
                }
                className="input"
              >
                <option value="">Select Story</option>
                {stories.map((story) => (
                  <option key={story.id} value={story.id}>
                    {story.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Estimated Time (hours)"
                value={editTask?.estimatedTime || 1}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, estimatedTime: Number(e.target.value) })
                }
                className="input"
                min="1"
              />
                <select
                value={editTask?.assignedUserId || ''}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, assignedUserId: e.target.value })
                }
                className="input"
              >
                <option value="" disabled={!!editTask?.assignedUserId}>Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
              </select>

              <select
                value={editTask?.status || task.status}
                onChange={(e) =>
                  editTask && setEditTask({ ...editTask, status: e.target.value as Task['status'] })
                }
                className="input"
              >
                <option value="todo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>

              <div>
                <button
                  onClick={handleUpdateTask}
                  className="button button-secondary"
                >
                  Update
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="button button-cancel"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="form-title">{task.name}</h2>
              <p className="task-detail">Description: {task.description}</p>
              <p className="task-detail">Priority: {task.priority}</p>
              <p className="task-detail">Story: {story ? story.name : 'Unknown'}</p>
              <p className="task-detail">Estimated Time: {task.estimatedTime} hours</p>
              <p className="task-detail">Status: {task.status}</p>
              <p className="task-detail">Created At: {new Date(task.createdAt).toLocaleString()}</p>
              <p className="task-detail">Started At: {task.startedAt ? new Date(task.startedAt).toLocaleString() : '-'}</p>
              <p className="task-detail">Finished At: {task.finishedAt ? new Date(task.finishedAt).toLocaleString() : '-'}</p>
              <p className="task-detail">Work Hours: {calculateWorkHours(task)} hours</p>
              <p className="task-detail">
                Assigned User: {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'None'}
              </p>

              <button
                onClick={handleEditTask}
                className="button button-edit"
              >
                Edit
              </button>

              {task.status === 'todo' && (
                <div>
                  <h3 className="form-title">Assign User</h3>
                  <select
                    onChange={(e) => handleAssignUser(e.target.value)}
                    value={task.assignedUserId || ''}
                    className="input"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {task.status === 'doing' && (
                <button
                  onClick={handleMarkAsDone}
                  className="button button-primary"
                >
                  Mark as Done
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;