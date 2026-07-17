// BirthdayHub App v1.0 - JavaScript Completo
'use strict';

// === BASE DE DATOS LOCAL ===
const DB = {
  people: [],
  gifts: [],
  wishlist: [],
  settings: { theme: 'light' }
};

const STORAGE_KEYS = {
  people: 'birthdayhub_people',
  gifts: 'birthdayhub_gifts',
  wishlist: 'birthdayhub_wishlist',
  settings: 'birthdayhub_settings'
};

let currentView = 'dashboard';
let editingPersonId = null;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// === FUNCIONES DE ALMACENAMIENTO ===
function loadData() {
  try {
    DB.people = JSON.parse(localStorage.getItem(STORAGE_KEYS.people) || '[]');
    DB.gifts = JSON.parse(localStorage.getItem(STORAGE_KEYS.gifts) || '[]');
    DB.wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
    DB.settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{"theme":"light"}');
  } catch (e) {
    console.error('Error cargando datos:', e);
    showToast('Error al cargar datos', 'error');
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.people, JSON.stringify(DB.people));
    localStorage.setItem(STORAGE_KEYS.gifts, JSON.stringify(DB.gifts));
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(DB.wishlist));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(DB.settings));
  } catch (e) {
    console.error('Error guardando datos:', e);
    showToast('Error al guardar', 'error');
  }
}

// === UTILIDADES ===
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show ' + (type || '');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Corrección #1 aplicada aquí: parsear fecha YYYY-MM-DD
function calculateAge(birthdate) {
  const [year, month, day] = birthdate.split('-');
  const today = new Date();
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function daysUntilBirthday(birthdate) {
  const [year, month, day] = birthdate.split('-');
  const today = new Date();
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diff = nextBirthday - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function getUpcomingBirthdays(maxDays) {
  return DB.people
    .map(p => ({
      ...p,
      age: calculateAge(p.birthdate),
      daysUntil: daysUntilBirthday(p.birthdate)
    }))
    .filter(p => p.daysUntil <= maxDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

// === INICIALIZACIÓN ===
function initApp() {
  loadData();
  applyTheme(DB.settings.theme);
  setupEventListeners();
  renderView();
  updatePeopleCount();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const thumb = document.getElementById('themeThumb');
  const label = document.getElementById('themeLabel');
  if (thumb) thumb.classList.toggle('dark', theme === 'dark');
  if (label) label.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  // Menu móvil
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  
  document.getElementById('sidebarClose')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
  });

  // Tema
  document.getElementById('themePill')?.addEventListener('click', toggleTheme);

  // Botones principales
  document.getElementById('addPersonBtn')?.addEventListener('click', () => openPersonModal());
  document.getElementById('exportBtn')?.addEventListener('click', exportData);
  document.getElementById('importBtn')?.addEventListener('click', importData);

  // Modales Personas
  document.getElementById('closeModal')?.addEventListener('click', closePersonModal);
  document.getElementById('cancelModal')?.addEventListener('click', closePersonModal);
  document.getElementById('personForm')?.addEventListener('submit', savePersonForm);

  // Modales Regalos
  document.getElementById('closeGiftModal')?.addEventListener('click', closeGiftModal);
  document.getElementById('cancelGiftModal')?.addEventListener('click', closeGiftModal);
  document.getElementById('giftForm')?.addEventListener('submit', saveGiftForm);

  // Modales Wishlist
  document.getElementById('closeWishModal')?.addEventListener('click', closeWishModal);
  document.getElementById('cancelWishModal')?.addEventListener('click', closeWishModal);
  document.getElementById('wishForm')?.addEventListener('submit', saveWishForm);

  // Navegación
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      const view = e.currentTarget.getAttribute('data-view');
      if (view) switchView(view);
    });
  });
}

function toggleTheme() {
  const newTheme = DB.settings.theme === 'dark' ? 'light' : 'dark';
  DB.settings.theme = newTheme;
  applyTheme(newTheme);
  saveData();
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');
  document.getElementById('topbarTitle').textContent = view.charAt(0).toUpperCase() + view.slice(1);
  renderView();
}

