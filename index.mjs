import regeneratorRuntime from "regenerator-runtime";
import './app.mjs'
import './main.css'
const application = document.querySelector('#app-contents')
const loadingEl = document.querySelector('#loading')
const updateInput = document.querySelector('#todos--update-input');
const todosUpdateCancelButton = document.querySelector('.todos--update-cancel-button')
const updateForm = document.querySelector('#todos--update-form')
const todoFormEl = document.querySelector('#todo-form');
const todosInputEl = document.querySelector('#todos-input');
const todosCountEl = document.querySelector('.todos-count')
const todosCountWrapper = document.querySelector('.todos-count-wrapper');
const updateInputBox = document.querySelector('.todos--update-input-box');
let loading = true;
let orderNumber = 0;

const API_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos';
const API_KEY = 'FcKdtJs202204';
const USER_NAME = 'KimMyungSeong';
const testArray = [];


todoFormEl.addEventListener('submit', (e) => onSubmitTodo(e, todosInputEl.value))

todosInputEl.addEventListener('focus', onFocusPlaceholder)
todosInputEl.addEventListener('blur', onBlurPlaceholder)


async function onInit() {
  await getTodo();
  renderTodos(todos);
  countTodos(todos);
}

async function getTodo() {
  toggleLoading(true)
  try {
    const response = await request({
      method: 'GET'
    })
    todos = []
    response.data.forEach((item) => todos.push(item))
    return response;
  } catch (err) {
    alert(err)
  } finally {
    toggleLoading(false);
  }
}

async function postTodo(todosValue, orderNumber) {
  toggleLoading(true)
  try {
    const response = await request({
      method: 'POST',
      data: {
        title: todosValue,
        order: orderNumber
      }
    })
    todos.push(response.data);
    return response;
  } catch (err) {
    alert(err)
  } finally {
    toggleLoading(false)
    readTodo()
  }
}

function onFocusPlaceholder() {
  todosInputEl.setAttribute('placeholder', "진짜 무적권 해야 댐!");
}

function onBlurPlaceholder() {
  todosInputEl.setAttribute('placeholder', "쓰면 무조건 해야 됨");
}

function countTodos(todos) {

  if (todos.length > 0) {
    todosCountEl.textContent = todos.length;
    todosCountWrapper.style.display = 'block';
  }
  if (todos.length === 0) {
    todosCountWrapper.style.display = 'none';
  }
}

function toggleLoading(isLoading) {
  if (isLoading) {
    loadingEl.style.display = 'block';
    application.style.display = 'none';
  } else {
    loadingEl.style.display = 'none';
    application.style.display = 'block';
  }
}


// validate
function sameTodoValidation(array, value) {
  const isValid = array.some(item => item.title === value)
  return isValid;
}

// create Todo
async function createTodo(todosValue) {
  if (!sameTodoValidation(todos, todosValue)) {
    postTodo(todosValue, todos.length + 1)
  } else {
    alert("똑같은 Todo가 존재합니다!")
  }
  readTodo()
}


async function deleteTodo(e) {
  const {
    value
  } = e.target
  try {
    todos = todos.filter((item) => item.id !== value)
    const response = await request({
      url: `${API_URL}/${value}`,
      method: 'DELETE'
    })

    return response;
  } catch (err) {
    alert(err)
  } finally {
    readTodo()
  }

}

function readTodo() {
  renderTodos(todos);
  countTodos(todos)
}


function onSubmitTodo(e, todosValue) {
  e.preventDefault();
  if (todosValue.length < 10) {
    alert('누가 목표는 자세히 써야 실천 한다고 하더라고요(10자 이상 입력)')
    return;
  }
  createTodo(todosValue)
  readTodo()
  todosInputEl.value = '';
  todosInputEl.focus();
}

const todoList = document.querySelector('.todos--list')

function countTodoListChildNode() {
  if (!todoList.childElementCount) {

    todoList.innerHTML = `<div>아무 계획도 없습니다...</div>`
  }
}
let todos = [];

async function request({
  url = API_URL,
  method = "",
  data = {}
}) {
  const response = await axios({
    url,
    method,
    headers: {
      "content-type": "application/json",
      apikey: API_KEY,
      username: USER_NAME
    },
    data
  })
  return response;
}

async function putTodo(item) {
  
  const {
    id,
    title,
    order,
    done
  } = item;

  try {
    const response = await request({
      url: `${API_URL}/${id}`,
      method: 'PUT',
      data: {
        title,
        order,
        done: !done
      }
    })
    const currentIdx = todos.findIndex(item => item.id === id)
    todos[currentIdx] = {
      ...todos[currentIdx],
      title,
      order,
      done: !done,
    }
    return response;
  } catch (err) {
    alert(err)
  } finally {
    
    readTodo()
  }
}

