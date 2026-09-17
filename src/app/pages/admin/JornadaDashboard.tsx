import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { PatientDetailModal } from '../../components/admin/PatientDetailModal';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetJornadaDashboard, apiGetEventRegistrations, JornadaDashboard as JornadaDashboardData, ApiEventRegistration, ApiPagination } from '../../lib/api';
import { PATIENT_STATUS_OPTIONS, patientStatusLabel, patientStatusBadgeClass } from '../../lib/eventMappings';

export function AdminJornadaDashboard() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador';

  const [dashboard, setDashboard] = useState<JornadaDashboardData | null>(null);
  const [registrations, setRegistrations] = useState<ApiEventRegistration[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selected, setSelected] = useState<ApiEventRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    if (!token || !eventId) return;
    apiGetJornadaDashboard(token, eventId)
      .then(setDashboard)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudo cargar la jornada'));
  };

  useEffect(() => {
    loadDashboard();
  }, [token, eventId]);

  useEffect(() => {
    if (!token || !eventId) return;
    setIsLoading(true);
    apiGetEventRegistrations(token, { eventId, page, status: statusFilter || undefined })
      .then(({ items, pagination }) => {
        setRegistrations(items);
        setPagination(pagination);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar los pacientes'))
      .finally(() => setIsLoading(false));
  }, [token, eventId, page, statusFilter]);

  if (!hasAccess) return <RestrictedAccess />;

  const handlePatientUpdated = (updated: ApiEventRegistration) => {
    setRegistrations(registrations.map(r => (r.id === updated.id ? updated : r)));
    loadDashboard();
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <Link to="/admin/events" className="inline-flex items-center gap-2 text-[#222222]/60 hover:text-[#20A83E] transition-colors duration-250 text-sm mb-4">
        <ArrowLeft size={16} /> Volver a Eventos
      </Link>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      {!dashboard ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-[#222222] mb-1 text-3xl">{dashboard.event.title}</h1>
            <div className="flex flex-wrap gap-4 text-[#222222]/50 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(dashboard.event.startDate).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {dashboard.event.location}</span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {dashboard.totalRegistered} / {dashboard.totalCapacity} inscritos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {PATIENT_STATUS_OPTIONS.map(option => (
              <div key={option.value} className="bg-white rounded-[14px] p-4 shadow-sm border border-[#D9D9D9]/50">
                <p className="text-2xl font-bold text-[#222222]">{dashboard.statusSummary[option.value] ?? 0}</p>
                <p className="text-xs text-[#222222]/50">{option.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden mb-6">
            <div className="p-4 border-b border-[#D9D9D9]/40">
              <h2 className="text-[#222222] font-medium">Horarios</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F8F8] text-left text-xs text-[#222222]/50 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Horario</th>
                    <th className="px-6 py-3 font-medium">Cupo</th>
                    <th className="px-6 py-3 font-medium">Inscritos</th>
                    <th className="px-6 py-3 font-medium">Disponible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D9D9]/30">
                  {dashboard.timeSlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="px-6 py-3 text-[#222222] font-medium">{slot.startTime}</td>
                      <td className="px-6 py-3 text-[#222222]/70">{slot.capacity}</td>
                      <td className="px-6 py-3 text-[#222222]/70">{slot.registered}</td>
                      <td className="px-6 py-3">
                        <span className={slot.available === 0 ? 'text-red-500 font-medium' : 'text-[#20A83E] font-medium'}>
                          {slot.available === 0 ? 'Sin cupo' : slot.available}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
            <div className="p-4 border-b border-[#D9D9D9]/40 flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-[#222222] font-medium">Pacientes</h2>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-[#F8F8F8] rounded-xl text-sm border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E]"
              >
                <option value="">Todos los estados</option>
                {PATIENT_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {isLoading ? (
              <p className="text-[#222222]/50 text-sm p-6">Cargando...</p>
            ) : registrations.length === 0 ? (
              <p className="text-[#222222]/50 text-sm p-6">No hay pacientes con ese filtro.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F8F8] text-left text-xs text-[#222222]/50 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-medium">Mascota</th>
                      <th className="px-6 py-3 font-medium">Dueño</th>
                      <th className="px-6 py-3 font-medium">Horario</th>
                      <th className="px-6 py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D9D9]/30">
                    {registrations.map(reg => (
                      <tr key={reg.id} onClick={() => setSelected(reg)} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250 cursor-pointer">
                        <td className="px-6 py-3">
                          <div className="font-medium text-[#222222]">{reg.petName}</div>
                          <div className="text-xs text-[#222222]/40">{reg.species} · {reg.breed}</div>
                        </td>
                        <td className="px-6 py-3 text-[#222222]/70">{reg.ownerName}</td>
                        <td className="px-6 py-3 text-[#222222]/70">{reg.timeSlot.startTime}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${patientStatusBadgeClass(reg.status)}`}>
                            {patientStatusLabel(reg.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && (
              <div className="px-6 pb-4">
                <Pagination pagination={pagination} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}

      {selected && (
        <PatientDetailModal
          registration={selected}
          onClose={() => setSelected(null)}
          onUpdated={handlePatientUpdated}
        />
      )}
    </div>
  );
}
