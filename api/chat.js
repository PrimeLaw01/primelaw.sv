export default async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { prompt } = req.body;
        const HF_TOKEN = process.env.HF_TOKEN;

        if (!HF_TOKEN) {
            return res.status(500).json({ error: "Token no configurado en Vercel" });
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`, 
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres el experto legal de Prime Law en El Salvador. Responde breve y profesional: ${prompt} [/INST]`,
                }),
            }
        );

        const result = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}