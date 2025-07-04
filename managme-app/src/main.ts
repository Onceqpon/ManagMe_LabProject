import './style.css';

document.addEventListener('DOMContentLoaded', () => {

    const ApiService = {
        baseUrl: 'http://localhost:3000',
        async request(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body: any = null) {
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            const config: RequestInit = { method, headers };
            if (body) config.body = JSON.stringify(body);

            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Request failed');
            }
            if (response.status === 204) return {};
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) return response.json();
            return {};
        }
    };

    let currentUser: any = null;
    let activeProjectId: string | null = null;
    let activeStoryId: string | null = null;
    
    const modalElement = document.getElementById('form-modal')!;
    // @ts-ignore
    const formModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const loginEmailInput = document.getElementById('login-email-input') as HTMLInputElement;
            const loginPasswordInput = document.getElementById('login-password-input') as HTMLInputElement;
            const loginError = document.getElementById('login-error');
            if (!loginEmailInput || !loginPasswordInput || !loginError) return;
            loginError.textContent = '';
            try {
                const data = await ApiService.request('/login', 'POST', { email: loginEmailInput.value, password: loginPasswordInput.value });
                localStorage.setItem('accessToken', data.accessToken);
                await initializeApp();
            } catch (error: any) {
                loginError.textContent = error.message || 'Błąd logowania.';
            }
        });
    }

    async function initializeApp() {
        const authContainer = document.getElementById('auth-container');
        const appView = document.getElementById('app');
        if (!authContainer || !appView) return;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            authContainer.classList.remove('hidden');
            appView.classList.add('hidden');
            return;
        }
        try {
            currentUser = await ApiService.request('/me');
            const userPanel = document.getElementById('user-panel');
            if (userPanel) userPanel.textContent = `Zalogowano jako: ${currentUser.email}`;
            authContainer.classList.add('hidden');
            appView.classList.remove('hidden');
            render();
        } catch (error) {
            localStorage.removeItem('accessToken');
            authContainer.classList.remove('hidden');
            appView.classList.add('hidden');
        }
    }

    async function render() {
        if (!currentUser) return;
        const projects = await ApiService.request('/projects');
        renderProjects(projects);
        const storiesSection = document.getElementById('stories-section');
        if (!storiesSection) return;
        if (activeProjectId) {
            storiesSection.classList.remove('hidden');
            const storiesHeader = document.getElementById('stories-header');
            const activeProject = projects.find((p: any) => p.id === activeProjectId);
            if (storiesHeader) storiesHeader.textContent = `Projekt: ${activeProject?.name || ''}`;
            const storyListView = document.getElementById('story-list-view');
            const taskBoardView = document.getElementById('task-board-view');
            if (!storyListView || !taskBoardView) return;
            if (activeStoryId) {
                storyListView.classList.add('hidden');
                taskBoardView.classList.remove('hidden');
                const stories = await ApiService.request(`/projects/${activeProjectId}/stories`);
                const activeStory = stories.find((s: any) => s.id === activeStoryId);
                const taskBoardHeader = document.getElementById('task-board-header');
                if (taskBoardHeader) taskBoardHeader.textContent = `Historyjka: ${activeStory?.name || ''}`;
                const tasks = await ApiService.request(`/stories/${activeStoryId}/tasks`);
                renderTaskKanban(tasks);
            } else {
                storyListView.classList.remove('hidden');
                taskBoardView.classList.add('hidden');
                const stories = await ApiService.request(`/projects/${activeProjectId}/stories`);
                renderStories(stories);
            }
        } else {
            storiesSection.classList.add('hidden');
        }
    }

    function renderProjects(projects: any[]) {
        const projectListDiv = document.getElementById('project-list');
        if (!projectListDiv) return;
        projectListDiv.innerHTML = '';
        projects.forEach(project => {
            const projectEl = document.createElement('div');
            projectEl.className = `list-group-item list-group-item-action d-flex justify-content-between align-items-center ${project.id === activeProjectId ? 'active' : ''}`;
            const nameSpan = document.createElement('span');
            nameSpan.textContent = project.name;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.flexGrow = '1';
            nameSpan.addEventListener('click', () => { activeProjectId = project.id; activeStoryId = null; render(); });
            const buttonsDiv = document.createElement('div');
            // ZMIANA: Dodanie aria-label
            buttonsDiv.innerHTML = `<button class="btn btn-sm btn-outline-secondary me-2 edit-btn" title="Edytuj projekt" aria-label="Edytuj projekt"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger delete-btn" title="Usuń projekt" aria-label="Usuń projekt"><i class="bi bi-trash"></i></button>`;
            buttonsDiv.querySelector('.edit-btn')?.addEventListener('click', () => openEditModal('project', project));
            buttonsDiv.querySelector('.delete-btn')?.addEventListener('click', () => openDeleteModal('project', project));
            projectEl.appendChild(nameSpan);
            projectEl.appendChild(buttonsDiv);
            projectListDiv.appendChild(projectEl);
        });
    }

    function renderStories(stories: any[]) {
        const storyListContainer = document.getElementById('story-list-container');
        if (!storyListContainer) return;
        storyListContainer.innerHTML = '';
        stories.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'card mb-3 shadow-sm';
            const priorityColors: { [key: string]: string } = { 'niski': 'success', 'średni': 'warning', 'wysoki': 'danger' };
            const priorityBadge = `<span class="badge bg-${priorityColors[story.priority] || 'secondary'}">${story.priority}</span>`;
            // ZMIANA: Dodanie aria-label
            storyCard.innerHTML = `<div class="card-body"><div class="d-flex justify-content-between align-items-start"><h5>${story.name}</h5><div><button class="btn btn-sm btn-outline-secondary me-2 edit-btn" title="Edytuj historyjkę" aria-label="Edytuj historyjkę"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger delete-btn" title="Usuń historyjkę" aria-label="Usuń historyjkę"><i class="bi bi-trash"></i></button></div></div><div class="mb-2">${priorityBadge}</div><p class="card-text">${story.description || ''}</p><button class="btn btn-outline-primary btn-sm view-tasks-btn">Zobacz zadania</button></div>`;
            storyCard.querySelector('.view-tasks-btn')?.addEventListener('click', () => { activeStoryId = story.id; render(); });
            storyCard.querySelector('.edit-btn')?.addEventListener('click', () => openEditModal('story', story));
            storyCard.querySelector('.delete-btn')?.addEventListener('click', () => openDeleteModal('story', story));
            storyListContainer.appendChild(storyCard);
        });
    }

    function renderTaskKanban(tasks: any[]) {
        const tasksTodoDiv = document.getElementById('tasks-todo');
        const tasksDoingDiv = document.getElementById('tasks-doing');
        const tasksDoneDiv = document.getElementById('tasks-done');
        if (!tasksTodoDiv || !tasksDoingDiv || !tasksDoneDiv) return;
        tasksTodoDiv.innerHTML = ''; tasksDoingDiv.innerHTML = ''; tasksDoneDiv.innerHTML = '';
        tasks.forEach(task => {
            const assigneeName = task.users ? `${task.users.first_name || ''} ${task.users.last_name || ''}`.trim() : 'Nieprzypisane';
            const taskCard = document.createElement('div');
            taskCard.className = 'card mb-2 task-card';
            const timeInfo = task.estimated_time ? `<span class="badge bg-secondary"><i class="bi bi-clock"></i> ${task.estimated_time}h</span>` : '';
            // ZMIANA: Dodanie aria-label
            taskCard.innerHTML = `<div class="card-body p-2"><div class="d-flex justify-content-between"><h6>${task.name}</h6><button class="btn btn-sm btn-outline-danger delete-btn p-0 px-1" title="Usuń zadanie" aria-label="Usuń zadanie"><i class="bi bi-trash"></i></button></div><div class="d-flex justify-content-between align-items-center"><p class="small text-muted mb-0">${assigneeName}</p>${timeInfo}</div></div>`;
            taskCard.addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('.delete-btn')) openEditModal('task', task); });
            taskCard.querySelector('.delete-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openDeleteModal('task', task); });
            if (task.status === 'todo') tasksTodoDiv.appendChild(taskCard);
            else if (task.status === 'doing') tasksDoingDiv.appendChild(taskCard);
            else if (task.status === 'done') tasksDoneDiv.appendChild(taskCard);
        });
    }

    function getEndpoint(type: 'project' | 'story' | 'task', id: string): string {
        const plural = (type === 'story') ? 'stories' : `${type}s`;
        return `/${plural}/${id}`;
    }

    function openDeleteModal(type: 'project' | 'story' | 'task', item: any) {
        const modalTitle = document.getElementById('modal-title')!;
        const modalBody = document.getElementById('modal-body')!;
        const modalFooter = document.getElementById('modal-footer')!;
        modalTitle.textContent = `Usuń ${type}`;
        modalBody.innerHTML = `<p>Czy na pewno chcesz usunąć <strong>${item.name}</strong>?</p><p class="text-danger">Tej operacji nie można cofnąć.</p>`;
        modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button><button type="button" class="btn btn-danger" id="confirm-delete-btn">Usuń</button>`;
        const confirmBtn = document.getElementById('confirm-delete-btn') as HTMLButtonElement;
        confirmBtn.onclick = async () => {
            await ApiService.request(getEndpoint(type, item.id), 'DELETE');
            if (type === 'project' && activeProjectId === item.id) activeProjectId = null;
            if (type === 'story' && activeStoryId === item.id) activeStoryId = null;
            formModal.hide();
            render();
        };
        formModal.show();
    }

    async function openEditModal(type: 'project' | 'story' | 'task', item: any) {
        const modalTitle = document.getElementById('modal-title')!;
        const modalBody = document.getElementById('modal-body')!;
        const modalFooter = document.getElementById('modal-footer')!;
        modalTitle.textContent = `Edytuj ${type}: ${item.name}`;
        let formHTML = '';

        if (type === 'project') {
            formHTML = `<form id="edit-form"><div class="mb-3"><label for="edit-name" class="form-label">Nazwa</label><input id="edit-name" type="text" name="name" class="form-control" value="${item.name}"></div><div class="mb-3"><label for="edit-description" class="form-label">Opis</label><textarea id="edit-description" name="description" class="form-control">${item.description || ''}</textarea></div></form>`;
        } else if (type === 'story') {
            formHTML = `
                <form id="edit-form">
                    <div class="mb-3"><label for="edit-name" class="form-label">Nazwa</label><input id="edit-name" type="text" name="name" class="form-control" value="${item.name}"></div>
                    <div class="mb-3"><label for="edit-description" class="form-label">Opis</label><textarea id="edit-description" name="description" class="form-control">${item.description || ''}</textarea></div>
                    <div class="mb-3"><label for="edit-priority" class="form-label">Priorytet</label>
                        <select id="edit-priority" name="priority" class="form-select">
                            <option value="niski" ${item.priority === 'niski' ? 'selected' : ''}>Niski</option>
                            <option value="średni" ${item.priority === 'średni' ? 'selected' : ''}>Średni</option>
                            <option value="wysoki" ${item.priority === 'wysoki' ? 'selected' : ''}>Wysoki</option>
                        </select>
                    </div>
                </form>`;
        } else if (type === 'task') {
            const assignableUsers = await ApiService.request('/users/assignable');
            const assigneeOptions = assignableUsers.map((u: any) => `<option value="${u.id}" ${item.assignee_id === u.id ? 'selected' : ''}>${u.first_name} ${u.last_name}</option>`).join('');
            formHTML = `
                <form id="edit-form">
                    <div class="mb-3"><label for="edit-name" class="form-label">Nazwa</label><input id="edit-name" type="text" name="name" class="form-control" value="${item.name}"></div>
                    <div class="mb-3"><label for="edit-time" class="form-label">Szacowany czas (h)</label><input id="edit-time" type="number" name="estimated_time" class="form-control" value="${item.estimated_time || ''}"></div>
                    <div class="mb-3"><label for="edit-assignee" class="form-label">Przypisz osobę</label><select id="edit-assignee" name="assignee_id" class="form-select" ${item.status === 'done' ? 'disabled' : ''}><option value="">-- Nieprzypisane --</option>${assigneeOptions}</select></div>
                    <div class="mb-3"><label for="edit-status" class="form-label">Status</label><select id="edit-status" name="status" class="form-select" ${item.assignee_id === null ? 'disabled' : ''}><option value="todo" ${item.status === 'todo' ? 'selected' : ''}>Todo</option><option value="doing" ${item.status === 'doing' ? 'selected' : ''}>Doing</option><option value="done" ${item.status === 'done' ? 'selected' : ''}>Done</option></select></div>
                </form>`;
        }
        
        modalBody.innerHTML = formHTML;
        modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button><button type="button" class="btn btn-primary" id="confirm-edit-btn">Zapisz</button>`;
        const confirmBtn = document.getElementById('confirm-edit-btn') as HTMLButtonElement;
        confirmBtn.onclick = async () => {
            const form = document.getElementById('edit-form') as HTMLFormElement;
            const formData = new FormData(form);
            const updates: { [key: string]: any } = {};
            formData.forEach((value, key) => { updates[key] = value; });
            await ApiService.request(getEndpoint(type, item.id), 'PATCH', updates);
            formModal.hide();
            render();
        };
        formModal.show();
    }

    const addProjectForm = document.getElementById('add-project-form') as HTMLFormElement;
    if (addProjectForm) addProjectForm.addEventListener('submit', async (e) => { e.preventDefault(); await ApiService.request('/projects', 'POST', { name: (new FormData(addProjectForm).get('name') as string) }); addProjectForm.reset(); render(); });
    const addStoryForm = document.getElementById('add-story-form') as HTMLFormElement;
    if (addStoryForm) addStoryForm.addEventListener('submit', async (e) => { e.preventDefault(); if (!activeProjectId) return; const fd = new FormData(addStoryForm); await ApiService.request('/stories', 'POST', { name: fd.get('name'), description: fd.get('description'), priority: fd.get('priority'), project_id: activeProjectId }); addStoryForm.reset(); render(); });
    const backToStoriesBtn = document.getElementById('back-to-stories-btn');
    if (backToStoriesBtn) backToStoriesBtn.addEventListener('click', () => { activeStoryId = null; render(); });
    const addTaskForm = document.getElementById('add-task-form') as HTMLFormElement;
    if (addTaskForm) addTaskForm.addEventListener('submit', async (e) => { e.preventDefault(); if (!activeStoryId) return; const fd = new FormData(addTaskForm); await ApiService.request('/tasks', 'POST', { name: fd.get('name'), estimated_time: Number(fd.get('estimatedTime')), priority: fd.get('priority'), story_id: activeStoryId }); addTaskForm.reset(); render(); });
    const themeToggler = document.getElementById('theme-toggler');
    if (themeToggler) { 
        const htmlElement = document.documentElement;
        const sunIcon = themeToggler.querySelector('.theme-icon-sun');
        const moonIcon = themeToggler.querySelector('.theme-icon-moon');
        const getPreferredTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const setTheme = (theme: string) => { htmlElement.setAttribute('data-bs-theme', theme); if (sunIcon && moonIcon) { theme === 'dark' ? (sunIcon.classList.add('hidden'), moonIcon.classList.remove('hidden')) : (sunIcon.classList.remove('hidden'), moonIcon.classList.add('hidden')); } localStorage.setItem('theme', theme); };
        themeToggler.addEventListener('click', () => setTheme(htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'));
        setTheme(getPreferredTheme());
     }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) { logoutBtn.addEventListener('click', () => { localStorage.removeItem('accessToken'); window.location.reload(); }); }

    initializeApp();
});
