// DOM elements
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");

const themeToggle = document.getElementById("theme-toggle");

function applyDarkModeSetting(enabled) {
  if (enabled) {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    themeToggle.checked = false;
  }
  localStorage.setItem("darkMode", enabled);
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("darkMode") === "true";
  applyDarkModeSetting(saved);
});

themeToggle.addEventListener("change", () => {
  applyDarkModeSetting(themeToggle.checked);
});
// Load tasks on startup
window.addEventListener("DOMContentLoaded", loadTasks);

// Add task
addButton.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return alert("Please enter a task!");
  const task = { text, completed: false };
  addTaskToDOM(task);
  saveTask(task);
  taskInput.value = "";
  
});
// Add task on "Enter" key press
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addButton.click();
    }
  });

// Clicks on task list (delete or complete)
taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  if (e.target.classList.contains("delete-btn")) {
    const text = li.querySelector("span").innerText;
    li.remove();
    deleteTask(text);
  }

  if (e.target.tagName === "SPAN") {
    li.classList.toggle("completed");
    const text = li.querySelector("span").innerText;
    toggleTask(text);
  }
});

// Filter tasks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    const items = document.querySelectorAll("#task-list li");
    items.forEach((li) => {
      const isDone = li.classList.contains("completed");
      li.style.display =
        filter === "all" ||
        (filter === "completed" && isDone) ||
        (filter === "active" && !isDone)
          ? "flex"
          : "none";
    });
  });
});

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToDOM);
 showEmptyMessage();
}

// Add task to DOM
function addTaskToDOM(task) {
    removeEmptyMessage();
  const li = document.createElement("li");
  li.className = task.completed ? "completed" : "";
  li.innerHTML = `<span>${task.text}</span>
  <button class="delete-btn">Delete</button>`;
  taskList.appendChild(li);
  // Optional: delay based on current number of tasks
  const delay = taskList.children.length * 80;
  li.style.animationDelay = `${delay}ms`;

  taskList.appendChild(li);
}

// Save a new task
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task from local storage
function deleteTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (document.querySelectorAll("#task-list li").length === 0) {
    showEmptyMessage();
  }
}

// Toggle task completion
function toggleTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) =>
    t.text === text ? { ...t, completed: !t.completed } : t
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function showEmptyMessage() {
  if (taskList.children.length === 0) {
    const msg = document.createElement("p");
    msg.id = "empty-message";
    msg.textContent = "🎉 No tasks! Enjoy your day.";
    msg.style.textAlign = "center";
    msg.style.color = "gray";
    taskList.after(msg);
  }
}

function removeEmptyMessage() {
  const msg = document.getElementById("empty-message");
  if (msg) msg.remove();
}