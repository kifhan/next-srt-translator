const OPENAI_API_BASE = "https://api.openai.com/v1";
const OPENAI_API_TYPE = "/chat/completions";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const response = await fetch(`${OPENAI_API_BASE}${OPENAI_API_TYPE}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return Response.json(data)
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}