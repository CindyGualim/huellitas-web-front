import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetAdoptionRequests, apiUpdateAdoptionRequestStatus, ApiAdoptionRequest, AdoptionRequestStatus } from '../../lib/api';
import { ADOPTION_REQUEST_STATUS_OPTIONS, adoptionRequestStatusLabel, adoptionRequestStatusBadgeClass } from '../../lib/petMappings';

const YES_NO_QUESTIONS: { key: 'hasChildren' | 'familyAgreement' | 'hasVeterinarian' | 'secureSpace'; question: string }[] = [
  { key: 'hasChildren', question: '¿Hay niños en el hogar?' },
  { key: 'familyAgreement', question: '¿Todas las personas en el hogar están de acuerdo?' },
  { key: 'hasVeterinarian', question: '¿Cuenta con un veterinario de confianza?' },
  { key: 'secureSpace', question: '¿Tiene un espacio seguro para la mascota?' }
];

export function AdminAdoptionRequests() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [requests, setRequests] = useState<ApiAdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !hasAccess) return;

    apiGetAdoptionRequests(token)
      .then(setRequests)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes'))
      .finally(() => setIsLoading(false));
  }, [token, hasAccess]);

  if (!hasAccess) return <RestrictedAccess />;

  const handleStatusChange = async (request: ApiAdoptionRequest, status: AdoptionRequestStatus) => {
    if (!token) return;
    setError(null);
    setUpdatingId(request.id);

    try {
      const updated = await apiUpdateAdoptionRequestStatus(token, request.id, status);
      setRequests(requests.map(r => (r.id === request.id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado de la solicitud');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Solicitudes de Adopción</h1>
        <p className="text-[#222222]/50">Revisa y da seguimiento a quienes quieren adoptar</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : requests.length === 0 ? (
        <p className="text-[#222222]/50">Todavía no hay solicitudes de adopción.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(request => {
            const isExpanded = expandedId === request.id;

            return (
              <div key={request.id} className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-[#F8F8F8]/60 transition-colors duration-250"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <div className="font-medium text-[#222222]">{request.adopter.fullName}</div>
                      <div className="text-xs text-[#222222]/40">
                        Quiere adoptar a <span className="font-medium text-[#222222]/70">{request.pet.name}</span> · {new Date(request.submittedAt).toLocaleDateString('es-GT')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${adoptionRequestStatusBadgeClass(request.status)}`}>
                      {adoptionRequestStatusLabel(request.status)}
                    </span>
                    {isExpanded ? <ChevronUp size={18} className="text-[#222222]/40" /> : <ChevronDown size={18} className="text-[#222222]/40" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#D9D9D9]/40 pt-4">
                    <div className="grid md:grid-cols-2 gap-6 mb-5">
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Datos del adoptante</h4>
                        <div className="space-y-1.5 text-sm text-[#222222]/80">
                          <p>DPI: {request.adopter.dpi}</p>
                          <p className="flex items-center gap-2"><Phone size={13} className="text-[#222222]/40" /> {request.adopter.phone}</p>
                          <p className="flex items-center gap-2"><Mail size={13} className="text-[#222222]/40" /> {request.adopter.email}</p>
                          <p className="flex items-center gap-2"><MapPin size={13} className="text-[#222222]/40" /> {request.adopter.address}, {request.adopter.municipality}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Cuestionario</h4>
                        <div className="space-y-1.5 text-sm text-[#222222]/80">
                          {YES_NO_QUESTIONS.map(q => (
                            <p key={q.key}>{q.question} <span className="font-medium">{request[q.key] ? 'Sí' : 'No'}</span></p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-xs font-semibold uppercase text-[#222222]/40 mb-2 tracking-wider">Motivo de adopción</h4>
                      <p className="text-sm text-[#222222]/80 bg-[#F8F8F8] rounded-xl p-3">{request.reason}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ADOPTION_REQUEST_STATUS_OPTIONS.filter(option => option.value !== request.status).map(option => (
                        <button
                          key={option.value}
                          disabled={updatingId === request.id}
                          onClick={() => handleStatusChange(request, option.value)}
                          className="px-4 py-2 rounded-lg text-sm border border-[#D9D9D9] text-[#222222] hover:bg-[#F8F8F8] transition-colors duration-250 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Marcar como {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
