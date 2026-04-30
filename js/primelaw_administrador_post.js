const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const imagenesGaleria = [
    '../images/derAdministrativo.png', '../images/derCorporativo.png',
    '../images/derCivil.png', '../images/derMercantil.png',
    '../images/derTributario.png', '../images/derAduanero.png',
    '../images/derLaboral.png', '../images/derConsumo.png',
    '../images/derPropiedadIntelectual.png', '../images/derAmbiental.png',
    '../images/derNotarial.png'
];

const textosPorDefecto = {
    'preview-titulo': 'Título',
    'preview-subtitulo': 'Subtítulo',
    'preview-info': 'Descripción...'
};

function habilitarArrastre(idElemento) {
    const el = document.getElementById(idElemento);
    if (!el) return;
    let activo = false;
    let currentX = 0, currentY = 0, initialX, initialY, xOffset = 0, yOffset = 0;
    
    function inicio(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === el || el.contains(e.target)) activo = true;
    }
    function moviendo(e) {
        if (activo) {
            if (e.cancelable) e.preventDefault();
            currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - initialX;
            currentY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - initialY;
            xOffset = currentX; yOffset = currentY;
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }
    function fin() { initialX = currentX; initialY = currentY; activo = false; }
    el.addEventListener("touchstart", inicio, { passive: false });
    window.addEventListener("touchend", fin, { passive: false });
    window.addEventListener("touchmove", moviendo, { passive: false });
    el.addEventListener("mousedown", inicio, false);
    window.addEventListener("mouseup", fin, false);
    window.addEventListener("mousemove", moviendo, false);
}

function actualizarLienzo() {
    const tVal = document.getElementById('input-titulo').value;
    const sVal = document.getElementById('input-subtitulo').value;
    const iVal = document.getElementById('input-info').value;
    
    document.getElementById('preview-titulo').innerText = tVal || textosPorDefecto['preview-titulo'];
    document.getElementById('preview-subtitulo').innerText = sVal || textosPorDefecto['preview-subtitulo'];
    document.getElementById('preview-info').innerText = iVal || textosPorDefecto['preview-info'];
    
    document.getElementById('preview-titulo-puntos').innerText = document.getElementById('input-puntos').value || "";
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

function habilitarEscalado(idElemento) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    let fontSize = parseInt(window.getComputedStyle(el).fontSize);

    el.addEventListener("wheel", (e) => {
        e.preventDefault();

        const delta = e.deltaY > 0 ? -2 : 2;
        fontSize = Math.max(10, fontSize + delta);

        el.style.fontSize = `${fontSize}px`;
    }, { passive: false });

    let initialDist = 0;
    el.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );

            if (initialDist > 0) {
                if (dist > initialDist) fontSize += 1;
                else fontSize -= 1;
                el.style.fontSize = `${fontSize}px`;
            }
            initialDist = dist;
        }
    }, { passive: false });

    el.addEventListener("touchend", () => { initialDist = 0; });
}

function annadirControlesVisuales(idElemento) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    const controles = document.createElement('div');
    controles.className = 'controles-flotantes-tamano';
    controles.innerHTML = `
        <button class="btn-zoom" onclick="cambiarFuente('${idElemento}', 2)">+</button>
        <button class="btn-zoom" onclick="cambiarFuente('${idElemento}', -2)">-</button>
    `;

    el.style.position = 'relative';
    el.appendChild(controles);
}

function cambiarFuente(id, delta) {
    const el = document.getElementById(id);
    const texto = el.tagName === 'DIV' ? el.querySelector('h1, h2, p, strong') : el;
    
    if (texto) {
        let currentSize = parseInt(window.getComputedStyle(texto).fontSize);
        texto.style.fontSize = (currentSize + delta) + "px";
    }
}


function irA(plataforma) {
    const urls = {
        'chatgpt': 'https://chat.openai.com',
        'claude': 'https://claude.ai',
        'gemini': 'https://gemini.google.com'
    };
    
    window.open(urls[plataforma], '_blank');
}


function borrarBorrador() {
    const areaNotas = document.getElementById('bloc-notas');
    
    if (!areaNotas) {
        console.error("No se encontró el elemento 'bloc-notas'");
        return;
    }

    if (areaNotas.value.trim() !== "") {
        if (confirm("¿Seguro que quieres borrar tus notas?")) {
            areaNotas.value = "";
            console.log("Borrador limpiado con éxito");
        }
    } else {
        areaNotas.value = "";
    }
}

function abrirBiblioteca() {
    const modal = document.getElementById('modal-biblioteca');
    const lista = document.getElementById('lista-recursos');
    lista.innerHTML = '';
    imagenesGaleria.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'recurso-galeria';
        img.onclick = () => {
            const fondo = document.getElementById('fondo-post');
            fondo.style.backgroundImage = `url('${url}')`;
            fondo.style.backgroundSize = "cover";
            document.getElementById('drop-zone').innerHTML = `<i class="fa-solid fa-check" style="color: #c5a059;"></i> <p>Imagen cargada</p>`;
            cerrarBiblioteca();
        };
        lista.appendChild(img);
    });
    modal.style.display = 'flex';
}

