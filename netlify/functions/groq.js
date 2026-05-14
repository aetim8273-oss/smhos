const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    const { messages, context } = JSON.parse(event.body || "{}");

    if (!messages?.length) {
      return json(400, { error: "messages required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return json(200, {
        keyExists: !!process.env.GROQ_API_KEY,
        firstChars: process.env.GROQ_API_KEY?.slice(0, 7),
      });
    }

    const systemPrompt =
      "You are a helpful assistant for SMHOS church locator app.";

    const contextLine = context
      ? `Nearest branch: ${context.name}, ${context.address}`
      : "No branch detected.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt + " " + contextLine },
            ...messages,
          ],
          temperature: 0.7,
        }),
      },
    );

    const raw = await response.text();

    console.log("GROQ RAW:", raw);

    if (!response.ok) {
      return json(500, { error: raw });
    }

    const data = JSON.parse(raw);
    return json(200, data);
  } catch (err) {
    return json(500, { error: err.message });
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}
