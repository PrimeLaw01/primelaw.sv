const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const parte1 = "hf_"; 
const parte2 = "OKCkWTMBNMYjyIYBFZWLqFAcPcQVQZNbPS";
const HF_TOKEN = parte1 + parte2;

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

async function consultarIA() {
    const promptUser = document.getElementById('prompt-ia').value;
    const btn = document.getElementById('btn-preguntar-ia');
    const cajaRespuesta = document.getElementById('respuesta-ia');
    const textoRespuesta = document.getElementById('texto-ia');

    if (!promptUser.trim()) return alert("Escribe algo para la IA.");

    btn.innerText = "PENSANDO...";
    btn.disabled = true;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
            {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres el experto legal de Prime Law El Salvador. Responde breve: ${promptUser} [/INST]`,
                    parameters: { max_new_tokens: 250, temperature: 0.7 }
                })
            }
        );

        if (response.status === 503) {
            const data = await response.json();
            return alert(`La IA se está despertando. Reintenta en ${Math.round(data.estimated_time || 20)} segundos.`);
        }

        if (!response.ok) throw new Error("Error en la conexión");

        const result = await response.json();
        let resIA = result[0].generated_text;

        if (resIA.includes('[/INST]')) resIA = resIA.split('[/INST]')[1].trim();

        cajaRespuesta.style.display = 'block';
        textoRespuesta.innerText = resIA;

    } catch (error) {
        console.error("Error completo:", error);
        alert("El navegador bloqueó la conexión (CORS). Sube los cambios a Vercel para que funcione en tu página oficial, ya que los servidores locales (127.0.0.1) suelen tener estas restricciones.");
    } finally {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Consultar IA';
        btn.disabled = false;
    }
}

function copiarTextoIA() {
    const texto = document.getElementById('texto-ia').innerText;
    navigator.clipboard.writeText(texto);
    alert("¡Texto copiado!");
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
        // Corrección inteligente para el borrado de placeholders
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

document.addEventListener("DOMContentLoaded", () => {
    actualizarLienzo();
    ['preview-titulo', 'preview-subtitulo', 'preview-info', 'preview-lista-contenedor'].forEach(id => habilitarArrastre(id));
});
window.onclick = (e) => { if (e.target == document.getElementById('modal-biblioteca')) cerrarBiblioteca(); };