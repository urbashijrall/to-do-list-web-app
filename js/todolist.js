// Select elements
const addBtn = document.querySelector("#add-task");
const inputValue = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list ul");

// Function to load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const fragment = document.createDocumentFragment();

  tasks.forEach(task => {
    const listItem = createTaskElement(task);
    fragment.appendChild(listItem);
  });

  taskList.innerHTML = ""; // Clear list before appending
  taskList.appendChild(fragment);
}

// Function to create a task element
function createTaskElement(taskText) {
  const listItem = document.createElement("li");
  listItem.className = "task-list-item";

  // Task content (editable)
  const taskContent = document.createElement("div");
  taskContent.className = "task-content";
  taskContent.textContent = taskText;
  taskContent.contentEditable = false; // Initially not editable

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "task-buttons";

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerText = "Update";

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerText = "Delete";

  // Append buttons
  buttonContainer.append(editBtn, deleteBtn);
  listItem.append(taskContent, buttonContainer);
  return listItem;
}

// Function to add a new task
function addTask() {
  const taskText = inputValue.value.trim();
  if (!taskText) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskList.appendChild(createTaskElement(taskText));
  inputValue.value = ""; // Clear input field
}

// Function to update a task in localStorage
function updateTask(oldText, newText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.indexOf(oldText);
  if (taskIndex !== -1) {
    tasks[taskIndex] = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Function to delete a task
function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Event delegation for Delete and Edit
taskList.addEventListener("click", function (event) {
  const listItem = event.target.closest("li");
  if (!listItem) return;

  const taskContent = listItem.querySelector(".task-content");

  if (event.target.classList.contains("delete-btn")) {
    listItem.remove();
    deleteTask(taskContent.textContent);
  } else if (event.target.classList.contains("edit-btn")) {
    taskContent.contentEditable = true;
    taskContent.focus(); // Focus the editable task
    event.target.innerText = "Save"; // Change button text to 'Save'

    // When clicking outside or pressing Enter, save changes
    taskContent.addEventListener("blur", () => saveEdit(taskContent, event.target), { once: true });
    taskContent.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveEdit(taskContent, event.target);
      }
    });
  }
});

// Function to save edited task
function saveEdit(taskContent, editButton) {
  const newText = taskContent.textContent.trim();
  if (!newText) return;

  updateTask(editButton.dataset.oldValue, newText); // Update localStorage
  taskContent.contentEditable = false; // Disable editing
  editButton.innerText = "Update"; // Change button text back
}

// Listen for "Enter" key in the input field
inputValue.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevents new line in textarea
    addTask();
  }
});

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task event listener
addBtn.addEventListener("click", addTask);
