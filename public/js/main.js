document.addEventListener('DOMContentLoaded', () => {
    
    // Función para la página principal (index.html)
    const loadModels = async () => {
        const container = document.getElementById('models-container');
        if (!container) return;

        try {
            const response = await fetch('/api/models');
            const result = await response.json();

            if (result.success) {
                container.innerHTML = ''; // Limpiar mensaje de carga
                
                if(result.data.length === 0){
                    container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No hay modelos publicados aún.</p>';
                    return;
                }

                result.data.forEach(modelo => {
                    const card = document.createElement('div');
                    card.className = 'model-card';
                    card.innerHTML = `
                        <h3>${modelo.titulo}</h3>
                        <p>${modelo.descripcion.substring(0, 100)}${modelo.descripcion.length > 100 ? '...' : ''}</p>
                        <a href="viewer.html?id=${modelo.id}" class="btn-primary btn-view text-center">Ver Modelo 3D</a>
                    `;
                    container.appendChild(card);
                });
            }
        } catch (error) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: red;">Error al cargar los modelos.</p>';
            console.error('Error fetching models:', error);
        }
    };

    // Función para el visor (viewer.html)
    const loadViewer = async () => {
        const viewerElement = document.getElementById('viewer-element');
        if (!viewerElement) return;

        const urlParams = new URLSearchParams(window.location.search);
        const modelId = urlParams.get('id');

        if (!modelId) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`/api/models/${modelId}`);
            const result = await response.json();

            if (result.success) {
                const modelo = result.data;
                // Configurar src del visor
                viewerElement.src = modelo.file_path;
                
                // Actualizar textos
                document.getElementById('model-title').textContent = modelo.titulo;
                document.getElementById('model-desc').textContent = modelo.descripcion;
                document.title = `${modelo.titulo} - Visor 3D`;
            } else {
                document.getElementById('viewer-info').innerHTML = '<h2 class="text-center">Modelo no encontrado</h2>';
            }
        } catch (error) {
            console.error('Error fetching model:', error);
        }
    };

    loadModels();
    loadViewer();
});
