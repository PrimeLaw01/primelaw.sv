export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { prompt } = req.body;
        const token = process.env.HF_TOKEN;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: `Responde como experto legal de Prime Law El Salvador de forma breve: ${prompt}`,
                    parameters: { max_new_tokens: 300 }
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("Error de HF:", result);
            return res.status(response.status).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error crítico:", error.message);
        return res.status(500).json({ error: error.message });
    }
}