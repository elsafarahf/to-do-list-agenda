// Global variables to store tasks and track unique IDs
let tasks = [];
let taskId = 0;

// Function to add a new task to the list
function addTask() {
  // Get input elements from the DOM
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const priorityInput = document.getElementById("priorityInput");

  // Validate task input - don't allow empty tasks
  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    taskInput.focus();
    return;
  }

  // Create new task object with all properties
  const task = {
    id: taskId++, // Unique ID for each task
    text: taskInput.value.trim(),
    date: dateInput.value || new Date().toISOString().split("T")[0], // Use today's date if none selected
    priority: priorityInput.value,
    completed: false,
    selected: false, // For bulk operations
  };

  // Add task to array and clear inputs
  tasks.push(task);
  taskInput.value = "";
  dateInput.value = "";
  
  // Update the UI
  renderTasks();
  updatePriorityCounts();
}

// Function to toggle task completion status
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks(); // Re-render to move task between todo/done sections
  }
}

// Function to delete a single task by ID
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
  updatePriorityCounts();
}

// Function to render all tasks in the DOM
function renderTasks() {
  // Get container elements
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");
  const filterDate = document.getElementById("filterDate").value;

  // Clear existing content
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // Filter tasks by date if filter is applied
  const filteredTasks = filterDate
    ? tasks.filter((task) => task.date === filterDate)
    : tasks;

  // Create DOM elements for each task
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Build task HTML with all controls
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

    // Apply CSS classes for styling
    li.className = `${task.completed ? "completed" : ""} priority-${
      task.priority
    }`;

    // Add to appropriate list based on completion status
    if (task.completed) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

// Function to filter tasks by date
function filterTasks() {
  renderTasks(); // Re-render with current filter
}

// Function to clear date filter and show all tasks
function clearFilter() {
  document.getElementById("filterDate").value = "";
  renderTasks();
}

// Function to toggle task selection for bulk operations
function selectTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.selected = !task.selected;
  }
}

// Function to delete all selected tasks
function deleteSelectedTasks() {
  const selectedTasks = tasks.filter((t) => t.selected);
  
  // Check if any tasks are selected
  if (selectedTasks.length === 0) {
    alert("No tasks selected");
    return;
  }
  
  // Confirm deletion with user
  if (confirm(`Delete ${selectedTasks.length} selected task(s)?`)) {
    tasks = tasks.filter((t) => !t.selected);
    renderTasks();
    updatePriorityCounts();
  }
}

// Function to delete all tasks with confirmation
function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
    updatePriorityCounts();
  }
}

// Initialize date input with today's date as default
document.getElementById("dateInput").value = new Date()
  .toISOString()
  .split("T")[0];

// Function to update the current date and time display
function updateDateTime() {
  const now = new Date();
  
  // Format options for displaying date and time
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  
  // Update the datetime element with formatted current time
  document.getElementById("datetime").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

// Function to update priority count badges
function updatePriorityCounts() {
  // Count tasks by priority level
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;
  
  // Update the count displays in the UI
  document.getElementById('highCount').textContent = highCount;
  document.getElementById('mediumCount').textContent = mediumCount;
  document.getElementById('lowCount').textContent = lowCount;
}

// Initialize the application
updateDateTime(); // Set initial datetime
setInterval(updateDateTime, 1000); // Update datetime every second
updatePriorityCounts(); // Set initial priority counts
