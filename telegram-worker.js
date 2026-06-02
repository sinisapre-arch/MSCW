export default {
  async fetch(request, env) {
    // 1. Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // 2. Only accept POST requests
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" } 
      });
    }

    try {
      // 3. Parse incoming request body
      const { name, message } = await request.json();

      if (!name || !message) {
        return new Response(JSON.stringify({ error: "Missing name or message" }), { 
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" } 
        });
      }

      // 4. Read credentials from Cloudflare Environment Variables
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return new Response(JSON.stringify({ error: "Server missing Telegram credentials" }), { 
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" } 
        });
      }

      // 5. Build and send the Telegram request
      const textToTransmit = `⚠️ NEW DIRECTIVE FROM MSCW BUREAU\n\nIDENTIFICATION: ${name}\n\nMESSAGE: ${message}`;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const telegramResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: textToTransmit
        })
      });

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        throw new Error(`Telegram error: ${errorText}`);
      }

      // 6. Return success back to our MSCW BUREAU website
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });

    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json" 
        } 
      });
    }
  }
};
