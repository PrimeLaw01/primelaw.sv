/**
 * ADMINISTRADOR DE POSTS - PRIME LAW
 * Versión 2026 - Con Arrastre y Multi-Redes
 */

// 1. ARRASTRE DE TEXTOS (DRAG & DROP)
function habilitarArrastre(idElemento) {
    const el = document.getElementById(idElemento);
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    el.onmousedown = function(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = function(e) {
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

// 2. ACTUALIZACIÓN DE TEXTOS
function actualizarLienzo() {
    document.getElementById('preview-titulo').innerText = document.getElementById('input-titulo').value || "Título del Post";
    document.getElementById('preview-subtitulo').innerText = document.getElementById('input-subtitulo').value || "Subtítulo";
    document.getElementById('preview-info').innerText = document.getElementById('input-info').value || "Descripción...";
    document.getElementById('preview-titulo-puntos').innerText = document.getElementById('input-puntos').value || "";

    const viñetas = document.getElementById('input-viñetas').value;
    const listaUl = document.getElementById('preview-viñetas');
    listaUl.innerHTML = "";
    if (viñetas) {
        viñetas.split(',').forEach(p => {
            const li = document.createElement('li');
            li.innerText = p.trim();
            listaUl.appendChild(li);
        });
    }
}

// 3. CAMBIO DE PLANTILLA Y TAMAÑO
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

// 4. FONDO DE IMAGEN
document.getElementById('subir-fondo').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('fondo-post').style.backgroundImage = `url('${event.target.result}')`;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 5. EXPORTACIÓN Y APERTURA DE REDES
async function exportarYPublicar() {
    const lienzo = document.getElementById('lienzo-publicacion');
    const btn = document.querySelector('.btn-ejecutar-final');
    
    // Validar redes
    const seleccionadas = Array.from(document.querySelectorAll('.tarjeta-red-admin.seleccionada h4'))
                               .map(h => h.innerText.toLowerCase());
    if (seleccionadas.length === 0) return alert("Selecciona al menos una red social.");

    btn.innerText = "PROCESANDO...";
    btn.disabled = true;

    try {
        // Detectar color de fondo para la captura
        let colorFondo = "#001a2c";
        if(lienzo.classList.contains('prime-light')) colorFondo = "#ffffff";
        if(lienzo.classList.contains('prime-impact')) colorFondo = "#c5a059";

        // Captura de Imagen
        const canvas = await html2canvas(lienzo, {
            scale: 3,
            backgroundColor: colorFondo,
            useCORS: true
        });

        const link = document.createElement('a');
        link.download = `Post_PrimeLaw_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Copiar Texto
        const textoPost = `${document.getElementById('preview-titulo').innerText}\n${document.getElementById('preview-info').innerText}\n\n⚖️ Prime Law El Salvador`;
        await navigator.clipboard.writeText(textoPost);

        // Abrir Redes Escalonadamente
        seleccionadas.forEach((red, i) => {
            const urls = {
                'facebook': 'https://www.facebook.com',
                'instagram': 'https://www.instagram.com',
                'whatsapp': 'https://web.whatsapp.com',
                'linkedin': 'https://www.linkedin.com'
            };

            const urlTarget = urls[red];
            
            if (urlTarget) {
                // El primer link se abre rápido, los demás esperan 2 segundos cada uno
                setTimeout(() => {
                    const nuevaVentana = window.open(urlTarget, '_blank');
                    
                    // Si el navegador devuelve 'null', es que lo bloqueó
                    if (!nuevaVentana || nuevaVentana.closed || typeof nuevaVentana.closed == 'undefined') { 
                        console.warn("La pestaña de " + red + " fue bloqueada por el navegador.");
                    }
                }, i * 2000); 
            }
        });

        document.getElementById('notificacion-exito').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Error al procesar la imagen.");
    } finally {
        btn.innerText = "GENERAR Y ABRIR REDES";
        btn.disabled = false;
    }
}

// INICIALIZACIÓN
window.onload = function() {
    habilitarArrastre('preview-titulo');
    habilitarArrastre('preview-subtitulo');
    habilitarArrastre('preview-info');
    habilitarArrastre('preview-lista-contenedor');
    actualizarLienzo();
};