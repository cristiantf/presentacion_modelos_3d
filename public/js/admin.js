document.addEventListener('DOMContentLoaded', () => {
    
    // Función para manejar el Login (login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Inicio de sesión exitoso.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = 'admin.html';
                    });
                } else {
                    Swal.fire('Error', result.message, 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Hubo un problema de conexión', 'error');
            }
        });
    }

    // Funciones para el Panel de Control (admin.html)
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        // Verificar sesión primero
        fetch('/api/auth/status')
            .then(res => res.json())
            .then(data => {
                if (!data.loggedIn) {
                    window.location.href = 'login.html';
                } else {
                    document.getElementById('user-greeting').textContent = `Hola, ${data.username}`;
                    loadAdminModels();
                }
            });

        // Logout
        document.getElementById('btn-logout').addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = 'login.html';
        });

        // Manejar subida de modelo
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const btnSubmit = document.getElementById('btn-submit');
            
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Subiendo...';

            try {
                const response = await fetch('/api/models', {
                    method: 'POST',
                    body: formData // Fetch setea automáticamente el header multipart/form-data
                });

                const result = await response.json();

                if (result.success) {
                    Swal.fire('Éxito', 'Modelo subido correctamente a la galería', 'success');
                    uploadForm.reset();
                    loadAdminModels();
                } else {
                    Swal.fire('Error', result.message, 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Ocurrió un error al subir el archivo', 'error');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Subir a la Galería';
            }
        });
    }

    // Cargar modelos en la tabla
    const loadAdminModels = async () => {
        const tbody = document.getElementById('admin-models-list');
        if (!tbody) return;

        try {
            const response = await fetch('/api/models');
            const result = await response.json();

            tbody.innerHTML = '';

            if (result.success && result.data.length > 0) {
                result.data.forEach(m => {
                    const tr = document.createElement('tr');
                    const date = new Date(m.uploaded_at).toLocaleDateString('es-ES');
                    tr.innerHTML = `
                        <td>${m.id}</td>
                        <td>${m.titulo}</td>
                        <td>${date}</td>
                        <td>
                            <button class="btn-edit" onclick="editModel(${m.id}, '${m.titulo.replace(/'/g, "\\'")}', '${m.descripcion.replace(/'/g, "\\'")}')">Editar</button>
                            <button class="btn-danger" onclick="deleteModel(${m.id})">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay modelos publicados.</td></tr>';
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Hacer función global para poder llamarla desde el onclick del HTML
    window.deleteModel = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto! El archivo .glb se borrará permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E53935',
            cancelButtonColor: '#B0BEC5',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/models/${id}`, {
                        method: 'DELETE'
                    });
                    const resJson = await response.json();
                    
                    if (resJson.success) {
                        Swal.fire('Eliminado!', 'El modelo ha sido eliminado.', 'success');
                        loadAdminModels();
                    } else {
                        Swal.fire('Error', resJson.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Hubo un error al conectar con el servidor.', 'error');
                }
            }
        });
    };

    // Función global para editar
    window.editModel = (id, currentTitle, currentDesc) => {
        Swal.fire({
            title: 'Editar Modelo',
            html: `
                <input id="swal-input-title" class="swal2-input" placeholder="Título" value="${currentTitle}">
                <textarea id="swal-input-desc" class="swal2-textarea" placeholder="Descripción" style="margin-top: 10px;">${currentDesc}</textarea>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const titulo = document.getElementById('swal-input-title').value;
                const descripcion = document.getElementById('swal-input-desc').value;
                if (!titulo || !descripcion) {
                    Swal.showValidationMessage('El título y la descripción son requeridos');
                }
                return { titulo, descripcion };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/models/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result.value)
                    });
                    const resJson = await response.json();
                    
                    if (resJson.success) {
                        Swal.fire('¡Actualizado!', 'El modelo ha sido actualizado.', 'success');
                        loadAdminModels();
                    } else {
                        Swal.fire('Error', resJson.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Hubo un error al conectar con el servidor.', 'error');
                }
            }
        });
    };
});
