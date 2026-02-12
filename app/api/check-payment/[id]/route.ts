import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentId = id;

    // 1. Buscar pedido vinculado ao paymentId
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, download_tokens(token)')
      .eq('payment_id', paymentId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // 2. Retornar status e token (se aprovado)
    if (order.status === 'approved') {
      const token = order.download_tokens?.[0]?.token;
      return NextResponse.json({
        status: 'approved',
        downloadUrl: token ? `/api/download?token=${token}` : null
      });
    }

    return NextResponse.json({ status: 'pending' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao checar pagamento' }, { status: 500 });
  }
}
