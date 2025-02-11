document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://social-media-backend-a0so.onrender.com";

  // Handle Login
  const loginForm = document.querySelector(".login-container form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const username = loginForm.querySelector('input[type="text"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!username || !password) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/index.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Please try again later.");
      }
    });
  }

  // Handle Signup
  const signupForm = document.querySelector(".signup-container form");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.querySelector("#email").value;
      const fullName = document.querySelector("#fullName").value;
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

      if (!email || !fullName || !username || !password) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
          window.location.href = "login.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Error signing up. Try again.");
      }
    });
  }

  // Handle Logout
  const logoutButton = document.querySelector("#logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  // Fetch and display posts
  async function loadPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`);
      const posts = await response.json();

      const postsContainer = document.getElementById("postsContainer");
      postsContainer.innerHTML = ""; // Clear old posts before adding new ones

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
          <h3>${post.user.username}</h3>
          <p>${post.text}</p>
          ${post.image ? `<img src="${post.image}" width="300"/>` : ""}
          <button onclick="likePost('${post._id}')">❤️ Like</button>
          <button onclick="showComments('${post._id}')">💬 Comments</button>
          <div id="comments-${post._id}"></div>
        `;
        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }
  loadPosts(); // Call this function to load posts

  // Like a Post
  window.likePost = async function (postId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Post liked!");
        loadPosts(); // Reload posts to update likes
      } else {
        alert("Error liking post.");
      }
    } catch (error) {
      console.error("Like Post Error:", error);
    }
  };

  // Show Comments
  window.showComments = async function (postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`);
      const comments = await response.json();

      const commentsContainer = document.getElementById(`comments-${postId}`);
      commentsContainer.innerHTML = comments
        .map((c) => `<p>${c.user.username}: ${c.text}</p>`)
        .join("");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Real-time Chat
  const messageForm = document.querySelector("#sendMessageForm");
  const messageList = document.querySelector("#messageList");
  if (messageForm) {
    const socket = io(API_BASE_URL);

    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const receiverId = document.querySelector("#receiverId").value;
      const messageText = document.querySelector("#messageText").value;

      if (!receiverId || !messageText) {
        alert("Enter a valid message!");
        return;
      }

      socket.emit("send_message", { receiver: receiverId, message: messageText });
      document.querySelector("#messageText").value = "";
    });

    socket.on("receive_message", (data) => {
      const messageElement = document.createElement("div");
      messageElement.innerHTML = `<strong>${data.sender}:</strong> ${data.message}`;
      messageList.appendChild(messageElement);
    });
  }
});
