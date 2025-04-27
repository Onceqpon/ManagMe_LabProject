import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProjectStorage } from './services/localStorage';
import { ActiveProject } from './services/ActiveItem';
import { Project, Story, Task, User } from './types/types';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Navbar from './components/Navbar';
import './styles/app.css';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState({
    name: '',
    description: '',
    priority: 'low' as Story['priority'],
  });
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: 'low' as Task['priority'],
    storyId: '',
    estimatedTime: 1,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Pobieranie danych użytkownika i projektów
    fetchUsers();
    setProjects(ProjectStorage.getAllProjects());
    const activeId = ActiveProject.getActive();
    setActiveProjectId(activeId);
    if (activeId) {
      setStories(ProjectStorage.getAllStories(activeId));
      setTasks(ProjectStorage.getAllTasks());
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const user = await response.json();
      if (response.ok) {
        setUsers([user]); // Tymczasowo, zakładamy jednego użytkownika
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      const project: Project = {
        id: crypto.randomUUID(),
        name: newProject.name,
        description: newProject.description,
      };
      ProjectStorage.addProject(project);
      setProjects(ProjectStorage.getAllProjects());
      setNewProject({ name: '', description: '' });
    }
  };

  const handleUpdateProject = () => {
    if (editingProject) {
      ProjectStorage.updateProject(editingProject);
      setProjects(ProjectStorage.getAllProjects());
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (id: string) => {
    ProjectStorage.deleteProject(id);
    setProjects(ProjectStorage.getAllProjects());
    if (activeProjectId === id) {
      ActiveProject.clearActive();
      setActiveProjectId(null);
      setStories([]);
      setTasks([]);
    }
  };

  const handleSelectProject = (projectId: string) => {
    ActiveProject.setActive(projectId);
    setActiveProjectId(projectId);
    setStories(ProjectStorage.getAllStories(projectId));
    setTasks(ProjectStorage.getAllTasks());
  };

  const handleCreateStory = () => {
    if (activeProjectId && newStory.name && newStory.description) {
      const story: Story = {
        id: crypto.randomUUID(),
        name: newStory.name,
        description: newStory.description,
        priority: newStory.priority,
        projectId: activeProjectId,
        createdAt: new Date().toISOString(),
        status: 'todo',
        ownerId: users[0]?.id || '1',
      };
      ProjectStorage.addStory(story);
      setStories(ProjectStorage.getAllStories(activeProjectId));
      setNewStory({ name: '', description: '', priority: 'low' });
    }
  };

  const handleUpdateStory = () => {
    if (editingStory && activeProjectId) {
      ProjectStorage.updateStory(editingStory);
      setStories(ProjectStorage.getAllStories(activeProjectId));
      setEditingStory(null);
    }
  };

  const handleDeleteStory = (id: string) => {
    if (activeProjectId) {
      ProjectStorage.deleteStory(id);
      setStories(ProjectStorage.getAllStories(activeProjectId));
      setTasks(ProjectStorage.getAllTasks());
    }
  };

  const handleCreateTask = () => {
    if (activeProjectId && newTask.name && newTask.description && newTask.storyId) {
      const task: Task = {
        id: crypto.randomUUID(),
        name: newTask.name,
        description: newTask.description,
        priority: newTask.priority,
        storyId: newTask.storyId,
        estimatedTime: newTask.estimatedTime,
        status: 'todo',
        createdAt: new Date().toISOString(),
      };
      ProjectStorage.addTask(task);
      setTasks(ProjectStorage.getAllTasks());
      setNewTask({ name: '', description: '', priority: 'low', storyId: '', estimatedTime: 1 });
    }
  };

  const handleUpdateTask = () => {
    if (editingTask && activeProjectId) {
      ProjectStorage.updateTask(editingTask);
      setTasks(ProjectStorage.getAllTasks());
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (activeProjectId) {
      ProjectStorage.deleteTask(id);
      setTasks(ProjectStorage.getAllTasks());
    }
  };

  const filterStoriesByStatus = (status: Story['status']) => {
    return stories.filter((story) => story.status === status);
  };

  const filterTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status && stories.some((s) => s.id === task.storyId));
  };

  const MainApp = () => (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="title">ManagMe</h1>

        {/* Create/Update Project */}
        <div className="form-section">
          <h2 className="form-title">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
          <input
            type="text"
            placeholder="Project Name"
            value={editingProject ? editingProject.name : newProject.name}
            onChange={(e) =>
              editingProject
                ? setEditingProject({ ...editingProject, name: e.target.value })
                : setNewProject({ ...newProject, name: e.target.value })
            }
            className="input"
          />
          <textarea
            placeholder="Project Description"
            value={editingProject ? editingProject.description : newProject.description}
            onChange={(e) =>
              editingProject
                ? setEditingProject({ ...editingProject, description: e.target.value })
                : setNewProject({ ...newProject, description: e.target.value })
            }
            className="textarea"
          />
          {editingProject ? (
            <div>
              <button
                onClick={handleUpdateProject}
                className="button button-secondary"
              >
                Update
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="button button-cancel"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleCreateProject}
              className="button button-primary"
            >
              Add
            </button>
          )}
        </div>

        {/* Project List */}
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className={`project-item ${activeProjectId === project.id ? 'project-item-active' : ''}`}>
              <div>
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>
              <div>
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className="button button-choose"
                >
                  Choose
                </button>
                <button
                  onClick={() => setEditingProject(project)}
                  className="button button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="button button-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Stories Section */}
        {activeProjectId && (
          <>
            <div className="form-section">
              <h2 className="form-title">{editingStory ? 'Edit Story' : 'Add Story'}</h2>
              <input
                type="text"
                placeholder="Story Name"
                value={editingStory ? editingStory.name : newStory.name}
                onChange={(e) =>
                  editingStory
                    ? setEditingStory({ ...editingStory, name: e.target.value })
                    : setNewStory({ ...newStory, name: e.target.value })
                }
                className="input"
              />
              <textarea
                placeholder="Story Description"
                value={editingStory ? editingStory.description : newStory.description}
                onChange={(e) =>
                  editingStory
                    ? setEditingStory({ ...editingStory, description: e.target.value })
                    : setNewStory({ ...newStory, description: e.target.value })
                }
                className="textarea"
              />
              <select
                value={editingStory ? editingStory.priority : newStory.priority}
                onChange={(e) =>
                  editingStory
                    ? setEditingStory({ ...editingStory, priority: e.target.value as Story['priority'] })
                    : setNewStory({ ...newStory, priority: e.target.value as Story['priority'] })
                }
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {editingStory && (
                <select
                  value={editingStory.status}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, status: e.target.value as Story['status'] })
                  }
                  className="input"
                >
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              )}
              {editingStory ? (
                <div>
                  <button
                    onClick={handleUpdateStory}
                    className="button button-secondary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingStory(null)}
                    className="button button-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCreateStory}
                  className="button button-primary"
                >
                  Add
                </button>
              )}
            </div>

            {/* Stories List */}
            <div className="stories-section">
              <h2 className="form-title">Stories</h2>
              <div className="story-column">
                <h3 className="story-column-title">To Do</h3>
                <ul className="story-list">
                  {filterStoriesByStatus('todo').map((story) => (
                    <li key={story.id} className="story-item">
                      <div>
                        <h4 className="story-title">{story.name}</h4>
                        <p className="story-description">{story.description}</p>
                        <p className="story-meta">Priority: {story.priority}</p>
                        <p className="story-meta">Owner: {users.find((u) => u.id === story.ownerId)?.firstName}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => setEditingStory(story)}
                          className="button button-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="button button-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="story-column">
                <h3 className="story-column-title">Doing</h3>
                <ul className="story-list">
                  {filterStoriesByStatus('doing').map((story) => (
                    <li key={story.id} className="story-item">
                      <div>
                        <h4 className="story-title">{story.name}</h4>
                        <p className="story-description">{story.description}</p>
                        <p className="story-meta">Priority: {story.priority}</p>
                        <p className="story-meta">Owner: {users.find((u) => u.id === story.ownerId)?.firstName}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => setEditingStory(story)}
                          className="button button-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="button button-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="story-column">
                <h3 className="story-column-title">Done</h3>
                <ul className="story-list">
                  {filterStoriesByStatus('done').map((story) => (
                    <li key={story.id} className="story-item">
                      <div>
                        <h4 className="story-title">{story.name}</h4>
                        <p className="story-description">{story.description}</p>
                        <p className="story-meta">Priority: {story.priority}</p>
                        <p className="story-meta">Owner: {users.find((u) => u.id === story.ownerId)?.firstName}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => setEditingStory(story)}
                          className="button button-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="button button-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="form-section">
              <h2 className="form-title">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
              <input
                type="text"
                placeholder="Task Name"
                value={editingTask ? editingTask.name : newTask.name}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, name: e.target.value })
                    : setNewTask({ ...newTask, name: e.target.value })
                }
                className="input"
              />
              <textarea
                placeholder="Task Description"
                value={editingTask ? editingTask.description : newTask.description}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, description: e.target.value })
                    : setNewTask({ ...newTask, description: e.target.value })
                }
                className="textarea"
              />
              <select
                value={editingTask ? editingTask.priority : newTask.priority}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })
                    : setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })
                }
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={editingTask ? editingTask.storyId : newTask.storyId}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, storyId: e.target.value })
                    : setNewTask({ ...newTask, storyId: e.target.value })
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
                value={editingTask ? editingTask.estimatedTime : newTask.estimatedTime}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, estimatedTime: Number(e.target.value) })
                    : setNewTask({ ...newTask, estimatedTime: Number(e.target.value) })
                }
                className="input"
                min="1"
              />
              {editingTask ? (
                <div>
                  <button
                    onClick={handleUpdateTask}
                    className="button button-secondary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="button button-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCreateTask}
                  className="button button-primary"
                >
                  Add
                </button>
              )}
            </div>

            {/* Tasks Kanban Board */}
            <div className="tasks-section">
              <h2 className="form-title">Tasks Kanban Board</h2>
              <div className="kanban-board">
                <div className="kanban-column">
                  <h3 className="kanban-column-title">To Do</h3>
                  <ul className="task-list">
                    {filterTasksByStatus('todo').map((task) => (
                      <li key={task.id} className="task-item">
                        <div>
                          <h4 className="task-title">{task.name}</h4>
                          <p className="task-description">{task.description}</p>
                          <p className="task-meta">Priority: {task.priority}</p>
                          <p className="task-meta">Story: {stories.find((s) => s.id === task.storyId)?.name}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedTaskId(task.id)}
                            className="button button-details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="button button-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="button button-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="kanban-column">
                  <h3 className="kanban-column-title">Doing</h3>
                  <ul className="task-list">
                    {filterTasksByStatus('doing').map((task) => (
                      <li key={task.id} className="task-item">
                        <div>
                          <h4 className="task-title">{task.name}</h4>
                          <p className="task-description">{task.description}</p>
                          <p className="task-meta">Priority: {task.priority}</p>
                          <p className="task-meta">Story: {stories.find((s) => s.id === task.storyId)?.name}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedTaskId(task.id)}
                            className="button button-details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="button button-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="button button-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="kanban-column">
                  <h3 className="kanban-column-title">Done</h3>
                  <ul className="task-list">
                    {filterTasksByStatus('done').map((task) => (
                      <li key={task.id} className="task-item">
                        <div>
                          <h4 className="task-title">{task.name}</h4>
                          <p className="task-description">{task.description}</p>
                          <p className="task-meta">Priority: {task.priority}</p>
                          <p className="task-meta">Story: {stories.find((s) => s.id === task.storyId)?.name}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedTaskId(task.id)}
                            className="button button-details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="button button-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="button button-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          localStorage.getItem('token') ? (
            <MainApp />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/task/:taskId"
        element={
          localStorage.getItem('token') ? (
            <TaskDetails
              taskId={selectedTaskId || ''}
              onBack={() => navigate('/')}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;