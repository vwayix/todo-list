import { createClient } from 'https://esm.sh/@supabase/supabase-js';
const supabaseUrl = "https://mlbuusohdsxbivcnqbun.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYnV1c29oZHN4Yml2Y25xYnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzYyOTksImV4cCI6MjA1NTAxMjI5OX0.E8PNo5FuGCg4Zdj86O01IdABTVLdD94kxsxZfBWe0NQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function refreshHistory() {
  let { data: page, error } = await supabase.from('page').select('*');
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  console.log(page);
  let tag = '';
  for (let i = 0; i < page.length; i++) {
    tag += `<li>
    <input type="checkbox" id="${page[i].id}" class="check"/>
    ${page[i].title}
    <svg id="delete" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
    </svg>
    </li>`;
  }
  document.getElementById('container').innerHTML = tag;
  document.getElementById("count").innerText = page.length;
  
  // 체크박스 이벤트 리스너 추가
  document.querySelectorAll('.check').forEach(check => check.addEventListener('change', chackHandler));
  document.querySelectorAll('#delete').forEach(btn => btn.addEventListener('mouseup', deleteHandler));
}
refreshHistory();

async function recordHandler() {
  const title = document.getElementById('input').value;
  const trimmedTitle = title.trim();
  if (trimmedTitle === '') {
    alert('내용을 입력해주세요.');
    return;
  } else {
    const { data, error } = await supabase
    .from('page')
    .insert([{ title: title }])
    .select();
    refreshHistory();
  if (error) {
    console.error('Error inserting data:', error);
  }
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
  const complete = document.getElementById('complete');
  const checkbox = event.target;
  const listItem = checkbox.closest('li');
  let ChackNumber = parseInt(complete.innerText);

  if (checkbox.checked) {
    listItem.style.textDecoration = 'line-through';
    complete.innerText = ChackNumber + 1;
    console.log('check'); 
  } else {
    listItem.style.textDecoration = 'none';
    complete.innerText = ChackNumber - 1;
    console.log('check no');
  }
}

document.getElementById('input-container').addEventListener('submit', recordHandler);
