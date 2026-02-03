import { NextResponse } from 'next/server';
import { paymentClient } from '@/lib/mercadopago';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { productId, email } = await request.json();

    // 1. Buscar produto no Supabase
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // 2. Criar pagamento no Mercado Pago
    const payment = await paymentClient.create({
      body: {
        transaction_amount: Number(product.price),
        description: `Sticker: ${product.name}`,
        payment_method_id: 'pix',
        payer: {
          email: email,
        },
        // O Mercado Pago não aceita localhost como notification_url.
        // Só incluímos se for uma URL externa (produção).
        ...(process.env.APP_URL?.includes('localhost') ? {} : {
          notification_url: `${process.env.APP_URL}/api/webhook-mercadopago`
        }),
      },
    });

    // 3. Registrar pedido pendente no Supabase
    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      product_id: productId,
      status: 'pending',
      payment_id: payment.id?.toString(),
    });

    if (orderError) {
      console.error('Erro ao criar pedido:', orderError);
    }

    // 4. Retornar dados do Pix
    return NextResponse.json({
      paymentId: payment.id,
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      copyPaste: payment.point_of_interaction?.transaction_data?.qr_code,
    });
  } catch (error: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      response: error.response
    };
    console.error('❌ Erro no create-pix:', errorData);
    return NextResponse.json({ error: 'Erro interno ao processar Pix', details: error.message }, { status: 500 });
  }
}
