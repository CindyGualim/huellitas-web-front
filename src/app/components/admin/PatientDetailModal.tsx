import { useState } from 'react';
import { X, Mail, Phone, Send } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiEventRegistration, PatientRecordPayload, apiUpdatePatientRecord, apiSendReminder } from '../../lib/api';
import { PATIENT_STATUS_OPTIONS, FOLLOW_UP_STATUS_OPTIONS, patientStatusBadgeClass } from '../../lib/eventMappings';
import { formatDateOnly, todayDateInputValue } from '../../lib/dateUtils';
import { useAuth } from '../../context/AuthContext';

interface PatientDetailModalProps {
  registration: ApiEventRegistration;
  onClose: () => void;
  onUpdated: (updated: ApiEventRegistration) => void;
}

export function PatientDetailModal({ registration, onClose, onUpdated }: PatientDetailModalProps) {
  const { token } = useAuth();
  const [record, setRecord] = useState(registration);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState<'pre' | 'post' | null>(null);

  const inputClass = "w-full px-4 py-2.5 bg-[#F8F8F8] rounded-xl text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

  const save = async (payload: PatientRecordPayload) => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const updated = await apiUpdatePatientRecord(token, record.id, payload);
      setRecord(updated);
      onUpdated(updated);
      setSuccess('Guardado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el cambio');
    } finally {
      setIsSaving(false);
    }
  };

  const sendReminder = async (type: 'pre' | 'post') => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    setIsSendingReminder(type);

    try {
      await apiSendReminder(token, record.id, type);
      setSuccess(`Recordatorio ${type === 'pre' ? 'pre-operatorio' : 'post-operatorio'} enviado a ${record.ownerEmail}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el recordatorio');
    } finally {
      setIsSendingReminder(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[#222222] text-xl font-medium">{record.petName}</h2>
            <p className="text-[#222222]/50 text-sm">{record.event.title} · {record.timeSlot.startTime}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">{success}</div>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Dueño</h3>
            <p className="text-[#222222] font-medium">{record.ownerName}</p>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-[#222222]/70">
              <span className="flex items-center gap-1.5"><Phone size={13} /> {record.ownerPhone}</span>
              <span className="flex items-center gap-1.5"><Mail size={13} /> {record.ownerEmail}</span>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Mascota</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-[#222222]/80">
              <p>Especie: {record.species}</p>
              <p>Sexo: {record.gender}</p>
              <p>Raza: {record.breed}</p>
              <p>Fecha de nacimiento aprox.: {formatDateOnly(record.birthDate, {})}</p>
              <p>Última desparasitación: {formatDateOnly(record.lastDewormingDate, {})}</p>
              <p>Última vacunación: {formatDateOnly(record.lastVaccinationDate, {})}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Estado del paciente</h3>
            <div className="flex flex-wrap gap-2">
              {PATIENT_STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  disabled={isSaving}
                  onClick={() => save({ status: option.value })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-250 cursor-pointer disabled:opacity-50 ${
                    record.status === option.value ? option.badgeClass + ' ring-2 ring-offset-1 ring-[#20A83E]/40' : 'bg-[#F8F8F8] text-[#222222]/50 hover:bg-[#D9D9D9]/40'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Cirugía y seguimiento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fecha de cirugía</label>
                <input
                  type="date"
                  className={inputClass}
                  max={todayDateInputValue()}
                  value={record.surgeryDate ? record.surgeryDate.slice(0, 10) : ''}
                  onChange={e => setRecord({ ...record, surgeryDate: e.target.value })}
                  onBlur={() => save({ surgeryDate: record.surgeryDate || null })}
                />
              </div>
              <div>
                <label className={labelClass}>Antibiótico</label>
                <select
                  className={inputClass}
                  value={record.antibioticStatus ?? ''}
                  onChange={e => save({ antibioticStatus: (e.target.value || null) as 'Pendiente' | 'Finalizado' | null })}
                >
                  <option value="">Sin definir</option>
                  {FOLLOW_UP_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Retiro de puntos</label>
                <select
                  className={inputClass}
                  value={record.stitchRemovalStatus ?? ''}
                  onChange={e => save({ stitchRemovalStatus: (e.target.value || null) as 'Pendiente' | 'Finalizado' | null })}
                >
                  <option value="">Sin definir</option>
                  {FOLLOW_UP_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-[#222222] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={record.followUpCompleted}
                    onChange={e => save({ followUpCompleted: e.target.checked })}
                    className="accent-[#20A83E]"
                  />
                  Seguimiento finalizado
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Observaciones</label>
              <textarea
                rows={2}
                className={inputClass}
                value={record.observations ?? ''}
                onChange={e => setRecord({ ...record, observations: e.target.value })}
                onBlur={() => save({ observations: record.observations || null })}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Recordatorios por correo</h3>
            <div className="flex gap-3">
              <PrimaryButton
                type="button"
                variant="ghost"
                className="flex items-center gap-2"
                disabled={isSendingReminder !== null}
                onClick={() => sendReminder('pre')}
              >
                <Send size={15} />
                {isSendingReminder === 'pre' ? 'Enviando...' : 'Recordatorio pre-operatorio'}
              </PrimaryButton>
              <PrimaryButton
                type="button"
                variant="ghost"
                className="flex items-center gap-2"
                disabled={isSendingReminder !== null}
                onClick={() => sendReminder('post')}
              >
                <Send size={15} />
                {isSendingReminder === 'post' ? 'Enviando...' : 'Recordatorio post-operatorio'}
              </PrimaryButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
