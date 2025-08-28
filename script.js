const userContainer = document.getElementById("users_data");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");

const API_URL = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "Bearer 766e34c462deab3c81680017006289c59bd61183968dc098f2969594b52a4bd0";

let isEditMode = false;

// Fetch all users
function fetchAllUsers() {
  fetch(API_URL, {
    method: "GET",
    headers: { Authorization: TOKEN },
  })
    .then((response) => response.json())
    .then((users) => {
      userContainer.innerHTML = "";

      users.forEach((user) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <p><b>ID:</b> ${user.id}</p>
          <p><b>Name:</b> ${user.name}</p>
          <p><b>Email:</b> ${user.email}</p>
          <p><b>Gender:</b> ${user.gender}</p>
          <p><b>Status:</b> ${user.status}</p>
          <div class="card-btns">
            <button class="edit-btn" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.gender}', '${user.status}')">Edit</button>
            <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
          </div>
        `;

        userContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Save or Update User
function saveUser() {
  const id = document.getElementById("user_id").value;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const gender = document.getElementById("gender").value;
  const status = document.getElementById("status").value;

  if (!name || !email) {
    alert("Please enter both Name and Email!");
    return;
  }

  const user = { name, email, gender, status };

  // If edit mode, update user, else add new user
  if (isEditMode) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("User updated successfully!");
        resetForm();
        fetchAllUsers();
      })
      .catch((error) => console.error("Error updating user:", error));
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          alert("User added successfully!");
          resetForm();
          fetchAllUsers();
        } else {
          alert("Failed to add user: " + JSON.stringify(data));
        }
      })
      .catch((error) => console.error("Error adding user:", error));
  }
}

// Edit User - Fill form for update
function editUser(id, name, email, gender, status) {
  document.getElementById("user_id").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("gender").value = gender;
  document.getElementById("status").value = status;

  formTitle.textContent = "Update User";
  saveBtn.textContent = "Update User";
  cancelBtn.style.display = "inline-block";
  isEditMode = true;
}

// Reset form to default mode
function resetForm() {
  document.getElementById("user_id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("gender").value = "male";
  document.getElementById("status").value = "active";

  formTitle.textContent = "Add New User";
  saveBtn.textContent = "Add User";
  cancelBtn.style.display = "none";
  isEditMode = false;
}

// Delete User
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: TOKEN },
    })
      .then(() => {
        alert("User deleted successfully!");
        fetchAllUsers();
      })
      .catch((error) => console.error("Error deleting user:", error));
  }
}

// Initial fetch
fetchAllUsers();
