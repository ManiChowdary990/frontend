document.addEventListener("DOMContentLoaded", function () {
  // Handle the login form submission
  const loginForm = document.querySelector(".login-container form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent form from submitting normally

      const username = loginForm.querySelector('input[type="text"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!username || !password) {
        alert("Please fill out all fields.");
      } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
      } else {
        try {
          // Send login request to backend
          const response = await fetch("https://your-backend.onrender.com/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          if (data.message === "Login successful") {
            // Redirect to the main homepage after successful login
            window.location.href = "/index.html";
          } else {
            alert(data.message); // Show error message if login fails
          }
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          alert("Something went wrong. Please try again later.");
        }
      }
    });
  }

  // Handle the signup form submission
  const signupForm = document.querySelector(".signup-container form");

  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = signupForm.querySelector('input[type="email"]').value;
      const fullName = signupForm.querySelector('input[type="text"]').value;
      const username = signupForm.querySelectorAll('input[type="text"]')[1].value;
      const password = signupForm.querySelector('input[type="password"]').value;

      if (!email || !fullName || !username || !password) {
        alert("Please fill out all fields.");
      } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
      } else {
        // Email format validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
          alert("Please enter a valid email.");
          return;
        }

        try {
          // Send signup request to backend
          const response = await fetch("https://your-backend.onrender.com/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, fullName, username, password }),
          });

          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          if (data.message === "User registered successfully") {
            // Redirect to login page
            window.location.href = "/login.html";
          } else {
            alert(data.message); // Show error message if signup fails
          }
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          alert("Something went wrong. Please try again later.");
        }
      }
    });
  }

  // Handle dynamic loading of posts (example for homepage)
  const feed = document.querySelector(".feed");

  if (feed) {
    const posts = [
      {
        username: "user1",
        image: "https://via.placeholder.com/500",
        caption: "This is a sample post caption.",
      },
      {
        username: "user2",
        image: "https://via.placeholder.com/500",
        caption: "Another post here!",
      },
    ];

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      postElement.innerHTML = `
        <div class="post-header">
          <img src="https://via.placeholder.com/40" alt="Profile" class="profile-pic">
          <span class="username">${post.username}</span>
        </div>
        <img src="${post.image}" alt="Post Image" class="post-image">
        <div class="post-actions">
          <span>🤍</span>
          <span>💬</span>
          <span>📤</span>
        </div>
        <div class="post-caption">
          <strong>${post.username}</strong> ${post.caption}
        </div>
      `;

      feed.appendChild(postElement);
    });
  }

  // Handle dynamic loading of notifications
  const notificationsList = document.querySelector(".notifications-list");

  if (notificationsList) {
    const notifications = [
      {
        username: "user2",
        text: "liked your post.",
      },
      {
        username: "user3",
        text: "started following you.",
      },
    ];

    notifications.forEach((notification) => {
      const notificationElement = document.createElement("div");
      notificationElement.classList.add("notification");

      notificationElement.innerHTML = `
        <img src="https://via.placeholder.com/40" alt="Profile" class="profile-pic">
        <div>
          <strong>${notification.username}</strong> ${notification.text}
        </div>
      `;

      notificationsList.appendChild(notificationElement);
    });
  }

  // Like/Unlike Posts (frontend only)
  const likeButtons = document.querySelectorAll(".post-actions span");

  likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("liked");
      if (button.classList.contains("liked")) {
        button.textContent = "❤️"; // Liked
      } else {
        button.textContent = "🤍"; // Unliked
      }
    });
  });

  // Follow/Unfollow Users (frontend only)
  const followButtons = document.querySelectorAll(".suggestion button");

  followButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.textContent === "Follow") {
        button.textContent = "Unfollow";
        button.style.backgroundColor = "#dbdbdb";
        button.style.color = "#000";
      } else {
        button.textContent = "Follow";
        button.style.backgroundColor = "#0095f6";
        button.style.color = "#fff";
      }
    });
  });

  // Example of sending a post (create a post with title, description, and image)
  const postForm = document.querySelector("#postForm");

  if (postForm) {
    postForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.querySelector("#postTitle").value;
      const description = document.querySelector("#postDescription").value;
      const image = document.querySelector("#postImage").files[0];

      if (!title || !description || !image) {
        alert("Please fill out all fields and choose an image.");
        return;
      }

      // Validate the file type of the uploaded image
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(image.type)) {
        alert("Please upload a valid image (JPEG/PNG).");
        return;
      }

      // Prepare the form data for upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", image);

      try {
        const response = await fetch("https://your-backend.onrender.com/api/create_post", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.message === "Post created successfully") {
          alert("Post created successfully!");
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        alert("Something went wrong. Please try again later.");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://your-backend.onrender.com"; // Change this for deployment

  // Handle Login
  const loginForm = document.querySelector(".login-container form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

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
          localStorage.setItem("authToken", data.token); // Store Token
          window.location.href = "index.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("Error logging in. Try again.");
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
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  }

  // Handle Messages (Real-Time Chat)
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



document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("https://your-backend.onrender.com/api/posts");
  const posts = await response.json();

  const postsContainer = document.getElementById("postsContainer");
  posts.forEach(post => {
      const postElement = document.createElement("div");
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
});

// ✅ Like a Post
async function likePost(postId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://your-backend.onrender.com/api/posts/${postId}/like`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
  });

  if (response.ok) {
      alert("Post liked!");
  } else {
      alert("Error liking post.");
  }
}

// ✅ Show Comments
async function showComments(postId) {
  const response = await fetch(`https://your-backend.onrender.com/api/posts/${postId}/comments`);
  const comments = await response.json();

  const commentsContainer = document.getElementById(`comments-${postId}`);
  commentsContainer.innerHTML = comments.map(c => `<p>${c.user.username}: ${c.text}</p>`).join("");
}
