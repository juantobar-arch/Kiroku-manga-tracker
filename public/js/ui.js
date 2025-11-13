/**
 * Utilidades de interfaz de usuario
 */
const UI = {
    /**
     * Muestra una notificación al usuario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, warning, info)
     * @param {number} duration - Duración en milisegundos (opcional, por defecto 5000ms)
     */
    showNotification: function(message, type = 'info', duration = 5000) {
        // Crear el contenedor de notificaciones si no existe
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        // Crear la notificación
        const notification = document.createElement('div');
        const typeClasses = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        notification.className = `px-4 py-2 rounded-lg shadow-lg text-white ${typeClasses[type] || 'bg-gray-800'}`;
        notification.textContent = message;
        notification.style.transition = 'opacity 0.3s ease-in-out';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';

        // Agregar la notificación al contenedor
        container.appendChild(notification);

        // Forzar reflow para permitir la transición
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Eliminar la notificación después de la duración especificada
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            // Eliminar el elemento después de la animación
            setTimeout(() => {
                notification.remove();
                // Eliminar el contenedor si no hay más notificaciones
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    },

    /**
     * Muestra un indicador de carga
     * @param {HTMLElement} container - Contenedor donde mostrar el indicador de carga
     * @returns {HTMLElement} - Elemento del indicador de carga
     */
    showLoading: function(container) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'flex justify-center items-center p-8';
        loadingDiv.innerHTML = `
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        `;
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(loadingDiv);
        }
        
        return loadingDiv;
    },

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     * @param {HTMLElement} container - Contenedor donde mostrar el error (opcional)
     */
    showError: function(message, container = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'p-4 bg-red-100 border border-red-400 text-red-700 rounded';
        errorDiv.textContent = message;
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(errorDiv);
        }
        
        return errorDiv;
    }
};

// Hacer UI disponible globalmente si estamos en el navegador
if (typeof window !== 'undefined') {
    window.UI = UI;
}
