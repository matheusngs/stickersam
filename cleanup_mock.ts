import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function cleanupMock() {
  console.log('🧹 Removendo produtos de teste...');

  // Nomes dos produtos mockados que queremos remover
  const mockNames = ['Pack Aesthetic 🌸', 'Pack Vibes ✨', 'Pack Bold 🔥', 'Sticker Teste ✅'];

  const { data, error } = await supabase
    .from('products')
    .delete()
    .in('name', mockNames)
    .select();

  if (error) {
    console.error('❌ Erro ao remover produtos:', error);
  } else {
    console.log(`✅ Sucesso! ${data?.length || 0} produtos mockados removidos.`);
  }
}

cleanupMock();
