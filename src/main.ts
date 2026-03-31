import "./style.css";

// const input = document.getElementById("taskInput") as HTMLInputElement;
// const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
// const taskList = document.getElementById("taskList") as HTMLUListElement;

// type Task = {
//   id: number;
//   title: string;
//   completed: boolean;
// };

// let tasks: Task[] = [];
// let currentFilter: "all" | "active" | "completed" = "all";

// function addTask(title: string): void {
//   const newTask: Task = {
//     id: Date.now(),
//     title,
//     completed: false,
//   };

//   tasks.push(newTask);
// }

// function toggleTask(id: number): void {
//   tasks = tasks.map((task) =>
//     task.id === id ? { ...task, completed: !task.completed } : task,
//   );

//   renderTasks(getFilteredTasks());
// }

// function deleteTask(id: number): void {
//   tasks = tasks.filter((task) => task.id !== id);
//   renderTasks(getFilteredTasks());
// }

// function getFilteredTasks(): Task[] {
//   if (currentFilter === "active") {
//     return tasks.filter((t) => !t.completed);
//   }

//   if (currentFilter === "completed") {
//     return tasks.filter((t) => t.completed);
//   }

//   return tasks;
// }

// function renderTasks(taskData: Task[]): void {
//   taskList.innerHTML = "";

//   taskData.forEach((task) => {
//     const li = document.createElement("li");
//     li.className = "task";

//     if (task.completed) {
//       li.classList.add("completed");
//     }

//     li.innerHTML = `
//       <span>${task.title}</span>
//       <button>Delete</button>
//     `;

//     li.addEventListener("click", () => {
//       toggleTask(task.id);
//     });

//     const deleteBtn = li.querySelector("button")!;
//     deleteBtn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       deleteTask(task.id);
//     });

//     taskList.appendChild(li);
//   });
// }

// addBtn.addEventListener("click", () => {
//   const title = input.value.trim();
//   if (!title) return;

//   addTask(title);
//   renderTasks(getFilteredTasks());

//   input.value = "";
// });

// const filterButtons =
//   document.querySelectorAll<HTMLButtonElement>(".filters button");

// filterButtons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     currentFilter = btn.dataset.filter as "all" | "active" | "completed";
//     renderTasks(getFilteredTasks());
//   });
// });

// renderTasks(getFilteredTasks());

////////////////////////////////////////////////////////
// User Dashboard

type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

type ApiSuccess<T> = {
  status: "success";
  data: T;
};

type ApiError = {
  status: "error";
  error: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

const fakeUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@mail.com", isActive: true },
  { id: 2, name: "Bob", email: "bob@mail.com", isActive: false },
  { id: 3, name: "Charlie", email: "charlie@mail.com", isActive: true },
];

function getUsers(): Promise<ApiResponse<User[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: fakeUsers,
      });
    }, 1000);
  });
}

function getUser(id: number): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = fakeUsers.find((u) => u.id === id);

      if (!user) {
        resolve({
          status: "error",
          error: "User not found",
        });
        return;
      }

      resolve({
        status: "success",
        data: user,
      });
    }, 800);
  });
}

const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;
const userList = document.getElementById("userList") as HTMLUListElement;
const userDetails = document.getElementById("userDetails") as HTMLDivElement;

let selectedUserId: number | null = null;

function setLoading(message: string = "Loading...") {
  statusDiv.className = "status loading";
  statusDiv.textContent = message;
}

function setError(message: string) {
  statusDiv.className = "status error";
  statusDiv.textContent = message;
}

function clearStatus() {
  statusDiv.className = "status";
  statusDiv.textContent = "";
}

function renderUsers(users: User[]) {
  userList.innerHTML = "";

  if (users.length === 0) {
    userList.innerHTML = "<li>No users found</li>";
    return;
  }

  users.forEach((user) => {
    const li = document.createElement("li");

    li.textContent = `${user.name} (${user.email})`;

    li.dataset.id = user.id.toString();

    if (user.id === selectedUserId) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      handleUserClick(user.id);
    });

    userList.appendChild(li);
  });
}

function renderUserDetails(user: User) {
  userDetails.innerHTML = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Status:</strong> ${
      user.isActive ? "Active ✅" : "Inactive ❌"
    }</p>
  `;
}

function clearUserDetails() {
  userDetails.innerHTML = "<p>Select a user to see details</p>";
}

async function handleLoadUsers() {
  setLoading("Loading users...");

  const response = await getUsers();

  if (response.status === "error") {
    setError(response.error);
    return;
  }

  clearStatus();
  renderUsers(response.data);
}

async function handleUserClick(id: number) {
  selectedUserId = id;

  setLoading("Loading user details...");

  const response = await getUser(id);

  if (response.status === "error") {
    setError(response.error);
    return;
  }

  clearStatus();

  renderUsers(fakeUsers);
  renderUserDetails(response.data);
}

loadBtn.addEventListener("click", handleLoadUsers);

clearUserDetails();
