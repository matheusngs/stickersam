import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const fileList = [
  "ADVOGADA.zip", "AGENDA_ABERTA.zip", "ANIVERSARIO.zip", "ARTESANATO_CROCHE.zip",
  "BLOGUEIRA.zip", "BOM_DIA.zip", "BOM_DIA_TARDE_NOITE.zip", "BRAIP.zip",
  "BRONZEAMENTO.zip", "CAFE.zip", "CAIXINHAS.zip", "CAIXINHA_SELECAO.zip",
  "CALENDARIOS_MESES.zip", "CLIMAS_ESTACOES.zip", "CONFEITARIA_DOCES.zip",
  "CONFEITARIA_DOCES_2.zip", "CORRETORA_DE_IMOVEIS.zip", "CRISTAO.zip",
  "CRONOGRAMA_CAPILAR.zip", "DATAS_COMEMORATIVAS.zip", "DESIGNER_GRAFICO.zip",
  "DONA_DE_CASA_FAXINA.zip", "EDUZZ.zip", "EMOJIS.zip", "ESTETICA.zip",
  "ESTUDOS_HOME_OFFICE.zip", "FEEDBACK_CLIENTE.zip", "FITNESS.zip",
  "FRASES_PALAVRAS.zip", "GLOW_UP.zip", "HOTMART.zip", "KIWIFY.zip",
  "LASH_DESIGNER.zip", "LOJISTA_LOJA.zip", "MANICURE_NAIL.zip", "MAQUIAGEM.zip",
  "MAQUININHA_TON.zip", "MARY_KAY.zip", "MATERNIDADE.zip", "MICRO_LABIAL.zip",
  "MKT_EMPREENDEDORA.zip", "NETFLIX_CINEMA.zip", "NUTRICIONISTA_DIETA.zip",
  "OFERTAS_DESCONTO.zip", "OLEOESSENCIAL.zip", "PARCEIRA_MAGALU.zip",
  "PERFECTPAY.zip", "PONTO_DE_LUZ.zip", "PRAIA_PISCINA.zip", "REFEICAO_COMIDA.zip",
  "SEMIJOIAS.zip", "SHOPEE.zip", "SOMBRAS.zip", "VIAJAR.zip"
];

function formatName(fileName: string) {
  const baseName = fileName.replace(".zip", "");
  return baseName
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function seed() {
  console.log('🚀 Iniciando semeadura de 54 produtos...');

  // 1. Limpar produtos antigos de teste (opcional, mas recomendado para lista limpa)
  // const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const productsToInsert = fileList.map(file => ({
    name: `Pack ${formatName(file)}`,
    description: `Coleção exclusiva de figurinhas digitais para stories com o tema ${formatName(file)}. Deixe seu Instagram com visual profissional e moderno!`,
    price: 29.90, // Valor padrão de exemplo
    file_path: file
  }));

  const { data, error } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select();

  if (error) {
    console.error('❌ Erro ao inserir produtos:', error);
  } else {
    console.log(`✅ Sucesso! ${data.length} produtos inseridos.`);
  }
}

seed();
