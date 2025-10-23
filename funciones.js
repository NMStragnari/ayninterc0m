// Usuarios de ejemplo (en un sistema real, nunca guardes contraseñas así)
const usuarios = [
    { username: "admin", password: "admin123", rol: "admin" },
    { username: "aguillen", password: "admin123", rol: "admin" },
    { username: "usuario", password: "usuario123", rol: "comun" },
    { username: "nstragnari", password: "usuario123", rol: "admin" }
];

// Función para validar login y mantener sesión
function login(username, password) {
    const user = usuarios.find(
        u => u.username === username && u.password === password
    );
    if (user) {
        document.getElementById('login-container').style.display = 'none';
        // Guardar usuario en sessionStorage para mantener sesión
        sessionStorage.setItem('usuario', JSON.stringify(user));
        return { success: true, rol: user.rol };
    } else {
        document.getElementById('login-container').style.display = 'flex';
        return { success: false, message: "Usuario o contraseña incorrectos" };
    }
}

// Función para obtener usuario logueado
function getUsuarioLogueado() {
    const user = sessionStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem('usuario');
}

// Función para verificar si el usuario es admin
function esAdmin() {
    const usuario = getUsuarioLogueado();
    return usuario && usuario.rol === 'admin';
}

// Función para verificar si el usuario es común
function esUsuarioComun() {
    const usuario = getUsuarioLogueado();
    return usuario && usuario.rol === 'comun';
}

// Función para ocultar elementos solo para admin
function aplicarControlAcceso() {
    const elementosAdmin = document.querySelectorAll('[data-admin-only]');
    const botonesEditor = document.querySelectorAll('[onclick*="editor-instructivos"]');
    const enlacesEditor = document.querySelectorAll('a[href*="editor-instructivos"]');
    
    if (!esAdmin()) {
        // Ocultar elementos marcados como solo para admin
        elementosAdmin.forEach(elemento => {
            elemento.style.display = 'none';
        });
        
        // Ocultar botones del editor
        botonesEditor.forEach(boton => {
            boton.style.display = 'none';
        });
        
        // Ocultar enlaces al editor
        enlacesEditor.forEach(enlace => {
            enlace.style.display = 'none';
        });
        
        // Ocultar botones de crear/editar instructivos
        const btnCrear = document.getElementById('btn-crear-instructivo');
        if (btnCrear) btnCrear.style.display = 'none';
        
        const btnEditar = document.querySelector('[onclick*="editarInstructivo"]');
        if (btnEditar) btnEditar.style.display = 'none';
    }
}

// Función para verificar acceso al editor (para usar en editor-instructivos.html)
function verificarAccesoEditor() {
    if (!esAdmin()) {
        alert('Acceso denegado. Solo los administradores pueden acceder al editor de instructivos.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// El JS solo necesita mostrar/ocultar la sección como ya tienes:
document.addEventListener('DOMContentLoaded', function() {
    const btnAtencion = document.getElementById('btn-atencion-telefonica');
    const detalle = document.getElementById('atencion-telefonica-detalle');
    const cerrar = document.getElementById('cerrar-detalle');
    if(btnAtencion && detalle && cerrar) {
        btnAtencion.addEventListener('click', function() {
            detalle.style.display = 'flex';
        });
        cerrar.addEventListener('click', function() {
            detalle.style.display = 'none';
        });
    }
    
    // Aplicar control de acceso al cargar la página
    aplicarControlAcceso();
});

function renderPage() {
    if (!pdfDoc) return;
    pdfDoc.getPage(currentPage).then(page => {
        // Calcula el tamaño máximo permitido
        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight - 200;
        let viewport = page.getViewport({ scale: scale });

        // Ajusta el scale si el PDF es más grande que la pantalla
        let scaleX = maxWidth / viewport.width;
        let scaleY = maxHeight / viewport.height;
        let finalScale = Math.min(scale, scaleX, scaleY);

        viewport = page.getViewport({ scale: finalScale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
        updatePageInfo();
    });
}

// Ejemplo de uso:
// const resultado = login('admin', 'admin123');
// if (resultado.success) {
//     alert('Bienvenido ' + resultado.rol);
// } else {
//     alert(resultado.message);
// }