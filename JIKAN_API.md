# 🎌 Integración con Jikan API (MyAnimeList)

## ✅ Implementación Completada

Tu aplicación ahora está integrada con la **Jikan API v4**, que proporciona acceso a datos de MyAnimeList.

## 📡 Endpoints Disponibles

### Backend (Express)

#### 1. Buscar Animes
```
GET /api/jikan/search?q=naruto&page=1&limit=25
```
Busca animes por nombre en MyAnimeList.

#### 2. Obtener Anime Completo
```
GET /api/jikan/anime/:id
```
Obtiene información completa de un anime por su ID de MAL.

**Ejemplo de respuesta:**
```json
{
  "data": {
    "mal_id": 16498,
    "title": "Attack on Titan",
    "title_english": "Attack on Titan",
    "title_japanese": "進撃の巨人",
    "images": {
      "jpg": {
        "image_url": "...",
        "large_image_url": "..."
      }
    },
    "synopsis": "...",
    "score": 8.54,
    "scored_by": 2000000,
    "rank": 50,
    "popularity": 1,
    "members": 3000000,
    "favorites": 150000,
    "episodes": 25,
    "status": "Finished Airing",
    "aired": {
      "from": "2013-04-07T00:00:00+00:00",
      "to": "2013-09-29T00:00:00+00:00"
    },
    "season": "spring",
    "year": 2013,
    "broadcast": {...},
    "producers": [...],
    "licensors": [...],
    "studios": [...],
    "genres": [
      { "mal_id": 1, "name": "Action" },
      { "mal_id": 8, "name": "Drama" }
    ],
    "themes": [...],
    "demographics": [...]
  }
}
```

#### 3. Top Animes
```
GET /api/jikan/top?page=1&limit=25
```
Obtiene los animes mejor rankeados de MAL.

#### 4. Temporada Actual
```
GET /api/jikan/season/now?page=1
```
Obtiene animes de la temporada actual.

#### 5. Importar Anime
```
POST /api/jikan/import/:id
```
Importa un anime de Jikan a tu base de datos local.

## 🎨 Frontend (JavaScript)

### Funciones Disponibles

```javascript
// Buscar animes
const results = await API.searchJikan('naruto', page, limit);

// Obtener anime por ID
const anime = await API.getJikanAnime(16498);

// Top animes
const topAnimes = await API.getTopAnimes(page, limit);

// Temporada actual
const seasonAnimes = await API.getCurrentSeasonAnimes(page);

// Importar a BD local
const imported = await API.importJikanAnime(16498);
```

### Componente UI

```javascript
// Crear tarjeta de anime desde Jikan
const card = UI.createJikanAnimeCard(jikanAnime, (anime) => {
  console.log('Clicked:', anime.title);
});
```

## 🔄 Flujo de Trabajo

### 1. Búsqueda y Exploración
```javascript
// El usuario busca "naruto"
const results = await API.searchJikan('naruto');

// Mostrar resultados
results.data.forEach(anime => {
  const card = UI.createJikanAnimeCard(anime, handleClick);
  container.appendChild(card);
});
```

### 2. Ver Detalles
```javascript
// Usuario hace clic en un anime
async function handleClick(jikanAnime) {
  // Obtener info completa
  const fullData = await API.getJikanAnime(jikanAnime.mal_id);
  
  // Mostrar detalles
  displayAnimeDetails(fullData.data);
}
```

### 3. Agregar a Lista
```javascript
// Importar a BD local primero
const imported = await API.importJikanAnime(jikanAnime.mal_id);

// Luego agregar a lista del usuario
await API.addToList(imported.id, 'watching', 0);
```

## 📊 Datos Disponibles

### Información Básica
- `mal_id` - ID de MyAnimeList
- `title` - Título principal
- `title_english` - Título en inglés
- `title_japanese` - Título en japonés
- `synopsis` - Sinopsis

### Imágenes
- `images.jpg.image_url` - Imagen normal
- `images.jpg.large_image_url` - Imagen grande
- `images.webp.*` - Versiones WebP

### Ratings y Popularidad
- `score` - Puntuación (0-10)
- `scored_by` - Número de usuarios que votaron
- `rank` - Ranking general
- `popularity` - Ranking de popularidad
- `members` - Miembros que lo tienen en su lista
- `favorites` - Usuarios que lo marcaron como favorito

### Información de Emisión
- `episodes` - Número de episodios
- `status` - Estado (Airing, Finished, etc.)
- `aired.from` - Fecha de inicio
- `aired.to` - Fecha de fin
- `season` - Temporada (spring, summer, fall, winter)
- `year` - Año

### Clasificación
- `genres` - Géneros (Action, Drama, etc.)
- `themes` - Temas (School, Military, etc.)
- `demographics` - Demografía (Shounen, Seinen, etc.)
- `studios` - Estudios de animación
- `producers` - Productores

## ⚡ Características Implementadas

### ✅ En `anime_search_&_browse.html`
- Búsqueda en tiempo real con debounce (500ms)
- Carga de animes de la temporada actual por defecto
- Infinite scroll para paginación automática
- Importación automática al hacer clic en un anime
- Tarjetas con imágenes, géneros y rating de MAL

### ✅ Rate Limiting
La API de Jikan tiene límites:
- **3 requests/segundo**
- **60 requests/minuto**

El código implementa debounce para evitar exceder estos límites.

## 🎯 Próximos Pasos Sugeridos

1. **Página de Detalles**
   - Mostrar toda la info de `full` endpoint
   - Trailers y videos
   - Personajes y staff
   - Recomendaciones

2. **Filtros Avanzados**
   - Por género
   - Por temporada
   - Por estudio
   - Por año

3. **Cache Local**
   - Guardar búsquedas recientes
   - Reducir llamadas a la API

4. **Sincronización**
   - Importar lista de MAL del usuario
   - Exportar lista a MAL

## 📝 Ejemplo Completo

```javascript
// Buscar y mostrar animes
async function searchAndDisplay(query) {
  try {
    const results = await API.searchJikan(query);
    const container = document.querySelector('.anime-grid');
    container.innerHTML = '';
    
    results.data.forEach(anime => {
      const card = UI.createJikanAnimeCard(anime, async (jikanAnime) => {
        // Importar a BD local
        const imported = await API.importJikanAnime(jikanAnime.mal_id);
        
        // Redirigir a detalles
        window.location.href = `anime_detail_screen.html?id=${imported.id}`;
      });
      
      container.appendChild(card);
    });
  } catch (error) {
    UI.showNotification(error.message, 'error');
  }
}
```

## 🔗 Documentación Oficial

- [Jikan API Docs](https://docs.api.jikan.moe/)
- [MyAnimeList](https://myanimelist.net/)

---

**¡Tu aplicación ahora tiene acceso a millones de animes de MyAnimeList!** 🎉
