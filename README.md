# Kiroku - Anime Tracker

Aplicación web para hacer seguimiento de tus animes favoritos usando datos de MyAnimeList.

## Características

- Búsqueda de animes desde MyAnimeList (Jikan API)
- Sistema de autenticación con JWT
- Lista personal de animes (watching, completed, plan to watch)
- Seguimiento de progreso por episodios
- Información detallada de cada anime

## Tecnologías

**Backend:**
- Node.js + Express
- JSON Database (temporal)
- bcrypt para contraseñas
- JWT para autenticación
- Jikan API v4

**Frontend:**
- Vanilla JavaScript
- Tailwind CSS
- Font Awesome (CDN)

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y configurar JWT_SECRET

# Iniciar servidor
pnpm dev
```

El servidor corre en `http://localhost:3000`

## Estructura

```
├── public/
│   ├── css/           # Estilos
│   └── app.js         # Cliente API
├── views/             # Páginas HTML
├── db.js              # Base de datos
├── router.js          # Rutas API
└── server.js          # Servidor
```

## API Endpoints

**Autenticación:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

**Lista de usuario:**
- `GET /api/user/anime` - Obtener lista
- `POST /api/user/anime` - Agregar anime
- `PUT /api/user/anime/:id` - Actualizar
- `DELETE /api/user/anime/:id` - Eliminar

**Jikan API:**
- `GET /api/jikan/search` - Buscar animes
- `GET /api/jikan/anime/:id` - Detalles completos
- `GET /api/jikan/top` - Top animes
- `GET /api/jikan/season/now` - Temporada actual
- `POST /api/jikan/import/:id` - Importar a BD local

## Uso

1. Registrarse o iniciar sesión
2. Buscar animes desde la página principal
3. Ver detalles haciendo clic en un anime
4. Agregar a tu lista personal
5. Gestionar tu progreso desde "My List"

## Notas

- Los datos de animes vienen de MyAnimeList a través de Jikan API
- La base de datos usa JSON temporalmente (se puede migrar a SQLite)
- Los animes se importan automáticamente al hacer clic en ellos

## Scripts

```bash
pnpm dev      # Desarrollo
pnpm start    # Producción
```

## Licencia

MIT
