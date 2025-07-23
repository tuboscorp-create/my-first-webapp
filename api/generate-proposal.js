// api/generate-proposal.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { clientName, address, serviceType, notes } = req.body;

  // Only allow if all required fields exist
  if (!clientName || !address || !serviceType) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Call OpenAI API securely from backend
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional landscape contractor. Write detailed, friendly, and persuasive landscaping proposals based on the info provided."
          },
          {
            role: "user",
            content: `
Client Name: ${clientName}
Address: ${address}
Service Type: ${serviceType}
Project Notes: ${notes}

Please write a complete, professional landscape proposal for this project.`
          }
        ],
        max_tokens: 500,
      }),
    });
    const data = await response.json();
    return res.status(200).json({ proposal: data.choices?.[0]?.message?.content || "" });
  } catch (err) {
    return res.status(500).json({ error: 'OpenAI API error', details: err.message });
  }
}
