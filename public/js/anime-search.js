(function () {
  // Esperar DOMContentLoaded por seguridad (defer + orden aseguran app.js ya disponible)
  function init() {
    // Verificar autenticación
    if (!AuthManager.isAuthenticated()) {
      window.location.href = "login.html";
      return;
    }

    let currentPage = 1;
    let isLoading = false;

    // Cargar animes desde Jikan API
    async function loadAnimes(search = "", page = 1) {
      const grid = document.querySelector(".anime-grid");

      if (page === 1) {
        UI.showLoading(grid);
      }

      isLoading = true;

      try {
        let data;

        if (search) {
          data = await API.searchJikan(search, page, 25);
        } else {
          data = await API.getCurrentSeasonAnimes(page);
        }

        if (page === 1) {
          grid.innerHTML = "";
        }

        if (!data.data || data.data.length === 0) {
          if (page === 1) {
            grid.innerHTML =
              '<p style="text-align: center; padding: 40px; color: #9ca3af;">No se encontraron animes</p>';
          }
          return;
        }

        data.data.forEach((anime) => {
          const card = UI.createAnimeCard(anime, async (jikanAnime) => {
            try {
              const imported = await API.importJikanAnime(jikanAnime.mal_id);
              window.location.href = `anime_detail_screen.html?id=${imported.id}&jikan_id=${jikanAnime.mal_id}`;
            } catch (error) {
              UI.showNotification(error.message, "error");
            }
          });
          grid.appendChild(card);
        });

        currentPage = page;
      } catch (error) {
        UI.showNotification(error.message, "error");
        if (page === 1) {
          grid.innerHTML =
            '<p style="text-align: center; padding: 40px; color: #9ca3af;">Error al cargar animes</p>';
        }
      } finally {
        isLoading = false;
      }
    }

    // Buscar animes con debounce
    let searchTimeout;
    const searchInputs = document.querySelectorAll(
      ".search__input, .search-box__input"
    );
    searchInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        const search = e.target.value;

        searchTimeout = setTimeout(() => {
          currentPage = 1;
          loadAnimes(search, 1);
        }, 500);
      });
    });

    // Infinite scroll
    window.addEventListener("scroll", () => {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        const searchValue =
          document.querySelector(".search__input")?.value || "";
        loadAnimes(searchValue, currentPage + 1);
      }
    });

    // Inicializar
    loadAnimes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
