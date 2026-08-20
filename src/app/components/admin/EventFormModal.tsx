import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiEvent, EventPayload } from '../../lib/api';
import { EVENT_TYPE_OPTIONS, EVENT_STATUS_OPTIONS } from '../../lib/eventMappings';

interface EventFormModalProps {
  mode: 'create' | 'edit';
  initialData?: ApiEvent;
  onSubmit: (payload: EventPayload) => Promise<void>;
  onClose: () => void;
}

function toDatetimeLocal(isoString?: string) {
  if (!isoString) return '';
  return isoString.slice(0, 16);
}

function toFormState(event?: ApiEvent) {
  return {
    title: event?.title ?? '',
    type: event?.type ?? EVENT_TYPE_OPTIONS[0].value,
    description: event?.description ?? '',
    location: event?.location ?? '',
    startDate: toDatetimeLocal(event?.startDate),
    endDate: toDatetimeLocal(event?.endDate),
    status: event?.status ?? EVENT_STATUS_OPTIONS[0].value
  };
}

export function EventFormModal({ mode, initialData, onSubmit, onClose }: EventFormModalProps) {
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
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white">
          <h2 className="text-[#222222] text-xl font-medium">
            {mode === 'create' ? 'Agregar jornada' : `Editar ${initialData?.title}`}
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
            <label className={labelClass}>Título <span className="text-red-500">*</span></label>
            <input name="title" required value={formData.title} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo <span className="text-red-500">*</span></label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                {EVENT_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Estado <span className="text-red-500">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                {EVENT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Ubicación <span className="text-red-500">*</span></label>
            <input name="location" required value={formData.location} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha y hora de inicio <span className="text-red-500">*</span></label>
              <input name="startDate" type="datetime-local" required value={formData.startDate} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Fecha y hora de fin <span className="text-red-500">*</span></label>
              <input name="endDate" type="datetime-local" required value={formData.endDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción <span className="text-red-500">*</span></label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className={inputClass} />
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
