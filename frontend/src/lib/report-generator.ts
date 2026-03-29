import { format } from 'date-fns'

interface ReportData {
  project?: any
  sprint?: any
  sprints?: any[]
  userStories?: any[]
  tasks?: any[]
}

const formatDate = (iso: string) => {
  try {
    return format(new Date(iso), 'MMM dd, yyyy')
  } catch {
    return iso || 'N/A'
  }
}

export function generateHTMLReport(data: ReportData, type: 'Project' | 'Sprint') {
  const title = type === 'Project' 
      ? `Project Report: ${data.project?.title || 'Unknown Project'}`
      : `Sprint Report: ${data.sprint?.title || 'Unknown Sprint'}`

  const description = type === 'Project' ? data.project?.description : data.sprint?.goal

  const startDate = formatDate(type === 'Project' ? data.project?.startDate : data.sprint?.startDate)
  const endDate = formatDate(type === 'Project' ? data.project?.endDate : data.sprint?.endDate)

  let totalTasks = 0
  let completedTasks = 0
  let allTasks: any[] = []

  if (type === 'Project' && data.sprints) {
    data.sprints.forEach(sprint => {
      sprint.userStories?.forEach((us: any) => {
        us.tasks?.forEach((task: any) => {
          allTasks.push({ ...task, storyName: us.name, sprintName: sprint.name })
        })
      })
    })
  } else if (type === 'Sprint' && data.userStories) {
    data.userStories.forEach((us: any) => {
      us.tasks?.forEach((task: any) => {
        allTasks.push({ ...task, storyName: us.name })
      })
    })
  }

  totalTasks = allTasks.length
  completedTasks = allTasks.filter(t => t.status === 'Done').length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        h1 { color: #111; font-size: 28px; margin-bottom: 5px; }
        h2 { border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 40px; color: #222; font-size: 20px;}
        .meta-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
        .meta-item { margin-bottom: 8px; }
        .meta-label { font-weight: 600; color: #475569; width: 120px; display: inline-block; }
        
        .stats-grid { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-card { flex: 1; background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .stat-label { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        th, td { border: 1px solid #e2e8f0; padding: 12px 15px; text-align: left; }
        th { background-color: #f8fafc; font-weight: 600; color: #475569; }
        tr:nth-child(even) { background-color: #fcfcfc; }
        
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        
        .priority-high { background: #fee2e2; color: #b91c1c; }
        .priority-medium { background: #fef3c7; color: #b45309; }
        .priority-low { background: #dcfce3; color: #15803d; }
        
        .status-todo { background: #f1f5f9; color: #475569; }
        .status-inprogress { background: #dbeafe; color: #1d4ed8; }
        .status-standby { background: #fef08a; color: #854d0e; }
        .status-done { background: #dcfce3; color: #15803d; }
        
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body onload="window.print()">
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Print / Save as PDF</button>
      </div>
      
      <h1>${title}</h1>
      
      <div class="meta-container">
        <div class="meta-item"><span class="meta-label">Date Range:</span> ${startDate} to ${endDate}</div>
        ${description ? `<div class="meta-item" style="margin-top: 10px;"><span class="meta-label">Description:</span> <br/>${description.replace(/\\n/g, '<br/>')}</div>` : ''}
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${totalTasks}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${completedTasks}</div>
          <div class="stat-label">Completed Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${progress}%</div>
          <div class="stat-label">Overall Progress</div>
        </div>
      </div>
  `

  if (type === 'Project' && data.sprints && data.sprints.length > 0) {
    htmlContent += `
      <h2>Sprints Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Sprint Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Features (Stories)</th>
          </tr>
        </thead>
        <tbody>
          ${data.sprints.map(s => `
            <tr>
              <td><strong>${s.name}</strong></td>
              <td>${formatDate(s.startDate)}</td>
              <td>${formatDate(s.endDate)}</td>
              <td>${s.userStories?.length || 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  const storiesToRender = type === 'Project' 
    ? (data.sprints?.flatMap(s => s.userStories || []) || []) 
    : (data.userStories || [])

  if (storiesToRender.length > 0) {
    htmlContent += `
      <h2>User Stories</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Priority</th>
            <th>Points</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${storiesToRender.map(us => `
            <tr>
              <td><strong>${us.name}</strong><br/><span style="font-size: 12px; color: #64748b;">${us.description || ''}</span></td>
              <td><span class="badge priority-${us.priority?.toLowerCase()}">${us.priority || 'Medium'}</span></td>
              <td>${us.storyPointEstimate || '-'}</td>
              <td>${formatDate(us.dueDate)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  if (allTasks.length > 0) {
    htmlContent += `
      <h2 style="page-break-before: auto;">Task Backlog</h2>
      <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Belongs to Story</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          ${allTasks.map(t => `
            <tr>
              <td><strong>${t.title}</strong><br/><span style="font-size: 12px; color: #64748b;">${t.description || ''}</span></td>
              <td><span style="font-size: 13px;">${t.storyName || 'N/A'}</span></td>
              <td><span class="badge status-${t.status?.toLowerCase().replace(' ', '')}">${t.status || 'ToDo'}</span></td>
               <td><span class="badge priority-${t.priority?.toLowerCase()}">${t.priority || 'Medium'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  htmlContent += `
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
