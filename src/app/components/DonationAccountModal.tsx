import { useState } from 'react';
import { X, Copy, Check, Banknote } from 'lucide-react';
import { ApiSiteSettings } from '../lib/api';

interface DonationAccountModalProps {
  settings: ApiSiteSettings;
  onClose: () => void;
}

export function DonationAccountModal({ settings, onClose }: DonationAccountModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(settings.bankAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#222222]/40 hover:text-[#222222] transition-colors"
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>

        <div className="bg-[#20A83E]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
          <Banknote className="text-[#20A83E]" size={28} />
        </div>

        <h2 className="text-[#222222] text-xl font-bold mb-2">Datos para tu donación</h2>
        <p className="text-[#222222]/70 text-sm mb-6">
          Realiza tu transferencia con los siguientes datos. ¡Gracias por tu apoyo!
        </p>

        <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#D9D9D9]/50 space-y-2 mb-4">
          <div>
            <p className="text-xs text-[#222222]/50">Banco</p>
            <p className="text-[#222222] font-medium">{settings.bankName}</p>
          </div>
          <div>
            <p className="text-xs text-[#222222]/50">Tipo de cuenta</p>
            <p className="text-[#222222] font-medium">{settings.bankAccountType}</p>
          </div>
          <div>
            <p className="text-xs text-[#222222]/50">Número de cuenta</p>
            <div className="flex items-center gap-2">
              <p className="text-[#222222] font-semibold text-lg tracking-wide">{settings.bankAccountNumber}</p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-[#20A83E]/10 text-[#20A83E] transition-colors"
                aria-label="Copiar número de cuenta"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#222222]/50">A nombre de</p>
            <p className="text-[#222222] font-medium">{settings.bankAccountHolder}</p>
          </div>
        </div>

        <a
          href={`https://wa.me/${settings.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center bg-[#20A83E] text-white py-3 rounded-xl font-semibold hover:bg-[#146B27] transition-colors"
        >
          Enviar comprobante por WhatsApp
        </a>
      </div>
    </div>
  );
}
