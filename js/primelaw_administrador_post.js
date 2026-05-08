const SUPABASE_URL = 'https://geopgruedclsmwdfuebi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3BncnVlZGNsc213ZGZ1ZWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODc1MjIsImV4cCI6MjA5MjU2MzUyMn0.xwcFE6zs4FYIicIXVqQljHNAPxPAWBcDXl1jbCL3mdo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let idEditando = null;

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
    
    document.getElementById('preview-titulo').innerHTML = tVal.replace(/\n/g, '<br>') || textosPorDefecto['preview-titulo'];
    document.getElementById('preview-subtitulo').innerHTML = sVal.replace(/\n/g, '<br>') || textosPorDefecto['preview-subtitulo'];
    document.getElementById('preview-info').innerHTML = iVal.replace(/\n/g, '<br>') || textosPorDefecto['preview-info'];
    
    document.getElementById('preview-titulo-puntos').innerHTML = document.getElementById('input-puntos').value || "";
    
    const viñetas = document.getElementById('input-viñetas').value;
    const listaUl = document.getElementById('preview-viñetas');
    listaUl.innerHTML = "";
    if (viñetas) {
        viñetas.split(';').forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = p.trim();
            listaUl.appendChild(li);
        });
    }
    const elementos = ['preview-titulo', 'preview-subtitulo', 'preview-info', 'preview-lista-contenedor'];
    elementos.forEach(id => habilitarArrastre(id));
}

