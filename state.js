// Төлөв удирдлага - Төвлөрсөн төлөв удирдлага
class AppState {
    constructor() {
        this.state = {
            tasks: [],
            projects: [],
            deletedProjects: [],
            currentLanguage: 'en',
            currentTheme: 'light',
            currentPage: 'dashboard',
            searchQuery: '',
            isLoading: false,
            error: null,
            selectedTask: null
        };
        
        this.listeners = [];
    }

    // Одоогийн төлөвийг авах
    getState() {
        return { ...this.state };
    }

    // Тодорхой төлөвийн шинж чанарыг авах
    getStateProperty(key) {
        return this.state[key];
    }

    // Төлөв тохируулах (өөрчлөгдөхгүй шинэчлэлт)
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
        // Төлөв өөрчлөгдөхөд сонсогчдод мэдэгдэх
        this.notifyListeners();
    }

    // Төлөвийн өөрчлөлтүүдэд бүртгүүлэх
    subscribe(listener) {
        this.listeners.push(listener);
        
        // Бүртгэлээс хасах функцийг буцаах
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Бүх сонсогчдод мэдэгдэх
    notifyListeners() {
        this.listeners.forEach(listener => {
            listener(this.getState());
        });
    }

    // Үйлдлүүд
    setTasks(tasks) {
        this.setState({ tasks });
    }

    addTask(task) {
        if (!task || !task.id) {
            console.error('Invalid task object:', task);
            return;
        }
        const currentTasks = Array.isArray(this.state.tasks) ? this.state.tasks : [];
        const newTasks = [...currentTasks, task];
        this.setState({
            tasks: newTasks
        });
    }

    updateTask(updatedTask) {
        this.setState({
            tasks: this.state.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        });
    }

    removeTask(taskId) {
        this.setState({
            tasks: this.state.tasks.filter(task => task.id !== taskId)
        });
    }

    setLanguage(language) {
        this.setState({ currentLanguage: language });
        localStorage.setItem('language', language);
    }

    setTheme(theme) {
        this.setState({ currentTheme: theme });
        localStorage.setItem('theme', theme);
    }

    setLoading(loading) {
        this.setState({ isLoading: loading });
    }

    setError(error) {
        this.setState({ error });
    }

    setSelectedTask(task) {
        this.setState({ selectedTask: task });
    }

    // Төслүүдийн удирдлага
    setProjects(projects) {
        this.setState({ projects: Array.isArray(projects) ? projects : [] });
    }

    addProject(project) {
        if (!project || !project.id) {
            console.error('Invalid project object:', project);
            return;
        }
        const currentProjects = Array.isArray(this.state.projects) ? this.state.projects : [];
        const newProjects = [...currentProjects, project];
        this.setState({ projects: newProjects });
    }

    updateProject(updatedProject) {
        this.setState({
            projects: this.state.projects.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        });
    }

    removeProject(projectId) {
        const projectToDelete = this.state.projects.find(p => p.id === projectId);
        if (projectToDelete) {
            const filteredProjects = this.state.projects.filter(p => p.id !== projectId);
            const deletedProjects = [...(this.state.deletedProjects || []), {
                ...projectToDelete,
                deletedAt: new Date().toISOString()
            }];
            this.setState({
                projects: filteredProjects,
                deletedProjects: deletedProjects
            });
        }
    }

    getProjectById(id) {
        return this.state.projects.find(p => p.id === id);
    }

    getDeletedProjects() {
        return [...(this.state.deletedProjects || [])];
    }

    // Хайлт болон навигаци
    setSearchQuery(query) {
        this.setState({ searchQuery: query || '' });
    }

    setCurrentPage(page) {
        this.setState({ currentPage: page || 'dashboard' });
    }
}

// Дэлхийн төлөвийн жишээ үүсгэх
const appState = new AppState();

// Бусад файлуудад ашиглахын тулд экспорт хийх
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
}

