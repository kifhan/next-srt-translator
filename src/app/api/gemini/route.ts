"use server";

import { translateCaption } from "@/lib/GenKit";
import { z } from "zod";

export async function POST(request: Request) {
    try {
        const requestBodySchema = z.object({
            prompt: z.string(),
            // Add any additional properties and their types here
        });
        const body = await request.json();
        const parseResult = requestBodySchema.safeParse(body);
        if (!parseResult.success) {
            return Response.json({ error: "Invalid request body", details: parseResult.error.errors }, { status: 400 });
        }
        const { prompt } = parseResult.data;

        const data = await translateCaption(prompt);
        // console.log("input:", prompt);
        // console.log("output:",data);
        
        return Response.json({
            text: data,
        })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
