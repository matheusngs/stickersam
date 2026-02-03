import { NextResponse } from 'next/server';
import { paymentClient } from '@/lib/mercadopago';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook MP recebido:', body);

    // O webhook pode ser sobre várias coisas, focamos em 'payment'
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // 1. Consultar status do pagamento no Mercado Pago
      const payment = await paymentClient.get({ id: paymentId });

      if (payment.status === 'approved') {
        // 2. Buscar pedido correspondente no Supabase
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('payment_id', paymentId.toString())
          .single();

        if (order && order.status !== 'approved') {
          // 3. Marcar pedido como aprovado
          await supabaseAdmin
            .from('orders')
            .update({ status: 'approved' })
            .eq('id', order.id);

          // 4. Gerar token de download
          const token = generateToken();
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24); // Expira em 24h

          await supabaseAdmin.from('download_tokens').insert({
            order_id: order.id,
            token: token,
            expires_at: expiresAt.toISOString(),
            used: false,
          });

          console.log(`Pedido ${order.id} aprovado e token gerado.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
