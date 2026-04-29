export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { prompt } = req.body;
        const token = process.env.HF_TOKEN;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/google/gemma-2-9b-it",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: prompt,
                    parameters: { max_new_tokens: 300, return_full_text: false }
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("Error detallado:", result);
            return res.status(response.status).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}