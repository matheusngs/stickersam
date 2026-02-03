import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams, pathname } = new URL(request.url);
    const token = searchParams.get('token');

    console.log(`🌐 [DOWNLOAD] Request: ${request.method} ${pathname}?token=${token}`);

    if (request.method === 'HEAD') {
      return new Response(null, { status: 200 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 400 });
    }

    // 1. Validar token no banco
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .select('*, orders(products(*))')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ Erro na validação do token:', tokenError?.message || 'Token não encontrado');
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    // 2. Verificar expiração e uso
    if (tokenData.used) {
      return NextResponse.json({ error: 'Token já utilizado' }, { status: 403 });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
    }

    const product = tokenData.orders?.products;
    if (!product || !product.file_path) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
    }

    // 3. Buscar arquivo no Supabase Storage
    console.log('📦 Buscando arquivo no Storage:', product.file_path);
    const { data: file, error: downloadError } = await supabaseAdmin.storage
      .from('stickers')
      .download(product.file_path);

    if (downloadError || !file) {
      console.error('❌ Erro no storage download:', downloadError);
      return NextResponse.json({ error: 'Erro ao buscar arquivo', details: downloadError?.message }, { status: 500 });
    }

    // 4. Marcar token como usado SÓ AGORA que o download do storage foi bem sucedido
    await supabaseAdmin
      .from('download_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    // 5. Retornar arquivo para o usuário
    console.log('✅ Arquivo pronto para envio:', product.name);

    // Sanitizar nome do arquivo (remover emojis e caracteres não-ASCII)
    const safeName = product.name.replace(/[^\x00-\x7F]/g, "").trim() || 'stickers';

    return new Response(file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeName}.zip"`,
      },
    });
  } catch (error: any) {
    console.error('🔥 Erro Crítico no download:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
  }
}
