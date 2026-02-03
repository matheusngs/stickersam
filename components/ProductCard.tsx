'use client';

import { useState } from 'react';
import PixModal from './PixModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; copyPaste: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          email: 'customer@example.com',
        }),
      });

      const data = await response.json();
      if (data.qrCodeBase64) {
        setPixData({
          qrCodeBase64: data.qrCodeBase64,
          copyPaste: data.copyPaste,
        });
        setIsModalOpen(true);
      } else {
        alert('Erro ao gerar Pix');
      }
    } catch (error) {
      console.error('Erro ao comprar:', error);
      alert('Erro ao processar compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-[#1a1a1a] border-2 border-[#ec4899] card-hover group flex flex-col items-center text-center">
      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
        🎨
      </div>

      <h3 className="bebas text-3xl text-white mb-2">{product.name}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>

      <div className="text-3xl font-bold text-[#ec4899] mb-6">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </div>

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-[#ec4899] text-black font-black py-4 rounded-full transition-all hover:scale-105 active:scale-95 pink-glow disabled:opacity-50"
      >
        {loading ? 'GERANDO PIX...' : 'COMPRAR AGORA 🛍️'}
      </button>

      {pixData && (
        <PixModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          qrCodeBase64={pixData.qrCodeBase64}
          copyPaste={pixData.copyPaste}
          productName={product.name}
        />
      )}
    </div>
  );
}
