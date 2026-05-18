// API Үйлчилгээ - Бүх өгөгдлийн үйлдлүүдийг удирдана
class TaskAPI {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.endpoint = '/tasks';
        this.projectsEndpoint = '/projects';
        this.calendarNotesEndpoint = '/calendarNotes';
    }

    // Fetch хүсэлтүүд хийх туслах функц
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch API error:', error);
            throw error;
        }
    }

    // GET - Бүх даалгавруудыг авах
    async getAllTasks() {
        try {
            const tasks = await this.fetchAPI(this.endpoint);
            
            return {
                success: true,
                data: Array.isArray(tasks) ? tasks : [],
                message: 'Tasks fetched successfully'
            };
        } catch (error) {
            console.error('Error getting tasks:', error);
            return {
                success: false,
                data: [],
                message: error.message
            };
        }
    }

    // GET - ID-аар даалгавар авах
    async getTaskById(id) {
        try {
            const task = await this.fetchAPI(`${this.endpoint}/${id}`);
            
            return {
                success: true,
                data: task,
                message: 'Task fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Task not found'
            };
        }
    }

    // POST - Шинэ даалгавар үүсгэх
    async createTask(taskData) {
        try {
            const newTask = {
                title: taskData.title || '',
                description: taskData.description || '',
                dueDate: taskData.dueDate || '',
                priority: taskData.priority || 'low',
                category: taskData.category || 'work',
                status: taskData.status || 'todo', // Канбан самбарын хувьд 'todo' нь анхдагч утга
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                completed: false,
                checkCount: 0,
                progress: 0
            };

            const createdTask = await this.fetchAPI(this.endpoint, {
                method: 'POST',
                body: JSON.stringify(newTask)
            });

            return {
                success: true,
                data: createdTask,
                message: 'Task created successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to create task'
            };
        }
    }

    // PUT - Даалгавар шинэчлэх
    async updateTask(id, updates) {
        try {
            // Эхлээд одоо байгаа даалгаврыг авах
            const existingTask = await this.getTaskById(id);
            if (!existingTask.success) {
                return {
                    success: false,
                    data: null,
                    message: 'Task not found'
                };
            }

            const updatedTask = {
                ...existingTask.data,
                ...updates,
                id: id,
                updatedAt: new Date().toISOString()
            };

            const result = await this.fetchAPI(`${this.endpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTask)
            });

            return {
                success: true,
                data: result,
                message: 'Task updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message
            };
        }
    }

    // DELETE - Даалгавар устгах
    async deleteTask(id) {
        try {
            await this.fetchAPI(`${this.endpoint}/${id}`, {
                method: 'DELETE'
            });

            return {
                success: true,
                data: { id },
                message: 'Task deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Task not found'
            };
        }
    }

    // PATCH - Даалгаврын дуусгах төлөвийг солих
    async toggleTaskComplete(id) {
        try {
            const result = await this.getTaskById(id);
            
            if (!result.success) {
                return result;
            }

            const task = result.data;
            
            // Хэрэв аль хэдийн дууссан бол шалгахыг зөвшөөрөхгүй
            if (task.completed) {
                return {
                    success: false,
                    data: task,
                    message: 'Task is already completed'
                };
            }
            
            // Хэрэв checkCount байхгүй бол эхлүүлэх
            const currentCheckCount = task.checkCount || 0;
            const newCheckCount = currentCheckCount + 1;
            
            // Хэрэв checkCount 6-д хүрвэл дууссан гэж тэмдэглэх
            const isCompleted = newCheckCount >= 6;
            
            // Явцыг тооцоолох (6 шалгалт = 100%)
            const progress = Math.min(Math.round((newCheckCount / 6) * 100), 100);
            
            // Хэрэв даалгавар дууссан бол статусыг 'complete' болгох
            const status = isCompleted ? 'complete' : (task.status || 'todo');

            return await this.updateTask(id, {
                checkCount: newCheckCount,
                completed: isCompleted,
                progress: progress,
                status: status
            });
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message
            };
        }
    }

    // Даалгавруудыг JSON файл руу экспорт хийх
    async exportToJSON() {
        try {
            const response = await this.getAllTasks();
            const tasks = response.data || [];
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                tasks: tasks
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return {
                success: true,
                message: 'Tasks exported successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // JSON файлаас даалгавруудыг импорт хийх
    async importFromJSON(file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);
                        const tasks = importData.tasks || importData; // Хоёр форматыг дэмжинэ
                        
                        if (!Array.isArray(tasks)) {
                            throw new Error('Invalid JSON format: tasks must be an array');
                        }

                        // Одоо байгаа даалгавруудыг авах
                        const existingResponse = await this.getAllTasks();
                        const existingTasks = existingResponse.data || [];
                        const existingIds = new Set(existingTasks.map(t => t.id));
                        
                        // Давхардлыг шүүж, шинэ даалгаврууд үүсгэх
                        const newTasks = tasks.filter(t => !existingIds.has(t.id));
                        
                        // API-аар бүх шинэ даалгавруудыг үүсгэх
                        const createPromises = newTasks.map(task => this.createTask(task));
                        await Promise.all(createPromises);

                        resolve({
                            success: true,
                            data: [...existingTasks, ...newTasks],
                            imported: newTasks.length,
                            message: `Successfully imported ${newTasks.length} tasks`
                        });
                    } catch (parseError) {
                        reject({
                            success: false,
                            message: `Failed to parse JSON: ${parseError.message}`
                        });
                    }
                };
                
                reader.onerror = () => {
                    reject({
                        success: false,
                        message: 'Failed to read file'
                    });
                };
                
                reader.readAsText(file);
            });
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Төслүүдийн CRUD үйлдлүүд
    // GET - Бүх төслүүдийг авах
    async getAllProjects() {
        try {
            const projects = await this.fetchAPI(this.projectsEndpoint);
            
            return {
                success: true,
                data: Array.isArray(projects) ? projects : [],
                message: 'Projects fetched successfully'
            };
        } catch (error) {
            console.error('Error getting projects:', error);
            return {
                success: false,
                data: [],
                message: error.message
            };
        }
    }

    // GET - ID-аар төсөл авах
    async getProjectById(id) {
        try {
            const project = await this.fetchAPI(`${this.projectsEndpoint}/${id}`);
            
            return {
                success: true,
                data: project,
                message: 'Project fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Project not found'
            };
        }
    }

    // POST - Шинэ төсөл үүсгэх
    async createProject(projectData) {
        try {
            const newProject = {
                title: projectData.title || '',
                description: projectData.description || '',
                startDate: projectData.startDate || '',
                endDate: projectData.endDate || '',
                progress: projectData.progress || 0,
                completed: projectData.completed || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const createdProject = await this.fetchAPI(this.projectsEndpoint, {
                method: 'POST',
                body: JSON.stringify(newProject)
            });

            return {
                success: true,
                data: createdProject,
                message: 'Project created successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to create project'
            };
        }
    }

    // PUT - Төсөл шинэчлэх
    async updateProject(id, updates) {
        try {
            // Эхлээд одоо байгаа төслийг авах
            const existingProject = await this.getProjectById(id);
            if (!existingProject.success) {
                return {
                    success: false,
                    data: null,
                    message: 'Project not found'
                };
            }

            const updatedProject = {
                ...existingProject.data,
                ...updates,
                id: id,
                updatedAt: new Date().toISOString()
            };

            const result = await this.fetchAPI(`${this.projectsEndpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedProject)
            });

            return {
                success: true,
                data: result,
                message: 'Project updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message
            };
        }
    }

    // DELETE - Төсөл устгах
    async deleteProject(id) {
        try {
            await this.fetchAPI(`${this.projectsEndpoint}/${id}`, {
                method: 'DELETE'
            });

            return {
                success: true,
                data: { id },
                message: 'Project deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message || 'Project not found'
            };
        }
    }

    // Календарын тэмдэглэлүүдийн CRUD үйлдлүүд
    // GET - Бүх календарын тэмдэглэлүүдийг авах
    async getCalendarNotes() {
        try {
            const notesArray = await this.fetchAPI(this.calendarNotesEndpoint);
            
            // id: 1 бүхий тэмдэглэл объектыг олох, эсвэл хоосон объект буцаах
            if (Array.isArray(notesArray) && notesArray.length > 0) {
                const notesObj = notesArray.find(n => n.id === 1);
                return {
                    success: true,
                    data: notesObj ? notesObj : { id: 1, data: {} },
                    message: 'Calendar notes fetched successfully'
                };
            }
            
            // Хэрэв тэмдэглэл байхгүй бол анхдагч бүтцийг буцаах
            return {
                success: true,
                data: { id: 1, data: {} },
                message: 'Calendar notes fetched successfully'
            };
        } catch (error) {
            console.error('Error getting calendar notes:', error);
            return {
                success: false,
                data: { id: 1, data: {} },
                message: error.message
            };
        }
    }

    // PUT - Календарын тэмдэглэлүүдийг шинэчлэх (бүх объектыг солих)
    async updateCalendarNotes(notes) {
        try {
            // Эхлээд одоо байгаа тэмдэглэлүүдийг авах
            const existingResponse = await this.getCalendarNotes();
            const existingData = existingResponse.data?.data || {};
            
            // Шинэ тэмдэглэлүүдтэй нэгтгэх
            const mergedNotes = { ...existingData, ...notes };
            
            // id: 1 бүхий тэмдэглэл объектыг шинэчлэх эсвэл үүсгэх
            try {
                const result = await this.fetchAPI(`${this.calendarNotesEndpoint}/1`, {
                    method: 'PUT',
                    body: JSON.stringify({ id: 1, data: mergedNotes })
                });

                return {
                    success: true,
                    data: { id: 1, data: mergedNotes },
                    message: 'Calendar notes updated successfully'
                };
            } catch (updateError) {
                // Хэрэв шинэчлэх нь амжилтгүй бол (элемент байхгүй), үүсгэх
                const result = await this.fetchAPI(this.calendarNotesEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({ id: 1, data: mergedNotes })
                });
                
                return {
                    success: true,
                    data: { id: 1, data: mergedNotes },
                    message: 'Calendar notes created successfully'
                };
            }
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message
            };
        }
    }
}

// Бусад файлуудад ашиглахын тулд экспорт хийх
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskAPI;
}

