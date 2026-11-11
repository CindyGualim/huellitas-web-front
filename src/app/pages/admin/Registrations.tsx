import { useState } from 'react';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { Pagination } from '../../components/admin/Pagination';
import { PatientDetailModal } from '../../components/admin/PatientDetailModal';
import { useAuth } from '../../context/AuthContext';
import { apiGetEventRegistrations, ApiEventRegistration } from '../../lib/api';
import { patientStatusLabel, patientStatusBadgeClass } from '../../lib/eventMappings';
import { formatEventDate } from '../../lib/dateUtils';
import { useApiResource } from '../../lib/useApiResource';

export function AdminRegistrations() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador' || user?.role === 'Voluntario';
  const canManagePatients = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ApiEventRegistration | null>(null);

  const { data, setData, loading: isLoading, error, reload } = useApiResource(
    token && hasAccess ? () => apiGetEventRegistrations(token, { page }) : null,
    [token, hasAccess, page],
    { fallbackMessage: 'No se pudieron cargar las inscripciones', keepPreviousData: true }
  );
  const registrations = data?.items ?? [];
  const pagination = data?.pagination ?? null;

  if (!hasAccess) return <RestrictedAccess />;

  const handlePatientUpdated = (updated: ApiEventRegistration) => {
    setData(prev => (prev ? { ...prev, items: prev.items.map(r => (r.id === updated.id ? { ...r, ...updated } : r)) } : prev));
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Inscripciones</h1>
        <p className="text-[#222222]/50">Registro de participantes en jornadas</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex flex-wrap items-center justify-between gap-3" role="alert">
          <span>{error}</span>
          <button onClick={reload} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 cursor-pointer">Reintentar</button>
        </div>
      )}

      {isLoading && registrations.length === 0 ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : registrations.length === 0 ? (
        !error && <p className="text-[#222222]/50">Todavía no hay inscripciones registradas.</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {['Dueño', 'Contacto', 'Mascota', 'Jornada', 'Fecha', 'Estado'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/30">
                {registrations.map(reg => (
                  <tr
                    key={reg.id}
                    onClick={() => canManagePatients && setSelected(reg)}
                    className={`transition-colors duration-250 ${canManagePatients ? 'hover:bg-[#F8F8F8]/60 cursor-pointer' : ''}`}
                  >
                    <td className="px-6 py-4">
                      {canManagePatients ? (
                        // Botón real para abrir la ficha también con teclado (Tab + Enter).
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setSelected(reg); }}
                          className="font-medium text-[#222222] text-sm text-left hover:text-[#20A83E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20A83E] rounded cursor-pointer"
                        >
                          {reg.ownerName}
                        </button>
                      ) : (
                        <div className="font-medium text-[#222222] text-sm">{reg.ownerName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#222222]/50 text-sm whitespace-nowrap">
                        <Phone size={13} />
                        <span>{reg.ownerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#222222] text-sm">{reg.petName}</div>
                      <div className="text-xs text-[#222222]/40">{reg.species} · {reg.breed}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{reg.event.title}</span>
                      </div>
                      <div className="text-xs text-[#222222]/40 ml-5">{reg.event.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar size={13} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{formatEventDate(reg.event.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${patientStatusBadgeClass(reg.status)}`}>
                        {patientStatusLabel(reg.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

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
