const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarPerfil() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const { data: p, error } = await _supabase.from('quienes_somos').select('*').eq('id', id).single();
    if (error || !p) return;

    document.getElementById('nombre-profesional').innerText = p.nombre.toUpperCase();
    document.getElementById('cargo-profesional').innerText = p.cargo.toUpperCase();
    document.getElementById('foto-profesional').src = p.foto_perfil_detallada || p.foto_url;
    document.getElementById('bio-profesional').innerHTML = `<p>${p.biografia_larga || p.frase_personal || ""}</p>`;
    const contenedor = document.getElementById('contenedor-detalles-dinamicos');
    let htmlFinal = "";

    const renderBloque = (titulo, datos, esListaPura) => {
        if (!datos || !Array.isArray(datos) || datos.length === 0) return "";
        
        let h = `<div class="bloque-detalle" data-aos="fade-up"><h2 class="titulo-cinzel">${titulo}</h2>`;
        
        if (esListaPura) {
            h += `<ul class="lista-vinetas-premium">`;
            datos.forEach(d => {
                const texto = typeof d === 'string' ? d : (d.texto || d.detalle || "");
                if (texto) h += `<li>${texto}</li>`;
            });
            h += `</ul>`;
        } else {
            datos.forEach(i => {
                // Si la descripción es una lista de puntos, la convertimos a <li>
                let descripcionHTML = "";
                if (i.descripcion) {
                    if (Array.isArray(i.vinetas)) { 
                        // Opción para manejar puntos específicos si los separas en la BD
                        descripcionHTML = `<ul class="lista-vinetas-premium">`;
                        i.vinetas.forEach(v => descripcionHTML += `<li>${v}</li>`);
                        descripcionHTML += `</ul>`;
                    } else {
                        // Si es texto normal, usamos la clase 'investigacion' que tiene el borde dorado
                        descripcionHTML = `<p class="investigacion">${i.descripcion}</p>`;
                    }
                }

                h += `
                <div class="timeline-item">
                    <div class="anio">${i.anio || i.año || ''}</div>
                    <div class="info-historial">
                        <span class="subtitulo-profesional">${i.titulo || i.puesto || ''}</span>
                        <p>${i.institucion || i.lugar || ''}</p>
                        ${descripcionHTML}
                    </div>
                </div>`;
            });
        }
        return h + `</div>`;
    };

    htmlFinal += renderBloque("FORMACIÓN ACADÉMICA", p.formacion, false);
    htmlFinal += renderBloque("ACREDITACIONES", p.acreditaciones, true);
    htmlFinal += renderBloque("EXPERIENCIA LABORAL", p.experiencia, false);
    htmlFinal += renderBloque("EXPERIENCIA DOCENTE", p.docente, false);
    htmlFinal += renderBloque("RECONOCIMIENTOS", p.reconocimientos, true);

    contenedor.innerHTML = htmlFinal;

    if (window.AOS) setTimeout(() => AOS.refresh(), 100);
}

document.addEventListener('DOMContentLoaded', cargarPerfil);

async function cargarCarruselEquipo() {
    const contenedor = document.getElementById('contenedor-equipo');
    if (!contenedor) return;

    const { data: miembros, error } = await _supabase
        .from('quienes_somos')
        .select('*')
        .order('orden', { ascending: true });

    if (error || !miembros || miembros.length === 0) {
        console.error('Error al cargar equipo o datos vacíos:', error);
        return;
    }

    contenedor.innerHTML = miembros.map(m => `
        <div class="swiper-slide">
            <div class="tarjeta-equipo-slider">
                <div class="foto-equipo-wrapper">
                    <img src="${m.foto_url || '../images/logo.png'}" alt="${m.nombre}">
                </div>
                <h3>${m.nombre}</h3>
                <p class="cargo-slider">${m.cargo || ''}</p>
                <p class="frase-slider">"${m.frase_personal || ''}"</p>
                <a href="../html/perfil.html?id=${m.id}" class="boton-ver-perfil">Ver perfil completo</a>
            </div>
        </div>
    `).join('');

    new Swiper('.swiper-equipo', {
        slidesPerView: 1,
        spaceBetween: 25,
        loop: miembros.length > 1,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contenedor-equipo')) {
        cargarCarruselEquipo();
    }
});