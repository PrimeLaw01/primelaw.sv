console.log("El archivo JS de Prime Law se cargó correctamente");

// ==========================================
// CONFIGURACIÓN INICIAL
// ==========================================
const CANVA_CLIENT_ID = "OC-AZ3HnUXixXyB"; // Tu Client ID de la captura

// ==========================================
// 1. LÓGICA DE CANVA (NUEVO)
// ==========================================
function abrirEditorCanva() {
    // Usamos la ruta clásica que Chrome reconoce mejor
    if (typeof Canva !== 'undefined' && Canva.DesignButton) {
        
        // 1. Inicializar
        Canva.DesignButton.initialize({
            apiKey: "OC-AZ3HnUXixXyB" // Tu ID de Prime Law
        });

        // 2. Abrir editor
        Canva.DesignButton.createDesign({
            type: "Poster",
            onPublish: (result) => {
                const imgPreview = document.getElementById('imagen-resultado-canva');
                if (imgPreview) {
                    imgPreview.src = result.url;
                }
                alert("¡Diseño de Prime Law importado!");
            }
        });
        
    } else {
        // Si entra aquí, Chrome realmente no está bajando el archivo de Canva
        console.error("SDK de Canva no encontrado en el objeto Window");
        alert("El sistema de diseño está tardando en conectar. Por favor, refresca la página con Ctrl + F5.");
    }
}

function abrirVentana(url) {
    // Abre la herramienta en una pestaña nueva para evitar bloqueos
    window.open(url, '_blank');
}

// Sacamos la lógica a una función aparte para que sea más limpia
function ejecutarCanva() {
    window.Canva.DesignButton.initialize({
        apiKey: CANVA_CLIENT_ID,
    });

    window.Canva.DesignButton.createDesign({
        type: "Poster",
        onPublish: (result) => {
            document.getElementById('imagen-resultado-canva').src = result.url;
            alert("¡Diseño de Prime Law importado!");
        }
    });
}

// ==========================================
// 2. LÓGICA DE IA (N8N) - YA CORREGIDO
// ==========================================
async function verPosiblePublicacion() {
    const btn = document.querySelector('.boton-publicacion-ia');
    const textoOriginal = document.getElementById('texto-publicacion').value;
    const temaLegal = document.querySelector('.entrada-admin').value;
    
    if(!textoOriginal) return alert("Por favor, escribe algo en el cuaderno.");
    if(!temaLegal) return alert("Por favor, selecciona o escribe un área legal en el buscador arriba.");

    btn.innerText = "Generando propuesta...";
    btn.disabled = true;

    try {
        // Usamos la URL de producción (webhook) ya que el flujo está publicado
        const respuesta = await fetch('https://primelaw.app.n8n.cloud/webhook/generar-post-prime', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contenido: textoOriginal,
                tema_legal: temaLegal, 
                firma: "Prime Law"
            })
        });

        // Verificación de respuesta antes de convertir a JSON
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            console.error("Error de n8n:", errorTexto);
            throw new Error("n8n respondió con error");
        }

        const data = await respuesta.json();
        
        if(data.texto_ia) {
            document.getElementById('contenedor-edicion-ia').style.display = 'block';
            document.getElementById('texto-ia-editable').value = data.texto_ia;
            
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
            alert("La IA no devolvió una respuesta clara. Revisa el flujo en n8n.");
        }

    } catch (error) {
        console.error("Error detallado:", error);
        alert("Error conectando con la IA. Revisa la consola.");
    } finally {
        btn.innerText = "Ver posible publicación";
        btn.disabled = false;
    }
}

// ==========================================
// 3. ENVÍO FINAL (SUPABASE)
// ==========================================
async function enviarAPublicacion() {
    // 1. Obtener redes seleccionadas
    const seleccionadas = Array.from(document.querySelectorAll('.tarjeta-red-admin.seleccionada h4'))
                               .map(h4 => h4.innerText.toLowerCase());
    
    // 2. Obtener el tema legal del buscador
    const temaLegal = document.querySelector('.entrada-admin').value;
    
    // 3. Obtener el texto del "cuaderno" (o el editado por la IA)
    const textoFinal = document.getElementById('texto-ia-editable').value || document.getElementById('texto-publicacion').value;
    
    // 4. Obtener la URL de la imagen diseñada en Canva (si existe)
    const urlImagen = document.getElementById('imagen-resultado-canva').src;

    if (!textoFinal || seleccionadas.length === 0) {
        alert("Por favor selecciona una red y asegúrate de tener texto para publicar.");
        return;
    }

    // 5. Enviar a Supabase
    // Nota: Asegúrate de que 'supabase' esté inicializado en tu HTML antes de este script
    const { data, error } = await supabase
        .from('solicitudes_publicacion')
        .insert([
            { 
                redes_sociales: seleccionadas, 
                tema_legal: temaLegal, 
                cuerpo_texto: textoFinal,
                url_diseno: urlImagen // Añadimos la imagen de Canva a la base de datos
            }
        ]);

    if (error) {
        console.error("Error al guardar en Supabase:", error);
        alert("Error al guardar la solicitud.");
    } else {
        alert("¡Todo listo! Tu post y diseño han sido enviados para publicación.");
    }
}






// Función para actualizar la vista previa en tiempo real
function actualizarLienzo() {
    // Títulos e Info
    document.getElementById('preview-titulo').innerText = document.getElementById('input-titulo').value || "Título de la Publicación";
    document.getElementById('preview-subtitulo').innerText = document.getElementById('input-subtitulo').value || "Subtítulo profesional";
    document.getElementById('preview-info').innerText = document.getElementById('input-info').value || "Información sobre el derecho...";
    
    // Lista con dos puntos
    const tituloPuntos = document.getElementById('input-puntos').value;
    document.getElementById('preview-titulo-puntos').innerText = tituloPuntos;

    // Viñetas
    const viñetasTexto = document.getElementById('input-viñetas').value;
    const listaUl = document.getElementById('preview-viñetas');
    listaUl.innerHTML = ""; // Limpiar lista
    
    if(viñetasTexto) {
        const puntos = viñetasTexto.split(',');
        puntos.forEach(punto => {
            if(punto.trim() !== "") {
                const li = document.createElement('li');
                li.innerText = punto.trim();
                listaUl.appendChild(li);
            }
        });
    }
}

// Lógica para subir imagen de fondo
document.getElementById('subir-fondo').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('fondo-post').style.backgroundImage = `url('${event.target.result}')`;
    };
    reader.readAsDataURL(e.target.files[0]);
});