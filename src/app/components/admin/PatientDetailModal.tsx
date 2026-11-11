import { useRef, useState } from 'react';
import { X, Mail, Phone, Send } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { ApiEventRegistration, PatientRecordPayload, apiUpdatePatientRecord, apiSendReminder } from '../../lib/api';
import { PATIENT_STATUS_OPTIONS, PATIENT_STATUS_TRANSITIONS, CASTRATION_PATIENT_STATUSES, FOLLOW_UP_STATUS_OPTIONS, patientStatusBadgeClass } from '../../lib/eventMappings';
import { formatSlotTime, formatDateOnly, formatEventDate, todayDateInputValue } from '../../lib/dateUtils';
import { errorMessage } from '../../lib/useApiResource';
import { useAuth } from '../../context/AuthContext';

interface PatientDetailModalProps {
  registration: ApiEventRegistration;
  onClose: () => void;
  onUpdated: (updated: ApiEventRegistration) => void;
}

const INACTIVE_STATUSES = ['Rechazado', 'Cancelado'];

export function PatientDetailModal({ registration, onClose, onUpdated }: PatientDetailModalProps) {
  const { token } = useAuth();
  const [record, setRecord] = useState(registration);
  // Últimos valores guardados en el servidor: solo se guarda al salir de un campo si cambió algo.
  const saved = useRef(registration);
  const lastRequest = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingFields, setIsSavingFields] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState<'pre' | 'post' | null>(null);

  const inputClass = "w-full px-4 py-2.5 bg-[#F8F8F8] rounded-xl text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm disabled:opacity-50";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

  const isCastration = record.procedureType === 'Castracion';
  const isOperated = CASTRATION_PATIENT_STATUSES.includes(record.status);
  const isInactive = INACTIVE_STATUSES.includes(record.status);
  const eventOpen = record.event.isActive !== false && record.event.status !== 'Cancelado';
  const eventEnded = record.event.status === 'Finalizado' || new Date(record.event.endDate) < new Date();
  // Mismas reglas que sendReminder en el backend.
  const canSendPre = eventOpen && !isInactive && !isOperated && !eventEnded;
  const canSendPost = eventOpen && !isInactive && isCastration && isOperated;

  const save = async (payload: PatientRecordPayload, kind: 'status' | 'fields') => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    const setBusy = kind === 'status' ? setIsSavingStatus : setIsSavingFields;
    setBusy(true);
    const requestId = ++lastRequest.current;

    try {
      const updated = await apiUpdatePatientRecord(token, record.id, payload);
      saved.current = { ...saved.current, ...updated };
      // Si mientras tanto salió otro guardado, de esta respuesta solo se toman los campos enviados,
      // para no pisar en pantalla el resultado más nuevo (p. ej. un cambio de estado).
      setRecord(prev => (requestId === lastRequest.current
        ? { ...prev, ...updated, observations: prev.observations === saved.current.observations ? updated.observations : prev.observations }
        : { ...prev, ...Object.fromEntries(Object.keys(payload).map(key => [key, updated[key as keyof ApiEventRegistration]])) }));
      onUpdated(updated);
      setSuccess('Guardado');
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar el cambio'));
    } finally {
      setBusy(false);
    }
  };

  const saveFieldIfChanged = (field: 'surgeryDate' | 'observations') => {
    const current = (record[field] || null) as string | null;
    const previous = (saved.current[field] || null) as string | null;
    const normalize = (value: string | null) => (field === 'surgeryDate' && value ? value.slice(0, 10) : value?.trim() || null);
    if (normalize(current) === normalize(previous)) return;
    save({ [field]: current } as PatientRecordPayload, 'fields');
  };

  const sendReminder = async (type: 'pre' | 'post') => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    setIsSendingReminder(type);

    try {
      const updated = await apiSendReminder(token, record.id, type);
      if (updated?.reminderSentAt) setRecord(prev => ({ ...prev, reminderSentAt: updated.reminderSentAt }));
      setSuccess(`Recordatorio ${type === 'pre' ? 'pre-operatorio' : 'post-operatorio'} enviado a ${record.ownerEmail}`);
    } catch (err) {
      setError(errorMessage(err, 'No se pudo enviar el recordatorio'));
    } finally {
      setIsSendingReminder(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between gap-3 p-6 border-b border-[#D9D9D9]/50 sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <h2 className="text-[#222222] text-xl font-medium">{record.petName}</h2>
            <p className="text-[#222222]/50 text-sm">{record.event.title} · {formatSlotTime(record.timeSlot.startTime)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-[#222222]/50 hover:text-[#222222] cursor-pointer shrink-0">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" role="alert">{error}</div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">{success}</div>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Dueño</h3>
            <p className="text-[#222222] font-medium">{record.ownerName}</p>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-[#222222]/70">
              <span className="flex items-center gap-1.5"><Phone size={13} /> {record.ownerPhone}</span>
              <span className="flex items-center gap-1.5 break-all"><Mail size={13} className="shrink-0" /> {record.ownerEmail}</span>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Mascota</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#222222]/80">
              <p>Especie: {record.species}</p>
              <p>Sexo: {record.gender}</p>
              <p>Raza: {record.breed}</p>
              <p>Procedimiento: {isCastration ? 'Castración' : 'Vacunación'}</p>
              <p>Fecha de nacimiento aprox.: {formatDateOnly(record.birthDate, {})}</p>
              <p>Última desparasitación: {formatDateOnly(record.lastDewormingDate, {})}</p>
              <p>Última vacunación: {formatDateOnly(record.lastVaccinationDate, {})}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Estado del paciente</h3>
            {record.status === 'Cancelado' && (
              <p className="text-sm text-[#222222]/60 mb-2">La jornada se canceló. Se puede volver a inscribir solo si la jornada se reactiva y hay cupo.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {PATIENT_STATUS_OPTIONS.filter(option => {
                if (option.value === record.status) return true;
                if (!(PATIENT_STATUS_TRANSITIONS[record.status] ?? []).includes(option.value)) return false;
                return isCastration || !CASTRATION_PATIENT_STATUSES.includes(option.value);
              }).map(option => (
                <button
                  key={option.value}
                  // El guardado de un campo (al salir de Observaciones) no bloquea el cambio de estado.
                  disabled={isSavingStatus || option.value === record.status}
                  onClick={() => save({ status: option.value as PatientRecordPayload['status'] }, 'status')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-250 cursor-pointer disabled:cursor-default ${
                    record.status === option.value ? patientStatusBadgeClass(option.value) + ' ring-2 ring-offset-1 ring-[#20A83E]/40' : 'bg-[#F8F8F8] text-[#222222]/50 hover:bg-[#D9D9D9]/40 disabled:opacity-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {isCastration && (
            <section>
              <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Cirugía y seguimiento</h3>
              {!isOperated && (
                <p className="text-sm text-[#222222]/50 mb-3">Disponible cuando el paciente esté marcado como Castrado.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="surgeryDate">Fecha de cirugía</label>
                  <input
                    id="surgeryDate"
                    type="date"
                    className={inputClass}
                    disabled={!isOperated}
                    max={todayDateInputValue()}
                    value={record.surgeryDate ? record.surgeryDate.slice(0, 10) : ''}
                    onChange={e => setRecord({ ...record, surgeryDate: e.target.value })}
                    onBlur={() => saveFieldIfChanged('surgeryDate')}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="antibiotic">Antibiótico</label>
                  <select
                    id="antibiotic"
                    className={inputClass}
                    disabled={!isOperated || isSavingFields}
                    value={record.antibioticStatus ?? ''}
                    onChange={e => save({ antibioticStatus: (e.target.value || null) as 'Pendiente' | 'Finalizado' | null }, 'fields')}
                  >
                    <option value="">Sin definir</option>
                    {FOLLOW_UP_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="stitches">Retiro de puntos</label>
                  <select
                    id="stitches"
                    className={inputClass}
                    disabled={!isOperated || isSavingFields}
                    value={record.stitchRemovalStatus ?? ''}
                    onChange={e => save({ stitchRemovalStatus: (e.target.value || null) as 'Pendiente' | 'Finalizado' | null }, 'fields')}
                  >
                    <option value="">Sin definir</option>
                    {FOLLOW_UP_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-[#222222] cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={isSavingStatus || !isOperated}
                      checked={record.followUpCompleted}
                      onChange={e => save({ followUpCompleted: e.target.checked }, 'status')}
                      className="accent-[#20A83E]"
                    />
                    Seguimiento finalizado
                  </label>
                </div>
              </div>
            </section>
          )}

          <section>
            <label className={labelClass} htmlFor="observations">Observaciones</label>
            <textarea
              id="observations"
              rows={2}
              className={inputClass}
              value={record.observations ?? ''}
              onChange={e => setRecord({ ...record, observations: e.target.value })}
              onBlur={() => saveFieldIfChanged('observations')}
            />
          </section>

          {(canSendPre || canSendPost) && (
            <section>
              <h3 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Recordatorios por correo</h3>
              <div className="flex flex-wrap gap-3">
                {canSendPre && (
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
                )}
                {canSendPost && (
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
                )}
              </div>
              {record.reminderSentAt && (
                <p className="text-xs text-[#222222]/50 mt-2">
                  Último recordatorio enviado: {formatEventDate(record.reminderSentAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
