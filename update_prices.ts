import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function updatePrices() {
  console.log('💰 Atualizando preços para R$ 5,99...');

  const { data, error } = await supabase
    .from('products')
    .update({ price: 5.99 })
    .neq('price', 5.99) // Apenas os que não são 5.99
    .select();

  if (error) {
    console.error('❌ Erro ao atualizar preços:', error);
  } else {
    console.log(`✅ Sucesso! ${data?.length || 0} produtos atualizados para R$ 5,99.`);
  }
}

updatePrices();
