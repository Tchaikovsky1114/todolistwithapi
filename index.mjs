import  regeneratorRuntime  from  "regenerator-runtime" ;
import  './app.mjs'
import './main.css'
const application = document.querySelector('#app-contents')
const loadingEl = document.querySelector('#loading')

let loading = true;
let orderNumber = 0;


function onFocusPlaceholder() {
  todosInputEl.setAttribute('placeholder', "진짜 무적권 해야 댐!");
}

function onBlurPlaceholder() {
  todosInputEl.setAttribute('placeholder', "쓰면 무조건 해야 됨");
}

function countTodos(data) {
  const todosCountEl = document.querySelector('.todos-count')
  const todosCountWrapper = document.querySelector('.todos-count-wrapper');
  if (data.length > 0) {
    todosCountEl.textContent = data.length;
    todosCountWrapper.style.display = 'block';
  }
  if (data.length === 0) {
    todosCountWrapper.style.display = 'none';
  }
}

function toggleLoading() {
  if (loading) {
    loadingEl.style.display = 'block';
    application.style.display = 'none';
  } else {
    loadingEl.style.display = 'none';
    application.style.display = 'block';
  }
}

//GET
async function readTodo() {
  loading = true;
  const {
    data
  } = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  renderTodos(data);
  loading = false;
  toggleLoading()
  countTodos(data)
  console.log(data);
}

// throw Error
function sameTodoValidation(array,value) {
  array.forEach(title =>{
  if(value === title){
    throw '똑같은 Todo가 존재합니다!'
  }})
}
//POST 
async function createTodo(todosValue) {
  loading = true;
  orderNumber++;
  toggleLoading()

  const {
    data
  } = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  const todosTitleArray = [];
  data.forEach(todos => todosTitleArray.push(todos.title))
  

  try{
    sameTodoValidation(todosTitleArray,todosValue);
    await axios({
      url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'apikey': 'FcKdtJs202204',
        'username': 'KimMyungSeong'
      },
      data: {
        "title": todosValue,
        "order": orderNumber
      }
    })
    readTodo()
  }catch(e){
    alert(e);
  }

  
}

// DELETE
async function deleteTodo(e) {
  loading = true;
  console.log('delete!')
  toggleLoading();
  const {
    data
  } = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': "KimMyungSeong"
    }
  })
  const todosTitle = e.target.parentNode.parentNode.parentNode.firstChild.nextSibling.textContent;
  console.log(todosTitle);
  let todosIdArray = [];
  data.map(item => todosIdArray.push(item.id));

  let todosTitleArray = [];
  data.map(item => todosTitleArray.push(item.title));

  const todosIndex = todosTitleArray.findIndex(title => title === todosTitle)

  await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todosIdArray[todosIndex]}`,
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': "KimMyungSeong"
    }
  })

  
  readTodo()
}


const todoFormEl = document.querySelector('#todo-form');
const todosInputEl = document.querySelector('#todos-input');

let todosValue = '';

function onAddTodosHandler(e) {
  todosValue = e.target.value
}

function onSubmitTodo(e) {
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



todoFormEl.addEventListener('submit', onSubmitTodo)
todosInputEl.addEventListener('change', onAddTodosHandler)
todosInputEl.addEventListener('focus', onFocusPlaceholder)
todosInputEl.addEventListener('blur', onBlurPlaceholder)

const todoList = document.querySelector('.todos--list')

function countTodoListChildNode() {
  if (!todoList.childElementCount) {
    const EmptyTodosEl = document.createElement('div');
    EmptyTodosEl.innerHTML = "아무 계획도 없습니다..."
    todoList.append(EmptyTodosEl);
  }
}

//PUT (change done property)
async function onToggleDone(e){
  const {data} = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  const todosTitle = e.target.parentNode.parentNode.firstChild.nextSibling.textContent;

  let todosTitleArray = [];
  data.map(item => todosTitleArray.push(item.title));
  const todosIndex = todosTitleArray.findIndex(title => title === todosTitle)
  console.log(todosIndex)
  console.log(todosTitle);

  let todosIdArray = [];
  data.map(item => todosIdArray.push(item.id));

  let todosOrderArray = [];
  data.map(item => todosOrderArray.push(item.order))

  let todosDoneArray = [];
  data.map(item => todosDoneArray.push(item.done))
  console.log(todosDoneArray[todosIndex]);
   await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todosIdArray[todosIndex]}`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': "KimMyungSeong",
    },
    data: {
      "title":todosTitle,
      "order":todosOrderArray[todosIndex],
      "done" : !todosDoneArray[todosIndex]
    }
  })
  readTodo()
}

//PUT change comment
let showUpdateInput = false;

