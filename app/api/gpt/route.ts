import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    // Replace with your GPT-4 API request logic
    const gptResponse = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt,
        max_tokens: 100,
      }),
    });

    if (!gptResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch response from GPT-4" },
        { status: 500 }
      );
    }

    const data = await gptResponse.json();
    const answer = data.choices[0].text.trim();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
