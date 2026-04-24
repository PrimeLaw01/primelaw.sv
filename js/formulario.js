const supabaseUrl = 'https://geopgruedclsmwdfuebi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);


(function() {
    emailjs.init("kXiBDG5kOPaKhjPX7");
})();

const formulario = document.querySelector('form');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombre: formulario.querySelector('input[placeholder*="José"]').value,
        telefono: formulario.querySelector('input[placeholder*="0000"]').value,
        asunto: formulario.querySelector('input[placeholder*="Asesoría"]').value,
        mensaje: formulario.querySelector('textarea').value
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
            alert("¡Consulta enviada! Hemos guardado su información y le contactaremos pronto.");
            formulario.reset();
        }, (err) => {
            alert("Los datos se guardaron, pero hubo un error enviando el correo de aviso.");
            console.error("Error EmailJS:", err);
        });

    } else {
        alert("Error al guardar en la base de datos: " + error.message);
    }
});


function buscarDesdeInicio() {
    const query = document.getElementById('busqueda-inicio').value.trim();
    
    if (query !== "") {
        window.location.href = `html/areas.html?buscar=${encodeURIComponent(query)}`;
    } else {
        window.location.href = `html/areas.html`;
    }
}

document.getElementById('busqueda-inicio').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarDesdeInicio();
    }
});


const derechosData = [
    { nombre: "Derecho Administrativo", slug: "derecho-administrativo", img: "images/derAdministrativo.png" },
    { nombre: "Derecho Corporativo", slug: "derecho-corporativo", img: "images/derCorporativo.png" },
    { nombre: "Derecho Civil", slug: "derecho-civil", img: "images/derCivil.png" },
    { nombre: "Derecho Mercantil", slug: "derecho-mercantil", img: "images/derMercantil.png" },
    { nombre: "Derecho Tributario", slug: "derecho-tributario", img: "images/derTributario.png" },
    { nombre: "Derecho Aduanero", slug: "derecho-aduanero", img: "images/derAduanero.png" },
    { nombre: "Derecho Laboral", slug: "derecho-laboral", img: "images/derLaboral.png" },
    { nombre: "Derecho Consumo", slug: "derecho-consumo", img: "images/derConsumo.png" },
    { nombre: "Propiedad Intelectual", slug: "propiedad-intelectual", img: "images/derPropiedadIntelectual.png" },
    { nombre: "Derecho Ambiental", slug: "derecho-ambiental", img: "images/derAmbiental.png" },
    { nombre: "Derecho Notarial", slug: "derecho-notarial", img: "images/derNotarial.png" }
];

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
            div.onclick = () => redirigirADerecho(derecho.slug);
            lista.appendChild(div);
        });
    } else {
        lista.style.display = "none";
    }
}

// Función para el botón "Ver opciones"
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
            div.onclick = () => redirigirADerecho(derecho.slug);
            lista.appendChild(div);
        });
        lista.style.display = "block";
    }
}

function redirigirADerecho(slug) {
    window.location.href = `html/areas.html?buscar=${slug}`;
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.contenedor-busqueda-principal')) {
        document.getElementById('lista-sugerencias').style.display = "none";
    }
});