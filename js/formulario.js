const supabaseUrl = 'https://geopgruedclsmwdfuebi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

(function() {
    emailjs.init("kXiBDG5kOPaKhjPX7");
})();

const formulario = document.getElementById('formulario-prime');

if (formulario) {
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const camposInput = formulario.querySelectorAll('input');
        const campoTexto = formulario.querySelector('textarea');
        
        const datosEnvio = {
            nombre: camposInput[0].value,
            telefono: camposInput[1].value,
            asunto: camposInput[2].value,
            mensaje: campoTexto.value,
            reply_to: "primelaw.sv@gmail.com"
        };

        emailjs.send("service_v3t2fnl", "template_7j1x2ve", datosEnvio)
        .then(() => {
            alert("¡Consulta enviada exitosamente!");
            formulario.reset();
        })
        .catch((err) => {
            alert("Error detectado: " + err.text); 
            alert("Por favor, comunicarse a nuestro WhatsApp.");
            console.log("Estado del error:", err.status);
            console.error("Error completo:", err);
        });
    });
}

const derechosData = [
    { nombre: "Derecho Administrativo", img: "images/derAdministrativo.png" },
    { nombre: "Derecho Corporativo", img: "images/derAdministrativo.png" },
    { nombre: "Derecho Civil", img: "images/derCivil.png" },
    { nombre: "Derecho Mercantil", img: "images/derMercantil.png" },
    { nombre: "Derecho Tributario", img: "images/derTributario.png" },
    { nombre: "Derecho Aduanero", img: "images/derAduanero.png" },
    { nombre: "Derecho Laboral", img: "images/derLaboral.png" },
    { nombre: "Derecho Consumo", img: "images/derConsumo.png" },
    { nombre: "Propiedad Intelectual", img: "images/derPropiedadIntelectual.png" },
    { nombre: "Derecho Ambiental", img: "images/derAmbiental.png" },
    { nombre: "Derecho Notarial", img: "images/derNotarial.png" }
];

function redirigirADerecho(nombreTermino) {
    const rutaDestino = "html/areas.html";
    if (nombreTermino !== "") {
        window.location.href = `${rutaDestino}?buscar=${encodeURIComponent(nombreTermino)}`;
    } else {
        window.location.href = rutaDestino;
    }
}

function configurarBotonesDetalle() {
    const botones = document.querySelectorAll('.boton-buscar');
    
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const contenedor = this.closest('.info-area');
            if (contenedor) {
                const titulo = contenedor.querySelector('.nombre-area').innerText.trim();
                redirigirADerecho(titulo);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', configurarBotonesDetalle);

function buscarDesdeInicio() {
    const query = document.getElementById('busqueda-inicio').value.trim();
    redirigirADerecho(query);
}

function mostrarSugerencias() {
    const input = document.getElementById('busqueda-inicio');
    const lista = document.getElementById('lista-sugerencias');
    const texto = input.value.toLowerCase().trim();

    if (lista) {
        lista.innerHTML = "";

        if (texto === "") {
            lista.style.display = "none";
            return;
        }

        const filtrados = derechosData.filter(d => d.nombre.toLowerCase().includes(texto));

        if (filtrados.length > 0) {
            lista.style.display = "block";
            filtrados.forEach(derecho => {
                const div = document.createElement('div');
                div.className = 'item-sugerencia';
                div.innerHTML = `
                    <img src="${derecho.img}">
                    <span>${derecho.nombre}</span>
                `;
                div.onclick = () => redirigirADerecho(derecho.nombre);
                lista.appendChild(div);
            });
        } else {
            lista.style.display = "none";
        }
    }
}

function toggleOpciones() {
    const lista = document.getElementById('lista-sugerencias');
    if (lista) {
        if (lista.style.display === "block") {
            lista.style.display = "none";
        } else {
            lista.innerHTML = "";
            derechosData.forEach(derecho => {
                const div = document.createElement('div');
                div.className = 'item-sugerencia';
                div.innerHTML = `
                    <img src="${derecho.img}">
                    <span>${derecho.nombre}</span>
                `;
                div.onclick = () => redirigirADerecho(derecho.nombre);
                lista.appendChild(div);
            });
            lista.style.display = "block";
        }
    }
}

const inputBusqueda = document.getElementById('busqueda-inicio');
if (inputBusqueda) {
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarDesdeInicio();
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.contenedor-busqueda-principal')) {
        const lista = document.getElementById('lista-sugerencias');
        if (lista) lista.style.display = "none";
    }
});

async function cargarEquipo() {
    const { data: equipo, error } = await _supabase
        .from('quienes_somos')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });

    if (error) return console.error(error.message);

    const contenedor = document.getElementById('contenedor-equipo');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; 

    equipo.forEach(persona => {
        const listaTitulos = persona.titulos.map(t => `<li>${t}</li>`).join('');
        
        // Enlace corregido para evitar error de UUID en el perfil dinámico
        const urlPerfil = `html/perfil.html?id=${persona.id}`;

        const slideHTML = `
            <div class="swiper-slide">
                <div class="tarjeta-fundador revelar activo"> 
                    <div class="contenedor-foto-perfil revelar-izq activo">
                        <h3 class="nombre-lic">${persona.nombre}</h3>
                        <img src="${persona.foto_url}" alt="${persona.nombre}" class="foto-perfil">
                    </div>

                    <div class="info-fundador revelar-der activo">
                        <h3 class="cargo-fundador">${persona.cargo}</h3>
                        <ul class="lista-titulos">${listaTitulos}</ul>
                        <p class="frase-personal">${persona.frase_personal || ''}</p>
                        <a href="${urlPerfil}" style="text-decoration: none;">
                            <button class="boton-primario">Conoce más sobre mí</button>
                        </a>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += slideHTML;
    });

    new Swiper('.swiper-equipo', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
    });
}

document.addEventListener('DOMContentLoaded', cargarEquipo);