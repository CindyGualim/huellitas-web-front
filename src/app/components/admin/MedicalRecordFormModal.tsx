import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { MedicalRecordPayload } from '../../lib/api';
import { MEDICAL_RECORD_TYPE_OPTIONS } from '../../lib/petMappings';
import { todayDateInputValue } from '../../lib/dateUtils';

interface MedicalRecordFormModalProps {
  petName: string;
  onSubmit: (payload: MedicalRecordPayload) => Promise<void>;
  onClose: () => void;
}

export function MedicalRecordFormModal({ petName, onSubmit, onClose }: MedicalRecordFormModalProps) {
  const [formData, setFormData] = useState({
    consultationDate: todayDateInputValue(),
    recordType: MEDICAL_RECORD_TYPE_OPTIONS[0].value as string,
    description: '',
    treatment: '',
    observations: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";
  const required = <span className="text-red-500">*</span>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white">
          <h2 className="text-[#222222] text-xl font-medium">Nuevo registro médico — {petName}</h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha {required}</label>
              <input type="date" name="consultationDate" required value={formData.consultationDate} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tipo {required}</label>
              <select name="recordType" value={formData.recordType} onChange={handleChange} className={inputClass}>
                {MEDICAL_RECORD_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción {required}</label>
            <textarea name="description" required rows={2} value={formData.description} onChange={handleChange} className={inputClass} placeholder="¿Qué se hizo o encontró?" />
          </div>

          <div>
            <label className={labelClass}>Tratamiento {required}</label>
            <textarea name="treatment" required rows={2} value={formData.treatment} onChange={handleChange} className={inputClass} placeholder="Medicamento, dosis, procedimiento..." />
          </div>

          <div>
            <label className={labelClass}>Observaciones {required}</label>
            <textarea name="observations" required rows={2} value={formData.observations} onChange={handleChange} className={inputClass} placeholder="Reacciones, recomendaciones, próximos pasos..." />
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