function alinearTexto(idPreview, alineacion) {
    const el = document.getElementById(idPreview);
    if (!el) return;

    el.style.textAlign = alineacion;

    if (idPreview === 'preview-lista-contenedor' || idPreview === 'preview-viñetas') {
        const contenedor = document.getElementById('preview-lista-contenedor');
        if (contenedor) {
            contenedor.style.display = 'flex';
            contenedor.style.flexDirection = 'column';
            contenedor.style.alignItems = alineacion === 'center' ? 'center' : 'flex-start';
        }
        
        const lista = document.getElementById('preview-viñetas');
        if (lista) {
            lista.style.listStylePosition = alineacion === 'center' ? 'inside' : 'outside';
        }
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

function añadirControlesVisuales(idElemento) {
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

    try {
        const canvas = await html2canvas(lienzo, { scale: 3, useCORS: true });

        const link = document.createElement('a');
        link.download = `Post_PrimeLaw_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        const t = document.getElementById('preview-titulo').innerText;
        const i = document.getElementById('preview-info').innerText;
        await navigator.clipboard.writeText(`${t}\n\n${i}\n\n⚖️ Prime Law El Salvador`.trim());

        const urls = { 'facebook': 'https://www.facebook.com', 'instagram': 'https://www.instagram.com', 'whatsapp': 'https://web.whatsapp.com', 'linkedin': 'https://www.linkedin.com' };
        if (urls[red.innerText.toLowerCase()]) window.open(urls[red.innerText.toLowerCase()], '_blank');
        document.getElementById('notificacion-exito').style.display = 'block';
    } catch (err) { alert("Error al exportar."); }
    finally { btn.innerText = "GENERAR Y ABRIR REDES"; btn.disabled = false; }
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

function mostrarSeccion(seccion) {
    console.log("Cambiando a sección:", seccion);

    // 1. Identificamos todos los contenedores principales por sus IDs exactos
    const adminPosts = document.getElementById('seccion-admin-posts');
    const nosotros = document.getElementById('seccion-nosotros');
    const servicios = document.getElementById('seccion-servicios');
    const perfil = document.getElementById('seccion-perfil');
    const areas = document.getElementById('seccion-areas');
    const miniaturas = document.getElementById('seccion-miniaturas');

    // 2. Creamos un array con ellos para ocultarlos todos de un solo golpe
    const todas = [adminPosts, nosotros, servicios, perfil, areas, miniaturas];
    
    todas.forEach(s => { 
        if (s) {
            s.style.display = 'none'; // Esto quita el espacio que ocupan
            s.classList.remove('activa');
        }
    });

    // 3. Mostramos solo la sección que el usuario pidió
    let idTarget = (seccion === 'admin') ? 'seccion-admin-posts' : `seccion-${seccion}`;
    const elTarget = document.getElementById(idTarget);

    if (elTarget) {
        elTarget.style.display = 'block'; // La mostramos al principio del contenedor
        elTarget.classList.add('activa');
        
        // Si es la sección de integrantes, cargamos los datos de Supabase
        if (seccion === 'nosotros') {
            cargarMiembrosAdmin();
        }
        
        // UX: Hacemos scroll hacia arriba automáticamente para que se vea la sección
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("No se encontró la sección:", idTarget);
    }
}

// --- NUEVA LÓGICA CRUD SIN RESUMIR ---

async function subirFotoABucket(archivo) {
    const nombreLimpio = archivo.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const nombreFinal = `${Date.now()}_${nombreLimpio}`;
    const { data, error } = await _supabase.storage.from('fotos-equipo').upload(nombreFinal, archivo);
    if (error) throw new Error("Error al subir imagen: " + error.message);
    const { data: urlData } = _supabase.storage.from('fotos-equipo').getPublicUrl(nombreFinal);
    return urlData.publicUrl;
}

async function cargarMiembrosAdmin() {
    const lista = document.getElementById('lista-miembros-admin');
    if (!lista) return;
    lista.innerHTML = '<p style="text-align:center; color:#c5a059;">Sincronizando equipo...</p>';
    const { data: miembros, error } = await _supabase.from('quienes_somos').select('*').order('orden', { ascending: true });
    if (error) {
        lista.innerHTML = `<p style="color:red; text-align:center;">Error: ${error.message}</p>`;
        return;
    }
    lista.innerHTML = miembros.map(m => `
        <div style="background: white; padding: 12px; border-radius: 8px; border-left: 5px solid #c5a059; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${m.foto_url || '../images/usuario-sin-foto.png'}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border: 1px solid #eee;">
                <div>
                    <strong style="color: #001a2c; font-size:14px; display:block;">${m.nombre}</strong>
                    <small style="color: #666;">${m.cargo} (Orden: ${m.orden})</small>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="prepararEdicion('${m.id}')" style="background-color: #c5a059; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="eliminarMiembro('${m.id}')" style="background-color: #960000; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function prepararEdicion(id) {
    const { data: m, error } = await _supabase.from('quienes_somos').select('*').eq('id', id).single();
    if (error || !m) return;
    idEditando = m.id;
    document.getElementById('member-nombre').value = m.nombre;
    document.getElementById('member-cargo').value = m.cargo;
    document.getElementById('member-titulos').value = m.titulos ? m.titulos.join(', ') : '';
    document.getElementById('member-frase').value = m.frase_personal;
    document.getElementById('member-foto-url').value = m.foto_url;
    document.getElementById('member-orden').value = m.orden;
    const btn = document.querySelector('#form-nuevo-miembro button[type="submit"]');
    btn.innerText = "ACTUALIZAR INTEGRANTE";
    btn.style.background = "#c5a059";
    document.getElementById('form-nuevo-miembro').scrollIntoView({ behavior: 'smooth' });
}

async function eliminarMiembro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar a este integrante?")) {
        const { error } = await _supabase.from('quienes_somos').delete().eq('id', id);
        if (error) alert("Error: " + error.message);
        else cargarMiembrosAdmin();
    }
}

// --- EVENTOS INICIALES ---

document.addEventListener("DOMContentLoaded", () => {
    actualizarLienzo();
    const elementosInteractivos = ['preview-titulo', 'preview-subtitulo', 'preview-info', 'preview-lista-contenedor'];
    elementosInteractivos.forEach(id => {
        habilitarArrastre(id);
        habilitarEscalado(id);
        añadirControlesVisuales(id);
    });

    const fileInputMiembro = document.getElementById('member-foto-archivo');
    const previewImg = document.getElementById('previsualizacion-foto');
    if (fileInputMiembro) {
        fileInputMiembro.addEventListener('change', function(e) {
            const archivo = e.target.files[0];
            if (archivo) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block';
                }
                reader.readAsDataURL(archivo);
            }
        });
    }

    const formMiembro = document.getElementById('form-nuevo-miembro');
    if (formMiembro) {
        formMiembro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formMiembro.querySelector('button[type="submit"]');
            btnSubmit.innerText = "PROCESANDO...";
            btnSubmit.disabled = true;
            try {
                let urlFotoFinal = document.getElementById('member-foto-url').value;
                const inputArchivo = document.getElementById('member-foto-archivo');
                if (inputArchivo.files && inputArchivo.files[0]) {
                    urlFotoFinal = await subirFotoABucket(inputArchivo.files[0]);
                }
                const titulosArray = document.getElementById('member-titulos').value.split(',').map(t => t.trim());
                const datos = {
                    nombre: document.getElementById('member-nombre').value,
                    cargo: document.getElementById('member-cargo').value,
                    titulos: titulosArray,
                    frase_personal: document.getElementById('member-frase').value,
                    foto_url: urlFotoFinal,
                    orden: parseInt(document.getElementById('member-orden').value),
                    activo: true
                };
                const { error } = idEditando 
                    ? await _supabase.from('quienes_somos').update(datos).eq('id', idEditando)
                    : await _supabase.from('quienes_somos').insert([datos]);
                if (error) throw error;
                alert(idEditando ? "¡Integrante actualizado!" : "¡Integrante registrado!");
                idEditando = null;
                formMiembro.reset();
                if(previewImg) previewImg.style.display = 'none';
                btnSubmit.innerText = "GUARDAR INTEGRANTE";
                btnSubmit.style.background = "";
                cargarMiembrosAdmin();
            } catch (err) { alert("Error: " + err.message); }
            finally { btnSubmit.disabled = false; }
        });
    }
});

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('subir-fondo');
if (dropZone && fileInput) {
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = function() {
        if (this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fondo = document.getElementById('fondo-post');
                fondo.style.backgroundImage = `url('${e.target.result}')`;
                fondo.style.backgroundSize = "cover";
                dropZone.innerHTML = `<i class="fa-solid fa-check" style="color: #c5a059;"></i> <p>Imagen cargada</p>`;
            };
            reader.readAsDataURL(this.files[0]);
        }
    };
}


