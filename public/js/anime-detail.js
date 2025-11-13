// Function to load anime details from the API
async function loadAnimeDetails(jikanId, localId) {
  try {
    // Show loading state
    document.getElementById("anime-detail").innerHTML = `
      <div class="loading" style="text-align: center; padding: 100px 20px; color: #9ca3af;">
        Cargando detalles del anime...
      </div>
    `;

    // Get complete data from Jikan API
    const response = await API.getJikanAnime(jikanId);
    const anime = response.data;

    if (!anime) {
      throw new Error("Anime no encontrado");
    }

    // Render details
    renderAnimeDetails(anime, localId);
  } catch (error) {
    console.error("Error loading anime:", error);
    document.getElementById("anime-detail").innerHTML =
      '<p style="text-align: center; padding: 100px 20px; color: #ef4444;">Error al cargar los detalles del anime</p>';
  }
}

// Function to render anime details in the UI
function renderAnimeDetails(anime, localId) {
  const container = document.getElementById("anime-detail");

  // Background image (banner or cover)
  const bgImage =
    anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";

  // Genres
  const genres = anime.genres?.map((g) => g.name) || [];
  const themes = anime.themes?.map((t) => t.name) || [];
  const allGenres = [...genres, ...themes];

  // Rating (stars)
  const score = anime.score || 0;
  const fullStars = Math.floor(score / 2);
  const halfStar = (score / 2) % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++)
    starsHTML += '<i class="fas fa-star"></i>';
  if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < emptyStars; i++)
    starsHTML += '<i class="far fa-star"></i>';

  // Additional information
  const episodes = anime.episodes || "?";
  const status = anime.status || "Unknown";
  const aired = anime.aired?.string || "N/A";
  const studios = anime.studios?.map((s) => s.name).join(", ") || "Unknown";
  const source = anime.source || "Unknown";
  const duration = anime.duration || "Unknown";

  container.innerHTML = `
    <div class="detail__hero" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 40%), url('${bgImage}');">
      <h1 class="detail__title">${anime.title}</h1>
      ${
        anime.title_english && anime.title_english !== anime.title
          ? `<p style="color: #d1d5db; font-size: 1.2rem; margin-top: 0.5rem;">${anime.title_english}</p>`
          : ""
      }
    </div>

    <div class="detail__content">
      <!-- Left Section -->
      <section class="detail__main">
        <article class="synopsis">
          <h2 class="synopsis__title">Synopsis</h2>
          <p class="synopsis__text">${
            anime.synopsis || "No synopsis available."
          }</p>
        </article>

        <div class="info-grid">
          <div>
            <h3>Episodes</h3>
            <p>${episodes}</p>
          </div>
          <div>
            <h3>Status</h3>
            <p>${status}</p>
          </div>
          <div>
            <h3>Aired</h3>
            <p>${aired}</p>
          </div>
          <div>
            <h3>Studios</h3>
            <p>${studios}</p>
          </div>
          <div>
            <h3>Source</h3>
            <p>${source}</p>
          </div>
          <div>
            <h3>Duration</h3>
            <p>${duration}</p>
          </div>
        </div>

        <div class="actions">
          <button class="actions__btn actions__btn--primary" id="add-to-list-btn">
            <i class="fas fa-plus"></i> Add to Watchlist
          </button>
          <button class="actions__btn actions__btn--secondary" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </section>

      <!-- Right Section -->
      <aside class="detail__sidebar">
        <div class="genres">
          <h3 class="genres__title">Genres & Themes</h3>
          <div class="genres__list">
            ${allGenres
              .map((g) => `<span class="genres__item">${g}</span>`)
              .join("")}
          </div>
        </div>

        <div class="ratings">
          <h3 class="ratings__title">Rating</h3>
          <div class="ratings__summary">
            <p class="ratings__score">${score.toFixed(1)}</p>
            <div class="ratings__stars">
              ${starsHTML}
            </div>
            <p class="ratings__reviews">${
              anime.scored_by?.toLocaleString() || 0
            } users</p>
          </div>

          <div class="ratings__stats">
            <div class="ratings__stat">
              <span>Rank</span>
              <span>#${anime.rank || "N/A"}</span>
            </div>
            <div class="ratings__stat">
              <span>Popularity</span>
              <span>#${anime.popularity || "N/A"}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;

  // Add event listeners after rendering
  document.getElementById("add-to-list-btn")?.addEventListener("click", () => {
    // Add to watchlist functionality
    console.log("Adding to watchlist:", anime.title);
    // Implement add to watchlist logic here
  });
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const jikanId = urlParams.get("jikan_id");
  const localId = urlParams.get("id");

  if (!jikanId) {
    document.getElementById("anime-detail").innerHTML =
      '<p style="text-align: center; padding: 100px 20px; color: #ef4444;">Error: No se especificó el ID del anime</p>';
  } else {
    loadAnimeDetails(jikanId, localId);
  }
});