//change done property
async function onToggleDone(e) {
  const {
    value
  } = e.target
  const currentItem = todos.find((item) => item.id === value)
  putTodo(currentItem)
}

//PUT change comment


function onToggleUpdateInput(bool = false) {

  console.log('toggle!');
  bool = bool;
  if (bool) {
    updateInputBox.style.display = '';
    updateInputBox.style.display = 'block';
  } else {
    updateInputBox.style.display = '';
    updateInputBox.style.display = 'none';
  }

}





async function onSubmitUpdateTodo(e, currentIdx, value) {
  e.preventDefault()

  if (todos[currentIdx].id === value) {
    todos[currentIdx] = {
      ...todos[currentIdx],
      title: updateInput.value,
      order: todos[currentIdx].order,
      done: todos[currentIdx].done
    }
    console.log(todos[currentIdx].id);
    await axios({
      url: `${API_URL}/${todos[currentIdx].id}`,
      method: 'PUT',
      headers: {
        "content-type": 'application/json',
        apikey: API_KEY,
        username: USER_NAME,
      },
      data: {
        "title": updateInput.value,
        "order": orderNumber,
        "done": false
      }
    })
    onToggleUpdateInput(false);
    updateInput.value = '';
  }
  readTodo()


}



async function changeTodoTitle(e) {

  const {value} = e.target // value == todo.id
  const currentIdx = todos.findIndex(todo => todo.id === value)
  onToggleUpdateInput(true)

 
  
  
  updateForm.addEventListener('submit', (e) => onSubmitUpdateTodo(e, currentIdx, value))
};
todosUpdateCancelButton.addEventListener('click', () => {
  onToggleUpdateInput(false)
})






function renderTodos(todos, str = "작성") {

  const todoElements = todos.map((todo) => /* html */ `
  <li class="todo">
    <div class="todos--title">${todo.title}</div>
      <span>(${todo.updatedAt.substr(2,2)}-${todo.updatedAt.substr(5,2)}-${todo.updatedAt.substr(8,2)} ${todo.updatedAt.substr(11,2)}:${todo.updatedAt.substr(14,2)}분 ${str})</span>
    <div class="todos--button-wrapper">
      <div>
       <button class="todos--delete-button" value=${todo.id}>삭제하기</button>
        <button class="todos--update-button" value=${todo.id}>타협하기</button>
     </div>
  </div>
    <div>${todo.done === false ? "노력 중🔴" : "해냈어요!🔵"}
      <button class='todos--done-toggle-button' value=${todo.id}>체크</button>
    </div>
  </li>
  `)


  const todoTitles = todoElements.join('');
  todoList.innerHTML = todoTitles;
  application.append(todoList);
  const doneToggleButtons = document.querySelectorAll('.todos--done-toggle-button')
  doneToggleButtons.forEach((doneToggleButton) => doneToggleButton.addEventListener('click', onToggleDone))
  countTodoListChildNode();
  loadButtons();
}



const showAllListButton = document.querySelector('#todos--remote-show-Alllist-button');
const deleteDoneListButton = document.querySelector('#todos--remote-remove-donelist-button');

function showAllList(e) {
  readTodo()
}

async function deleteDoneList(e) {

  try {
    const doneTodo = todos.filter(todo => todo.done === true);
    const todosIdArray = []
    doneTodo.map(item => todosIdArray.push(item.id));
    todosIdArray.forEach(todoId => axios({
      url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todoId}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'apikey': 'FcKdtJs202204',
        'username': 'KimMyungSeong'
      },
    }))
    todos = todos.filter(todo => todo.done ===false);
  } catch (err) {
    alert(err)
  } finally {
    readTodo()
   
  }

}




function loadButtons() {
  const deleteButtonEls = document.querySelectorAll('.todos--delete-button');
  const updateButtonEls = [...document.querySelectorAll('.todos--update-button')];
  updateButtonEls.forEach((updateButtonEl) => updateButtonEl.addEventListener('click', changeTodoTitle))
  showAllListButton.addEventListener('click', showAllList)
  deleteDoneListButton.addEventListener('click', deleteDoneList)
  deleteButtonEls.forEach((deleteButtonEl) => deleteButtonEl.addEventListener('click', deleteTodo))

}

const showDoneListButton = document.querySelector('#todos--remote-show-donelist-button')
const showProgressingListButton = document.querySelector('#todos--remote-show-progressinglist-button')

//sort by data.done value
function onToggleList(bool) {

  const filteredFalseData = todos.filter(item => item.done === bool)
  console.log(filteredFalseData);
  todoList.innerHTML = '';
  renderTodos(filteredFalseData, "수정")
}

showDoneListButton.addEventListener('click', () => onToggleList(true))
showProgressingListButton.addEventListener('click', () => onToggleList(false))


onInit()