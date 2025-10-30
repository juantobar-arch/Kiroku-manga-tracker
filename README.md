# Kiroku - Anime Tracker

Sistema de seguimiento de anime con integración a **MyAnimeList** a través de la API de Jikan v4.

## Características

- Búsqueda en tiempo real de millones de animes de MyAnimeList
- Autenticación de usuarios (JWT)
- Lista personal de seguimiento (watching, completed, plan to watch)
- Seguimiento de progreso por episodios
- Infinite scroll para navegación fluida
- Datos completos de Jikan API (imágenes, ratings, géneros, sinopsis)
- UI moderna con Tailwind CSS y Font Awesome

## Tecnologías

### Backend
- Node.js + Express - Servidor web
- SQLite/JSON - Base de datos local
- bcrypt - Hash de contraseñas
- jsonwebtoken - Autenticación JWT
- Jikan API v4 - Datos de MyAnimeList

### Frontend
- Vanilla JavaScript - Sin frameworks
- Tailwind CSS - Estilos
- Font Awesome - Iconos
- Fetch API - Peticiones HTTP

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env y configura JWT_SECRET

# Iniciar servidor
pnpm dev
```

## Uso

1. Abre **http://localhost:3000**
2. Regístrate o inicia sesión en `/login`
3. Explora animes de la **temporada actual** (carga automática)
4. **Busca** cualquier anime de MyAnimeList
5. Haz **clic en un anime** para importarlo y ver detalles
6. **Agrégalo a tu lista** personal
7. Gestiona tu **progreso** en "My List"

## Estructura del Proyecto

```
kiroku-manga-tracker/
├── public/
│   ├── css/              # Estilos CSS
│   ├── app.js            # Cliente API + UI Components
│   └── logo-kiroku.png
├── views/                # Páginas HTML
│   ├── anime_search_&_browse.html    # Búsqueda con Jikan API
│   ├── anime_detail_screen.html      # Detalles del anime
│   ├── watchlist_dashboard.html      # Lista personal
│   ├── user_authentication.html      # Login/Registro
│   ├── community_&_reviews.html
│   └── settings_&_profile.html
├── db.js                 # Configuración de base de datos
├── router.js             # Rutas API + Jikan endpoints
├── server.js             # Servidor Express
├── .env.example          # Variables de entorno
├── package.json
├── README.md
└── JIKAN_API.md          # Documentación de Jikan API
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Lista de Usuario (requiere autenticación)
- `GET /api/user/anime?status=watching` - Obtener lista filtrada
- `POST /api/user/anime` - Agregar anime a lista
- `PUT /api/user/anime/:id` - Actualizar progreso
- `DELETE /api/user/anime/:id` - Eliminar de lista

### Jikan API (MyAnimeList)
- `GET /api/jikan/search?q=naruto&page=1` - Buscar animes
- `GET /api/jikan/anime/:id` - Obtener anime completo (`/full`)
- `GET /api/jikan/top?page=1` - Top animes de MAL
- `GET /api/jikan/season/now?page=1` - Temporada actual
- `POST /api/jikan/import/:id` - Importar anime a BD local

## Datos de Jikan API

Cada anime incluye:
- **Imágenes:** JPG (normal, large), WebP
- **Títulos:** Inglés, japonés, romaji
- **Metadata:** Sinopsis, rating, popularidad, miembros
- **Episodios:** Total, estado (airing/finished)
- **Clasificación:** Géneros, temas, demografía
- **Producción:** Estudios, productores
- **Fechas:** Emisión, temporada, año

Ver **[JIKAN_API.md](./JIKAN_API.md)** para documentación completa.

## Seguridad

- Contraseñas hasheadas con **bcrypt** (10 rounds)
- Autenticación **JWT** (tokens de 7 días)
- Validación de datos en backend
- Tokens en localStorage
- Rate limiting respetado (Jikan: 3 req/s)

## Scripts

```bash
pnpm dev      # Desarrollo con nodemon
pnpm start    # Producción
```

## ⚡ Optimizaciones

- **Debounce** en búsqueda (500ms) para evitar spam
- **Infinite scroll** para paginación automática
- **Cache local** de animes importados
- **Fallbacks** de imágenes si faltan datos
- **Optional chaining** para datos opcionales

## 🎯 Flujo de Trabajo

```
Usuario busca "Naruto"
    ↓
Jikan API retorna resultados
    ↓
Usuario hace clic en un anime
    ↓
Anime se importa a BD local
    ↓
Usuario lo agrega a su lista
    ↓
Seguimiento de progreso
```

## 🔗 Enlaces

- **Jikan API Docs:** https://docs.api.jikan.moe/
- **MyAnimeList:** https://myanimelist.net/
- **Tailwind CSS:** https://tailwindcss.com/
- **Font Awesome:** https://fontawesome.com/

## 📄 Licencia

MIT

---

**¡Millones de animes de MyAnimeList al alcance de tu mano!** 🎉