// === RENDERIZADO ===
function renderView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  switch (currentView) {
    case 'dashboard':
      container.innerHTML = renderDashboard();
      break;
    case 'calendar':
      container.innerHTML = renderCalendar();
      setupCalendarNav();
      break;
    case 'people':
      container.innerHTML = renderPeople();
      break;
    case 'gifts':
      container.innerHTML = renderGifts();
      break;
    case 'wishlist':
      container.innerHTML = renderWishlist();
      break;
    case 'ai':
      container.innerHTML = renderAI();
      break;
    case 'messages':
      container.innerHTML = renderMessages();
      break;
    case 'settings':
      container.innerHTML = renderSettings();
      break;
    default:
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-text">${currentView}</div>
          <div class="empty-state-subtext">Próximamente...</div>
        </div>
      `;
  }
}

function renderDashboard() {
  const upcoming = getUpcomingBirthdays(30);
  const stats = {
    total: DB.people.length,
    today: upcoming.filter(p => p.daysUntil === 0).length,
    week: upcoming.filter(p => p.daysUntil <= 7).length,
    gifts: DB.gifts.length
  };

  return `
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Dashboard</div>
          <div class="panel-subtitle">Resumen general de cumpleaños</div>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
        <div class="stat-card">
          <div class="stat-label">Total Personas</div>
          <div class="stat-value">${stats.total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Cumpleaños Hoy</div>
          <div class="stat-value">${stats.today}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Próximos 7 días</div>
          <div class="stat-value">${stats.week}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Regalos Registrados</div>
          <div class="stat-value">${stats.gifts}</div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Próximos Cumpleaños</div>
      </div>
      ${upcoming.length ? `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Persona</th>
                <th>Edad</th>
                <th>Fecha</th>
                <th>Días Restantes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${upcoming.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.age} años</td>
                  <td>${formatDate(p.birthdate)}</td>
                  <td>
                    <span class="badge ${
                      p.daysUntil <= 3 ? 'badge-danger' : 
                      p.daysUntil <= 7 ? 'badge-warning' : 'badge-info'
                    }">
                      ${p.daysUntil === 0 ? 'HOY' : p.daysUntil + ' días'}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-ghost" onclick="editPerson('${p.id}')">Editar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">🎂</div>
          <div class="empty-state-text">No hay cumpleaños próximos</div>
          <div class="empty-state-subtext">Agrega personas para comenzar</div>
        </div>
      `}
    </div>
  `;
}

function renderCalendar() {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return `
    <div class="panel">
      <div class="calendar-view">
        <div class="calendar-header">
          <div class="calendar-nav">
            <button class="btn btn-icon" id="prevMonth" title="Mes anterior">◀</button>
            <button class="btn btn-icon" id="nextMonth" title="Mes siguiente">▶</button>
            <button class="btn btn-ghost" id="todayBtn">Hoy</button>
          </div>
          <div class="calendar-month">${monthNames[currentMonth]} ${currentYear}</div>
          <div></div>
        </div>
        ${buildCalendarGrid()}
      </div>
    </div>
  `;
}

function buildCalendarGrid() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  let html = '<div class="calendar-grid"><div class="calendar-weekdays">';
  ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(d => {
    html += `<div class="calendar-weekday">${d}</div>`;
  });
  html += '</div><div class="calendar-body">';

  // Días vacíos
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day"></div>';
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isToday = date.toDateString() === today.toDateString();
    
    const birthdays = DB.people.filter(p => {
      const [year, month, bday] = p.birthdate.split('-');
      const bdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(bday));
      return bdate.getMonth() === currentMonth && bdate.getDate() === day;
    });

    html += `<div class="calendar-day${isToday ? ' today' : ''}">`;
    html += `<div class="calendar-day-number">${day}</div>`;
    
    birthdays.forEach(p => {
      const ageNext = calculateAge(p.birthdate) + 1;
      html += `<div class="calendar-event" title="${p.name} cumple ${ageNext} años">${p.name}</div>`;
    });
    
    html += '</div>';
  }

  html += '</div></div>';
  return html;
}

function setupCalendarNav() {
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderView();
  });

  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderView();
  });

  document.getElementById('todayBtn')?.addEventListener('click', () => {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    renderView();
  });
}

function renderPeople() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Gestión de Personas</div>
          <div class="panel-subtitle">CRUD completo</div>
        </div>
        <button class="btn btn-primary" onclick="openPersonModal()">➕ Nueva persona</button>
      </div>
      ${DB.people.length ? `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Cumpleaños</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${DB.people.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${calculateAge(p.birthdate)}</td>
                  <td>${formatDate(p.birthdate)}</td>
                  <td><span class="badge badge-info">${p.category || 'Sin categoría'}</span></td>
                  <td>
                    <button class="btn btn-ghost" onclick="editPerson('${p.id}')">Editar</button>
                    <button class="btn btn-ghost" onclick="deletePerson('${p.id}')">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-text">No hay personas registradas</div>
          <div class="empty-state-subtext">Haz clic en "Nueva persona" para comenzar</div>
          <button class="btn btn-primary" onclick="openPersonModal()">➕ Agregar primera persona</button>
        </div>
      `}
    </div>
  `;
}

function renderGifts() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div><div class="panel-title">Historial de Regalos</div></div>
        <button class="btn btn-primary" onclick="openGiftModal()">➕ Registrar regalo</button>
      </div>
      ${DB.gifts.length ? `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Regalo</th>
                <th>Persona</th>
                <th>Costo</th>
                <th>Fecha</th>
                <th>Valoración</th>
              </tr>
            </thead>
            <tbody>
              ${DB.gifts.map(g => {
                const person = DB.people.find(p => p.id === g.personId);
                return `
                  <tr>
                    <td><strong>${g.title}</strong></td>
                    <td>${person ? person.name : 'Desconocido'}</td>
                    <td>S/ ${g.cost || 0}</td>
                    <td>${formatDate(g.date)}</td>
                    <td>${'⭐'.repeat(g.rating || 3)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">🎁</div>
          <div class="empty-state-text">No hay regalos registrados</div>
        </div>
      `}
    </div>
  `;
}

function renderWishlist() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div><div class="panel-title">Wishlist</div></div>
        <button class="btn btn-primary" onclick="openWishModal()">➕ Agregar deseo</button>
      </div>
      ${DB.wishlist.length ? `
        <div class="grid">
          ${DB.wishlist.map(w => {
            const person = DB.people.find(p => p.id === w.personId);
            return `
              <div class="card">
                <h4>${w.title}</h4>
                <p>Para: ${person ? person.name : '?'}</p>
                <p>Estimado: S/ ${w.estimate || 0}</p>
                <span class="badge badge-${
                  w.priority === 'alta' ? 'danger' : 
                  w.priority === 'media' ? 'warning' : 'info'
                }">${w.priority || 'media'}</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-text">Wishlist vacía</div>
        </div>
      `}
    </div>
  `;
}

function renderAI() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Sugerencias IA</div>
          <div class="panel-subtitle">Análisis inteligente de gustos</div>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">🤖</div>
        <div class="empty-state-text">Funcionalidad IA</div>
        <div class="empty-state-subtext">Esta sección analizará gustos, historial y sugerirá regalos personalizados</div>
      </div>
    </div>
  `;
}

function renderMessages() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div><div class="panel-title">Mensajes Automáticos</div></div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">📧</div>
        <div class="empty-state-text">Mensajes IA</div>
        <div class="empty-state-subtext">Genera mensajes personalizados para cada cumpleaños</div>
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="panel">
      <div class="panel-header">
        <div><div class="panel-title">Configuración</div></div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Tema</label>
          <select onchange="changeTheme(this.value)">
            <option value="light" ${DB.settings.theme === 'light' ? 'selected' : ''}>Claro</option>
            <option value="dark" ${DB.settings.theme === 'dark' ? 'selected' : ''}>Oscuro</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function changeTheme(theme) {
  DB.settings.theme = theme;
  applyTheme(theme);
  saveData();
}

// === CRUD PERSONAS ===
function openPersonModal(id = null) {
  editingPersonId = id;
  const modal = document.getElementById('personModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('personForm');
  
  title.textContent = id ? 'Editar Persona' : 'Nueva Persona';
  form?.reset();

  if (id) {
    const person = DB.people.find(p => p.id === id);
    if (person) {
      document.getElementById('pName').value = person.name || '';
      document.getElementById('pBirthdate').value = person.birthdate || '';
      document.getElementById('pCategory').value = person.category || 'familia';
      document.getElementById('pPhone').value = person.phone || '';
      document.getElementById('pEmail').value = person.email || '';
      document.getElementById('pBudget').value = person.budget || '';
      document.getElementById('pNotes').value = person.notes || '';
      document.getElementById('pTags').value = (person.tags || []).join(', ');
      
      document.querySelectorAll('.reminder-check').forEach(cb => {
        cb.checked = (person.reminders || []).includes(cb.value);
      });
    }
  }

  modal?.classList.add('active');
}

function closePersonModal() {
  document.getElementById('personModal')?.classList.remove('active');
  editingPersonId = null;
}

function savePersonForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('pName').value.trim();
  const birthdate = document.getElementById('pBirthdate').value;

  // Corrección #3: validar nombre solo letras
  if (!name) {
    showToast('El nombre es obligatorio', 'error');
    return;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(name)) {
    showToast('El nombre solo puede contener letras', 'error');
    return;
  }

  if (!birthdate) {
    showToast('La fecha de nacimiento es obligatoria', 'error');
    return;
  }

  // Corrección #2: validar fecha no futura
  const [y, m, d] = birthdate.split('-');
  const fechaNac = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaNac > hoy) {
    showToast('La fecha de nacimiento no puede ser futura', 'error');
    return;
  }

  const person = {
    id: editingPersonId || 'p_' + Date.now(),
    name,
    birthdate,
    category: document.getElementById('pCategory').value,
    phone: document.getElementById('pPhone').value,
    email: document.getElementById('pEmail').value,
    budget: document.getElementById('pBudget').value,
    notes: document.getElementById('pNotes').value,
    tags: document.getElementById('pTags').value.split(',').map(t => t.trim()).filter(Boolean),
    reminders: Array.from(document.querySelectorAll('.reminder-check:checked')).map(cb => cb.value)
  };

  if (editingPersonId) {
    DB.people = DB.people.map(p => p.id === editingPersonId ? person : p);
  } else {
    DB.people.push(person);
  }

  saveData();
  updatePeopleCount();
  showToast(editingPersonId ? 'Persona actualizada' : 'Persona agregada');
  closePersonModal();
  renderView();
}

function editPerson(id) {
  openPersonModal(id);
}

function deletePerson(id) {
  if (!confirm('¿Seguro que deseas eliminar esta persona?')) return;
  
  DB.people = DB.people.filter(p => p.id !== id);
  DB.gifts = DB.gifts.filter(g => g.personId !== id);
  DB.wishlist = DB.wishlist.filter(w => w.personId !== id);
  
  saveData();
  updatePeopleCount();
  showToast('Persona eliminada');
  renderView();
}

function updatePeopleCount() {
  const badge = document.getElementById('nav-people-count');
  if (badge) badge.textContent = DB.people.length;
}

// === CRUD REGALOS ===
function openGiftModal() {
  const modal = document.getElementById('giftModal');
  const select = document.getElementById('gPersonId');
  
  select.innerHTML = DB.people.length
    ? DB.people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')
    : '<option>No hay personas</option>';
  
  document.getElementById('giftForm')?.reset();
  modal?.classList.add('active');
}

function closeGiftModal() {
  document.getElementById('giftModal')?.classList.remove('active');
}

function saveGiftForm(e) {
  e.preventDefault();
  
  const gift = {
    id: 'g_' + Date.now(),
    personId: document.getElementById('gPersonId').value,
    title: document.getElementById('gTitle').value.trim(),
    cost: document.getElementById('gCost').value,
    store: document.getElementById('gStore').value,
    date: document.getElementById('gDate').value || new Date().toISOString().split('T')[0],
    rating: document.getElementById('gRating').value,
    notes: document.getElementById('gNotes').value
  };

  if (!gift.title) {
    showToast('Título del regalo requerido', 'error');
    return;
  }

  DB.gifts.push(gift);
  saveData();
  showToast('Regalo registrado');
  closeGiftModal();
  renderView();
}

// === CRUD WISHLIST ===
function openWishModal() {
  const modal = document.getElementById('wishModal');
  const select = document.getElementById('wPersonId');
  
  select.innerHTML = DB.people.length
    ? DB.people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')
    : '<option>No hay personas</option>';
  
  document.getElementById('wishForm')?.reset();
  modal?.classList.add('active');
}

function closeWishModal() {
  document.getElementById('wishModal')?.classList.remove('active');
}

function saveWishForm(e) {
  e.preventDefault();
  
  const wish = {
    id: 'w_' + Date.now(),
    personId: document.getElementById('wPersonId').value,
    title: document.getElementById('wTitle').value.trim(),
    estimate: document.getElementById('wEstimate').value,
    link: document.getElementById('wLink').value,
    priority: document.getElementById('wPriority').value
  };

  if (!wish.title) {
    showToast('Título requerido', 'error');
    return;
  }

  DB.wishlist.push(wish);
  saveData();
  showToast('Agregado a wishlist');
  closeWishModal();
  renderView();
}

// === IMPORT/EXPORT ===
function exportData() {
  const data = JSON.stringify({
    people: DB.people,
    gifts: DB.gifts,
    wishlist: DB.wishlist
  }, null, 2);
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `birthdayhub_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Datos exportados');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        DB.people = data.people || [];
        DB.gifts = data.gifts || [];
        DB.wishlist = data.wishlist || [];
        saveData();
        updatePeopleCount();
        showToast('Datos importados');
        renderView();
      } catch (err) {
        showToast('Error al importar archivo', 'error');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// === FUNCIONES GLOBALES ===
window.editPerson = editPerson;
window.deletePerson = deletePerson;
window.openPersonModal = openPersonModal;
window.openGiftModal = openGiftModal;
window.openWishModal = openWishModal;
window.changeTheme = changeTheme;

// === INICIO ===
document.addEventListener('DOMContentLoaded', initApp);