function cerrarBiblioteca() { document.getElementById('modal-biblioteca').style.display = 'none'; }

async function exportarYPublicar() {
    const lienzo = document.getElementById('lienzo-publicacion');
    const btn = document.querySelector('.btn-ejecutar-final');
    const red = document.querySelector('.tarjeta-red-admin.seleccionada h4');
    if (!red) return alert("Selecciona una red social.");
    
    btn.innerText = "PROCESANDO...";
    btn.disabled = true;

    const ids = ['preview-titulo', 'preview-subtitulo', 'preview-info'];
    const ocultados = [];
    ids.forEach(id => {
        const el = document.getElementById(id);
        const txt = el.innerText.trim().toLowerCase();
        if (txt === textosPorDefecto[id].toLowerCase() || txt === 'subtítulo' || txt === 'subtitulo') {
            el.style.visibility = 'hidden';
            ocultados.push(el);
        }
    });

    try {
        let bg = lienzo.classList.contains('prime-light') ? "#ffffff" : (lienzo.classList.contains('prime-impact') ? "#c5a059" : "#001a2c");
        const canvas = await html2canvas(lienzo, { scale: 3, backgroundColor: bg, useCORS: true });
        ocultados.forEach(el => el.style.visibility = 'visible');

        const link = document.createElement('a');
        link.download = `Post_PrimeLaw_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        const t = document.getElementById('preview-titulo').innerText;
        const i = document.getElementById('preview-info').innerText;
        const txtT = (t.toLowerCase() === textosPorDefecto['preview-titulo'].toLowerCase()) ? '' : t.toUpperCase();
        const txtI = (i.toLowerCase() === textosPorDefecto['preview-info'].toLowerCase()) ? '' : i;
        await navigator.clipboard.writeText(`${txtT}\n\n${txtI}\n\n⚖️ Prime Law El Salvador`.trim());

        const urls = { 'facebook': 'https://www.facebook.com', 'instagram': 'https://www.instagram.com', 'whatsapp': 'https://web.whatsapp.com', 'linkedin': 'https://www.linkedin.com' };
        if (urls[red.innerText.toLowerCase()]) window.open(urls[red.innerText.toLowerCase()], '_blank');
        document.getElementById('notificacion-exito').style.display = 'block';
    } catch (err) { alert("Error al exportar."); }
    finally { btn.innerText = "GENERAR Y ABRIR REDES"; btn.disabled = false; }
}

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('subir-fondo');
if (dropZone && fileInput) {
    dropZone.onclick = () => fileInput.click();
    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.borderColor = "#c5a059"; };
    dropZone.ondragleave = () => dropZone.style.borderColor = "#ddd";
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#ddd";
        if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; procesarImagen(e.dataTransfer.files[0]); }
    };
    fileInput.onchange = function() { if (this.files[0]) procesarImagen(this.files[0]); };
}

function procesarImagen(archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const fondo = document.getElementById('fondo-post');
        fondo.style.backgroundImage = `url('${e.target.result}')`;
        fondo.style.backgroundSize = "cover";
        fondo.style.backgroundPosition = "center";
        document.getElementById('drop-zone').innerHTML = `<i class="fa-solid fa-check" style="color: #c5a059;"></i> <p>Imagen cargada</p>`;
    };
    reader.readAsDataURL(archivo);
}

function seleccionarUnaRed(elemento) {
    document.querySelectorAll('.tarjeta-red-admin').forEach(red => red.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');
}

function cambiarPlantilla(clase, elemento) {
    const lienzo = document.getElementById('lienzo-publicacion');
    const clasesF = Array.from(lienzo.classList).filter(c => c.startsWith('formato-'));
    lienzo.className = `lienzo-post ${clase} ${clasesF.join(' ')}`;
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

function cambiarFuente(idPreview, delta) {
    const el = document.getElementById(idPreview);
    if (!el) return;

    let currentSize = parseInt(window.getComputedStyle(el).fontSize);
    
    el.style.fontSize = (currentSize + delta) + "px";
    
    console.log(`Nuevo tamaño para ${idPreview}: ${el.style.fontSize}`);
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarLienzo();
    
    const elementosInteractivos = ['preview-titulo', 'preview-subtitulo', 'preview-info', 'preview-lista-contenedor'];
    
    elementosInteractivos.forEach(id => {
        habilitarArrastre(id);
        habilitarEscalado(id);
        añadirControlesVisuales(id);
    });
});
window.onclick = (e) => { if (e.target == document.getElementById('modal-biblioteca')) cerrarBiblioteca(); };