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
                    height: auto !important;
                    min-height: 100vh !important;
                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                }
                body::-webkit-scrollbar { display: none; }

                .contenedor-busqueda {
                    display: flex !important;
                    padding: 10px !important;
                    margin: 0 !important;
                    background: #f8f9fa !important;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .barra-busqueda {
                    width: 100% !important;
                    height: 35px !important;
                    background: #003f63 !important;
                    border-radius: 5px !important;
                    display: flex !important;
                    align-items: center !important;
                }
                .entrada-busqueda {
                    font-size: 13px !important;
                    color: white !important;
                    padding: 5px !important;
                }

                main.seccion-ruta-legal, .contenedor-cards-areas {
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    padding: 5px !important;
                    transform: none !important;
                }
                .tarjeta-area-vertical, article.revelar {
                    display: flex !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: none !important;
                    margin-bottom: 15px !important;
                    transition: none !important;
                    border: 1px solid #eee !important;
                }

                .imagen-tarjeta-v {
                    height: 110px !important;
                    width: 100% !important;
                    object-fit: cover !important;
                    display: block !important;
                }

                header, footer, .contenedor-regresar, .nav-container, .barra-copyright, .encabezado-principal { 
                    display: none !important; 
                }

                .contenido-tarjeta-v { padding: 10px !important; }
                .contenido-tarjeta-v h3 { font-size: 15px !important; color: #003f63 !important; margin-bottom: 2px !important; }
                .contenido-tarjeta-v p { font-size: 12px !important; line-height: 1.2 !important; }
            `;
            document.head.appendChild(estiloOcultar);

            const ejecutarLimpieza = () => {
                const estorbos = document.querySelectorAll('header, footer, .contenedor-regresar');
                estorbos.forEach(el => el.remove());

                document.querySelectorAll('.revelar, .tarjeta-area-vertical').forEach(card => {
                    card.classList.add('activo');
                    card.style.setProperty('opacity', '1', 'important');
                    card.style.setProperty('transform', 'none', 'important');
                });
            };

            ejecutarLimpieza();
            setTimeout(ejecutarLimpieza, 500);
            setTimeout(ejecutarLimpieza, 1500);
        }
    }
}

limpiarEntornoAdmin();