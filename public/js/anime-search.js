(function () {
  "use strict";

  // Elementos del DOM
  const grid = document.querySelector(".anime-grid");

  // Estado
  let currentPage = 1;
  let isLoading = false;
  let searchTimeout;

  // Validar elementos críticos
  if (!grid) {
    console.error("[AnimeSearch] Grid no encontrado");
    return;
  }

  /**
   * Cargar animes desde la API
   * @param {string} search - Término de búsqueda
   * @param {number} page - Número de página
   */
  async function loadAnimes(search = "", page = 1) {
    if (isLoading) return;

    isLoading = true;
    const isFirstPage = page === 1;

    try {
      if (isFirstPage) {
        grid.innerHTML = '<div class="loading">Cargando animes...</div>';
      }

      console.log(
        `[AnimeSearch] Cargando: "${
          search || "temporada actual"
        }" - página ${page}`
      );

      // Llamar a la API
      const data = search
        ? await API.searchJikan(search, page, 25)
        : await API.getCurrentSeasonAnimes(page);

      // Validar respuesta
      if (!data?.data || data.data.length === 0) {
        if (isFirstPage) {
          grid.innerHTML =
            '<p style="text-align: center; padding: 40px; color: #9ca3af;">No se encontraron animes</p>';
        }
        return;
      }

      console.log(`[AnimeSearch] ${data.data.length} animes obtenidos`);

      // Limpiar grid si es primera página
      if (isFirstPage) {
        grid.innerHTML = "";
      }

      // Renderizar tarjetas
      data.data.forEach((anime) => {
        try {
          const card = UI.createAnimeCard(anime, handleAnimeClick);
          if (card) {
            grid.appendChild(card);
          }
        } catch (err) {
          console.error("[AnimeSearch] Error procesando anime:", anime, err);
        }
      });

      currentPage = page;
    } catch (error) {
      console.error("[AnimeSearch] Error:", error.message);
      UI.showNotification(
        `Error: ${error.message || "No se pudieron cargar los animes"}`,
        "error"
      );

      if (isFirstPage) {
        grid.innerHTML =
          '<p style="text-align: center; padding: 40px; color: #ef4444;">Error al cargar animes</p>';
      }
    } finally {
      isLoading = false;
    }
  }

  /**
   * Manejar click en tarjeta de anime
   * @param {Object} anime - Datos del anime
   */
  async function handleAnimeClick(anime) {
    try {
      console.log(`[AnimeSearch] Navegando a anime: ${anime.title}`);
      // Navigate directly with Jikan ID since we don't have backend import
      window.location.href = `anime_detail_screen.html?jikan_id=${anime.mal_id}`;
    } catch (error) {
      console.error("[AnimeSearch] Error al navegar:", error);
      UI.showNotification(`Error: ${error.message}`, "error");
    }
  }

  /**
   * Manejar búsqueda con debounce
   */
  function handleSearch(e) {
    clearTimeout(searchTimeout);
    const search = e.target.value.trim();

    searchTimeout = setTimeout(() => {
      currentPage = 1;
      loadAnimes(search, 1);
    }, 500);
  }

  /**
   * Manejar scroll infinito
   */
  function handleScroll() {
    if (isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 300;

    if (isNearBottom) {
      const searchValue =
        document.querySelector(".search__input")?.value.trim() || "";
      loadAnimes(searchValue, currentPage + 1);
    }
  }

  // Event Listeners
  document
    .querySelectorAll(".search__input, .search-box__input")
    .forEach((input) => {
      let timeout;
      input.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          loadAnimes(e.target.value.trim(), 1);
        }, 500);
      });
    });

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Inicializar
  console.log("[AnimeSearch] Iniciando...");
  loadAnimes();
})();
