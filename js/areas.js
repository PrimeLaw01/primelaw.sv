const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LÓGICA DEL MODAL
async function abrirModal(slugParaBuscar) {
    if (!slugParaBuscar) return;

    console.log("Consultando base de datos para:", slugParaBuscar);
    const modal = document.getElementById('modal-derecho');
    
    try {
        const { data, error } = await _supabase
            .from('informacion_derechos')
            .select('*')
            .eq('slug', slugParaBuscar);

        if (error) throw error;

        if (data && data.length > 0) {
            const registro = data[0];

            document.getElementById('modal-titulo').innerText = registro.titulo;
            document.getElementById('modal-descripcion').innerText = registro.contenido_detallado;
            
            const listaUl = document.getElementById('modal-lista');
            listaUl.innerHTML = ''; 
            
            registro.lista_items.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                listaUl.appendChild(li);
            });

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            console.warn("No se encontró el registro:", slugParaBuscar);
            alert("La información detallada no está disponible en este momento.");
        }
    } catch (err) {
        console.error("Error al conectar con Supabase:", err.message);
        alert("Hubo un error al cargar la información.");
    }
}

function cerrarModal() {
    document.getElementById('modal-derecho').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-derecho');
    if (event.target == modal) {
        cerrarModal();
    }
}

// LÓGICA DEL BUSCADOR
function filtrarAreas() {
    const input = document.getElementById('input-busqueda');
    const textoBusqueda = input.value.toLowerCase().trim();
    const tarjetas = document.querySelectorAll('.tarjeta-area-vertical');

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('h3').innerText.toLowerCase();
        const descripcion = tarjeta.querySelector('p').innerText.toLowerCase();
        
        if (titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda)) {
            tarjeta.style.display = "";
            tarjeta.style.opacity = "1";
        } else {
            tarjeta.style.display = "none";
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('buscar');

    if (query) {
        const inputBusqueda = document.getElementById('input-busqueda');
        if (inputBusqueda) {
            inputBusqueda.value = query;
            filtrarAreas();
        }
    }
});


function limpiarEntornoAdmin() {
    if (window.self !== window.top) {
        const urlPadre = document.referrer;
        if (urlPadre.includes('primelaw_administrador_post.html') || window.location.search.includes('admin=true')) {
            const estiloOcultar = document.createElement('style');
            estiloOcultar.innerHTML = `
                html, body {
                    pointer-events: auto !important;
                    height: auto !important;
                    min-height: 100% !important;
                }
                body::-webkit-scrollbar { display: none !important; }
                body {
                    -ms-overflow-style: none !important;
                    scrollbar-width: none !important;
                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: #f8f9fa !important;
                }
                h1, h2 { font-size: 1.1rem !important; margin-bottom: 5px !important; }
                h3 { font-size: 0.9rem !important; }
                p, span, li, div { font-size: 0.75rem !important; line-height: 1.3 !important; }
                .modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 999999 !important;
                    justify-content: center;
                    align-items: center;
                    pointer-events: auto !important;
                }
                .modal-contenido { 
                    width: 90% !important; 
                    max-width: 400px !important;
                    padding: 15px !important;
                    pointer-events: auto !important; 
                    background: white !important;
                    border-radius: 8px !important;
                }
                .descripcion-legal { font-size: 0.75rem !important; }
                .lista-servicios li { font-size: 0.7rem !important; margin-left: 15px !important; }
                button, .boton, .tarjeta-area-vertical, .cerrar-modal, .boton-cerrar {
                    cursor: pointer !important;
                    pointer-events: auto !important;
                    display: inline-block !important;
                }
                header, footer, .encabezado-simple, .nav-container, .barra-copyright, .contenedor-regresar { 
                    display: none !important; 
                    pointer-events: none !important; 
                }
            `;
            document.head.appendChild(estiloOcultar);

            const limpiarDOM = () => {
                const estorbos = ['header', 'footer', '.nav-container', '.barra-copyright', '.contenedor-regresar'];
                estorbos.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.remove();
                });
            };

            limpiarDOM();
            setTimeout(limpiarDOM, 500);
            setTimeout(limpiarDOM, 1500);
        }
    }
}

limpiarEntornoAdmin();