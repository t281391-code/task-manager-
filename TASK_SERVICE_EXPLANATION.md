# TaskService-ийн Ажиллагааны Тайлбар

## Ерөнхий Тайлбар

Энэ код дээр click үйлдэл хийхэд **TaskService** нь дараах байдлаар ажиллана:

## 1. Эхлэл (Initialization)

```javascript
// 1.js файлын 8-9 мөрөнд:
const taskAPI = new TaskAPI();
const taskService = new TaskService(taskAPI, appState);
```

- **TaskAPI**: JSON Server-тэй холбогдох (http://localhost:3000)
- **TaskService**: Бизнес логикийг удирдана
- **appState**: Апп-ын төлөвийг хадгална

---

## 2. Click Үйлдлүүд ба TaskService-ийн Ажиллагаа

### А. Даалгавар үүсгэх (Create Task)

**Хаана click хийгдэж байна:**
- "Create new task" товч (мөр 133-138)
- Даалгаврын форм илгээх (мөр 2074-2142)

**TaskService хэрхэн ажиллаж байна:**

```javascript
// 1.js мөр 2111:
await taskService.createTask(taskData);
```

**Алхам алхмаар:**

1. **TaskService.createTask()** дуудагдана (taskService.js мөр 36-60)
   - `this.state.setLoading(true)` - Ачааллаж байгааг тэмдэглэнэ
   - `this.api.createTask(taskData)` - API-д хүсэлт илгээнэ
   - API нь JSON Server-д POST хүсэлт илгээнэ
   - Хэрэв амжилттай бол: `this.state.addTask(response.data)` - Төлөвт нэмнэ
   - `this.state.setLoading(false)` - Ачааллалт дууссан

2. **API хүсэлт** (api.js мөр 72-100)
   - `POST http://localhost:3000/tasks`
   - Шинэ даалгаврыг JSON Server-д хадгална

3. **UI шинэчлэгдэнэ**
   - `await taskService.loadTasks()` - Даалгавруудыг дахин ачаална
   - `renderKanbanBoard()` - Канбан самбарыг шинэчлэнэ

---

### Б. Даалгавар шалгах (Check/Complete Task)

**Хаана click хийгдэж байна:**
- Даалгаврын карт дээрх "Check" товч (мөр 302-317, 762-787)

**TaskService хэрхэн ажиллаж байна:**

```javascript
// 1.js мөр 305:
await taskService.toggleTaskComplete(taskId);
```

**Алхам алхмаар:**

1. **TaskService.toggleTaskComplete()** дуудагдана (taskService.js мөр 117-141)
   - `this.api.toggleTaskComplete(id)` - API-д хүсэлт илгээнэ
   - API нь даалгаврын `completed` талбарыг эсрэгээр нь солино
   - Хэрэв амжилттай бол: `this.state.updateTask(response.data)` - Төлөвт шинэчлэнэ

2. **API хүсэлт** (api.js)
   - Даалгаврыг олоод `completed: true/false` болгоно
   - `PATCH http://localhost:3000/tasks/{id}`

3. **UI шинэчлэгдэнэ**
   - `renderTasks()` эсвэл `renderKanbanBoard()` - Харагдацыг шинэчлэнэ

---

### В. Даалгавар устгах (Delete Task)

**Хаана click хийгдэж байна:**
- Даалгаврын карт дээрх "Delete" товч (мөр 331-340, 817-838)

**TaskService хэрхэн ажиллаж байна:**

```javascript
// 1.js мөр 337:
await taskService.deleteTask(taskId);
```

**Алхам алхмаар:**

1. **TaskService.deleteTask()** дуудагдана (taskService.js мөр 90-114)
   - `this.api.deleteTask(id)` - API-д хүсэлт илгээнэ
   - Хэрэв амжилттай бол: `this.state.removeTask(id)` - Төлөвөөс хасна

2. **API хүсэлт** (api.js)
   - `DELETE http://localhost:3000/tasks/{id}`
   - JSON Server-аас даалгаврыг устгана

3. **UI шинэчлэгдэнэ**
   - Даалгаврын жагсаалт автоматаар шинэчлэгдэнэ

---

### Г. Даалгавар шинэчлэх (Update Task)

**Хаана click хийгдэж байна:**
- Канбан самбар дээр даалгаврыг чирэх (drag & drop) (мөр 1705-1727)
- COMPLETE баганаас "Дуусгах" товч (мөр 1653-1665)

**TaskService хэрхэн ажиллаж байна:**

```javascript
// 1.js мөр 1717:
await taskService.updateTask(taskId, { status: newStatus });
```

**Алхам алхмаар:**

1. **TaskService.updateTask()** дуудагдана (taskService.js мөр 63-87)
   - `this.api.updateTask(id, updates)` - API-д хүсэлт илгээнэ
   - Хэрэв амжилттай бол: `this.state.updateTask(response.data)` - Төлөвт шинэчлэнэ

2. **API хүсэлт** (api.js)
   - `PATCH http://localhost:3000/tasks/{id}`
   - Даалгаврын статусыг шинэчлэнэ (todo → inprogress → complete)

3. **UI шинэчлэгдэнэ**
   - Канбан самбар дахин харуулагдана
   - Даалгавар зөв баганад харагдана

---

## 3. TaskService-ийн Бүтэц

### TaskService класс (taskService.js)

```javascript
class TaskService {
    constructor(api, state) {
        this.api = api;      // TaskAPI instance
        this.state = state;  // AppState instance
    }
    
    // Үндсэн функцүүд:
    - loadTasks()           // Бүх даалгавруудыг ачаалах
    - createTask()          // Шинэ даалгавар үүсгэх
    - updateTask()          // Даалгавар шинэчлэх
    - deleteTask()          // Даалгавар устгах
    - toggleTaskComplete()  // Дуусгах төлөвийг солих
}
```

### Ажиллагааны урсгал:

```
Click Event
    ↓
TaskService функц дуудагдана
    ↓
API хүсэлт илгээнэ (TaskAPI)
    ↓
JSON Server-д хүсэлт хийгдэнэ
    ↓
Хариу ирнэ
    ↓
AppState шинэчлэгдэнэ
    ↓
UI автоматаар шинэчлэгдэнэ (subscribe механизм)
```

---

## 4. Жишээ: Бүтэн урсгал

**Жишээ: Даалгавар үүсгэх**

1. Хэрэглэгч "Create new task" товчийг дараана
2. Форм бөглөнө (гарчиг, тайлбар, огноо, гэх мэт)
3. "Create Task" товчийг дараана
4. `taskForm.addEventListener('submit')` ажиллана (мөр 2074)
5. `taskService.createTask(taskData)` дуудагдана (мөр 2111)
6. TaskService → TaskAPI → JSON Server
7. Шинэ даалгавар үүснэ
8. `taskService.loadTasks()` - Даалгавруудыг дахин ачаална
9. `renderKanbanBoard()` - Канбан самбар шинэчлэгдэнэ
10. Хэрэглэгч шинэ даалгаврыг харна

---

## 5. Төлөвийн Удирдлага

TaskService нь **appState**-ийг ашиглан төлөвийг удирдана:

- `appState.setTasks()` - Даалгавруудыг хадгална
- `appState.addTask()` - Шинэ даалгавар нэмнэ
- `appState.updateTask()` - Даалгавар шинэчлэнэ
- `appState.removeTask()` - Даалгавар хасна

Төлөв өөрчлөгдөхөд **subscribe** механизм ажиллаж, UI автоматаар шинэчлэгдэнэ (мөр 348-403).

---

## Дүгнэлт

Click үйлдэл хийхэд:
1. Event listener ажиллана
2. TaskService-ийн тохирох функц дуудагдана
3. API хүсэлт илгээгдэнэ
4. JSON Server-д өөрчлөлт хийгдэнэ
5. Төлөв шинэчлэгдэнэ
6. UI автоматаар шинэчлэгдэнэ

Энэ нь **MVC архитектур**-ын жишээ бөгөөд:
- **View** = HTML/CSS (index.html)
- **Controller** = Event handlers (1.js)
- **Model** = TaskService + TaskAPI + AppState

