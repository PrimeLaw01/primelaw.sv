function habilitarArrastre(idElemento) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // Mouse
    el.addEventListener('mousedown', iniciarArrastre, false);
    // Touch
    el.addEventListener('touchstart', iniciarArrastre, { passive: false });

    function iniciarArrastre(e) {
        // Detener el scroll de la página mientras movemos el texto
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
        }

        document.addEventListener('mousemove', moverElemento, false);
        document.addEventListener('mouseup', detenerArrastre, false);
        
        document.addEventListener('touchmove', moverElemento, { passive: false });
        document.addEventListener('touchend', detenerArrastre, false);
    }

    function moverElemento(e) {
        // Bloquear el scroll del navegador
        if (e.cancelable) e.preventDefault();

        let clienteX, clienteY;
        if (e.type === 'touchmove') {
            clienteX = e.touches[0].clientX;
            clienteY = e.touches[0].clientY;
        } else {
            clienteX = e.clientX;
            clienteY = e.clientY;
        }

        pos1 = pos3 - clienteX;
        pos2 = pos4 - clienteY;
        pos3 = clienteX;
        pos4 = clienteY;

        const lienzo = document.getElementById('lienzo-publicacion');
        let nuevoTop = el.offsetTop - pos2;
        let nuevoLeft = el.offsetLeft - pos1;

        // Validar límites
        if (nuevoTop >= 0 && nuevoTop <= (lienzo.offsetHeight - el.offsetHeight)) {
            el.style.top = nuevoTop + "px";
        }
        if (nuevoLeft >= 0 && nuevoLeft <= (lienzo.offsetWidth - el.offsetWidth)) {
            el.style.left = nuevoLeft + "px";
        }
    }

    function detenerArrastre() {
        document.removeEventListener('mousemove', moverElemento);
        document.removeEventListener('mouseup', detenerArrastre);
        document.removeEventListener('touchmove', moverElemento);
        document.removeEventListener('touchend', detenerArrastre);
    }
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

    if (!redSeleccionada) {
        alert("Por favor, selecciona una red social en el Paso 02.");
        return;
    }

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
        'preview-lista-contenedor'
    ];

    elementosParaMover.forEach(id => {
        habilitarArrastre(id);
    });
};

const dropZone = document.getElementById('drop-zone');
const inputFondo = document.getElementById('subir-fondo');
let bibliotecaImagenes = []; // Solo almacenaremos imágenes

// Trigger del input
dropZone.onclick = () => inputFondo.click();

// Manejo de archivos arrastrados
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const archivo = e.dataTransfer.files[0];
    validarYProcesarImagen(archivo);
});

inputFondo.onchange = (e) => validarYProcesarImagen(e.target.files[0]);

function validarYProcesarImagen(archivo) {
    // Validación estricta de tipo de imagen
    if (archivo && archivo.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const urlImagen = event.target.result;
            // Aplicar al lienzo
            document.getElementById('fondo-post').style.backgroundImage = `url('${urlImagen}')`;
            // Guardar en galería
            if (!bibliotecaImagenes.find(img => img.nombre === archivo.name)) {
                bibliotecaImagenes.push({ url: urlImagen, nombre: archivo.name });
            }
        };
        reader.readAsDataURL(archivo);
    } else {
        alert("Por favor, selecciona únicamente archivos de imagen (JPG, PNG, WebP).");
    }
}

function abrirBiblioteca() {
    const modal = document.getElementById('modal-biblioteca');
    const contenedor = document.getElementById('lista-recursos');
    
    modal.style.display = 'block';
    contenedor.innerHTML = "";

    if (bibliotecaImagenes.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #888; padding: 20px;'>No hay imágenes subidas aún.</p>";
        return;
    }

    bibliotecaImagenes.forEach(img => {
        const div = document.createElement('div');
        div.className = 'item-recurso';
        div.onclick = () => {
            document.getElementById('fondo-post').style.backgroundImage = `url('${img.url}')`;
            cerrarBiblioteca();
        };
        div.innerHTML = `
            <img src="${img.url}" alt="${img.nombre}">
            <p title="${img.nombre}">${img.nombre}</p>
        `;
        contenedor.appendChild(div);
    });
}

function cerrarBiblioteca() {
    document.getElementById('modal-biblioteca').style.display = 'none';
}