let tasks = [];
let taskId = 0;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const priorityInput = document.getElementById("priorityInput");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    taskInput.focus();
    return;
  }

  const task = {
    id: taskId++,
    text: taskInput.value.trim(),
    date: dateInput.value || new Date().toISOString().split("T")[0],
    priority: priorityInput.value,
    completed: false,
    selected: false,
  };

  tasks.push(task);
  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
  updatePriorityCounts();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
  updatePriorityCounts();
}

function renderTasks() {
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");
  const filterDate = document.getElementById("filterDate").value;

  todoList.innerHTML = "";
  doneList.innerHTML = "";

  const filteredTasks = filterDate
    ? tasks.filter((task) => task.date === filterDate)
    : tasks;

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
            <input type="checkbox" class="select-checkbox" onchange="selectTask(${
              task.id
            })">
            <input type="checkbox" ${task.completed ? "checked" : ""} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="task-priority">${task.priority.toUpperCase()}</span>
            <span class="task-date">${task.date}</span>
            <button class="delete-btn" onclick="deleteTask(${
              task.id
            })">×</button>
        `;

    li.className = `${task.completed ? "completed" : ""} priority-${
      task.priority
    }`;

    if (task.completed) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

function filterTasks() {
  renderTasks();
}

function clearFilter() {
  document.getElementById("filterDate").value = "";
  renderTasks();
}

function selectTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.selected = !task.selected;
  }
}

function deleteSelectedTasks() {
  const selectedTasks = tasks.filter((t) => t.selected);
  if (selectedTasks.length === 0) {
    alert("No tasks selected");
    return;
  }
  if (confirm(`Delete ${selectedTasks.length} selected task(s)?`)) {
    tasks = tasks.filter((t) => !t.selected);
    renderTasks();
    updatePriorityCounts();
  }
}

function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
    updatePriorityCounts();
  }
}

// Set today's date as default
document.getElementById("dateInput").value = new Date()
  .toISOString()
  .split("T")[0];

// Update datetime display
function updateDateTime() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  document.getElementById("datetime").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

function updatePriorityCounts() {
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;
  
  document.getElementById('highCount').textContent = highCount;
  document.getElementById('mediumCount').textContent = mediumCount;
  document.getElementById('lowCount').textContent = lowCount;
}

updateDateTime();
setInterval(updateDateTime, 1000);
updatePriorityCounts();
