(function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const errorMessage = document.getElementById("errorMessage");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const signupLink = document.getElementById("signupLink");

  if (!form) return; // No estamos en la página de login

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError("Por favor completa todos los campos");
      return;
    }

    showLoading(true);
    errorMessage.classList.add("hidden");

    try {
      // Llamar a la API de login
      const response = await API.login(email, password);

      if (response.token) {
        // Guardar token en localStorage
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Redirigir a anime_search_&_browse
        window.location.href = "anime_search_&_browse.html";
      } else {
        showError("Error en la respuesta del servidor");
      }
    } catch (error) {
      showError(error.message || "Error al iniciar sesión");
    } finally {
      showLoading(false);
    }
  });

  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    // TODO: Implementar página de registro
    alert("Registro en desarrollo");
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  function showLoading(show) {
    if (show) {
      loadingSpinner.classList.remove("hidden");
      loginBtn.disabled = true;
      loginBtn.textContent = "Signing in...";
    } else {
      loadingSpinner.classList.add("hidden");
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign In";
    }
  }
})();
