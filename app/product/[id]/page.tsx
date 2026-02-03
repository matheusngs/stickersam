import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen gradient-bg text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <a href="/" className="bebas text-xl text-[#ec4899] hover:underline flex items-center gap-2">
            ← VOLTAR PARA A LOJA
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-[#1a1a1a] p-12 rounded-[40px] shadow-2xl border-2 border-[#ec4899] pink-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">✨</div>

          <div className="aspect-square bg-[#000000] rounded-3xl flex items-center justify-center text-9xl pink-glow-sm">
            🎨
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h1 className="bebas text-6xl text-[#ec4899] mb-4">{product.name}</h1>
              <p className="text-xl text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            <div className="pt-8 border-t border-white/10">
              <ProductCard product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
