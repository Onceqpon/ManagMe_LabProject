import './style.css';
import type { User, Project, Story, Task } from './models/models';

document.addEventListener('DOMContentLoaded', () => {

    const ApiService = {
        baseUrl: 'http://localhost:3000',
        async request<T>(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body: any = null): Promise<T> {
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const config: RequestInit = { method, headers };
            if (body) {
                config.body = JSON.stringify(body);
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Request failed');
            }

            if (response.status === 204) {
                return {} as T;
            }

            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                return response.json() as T;
            }
            
            return {} as T;
        }
    };

    let currentUser: User | null = null;
    let activeProjectId: string | null = null;
    let activeStoryId: string | null = null;

    const modalElement = document.getElementById('form-modal')!;
    // @ts-ignore - bootstrap is loaded globally
    const formModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const addProjectForm = document.getElementById('add-project-form') as HTMLFormElement;
    const addStoryForm = document.getElementById('add-story-form') as HTMLFormElement;
    const addTaskForm = document.getElementById('add-task-form') as HTMLFormElement;
    const backToStoriesBtn = document.getElementById('back-to-stories-btn');
    const themeToggler = document.getElementById('theme-toggler');
    const logoutBtn = document.getElementById('logout-btn');

    function renderProjects(projects: Project[]) {
        const projectListDiv = document.getElementById('project-list');
        if (!projectListDiv) return;

        projectListDiv.innerHTML = projects.map(project => `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center project-item ${project.id === activeProjectId ? 'active' : ''}" data-project-id="${project.id}">
                <div class="flex-grow-1 project-select-area">
                    <h6 class="mb-1">${project.name}</h6>
                    <p class="mb-1 small text-muted">${project.description || 'Brak opisu'}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary ms-2 edit-btn" title="Edytuj projekt" aria-label="Edytuj projekt" data-project-id="${project.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" title="Usuń projekt" aria-label="Usuń projekt" data-project-id="${project.id}"><i class="bi bi-trash"></i></button>
                </div>
            </a>
        `).join('');

        document.querySelectorAll('.project-item').forEach(el => {
            const id = el.getAttribute('data-project-id');
            if (!id) return;
            
            const project = projects.find(p => p.id === id)!;
            el.querySelector('.project-select-area')?.addEventListener('click', (e) => {
                e.preventDefault();
                activeProjectId = id;
                activeStoryId = null;
                render();
            });
            el.querySelector('.edit-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openEditModal('project', project); });
            el.querySelector('.delete-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openDeleteModal('project', project); });
        });
    }

    function renderStories(stories: Story[]) {
        const storyListContainer = document.getElementById('story-list-container');
        if (!storyListContainer) return;

        storyListContainer.innerHTML = stories.map(story => {
            const priorityColors: { [key: string]: string } = { 'niski': 'success', 'średni': 'warning', 'wysoki': 'danger' };
            const priorityBadge = `<span class="badge bg-${priorityColors[story.priority] || 'secondary'}">${story.priority}</span>`;
            return `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5>${story.name}</h5>
                            <div>
                                <button class="btn btn-sm btn-outline-secondary me-2 edit-btn" title="Edytuj historyjkę" aria-label="Edytuj historyjkę"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-sm btn-outline-danger delete-btn" title="Usuń historyjkę" aria-label="Usuń historyjkę"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                        <div class="mb-2">${priorityBadge}</div>
                        <p class="card-text">${story.description || ''}</p>
                        <button class="btn btn-outline-primary btn-sm view-tasks-btn">Zobacz zadania</button>
                    </div>
                </div>`;
        }).join('');

        document.querySelectorAll('#story-list-container .card').forEach((card, index) => {
            const story = stories[index];
            card.querySelector('.view-tasks-btn')?.addEventListener('click', () => { activeStoryId = story.id; render(); });
            card.querySelector('.edit-btn')?.addEventListener('click', () => openEditModal('story', story));
            card.querySelector('.delete-btn')?.addEventListener('click', () => openDeleteModal('story', story));
        });
    }

    function renderTaskKanban(tasks: Task[]) {
        const columns: { [key: string]: HTMLElement | null } = {
            todo: document.getElementById('tasks-todo'),
            doing: document.getElementById('tasks-doing'),
            done: document.getElementById('tasks-done')
        };

        Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });
        
        tasks.forEach(task => {
            const assigneeName = task.users ? `${task.users.first_name || ''} ${task.users.last_name || ''}`.trim() : 'Nieprzypisane';
            const timeInfo = task.estimated_time ? `<span class="badge bg-secondary"><i class="bi bi-clock"></i> ${task.estimated_time}h</span>` : '';
            
            const taskCard = document.createElement('div');
            taskCard.className = 'card mb-2 task-card';
            taskCard.innerHTML = `
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between">
                        <h6>${task.name}</h6>
                        <button class="btn btn-sm btn-outline-danger delete-btn p-0 px-1" title="Usuń zadanie" aria-label="Usuń zadanie"><i class="bi bi-trash"></i></button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="small text-muted mb-0">${assigneeName || 'Nieprzypisane'}</p>
                        ${timeInfo}
                    </div>
                </div>`;

            taskCard.addEventListener('click', (e) => { 
                if (!(e.target as HTMLElement).closest('.delete-btn')) openEditModal('task', task); 
            });
            taskCard.querySelector('.delete-btn')?.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                openDeleteModal('task', task); 
            });

            if (columns[task.status]) {
                columns[task.status]!.appendChild(taskCard);
            }
        });
    }

    async function render() {
        if (!currentUser) return;

        const projects = await ApiService.request<Project[]>('/projects');
        renderProjects(projects);

        const storiesSection = document.getElementById('stories-section')!;
        if (activeProjectId) {
            storiesSection.classList.remove('hidden');
            const activeProject = projects.find(p => p.id === activeProjectId);
            document.getElementById('stories-header')!.textContent = `Projekt: ${activeProject?.name || ''}`;

            const storyListView = document.getElementById('story-list-view')!;
            const taskBoardView = document.getElementById('task-board-view')!;

            if (activeStoryId) {
                storyListView.classList.add('hidden');
                taskBoardView.classList.remove('hidden');
                
                const stories = await ApiService.request<Story[]>(`/projects/${activeProjectId}/stories`);
                const activeStory = stories.find(s => s.id === activeStoryId);
                document.getElementById('task-board-header')!.textContent = `Historyjka: ${activeStory?.name || ''}`;

                const tasks = await ApiService.request<Task[]>(`/stories/${activeStoryId}/tasks`);
                renderTaskKanban(tasks);
            } else {
                storyListView.classList.remove('hidden');
                taskBoardView.classList.add('hidden');
                const stories = await ApiService.request<Story[]>(`/projects/${activeProjectId}/stories`);
                renderStories(stories);
            }
        } else {
            storiesSection.classList.add('hidden');
        }
    }

    function getEndpoint(type: 'project' | 'story' | 'task', id: string): string {
        const plural = (type === 'story') ? 'stories' : `${type}s`;
        return `/${plural}/${id}`;
    }

    function openDeleteModal(type: 'project' | 'story' | 'task', item: { id: string, name: string }) {
        document.getElementById('modal-title')!.textContent = `Usuń ${type}`;
        document.getElementById('modal-body')!.innerHTML = `<p>Czy na pewno chcesz usunąć <strong>${item.name}</strong>?</p><p class="text-danger">Tej operacji nie można cofnąć.</p>`;
        document.getElementById('modal-footer')!.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button><button type="button" class="btn btn-danger" id="confirm-delete-btn">Usuń</button>`;
        
        document.getElementById('confirm-delete-btn')!.onclick = async () => {
            await ApiService.request(getEndpoint(type, item.id), 'DELETE');
            if (type === 'project' && activeProjectId === item.id) activeProjectId = null;
            if (type === 'story' && activeStoryId === item.id) activeStoryId = null;
            formModal.hide();
            render();
        };
        formModal.show();
    }

    function createProjectFormHTML(item: Project): string {
        return `
            <form id="edit-form">
                <div class="mb-3">
                    <label for="edit-name" class="form-label">Nazwa</label>
                    <input id="edit-name" type="text" name="name" class="form-control" value="${item.name}">
                </div>
                <div class="mb-3">
                    <label for="edit-description" class="form-label">Opis</label>
                    <textarea id="edit-description" name="description" class="form-control">${item.description || ''}</textarea>
                </div>
            </form>`;
    }
    
    function createStoryFormHTML(item: Story): string {
        const priorities = ['niski', 'średni', 'wysoki'];
        const options = priorities.map(p => `<option value="${p}" ${item.priority === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('');
        return `
            <form id="edit-form">
                <div class="mb-3"><label for="edit-name" class="form-label">Nazwa</label><input id="edit-name" type="text" name="name" class="form-control" value="${item.name}"></div>
                <div class="mb-3"><label for="edit-description" class="form-label">Opis</label><textarea id="edit-description" name="description" class="form-control">${item.description || ''}</textarea></div>
                <div class="mb-3"><label for="edit-priority" class="form-label">Priorytet</label><select id="edit-priority" name="priority" class="form-select">${options}</select></div>
            </form>`;
    }
    
    async function createTaskFormHTML(item: Task): Promise<string> {
        const assignableUsers = await ApiService.request<User[]>('/users/assignable');
        const assigneeOptions = assignableUsers.map(u => `<option value="${u.id}" ${item.assignee_id === u.id ? 'selected' : ''}>${u.first_name} ${u.last_name}</option>`).join('');
        const statuses = ['todo', 'doing', 'done'];
        const statusOptions = statuses.map(s => `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');
        return `
            <form id="edit-form">
                <div class="mb-3"><label for="edit-name" class="form-label">Nazwa</label><input id="edit-name" type="text" name="name" class="form-control" value="${item.name}"></div>
                <div class="mb-3"><label for="edit-time" class="form-label">Szacowany czas (h)</label><input id="edit-time" type="number" name="estimated_time" class="form-control" value="${item.estimated_time || ''}"></div>
                <div class="mb-3"><label for="edit-assignee" class="form-label">Przypisz osobę</label><select id="edit-assignee" name="assignee_id" class="form-select" ${item.status === 'done' ? 'disabled' : ''}><option value="">-- Nieprzypisane --</option>${assigneeOptions}</select></div>
                <div class="mb-3"><label for="edit-status" class="form-label">Status</label><select id="edit-status" name="status" class="form-select" ${!item.assignee_id ? 'disabled' : ''}>${statusOptions}</select></div>
            </form>`;
    }

    async function openEditModal(type: 'project' | 'story' | 'task', item: any) {
        document.getElementById('modal-title')!.textContent = `Edytuj ${type}: ${item.name}`;
        const modalBody = document.getElementById('modal-body')!;
        
        modalBody.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
        
        let formHTML = '';
        if (type === 'project') formHTML = createProjectFormHTML(item);
        else if (type === 'story') formHTML = createStoryFormHTML(item);
        else if (type === 'task') formHTML = await createTaskFormHTML(item);
        
        modalBody.innerHTML = formHTML;
        document.getElementById('modal-footer')!.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button><button type="button" class="btn btn-primary" id="confirm-edit-btn">Zapisz</button>`;

        document.getElementById('confirm-edit-btn')!.onclick = async () => {
            const form = document.getElementById('edit-form') as HTMLFormElement;
            const formData = new FormData(form);
            const updates = Object.fromEntries(formData.entries());
            await ApiService.request(getEndpoint(type, item.id), 'PATCH', updates);
            formModal.hide();
            render();
        };
        formModal.show();
    }

    async function handleLoginSubmit(event: Event) {
        event.preventDefault();
        const email = (document.getElementById('login-email-input') as HTMLInputElement).value;
        const password = (document.getElementById('login-password-input') as HTMLInputElement).value;
        const loginError = document.getElementById('login-error')!;
        loginError.textContent = '';
        
        try {
            const data = await ApiService.request<{ accessToken: string }>('/login', 'POST', { email, password });
            localStorage.setItem('accessToken', data.accessToken);
            await initializeApp();
        } catch (error: any) {
            loginError.textContent = error.message || 'Błąd logowania.';
        }
    }

    async function handleAddProjectSubmit(event: Event) {
        event.preventDefault();
        const formData = new FormData(addProjectForm);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        await ApiService.request('/projects', 'POST', { name, description });
        addProjectForm.reset();
        render();
    }

    async function handleAddStorySubmit(event: Event) {
        event.preventDefault();
        if (!activeProjectId) return;
        const formData = new FormData(addStoryForm);
        await ApiService.request('/stories', 'POST', {
            name: formData.get('name'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            project_id: activeProjectId
        });
        addStoryForm.reset();
        render();
    }

    async function handleAddTaskSubmit(event: Event) {
        event.preventDefault();
        if (!activeStoryId) return;
        const formData = new FormData(addTaskForm);
        await ApiService.request('/tasks', 'POST', {
            name: formData.get('name'),
            estimated_time: Number(formData.get('estimatedTime')),
            story_id: activeStoryId
        });
        addTaskForm.reset();
        render();
    }
    
    function setupTheme() {
        const htmlElement = document.documentElement;
        const sunIcon = themeToggler!.querySelector('.theme-icon-sun');
        const moonIcon = themeToggler!.querySelector('.theme-icon-moon');
        
        const getPreferredTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        const setTheme = (theme: string) => {
            htmlElement.setAttribute('data-bs-theme', theme);
            if(sunIcon && moonIcon) {
                sunIcon.classList.toggle('hidden', theme === 'dark');
                moonIcon.classList.toggle('hidden', theme !== 'dark');
            }
            localStorage.setItem('theme', theme);
        };

        setTheme(getPreferredTheme());
        themeToggler!.addEventListener('click', () => setTheme(htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'));
    }

    function handleLogout() {
        localStorage.removeItem('accessToken');
        window.location.reload();
    }
    
    async function initializeApp() {
        const authContainer = document.getElementById('auth-container')!;
        const appView = document.getElementById('app')!;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            authContainer.classList.remove('hidden');
            appView.classList.add('hidden');
            return;
        }

        try {
            currentUser = await ApiService.request<User>('/me');
            document.getElementById('user-panel')!.textContent = `Zalogowano jako: ${currentUser.first_name} ${currentUser.last_name}`;
            authContainer.classList.add('hidden');
            appView.classList.remove('hidden');
            render();
        } catch (error) {
            localStorage.removeItem('accessToken');
            authContainer.classList.remove('hidden');
            appView.classList.add('hidden');
        }
    }

    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
    if (addProjectForm) addProjectForm.addEventListener('submit', handleAddProjectSubmit);
    if (addStoryForm) addStoryForm.addEventListener('submit', handleAddStorySubmit);
    if (addTaskForm) addTaskForm.addEventListener('submit', handleAddTaskSubmit);
    if (backToStoriesBtn) backToStoriesBtn.addEventListener('click', () => { activeStoryId = null; render(); });
    if (themeToggler) setupTheme();
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    initializeApp();
});