async function subirImagen(file, carpeta) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${carpeta}/${fileName}`;

    const { error: uploadError } = await _supabase.storage
        .from('fotos-abogados')
        .upload(filePath, file);

    if (uploadError) {
        alert("Error al subir imagen: " + uploadError.message);
        return null;
    }

    const { data } = _supabase.storage
        .from('fotos-abogados')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

function crearItemHTML(tipo, valores = {}) {
    const div = document.createElement('div');
    div.className = 'item-dinamico';
    if (tipo === 'lista-acreditaciones') {
        div.innerHTML = `
            <input type="text" class="input-premium dato-lista" value="${valores.texto || (typeof valores === 'string' ? valores : '')}" placeholder="Acreditación...">
            <button type="button" class="btn-eliminar" onclick="this.parentElement.remove()">×</button>
        `;
    } else {
        div.innerHTML = `
            <button type="button" class="btn-eliminar" onclick="this.parentElement.remove()">×</button>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
                <input type="text" class="input-premium anio" value="${valores.anio || ''}" placeholder="Año (ej: 2021-2024)">
                <input type="text" class="input-premium titulo" value="${valores.titulo || valores.puesto || ''}" placeholder="Título o Puesto">
                <input type="text" class="input-premium institucion full-width" value="${valores.institucion || valores.lugar || ''}" placeholder="Institución o Empresa">
                
                <div class="full-width">
                    <textarea class="input-premium descripcion" placeholder="Descripción...">${limpiarHTML(valores.descripcion || '')}</textarea>
                    <small style="color: #666; font-style: italic;">Cada línea será un punto con triángulo dorado.</small>
                </div>
            </div>
        `;
    }
    return div;
}

// 1. Quita las etiquetas HTML para que el admin vea solo texto limpio
function limpiarHTML(html) {
    if (!html) return "";
    let temp = document.createElement("div");
    temp.innerHTML = html;
    // Extrae el texto de cada <li> y lo une con saltos de línea
    const items = temp.querySelectorAll('li');
    if (items.length > 0) {
        return Array.from(items).map(li => li.innerText).join('\n');
    }
    return temp.innerText;
}

// 2. Toma el texto plano y le pone las etiquetas de Prime Law
function convertirATriangulosDorados(texto) {
    if (!texto.trim()) return "";
    
    // Si el texto ya tiene varios saltos de línea, lo convertimos en lista
    const lineas = texto.split('\n').filter(linea => linea.trim() !== "");
    
    if (lineas.length > 1) {
        let listaHTML = '<ul class="lista-vinetas-premium">';
        lineas.forEach(linea => {
            listaHTML += `<li>${linea.trim()}</li>`;
        });
        listaHTML += '</ul>';
        return listaHTML;
    }
    
    // Si es solo una línea, la dejamos como párrafo normal (con borde dorado)
    return texto.trim();
}

function agregarCampo(idContenedor, valores = {}) {
    const contenedor = document.getElementById(idContenedor);
    if (contenedor) contenedor.appendChild(crearItemHTML(idContenedor, valores));
}

async function poblarSelectorAbogados() {
    const { data: abogados } = await _supabase.from('quienes_somos').select('id, nombre').order('nombre');
    const selector = document.getElementById('selector-abogado-admin');
    selector.innerHTML = '<option value="">-- Seleccione un perfil --</option>';
    abogados.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.id; opt.textContent = a.nombre;
        selector.appendChild(opt);
    });
}

document.getElementById('selector-abogado-admin').addEventListener('change', async (e) => {
    const abogadoId = e.target.value;
    if (!abogadoId) return;

    const { data: p } = await _supabase.from('quienes_somos').select('*').eq('id', abogadoId).single();
    
    document.getElementById('edit-nombre').value = p.nombre || "";
    document.getElementById('edit-cargo').value = p.cargo || "";
    document.getElementById('edit-foto-inicio').value = p.foto_url || "";
    document.getElementById('edit-foto-perfil').value = p.foto_perfil_detallada || "";
    document.getElementById('edit-bio').value = p.biografia_larga || "";
    
    document.getElementById('url-inicio-status').textContent = p.foto_url ? "Imagen actual cargada" : "";
    document.getElementById('url-perfil-status').textContent = p.foto_perfil_detallada ? "Imagen actual cargada" : "";

    ['lista-formacion', 'lista-experiencia', 'lista-acreditaciones'].forEach(id => document.getElementById(id).innerHTML = '');
    if (p.formacion) p.formacion.forEach(item => agregarCampo('lista-formacion', item));
    if (p.experiencia) p.experiencia.forEach(item => agregarCampo('lista-experiencia', item));
    if (p.acreditaciones) p.acreditaciones.forEach(item => agregarCampo('lista-acreditaciones', item));
});

document.getElementById('form-editar-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('selector-abogado-admin').value;
    if (!id) return;

    // Subir fotos si se seleccionaron archivos nuevos
    const fileInicio = document.getElementById('file-foto-inicio').files[0];
    const filePerfil = document.getElementById('file-foto-perfil').files[0];

    let urlInicio = document.getElementById('edit-foto-inicio').value;
    let urlPerfil = document.getElementById('edit-foto-perfil').value;

    if (fileInicio) urlInicio = await subirImagen(fileInicio, 'home');
    if (filePerfil) urlPerfil = await subirImagen(filePerfil, 'perfiles');

    const obtenerJson = (idContenedor) => {
        const items = document.querySelectorAll(`#${idContenedor} .item-dinamico`);
        return Array.from(items).map(item => {
            if (idContenedor === 'lista-acreditaciones') return item.querySelector('.dato-lista').value;
            return {
                anio: item.querySelector('.anio').value,
                titulo: item.querySelector('.titulo').value,
                institucion: item.querySelector('.institucion').value,
                descripcion: convertirATriangulosDorados(item.querySelector('.descripcion').value)
            };
        });
    };

    const actualizaciones = {
        nombre: document.getElementById('edit-nombre').value,
        cargo: document.getElementById('edit-cargo').value,
        foto_url: urlInicio,
        foto_perfil_detallada: urlPerfil,
        biografia_larga: document.getElementById('edit-bio').value,
        formacion: obtenerJson('lista-formacion'),
        experiencia: obtenerJson('lista-experiencia'),
        acreditaciones: obtenerJson('lista-acreditaciones')
    };

    const { error } = await _supabase.from('quienes_somos').update(actualizaciones).eq('id', id);
    if (error) alert("Error: " + error.message);
    else alert("¡Perfil y fotos actualizados con éxito!");
});

document.addEventListener('DOMContentLoaded', poblarSelectorAbogados);