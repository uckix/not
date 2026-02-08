const STORAGE_KEY = "hackpath-data";
const USER_KEY = "hackpath-user";

const defaultData = {
  rooms: [
    {
      id: "intro",
      title: "Intro to Recon",
      level: "Beginner",
      description: "Learn basic recon steps, tools, and methodology.",
      tasks: [
        {
          id: "intro-1",
          prompt: "What port does HTTP run on by default?",
          answer: "80",
          points: 50,
        },
        {
          id: "intro-2",
          prompt: "What tool would you use for DNS enumeration?",
          answer: "dig",
          points: 75,
        },
      ],
    },
    {
      id: "web",
      title: "Web Exploitation",
      level: "Intermediate",
      description: "Practice common web attacks and defenses.",
      tasks: [
        {
          id: "web-1",
          prompt: "Name the HTTP verb used to update a resource.",
          answer: "put",
          points: 100,
        },
        {
          id: "web-2",
          prompt: "What does XSS stand for?",
          answer: "cross site scripting",
          points: 120,
        },
      ],
    },
    {
      id: "forensics",
      title: "Digital Forensics",
      level: "Advanced",
      description: "Analyze artifacts and recover evidence from systems.",
      tasks: [
        {
          id: "forensics-1",
          prompt: "Which file system is common on Linux?",
          answer: "ext4",
          points: 120,
        },
      ],
    },
  ],
  adminWhitelist: ["admin@hackpath.local"],
};

const loginModal = document.getElementById("login-modal");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginForm = document.getElementById("login-form");
const closeLogin = document.getElementById("close-login");
const roomsGrid = document.getElementById("rooms-grid");
const roomTemplate = document.getElementById("room-template");
const userPill = document.getElementById("user-pill");
const userName = document.getElementById("user-name");
const userPoints = document.getElementById("user-points");
const heroPoints = document.getElementById("hero-points");
const heroStart = document.getElementById("hero-start");
const heroBrowse = document.getElementById("hero-browse");

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

const loadUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

const normalizeAnswer = (answer) =>
  answer.trim().toLowerCase().replace(/\s+/g, " ");

const ensureProgress = (rooms, user) => {
  const progress = user.progress ?? {};
  rooms.forEach((room) => {
    if (!progress[room.id]) {
      progress[room.id] = {};
    }
    room.tasks.forEach((task) => {
      if (progress[room.id][task.id] === undefined) {
        progress[room.id][task.id] = false;
      }
    });
  });
  return progress;
};

const renderRooms = (rooms, user) => {
  roomsGrid.innerHTML = "";
  rooms.forEach((room) => {
    const fragment = roomTemplate.content.cloneNode(true);
    fragment.querySelector(".room-title").textContent = room.title;
    fragment.querySelector(".room-level").textContent = room.level;
    fragment.querySelector(".room-description").textContent = room.description;
    fragment.querySelector(".room-points").textContent = `${room.tasks.reduce(
      (sum, task) => sum + task.points,
      0
    )} pts`;
    fragment.querySelector(".room-tasks").textContent = `${room.tasks.length} tasks`;

    const taskList = fragment.querySelector(".task-list");
    room.tasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = "task";

      const taskHeader = document.createElement("div");
      taskHeader.className = "task-header";

      const prompt = document.createElement("strong");
      prompt.textContent = task.prompt;

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = `${task.points} pts`;

      taskHeader.append(prompt, badge);

      const status = document.createElement("div");
      status.className = "status";

      const form = document.createElement("form");
      form.innerHTML = `
        <input type="text" name="answer" placeholder="Your answer" required />
        <button type="submit">Submit</button>
      `;

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const userData = loadUser();
        if (!userData) {
          openLogin();
          return;
        }
        const formData = new FormData(form);
        const answer = normalizeAnswer(formData.get("answer"));
        const correct = answer === normalizeAnswer(task.answer);
        const progress = ensureProgress(rooms, userData);

        if (correct && !progress[room.id][task.id]) {
          progress[room.id][task.id] = true;
          userData.points += task.points;
          status.textContent = "Correct! Points added.";
          status.style.color = "var(--accent)";
        } else if (correct) {
          status.textContent = "Already completed. Try another task.";
          status.style.color = "var(--muted)";
        } else {
          status.textContent = "Incorrect, keep trying.";
          status.style.color = "var(--danger)";
        }

        userData.progress = progress;
        saveUser(userData);
        updateUserUi(userData);
        form.reset();
      });

      if (user && user.progress?.[room.id]?.[task.id]) {
        status.textContent = "Completed";
        status.style.color = "var(--accent)";
      } else {
        status.textContent = "Not started";
      }

      taskCard.append(taskHeader, status, form);
      taskList.append(taskCard);
    });

    roomsGrid.append(fragment);
  });
};

const updateUserUi = (user) => {
  if (user) {
    userName.textContent = user.name;
    userPoints.textContent = `${user.points} pts`;
    heroPoints.textContent = user.points;
    loginBtn.classList.add("hidden");
    userPill.classList.remove("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    userPill.classList.add("hidden");
    heroPoints.textContent = "0";
  }
};

const openLogin = () => {
  loginModal.classList.remove("hidden");
  loginModal.setAttribute("aria-hidden", "false");
};

const closeLoginModal = () => {
  loginModal.classList.add("hidden");
  loginModal.setAttribute("aria-hidden", "true");
};

loginBtn.addEventListener("click", openLogin);
closeLogin.addEventListener("click", closeLoginModal);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("display-name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  if (!name || !email) {
    return;
  }

  const user = {
    name,
    email,
    points: 0,
    progress: {},
  };

  const data = loadData();
  user.progress = ensureProgress(data.rooms, user);
  saveUser(user);
  updateUserUi(user);
  renderRooms(data.rooms, user);
  closeLoginModal();
});

logoutBtn.addEventListener("click", () => {
  clearUser();
  updateUserUi(null);
  renderRooms(loadData().rooms, null);
});

heroStart.addEventListener("click", () => {
  const user = loadUser();
  if (!user) {
    openLogin();
  } else {
    document.querySelector("#rooms").scrollIntoView({ behavior: "smooth" });
  }
});

heroBrowse.addEventListener("click", () => {
  document.querySelector("#rooms").scrollIntoView({ behavior: "smooth" });
});

const data = loadData();
const user = loadUser();
if (user) {
  user.progress = ensureProgress(data.rooms, user);
  saveUser(user);
}
updateUserUi(user);
renderRooms(data.rooms, user);
