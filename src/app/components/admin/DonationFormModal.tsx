import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiDonation, DonationPayload } from '../../lib/api';
import { PAYMENT_METHOD_OPTIONS } from '../../lib/eventMappings';
import { todayDateInputValue } from '../../lib/dateUtils';

interface DonationFormModalProps {
  mode: 'create' | 'edit';
  initialData?: ApiDonation;
  onSubmit: (payload: DonationPayload) => Promise<void>;
  onClose: () => void;
}

function toFormState(donation?: ApiDonation) {
  return {
    donorName: donation?.donorName ?? '',
    donorEmail: donation?.donorEmail ?? '',
    amount: donation?.amount?.toString() ?? '',
    paymentMethod: donation?.paymentMethod ?? PAYMENT_METHOD_OPTIONS[0].value,
    donationDate: donation?.donationDate ? donation.donationDate.slice(0, 10) : todayDateInputValue(),
    notes: donation?.notes ?? ''
  };
}

export function DonationFormModal({ mode, initialData, onSubmit, onClose }: DonationFormModalProps) {
  const [formData, setFormData] = useState(toFormState(initialData));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount)
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la donación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50">
          <h2 className="text-[#222222] text-xl font-medium">
            {mode === 'create' ? 'Registrar donación' : `Editar donación de ${initialData?.donorName}`}
          </h2>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <p className="text-xs text-[#222222]/50">
            <span className="text-red-500">*</span> Campos obligatorios
          </p>

          <div>
            <label className={labelClass}>Nombre del donante <span className="text-red-500">*</span></label>
            <input name="donorName" required value={formData.donorName} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Correo del donante <span className="text-red-500">*</span></label>
            <input name="donorEmail" type="email" required value={formData.donorEmail} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Monto (Q) <span className="text-red-500">*</span></label>
              <input name="amount" type="number" step="0.01" min="0.01" required value={formData.amount} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Método de pago <span className="text-red-500">*</span></label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClass}>
                {PAYMENT_METHOD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Fecha de la donación <span className="text-red-500">*</span></label>
            <input
              name="donationDate"
              type="date"
              required
              max={todayDateInputValue()}
              value={formData.donationDate}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="text-xs text-[#222222]/40 mt-1">Usá la fecha real en que se recibió la donación, aunque la estés registrando después.</p>
          </div>

          <div>
            <label className={labelClass}>Notas (opcional)</label>
            <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <PrimaryButton type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
