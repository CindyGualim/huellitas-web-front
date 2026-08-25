import { useEffect, useState } from 'react';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetEventRegistrations, ApiEventRegistration } from '../../lib/api';

export function AdminRegistrations() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [registrations, setRegistrations] = useState<ApiEventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !hasAccess) return;

    apiGetEventRegistrations(token)
      .then(setRegistrations)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar las inscripciones'))
      .finally(() => setIsLoading(false));
  }, [token, hasAccess]);

  if (!hasAccess) return <RestrictedAccess />;

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Inscripciones</h1>
        <p className="text-[#222222]/50">Registro de participantes en jornadas</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : registrations.length === 0 ? (
        <p className="text-[#222222]/50">Todavía no hay inscripciones registradas.</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {['Dueño', 'Contacto', 'Mascota', 'Jornada', 'Fecha'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/30">
                {registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#222222] text-sm">{reg.ownerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#222222]/50 text-sm">
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
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#222222]/30" />
                        <span className="text-[#222222] text-sm">{new Date(reg.event.startDate).toLocaleDateString('es-GT')}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
