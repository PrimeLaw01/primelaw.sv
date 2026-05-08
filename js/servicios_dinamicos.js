const URL_PROYECTO = 'https://geopgruedclsmwdfuebi.supabase.co';
const LLAVE_PUBLICA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';
const clienteSupabase = supabase.createClient(URL_PROYECTO, LLAVE_PUBLICA);

async function cargarServiciosDesdeBD() {
    const { data: listaServicios, error } = await clienteSupabase
        .from('servicios')
        .select('*')
        .order('orden', { ascending: true });

    if (error) {
        console.error("Error al obtener datos:", error);
        return;
    }

    const areaDestino = document.getElementById('contenedor-servicios-dinamico');
    
    if (!areaDestino) {
        console.error("No se encontró el contenedor #contenedor-servicios-dinamico");
        return;
    }

    let contenidoHtml = "";

    listaServicios.forEach((item) => {
        // Configuramos la dirección del diseño (normal o invertido)
        const estiloBloque = item.invertido ? 'bloque-servicio invertido revelar-der' : 'bloque-servicio revelar-izq';
        
        // Creamos la lista de puntos (checks)
        // Nota: Asegúrate que en la BD 'lista_puntos' sea un array o texto separado por comas
        const puntosHtml = Array.isArray(item.lista_puntos) 
            ? item.lista_puntos.map(p => `<li><i class="fa-solid fa-circle-check"></i> ${p}</li>`).join('')
            : `<li><i class="fa-solid fa-circle-check"></i> ${item.lista_puntos}</li>`;

        contenidoHtml += `
            <div class="${estiloBloque}">
                <img src="${item.imagen_url}" alt="${item.nombre}" class="imagen-servicio-detalle">
                <div class="texto-servicio-detalle">
                    <h2>${item.nombre}</h2>
                    <p>${item.descripcion}</p>
                    <ul class="check-lista">
                        ${puntosHtml}
                    </ul>
                </div>
            </div>`;
    });

    areaDestino.innerHTML = contenidoHtml;

    // Ejecutar el observador de animaciones
    iniciarAnimacionesDeEntrada();
}

function iniciarAnimacionesDeEntrada() {
    const vigilante = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('activo');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.revelar, .revelar-izq, .revelar-der').forEach(elemento => {
        vigilante.observe(elemento);
    });
}

document.addEventListener('DOMContentLoaded', cargarServiciosDesdeBD);