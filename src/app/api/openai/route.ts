"use server";

import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const client = new OpenAI({
            // apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
            apiKey: process.env['OPENAI_API_KEY_NEW'],
            organization: process.env['OPENAI_ORG_ID'],
            project: process.env['OPENAI_PROJECT_ID'],
        });
        const chatCompletion = await client.chat.completions.create({
            ...body
            // messages: [{ role: 'user', content: 'Say this is a test' }],
            // model: 'gpt-4o',
          });

          return Response.json(chatCompletion);

        // const response = await fetch(`${OPENAI_API_BASE}${OPENAI_API_TYPE}`, {
        //     method: 'POST',
        //     body: JSON.stringify(body),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        //         // 'OpenAI-Organization': `${process.env.OPENAI_ORG_ID}`,
        //         // 'OpenAI-Project': `${process.env.OPENAI_PROJECT_ID}`,
        //     }
        // });

        // console.log(response.headers);

        // if (!response.ok) {
        //     console.log( await response.json());
        //     throw new Error('Network response was not ok');
        // }

        // const data = await response.json();
        // return Response.json(data)
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// export async function POST(request: Request) {
//     try {
//         const body = await request.json()

//         const genAI = new GoogleGenerativeAI(GEMINI_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });


//         const chat = model.startChat({
//             history: [
//                 {
//                     role: "user",
//                     parts: [{ text: "Hello, I have 2 dogs in my house." }],
//                 },
//                 {
//                     role: "model",
//                     parts: [{ text: "Great to meet you. What would you like to know?" }],
//                 },
//             ],
//             generationConfig: {
//                 maxOutputTokens: 100,
//             },
//         });

//         const msg = "How many paws are in my house?";

//         const result = await chat.sendMessage(msg);
//         const response = await result.response;
//         const text = response.text();
//         console.log(text);

//     } catch (error) {

//     }
// }