import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkState() {
  console.log('📦 --- PRODUTOS NO BANCO ---');
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) console.error('Erro produtos:', prodError);
  else console.table(products.map(p => ({ id: p.id, nome: p.name, path: p.file_path, preço: p.price })));

  console.log('\n📂 --- ARQUIVOS NO STORAGE (Bucket: stickers) ---');
  const { data: files, error: storageError } = await supabase.storage.from('stickers').list();
  if (storageError) console.error('Erro storage:', storageError);
  else console.table(files.map(f => ({ nome: f.name, tamanho: f.metadata?.size })));
}

checkState();
