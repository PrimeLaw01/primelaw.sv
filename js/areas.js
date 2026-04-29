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
        const hostname = window.location.hostname;
        
        const esAdmin = urlPadre.includes('primelaw_administrador_post.html') || 
                        hostname === "127.0.0.1" || 
                        hostname === "localhost" || 
                        window.location.search.includes('admin=true');

        if (esAdmin) {
            const estiloOcultar = document.createElement('style');
            estiloOcultar.innerHTML = `
                html, body {
                    background: #ffffff !important;
                    height: auto !important;
                    min-height: 100vh !important;
                }
                body::-webkit-scrollbar { display: none; }

                .modal-overlay {
                    padding: 10px !important;
                    z-index: 999999 !important;
                }
                .modal-contenido {
                    width: 95% !important;
                    max-width: 450px !important;
                    padding: 20px !important; /* Reducido de 40px */
                    max-height: 85vh !important;
                }
                #modal-titulo {
                    font-size: 18px !important; /* Título principal */
                    margin-bottom: 10px !important;
                    padding-bottom: 5px !important;
                }
                .descripcion-legal {
                    font-size: 13px !important; /* El texto de la imagen */
                    line-height: 1.4 !important;
                    text-align: left !important;
                }
                .modal-body h3 {
                    font-size: 14px !important;
                    margin-top: 10px !important;
                }
                .lista-servicios li {
                    font-size: 12px !important;
                    margin-bottom: 5px !important;
                }
                .cerrar-modal {
                    font-size: 22px !important;
                    top: 10px !important;
                    right: 15px !important;
                }
                .boton-cerrar {
                    padding: 8px 20px !important;
                    font-size: 12px !important;
                }

                /* Mantener barra de búsqueda y tarjetas */
                .contenedor-busqueda {
                    display: flex !important;
                    position: sticky !important;
                    top: 0 !important;
                    z-index: 1000 !important;
                    background: white !important;
                }
                .tarjeta-area-vertical {
                    display: flex !important;
                    opacity: 1 !important;
                    transform: none !important;
                    margin-bottom: 15px !important;
                }
                header, footer, .contenedor-regresar { display: none !important; }
            `;
            document.head.appendChild(estiloOcultar);

            const ejecutarLimpieza = () => {
                const buscador = document.getElementById('input-busqueda');
                if (buscador) buscador.addEventListener('input', filtrarAreas);

                document.querySelectorAll('.revelar, .tarjeta-area-vertical').forEach(card => {
                    card.classList.add('activo');
                    card.style.setProperty('opacity', '1', 'important');
                    card.style.setProperty('transform', 'none', 'important');
                });
            };

            ejecutarLimpieza();
            setTimeout(ejecutarLimpieza, 500);
        }
    }
}

if (typeof filtrarAreas !== 'undefined') {
    const originalFiltrar = filtrarAreas;
    filtrarAreas = function() {
        const input = document.getElementById('input-busqueda');
        if (!input) return;
        const texto = input.value.toLowerCase().trim();
        document.querySelectorAll('.tarjeta-area-vertical').forEach(t => {
            const contenido = t.innerText.toLowerCase();
            t.style.setProperty('display', contenido.includes(texto) ? 'flex' : 'none', 'important');
        });
    };
}

limpiarEntornoAdmin();