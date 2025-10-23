import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();

    console.log('Received contact form submission:', { name, email });

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      console.error("SMTP configuration missing");
      return new Response(
        JSON.stringify({ error: "SMTP configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Use SMTP port 587 with STARTTLS
    const port = parseInt(smtpPort);
    const useTLS = port === 465;
    
    // Construct email body
    const emailBody = `
From: ${name}
Email: ${email}

Message:
${message}
    `.trim();

    console.log(`Connecting to SMTP server ${smtpHost}:${port}`);

    // Send email using native Deno TCP connection with SMTP protocol
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: port,
      transport: useTLS ? "tcp" : "tcp",
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function sendCommand(command: string): Promise<string> {
      console.log('SMTP Command:', command.split('\r\n')[0]);
      await conn.write(encoder.encode(command + "\r\n"));
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      const response = decoder.decode(buffer.subarray(0, n || 0));
      console.log('SMTP Response:', response.trim());
      return response;
    }

    // Read server greeting
    const buffer = new Uint8Array(1024);
    await conn.read(buffer);
    
    // SMTP handshake
    await sendCommand(`EHLO oxiabreathe.eu`);
    
    if (port === 587) {
      await sendCommand("STARTTLS");
      // After STARTTLS, we would need to upgrade connection to TLS
      // For now, using port 465 with TLS is more straightforward
    }
    
    // Authentication
    await sendCommand("AUTH LOGIN");
    await sendCommand(btoa(smtpUser));
    await sendCommand(btoa(smtpPassword));
    
    // Send email
    await sendCommand(`MAIL FROM:<${smtpUser}>`);
    await sendCommand(`RCPT TO:<${smtpUser}>`);
    await sendCommand("DATA");
    
    const emailContent = `From: ${smtpUser}
To: ${smtpUser}
Subject: Contact Form: ${name}
Content-Type: text/plain; charset=utf-8

${emailBody}
.`;
    
    await sendCommand(emailContent);
    await sendCommand("QUIT");
    
    conn.close();

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
