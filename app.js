import { createClient } from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = "https://mlbuusohdsxbivcnqbun.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYnV1c29oZHN4Yml2Y25xYnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzYyOTksImV4cCI6MjA1NTAxMjI5OX0.E8PNo5FuGCg4Zdj86O01IdABTVLdD94kxsxZfBWe0NQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function refreshHistory() {
  let { data: page, Error } = await supabase.from('page').select('*');
  if (Error) {
    console.error('Error fetching data:', Error);
    return;
  }
  let incompleteTasks = '';
  let completedTasks = '';
  let CreatedTask = page.length;
  let CompletedTask = 0;
  for (let i = 0; i < page.length; i++) {
    const completed = page[i].completed; //체크
    const checked = completed ? 'checked' : ''; //체크활성화?
    const textDecoration = completed ? 'line-through' : 'none'; //줄긋기

    const taskHTML = `<li style="text-decoration: ${textDecoration}">
    <input type="checkbox" id="${page[i].id}" class="check" ${checked}/>
    ${page[i].title}
    <svg id="delete" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
    </svg>
    </li>`;
    if (completed) {
      completedTasks += taskHTML;
      CompletedTask++;
    } else {
      incompleteTasks += taskHTML;
    }
  }
  document.getElementById('container').innerHTML = incompleteTasks + completedTasks;
  document.getElementById('count').innerText = CreatedTask;
  document.getElementById('complete').innerText = CompletedTask;
  document.querySelectorAll('.check').forEach(check => check.addEventListener('change', chackHandler));
  document.querySelectorAll('#delete').forEach(btn => btn.addEventListener('mouseup', deleteHandler));
}
refreshHistory();

async function recordHandler() {
  const title = document.getElementById('input').value.trim();

  if (title === '') {
    alert('내용을 입력해주세요.');
    return;
  } else {
    const { data, error } = await supabase
      .from('page')
      .insert([{ title: title, completed: false }]) //that
      .select();
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
    refreshHistory();
  }
}

async function deleteHandler() {
  let result = confirm("진짜 삭제하시겠습니까?");
  if (result) {
    const listItem = this.closest('li');
    const id = listItem.querySelector('.check').id;
    const { error } = await supabase.from('page').delete().match({ id: id });
    if (error) {
      console.error('Error deleting data:', error);
      return;
    }
    refreshHistory();
  } else {
    return;
  }
}


async function chackHandler(event) {
  const completeElement = document.getElementById('complete');
  const complete = parseInt(completeElement.innerText);
  const checkbox = event.target;
  const listItem = checkbox.closest('li');
  const id = checkbox.id;

  let { data: page, error } = await supabase
  .from('page')
  .select('*').eq("id", id)
  const completed = page[0].completed;
  console.log(completed)

  if (completed){
    completeElement.innerText = complete - 1;
    listItem.style.textDecoration = 'none';
    console.log('check'); 
    const { data, error } = await supabase
    .from('page')
    .update({ completed: false})
    .eq('id', id)
    .select()

  } else {
    completeElement.innerText = complete + 1;
    listItem.style.textDecoration = 'line-through';
    console.log('check no');
    const { data, error } = await supabase
    .from('page')
    .update({ completed: true})
    .eq('id', id)
    .select()
  }
}

document.getElementById('input-container').addEventListener('submit', recordHandler);