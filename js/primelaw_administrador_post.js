console.log("El archivo JS de Prime Law se cargó correctamente");
async function enviarAPublicacion() {
    // 1. Obtener redes seleccionadas
    const seleccionadas = Array.from(document.querySelectorAll('.tarjeta-red-admin.seleccionada h4'))
                               .map(h4 => h4.innerText.toLowerCase());
    
    // 2. Obtener el tema legal del buscador
    const temaLegal = document.querySelector('.entrada-admin').value;
    
    // 3. Obtener el texto del "cuaderno"
    const textoUsuario = document.getElementById('texto-publicacion').value;

    if (!textoUsuario || seleccionadas.length === 0) {
        alert("Por favor selecciona una red y escribe el contenido.");
        return;
    }

    // 4. Enviar a Supabase (asumiendo que ya tienes inicializado el cliente 'supabase')
    const { data, error } = await supabase
        .from('solicitudes_publicacion')
        .insert([
            { 
                redes_sociales: seleccionadas, 
                tema_legal: temaLegal, 
                cuerpo_texto: textoUsuario 
            }
        ]);

    if (error) {
        console.error("Error:", error);
    } else {
        alert("¡Solicitud enviada! La IA y n8n están trabajando en tu post.");
    }
}

async function verPosiblePublicacion() {
    const btn = document.querySelector('.boton-publicacion-ia');
    const textoOriginal = document.getElementById('texto-publicacion').value;
    // Capturamos el tema legal del buscador (importante para el nodo Supabase)
    const temaLegal = document.querySelector('.entrada-admin').value;
    
    if(!textoOriginal) return alert("Por favor, escribe algo en el cuaderno.");
    if(!temaLegal) return alert("Por favor, selecciona o escribe un área legal en el buscador arriba.");

    btn.innerText = "Generando propuesta...";
    btn.disabled = true;

    try {
        // Asegúrate de usar la URL que dice "Test URL" mientras el botón de n8n esté dando vueltas
        const respuesta = await fetch('https://primelaw.app.n8n.cloud/webhook/generar-post-prime', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contenido: textoOriginal,
                tema_legal: temaLegal, // ESTO ES LO QUE LE FALTABA A N8N
                firma: "Prime Law"
            })
        });

        

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text(); // Leemos el error como texto
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