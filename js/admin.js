// 校验 URL 参数 key
const params = new URLSearchParams(window.location.search);
const adminKey = 'd4f5f1g8h7'; // 内置密码（示例）
if (params.get('key') !== adminKey) {
    alert('密钥错误，访问拒绝');
    window.location.href = 'index.html';
}

// 初始化 Materialize 选择框
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

// 全局数据缓存
let projectsData = [], scheduleData = [];

// 加载项目数据并渲染可编辑卡片
fetch('..data/projects.json')
    .then(res => res.json())
    .then(projects => {
        projectsData = projects;
        projects.sort((a, b) => a.priority - b.priority);
        const container = document.getElementById('projects-admin');
        projects.forEach(proj => {
            const col = document.createElement('div');
            col.className = 'col s12 m6';
            col.innerHTML = `
        <div class="card">
          <div class="card-content">
            <span class="card-title">${proj.name}</span>
            <div class="input-field">
              <input type="number" min="0" max="100" value="${proj.progress}" data-proj="${proj.name}" class="proj-progress">
              <label>进度 (%)</label>
            </div>
            <p>
              <label>
                <input type="checkbox" class="filled-in repo-checkbox" data-proj="${proj.name}" ${proj.showRepo ? 'checked' : ''}/>
                <span>显示仓库链接</span>
              </label>
            </p>
          </div>
        </div>`;
            container.appendChild(col);
        });
        // 初始化输入框动画
        M.updateTextFields();
        // 启用拖放排序
        new Sortable(container, {
            animation: 150,
            onEnd: function() {
                // 更新优先级字段（按当前顺序重新编号）
                document.querySelectorAll('#projects-admin .col').forEach((col, idx) => {
                    const title = col.querySelector('.card-title').innerText;
                    const proj = projectsData.find(p => p.name === title);
                    if(proj) proj.priority = idx + 1;
                });
            }
        });
    });

// 加载日程数据并渲染
function renderSchedule() {
    const tbody = document.getElementById('schedule-admin');
    tbody.innerHTML = '';
    scheduleData.forEach((ev, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${ev.project}</td>
      <td>${new Date(ev.time).toLocaleString()}</td>
      <td>${ev.note}</td>
      <td>
        <button onclick="editScheduleItem(${idx})" class="btn-small">编辑</button>
        <button onclick="deleteScheduleItem(${idx})" class="btn-small red">删除</button>
      </td>`;
        tbody.appendChild(row);
    });
}

// 初次加载日程数据
fetch('..data/schedule.json')
    .then(res => res.json())
    .then(events => {
        scheduleData = events;
        // 填充项目下拉选择
        const sel = document.getElementById('new-proj-select');
        projectsData.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.innerText = p.name;
            sel.appendChild(opt);
        });
        M.FormSelect.init(sel);
        // 渲染列表
        renderSchedule();
    });

// 添加新日程项
function addScheduleItem() {
    const proj = document.getElementById('new-proj-select').value;
    const time = document.getElementById('new-event-time').value;
    const note = document.getElementById('new-event-note').value;
    if (proj && time) {
        scheduleData.push({ project: proj, time: new Date(time).toISOString(), note });
        renderSchedule();
    }
}

// 删除日程项
function deleteScheduleItem(idx) {
    scheduleData.splice(idx, 1);
    renderSchedule();
}

// 编辑日程项（简单示例：弹窗输入）
function editScheduleItem(idx) {
    const ev = scheduleData[idx];
    const newProj = prompt('项目名称', ev.project);
    const newTime = prompt('时间 (YYYY-MM-DD HH:mm)', ev.time.replace('T', ' ').slice(0,16));
    const newNote = prompt('备注', ev.note);
    if (newProj && newTime) {
        ev.project = newProj;
        ev.time = new Date(newTime).toISOString();
        ev.note = newNote;
        renderSchedule();
    }
}
