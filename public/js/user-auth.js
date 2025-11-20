(function () {
  let isSignup = true;

  const form = document.getElementById("auth-form");
  const submitBtn = document.getElementById("submit-btn");
  const toggleMode = document.getElementById("toggle-mode");
  const toggleText = document.getElementById("toggle-text");
  const confirmPasswordContainer = document.getElementById(
    "confirm-password-container"
  );
  const title = document.querySelector("h2");
  const subtitle = document.querySelector("h2 + p");

  // Si AuthManager no está listo aún, esperar al DOM y a app.js
  function init() {
    if (!form) return;

    if (window.AuthManager && AuthManager.isAuthenticated()) {
      window.location.href = "anime_search_&_browse.html";
      return;
    }

    // Alternar entre login y signup
    toggleMode.addEventListener("click", () => {
      isSignup = !isSignup;

      if (isSignup) {
        title.textContent = "Create Your Account";
        subtitle.textContent = "Join Kiroku to track and discover new anime.";
        submitBtn.textContent = "Sign Up";
        toggleText.textContent = "Already have an account?";
        toggleMode.textContent = "Log in";
        confirmPasswordContainer.style.display = "block";
      } else {
        title.textContent = "Welcome Back";
        subtitle.textContent = "Log in to continue tracking your anime.";
        submitBtn.textContent = "Log In";
        toggleText.textContent = "Don't have an account?";
        toggleMode.textContent = "Sign up";
        confirmPasswordContainer.style.display = "none";
      }
    });

    // Manejar submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;

      if (isSignup) {
        if (password !== passwordConfirm) {
          UI.showNotification("Las contraseñas no coinciden", "error");
          return;
        }
        try {
          await API.register(email, password);
          UI.showNotification("Registro exitoso. Iniciando sesión...");
          // Auto-login después de registro
          await handleLogin(email, password);
        } catch (error) {
          UI.showNotification(error.message || "Error en el registro", "error");
        }
      } else {
        try {
          await handleLogin(email, password);
        } catch (error) {
          UI.showNotification(
            error.message || "Error en el inicio de sesión",
            "error"
          );
        }
      }
    });
  }

  // Función para manejar login
  async function handleLogin(email, password) {
    submitBtn.disabled = true;
    submitBtn.textContent = isSignup ? "Registrando..." : "Iniciando sesión...";

    try {
      const response = await API.login(email, password);

      if (response && response.token) {
        // Guardar token y datos de usuario
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user || {}));

        UI.showNotification("¡Bienvenido!");

        // Redirigir a anime_search_&_browse
        setTimeout(() => {
          window.location.href = "anime_search_&_browse.html";
        }, 500);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      UI.showNotification(error.message || "Error al iniciar sesión", "error");
      throw error;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isSignup ? "Sign Up" : "Log In";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export handleLogin for reuse (optional)
  window._KirokuUserAuth = { handleLogin };
})();
