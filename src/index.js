// import "./style.css";

let tasks = [];
let savedTasks;
let deleteTaskFn;
let editTaskFn;
let saveTaskDescriptionFn;

const createTaskListItem = (task) => {
    const listItem = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    const description = document.createElement("input");
    description.type = "text";
    description.className = "input-text";
    description.value = task.description;
    description.readOnly = !task.editMode;
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
        listItem.classList.toggle("completed");
        listItem.classList.toggle("incomplete");
        task.completed = !task.completed;
        description.classList.toggle("cancel-line");
        savedTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteTaskFn(task.index);
        savedTasks();
    });

    const editButton = document.createElement("button");
    editButton.textContent = task.editMode ? "Save" : "Edit";
    editButton.addEventListener("click", () => {
        if (task.editMode) {
            saveTaskDescriptionFn(task, description.value);
        } else {
            editTaskFn(task);
        }
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(description);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.classList.add(task.completed ? "completed" : "incomplete");
    if (task.completed) {
        description.classList.add("cancel-line");
    }

    return listItem;
};

const renderTaskList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.sort((a, b) => a.index - b.index);
    tasks.forEach((task) => {
        const listItem = createTaskListItem(task);
        taskList.appendChild(listItem);
    });
};

savedTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFn = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTaskList();
    }
};

const addTaskFn = (description) => {
    const newTask = {
        description,
        completed: false,
        index: tasks.length + 1,
        editMode: false,
    };
    tasks.push(newTask);
    savedTasks();
    renderTaskList();
};

deleteTaskFn = (index) => {
    const taskIndex = tasks.findIndex((task) => task.index === index);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        savedTasks();
        renderTaskList();
    }
};

editTaskFn = (task) => {
    task.editMode = true;
    renderTaskList();
};

saveTaskDescriptionFn = (task, newDescription) => {
    task.description = newDescription;
    task.editMode = false;
    savedTasks();
    renderTaskList();
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    const input = document.getElementById("new-task-input");
    const inputValue = input.value.trim();
    if (inputValue !== "") {
        addTaskFn(inputValue);
        input.value = "";
        input.focus();
    }
};

const removeAllTasks = () => {
    tasks = tasks.filter((task) => !task.completed);
    savedTasks();
    renderTaskList();
};

// Event handlers placed before usage to avoid function hierarchy errors
const form = document.getElementById("new-task-form");
form.addEventListener("submit", handleFormSubmit);

const removeAllButton = document.getElementById("clear");
removeAllButton.addEventListener("click", removeAllTasks);

window.addEventListener("DOMContentLoaded", () => {
    loadTasksFn();
});
