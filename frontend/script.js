const signupForm = document.getElementById("signup-form")
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()
      if (res.ok) {
        // Save email for OTP verification
        localStorage.setItem("tempUser", JSON.stringify(data.tempUser))
        showOTPModal();
      } else {
        alert(data.message || "Signup failed")
      }
    } catch (err) {
      alert("Error connecting to server")
    }
  })
}


// script.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form'); // The login form
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const loginButton = document.querySelector('.auth-btn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value;
    const password = passwordInput.value;

    // Simple validation
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }

    try {
      // Send POST request to the backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);
        const redirectPage = localStorage.getItem("redirectAfterLogin") || "/index.html";
        // Successful login, redirect to dashboard or home
        window.location.href = redirectPage;
      } else {
        // Show error message if login failed
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});


// Password strength indicator could be added here
const passwordInput = document.getElementById("password")
if (passwordInput) {
  passwordInput.addEventListener("input", function () {
    // Simple password strength check
    const password = this.value
    // Add password strength logic here if needed
  })
}

// Confirm password validation
const confirmPasswordInput = document.getElementById("confirm-password")
if (confirmPasswordInput) {
  confirmPasswordInput.addEventListener("input", function () {
    const password = document.getElementById("password").value
    const confirmPassword = this.value

    if (password !== confirmPassword) {
      this.setCustomValidity("Passwords do not match")
    } else {
      this.setCustomValidity("")
    }
  })
}

function showOTPModal() {
  const modal = document.getElementById("otpModal")
  modal.style.display = "block"

  document.querySelector(".modal .close").onclick = () => {
    modal.style.display = "none"
  }

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }

  document.getElementById("verifyOtpBtn").onclick = async () => {
    const otp = document.getElementById("otpInput").value;
    const tempUser = JSON.parse(localStorage.getItem("tempUser"));

    if (!tempUser) {
      alert("Session expired. Please sign up again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: tempUser.username,
          email: tempUser.email,
          password: tempUser.password,
          otp
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Email verified! You can now log in.");
        localStorage.removeItem("tempUser");
        window.location.href = "login.html";
      } else {
        document.getElementById("otpError").innerText = data.message || "Invalid OTP";
      }
    } catch (err) {
      document.getElementById("otpError").innerText = "Server error";
    }
  };
}

window.onload = () => {
    const usernameElement = document.getElementById("username");
    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutLink");
    const accountIcon = document.getElementById("accountIcon");

    // Check if the user is logged in
    const username = localStorage.getItem("userEmail");  // Or use any user data you saved
    if (username) {
        // Update the UI to show username and sign out link
        usernameElement.textContent = username; // Show username
        loginLink.style.display = "none";  // Hide login link
        signupLink.style.display = "none"; // Hide sign-up link
        logoutLink.style.display = "inline"; // Show logout link

        // Add event listener for the logout link
        logoutLink.addEventListener('click', () => {
            localStorage.removeItem("userEmail"); // Remove user details from localStorage
            localStorage.removeItem("token"); // Optionally remove token or any other data
            window.location.href = "login.html"; // Redirect to login page
        });
    } else {
        // If user is not logged in, show login and sign-up links
        loginLink.style.display = "inline";
        signupLink.style.display = "inline";
        logoutLink.style.display = "none";
    }
};

