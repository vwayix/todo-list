function open(){
  const createContainer = document.getElementById('create-container');
  createContainer.style.display = 'flex';
  createContainer.style.zIndex = '1';
  const title = document.getElementById('create-input');
  const value = document.getElementById('create-value');
  title.value = '';
  value.value = '';
}
function close(){
  const createContainer = document.getElementById('create-container');
  createContainer.style.display = 'none';
  createContainer.style.zIndex = '0';
}
function save(todos){
  localStorage.setItem('todos', JSON.stringify(todos));
}
function handleAdd(event){
  event.preventDefault();
  const title = document.getElementById('create-input').value;
  const value = document.getElementById('create-value').value;
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  if(title === '' || value === ''){
    alert('제목 또는 내용을 입력해주세요');
    return;
  }else{
    const todo = {
      title: title,
      value: value,
    };
  todos.push(todo);
  save(todos);
  }
  close();
  reRender();
}
function handleDelete(event){
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const target = event.target;
  const parent = target.closest('li'); // li 요소를 찾음
  const index = Array.from(parent.parentElement.children).indexOf(parent);
  todos.splice(index, 1);
  save(todos);
  reRender();
  }

function reRender(){
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const container = document.getElementById('container');
  const count = document.getElementById('count');
  if(todos.length === 0){
    console.log('작업이 없습니다.');
    count.innerText = 0;
    const div = document.createElement('div');
    const img = document.createElement('img');
    const strong = document.createElement('strong');
    const text = document.createElement('p');
    img.classList.add('todo-none');
    img.src = './img/Clipboard.png';
    strong.innerText = '아직 등록된 작업이 없습니다.';
    text.innerText = '작업을 생성하고 할 일 항목을 정리하세요';
    container.appendChild(img);
    div.appendChild(strong);
    div.appendChild(text);
    container.appendChild(div);
  }else if(todos.length > 0){
    console.log('작업이 있습니다.');
    count.innerText = todos.length;
    container.innerHTML = '';
    const ul = document.createElement('ul');
    todos.forEach((todo) => {
      const li = document.createElement('li');
      const checkBtn = document.createElement('button');
      const p = document.createElement('p');
      const deleteBtn = document.createElement('button');
      const img = document.createElement('img');
      const count = document.getElementById('count');
      count.innerText = todos.length;
      checkBtn.classList.add('check');
      p.innerText = todo.value;
      deleteBtn.classList.add('delete');
      img.src = './img/delete.png';
      
      li.appendChild(checkBtn);
      li.appendChild(p);
      deleteBtn.appendChild(img);
      li.appendChild(deleteBtn);
      ul.appendChild(li);
    }) 
  container.appendChild(ul);
  }//작업이 있을 때
}

document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('create');
  const cancelBtn = document.getElementById('cancel');
  const addBtn = document.getElementById('add');
  const deleltBtnAll = document.querySelectorAll('.delete');

  reRender();
  createBtn.addEventListener('click', () => open());
  cancelBtn.addEventListener('click', () => close());
  addBtn.addEventListener('click', (event) => handleAdd(event));
  deleltBtnAll.forEach((btn) => btn.addEventListener('click', handleDelete()));
});