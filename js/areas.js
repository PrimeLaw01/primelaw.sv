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
        const urlLocal = window.location.href;
        
        // Valida si viene del administrador (Vercel o Local) o si tiene el parámetro admin
        const esAdmin = urlPadre.includes('primelaw_administrador_post.html') || 
                        urlPadre.includes('127.0.0.1') || 
                        urlLocal.includes('admin=true');

        if (esAdmin) {
            const estiloOcultar = document.createElement('style');
            estiloOcultar.innerHTML = `
                html, body {
                    pointer-events: auto !important;
                    background: #ffffff !important;
                    height: auto !important;
                }
                body::-webkit-scrollbar { display: none !important; }
                body {
                    scrollbar-width: none !important;
                    overflow-y: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }

                /* FORZAR VISIBILIDAD DE TARJETAS Y CONTENEDORES */
                main, section, .contenedor-cards-areas, #contenedor-areas, .tarjeta-area-vertical {
                    display: flex !important;
                    flex-direction: column !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    height: auto !important;
                    min-height: 50px !important;
                    transform: none !important;
                    padding: 5px !important;
                }

                .imagen-tarjeta-v {
                    height: 110px !important;
                    width: 100% !important;
                    display: block !important;
                    opacity: 1 !important;
                    object-fit: cover !important;
                }

                /* OCULTAR ELEMENTOS QUE NO SIRVEN EN EL ADMIN */
                header, footer, .seccion-ruta-legal, .contenedor-regresar, 
                .nav-container, .barra-copyright, #main-header, .encabezado-simple { 
                    display: none !important; 
                    height: 0 !important;
                }

                /* TEXTOS PEQUEÑOS */
                .contenido-tarjeta-v { padding: 10px !important; }
                .contenido-tarjeta-v h3 { font-size: 15px !important; margin-bottom: 5px !important; }
                .contenido-tarjeta-v p { font-size: 12px !important; line-height: 1.2 !important; }
            `;
            document.head.appendChild(estiloOcultar);

            const forzarLimpieza = () => {
                const estorbos = ['header', 'footer', '.seccion-ruta-legal', '.contenedor-regresar', '.encabezado-simple'];
                estorbos.forEach(s => {
                    const el = document.querySelector(s);
                    if (el) el.remove();
                });

                document.querySelectorAll('.tarjeta-area-vertical').forEach(t => {
                    t.classList.add('activo'); // Activa tu clase de CSS original
                    t.style.opacity = "1";
                    t.style.transform = "none";
                });
            };

            // Ejecuciones en cadena para asegurar el render local
            forzarLimpieza();
            window.addEventListener('load', forzarLimpieza);
            setTimeout(forzarLimpieza, 500);
            setTimeout(forzarLimpieza, 1500);
        }
    }
}

limpiarEntornoAdmin();