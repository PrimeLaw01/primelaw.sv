function habilitarArrastre(idElemento) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    el.onmousedown = function(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmousemove = function(e) {
            e = e || window.event;
            e.preventDefault();
            
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        };
    };
}

function seleccionarUnaRed(elemento) {
    const todasLasRedes = document.querySelectorAll('.tarjeta-red-admin');
    todasLasRedes.forEach(red => red.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');
}

function actualizarLienzo() {
    const titulo = document.getElementById('input-titulo').value || "Título del Post";
    const subtitulo = document.getElementById('input-subtitulo').value || "Subtítulo";
    const info = document.getElementById('input-info').value || "Descripción...";
    const tituloLista = document.getElementById('input-puntos').value || "";

    document.getElementById('preview-titulo').innerText = titulo;
    document.getElementById('preview-subtitulo').innerText = subtitulo;
    document.getElementById('preview-info').innerText = info;
    document.getElementById('preview-titulo-puntos').innerText = tituloLista;

    const viñetas = document.getElementById('input-viñetas').value;
    const listaUl = document.getElementById('preview-viñetas');
    listaUl.innerHTML = "";
    
    if (viñetas) {
        viñetas.split(';').forEach(p => {
            const li = document.createElement('li');
            li.innerText = p.trim();
            listaUl.appendChild(li);
        });
    }
}

function cambiarPlantilla(clase, elemento) {
    const lienzo = document.getElementById('lienzo-publicacion');
    const clasesActuales = Array.from(lienzo.classList).filter(c => c.startsWith('formato-'));
    lienzo.className = `lienzo-post ${clase} ${clasesActuales.join(' ')}`;
    document.querySelectorAll('.opcion-plantilla').forEach(op => op.classList.remove('activa'));
    elemento.classList.add('activa');
}

function cambiarTamano(formato, elemento) {
    const lienzo = document.getElementById('lienzo-publicacion');
    lienzo.classList.remove('formato-cuadrado', 'formato-horizontal');
    lienzo.classList.add(formato === 'cuadrado' ? 'formato-cuadrado' : 'formato-horizontal');
    document.querySelectorAll('.btn-formato').forEach(btn => btn.classList.remove('activo'));
    elemento.classList.add('activo');
}

document.getElementById('subir-fondo').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('fondo-post').style.backgroundImage = `url('${event.target.result}')`;
    };
    reader.readAsDataURL(e.target.files[0]);
});

async function exportarYPublicar() {
    const lienzo = document.getElementById('lienzo-publicacion');
    const btn = document.querySelector('.btn-ejecutar-final');
    const redSeleccionada = document.querySelector('.tarjeta-red-admin.seleccionada h4');

    if (!redSeleccionada) return alert("Por favor, selecciona una red social en el Paso 02.");

    const nombreRed = redSeleccionada.innerText.toLowerCase();
    btn.innerText = "PROCESANDO...";
    btn.disabled = true;

    try {
        let colorFondo = "#001a2c";
        if(lienzo.classList.contains('prime-light')) colorFondo = "#ffffff";
        if(lienzo.classList.contains('prime-impact')) colorFondo = "#c5a059";

        const canvas = await html2canvas(lienzo, {
            scale: 3,
            backgroundColor: colorFondo,
            useCORS: true,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `Post_PrimeLaw_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        const titulo = document.getElementById('preview-titulo').innerText;
        const info = document.getElementById('preview-info').innerText;
        const textoPost = `${titulo.toUpperCase()}\n\n${info}\n\n⚖️ Prime Law El Salvador`;
        await navigator.clipboard.writeText(textoPost);

        const urls = {
            'facebook': 'https://www.facebook.com',
            'instagram': 'https://www.instagram.com',
            'whatsapp': 'https://web.whatsapp.com',
            'linkedin': 'https://www.linkedin.com'
        };

        if (urls[nombreRed]) {
            window.open(urls[nombreRed], '_blank');
        }

        document.getElementById('notificacion-exito').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Error al procesar la imagen.");
    } finally {
        btn.innerText = "GENERAR Y ABRIR REDES";
        btn.disabled = false;
    }
}

window.onload = function() {
    actualizarLienzo();
    
    const elementosParaMover = [
        'preview-titulo', 
        'preview-subtitulo', 
        'preview-info', 
        'preview-viñetas', 
        'preview-lista-contenedor'
    ];

    elementosParaMover.forEach(id => {
        habilitarArrastre(id);
    });
};