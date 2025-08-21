import { NextRequest, NextResponse } from 'next/server';
import { handleSanityWebhook } from '@/lib/revalidate';

// Webhook secret para validar requests do Sanity
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verificar secret se configurado
    if (WEBHOOK_SECRET) {
      const providedSecret = request.headers
        .get('authorization')
        ?.replace('Bearer ', '');

      if (providedSecret !== WEBHOOK_SECRET) {
        return NextResponse.json(
          { error: 'Invalid webhook secret' },
          { status: 401 }
        );
      }
    }

    // Parsear body do webhook
    const body = await request.json();

    // Log para debug
    if (process.env.NODE_ENV === 'development') {
      console.log('[Webhook] Received:', JSON.stringify(body, null, 2));
    }

    // Extrair informações do webhook
    const documentType = body._type;
    const slug = body.slug?.current;

    // Log da ação
    console.log(
      `[Webhook] Revalidating: ${documentType}${slug ? ` (${slug})` : ''}`
    );

    // Processar revalidação
    handleSanityWebhook(documentType, slug);

    return NextResponse.json({
      success: true,
      message: `Revalidated ${documentType}${slug ? ` (${slug})` : ''}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Webhook] Error:', error);

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
