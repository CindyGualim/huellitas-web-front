import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, Calendar, ClipboardList } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { EventFormModal } from '../../components/admin/EventFormModal';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent, ApiEvent, EventPayload } from '../../lib/api';
import { eventTypeLabel, eventStatusLabel, eventStatusBadgeClass } from '../../lib/eventMappings';
import { formatEventDate } from '../../lib/dateUtils';
import { errorMessage, useApiResource } from '../../lib/useApiResource';

const registeredCount = (event: ApiEvent) => (event.timeSlots ?? []).reduce((sum, slot) => sum + (slot.registered ?? 0), 0);

export function AdminEvents() {
  const { token, user } = useAuth();
  const canManageEvents = user?.role === 'Superadministrador';
  // El detalle de la jornada (pacientes) es para Superadministrador y Operador.
  const canSeeDetail = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [page, setPage] = useState(1);
  const [onlyUpcoming, setOnlyUpcoming] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ mode: 'create' | 'edit'; event?: ApiEvent } | null>(null);

  const { data, loading: isLoading, error: loadError, reload } = useApiResource(
    () => apiGetEvents({ page, upcoming: onlyUpcoming }),
    [page, onlyUpcoming],
    { fallbackMessage: 'No se pudieron cargar los eventos', keepPreviousData: true }
  );
  const events = data?.items ?? [];
  const pagination = data?.pagination ?? null;
  const error = actionError ?? loadError;

  const handleDelete = async (event: ApiEvent) => {
    if (!token) return;
    const registered = registeredCount(event);
    if (registered > 0) {
      setActionError(`"${event.title}" tiene ${registered} inscrito(s) y no se puede eliminar. Editala y marcala como Cancelada (se avisa a los dueños) o Finalizada.`);
      return;
    }
    if (!confirm(`¿Eliminar la jornada "${event.title}"? No tiene inscritos.`)) return;

    setActionError(null);
    try {
      await apiDeleteEvent(token, event.id);
      reload();
    } catch (err) {
      setActionError(errorMessage(err, 'No se pudo eliminar el evento'));
    }
  };

  const handleFormSubmit = async (payload: EventPayload) => {
    if (!token) throw new Error('No autorizado');
    setActionError(null);
    setNotice(null);

    if (modalState?.mode === 'edit' && modalState.event) {
      const updated = await apiUpdateEvent(token, modalState.event.id, payload);
      if (updated.cancelledRegistrations) {
        setNotice(`Jornada cancelada: ${updated.cancelledRegistrations} paciente(s) quedaron como "Jornada cancelada" y se avisó a sus dueños por correo.`);
      }
    } else {
      await apiCreateEvent(token, payload);
    }
    reload();
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Eventos</h1>
          <p className="text-[#222222]/50">Gestiona jornadas y actividades</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-[#D9D9D9] bg-white p-1 text-sm" role="group" aria-label="Filtrar eventos">
            {[{ value: true, label: 'Próximos' }, { value: false, label: 'Todos' }].map(option => (
              <button
                key={option.label}
                onClick={() => { setOnlyUpcoming(option.value); setPage(1); }}
                aria-pressed={onlyUpcoming === option.value}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${onlyUpcoming === option.value ? 'bg-[#20A83E] text-white' : 'text-[#222222]/70 hover:bg-[#F8F8F8]'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {canManageEvents && (
            <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setModalState({ mode: 'create' })}>
              <Plus size={18} />
              Nueva Jornada
            </PrimaryButton>
          )}
        </div>
      </div>

      {notice && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start justify-between gap-3">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-amber-800/60 hover:text-amber-800 cursor-pointer" aria-label="Cerrar aviso">✕</button>
        </div>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span>
          {loadError && !actionError && (
            <button onClick={reload} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 cursor-pointer">Reintentar</button>
          )}
        </div>
      )}

      {isLoading && events.length === 0 ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : events.length === 0 ? (
        !loadError && <p className="text-[#222222]/50">{onlyUpcoming ? 'No hay eventos próximos. Elegí "Todos" para ver los anteriores.' : 'Todavía no hay eventos registrados.'}</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {['Título', 'Tipo', 'Ubicación', 'Fecha', 'Estado', ...(canSeeDetail ? ['Detalle'] : []), ...(canManageEvents ? ['Acciones'] : [])].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/30">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250">
                    <td className="px-6 py-4">
                      <span className="text-[#222222] font-medium text-sm">{event.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222]/70 text-sm">{eventTypeLabel(event.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar size={15} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{formatEventDate(event.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${eventStatusBadgeClass(event.status)}`}>
                        {eventStatusLabel(event.status)}
                      </span>
                    </td>
                    {canSeeDetail && (
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/events/${event.id}`}
                          className="flex items-center gap-1.5 text-[#20A83E] hover:text-[#146B27] text-sm font-medium transition-colors duration-250 whitespace-nowrap"
                        >
                          <ClipboardList size={14} /> Ver detalle
                        </Link>
                      </td>
                    )}
                    {canManageEvents && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModalState({ mode: 'edit', event })}
                            aria-label={`Editar ${event.title}`}
                            className="p-2 text-[#20A83E] hover:bg-[#20A83E]/10 rounded-lg transition-all duration-250 cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(event)}
                            aria-label={`Eliminar ${event.title}`}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-250 cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

      {modalState && (
        <EventFormModal
          mode={modalState.mode}
          initialData={modalState.event}
          onSubmit={handleFormSubmit}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
