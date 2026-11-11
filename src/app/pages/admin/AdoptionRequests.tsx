import { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetAdoptionRequests, apiUpdateAdoptionRequestStatus, ApiAdoptionRequest, AdoptionRequestStatus } from '../../lib/api';
import { ADOPTION_REQUEST_STATUS_OPTIONS, ADOPTION_REQUEST_TRANSITIONS, adoptionRequestStatusLabel, adoptionRequestStatusBadgeClass } from '../../lib/petMappings';
import { errorMessage, useApiResource } from '../../lib/useApiResource';

const YES_NO_QUESTIONS: { key: 'hasChildren' | 'familyAgreement' | 'hasVeterinarian' | 'secureSpace'; question: string }[] = [
  { key: 'hasChildren', question: '¿Hay niños en el hogar?' },
  { key: 'familyAgreement', question: '¿Todas las personas en el hogar están de acuerdo?' },
  { key: 'hasVeterinarian', question: '¿Cuenta con un veterinario de confianza?' },
  { key: 'secureSpace', question: '¿Tiene un espacio seguro para la mascota?' }
];

export function AdminAdoptionRequests() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador' || user?.role === 'Operador';
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AdoptionRequestStatus | ''>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, loading: isLoading, error: loadError, reload } = useApiResource(
    token && hasAccess ? () => apiGetAdoptionRequests(token, { page, status: statusFilter || undefined }) : null,
    [token, hasAccess, page, statusFilter],
    { fallbackMessage: 'No se pudieron cargar las solicitudes', keepPreviousData: true }
  );
  const requests = data?.items ?? [];
  const pagination = data?.pagination ?? null;
  const error = actionError ?? loadError;

  if (!hasAccess) return <RestrictedAccess />;

  const handleStatusChange = async (request: ApiAdoptionRequest, status: AdoptionRequestStatus) => {
    if (!token) return;

    if (status === 'Aprobada' && !window.confirm(
      `¿Aprobar la adopción de ${request.pet.name} por ${request.adopter.fullName}? La mascota pasará a "Adoptada" y las demás solicitudes abiertas para ella se rechazarán.`
    )) return;

    if (request.status === 'Aprobada' && !window.confirm(
      `Esta solicitud está aprobada. Cambiarla a "${adoptionRequestStatusLabel(status)}" revierte la adopción: ${request.pet.name} vuelve a estar Disponible. ¿Continuar?`
    )) return;

    setActionError(null);
    setNotice(null);
    setUpdatingId(request.id);

    try {
      const updated = await apiUpdateAdoptionRequestStatus(token, request.id, status);
      const siblings = updated.rejectedSiblingIds ?? [];
      if (siblings.length > 0) {
        // Al aprobar, las demás solicitudes de la mascota se rechazaron automáticamente: revertir no las reabre.
        setNotice(
          `${request.pet.name} vuelve a estar disponible. Tiene ${siblings.length} solicitud${siblings.length === 1 ? '' : 'es'} rechazada${siblings.length === 1 ? '' : 's'} ` +
          `(#${siblings.join(', #')}). Si querés retomarlas, filtrá por "Rechazada" y marcalas como Pendiente.`
        );
      }
      // Aprobar o revertir también cambia otras solicitudes y la mascota: se recarga la página completa.
      reload();
    } catch (err) {
      setActionError(errorMessage(err, 'No se pudo actualizar el estado de la solicitud'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Solicitudes de Adopción</h1>
          <p className="text-[#222222]/50">Revisa y da seguimiento a quienes quieren adoptar</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#222222]/70">
          Estado
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as AdoptionRequestStatus | ''); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-[#D9D9D9] bg-white text-[#222222]"
          >
            <option value="">Todas</option>
            {ADOPTION_REQUEST_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
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

      {isLoading && requests.length === 0 ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : requests.length === 0 ? (
        !loadError && <p className="text-[#222222]/50">{statusFilter ? 'No hay solicitudes con ese estado.' : 'Todavía no hay solicitudes de adopción.'}</p>
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
                      {ADOPTION_REQUEST_STATUS_OPTIONS.filter(option => (ADOPTION_REQUEST_TRANSITIONS[request.status] ?? []).includes(option.value)).map(option => (
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

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
    </div>
  );
}
