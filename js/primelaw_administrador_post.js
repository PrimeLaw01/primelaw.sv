function habilitarArrastre(idElemento) {
    const el = document.getElementById(idElemento);
    const lienzo = document.getElementById('lienzo-publicacion');
    if (!el || !lienzo) return;

    let activo = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function arrastreInicio(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === el || el.contains(e.target)) {
            activo = true;
        }
    }

    function arrastrando(e) {
        if (activo) {
            if (e.cancelable) e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, el);
        }
    }

    function setTranslate(xPos, yPos, el) {
        const rectLienzo = lienzo.getBoundingClientRect();
        const rectEl = el.getBoundingClientRect();

        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    function arrastreFin() {
        initialX = currentX;
        initialY = currentY;
        activo = false;
    }

    el.addEventListener("touchstart", arrastreInicio, { passive: false });
    window.addEventListener("touchend", arrastreFin, { passive: false });
    window.addEventListener("touchmove", arrastrando, { passive: false });

    el.addEventListener("mousedown", arrastreInicio, false);
    window.addEventListener("mouseup", arrastreFin, false);
    window.addEventListener("mousemove", arrastrando, false);
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
    
    if (window.innerWidth < 768) {
        document.getElementById('preview-lista-contenedor').style.top = "60%";
        document.getElementById('preview-lista-contenedor').style.left = "5%";
    }

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
            logging: false,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: lienzo.scrollWidth,
            windowHeight: lienzo.scrollHeight
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

        if (urls[nombreRed]) window.open(urls[nombreRed], '_blank');

        document.getElementById('notificacion-exito').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Error al procesar la imagen.");
    } finally {
        btn.innerText = "GENERAR Y ABRIR REDES";
        btn.disabled = false;
    }
}

function iniciarApp() {
    actualizarLienzo();
    const ids = ['preview-titulo', 'preview-subtitulo', 'preview-info', 'preview-lista-contenedor'];
    ids.forEach(id => habilitarArrastre(id));
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    iniciarApp();
} else {
    document.addEventListener("DOMContentLoaded", iniciarApp);
}