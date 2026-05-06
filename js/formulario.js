const supabaseUrl = 'https://geopgruedclsmwdfuebi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

(function() {
    emailjs.init("kXiBDG5kOPaKhjPX7");
})();

const formulario = document.getElementById('formulario-prime');

if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const campos = formulario.querySelectorAll('input, textarea');
        const datos = {
            nombre: campos[0].value,
            telefono: campos[1].value,
            asunto: campos[2].value,
            mensaje: campos[3].value
        };

        const { error } = await _supabase.from('consultas_contacto').insert([datos]);

        if (!error) {
            emailjs.send("service_v3t2fnl", "template_7j1x2ve", {
                nombre: datos.nombre,
                telefono: datos.telefono,
                asunto: datos.asunto,
                mensaje: datos.mensaje,
                reply_to: "primelaw.sv@gmail.com"
            })
            .then(() => {
                alert("¡Consulta enviada exitosamente!");
                formulario.reset();
            }, (err) => {
                console.error(err);
            });
        }
    });
}

const derechosData = [
    { nombre: "Derecho Administrativo", img: "images/derAdministrativo.png" },
    { nombre: "Derecho Corporativo", img: "images/derCorporativo.png" },
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

function buscarDesdeInicio() {
    const query = document.getElementById('busqueda-inicio').value.trim();
    redirigirADerecho(query);
}

function mostrarSugerencias() {
    const input = document.getElementById('busqueda-inicio');
    const lista = document.getElementById('lista-sugerencias');
    const texto = input.value.toLowerCase().trim();

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

function toggleOpciones() {
    const lista = document.getElementById('lista-sugerencias');
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