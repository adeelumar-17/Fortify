// Add event listeners when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Form validation for login and signup
  const loginForm = document.querySelector(".auth-form form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Here you would typically handle form submission with AJAX
      // For now, we'll just show an alert
      alert("Form submitted successfully!")
    })
  }

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
})


