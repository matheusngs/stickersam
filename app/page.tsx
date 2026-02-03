import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
  }

  return (
    <div className="w-full min-h-screen gradient-bg text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 sticker-icon opacity-20 hidden md:flex">✨</div>
        <div className="absolute bottom-20 right-10 sticker-icon opacity-20 hidden md:flex">💫</div>
        <div className="absolute top-40 right-20 sticker-icon opacity-20 hidden md:flex">🎨</div>

        <div className="text-center max-w-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="bebas text-6xl md:text-8xl mb-6 leading-tight text-[#ec4899]">
            Figurinhas Exclusivas <br className="hidden md:block" /> para Seus Stories
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-300 font-medium max-w-lg mx-auto">
            Packs prontos, criativos e modernos para deixar seus stories incríveis
          </p>
          <a href="#packs" className="px-10 py-5 text-xl font-black rounded-full transition-all hover:scale-105 pink-glow inline-block bg-[#ec4899] text-black">
            EXPLORAR PACKS 🛍️
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-[#1a1a1a] border-y border-[#ec4899]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="bebas text-5xl md:text-6xl mb-8 text-[#ec4899]">O que é o Sticker Studio AM</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-16">
            São coleções de figurinhas digitais exclusivas, criadas especialmente para você
            personalizar seus stories do Instagram. Cada pack é único, criativo e pronto para usar.
            Baixe, cole e destaque-se!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#000000] border-2 border-[#ec4899] pink-glow-sm">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="bebas text-2xl mb-3 text-white">Exclusividade</h3>
              <p className="text-gray-400 text-sm">Designs únicos que você não vai encontrar em outro lugar</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#000000] border-2 border-[#ec4899] pink-glow-sm">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="bebas text-2xl mb-3 text-white">Praticidade</h3>
              <p className="text-gray-400 text-sm">Baixe e use imediatamente nos seus stories</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#000000] border-2 border-[#ec4899] pink-glow-sm">
              <div className="text-4xl mb-6">✨</div>
              <h3 className="bebas text-2xl mb-3 text-white">Criatividade</h3>
              <p className="text-gray-400 text-sm">Deixe seus stories com um visual moderno e artístico</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section id="packs" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="bebas text-5xl md:text-7xl mb-16 text-center text-[#ec4899]">Nossos Packs de Figurinhas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!products?.length && (
              <div className="col-span-full py-20 text-center space-y-4">
                <span className="text-6xl opacity-20">🎨</span>
                <p className="text-gray-400 font-bold text-xl">Aguardando novos lançamentos...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto p-12 rounded-[40px] card-hover group text-center" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
          <div className="text-6xl mb-6">🎨</div>
          <h2 className="bebas text-5xl text-black mb-6">Produto Personalizado</h2>
          <p className="text-xl text-black/80 font-medium mb-10 max-w-2xl mx-auto">
            Quer algo único? Escolha suas figurinhas e eu crio especialmente para você!
            Coleções exclusivas feitas sob medida para o seu perfil.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/5592996313301?text=Oi!%20Quero%20figurinhas%20personalizadas"
              target="_blank"
              className="bg-black text-white px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 active:scale-95"
            >
              FALAR NO WHATSAPP 💬
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 text-center bg-[#000000] border-t-2 border-[#ec4899]">
        <p className="text-gray-400 mb-6 text-lg">Transforme seus stories com estilo 💫</p>
        <a
          href="https://instagram.com/stickerstudioam"
          target="_blank"
          className="bebas text-3xl md:text-4xl text-[#ec4899] hover:scale-105 transition-transform inline-block"
        >
          @stickerstudioam
        </a>
        <div className="mt-12 text-gray-600 text-xs">
          © 2026 Sticker Studio AM - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
