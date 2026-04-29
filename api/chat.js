export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { prompt } = req.body;
        const token = process.env.HF_TOKEN;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: prompt,
                    parameters: { max_new_tokens: 300 }
                }),
            }
        );

        const contentType = response.headers.get("content-type");
        
        if (!contentType || !contentType.includes("application/json")) {
            const textoError = await response.text();
            console.error("Hugging Face no envió JSON. Envió:", textoError);
            return res.status(500).json({ error: "La IA envió un formato incorrecto", detalle: textoError.substring(0, 100) });
        }

        const result = await response.json();
        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}