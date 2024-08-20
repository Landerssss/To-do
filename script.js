document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadMemo();

    const memoSaveButton = document.getElementById('memo-save-button');

    memoSaveButton.addEventListener('click', saveMemo);

    // Auto-save tasks and memo when the page is unloaded
    window.addEventListener('beforeunload', saveAllData);
});

function switchView() {
    const todoView = document.getElementById('todo');
    const memoView = document.getElementById('memo');
    const switchButton = document.getElementById('switch-button');

    if (todoView.classList.contains('active')) {
        todoView.classList.remove('active');
        memoView.classList.add('active');
        switchButton.textContent = 'To-do List';
    } else {
        memoView.classList.remove('active');
        todoView.classList.add('active');
        switchButton.textContent = 'Memo';
    }
}

function addTask() {
    const taskInput = document.getElementById('todo-input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskList = getTasks();
        taskList.push({ text: taskText, completed: false });
        saveTasks(taskList);
        renderTasks();
        taskInput.value = '';
    }
}

function toggleTaskCompletion(index) {
    const taskList = getTasks();
    taskList[index].completed = !taskList[index].completed;
    saveTasks(taskList);
    renderTasks();
}

function deleteTask(index) {
    const taskList = getTasks();
    taskList.splice(index, 1);
    saveTasks(taskList);
    renderTasks();
}

function saveMemo() {
    const memoText = document.getElementById('memo-text').value;
    localStorage.setItem('memo', memoText);
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
}

function loadMemo() {
    const memoText = localStorage.getItem('memo');
    if (memoText) {
        document.getElementById('memo-text').value = memoText;
    }
}

function renderTasks() {
    const taskList = getTasks();
    const ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    taskList.sort((a, b) => a.completed - b.completed);
    taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="complete-button" onclick="toggleTaskCompletion(${index})">${task.completed ? '&#x2716;' : '&#x2714;'}</button>
                <button class="delete-button" onclick="deleteTask(${index})">&#x2716;</button>
            </div>
        `;
        ul.appendChild(li);
    });
}

function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveAllData() {
    saveTasks(getTasks());
    saveMemo();
}
