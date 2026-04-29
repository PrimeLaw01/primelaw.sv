export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { prompt } = req.body;
        const token = process.env.HF_TOKEN;

        const hfResponse = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: `Responde como abogado: ${prompt}` }),
            }
        );

        // Si la respuesta no es OK, capturamos el texto para ver qué es
        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error("Respuesta de error de Hugging Face:", errorText);
            return res.status(hfResponse.status).json({ error: "Hugging Face respondió con error", detalles: errorText });
        }

        const data = await hfResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error crítico en la función:", error.message);
        return res.status(500).json({ error: error.message });
    }
}