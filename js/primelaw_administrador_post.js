/**
 * ADMINISTRADOR DE POSTS - PRIME LAW
 * Versión Unificada 2026
 */

// 1. ACTUALIZACIÓN EN TIEMPO REAL DEL LIENZO
function actualizarLienzo() {
    // Textos básicos
    const titulo = document.getElementById('input-titulo').value || "Título del Post";
    const subtitulo = document.getElementById('input-subtitulo').value || "Subtítulo";
    const info = document.getElementById('input-info').value || "Descripción...";
    const tituloLista = document.getElementById('input-puntos').value || "";

    document.getElementById('preview-titulo').innerText = titulo;
    document.getElementById('preview-subtitulo').innerText = subtitulo;
    document.getElementById('preview-info').innerText = info;
    document.getElementById('preview-titulo-puntos').innerText = tituloLista;

    // Manejo de Viñetas
    const viñetasTexto = document.getElementById('input-viñetas').value;
    const listaUl = document.getElementById('preview-viñetas');
    listaUl.innerHTML = ""; // Limpiar lista previa

    if (viñetasTexto) {
        viñetasTexto.split(',').forEach(punto => {
            if (punto.trim()) {
                const li = document.createElement('li');
                li.innerText = punto.trim();
                listaUl.appendChild(li);
            }
        });
    }
}

// 2. CAMBIO DE PLANTILLAS (ESTILOS)
function cambiarPlantilla(clase, elemento) {
    const lienzo = document.getElementById('lienzo-publicacion');
    
    // Mantener las clases de formato pero cambiar la de estilo
    const esCuadrado = lienzo.classList.contains('formato-cuadrado');
    lienzo.className = `lienzo-post ${clase} ${esCuadrado ? 'formato-cuadrado' : 'formato-horizontal'}`;

    // Actualizar UI de botones de plantilla
    document.querySelectorAll('.opcion-plantilla').forEach(op => op.classList.remove('activa'));
    elemento.classList.add('activa');
}

// 3. CAMBIO DE TAMAÑO DEL LIENZO
function cambiarTamano(formato, elemento) {
    const lienzo = document.getElementById('lienzo-publicacion');
    
    lienzo.classList.remove('formato-cuadrado', 'formato-horizontal');
    
    if (formato === 'cuadrado') {
        lienzo.classList.add('formato-cuadrado');
    } else {
        lienzo.classList.add('formato-horizontal');
    }

    // Actualizar botones UI
    document.querySelectorAll('.btn-formato').forEach(btn => btn.classList.remove('activo'));
    elemento.classList.add('activo');
}

// 4. CARGA DE IMAGEN DE FONDO
document.getElementById('subir-fondo').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('fondo-post').style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// 5. FUNCIÓN MAESTRA: EXPORTAR IMAGEN, COPIAR TEXTO Y ABRIR REDES
async function exportarYPublicar() {
    const lienzo = document.getElementById('lienzo-publicacion');
    const notificacion = document.getElementById('notificacion-exito');
    const btnEjecutar = document.querySelector('.btn-ejecutar-final');
    
    // Validar redes seleccionadas
    const seleccionadas = Array.from(document.querySelectorAll('.tarjeta-red-admin.seleccionada h4'))
                               .map(h => h.innerText.toLowerCase());

    if (seleccionadas.length === 0) {
        alert("Por favor, selecciona al menos una red social en el Paso 02.");
        return;
    }

    btnEjecutar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESANDO...';
    btnEjecutar.disabled = true;

    try {
        // A. Exportar Imagen usando html2canvas
        const canvas = await html2canvas(lienzo, {
            scale: 2, // Alta calidad
            useCORS: true,
            backgroundColor: null
        });
        
        const enlace = document.createElement('a');
        enlace.download = `PrimeLaw_Post_${Date.now()}.png`;
        enlace.href = canvas.toDataURL("image/png");
        enlace.click();

        // B. Preparar y Copiar Texto
        const titulo = document.getElementById('preview-titulo').innerText;
        const subtitulo = document.getElementById('preview-subtitulo').innerText;
        const info = document.getElementById('preview-info').innerText;
        const tituloLista = document.getElementById('preview-titulo-puntos').innerText;
        
        // Obtener items de la lista
        const items = Array.from(document.querySelectorAll('#preview-viñetas li'))
                           .map(li => `• ${li.innerText}`)
                           .join('\n');

        const textoFinal = `${titulo.toUpperCase()}\n${subtitulo}\n\n${info}\n\n${tituloLista}\n${items}\n\n⚖️ Gestión: Prime Law El Salvador`;

        await navigator.clipboard.writeText(textoFinal);

        // C. UI de Éxito y Apertura de Redes
        notificacion.style.display = 'block';
        
        seleccionadas.forEach((red, index) => {
            setTimeout(() => {
                if (red.includes('facebook')) window.open('https://www.facebook.com/', '_blank');
                if (red.includes('instagram')) window.open('https://www.instagram.com/', '_blank');
                if (red.includes('linkedin')) window.open('https://www.linkedin.com/feed/', '_blank');
                if (red.includes('whatsapp')) window.open('https://web.whatsapp.com/', '_blank');
            }, (index + 1) * 800); // Apertura escalonada para evitar bloqueo de popups
        });

    } catch (error) {
        console.error("Error en el proceso:", error);
        alert("Hubo un fallo al generar el contenido. Revisa la consola.");
    } finally {
        btnEjecutar.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> GENERAR Y ABRIR REDES';
        btnEjecutar.disabled = false;
    }
}

// 6. INICIALIZACIÓN
window.onload = function() {
    actualizarLienzo(); // Cargar valores por defecto
};