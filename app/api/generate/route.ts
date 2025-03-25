import { OpenAI } from "openai"

// Create an OpenAI API client (only if API key is available)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function POST(req: Request) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return Response.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Parse request body
    const body = await req.json().catch(() => null)

    if (!body || !body.prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create the completion
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional career advisor specializing in helping job seekers create excellent selection criteria responses. Provide detailed, specific, and well-structured responses that demonstrate the candidate's skills and experience effectively.",
        },
        { role: "user", content: body.prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Return the generated text
    return Response.json({
      content: response.choices[0].message.content,
    })
  } catch (error: any) {
    console.error("OpenAI API error:", error)

    // Return a properly formatted JSON error response
    return Response.json(
      {
        error: error.message || "Failed to generate response",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}

