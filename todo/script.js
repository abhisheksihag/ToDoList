const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

let todos = [];

// Load todos from local storage or fetch API data
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderTodoList();
  } else {
    fetchTodoData();
  }
}

// Save todos to local storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodoList() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const listItem = createTodoListItem(todo, index);
    todoList.appendChild(listItem);
  });
}

function createTodoListItem(todo, index) {
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  const todoNumber = document.createElement('span');
  todoNumber.className = 'todo-number';
  todoNumber.innerText = `${index + 1}.`;

  const todoInput = document.createElement('input');
  todoInput.type = 'text';
  todoInput.value = todo.title;
  todoInput.disabled = true;

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', () => deleteTodoItem(index));

  const editButton = document.createElement('button');
  editButton.innerHTML = 'Edit';
  editButton.className = 'edit-button';
  editButton.addEventListener('click', () => enableEdit(index));

  listItem.appendChild(todoNumber);
  listItem.appendChild(todoInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

function fetchTodoData() {
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(apiData => {
      const apiDataFiltered = apiData.filter(apiTodo => {
        // Check if API data already exists in the locally stored tasks
        return !todos.some(todo => todo.id === apiTodo.id);
      });

      todos = [...todos, ...apiDataFiltered];
      saveTodos();
      renderTodoList();
    })
    .catch(error => {
      console.log('Error fetching todo data:', error);
    });
}

function addTodoItem() {
  const todoText = todoInput.value.trim();
  if (todoText) {
    const newTodo = { id: generateUniqueId(), title: todoText };
    todos.push(newTodo);
    saveTodos();

    const listItem = createTodoListItem(newTodo, todos.length - 1);
    todoList.appendChild(listItem);

    todoInput.value = '';
  }
}

function deleteTodoItem(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodoList();
}

function enableEdit(index) {
  const listItem = todoList.children[index];
  const todoItem = listItem.querySelector('input[type="text"]');
  todoItem.disabled = false;
  todoItem.focus();

  const editButton = listItem.querySelector('.edit-button');
  editButton.innerHTML = 'Save';
  editButton.removeEventListener('click', () => enableEdit(index));
  editButton.addEventListener('click', () => saveTodoItem(index));
}

function saveTodoItem(index) {
  const listItem = todoList.children[index];
  const todoItem = listItem.querySelector('input[type="text"]');
  todos[index].title = todoItem.value;
  todoItem.disabled = true;

  const editButton = listItem.querySelector('.edit-button');
  editButton.innerHTML = 'Edit';
  editButton.removeEventListener('click', () => saveTodoItem(index));
  editButton.addEventListener('click', () => enableEdit(index));

  saveTodos();
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

addButton.addEventListener('click', addTodoItem);

// Load todos on page load
loadTodos();
