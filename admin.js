const STORAGE_KEY = "hackpath-data";
const USER_KEY = "hackpath-user";
const ADMIN_KEY = "hackpath-admin";

const defaultData = {
  rooms: [],
  adminWhitelist: ["admin@hackpath.local"],
};

const adminGate = document.getElementById("admin-gate");
const adminPanel = document.getElementById("admin-panel");
const adminLogin = document.getElementById("admin-login");
const adminError = document.getElementById("admin-error");
const adminLogout = document.getElementById("admin-logout");
const whitelistForm = document.getElementById("whitelist-form");
const whitelistEmail = document.getElementById("whitelist-email");
const whitelistList = document.getElementById("whitelist");
const roomForm = document.getElementById("room-form");
const roomTitle = document.getElementById("room-title");
const roomLevel = document.getElementById("room-level");
const roomDescription = document.getElementById("room-description");
const taskForm = document.getElementById("task-form");
const taskRoom = document.getElementById("task-room");
const taskPrompt = document.getElementById("task-prompt");
const taskAnswer = document.getElementById("task-answer");
const taskPoints = document.getElementById("task-points");
const roomList = document.getElementById("room-list");

const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const saveAdmin = (admin) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

const loadAdmin = () => {
  const stored = localStorage.getItem(ADMIN_KEY);
  return stored ? JSON.parse(stored) : null;
};

const clearAdmin = () => {
  localStorage.removeItem(ADMIN_KEY);
};

const renderWhitelist = (data) => {
  whitelistList.innerHTML = "";
  data.adminWhitelist.forEach((email) => {
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <span>${email}</span>
      <button class="ghost-btn" data-email="${email}">Remove</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      data.adminWhitelist = data.adminWhitelist.filter(
        (entry) => entry !== email
      );
      saveData(data);
      renderWhitelist(data);
    });
    whitelistList.append(row);
  });
};

const renderRooms = (data) => {
  taskRoom.innerHTML = "";
  roomList.innerHTML = "";
  data.rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = room.title;
    taskRoom.append(option);

    const roomItem = document.createElement("div");
    roomItem.className = "admin-item";
    const taskCount = room.tasks.length;
    roomItem.innerHTML = `
      <div>
        <strong>${room.title}</strong>
        <div class="badge">${taskCount} tasks</div>
      </div>
      <button class="ghost-btn" data-room="${room.id}">Delete</button>
    `;
    roomItem.querySelector("button").addEventListener("click", () => {
      data.rooms = data.rooms.filter((entry) => entry.id !== room.id);
      saveData(data);
      renderRooms(data);
    });
    roomList.append(roomItem);
  });
};

const showAdminPanel = (admin) => {
  adminGate.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  adminError.classList.add("hidden");
  adminLogout.classList.remove("hidden");
  document.title = `HackPath Admin - ${admin.name}`;
};

const showAdminGate = () => {
  adminGate.classList.remove("hidden");
  adminPanel.classList.add("hidden");
  adminLogout.classList.add("hidden");
};

adminLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("admin-email").value.trim().toLowerCase();
  const name = document.getElementById("admin-name").value.trim();
  const data = loadData();
  if (!data.adminWhitelist.includes(email)) {
    adminError.classList.remove("hidden");
    return;
  }
  const admin = { name, email };
  saveAdmin(admin);
  showAdminPanel(admin);
});

adminLogout.addEventListener("click", () => {
  clearAdmin();
  showAdminGate();
});

whitelistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = whitelistEmail.value.trim().toLowerCase();
  if (!email) {
    return;
  }
  const data = loadData();
  if (!data.adminWhitelist.includes(email)) {
    data.adminWhitelist.push(email);
    saveData(data);
    renderWhitelist(data);
  }
  whitelistEmail.value = "";
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = loadData();
  const newRoom = {
    id: `room-${Date.now()}`,
    title: roomTitle.value.trim(),
    level: roomLevel.value,
    description: roomDescription.value.trim(),
    tasks: [],
  };
  if (!newRoom.title || !newRoom.description) {
    return;
  }
  data.rooms.push(newRoom);
  saveData(data);
  roomTitle.value = "";
  roomDescription.value = "";
  renderRooms(data);
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = loadData();
  const room = data.rooms.find((entry) => entry.id === taskRoom.value);
  if (!room) {
    return;
  }
  room.tasks.push({
    id: `task-${Date.now()}`,
    prompt: taskPrompt.value.trim(),
    answer: taskAnswer.value.trim(),
    points: Number(taskPoints.value),
  });
  saveData(data);
  taskPrompt.value = "";
  taskAnswer.value = "";
  taskPoints.value = "";
  renderRooms(data);
});

const boot = () => {
  const data = loadData();
  renderWhitelist(data);
  renderRooms(data);
  const admin = loadAdmin();
  if (admin) {
    showAdminPanel(admin);
  } else {
    showAdminGate();
  }
};

boot();
