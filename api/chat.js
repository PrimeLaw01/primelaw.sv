export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

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
                    inputs: `<s>[INST] ${prompt} [/INST]`,
                    parameters: { max_new_tokens: 300 }
                }),
            }
        );

        const data = await response.json();
        
        if (response.status === 503 || response.status === 500) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}