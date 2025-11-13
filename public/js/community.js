// Función para cargar los comentarios
async function loadComments() {
    try {
        // Aquí iría la lógica para cargar los comentarios desde la API
        // Por ahora, usaremos datos de ejemplo
        const comments = [
            {
                id: 1,
                user: "Sophia Carter",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpUTjwe4G5P8ZpsoJ1Z2WQijV8caJP2q9aHJ0U27hadfRx2RBfuulRUbWvmB59u7U63bXPJSfFDskJEB1CYQ_KMgtSg2GscndVbFZhqQ8R9KdLIQB579NtlFELDr8YGlk3eSv5yi0h32BYipD838HhX_AbTGHVu4lvF_Ebd69wipnJf1H0lSaWd8M9OARjYpcC0GhpT2cZhycqdwObmhY_M6Q9AHhi5x7bnPBNaO2-M8NEP8vb1P2kibsehM8L1dXLWB6FKxwB__Y",
                comment: "The animation quality is top-notch, and the storyline keeps you on the edge of your seat. A must-watch for any anime fan!",
                timeAgo: "2 months ago"
            },
            // Agrega más comentarios de ejemplo si es necesario
        ];

        renderComments(comments);
    } catch (error) {
        console.error("Error loading comments:", error);
        // Mostrar mensaje de error al usuario
    }
}

// Función para renderizar los comentarios
function renderComments(comments) {
    const commentsContainer = document.querySelector('.space-y-6');
    if (!commentsContainer) return;

    // Limpiar comentarios existentes
    commentsContainer.innerHTML = '';

    // Actualizar contador de comentarios
    const commentCount = document.querySelector('h2.text-2xl');
    if (commentCount) {
        commentCount.textContent = `Comments (${comments.length})`;
    }

    // Renderizar cada comentario
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
    });
}

// Función para crear el elemento HTML de un comentario
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'flex items-start gap-4';
    
    commentDiv.innerHTML = `
        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" 
             style="background-image: url('${comment.avatar}')"></div>
        <div class="flex-1">
            <div class="flex items-center gap-3">
                <p class="text-white text-sm font-bold">${comment.user}</p>
                <p class="text-[#9d9db8] text-xs">${comment.timeAgo}</p>
            </div>
            <p class="text-white/90 text-sm mt-1">${comment.comment}</p>
        </div>
    `;
    
    return commentDiv;
}

// Función para manejar el envío de comentarios
function handleCommentSubmit(event) {
    event.preventDefault();
    
    const commentInput = document.getElementById('comment-input');
    if (!commentInput || !commentInput.value.trim()) return;
    
    // Aquí iría la lógica para enviar el comentario a la API
    // Por ahora, solo lo agregamos al DOM
    const newComment = {
        id: Date.now(),
        user: "Current User", // Esto debería venir de la autenticación
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiHx-mUrA9EcvFX-XujNwWcitoAkh1hlCblBeGgFskAhthCAtSQ1w-_LheEn3CKH_iYf5y0WsKzwg4XsCZKho1aDbwZ926ub4XdzW6O88RXLn9d4gXuDNftzqvlqVLf-IQEKRkakNr2ECG-YOI2IhTsI9GzpnefQXfJi25nVuTmQoMNV6HiCkwLnHW3l5HS9P7xDV1DbFbLDPlXQpopUPaK2rSgPrKgpOYqO33KhwcexDnm_Yl4QPWugx-GzWNlpoOTKG7b4K3JOQ",
        comment: commentInput.value.trim(),
        timeAgo: "Just now"
    };
    
    // Agregar el nuevo comentario al principio de la lista
    const commentElement = createCommentElement(newComment);
    const commentsContainer = document.querySelector('.space-y-6');
    if (commentsContainer.firstChild) {
        commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
    } else {
        commentsContainer.appendChild(commentElement);
    }
    
    // Actualizar contador
    const commentCount = document.querySelector('h2.text-2xl');
    if (commentCount) {
        const currentCount = parseInt(commentCount.textContent.match(/\d+/)[0]) || 0;
        commentCount.textContent = `Comments (${currentCount + 1})`;
    }
    
    // Limpiar el campo de entrada
    commentInput.value = '';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar comentarios al cargar la página
    loadComments();
    
    // Configurar el manejador de envío del formulario
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
});
