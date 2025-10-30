// API Base URL
const API_URL = 'http://localhost:3000/api';

// Utilidades para localStorage
const Storage = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),
    getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('user'),
    isAuthenticated: () => !!Storage.getToken()
};

// Cliente API
class API {
    static async request(endpoint, options = {}) {
        const token = Storage.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    static async register(email, password, username) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, username })
        });
    }

    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    // User Anime List
    static async getUserAnimes(status = '') {
        const params = status ? `?status=${status}` : '';
        return this.request(`/user/anime${params}`);
    }

    static async addToList(animeId, status = 'plan_to_watch', currentEpisode = 0) {
        return this.request('/user/anime', {
            method: 'POST',
            body: JSON.stringify({
                anime_id: animeId,
                status,
                current_episode: currentEpisode
            })
        });
    }

    static async updateUserAnime(id, data) {
        return this.request(`/user/anime/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async removeFromList(id) {
        return this.request(`/user/anime/${id}`, {
            method: 'DELETE'
        });
    }

    // Jikan API (MyAnimeList)
    static async searchJikan(query, page = 1, limit = 25) {
        const params = new URLSearchParams({ q: query, page, limit });
        return this.request(`/jikan/search?${params}`);
    }

    static async getJikanAnime(id) {
        return this.request(`/jikan/anime/${id}`);
    }

    static async getTopAnimes(page = 1, limit = 25) {
        const params = new URLSearchParams({ page, limit });
        return this.request(`/jikan/top?${params}`);
    }

    static async getCurrentSeasonAnimes(page = 1) {
        const params = new URLSearchParams({ page });
        return this.request(`/jikan/season/now?${params}`);
    }

    static async importJikanAnime(jikanId) {
        return this.request(`/jikan/import/${jikanId}`, {
            method: 'POST'
        });
    }
}

// Componentes UI
class UI {
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static showLoading(element) {
        element.innerHTML = '<div class="loading">Cargando...</div>';
    }

    // Crear tarjeta de anime desde datos de Jikan API
    static createAnimeCard(jikanAnime, onClick) {
        const card = document.createElement('article');
        card.className = 'anime-card';
        card.style.cursor = 'pointer';
        
        const imageUrl = jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || 'https://via.placeholder.com/300x450';
        const genres = jikanAnime.genres?.map(g => g.name).join(', ') || 'Sin género';
        const episodes = jikanAnime.episodes || '?';
        
        card.innerHTML = `
            <div class="anime-card__cover" style="background-image: url('${imageUrl}');"></div>
            <div class="anime-card__info">
                <h3 class="anime-card__title">${jikanAnime.title}</h3>
                <p class="anime-card__meta">${genres} | ${episodes} episodios</p>
                ${jikanAnime.score ? `<p class="anime-card__rating">⭐ ${jikanAnime.score}</p>` : ''}
            </div>
        `;
        
        if (onClick) {
            card.addEventListener('click', () => onClick(jikanAnime));
        }
        
        return card;
    }

    static createWatchlistItem(item, onUpdate, onDelete) {
        const progress = item.total_episodes > 0 
            ? Math.round((item.current_episode / item.total_episodes) * 100) 
            : 0;

        const div = document.createElement('div');
        div.className = 'flex items-center gap-4 hover:bg-neutral-800 rounded-lg px-4 py-3 transition-colors duration-200 justify-between';
        
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md w-12" 
                     style="background-image: url('${item.cover_image || 'https://via.placeholder.com/300x450'}');"></div>
                <div class="flex flex-col justify-center">
                    <p class="text-white text-base font-medium leading-normal line-clamp-1">${item.title}</p>
                    <p class="text-neutral-400 text-sm font-normal leading-normal line-clamp-2">
                        Episodio ${item.current_episode} de ${item.total_episodes || '?'}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-24 sm:w-32">
                    <div class="w-full bg-neutral-700 rounded-full h-1.5">
                        <div class="bg-primary-500 h-1.5 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
                <p class="text-neutral-300 text-sm font-medium w-8 text-right">${progress}%</p>
                <button class="update-btn text-neutral-400 hover:text-white"><i class="fas fa-edit"></i></button>
                <button class="delete-btn text-neutral-400 hover:text-red-500"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const updateBtn = div.querySelector('.update-btn');
        const deleteBtn = div.querySelector('.delete-btn');

        updateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onUpdate(item);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete(item);
        });

        return div;
    }
}

// Auth Manager
class AuthManager {
    static async handleLogin(email, password) {
        try {
            const response = await API.login(email, password);
            Storage.setToken(response.token);
            Storage.setUser(response.user);
            UI.showNotification('¡Bienvenido de vuelta!');
            setTimeout(() => window.location.href = '/', 1000);
        } catch (error) {
            UI.showNotification(error.message, 'error');
        }
    }

    static async handleRegister(email, password, username) {
        try {
            const response = await API.register(email, password, username);
            Storage.setToken(response.token);
            Storage.setUser(response.user);
            UI.showNotification('¡Cuenta creada exitosamente!');
            setTimeout(() => window.location.href = '/', 1000);
        } catch (error) {
            UI.showNotification(error.message, 'error');
        }
    }

    static logout() {
        Storage.removeToken();
        Storage.removeUser();
        UI.showNotification('Sesión cerrada');
        setTimeout(() => window.location.href = '/login', 1000);
    }

    static checkAuth() {
        if (!Storage.isAuthenticated()) {
            window.location.href = '/login';
        }
    }

    static updateUIForAuth() {
        const user = Storage.getUser();
        if (user) {
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = user.username || user.email;
            });
        }
    }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #9ca3af;
        }
    `;
    document.head.appendChild(style);
});

// Exportar para uso global
window.API = API;
window.UI = UI;
window.Storage = Storage;
window.AuthManager = AuthManager;
