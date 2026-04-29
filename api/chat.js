export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { prompt } = req.body;
        const token = process.env.HF_TOKEN;

        if (!token) {
            throw new Error("Variable HF_TOKEN no encontrada en Vercel");
        }

        const hfResponse = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        const data = await hfResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error en la función:", error.message);
        return res.status(500).json({ error: error.message });
    }
}