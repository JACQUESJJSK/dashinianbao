// 初始化事件数组
let events = [];

// 页面加载时渲染已有事件
window.addEventListener('load', () => {
  // 尝试从localStorage读取
  try {
    events = JSON.parse(localStorage.getItem('events') || '[]');
    renderEvents();
  } catch (error) {
    console.error('读取localStorage失败:', error);
    alert('无法读取本地存储，请检查浏览器设置');
  }
});

// 获取DOM元素
const eventDate = document.getElementById('event-date');
const eventContent = document.getElementById('event-content');
const eventPerson = document.getElementById('event-person');
const addEventBtn = document.getElementById('add-event');
const exportCsvBtn = document.getElementById('export-csv');
const eventsList = document.querySelector('.events-list');

// 删除单条数据
function deleteEvent(index) {
  if (confirm('确定要删除这条记录吗？')) {
    events.splice(index, 1);
    try {
      localStorage.setItem('events', JSON.stringify(events));
      renderEvents();
    } catch (error) {
      console.error('删除数据失败:', error);
      alert('删除数据失败，请检查浏览器设置');
    }
  }
}

// 添加事件
addEventBtn.addEventListener('click', () => {
  const date = eventDate.value;
  const content = eventContent.value.trim();
  const person = eventPerson.value.trim();

  if (!date || !content || !person) {
    alert('请填写所有字段');
    return;
  }

  // 添加新事件
  events.push({ date, content, person });
  
  // 按日期排序
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 保存到localStorage
  try {
    localStorage.setItem('events', JSON.stringify(events));
  } catch (error) {
    console.error('保存到localStorage失败:', error);
    alert('无法保存数据到本地存储，请检查浏览器设置');
  }
  
  // 更新显示
  renderEvents();
  
  // 清空输入框
  eventDate.value = '';
  eventContent.value = '';
  eventPerson.value = '';
});

// 导出CSV
exportCsvBtn.addEventListener('click', () => {
  if (events.length === 0) {
    alert('没有事件可导出');
    return;
  }

  // 创建CSV内容
  let csvContent = "data:text/csv;charset=utf-8,日期,事件内容,人物\r\n";
  events.forEach(event => {
    csvContent += `${event.date},${event.content},${event.person}\r\n`;
  });

  // 创建下载链接
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "events.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// 渲染事件列表
function renderEvents() {
  // 清空现有内容
  eventsList.innerHTML = `
    <div class="header-row">
      <div>日期</div>
      <div>事件内容</div>
      <div>人物</div>
    </div>
  `;

  // 添加每个事件
  events.forEach((event, index) => {
    const eventRow = document.createElement('div');
    eventRow.className = 'event-row';
    eventRow.innerHTML = `
      <div>${event.date}</div>
      <div>${event.content}</div>
      <div>${event.person}</div>
      <div><button class="delete-btn" onclick="deleteEvent(${index})">删除</button></div>
    `;
    eventsList.appendChild(eventRow);
  });
}
