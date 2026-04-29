export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres el experto legal de Prime Law en El Salvador. Responde breve: ${prompt} [/INST]`,
                }),
            }
        );

        const result = await response.json();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}