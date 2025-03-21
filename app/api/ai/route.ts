import { Mistral } from "@mistralai/mistralai";

const token = process.env.GITHUB_TOKEN;
const serverURL = "https://models.inference.ai.azure.com";
const modelName = "Mistral-Large-2411";

export async function POST() {
  try {
    const client = new Mistral({ apiKey: token!, serverURL });

    const response = await client.chat.stream({
      model: modelName,
      messages: [
        {
          role: "system",
          content:
            "You are a database design architect tasked with creating a database schema in DBML format based on app ideas provided by the user. Respond exclusively with the DBML schema, including only basic features such as table name, column name, column type, primary key designation, and references. If necessary, include up to 2 concise summary sentences to clarify your design rationale. If the user does not specify tables and columns, briefly justify your table and column selection in the first summary sentence. Exclude backticks from the DBML response and avoid including any additional information unrelated to the schema.",
        },
        { role: "user", content: "I want to build a talent management system" },
      ],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          if (chunk.data.choices[0].delta.content !== undefined) {
            const streamText = chunk.data.choices[0].delta.content;
            console.log(streamText);
            controller.enqueue(streamText);
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return Response.json(
      {
        message: "An error occurred",
        details: err?.message ?? "",
      },
      { status: 500 }
    );
  }
}
