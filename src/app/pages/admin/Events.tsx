import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, Calendar, ClipboardList } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { EventFormModal } from '../../components/admin/EventFormModal';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent, ApiEvent, EventPayload, ApiPagination } from '../../lib/api';
import { eventTypeLabel, eventStatusLabel, eventStatusBadgeClass } from '../../lib/eventMappings';

export function AdminEvents() {
  const { token, user } = useAuth();
  const canManageEvents = user?.role === 'Superadministrador';
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ mode: 'create' | 'edit'; event?: ApiEvent } | null>(null);

  const loadEvents = () => {
    setIsLoading(true);
    apiGetEvents({ page })
      .then(({ items, pagination }) => {
        setEvents(items);
        setPagination(pagination);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar los eventos'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, [page]);

  const handleDelete = async (event: ApiEvent) => {
    if (!token) return;
    if (!confirm(`¿Eliminar la jornada "${event.title}"?`)) return;

    await apiDeleteEvent(token, event.id);
    setEvents(events.filter(e => e.id !== event.id));
  };

  const handleFormSubmit = async (payload: EventPayload) => {
    if (!token) throw new Error('No autorizado');

    if (modalState?.mode === 'edit' && modalState.event) {
      const updated = await apiUpdateEvent(token, modalState.event.id, payload);
      setEvents(events.map(e => (e.id === updated.id ? updated : e)));
    } else {
      const created = await apiCreateEvent(token, payload);
      setEvents([created, ...events]);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Eventos</h1>
          <p className="text-[#222222]/50">Gestiona jornadas y actividades</p>
        </div>
        {canManageEvents && (
          <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setModalState({ mode: 'create' })}>
            <Plus size={18} />
            Nueva Jornada
          </PrimaryButton>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : events.length === 0 ? (
        <p className="text-[#222222]/50">Todavía no hay eventos registrados.</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {(canManageEvents ? ['Título', 'Tipo', 'Ubicación', 'Fecha', 'Estado', 'Detalle', 'Acciones'] : ['Título', 'Tipo', 'Ubicación', 'Fecha', 'Estado', 'Detalle']).map(h => (
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
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{new Date(event.startDate).toLocaleDateString('es-GT')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${eventStatusBadgeClass(event.status)}`}>
                        {eventStatusLabel(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/events/${event.id}`}
                        className="flex items-center gap-1.5 text-[#20A83E] hover:text-[#146B27] text-sm font-medium transition-colors duration-250"
                      >
                        <ClipboardList size={14} /> Ver detalle
                      </Link>
                    </td>
                    {canManageEvents && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModalState({ mode: 'edit', event })}
                            className="p-2 text-[#20A83E] hover:bg-[#20A83E]/10 rounded-lg transition-all duration-250 cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(event)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-250 cursor-pointer">
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
