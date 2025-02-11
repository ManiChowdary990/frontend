const API_BASE_URL = "https://social-media-backend-rio4.onrender.com";

// 🔹 Register a New User
async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        console.log("Registration Response:", data);
        alert(data.message || "Registered successfully!");
    } catch (error) {
        console.error("Registration Error:", error);
    }
}

// 🔹 Login User
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
        } else {
            alert("Login failed! " + data.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
}

// 🔹 Fetch and Display Posts
async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const posts = await response.json();
        const postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = "";
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.className = "post";
            postElement.innerHTML = `<h3>${post.author}</h3><p>${post.content}</p>`;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// 🔹 Create a New Post
async function createPost(content) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to create a post!");
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ content }),
        });
        const data = await response.json();
        console.log("Post Created:", data);
        alert("Post created successfully!");
        fetchPosts(); // Refresh posts
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

// 🔹 Real-Time Chat with WebSockets
const socket = io(API_BASE_URL);

socket.on("receive_message", (data) => {
    const chatContainer = document.getElementById("chat-container");
    const messageElement = document.createElement("p");
    messageElement.textContent = `${data.username}: ${data.message}`;
    chatContainer.appendChild(messageElement);
});

// 🔹 Send Chat Message
function sendMessage() {
    const username = localStorage.getItem("username") || "Anonymous";
    const message = document.getElementById("chat-message").value;
    if (message.trim() === "") return;
    socket.emit("send_message", { username, message });
    document.getElementById("chat-message").value = "";
}

// 🔹 Event Listeners
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
});

document.getElementById("register-btn").addEventListener("click", () => {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(username, email, password);
});

document.getElementById("post-btn").addEventListener("click", () => {
    const content = document.getElementById("post-content").value;
    createPost(content);
});

document.getElementById("send-btn").addEventListener("click", sendMessage);

// 🔹 Fetch Posts on Page Load
fetchPosts();
