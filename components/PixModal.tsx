import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check } from 'lucide-react';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeBase64: string;
  copyPaste: string;
  productName: string;
}

export default function PixModal({ isOpen, onClose, qrCodeBase64, copyPaste, productName }: PixModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="bg-[#1a1a1a] rounded-[32px] max-w-sm w-full p-8 shadow-2xl relative border-2 border-[#ec4899] pink-glow animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition"
        >
          <X size={20} className="text-[#ec4899]" />
        </button>

        <div className="text-center space-y-6">
          <div className="text-5xl">🎉</div>
          <h2 className="bebas text-3xl text-[#ec4899]">Pagamento via Pix</h2>
          <p className="text-sm text-gray-300">
            Escaneie o código abaixo para finalizar a compra de: <br />
            <span className="font-bold text-white text-lg">{productName}</span>
          </p>

          <div className="bg-white p-4 rounded-2xl inline-block mx-auto">
            {qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-48 h-48 mx-auto"
              />
            )}
          </div>

          <div className="space-y-2 text-left">
            <p className="text-xs font-bold text-[#ec4899] uppercase tracking-widest">Código Copia e Cola</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={copyPaste}
                className="flex-1 bg-[#000000] border border-[#ec4899]/30 rounded-lg text-xs p-3 text-gray-300 focus:ring-0 truncate"
              />
              <button
                onClick={handleCopy}
                className={`p-3 rounded-lg transition-all hover:scale-105 ${copied ? 'bg-green-500 text-white' : 'bg-[#ec4899] text-black font-bold'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400">
              Após o pagamento, o download será liberado automaticamente.
            </p>
            <a
              href="https://wa.me/5592996313301"
              target="_blank"
              className="text-[#ec4899] text-xs font-bold mt-2 inline-block hover:underline"
            >
              Dúvidas? Fale conosco no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
