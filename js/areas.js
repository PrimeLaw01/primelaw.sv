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
                    margin: 0 !important;
                    padding: 0 !important;
                }
                body::-webkit-scrollbar { display: none; }

                /* 1. BARRA DE BÚSQUEDA COMPACTA */
                .seccion-ruta-legal { padding: 0 !important; }
                .contenedor-busqueda {
                    display: flex !important;
                    padding: 8px !important;
                    margin: 0 !important;
                    position: sticky !important;
                    top: 0 !important;
                    z-index: 1000 !important;
                    background: white !important;
                    border-bottom: 1px solid #eee;
                }

                /* 2. TARJETAS VERSIÓN MINI */
                .contenedor-cards-areas {
                    display: block !important;
                    padding: 8px !important;
                }

                .tarjeta-area-vertical {
                    display: flex !important;
                    flex-direction: row !important; /* Asegura que imagen y texto estén alineados */
                    height: 90px !important;       /* Altura fija pequeña */
                    margin-bottom: 8px !important;  /* Menos espacio entre tarjetas */
                    padding: 5px !important;
                    border: 1px solid #ddd !important;
                    border-radius: 8px !important;
                    overflow: hidden !important;
                    opacity: 1 !important;
                    transform: none !important;
                }

                .imagen-tarjeta-v {
                    width: 80px !important;        /* Imagen más estrecha */
                    height: 100% !important;       /* Que ocupe el alto de la tarjeta */
                    min-width: 80px !important;
                    border-radius: 5px !important;
                    object-fit: cover !important;
                }

                .contenido-tarjeta-v {
                    padding: 0 10px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    width: calc(100% - 80px) !important;
                }

                .contenido-tarjeta-v h3 {
                    font-size: 13px !important;    /* Título más pequeño */
                    margin: 0 !important;
                    line-height: 1.1 !important;
                    color: #003f63 !important;
                }

                .contenido-tarjeta-v p {
                    font-size: 11px !important;    /* Texto de descripción pequeño */
                    margin: 2px 0 !important;
                    line-height: 1.2 !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2 !important; /* Máximo 2 líneas de texto */
                    -webkit-box-orient: vertical !important;
                    overflow: hidden !important;
                }

                .contenido-tarjeta-v a {
                    font-size: 10px !important;    /* Enlace "¿Qué incluye?" */
                    margin-top: 2px !important;
                    text-decoration: underline !important;
                }

                .modal-contenido { width: 95% !important; padding: 15px !important; }
                #modal-titulo { font-size: 16px !important; }
                .descripcion-legal { font-size: 12px !important; }
                
                header, footer, .contenedor-regresar { display: none !important; }
            `;
            document.head.appendChild(estiloOcultar);

            const ejecutarLimpieza = () => {
                const buscador = document.getElementById('input-busqueda');
                if (buscador) buscador.addEventListener('input', filtrarAreas);

                document.querySelectorAll('.tarjeta-area-vertical').forEach(card => {
                    card.classList.add('activo');
                    card.style.setProperty('display', 'flex', 'important');
                });
            };

            ejecutarLimpieza();
            setTimeout(ejecutarLimpieza, 500);
        }
    }
}

limpiarEntornoAdmin();