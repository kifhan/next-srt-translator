export async function translateCaptionGemini ({ 
    message,
 }: { message: string }) {
    const res = await fetch("/api/gemini", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();
    return data.text;
}