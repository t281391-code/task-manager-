// Хэлний функциональ language.js руу шилжсэн

// DOM бүрэн ачаалагдтыг хүлээх
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // API болон Үйлчилгээнүүдийг эхлүүлэх
    const taskAPI = new TaskAPI();
    const taskService = new TaskService(taskAPI, appState);
    
    // Хэл солих функциональ
    const langEn = document.getElementById('langEn');
    const langMn = document.getElementById('langMn');
    const langMnMong = document.getElementById('langMnMong');
    
    // Хэлний удирдагчийг эхлүүлэх
    languageManager.init();
    appState.setLanguage(languageManager.getCurrentLanguage());
    
    // Одоогийн хэл дээр үндэслэн идэвхтэй товчийг шинэчлэх
    function updateLanguageButtons() {
        const currentLang = languageManager.getCurrentLanguage();
        if (langEn && langMn && langMnMong) {
            // Бүх товчнуудаас active классыг хасах
            langEn.classList.remove('active');
            langMn.classList.remove('active');
            langMnMong.classList.remove('active');
            
            // Одоогийн хэлний товч руу active класс нэмэх
            if (currentLang === 'en') {
                langEn.classList.add('active');
            } else if (currentLang === 'mn') {
                langMn.classList.add('active');
            } else if (currentLang === 'mn-mong') {
                langMnMong.classList.add('active');
            }
        }
    }
    
    // Хэлний товчнуудыг эхлүүлэх
    updateLanguageButtons();
    
    // Хэл солих үйл явдлын сонсогч
    if (langEn) {
        langEn.addEventListener('click', () => {
            languageManager.setLanguage('en');
            appState.setLanguage('en');
            updateLanguageButtons();
            // Хэрэв renderTasks функц байвал даалгавруудыг дахин харуулах
            if (typeof renderTasks === 'function') {
                renderTasks();
            }
        });
    }
    
    if (langMn) {
        langMn.addEventListener('click', () => {
            languageManager.setLanguage('mn');
            appState.setLanguage('mn');
            updateLanguageButtons();
            // Хэрэв renderTasks функц байвал даалгавруудыг дахин харуулах
            if (typeof renderTasks === 'function') {
                renderTasks();
            }
        });
    }
    
    if (langMnMong) {
        langMnMong.addEventListener('click', () => {
            languageManager.setLanguage('mn-mong');
            appState.setLanguage('mn-mong');
            updateLanguageButtons();
            // Хэрэв renderTasks функц байвал даалгавруудыг дахин харуулах
            if (typeof renderTasks === 'function') {
                renderTasks();
            }
        });
    }
    
    // Гэрэл солих функциональ - theme.js руу шилжсэн
    // Гэрлийн удирдагчийг эхлүүлэх болон апп төлөвтэй синхрончлох
    if (typeof themeManager !== 'undefined') {
        // themeManager.init() нь theme.js дээр аль хэдийн дуудагдсан, дахин дуудахгүй
        appState.setTheme(themeManager.getCurrentTheme());
        themeManager.subscribeToState(appState);
        
        // Гэрэл өөрчлөгдөхөд апп төлөвийг шинэчлэх
        const originalToggleTheme = themeManager.toggleTheme.bind(themeManager);
        themeManager.toggleTheme = function() {
            const newTheme = originalToggleTheme();
            appState.setTheme(newTheme);
            return newTheme;
        };
    }
    
    // Явцын тойргийн SVG градиент тодорхойлолт нэмэх
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const svg = progressCircle.closest('svg');
        if (svg && !svg.querySelector('defs')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', 'gradient');
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');
            
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', '#ff6b9d');
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', '#c44569');
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
            svg.insertBefore(defs, svg.firstChild);
        }
    }
    
    // Даалгаврын цонхны функциональ
    const createTaskBtn = document.getElementById('createTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskForm = document.getElementById('taskForm');
    
    // Open modal
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            if (taskModal) {
                taskModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Цонх хаах функц
    function closeTaskModal() {
        if (taskModal) {
            taskModal.classList.remove('active');
            document.body.style.overflow = '';
            taskForm.reset();
        }
    }
    
    // Цонх хаах үйл явдлууд
    if (closeModal) {
        closeModal.addEventListener('click', closeTaskModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTaskModal);
    }
    
    // Close modal when clicking outside
    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                closeTaskModal();
            }
        });
    }
    
    // Escape товчоор цонх хаах
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && taskModal && taskModal.classList.contains('active')) {
            closeTaskModal();
        }
    });
    
    // UI Рендер - Даалгавруудыг харуулах цэвэр функц (эрт тодорхойлох)
    function renderTasks(tasks = null) {
        const tasksList = document.getElementById('tasksList');
        const emptyTasks = document.getElementById('emptyTasks');
        const tasksCount = document.getElementById('tasksCount');
        
        if (!tasksList) {
            console.error('Tasks list element not found!');
            return;
        }
        
        // Хэрэв өгөгдөөгүй бол төлөвөөс даалгавруудыг авах
        let tasksToRender = tasks;
        if (!tasksToRender || !Array.isArray(tasksToRender)) {
            tasksToRender = appState.getStateProperty('tasks') || [];
        }
        
        // Энэ нь массив эсэхийг баталгаажуулах
        if (!Array.isArray(tasksToRender)) {
            tasksToRender = [];
        }
        
        // Дууссан даалгавруудыг шүүх - "Миний даалгаврууд" хэсэгт зөвхөн идэвхтэй даалгавруудыг харуулах
        const currentPage = appState.getStateProperty('currentPage');
        if (currentPage !== 'taskList') {
            // Хяналтын самбар дээр зөвхөн идэвхтэй (дуусаагүй) даалгавруудыг харуулах
            tasksToRender = tasksToRender.filter(task => !task.completed);
        }
        
        const currentLang = languageManager.getCurrentLanguage();
        
        // Тооллого шинэчлэх (зөвхөн идэвхтэй даалгаврууд)
        if (tasksCount) {
            tasksCount.textContent = tasksToRender.length;
        }
        
        // Одоо байгаа даалгавруудыг цэвэрлэх
        tasksList.innerHTML = '';
        
        if (tasksToRender.length === 0) {
            // Хоосон төлөвийг харуулах
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-tasks';
            emptyDiv.id = 'emptyTasks';
            emptyDiv.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p data-i18n="noTasks">${languageManager.translate('noTasks')}</p>
            `;
            tasksList.appendChild(emptyDiv);
        } else {
            // Даалгавруудыг төслийн картууд болгон харуулах
            tasksToRender.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.taskId = task.id;
                
                // checkCount эсвэл progress талбар дээр үндэслэн явцыг тооцоолох (6 шалгалт = 100%)
                let progress = 0;
                if (task.completed) {
                    progress = 100;
                } else if (task.progress !== undefined) {
                    // Хэрэв байвал progress талбарыг ашиглах
                    progress = Math.min(Math.round(task.progress), 100);
                } else if (task.checkCount && task.checkCount > 0) {
                    // checkCount тооцоолол руу буцах
                    progress = Math.min(Math.round((task.checkCount / 6) * 100), 100);
                }
                
                // Огноонуудыг форматлах
                const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
                const endDate = new Date(task.dueDate);
                
                const formattedStartDate = startDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'mn-MN', {
                    day: 'numeric',
                    month: 'long'
                });
                
                const formattedEndDate = endDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'mn-MN', {
                    day: 'numeric',
                    month: 'long'
                });
                
                taskItem.innerHTML = `
                    <div class="task-card-content">
                        <div class="task-card-header">
                            <h4 class="task-card-title">${task.title || 'Untitled Task'}</h4>
                            ${task.description ? `<p class="task-card-description">${task.description}</p>` : ''}
                        </div>
                        <div class="task-progress-section">
                            <div class="task-progress-info">
                                <span class="task-progress-text">${progress}% ${languageManager.translate('completed')}</span>
                            </div>
                            <div class="task-progress-bar">
                                <div class="task-progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <div class="task-dates">
                            <div class="task-date-item">
                                <span class="task-date-label">${languageManager.translate('startDate')}:</span>
                                <span class="task-date-value">${formattedStartDate}</span>
                            </div>
                            <div class="task-date-item">
                                <span class="task-date-label">${languageManager.translate('endDate')}:</span>
                                <span class="task-date-value">${formattedEndDate}</span>
                            </div>
                        </div>
                        <div class="task-card-actions">
                            <button class="task-btn task-btn-check" data-task-id="${task.id}" title="${languageManager.translate('check')}">
                                <i class="fas fa-check"></i>
                                ${languageManager.translate('check')}
                            </button>
                            <button class="task-btn task-btn-edit" data-task-id="${task.id}" title="${languageManager.translate('edit')}">
                                <i class="fas fa-edit"></i>
                                ${languageManager.translate('edit')}
                            </button>
                            <button class="task-btn task-btn-delete" data-task-id="${task.id}" title="${languageManager.translate('delete')}">
                                <i class="fas fa-trash"></i>
                                ${languageManager.translate('delete')}
                            </button>
                        </div>
                    </div>
                `;
                
                tasksList.appendChild(taskItem);
            });
            
            // Шалгах товчнуудын үйл явдлын сонсогч нэмэх
            tasksList.querySelectorAll('.task-btn-check').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const taskId = parseInt(e.target.closest('.task-btn-check').dataset.taskId);
                    await taskService.toggleTaskComplete(taskId);
                    // Шалгасны дараа харагдацыг шинэчлэх
                    const currentPage = appState.getStateProperty('currentPage');
                    if (currentPage === 'taskList') {
                        showTaskListPage();
                    } else {
                        // Хяналтын самбар дээр канбан самбарыг дахин харуулах
                        await taskService.loadTasks();
                        const tasks = appState.getStateProperty('tasks') || [];
                        renderKanbanBoard(tasks);
                        setupKanbanDragAndDrop();
                    }
                });
            });
            
            // Засах товчнуудын үйл явдлын сонсогч нэмэх
            tasksList.querySelectorAll('.task-btn-edit').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const taskId = parseInt(e.target.closest('.task-btn-edit').dataset.taskId);
                    // TODO: Засах функциональ хэрэгжүүлэх
                    const currentLang = appState.getStateProperty('currentLanguage');
                    alert(currentLang === 'en' ? 'Edit functionality coming soon!' : 'Засах функц удахгүй нэмэгдэнэ!');
                });
            });
            
            // Устгах товчнуудын үйл явдлын сонсогч нэмэх
            tasksList.querySelectorAll('.task-btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const taskId = parseInt(e.target.closest('.task-btn-delete').dataset.taskId);
                    const currentLang = appState.getStateProperty('currentLanguage');
                    
                    if (confirm(currentLang === 'en' ? 'Are you sure you want to delete this task?' : 'Энэ даалгаврыг устгахдаа итгэлтэй байна уу?')) {
                        await taskService.deleteTask(taskId);
                    }
                });
            });
        }
    }
    
        // Төлөвийн өөрчлөлтүүдэд бүртгүүлэх (renderTasks тодорхойлогдсоны дараа)
    let lastPage = appState.getStateProperty('currentPage') || 'dashboard';
    let lastSearchQuery = '';
    let isPerformingSearch = false; // Рекурсив дуудлагыг сэргийлэх туг
    appState.subscribe((state) => {
        // Төлөв өөрчлөгдөхөд даалгавруудыг дахин харуулах
        if (state && state.tasks !== undefined) {
            // Даалгаврууд өөрчлөгдөх бүрт явцын тойргийг шинэчлэх
            updateTaskProgress(state.tasks);
            
            const searchQuery = state.searchQuery || '';
            const currentPage = state.currentPage || 'dashboard';
            
            // Хуудас эсвэл хайлтын асуулт үнэхээр өөрчлөгдсөн тохиолдолд л шинэчлэх
            const pageChanged = currentPage !== lastPage;
            const searchChanged = searchQuery !== lastSearchQuery;
            
            // Хайлт удирдах - зөвхөн хяналтын самбарын хуудас дээр
            // Тэмдэглэл: performSearch одоо setupSearch-аас шууд дуудагдаж байгаа тул энд дуудах шаардлагагүй
            // Энэ нь давхар дуудлагыг сэргийлнэ
            if (searchQuery && currentPage === 'dashboard' && searchChanged) {
                lastSearchQuery = searchQuery;
            } else if (!searchQuery && currentPage === 'dashboard' && searchChanged) {
                // Хайлтын үр дүнг цэвэрлэж, ердийн канбан самбарыг харуулах
                renderKanbanBoard(state.tasks);
                setupKanbanDragAndDrop();
                lastSearchQuery = '';
            } else if (currentPage === 'taskList' && pageChanged) {
                // Хэрэв даалгаврын жагсаалтын хуудас дээр байвал даалгаврын жагсаалтын харагдацыг харуулах (зөвхөн хуудас өөрчлөгдсөн тохиолдолд)
                showTaskListPage();
                lastPage = currentPage;
            } else if (currentPage === 'dashboard' && (pageChanged || searchChanged)) {
                // Хяналтын самбарын хуудсыг харуулах болон канбан самбарыг харуулах
                showDashboardPage();
                lastPage = currentPage;
            } else if (currentPage === 'dashboard' && !pageChanged && !searchChanged) {
                // Хэрэв хяналтын самбар дээр байгаа бөгөөд даалгаврууд өөрчлөгдсөн бол канбан самбарыг дахин харуулах
                renderKanbanBoard(state.tasks);
                setupKanbanDragAndDrop();
            } else if (currentPage === 'analytics' && pageChanged) {
                // Шинжилгээний хуудсыг харуулах
                showAnalyticsPage();
                lastPage = currentPage;
            } else if (currentPage === 'settings' && pageChanged) {
                // Тохиргооны хуудсыг харуулах
                showSettingsPage();
                lastPage = currentPage;
            } else if (currentPage === 'calendar' && pageChanged) {
                // Календарын хуудсыг харуулах
                showCalendarPage();
                lastPage = currentPage;
            } else if (currentPage !== 'taskList' && currentPage !== 'dashboard' && currentPage !== 'analytics' && currentPage !== 'settings' && currentPage !== 'calendar') {
                // Анхдагчаар хяналтын самбар дээр зөвхөн идэвхтэй даалгавруудыг харуулах (дууссан даалгавруудыг шүүх)
                if (pageChanged || searchChanged) {
                    renderTasks(state.tasks);
                    lastPage = currentPage;
                }
            }
        }
    });
    
    // Даалгаврын явцын тойргийг шинэчлэх функц
    function updateTaskProgress(tasks) {
        const tasksArray = tasks || [];
        
        // Зөвхөн идэвхтэй даалгавруудыг шүүх (дуусаагүй) - "Миний даалгаврууд" хэсэг дээрх даалгаврууд
        const activeTasks = tasksArray.filter(t => !t.completed);
        const totalActiveTasks = activeTasks.length;
        
        // Дууссан даалгавруудыг тооцоолох (статистикийн хувьд)
        const completedTasks = tasksArray.filter(t => t.completed);
        const completedCount = completedTasks.length;
        
        // Идэвхтэй даалгавруудын тоог тооцоолох (статистикийн хувьд)
        const activeCount = activeTasks.length;
        
        // Идэвхтэй даалгавруудын хувь хүний явц дээр үндэслэн дундаж явцын хувийг тооцоолох
        // Хэрэв идэвхтэй даалгавар байхгүй бол 0%, эсвэл идэвхтэй даалгавруудын явцын утгуудын дундаж
        // Үргэлж 0-ээс эхлэх бөгөөд зөвхөн бүхэл тоонуудыг харуулах
        let progressPercent = 0;
        if (totalActiveTasks > 0) {
            let totalProgress = 0;
            activeTasks.forEach(task => {
                let taskProgress = 0;
                if (task.progress !== undefined) {
                    taskProgress = Math.min(Math.round(task.progress), 100);
                } else if (task.checkCount && task.checkCount > 0) {
                    taskProgress = Math.min(Math.round((task.checkCount / 6) * 100), 100);
                }
                totalProgress += taskProgress;
            });
            // Бүхэл тоо болгож дугуйлах, 0-ээс эхэлсэн эсэхийг баталгаажуулах
            progressPercent = Math.max(0, Math.round(totalProgress / totalActiveTasks));
        }
        
        // Явцын тойргийг шинэчлэх
        const progressBar = document.getElementById('progressBar');
        const progressPercentElement = document.getElementById('progressPercent');
        const taskPassedCount = document.getElementById('taskPassedCount');
        const taskNotPassedCount = document.getElementById('taskNotPassedCount');
        
        if (progressBar) {
            // stroke-dashoffset тооцоолох (283 нь тойрог, 283 = 100%)
            const circumference = 283;
            const offset = circumference - (progressPercent / 100) * circumference;
            progressBar.setAttribute('stroke-dashoffset', offset);
        }
        
        if (progressPercentElement) {
            progressPercentElement.textContent = `${progressPercent}%`;
        }
        
        if (taskPassedCount) {
            taskPassedCount.textContent = completedCount;
        }
        
        if (taskNotPassedCount) {
            taskNotPassedCount.textContent = activeCount;
        }
    }

    // Хайлтын функциональ
    function setupSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) {
            console.error('Search input not found!');
            return;
        }

        console.log('Search setup completed');

        // Бодит цагийн хайлт - debounce хойшлуулалтгүй
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            console.log('Search input changed:', query);
            appState.setSearchQuery(query);
            // Ажиллахыг баталгаажуулахын тулд performSearch-ийг шууд дуудах
            if (!isPerformingSearch) {
                console.log('Calling performSearch with query:', query);
                performSearch(query);
            } else {
                console.log('Search already in progress, skipping...');
            }
        });

        // Escape товчоор хайлтыг цэвэрлэх
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                appState.setSearchQuery('');
                performSearch('');
            }
        });
    }

    function performSearch(query) {
        console.log('performSearch called with query:', query);
        
        // Рекурсив дуудлагыг сэргийлэх
        if (isPerformingSearch) {
            console.log('Search already in progress, returning...');
            return;
        }
        
        isPerformingSearch = true;
        console.log('isPerformingSearch set to true');
        
        try {
        if (!query || query.trim() === '') {
            console.log('Query is empty, showing normal tasks');
            // Хэрэв асуулт хоосон бол ердийн даалгавруудыг харуулах
            const currentPage = appState.getStateProperty('currentPage') || 'dashboard';
            if (currentPage === 'dashboard') {
                renderTasks();
            }
            isPerformingSearch = false;
            return;
        }

        const searchQuery = query.trim().toLowerCase();
        const tasks = appState.getStateProperty('tasks') || [];
        const projects = appState.getStateProperty('projects') || [];
        
        console.log('Total tasks:', tasks.length, 'Total projects:', projects.length);
        
        // Даалгавруудыг шүүх - идэвхтэй болон дууссан даалгавруудад хайх
        const filteredTasks = tasks.filter(task => {
            const title = (task.title || '').toLowerCase();
            const description = (task.description || '').toLowerCase();
            return title.includes(searchQuery) || description.includes(searchQuery);
        });

        // Төслүүдийг шүүх
        const filteredProjects = projects.filter(project => {
            const title = (project.title || '').toLowerCase();
            const description = (project.description || '').toLowerCase();
            return title.includes(searchQuery) || description.includes(searchQuery);
        });

        // Одоогийн хуудаснаас үл хамааран хайлтын үр дүнг хяналтын самбарын хуудас дээр үргэлж харуулах
        const dashboardPage = document.getElementById('dashboardPage');
        if (!dashboardPage) {
            isPerformingSearch = false;
            return;
        }
        
        // Хайх үед хяналтын самбарын хуудас руу шилжих (рекурсийг сэргийлэхийн тулд шаардлагатай бол л төлөвийг шинэчлэх)
        const currentPage = appState.getStateProperty('currentPage') || 'dashboard';
        if (currentPage !== 'dashboard') {
            // Сонсогчдыг идэвхжүүлэхээс зайлсхийхийн тулд шууд төлөв шинэчлэлт ашиглах
            appState.state.currentPage = 'dashboard';
        }
        
        // Хяналтын самбарын хуудас харагдаж байгаа эсэхийг баталгаажуулах
        dashboardPage.style.display = 'block';
        
        // Hide other pages
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        const settingsPage = document.getElementById('settingsPage');
        const calendarPage = document.getElementById('calendarPage');
        
        if (taskListPage) taskListPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'none';
        if (settingsPage) settingsPage.style.display = 'none';
        if (calendarPage) calendarPage.style.display = 'none';
        
        // Идэвхтэй навигацийн элементийг шинэчлэх (зөвхөн хуудас өөрчлөгдсөн тохиолдолд)
        if (currentPage !== 'dashboard') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                const span = item.querySelector('span');
                if (span && span.getAttribute('data-i18n') === 'dashboard') {
                    item.classList.add('active');
                }
            });
        }
        
        // Хайлтын үр дүнг харуулах
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) {
            isPerformingSearch = false;
            return;
        }
        
        if (filteredTasks.length > 0 || filteredProjects.length > 0) {
            renderSearchResults(filteredTasks, filteredProjects, query);
        } else {
            const currentLang = languageManager.getCurrentLanguage();
            tasksList.innerHTML = `
                <div class="empty-tasks">
                    <i class="fas fa-search"></i>
                    <p>${currentLang === 'en' ? 'No results found' : 'Үр дүн олдсонгүй'}</p>
                </div>
            `;
        }
        } finally {
            isPerformingSearch = false;
        }
    }

    function renderSearchResults(tasks, projects, query) {
        console.log('renderSearchResults called with', tasks.length, 'tasks and', projects.length, 'projects');
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) {
            console.error('tasksList not found in renderSearchResults!');
            return;
        }

        const currentLang = languageManager.getCurrentLanguage();
        tasksList.innerHTML = '';
        console.log('Cleared tasksList innerHTML');

        // Render tasks
        tasks.forEach(task => {
            const taskItem = createTaskCardElement(task, currentLang);
            tasksList.appendChild(taskItem);
        });

        // Төслүүдийг харуулах
        projects.forEach(project => {
            const projectItem = createProjectCardElement(project, currentLang);
            tasksList.appendChild(projectItem);
        });

        // Үйл явдлын сонсогч нэмэх
        attachTaskEventListeners(tasksList);
    }

    function createTaskCardElement(task, currentLang) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.taskId = task.id;
        
        // checkCount эсвэл progress талбар дээр үндэслэн явцыг тооцоолох (6 шалгалт = 100%)
        let progress = 0;
        if (task.completed) {
            progress = 100;
        } else if (task.progress !== undefined) {
            // Хэрэв байвал progress талбарыг ашиглах
            progress = Math.min(Math.round(task.progress), 100);
        } else if (task.checkCount && task.checkCount > 0) {
            // checkCount тооцоолол руу буцах
            progress = Math.min(Math.round((task.checkCount / 6) * 100), 100);
        }
        const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
        const endDate = new Date(task.dueDate);
        
        const formattedStartDate = startDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'mn-MN', {
            day: 'numeric',
            month: 'long'
        });
        
        const formattedEndDate = endDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'mn-MN', {
            day: 'numeric',
            month: 'long'
        });
        
        taskItem.innerHTML = `
            <div class="task-card-content">
                <div class="task-card-header">
                    <h4 class="task-card-title">${task.title || 'Untitled Task'}</h4>
                    ${task.description ? `<p class="task-card-description">${task.description}</p>` : ''}
                </div>
                <div class="task-progress-section">
                    <div class="task-progress-info">
                        <span class="task-progress-text">${progress}% ${languageManager.translate('completed')}</span>
                    </div>
                    <div class="task-progress-bar">
                        <div class="task-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="task-dates">
                    <div class="task-date-item">
                        <span class="task-date-label">${languageManager.translate('startDate')}:</span>
                        <span class="task-date-value">${formattedStartDate}</span>
                    </div>
                    <div class="task-date-item">
                        <span class="task-date-label">${languageManager.translate('endDate')}:</span>
                        <span class="task-date-value">${formattedEndDate}</span>
                    </div>
                </div>
                <div class="task-card-actions">
                    <button class="task-btn task-btn-check" data-task-id="${task.id}" title="${languageManager.translate('check')}">
                        <i class="fas fa-check"></i>
                        ${languageManager.translate('check')}
                    </button>
                    <button class="task-btn task-btn-edit" data-task-id="${task.id}" title="${languageManager.translate('edit')}">
                        <i class="fas fa-edit"></i>
                        ${languageManager.translate('edit')}
                    </button>
                    <button class="task-btn task-btn-delete" data-task-id="${task.id}" title="${languageManager.translate('delete')}">
                        <i class="fas fa-trash"></i>
                        ${languageManager.translate('delete')}
                    </button>
                </div>
            </div>
        `;
        
        return taskItem;
    }

    function createProjectCardElement(project, currentLang) {
        const projectItem = document.createElement('div');
        projectItem.className = `task-item priority-medium ${project.completed ? 'completed' : ''}`;
        projectItem.dataset.projectId = project.id;
        
        const progress = project.progress || 0;
        const startDate = project.startDate || '';
        const endDate = project.endDate || '';
        
        projectItem.innerHTML = `
            <div class="task-card-content">
                <div class="task-card-header">
                    <h4 class="task-card-title">${project.title || 'Untitled Project'}</h4>
                    ${project.description ? `<p class="task-card-description">${project.description}</p>` : ''}
                    <span class="project-badge" style="display: inline-block; padding: 4px 8px; background: #4a90e2; color: white; border-radius: 4px; font-size: 11px; margin-top: 8px;">${languageManager.translate('project')}</span>
                </div>
                <div class="task-progress-section">
                    <div class="task-progress-info">
                        <span class="task-progress-text">${progress}% ${languageManager.translate('completed')}</span>
                    </div>
                    <div class="task-progress-bar">
                        <div class="task-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="task-dates">
                    <div class="task-date-item">
                        <span class="task-date-label">${languageManager.translate('startDate')}:</span>
                        <span class="task-date-value">${startDate}</span>
                    </div>
                    <div class="task-date-item">
                        <span class="task-date-label">${languageManager.translate('endDate')}:</span>
                        <span class="task-date-value">${endDate}</span>
                    </div>
                </div>
                <div class="task-card-actions">
                    <button class="task-btn task-btn-check" data-project-id="${project.id}" title="${languageManager.translate('check')}">
                        <i class="fas fa-check"></i>
                        ${languageManager.translate('check')}
                    </button>
                    <button class="task-btn task-btn-edit" data-project-id="${project.id}" title="${languageManager.translate('edit')}">
                        <i class="fas fa-edit"></i>
                        ${languageManager.translate('edit')}
                    </button>
                    <button class="task-btn task-btn-delete" data-project-id="${project.id}" title="${languageManager.translate('delete')}">
                        <i class="fas fa-trash"></i>
                        ${languageManager.translate('delete')}
                    </button>
                </div>
            </div>
        `;
        
        return projectItem;
    }

    function attachTaskEventListeners(container) {
        // Даалгаврын шалгах товчнууд
        container.querySelectorAll('.task-btn-check[data-task-id]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = parseInt(e.target.closest('.task-btn-check').dataset.taskId);
                const task = appState.getStateProperty('tasks').find(t => t.id === taskId);
                
                // Хэрэв аль хэдийн дууссан бол шалгахыг зөвшөөрөхгүй
                if (task && task.completed) {
                    return;
                }
                
                await taskService.toggleTaskComplete(taskId);
                
                // Одоогийн хуудсыг шинэчлэх
                const currentPage = appState.getStateProperty('currentPage');
                if (currentPage === 'taskList') {
                    setTimeout(() => {
                        showTaskListPage();
                    }, 100);
                } else {
                    // Хяналтын самбар дээр канбан самбарыг дахин харуулах
                    await taskService.loadTasks();
                    const tasks = appState.getStateProperty('tasks') || [];
                    renderKanbanBoard(tasks);
                    setupKanbanDragAndDrop();
                }
            });
        });

        // Төслийн шалгах товчнууд
        container.querySelectorAll('.task-btn-check[data-project-id]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const projectId = parseInt(e.target.closest('.task-btn-check').dataset.projectId);
                const project = appState.getProjectById(projectId);
                if (project && !project.completed) {
                    const newProgress = Math.min((project.progress || 0) + 20, 100);
                    await taskService.updateProject(projectId, { progress: newProgress });
                }
            });
        });

        // Засах товчнууд
        container.querySelectorAll('.task-btn-edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = btn.dataset.taskId;
                const projectId = btn.dataset.projectId;
                const currentLang = appState.getStateProperty('currentLanguage');
                if (taskId) {
                    alert(currentLang === 'en' ? 'Edit functionality coming soon!' : 'Засах функц удахгүй нэмэгдэнэ!');
                } else if (projectId) {
                    alert(currentLang === 'en' ? 'Edit functionality coming soon!' : 'Засах функц удахгүй нэмэгдэнэ!');
                }
            });
        });

        // Устгах товчнууд
        container.querySelectorAll('.task-btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = btn.dataset.taskId;
                const projectId = btn.dataset.projectId;
                const currentLang = appState.getStateProperty('currentLanguage');
                
                if (taskId) {
                    if (confirm(currentLang === 'en' ? 'Are you sure you want to delete this task?' : 'Энэ даалгаврыг устгахдаа итгэлтэй байна уу?')) {
                        await taskService.deleteTask(parseInt(taskId));
                        // Хэрэв бид дээр байгаа бол даалгаврын жагсаалтын хуудсыг шинэчлэх
                        const currentPage = appState.getStateProperty('currentPage');
                        if (currentPage === 'taskList') {
                            showTaskListPage();
                        }
                    }
                } else if (projectId) {
                    if (confirm(currentLang === 'en' ? 'Are you sure you want to delete this project?' : 'Энэ төслийг устгахдаа итгэлтэй байна уу?')) {
                        await taskService.deleteProject(parseInt(projectId));
                    }
                }
            });
        });
    }

    // Навигацийн тохиргоо
    function setupTaskListNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const span = item.querySelector('span');
                const i18nKey = span ? span.getAttribute('data-i18n') : null;
                
                if (i18nKey === 'taskList') {
                    appState.setCurrentPage('taskList');
                    // showTaskListPage нь subscribe handler-оор дуудагдах болно
                } else if (i18nKey === 'dashboard') {
                    appState.setCurrentPage('dashboard');
                    // Хяналтын самбар subscribe handler-оор харуулагдах болно
                } else if (i18nKey === 'analytics') {
                    appState.setCurrentPage('analytics');
                    // showAnalyticsPage нь subscribe handler-оор дуудагдах болно
                } else if (i18nKey === 'setting') {
                    appState.setCurrentPage('settings');
                    // showSettingsPage нь subscribe handler-оор дуудагдах болно
                } else if (i18nKey === 'calendar') {
                    appState.setCurrentPage('calendar');
                    // showCalendarPage нь subscribe handler-оор дуудагдах болно
                }
            });
        });
        
        // Гар утасны доод навигацийн тохиргоо (YouTube хэв маяг)
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-page]');
        const mobileCreateBtn = document.getElementById('mobileCreateTaskBtn');
        
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                
                // Бүх элементүүдээс active классыг хасах
                document.querySelectorAll('.mobile-nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                
                // Дарагдсан элемент руу active класс нэмэх
                item.classList.add('active');
                
                // Хуудас руу шилжих
                if (page === 'taskList') {
                    appState.setCurrentPage('taskList');
                } else if (page === 'dashboard') {
                    appState.setCurrentPage('dashboard');
                } else if (page === 'analytics') {
                    appState.setCurrentPage('analytics');
                } else if (page === 'settings') {
                    appState.setCurrentPage('settings');
                }
            });
        });
        
        // Гар утасны даалгавар үүсгэх товч
        if (mobileCreateBtn) {
            mobileCreateBtn.addEventListener('click', () => {
                const taskModal = document.getElementById('taskModal');
                if (taskModal) {
                    taskModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        // Хуудас өөрчлөгдөхөд гар утасны навигацийн идэвхтэй төлөвийг шинэчлэх
        appState.subscribe((state) => {
            const currentPage = state.currentPage || 'dashboard';
            document.querySelectorAll('.mobile-nav-item[data-page]').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === currentPage) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Календарын функциональ
    let currentCalendarDate = new Date();
    let selectedCalendarDate = null;
    let calendarNotes = {};
    
    // JSON Server-ээс календарын тэмдэглэлүүдийг ачаалах
    async function loadCalendarNotes() {
        try {
            const response = await taskAPI.getCalendarNotes();
            if (response.success && response.data) {
                // Хэрэв өгөгдөл 'data' шинж чанар бүхий объектод ороосон бол
                if (response.data.data) {
                    calendarNotes = response.data.data;
                } else if (Array.isArray(response.data) && response.data.length > 0) {
                    calendarNotes = response.data[0].data || {};
                } else {
                    calendarNotes = response.data || {};
                }
            }
        } catch (error) {
            console.error('Error loading calendar notes:', error);
            calendarNotes = {};
        }
    }
    
    // Календарын тэмдэглэлүүдийг JSON Server-д хадгалах
    async function saveCalendarNotes() {
        try {
            await taskAPI.updateCalendarNotes(calendarNotes);
        } catch (error) {
            console.error('Error saving calendar notes:', error);
        }
    }
    
    // Хуудас ачаалагдах үед календарын тэмдэглэлүүдийг эхлүүлэх
    loadCalendarNotes();
    
    // Календарын хуудсыг харуулах функц
    async function showCalendarPage() {
        const dashboardPage = document.getElementById('dashboardPage');
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        const settingsPage = document.getElementById('settingsPage');
        const calendarPage = document.getElementById('calendarPage');
        
        if (dashboardPage) dashboardPage.style.display = 'none';
        if (taskListPage) taskListPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'none';
        if (settingsPage) settingsPage.style.display = 'none';
        if (calendarPage) calendarPage.style.display = 'block';
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && span.getAttribute('data-i18n') === 'calendar') {
                item.classList.add('active');
            }
        });
        
        // Харуулахаас өмнө календарын тэмдэглэлүүдийг дахин ачаалах
        await loadCalendarNotes();
        
        // Render calendar
        renderCalendar();
    }
    
    // Календарыг харуулах функц
    function renderCalendar() {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        // Сар/жилийн харагдацыг шинэчлэх
        const monthYearElement = document.getElementById('calendarMonthYear');
        if (monthYearElement) {
            const monthNames = languageManager.getCurrentLanguage() === 'en' 
                ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                : ['Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар', 'Тавдугаар сар', 'Зургаадугаар сар', 'Долоодугаар сар', 'Наймдугаар сар', 'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'];
            monthYearElement.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Render calendar dates
        const calendarDatesElement = document.getElementById('calendarFullDates');
        if (!calendarDatesElement) return;
        
        calendarDatesElement.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = daysInPrevMonth - i;
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date-full prev-month';
            dateElement.textContent = date;
            dateElement.dataset.date = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            calendarDatesElement.appendChild(dateElement);
        }
        
        // Харьцуулахад өнөөдрийн огноог авах
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date-full';
            dateElement.textContent = i;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            dateElement.dataset.date = dateKey;
            
            // Check if this is today's date
            if (year === todayYear && month === todayMonth && i === todayDate) {
                dateElement.classList.add('today');
            }
            
            // Check if date has notes
            if (calendarNotes[dateKey] && calendarNotes[dateKey].length > 0) {
                dateElement.classList.add('has-notes');
            }
            
            // Тэмдэглэл нэмэхийн тулд + дүрс нэмэх
            const plusIcon = document.createElement('i');
            plusIcon.className = 'fas fa-plus calendar-add-icon';
            plusIcon.style.display = 'none';
            dateElement.appendChild(plusIcon);
            
            // Хулганаар дарахад + дүрсийг харуулах
            dateElement.addEventListener('mouseenter', () => {
                plusIcon.style.display = 'block';
            });
            
            dateElement.addEventListener('mouseleave', () => {
                if (!dateElement.classList.contains('active')) {
                    plusIcon.style.display = 'none';
                }
            });
            
            // Огноо сонгохын тулд дарах үйл явдал нэмэх
            dateElement.addEventListener('click', (e) => {
                // Хэрэв + дүрс дээр даравал огноог сонгох болон тэмдэглэл цонх нээх
                if (e.target.classList.contains('calendar-add-icon') || e.target.closest('.calendar-add-icon')) {
                    e.stopPropagation();
                    // Эхлээд огноог сонгох
                    selectCalendarDate(dateKey, i, month, year);
                    // Open note modal
                    openCalendarNoteModal();
                } else {
                    // Ердийн даралт - огноог сонгох, тэмдэглэлүүдийг харуулах, тэмдэглэл цонх нээх
                    selectCalendarDate(dateKey, i, month, year);
                    // Тэмдэглэл нэмэхийн тулд тэмдэглэл цонх нээх
                    openCalendarNoteModal();
                }
            });
            
            // Огноо идэвхтэй байх үед + дүрсийг харагдахуйц байлгах
            if (selectedCalendarDate === dateKey) {
                plusIcon.style.display = 'block';
            }
            
            calendarDatesElement.appendChild(dateElement);
        }
        
        // Next month days (to fill the grid)
        const totalCells = calendarDatesElement.children.length;
        const remainingCells = 42 - totalCells; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date-full next-month';
            dateElement.textContent = i;
            calendarDatesElement.appendChild(dateElement);
        }
    }
    
    // Огноо сонгох функц
    function selectCalendarDate(dateKey, day, month, year) {
        selectedCalendarDate = dateKey;
        
        // Идэвхтэй огноог шинэчлэх
        document.querySelectorAll('.calendar-date-full').forEach(el => {
            el.classList.remove('active');
            const plusIcon = el.querySelector('.calendar-add-icon');
            if (plusIcon && el.dataset.date !== dateKey) {
                plusIcon.style.display = 'none';
            }
        });
        const selectedElement = document.querySelector(`[data-date="${dateKey}"]`);
        if (selectedElement) {
            selectedElement.classList.add('active');
            const plusIcon = selectedElement.querySelector('.calendar-add-icon');
            if (plusIcon) {
                plusIcon.style.display = 'block';
            }
        }
        
        // Тэмдэглэлүүдийн хэсгийг харуулах
        const notesSection = document.getElementById('calendarNotesSection');
        const notesTitle = document.getElementById('selectedDateTitle');
        if (notesSection) {
            notesSection.style.display = 'block';
            if (notesTitle) {
                const monthNames = languageManager.getCurrentLanguage() === 'en' 
                    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    : ['Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар', 'Тавдугаар сар', 'Зургаадугаар сар', 'Долоодугаар сар', 'Наймдугаар сар', 'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'];
                notesTitle.textContent = `${monthNames[month]} ${day}, ${year}`;
            }
        }
        
        // Сонгосон огнооны тэмдэглэлүүдийг харуулах
        renderCalendarNotes(dateKey);
    }
    
    // Огнооны тэмдэглэлүүдийг харуулах функц
    function renderCalendarNotes(dateKey) {
        const notesList = document.getElementById('calendarNotesList');
        if (!notesList) return;
        
        const notes = calendarNotes[dateKey] || [];
        notesList.innerHTML = '';
        
        if (notes.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'calendar-empty-notes';
            emptyDiv.innerHTML = `<i class="fas fa-sticky-note"></i><p>${languageManager.translate('noNotes')}</p>`;
            notesList.appendChild(emptyDiv);
        } else {
            notes.forEach((note, index) => {
                const noteElement = document.createElement('div');
                noteElement.className = 'calendar-note-item';
                noteElement.innerHTML = `
                    <div class="note-content">
                        ${note.time ? `<span class="note-time">${note.time}</span>` : ''}
                        <p class="note-text">${note.text}</p>
                    </div>
                    <button class="note-delete-btn" data-note-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                // Delete button
                const deleteBtn = noteElement.querySelector('.note-delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteCalendarNote(dateKey, index);
                });
                
                notesList.appendChild(noteElement);
            });
        }
    }
    
    // Тэмдэглэл устгах функц
    async function deleteCalendarNote(dateKey, index) {
        if (calendarNotes[dateKey]) {
            calendarNotes[dateKey].splice(index, 1);
            if (calendarNotes[dateKey].length === 0) {
                delete calendarNotes[dateKey];
            }
            await saveCalendarNotes();
            renderCalendarNotes(dateKey);
            renderCalendar(); // Шаардлагатай бол has-notes классыг хасахын тулд календарыг шинэчлэх
        }
    }
    
    // Календарын тэмдэглэл цонх нээх функц
    function openCalendarNoteModal() {
        const noteModal = document.getElementById('calendarNoteModal');
        if (!selectedCalendarDate) {
            const currentLang = languageManager.getCurrentLanguage();
            alert(currentLang === 'en' ? 'Please select a date first' : 'Эхлээд өдөр сонгоно уу');
            return;
        }
        if (noteModal) {
            noteModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Календарын навигацийг тохируулах
    function setupCalendarNavigation() {
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                renderCalendar();
                renderSidebarCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                renderCalendar();
                renderSidebarCalendar();
            });
        }
    }
    
    // Календарын тэмдэглэл цонхыг тохируулах
    function setupCalendarNoteModal() {
        const noteModal = document.getElementById('calendarNoteModal');
        const noteForm = document.getElementById('calendarNoteForm');
        const addNoteBtn = document.getElementById('addNoteBtn');
        const closeModalBtn = document.getElementById('closeCalendarNoteModal');
        const cancelBtn = document.getElementById('cancelCalendarNoteBtn');
        
        // Цонх нээх
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => {
                openCalendarNoteModal();
            });
        }
        
        // Close modal
        function closeNoteModal() {
            if (noteModal) {
                noteModal.classList.remove('active');
                document.body.style.overflow = '';
                if (noteForm) {
                    noteForm.reset();
                }
            }
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeNoteModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeNoteModal);
        }
        
        // Форм илгээх
        if (noteForm) {
            noteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const noteText = document.getElementById('noteText');
                const noteTime = document.getElementById('noteTime');
                
                if (!noteText || !selectedCalendarDate) return;
                
                const note = {
                    text: noteText.value.trim(),
                    time: noteTime ? noteTime.value : null
                };
                
                if (!note.text) {
                    const currentLang = languageManager.getCurrentLanguage();
                    alert(currentLang === 'en' ? 'Please enter note text' : 'Тэмдэглэл оруулна уу');
                    return;
                }
                
                // Тэмдэглэл хадгалах
                if (!calendarNotes[selectedCalendarDate]) {
                    calendarNotes[selectedCalendarDate] = [];
                }
                calendarNotes[selectedCalendarDate].push(note);
                await saveCalendarNotes();
                
                // Харагдацыг шинэчлэх
                renderCalendarNotes(selectedCalendarDate);
                renderCalendar();
                renderSidebarCalendar();
                
                // Close modal
                closeNoteModal();
            });
        }
    }
    
    // Хажуугийн календарыг харуулах функц
    function renderSidebarCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Толгойг шинэчлэх
        const headerElement = document.getElementById('sidebarCalendarHeader');
        if (headerElement) {
            const monthNames = languageManager.getCurrentLanguage() === 'en' 
                ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                : ['Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар', 'Тавдугаар сар', 'Зургаадугаар сар', 'Долоодугаар сар', 'Наймдугаар сар', 'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'];
            const dayNames = languageManager.getCurrentLanguage() === 'en'
                ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                : ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
            const dayName = dayNames[today.getDay()];
            headerElement.textContent = `${monthNames[month]}, ${dayName}`;
        }
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Render calendar dates
        const calendarDatesElement = document.getElementById('sidebarCalendarDates');
        if (!calendarDatesElement) return;
        
        calendarDatesElement.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = daysInPrevMonth - i;
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date prev-month';
            dateElement.textContent = date;
            calendarDatesElement.appendChild(dateElement);
        }
        
        // Current month days
        const todayDate = today.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.textContent = i;
            
            // Check if this is today's date
            if (i === todayDate) {
                dateElement.classList.add('today');
            }
            
            // Check if date has notes
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (calendarNotes[dateKey] && calendarNotes[dateKey].length > 0) {
                dateElement.classList.add('has-notes');
            }
            
            // Календарын хуудас руу шилжихийн тулд дарах үйл явдал нэмэх
            dateElement.addEventListener('click', () => {
                appState.setCurrentPage('calendar');
                // Гол календар дээр огноог сонгох
                setTimeout(() => {
                    selectCalendarDate(dateKey, i, month, year);
                }, 100);
            });
            
            calendarDatesElement.appendChild(dateElement);
        }
        
        // Next month days (to fill the grid)
        const totalCells = calendarDatesElement.children.length;
        const remainingCells = 42 - totalCells; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date next-month';
            dateElement.textContent = i;
            calendarDatesElement.appendChild(dateElement);
        }
    }
    
    // Календарыг эхлүүлэх
    setupCalendarNavigation();
    setupCalendarNoteModal();
    
    // Хажуугийн календарыг эхлүүлэх
    renderSidebarCalendar();
    
    // Setup profile image modal
    function setupProfileImageModal() {
        const viewAllBtn = document.querySelector('.view-all-btn');
        const profileImageModal = document.getElementById('profileImageModal');
        const closeProfileImageModal = document.getElementById('closeProfileImageModal');
        
        if (viewAllBtn && profileImageModal) {
            viewAllBtn.addEventListener('click', () => {
                profileImageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeProfileImageModal) {
            closeProfileImageModal.addEventListener('click', () => {
                profileImageModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside
        if (profileImageModal) {
            profileImageModal.addEventListener('click', (e) => {
                if (e.target === profileImageModal) {
                    profileImageModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    setupProfileImageModal();
    
    // Профайл зураг цонхыг тохируулах
    setupProfileImageModal();
    
    // Тохиргооны хуудсыг харуулах функц
    function showSettingsPage() {
        const dashboardPage = document.getElementById('dashboardPage');
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        const settingsPage = document.getElementById('settingsPage');
        const calendarPage = document.getElementById('calendarPage');
        
        if (dashboardPage) dashboardPage.style.display = 'none';
        if (taskListPage) taskListPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'none';
        if (calendarPage) calendarPage.style.display = 'none';
        if (settingsPage) settingsPage.style.display = 'block';
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && span.getAttribute('data-i18n') === 'setting') {
                item.classList.add('active');
            }
        });
    }
    
    // Шинжилгээний хуудсыг харуулах функц
    function showAnalyticsPage() {
        const dashboardPage = document.getElementById('dashboardPage');
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        
        if (dashboardPage) dashboardPage.style.display = 'none';
        if (taskListPage) taskListPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'block';
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && span.getAttribute('data-i18n') === 'analytics') {
                item.classList.add('active');
            }
        });
    }

    function showTaskListPage() {
        // Бусад хуудсуудыг нуух, даалгаврын жагсаалтын хуудсыг харуулах
        const dashboardPage = document.getElementById('dashboardPage');
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        const settingsPage = document.getElementById('settingsPage');
        const calendarPage = document.getElementById('calendarPage');
        
        if (dashboardPage) dashboardPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'none';
        if (settingsPage) settingsPage.style.display = 'none';
        if (calendarPage) calendarPage.style.display = 'none';
        if (taskListPage) taskListPage.style.display = 'block';
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && span.getAttribute('data-i18n') === 'taskList') {
                item.classList.add('active');
            } else if (span && span.getAttribute('data-i18n') === 'dashboard') {
                item.classList.remove('active');
            }
        });
        
        const tasks = appState.getStateProperty('tasks') || [];
        // Дууссан эсвэл 'complete' статустай эсвэл 'tasklist' статустай даалгавруудыг харуулах
        const completedTasks = tasks.filter(t => t.completed || t.status === 'complete' || t.status === 'tasklist');
        const activeTasks = tasks.filter(t => !t.completed);
        
        const currentLang = languageManager.getCurrentLanguage();
        const tasksList = document.getElementById('taskListContainer');
        const tasksCount = document.getElementById('taskListCount');
        
        if (!tasksList) return;
        
        // Тооллого шинэчлэх (дууссан даалгаврууд)
        if (tasksCount) {
            tasksCount.textContent = completedTasks.length;
        }
        
        tasksList.innerHTML = '';
        
        // Зөвхөн дууссан даалгавруудын хэсгийг харуулах
        const completedSection = document.createElement('div');
        completedSection.className = 'tasks-section completed-section';
        completedSection.innerHTML = `
            <h4 class="tasks-section-title">${languageManager.translate('completedTasks')} (${completedTasks.length})</h4>
        `;
        const completedContainer = document.createElement('div');
        completedContainer.className = 'tasks-section-content';
        
        if (completedTasks.length > 0) {
            completedTasks.forEach(task => {
                const taskItem = createTaskCardElement(task, currentLang);
                completedContainer.appendChild(taskItem);
            });
        } else {
            // Дууссан даалгавруудын хоосон төлөв
            const emptyCompletedDiv = document.createElement('div');
            emptyCompletedDiv.className = 'empty-tasks';
            emptyCompletedDiv.style.minHeight = '150px';
            emptyCompletedDiv.innerHTML = `
                <i class="fas fa-clipboard-check"></i>
                <p>${languageManager.translate('noCompletedTasks')}</p>
            `;
            completedContainer.appendChild(emptyCompletedDiv);
        }
        
        completedSection.appendChild(completedContainer);
        tasksList.appendChild(completedSection);
        
        // Хэрэв дууссан даалгавар байхгүй бол хоосон төлөвийг харуулах
        if (completedTasks.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-tasks';
            emptyDiv.innerHTML = `
                <i class="fas fa-clipboard-check"></i>
                <p>${languageManager.translate('noCompletedTasks')}</p>
            `;
            tasksList.appendChild(emptyDiv);
        }
        
        // Үйл явдлын сонсогч хавсаргах
        attachTaskEventListeners(tasksList);
        
        // Харуулсны дараа drop zone-ийг дахин тохируулах
        setupTaskListDropZone();
    }
    
    // Канбан самбарыг харуулах функц
    function renderKanbanBoard(tasks = null) {
        const tasksToRender = tasks || appState.getStateProperty('tasks') || [];
        
        // Даалгавруудыг статусаар бүлэглэх
        // 'tasklist' статустай даалгавруудыг канбан самбараас бүрэн хасах
        // Эхлээд 'tasklist' статустай даалгавруудыг шүүх - тэд зөвхөн Даалгаврын жагсаалтын хуудас дээр харагдах ёстой
        const tasksForKanban = tasksToRender.filter(t => {
            const status = t.status || 'todo';
            return status !== 'tasklist';
        });
        
        const todoTasks = tasksForKanban.filter(t => {
            const status = t.status || 'todo';
            return status === 'todo';
        });
        const inprogressTasks = tasksForKanban.filter(t => {
            const status = t.status || 'todo';
            return status === 'inprogress';
        });
        // COMPLETE багананд зөвхөн status === 'complete' даалгаврууд харагдана
        // status === 'tasklist' даалгаврууд COMPLETE багананд харагдахгүй
        const completeTasks = tasksForKanban.filter(t => {
            const status = t.status || 'todo';
            return status === 'complete';
        });
        
        // Тооллогыг шинэчлэх
        const todoCount = document.getElementById('todoCount');
        const inprogressCount = document.getElementById('inprogressCount');
        const completeCount = document.getElementById('completeCount');
        
        if (todoCount) todoCount.textContent = todoTasks.length;
        if (inprogressCount) inprogressCount.textContent = inprogressTasks.length;
        if (completeCount) completeCount.textContent = completeTasks.length;
        
        // Бүх баганад даалгавруудыг харуулах
        renderKanbanColumn('todoTasks', todoTasks);
        renderKanbanColumn('inprogressTasks', inprogressTasks);
        renderKanbanColumn('completeTasks', completeTasks);
    }
    
    // Канбан баганад даалгавруудыг харуулах функц
    function renderKanbanColumn(columnId, tasks) {
        const column = document.getElementById(columnId);
        if (!column) return;
        
        column.innerHTML = '';
        
        tasks.forEach(task => {
            const isCompleteColumn = columnId === 'completeTasks';
            const taskCard = createKanbanTaskCard(task, isCompleteColumn);
            column.appendChild(taskCard);
        });
    }
    
    // Function to create a kanban task card
    function createKanbanTaskCard(task, isCompleteColumn = false) {
        const card = document.createElement('div');
        card.className = 'kanban-task-card';
        card.draggable = true;
        card.dataset.taskId = task.id;
        card.dataset.status = task.status || 'todo';
        
        // COMPLETE баганын даалгавруудад "Дуусгах" товч нэмэх
        const completeButton = isCompleteColumn ? `
            <div class="kanban-task-actions">
                <button class="kanban-complete-btn" data-task-id="${task.id}" title="${languageManager.translate('moveToTaskList')}">
                    <i class="fas fa-check-double"></i>
                    ${languageManager.translate('finishTask')}
                </button>
            </div>
        ` : '';
        
        card.innerHTML = `
            <div class="kanban-task-title">${task.title || 'Untitled Task'}</div>
            <div class="kanban-task-icons">
                <i class="fas fa-user"></i>
                <i class="fas fa-calendar"></i>
                <i class="fas fa-flag"></i>
            </div>
            ${completeButton}
        `;
        
        // Чирэх үйл явдлын сонсогч нэмэх
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        
        // Дуусгах товчны дарах үйл явдлын сонсогч нэмэх (зөвхөн COMPLETE баганын хувьд)
        if (isCompleteColumn) {
            const completeBtn = card.querySelector('.kanban-complete-btn');
            if (completeBtn) {
                completeBtn.addEventListener('click', async (e) => {
                    e.stopPropagation(); // Карт чирэхийг сэргийлэх
                    const taskId = parseInt(completeBtn.dataset.taskId);
                    
                    // Update task status to 'tasklist'
                    await taskService.updateTask(taskId, { status: 'tasklist' });
                    
                    // Даалгавруудыг дахин ачаалах болон канбан самбарыг дахин харуулах
                    await taskService.loadTasks();
                    const tasks = appState.getStateProperty('tasks') || [];
                    renderKanbanBoard(tasks);
                    setupKanbanDragAndDrop();
                });
            }
        }
        
        return card;
    }
    
    // Чирэх болон буулгах handler-ууд
    let draggedElement = null;
    
    function handleDragStart(e) {
        draggedElement = this;
        this.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
    
    function handleDragEnd(e) {
        this.style.opacity = '1';
        // Бүх баганаас drag-over классыг хасах
        document.querySelectorAll('.kanban-column').forEach(col => {
            col.classList.remove('drag-over');
        });
    }
    
    // Канбан багануудын чирэх болон буулгахыг тохируулах
    function setupKanbanDragAndDrop() {
        const columns = document.querySelectorAll('.kanban-column');
        
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                column.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', async (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                if (draggedElement) {
                    const taskId = parseInt(draggedElement.dataset.taskId);
                    const newStatus = column.dataset.status;
                    const oldStatus = draggedElement.dataset.status;
                    
                    // Зөвхөн статус өөрчлөгдсөн тохиолдолд шинэчлэх
                    if (newStatus !== oldStatus) {
                        // Даалгаврын статусыг шинэчлэх
                        await taskService.updateTask(taskId, { status: newStatus });
                        
                        // Дахин ачаалах болон канбан самбарыг дахин харуулах
                        await taskService.loadTasks();
                        const tasks = appState.getStateProperty('tasks') || [];
                        renderKanbanBoard(tasks);
                        setupKanbanDragAndDrop();
                    }
                }
            });
        });
        
        // "Даалгавар нэмэх" товчнуудыг тохируулах
        const addTaskButtons = document.querySelectorAll('.kanban-add-btn');
        addTaskButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Даалгавар үүсгэх цонхыг нээх
                const taskModal = document.getElementById('taskModal');
                if (taskModal) {
                    taskModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Даалгаврын жагсаалтын хуудас руу чирэх болон буулгахыг тохируулах
        setupTaskListDropZone();
    }
    
    // Даалгаврын жагсаалтын хуудсын drop zone-ийг тохируулах
    function setupTaskListDropZone() {
        const taskListPage = document.getElementById('taskListPage');
        const taskListContainer = document.getElementById('taskListContainer');
        
        if (!taskListPage || !taskListContainer) return;
        
        // Даалгаврын жагсаалтын контейнерийг drop zone болгох
        taskListContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            taskListContainer.classList.add('drag-over');
        });
        
        taskListContainer.addEventListener('dragleave', () => {
            taskListContainer.classList.remove('drag-over');
        });
        
        taskListContainer.addEventListener('drop', async (e) => {
            e.preventDefault();
            taskListContainer.classList.remove('drag-over');
            
            if (draggedElement) {
                const taskId = parseInt(draggedElement.dataset.taskId);
                const taskStatus = draggedElement.dataset.status;
                
                // Зөвхөн дууссан даалгаврууд эсвэл COMPLETE баганын даалгавруудыг буулгахыг зөвшөөрөх
                if (taskStatus === 'complete') {
                    // Даалгаврын статусыг 'tasklist' болгох, ингэснээр COMPLETE баганад харагдахгүй
                    await taskService.updateTask(taskId, { status: 'tasklist' });
                    
                    // Эхлээд даалгавруудыг дахин ачаалах
                    await taskService.loadTasks();
                    
                    // Мөн COMPLETE баганаас даалгаврыг шууд хасахын тулд канбан самбарыг шинэчлэх
                    const tasks = appState.getStateProperty('tasks') || [];
                    renderKanbanBoard(tasks);
                    setupKanbanDragAndDrop();
                    
                    // Даалгаврын жагсаалтын хуудас руу шилжих
                    appState.setCurrentPage('taskList');
                    showTaskListPage();
                }
            }
        });
    }
    
    // Хяналтын самбарын хуудсыг харуулах функц
    function showDashboardPage() {
        const dashboardPage = document.getElementById('dashboardPage');
        const taskListPage = document.getElementById('taskListPage');
        const analyticsPage = document.getElementById('analyticsPage');
        const settingsPage = document.getElementById('settingsPage');
        const calendarPage = document.getElementById('calendarPage');
        
        if (taskListPage) taskListPage.style.display = 'none';
        if (analyticsPage) analyticsPage.style.display = 'none';
        if (settingsPage) settingsPage.style.display = 'none';
        if (calendarPage) calendarPage.style.display = 'none';
        if (dashboardPage) dashboardPage.style.display = 'block';
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const span = item.querySelector('span');
            if (span && span.getAttribute('data-i18n') === 'dashboard') {
                item.classList.add('active');
            }
        });
        
        // Хуучин даалгаврын жагсаалтын оронд канбан самбарыг харуулах
        const tasks = appState.getStateProperty('tasks') || [];
        renderKanbanBoard(tasks);
        setupKanbanDragAndDrop();
    }
    
    // Даалгаврын цонх нээх функц (хоосон төлөвийн товчны хувьд)
    function openTaskModal() {
        const taskModal = document.getElementById('taskModal');
        if (taskModal) {
            taskModal.classList.add('active');
        }
    }
    
    // Үүнийг дэлхийн болгох
    window.openTaskModal = openTaskModal;

    // Хайлтыг эхлүүлэх
    setupSearch();
    
    // Даалгаврын жагсаалтын навигацийг эхлүүлэх
    setupTaskListNavigation();
    
    // Хуудас ачаалагдах үед анхны даалгавруудыг ачаалах
    async function initializeTasks() {
        try {
            await taskService.loadTasks();
            await taskService.loadProjects();
            const initialTasks = appState.getStateProperty('tasks');
            
            // Бүх даалгаврууд статус талбартай эсэхийг баталгаажуулах (хуучин даалгавруудыг шилжүүлэх)
            if (initialTasks && Array.isArray(initialTasks)) {
                let needsUpdate = false;
                initialTasks.forEach(task => {
                    if (!task.status) {
                        // Дууссан төлөв дээр үндэслэн анхдагч статус тохируулах
                        if (task.completed) {
                            task.status = 'complete';
                        } else {
                            task.status = 'todo';
                        }
                        needsUpdate = true;
                    }
                });
                
                // Шаардлагатай бол даалгавруудыг шинэчлэх
                if (needsUpdate) {
                    for (const task of initialTasks) {
                        await taskService.updateTask(task.id, { status: task.status });
                    }
                    await taskService.loadTasks();
                }
                
                const currentPage = appState.getStateProperty('currentPage') || 'dashboard';
                if (currentPage === 'dashboard') {
                    renderKanbanBoard(initialTasks);
                    setupKanbanDragAndDrop();
                } else {
                    renderTasks(initialTasks);
                }
                updateTaskProgress(initialTasks);
            } else {
                const currentPage = appState.getStateProperty('currentPage') || 'dashboard';
                if (currentPage === 'dashboard') {
                    renderKanbanBoard([]);
                    setupKanbanDragAndDrop();
                } else {
                    renderTasks([]);
                }
                updateTaskProgress([]);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            const currentPage = appState.getStateProperty('currentPage') || 'dashboard';
            if (currentPage === 'dashboard') {
                renderKanbanBoard([]);
                setupKanbanDragAndDrop();
            } else {
                renderTasks([]);
            }
            updateTaskProgress([]);
        }
    }
    
    // Даалгавруудыг шууд эхлүүлэх
    initializeTasks();
    
        // Анхны ачааллын дараа канбан чирэх болон буулгахыг тохируулах
    setTimeout(() => {
        setupKanbanDragAndDrop();
    }, 500);
    
    // Үйл ажиллагааны графикийн интерактив функциональ
    function setupActivityChart() {
        const chartBars = document.querySelectorAll('.chart-bar[data-day]');
        const modal = document.getElementById('activityValueModal');
        const modalTitle = document.getElementById('activityModalTitle');
        const valueButtons = document.querySelectorAll('.activity-value-btn');
        const closeBtn = document.getElementById('activityValueClose');
        let selectedBar = null;
        
        // Харагдах өдрийн нэрүүд
        const dayNames = {
            'mon': 'Mon',
            'tue': 'Tue',
            'wed': 'Wed',
            'thu': 'Thu',
            'fri': 'Fri',
            'sat': 'Sat',
            'sun': 'Sun'
        };
        
        chartBars.forEach(bar => {
            bar.addEventListener('click', function(e) {
                e.stopPropagation();
                const day = this.getAttribute('data-day');
                selectedBar = this;
                
                // Show modal
                if (modal && modalTitle) {
                    const currentLang = languageManager.getCurrentLanguage();
                    const dayName = dayNames[day] || day.toUpperCase();
                    modalTitle.textContent = languageManager.translate('evaluateYourself');
                    
                    // Дарагдсан барын ойролцоо цонхыг байрлуулах
                    const barRect = this.getBoundingClientRect();
                    const chartRect = this.closest('.activity-chart').getBoundingClientRect();
                    modal.style.left = `${barRect.left - chartRect.left + barRect.width / 2}px`;
                    modal.style.top = `${barRect.top - chartRect.top - 80}px`;
                    modal.style.display = 'block';
                }
            });
        });
        
        // Утга сонголтыг удирдах
        valueButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                
                if (selectedBar && value >= 1 && value <= 5) {
                    // Өндрийн хувийг тооцоолох (1 = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%)
                    const heightPercent = (value / 5) * 100;
                    
                    // Цонхыг нуух
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    
                    // Барыг дээш хөдөлгөх анимаци
                    animateBarUp(selectedBar, heightPercent, () => {
                        // 8 секундын дараа барыг доош хөдөлгөх анимаци
                        setTimeout(() => {
                            animateBarDown(selectedBar, 0);
                        }, 8000);
                    });
                }
            });
        });
        
        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (modal && !modal.contains(e.target) && !e.target.closest('.chart-bar[data-day]')) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Барыг дээш хөдөлгөх анимаци
    function animateBarUp(barElement, targetHeight, callback) {
        const startHeight = parseFloat(barElement.style.height) || 0;
        const duration = 2000; // 2 seconds for 5 readings
        const startTime = performance.now();
        
        // Одоо байгаа tooltip-ийг хасах
        const existingTooltip = barElement.querySelector('.bar-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Tooltip нэмэх
        const tooltip = document.createElement('span');
        tooltip.className = 'bar-tooltip';
        const value = Math.round((targetHeight / 100) * 5);
        tooltip.textContent = `${value} ${value === 1 ? 'Task' : 'Tasks'}`;
        barElement.appendChild(tooltip);
        
        // Active класс нэмэх
        barElement.classList.add('active');
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing функц (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentHeight = startHeight + (targetHeight - startHeight) * easeOut;
            barElement.style.height = `${currentHeight}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value
                barElement.style.height = `${targetHeight}%`;
                if (callback) callback();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Барыг доош хөдөлгөх анимаци
    function animateBarDown(barElement, targetHeight) {
        const startHeight = parseFloat(barElement.style.height) || 0;
        const duration = 1000; // 1 second to go down
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing функц (ease-in)
            const easeIn = Math.pow(progress, 2);
            
            const currentHeight = startHeight - (startHeight - targetHeight) * easeIn;
            barElement.style.height = `${currentHeight}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value
                barElement.style.height = `${targetHeight}%`;
                // Active класс болон tooltip-ийг хасах
                barElement.classList.remove('active');
                const tooltip = barElement.querySelector('.bar-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // DOM бэлэн болсны дараа үйл ажиллагааны графикийг эхлүүлэх
    setupActivityChart();
    
    // Форм илгээхийг удирдах
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Формын утгуудыг авах
            const titleInput = document.getElementById('taskTitle');
            const descriptionInput = document.getElementById('taskDescription');
            const dueDateInput = document.getElementById('dueDate');
            const priorityInput = document.getElementById('priority');
            const categoryInput = document.getElementById('category');
            
            if (!titleInput || !dueDateInput || !priorityInput || !categoryInput) {
                console.error('Form inputs not found');
                const currentLang = appState.getStateProperty('currentLanguage');
                alert(currentLang === 'en' ? 'Form error: Please refresh the page' : 'Форм алдаа: Хуудасыг дахин ачааллана уу');
                return;
            }
            
            const taskData = {
                title: titleInput.value.trim(),
                description: descriptionInput ? descriptionInput.value.trim() : '',
                dueDate: dueDateInput.value,
                priority: priorityInput.value,
                category: categoryInput.value,
                status: 'todo' // New tasks go to TO DO column
            };
            
            // Шаардлагатай талбаруудыг баталгаажуулах
            if (!taskData.title || !taskData.dueDate) {
                const currentLang = appState.getStateProperty('currentLanguage');
                alert(currentLang === 'en' ? 'Please fill in all required fields' : 'Бүх шаардлагатай талбаруудыг бөглөнө үү');
                return;
            }
            
            try {
                // Үйлчилгээ ашиглан даалгавар үүсгэх
                const response = await taskService.createTask(taskData);
                
                if (response && response.success) {
                    // Амжилттай мессеж харуулах
                    const currentLang = appState.getStateProperty('currentLanguage');
                    alert(currentLang === 'en' ? 'Task created successfully!' : 'Даалгавар амжилттай үүслээ!');
                    
                    // Формыг дахин тохируулах
                    taskForm.reset();
                    
                    // Цонх хаах
                    closeTaskModal();
                    
                    // UI шинэчлэгдсэн эсэхийг баталгаажуулахын тулд даалгавруудыг дахин ачаалах
                    await taskService.loadTasks();
                    
                    // Канбан самбарыг хүчээр дахин харуулах
                    const currentTasks = appState.getStateProperty('tasks');
                    if (currentTasks && Array.isArray(currentTasks)) {
                        renderKanbanBoard(currentTasks);
                        setupKanbanDragAndDrop();
                    }
                } else {
                    const currentLang = appState.getStateProperty('currentLanguage');
                    alert(response?.message || (currentLang === 'en' ? 'Failed to create task' : 'Даалгавар үүсгэхэд алдаа гарлаа'));
                }
            } catch (error) {
                console.error('Error creating task:', error);
                const currentLang = appState.getStateProperty('currentLanguage');
                alert(currentLang === 'en' ? 'Error creating task: ' + error.message : 'Даалгавар үүсгэхэд алдаа: ' + error.message);
            }
        });
    } else {
        console.error('Task form not found!');
    }
    
    // Гарах товчны handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Session storage-ийг цэвэрлэх
            sessionStorage.removeItem('loggedInUser');
            
            // Нэвтрэх хуудас руу чиглүүлэх
            window.location.href = 'task4/index.html';
        });
    }
    
});


