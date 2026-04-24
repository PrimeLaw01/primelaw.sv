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

// Ejecutar cuando la página termine de cargar
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