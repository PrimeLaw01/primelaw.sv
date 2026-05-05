const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let datosAreas = [];

async function precargarDatos() {
    console.log("Precargando base de datos...");
    const { data, error } = await _supabase
        .from('informacion_derechos')
        .select('*');

    if (error) {
        console.error("Error precargando datos:", error.message);
        return;
    }
    datosAreas = data;
    console.log("Datos listos para usar.");
}

window.addEventListener('DOMContentLoaded', precargarDatos);

function abrirModal(slugParaBuscar) {
    if (!slugParaBuscar) return;

    const modal = document.getElementById('modal-derecho');
    
    const registro = datosAreas.find(a => a.slug === slugParaBuscar);

    if (registro) {
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
        console.warn("No se encontró el área en los datos precargados:", slugParaBuscar);
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
    const esIframe = window.self !== window.top;
    const urlPadre = document.referrer;
    const hostname = window.location.hostname;
    const esAdminParam = window.location.search.includes('admin=true');

    const esAdmin = esIframe || 
                    hostname === "127.0.0.1" || 
                    hostname === "localhost" || 
                    esAdminParam ||
                    urlPadre.includes('primelaw_administrador_post.html');

    if (esAdmin) {
        const estiloOcultar = document.createElement('style');
        estiloOcultar.innerHTML = `
            header, footer, .contenedor-regresar, .nav-container, .barra-copyright, .whatsapp-float { 
                display: none !important; 
            }
            html, body { 
                background: #ffffff !important; 
                margin: 0 !important; 
                padding: 0 !important; 
            }
            body::-webkit-scrollbar { display: none; }
            .seccion-ruta-legal { padding: 0 !important; }
            
            .contenedor-busqueda {
                display: flex !important;
                padding: 10px !important;
                position: sticky !important;
                top: 0 !important;
                z-index: 1000 !important;
                background: white !important;
                border-bottom: 1px solid #eee;
            }

            .contenedor-cards-areas { 
                display: flex !important; 
                flex-direction: column !important;
                gap: 12px !important;
                padding: 15px !important; 
            }

            .tarjeta-area-vertical {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                height: auto !important;
                min-height: 100px !important;
                padding: 10px !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 10px !important;
                background: white !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.03) !important;
                opacity: 1 !important;
                transform: none !important;
                margin: 0 !important;
            }

            .imagen-tarjeta-v {
                width: 80px !important;
                height: 80px !important;
                min-width: 80px !important;
                max-width: 80px !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                flex-shrink: 0 !important;
            }

            .contenido-tarjeta-v {
                padding: 0 12px !important;
                flex-grow: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                overflow: hidden !important;
            }

            .contenido-tarjeta-v h3 { 
                font-size: 15px !important; 
                margin: 0 0 4px 0 !important; 
                color: #003f63 !important;
            }

            .contenido-tarjeta-v p { 
                font-size: 12px !important; 
                margin: 0 !important; 
                line-height: 1.3 !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 2 !important;
                -webkit-box-orient: vertical !important;
                overflow: hidden !important;
            }

            .modal-contenido { width: 95% !important; max-height: 90vh !important; }
        `;
        document.head.appendChild(estiloOcultar);

        const aplicarLogica = () => {
            const buscador = document.getElementById('input-busqueda');
            if (buscador && !buscador.dataset.hooked) {
                buscador.addEventListener('input', filtrarAreas);
                buscador.dataset.hooked = "true";
            }
            document.querySelectorAll('.tarjeta-area-vertical').forEach(t => {
                t.classList.add('activo');
            });
        };

        if (document.readyState === 'complete') {
            aplicarLogica();
        } else {
            window.addEventListener('load', aplicarLogica);
        }
        setTimeout(aplicarLogica, 500);
        setTimeout(aplicarLogica, 1500);
    }
}

function filtrarAreas() {
    const input = document.getElementById('input-busqueda');
    if (!input) return;
    const texto = input.value.toLowerCase().trim();
    
    document.querySelectorAll('.tarjeta-area-vertical').forEach(t => {
        const contenido = t.textContent.toLowerCase();
        if (contenido.includes(texto)) {
            t.style.setProperty('display', 'flex', 'important');
            t.style.setProperty('opacity', '1', 'important');
        } else {
            t.style.setProperty('display', 'none', 'important');
        }
    });
}

limpiarEntornoAdmin();