function onToggleUpdateInput(elems,bool=true){
  console.log('toggle!');
  showUpdateInput = bool;
  if(showUpdateInput){
    elems.style.display = '';
    elems.style.display = 'block';
  }else if(!showUpdateInput){
    elems.style.display = '';
    elems.style.display = 'none';
  }
}

async function changeTodoTitle(e){
  
  const {data} = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  
    
    let todosTitleArray = [];
    data.map(item => todosTitleArray.push(item.title));
    const todosTitle = e.target.parentNode.parentNode.parentNode.firstChild.nextSibling.textContent;
    const todosIndex = todosTitleArray.findIndex(title => title === todosTitle)
    const todoCard = document.querySelectorAll('.todo')[todosIndex];  
    const updateInputBox = document.querySelector('.todos--update-input-box');
    const todosUpdateCancelButton = document.querySelector('.todos--update-cancel-button')
    todosUpdateCancelButton.addEventListener('click',()=>{onToggleUpdateInput(updateInputBox,false)});
    document.body.append(updateInputBox);
    onToggleUpdateInput(updateInputBox)
    



  let todosIdArray = [];
  data.map(item => todosIdArray.push(item.id));

  let todosOrderArray = [];
  data.map(item => todosOrderArray.push(item.order))

  let todosDoneArray = [];
  data.map(item => todosDoneArray.push(item.done))
  console.log(todosDoneArray[todosIndex]);
  //  await axios({
  //   url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todosIdArray[todosIndex]}`,
  //   method: 'PUT',
  //   headers: {
  //     'content-type': 'application/json',
  //     'apikey': 'FcKdtJs202204',
  //     'username': "KimMyungSeong",
  //   },
  //   data: {
  //     "title":todosTitle,
  //     "order":todosOrderArray[todosIndex],
  //     "done" : !todosDoneArray[todosIndex]
  //   }
  // })
  
  readTodo()
  
}






async function renderTodos(data) {
  
  const todos = await data.map((todo) => /* html */ `
  <li class="todo">
  <div class="todos--title">${todo.title}</div>
  <span>(${todo.createdAt.substr(2,2)}-${todo.createdAt.substr(5,2)}-${todo.createdAt.substr(8,2)} ${todo.createdAt.substr(11,2)}:${todo.createdAt.substr(14,2)}분 작성)</span>
  <div class="todos--button-wrapper">
  <div>
  <button class="todos--delete-button">삭제하기</button>
  <button class="todos--update-button">타협하기</button>
  </div>
  </div>
  <div>${todo.done === false ? "노력 중🔴" : "해냈어요!🔵"}<button class='todos--done-toggle-button'>체크</button></div>
  </li>
  `)
  const todoTitles = todos.join('');
  todoList.innerHTML = todoTitles;
  application.append(todoList);
  const doneToggleButtons = document.querySelectorAll('.todos--done-toggle-button')
  doneToggleButtons.forEach((doneToggleButton)=> doneToggleButton.addEventListener('click',onToggleDone))
  countTodoListChildNode();
  loadButtons();
}



const showAllListButton = document.querySelector('#todos--remote-show-Alllist-button');
function showAllList(e){
  readTodo()
}
const deleteDoneListButton = document.querySelector('#todos--remote-remove-donelist-button');

async function deleteDoneList(e){
  const {data} = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  const doneTodo = data.filter(data => data.done === true);
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
  setTimeout(()=>{readTodo()},1000) 
}
function loadButtons() {
  const deleteButtonEls = document.querySelectorAll('.todos--delete-button');
  const todosHandleEls = [...document.querySelectorAll('.todos--button-wrapper')];
  const updateButtonEls = [...document.querySelectorAll('.todos--update-button')];
  showAllListButton.addEventListener('click',showAllList)
  deleteDoneListButton.addEventListener('click',deleteDoneList)
  deleteButtonEls.forEach((deleteButtonEl) => deleteButtonEl.addEventListener('click', deleteTodo))
  updateButtonEls.forEach((updateButtonEl) => updateButtonEl.addEventListener('click',changeTodoTitle))
}

const showDoneListButton = document.querySelector('#todos--remote-show-donelist-button')
const showProgressingListButton = document.querySelector('#todos--remote-show-progressinglist-button')

//sort
async function onToggleList(bool){
  const {
    data
  } = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'KimMyungSeong'
    },
  })
  const filteredFalseData = data.filter(item => item.done === bool)
  console.log(filteredFalseData);
  todoList.innerHTML = '';
  renderTodos(filteredFalseData)
}

showDoneListButton.addEventListener('click',()=>onToggleList(true))
showProgressingListButton.addEventListener('click',()=>onToggleList(false))


readTodo()

