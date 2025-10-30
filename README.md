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
- CSS
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


## Notas

- Los datos de animes vienen de MyAnimeList a través de Jikan API
- La base de datos usa JSON temporalmente (se puede migrar a SQLite)
- Los animes se importan automáticamente al hacer clic en ellos

