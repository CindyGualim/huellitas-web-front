import { useState, FormEvent } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiEvent, ApiEventTimeSlot, EventPayload } from '../../lib/api';
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

type TimeSlotDraft = { id?: number; startTime: string; capacity: string };

function toTimeSlotDrafts(timeSlots?: ApiEventTimeSlot[]): TimeSlotDraft[] {
  if (!timeSlots?.length) return [];
  return timeSlots.map(slot => ({ id: slot.id, startTime: slot.startTime, capacity: String(slot.capacity) }));
}

export function EventFormModal({ mode, initialData, onSubmit, onClose }: EventFormModalProps) {
  const [formData, setFormData] = useState(toFormState(initialData));
  const [timeSlots, setTimeSlots] = useState<TimeSlotDraft[]>(toTimeSlotDrafts(initialData?.timeSlots));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showTimeSlots = formData.type === 'Jornada_castracion';
  const totalCapacity = timeSlots.reduce((sum, slot) => sum + (Number(slot.capacity) || 0), 0);

  const addTimeSlot = () => setTimeSlots([...timeSlots, { startTime: '', capacity: '' }]);
  const removeTimeSlot = (index: number) => setTimeSlots(timeSlots.filter((_, i) => i !== index));
  const updateTimeSlot = (index: number, field: 'startTime' | 'capacity', value: string) => {
    setTimeSlots(timeSlots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (showTimeSlots && timeSlots.some(slot => !slot.startTime.trim() || !Number(slot.capacity))) {
      setError('Cada horario necesita una hora y un cupo mayor a cero');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        timeSlots: showTimeSlots
          ? timeSlots.map(slot => ({ ...(slot.id ? { id: slot.id } : {}), startTime: slot.startTime, capacity: Number(slot.capacity) }))
          : undefined
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

          {showTimeSlots && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass + ' mb-0'}>Horarios y cupos <span className="text-red-500">*</span></label>
                <span className="text-xs text-[#222222]/50">Cupo total: {totalCapacity}</span>
              </div>
              <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      placeholder="Ej: 9:00 AM"
                      value={slot.startTime}
                      onChange={e => updateTimeSlot(index, 'startTime', e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Cupo"
                      value={slot.capacity}
                      onChange={e => updateTimeSlot(index, 'capacity', e.target.value)}
                      className={inputClass + ' w-28! shrink-0'}
                    />
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="px-3 rounded-xl border border-[#D9D9D9] text-[#222222]/50 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addTimeSlot}
                className="mt-2 flex items-center gap-1.5 text-[#20A83E] text-sm font-medium hover:text-[#146B27] transition-colors cursor-pointer"
              >
                <Plus size={16} /> Agregar horario
              </button>
              <p className="text-xs text-[#222222]/40 mt-1">Un horario con inscritos no se puede eliminar, solo editar su cupo.</p>
            </div>
          )}

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
