
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = "Aria" } = await req.json();
    
    console.log('TTS Request:', { text, voice });
    
    if (!text) {
      throw new Error('Text is required');
    }

    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      console.error('ElevenLabs API key not found');
      throw new Error('ElevenLabs API key not configured');
    }

    // Voice ID mapping for breathing exercises (calming voices)
    const voiceIds: Record<string, string> = {
      "Aria": "9BWtsMINqrJLrRacOk9x",
      "Sarah": "EXAVITQu4vr4xnSDxMaL", 
      "Laura": "FGY2WhTYpPnrIDTdsKH5",
      "Charlotte": "XB0fDUnXU5powFXDhCwa",
      "Alice": "Xb7hH8MSUJpSbSDYk0k2"
    };

    const voiceId = voiceIds[voice] || voiceIds["Aria"];
    console.log('Using voice ID:', voiceId);

    // Call ElevenLabs TTS API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    });

    console.log('ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get audio data and convert to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log('Successfully generated TTS audio, size:', audioBuffer.byteLength);

    return new Response(
      JSON.stringify({ 
        audioData: base64Audio,
        contentType: 'audio/mpeg'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
