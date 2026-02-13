import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  type?: 'contact' | 'feedback';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactEmailRequest = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const type = body.type === 'feedback' ? 'feedback' : 'contact';

    console.log(`Received ${type} form submission from:`, email);

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input lengths
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum allowed length" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format and reject header injection attempts
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || /[\r\n]/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs: strip control characters to prevent header injection
    const sanitize = (str: string) => str.replace(/[\x00-\x1F\x7F]/g, '');
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeMessage = sanitize(message);

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

    const port = parseInt(smtpPort);
    
    console.log(`Sending email via ${smtpHost}:${port}`);

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: port,
        tls: port === 465,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    try {
      const subject = type === 'feedback' ? `Feedback: ${safeName}` : `Contact Form: ${safeName}`;
      
      await client.send({
        from: smtpUser,
        to: smtpUser,
        subject,
        content: `From: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      });

      await client.close();
    } catch (smtpError: any) {
      console.error("SMTP error:", smtpError);
      throw new Error(`Failed to send email: ${smtpError.message}`);
    }

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
