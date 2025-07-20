// 加载并渲染项目卡片
fetch('../data/projects.json')
    .then(res => res.json())
    .then(projects => {
        // 按优先级升序排列
        projects.sort((a, b) => a.priority - b.priority);
        const container = document.getElementById('projects-container');
        projects.forEach(proj => {
            // 创建卡片元素
            const col = document.createElement('div');
            col.className = 'col s12 m6';
            col.innerHTML = `
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">${proj.name}</span>
            <div class="progress"><div class="determinate" style="width:${proj.progress}%;"></div></div>
            ${proj.showRepo ? `<p><a href="${proj.repo}" target="_blank"><i class="material-icons left">code</i>仓库链接</a></p>` : ''}
            <p><small>最新提交：${proj.latestCommit || 'N/A'}</small></p>
          </div>
        </div>`;
            container.appendChild(col);
        });
    });

// 加载并渲染日程事件
fetch('../data/schedule.json')
    .then(res => res.json())
    .then(events => {
        // 遍历事件并添加到 FullCalendar
        events.forEach(ev => {
            window.fcCalendar.addEvent({
                title: ev.project,
                start: ev.time,
                extendedProps: { note: ev.note }
            });
        });
    });
