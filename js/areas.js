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
                /* 1. Reset total del lienzo del iframe */
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

                /* 2. Forzar que el contenedor principal sea visible y ocupe espacio */
                main.seccion-ruta-legal, 
                .contenedor-cards-areas {
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    padding: 10px !important;
                    margin: 0 !important;
                    transform: none !important;
                }

                /* 3. Forzar que TODAS las tarjetas aparezcan (Anula .revelar) */
                .tarjeta-area-vertical, 
                article.revelar,
                .tarjeta-area-vertical.revelar {
                    display: flex !important;
                    flex-direction: column !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: none !important;
                    margin-bottom: 20px !important;
                    border: 1px solid #eee !important;
                    background: #fff !important;
                    transition: none !important;
                }

                /* 4. Ajuste de imágenes para que no se rompan */
                .tarjeta-area-vertical img, 
                .imagen-tarjeta-v {
                    height: 120px !important;
                    width: 100% !important;
                    display: block !important;
                    object-fit: cover !important;
                    opacity: 1 !important;
                }

                /* 5. Ocultar el resto de la web */
                header, footer, .contenedor-busqueda, .contenedor-regresar, 
                .nav-container, .barra-copyright, .encabezado-principal { 
                    display: none !important; 
                }

                /* 6. Optimizar textos */
                .contenido-tarjeta-v { padding: 15px !important; }
                .contenido-tarjeta-v h3 { font-size: 16px !important; color: #003f63 !important; }
                .contenido-tarjeta-v p { font-size: 13px !important; line-height: 1.3 !important; }
            `;
            document.head.appendChild(estiloOcultar);

            const ejecutarLimpieza = () => {
                // Borramos físicamente los elementos que estorban
                const estorbos = document.querySelectorAll('header, footer, .contenedor-busqueda, .contenedor-regresar');
                estorbos.forEach(el => el.remove());

                // Forzamos manualmente que cada tarjeta ignore el IntersectionObserver
                const cards = document.querySelectorAll('.tarjeta-area-vertical');
                cards.forEach(card => {
                    card.classList.remove('revelar'); // Quitamos la clase que la oculta
                    card.classList.add('activo');    // Ponemos la que la muestra
                    card.style.setProperty('opacity', '1', 'important');
                    card.style.setProperty('transform', 'none', 'important');
                    card.style.setProperty('visibility', 'visible', 'important');
                });
            };

            // Ejecución inmediata y repetitiva para "ganarle" a los otros scripts
            ejecutarLimpieza();
            window.onload = ejecutarLimpieza;
            
            let i = 0;
            const loop = setInterval(() => {
                ejecutarLimpieza();
                i++;
                if (i > 10) clearInterval(loop); // Insiste por 5 segundos
            }, 500);
        }
    }
}

limpiarEntornoAdmin();