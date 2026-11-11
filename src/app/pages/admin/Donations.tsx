import { useState } from 'react';
import { Plus, Edit2, Gift, Ban } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DonationFormModal } from '../../components/admin/DonationFormModal';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetDonations, apiCreateDonation, apiUpdateDonation, apiVoidDonation, ApiDonation, DonationPayload } from '../../lib/api';
import { paymentMethodLabel } from '../../lib/eventMappings';
import { formatDateOnly } from '../../lib/dateUtils';
import { errorMessage, useApiResource } from '../../lib/useApiResource';

export function AdminDonations() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ mode: 'create' | 'edit'; donation?: ApiDonation } | null>(null);

  const { data, loading: isLoading, error: loadError, reload } = useApiResource(
    token && hasAccess ? () => apiGetDonations(token, { page }) : null,
    [token, hasAccess, page],
    { fallbackMessage: 'No se pudieron cargar las donaciones', keepPreviousData: true }
  );
  const donations = data?.items ?? [];
  const pagination = data?.pagination ?? null;
  const totalAmount = data?.totalAmount ?? 0;
  const error = actionError ?? loadError;

  if (!hasAccess) return <RestrictedAccess />;

  // Después de cada cambio se recarga la página: el total, el orden por fecha y la paginación
  // los calcula el servidor.
  const handleFormSubmit = async (payload: DonationPayload) => {
    if (!token) throw new Error('No autorizado');
    setActionError(null);

    if (modalState?.mode === 'edit' && modalState.donation) {
      await apiUpdateDonation(token, modalState.donation.id, payload);
    } else {
      await apiCreateDonation(token, payload);
    }
    reload();
  };

  const handleVoid = async (donation: ApiDonation) => {
    if (!token) return;
    const reason = window.prompt(
      `Anular la donación de ${donation.donorName} por Q${donation.amount.toFixed(2)}.\nDejará de sumar en los totales, pero queda registrada.\n\nMotivo (por ejemplo "registrada dos veces"):`
    );
    if (reason === null) return;
    if (reason.trim().length < 3) {
      setActionError('Escribí un motivo para anular la donación (al menos 3 caracteres).');
      return;
    }

    setActionError(null);
    try {
      await apiVoidDonation(token, donation.id, reason.trim());
      reload();
    } catch (err) {
      setActionError(errorMessage(err, 'No se pudo anular la donación'));
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Donaciones</h1>
          <p className="text-[#222222]/50">
            {totalAmount > 0 ? `Q${totalAmount.toFixed(2)} recaudados en total` : 'Gestiona las donaciones recibidas'}
          </p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setModalState({ mode: 'create' })}>
          <Plus size={18} />
          Registrar donación
        </PrimaryButton>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex flex-wrap items-center justify-between gap-3" role="alert">
          <span>{error}</span>
          {loadError && !actionError && (
            <button onClick={reload} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 cursor-pointer">Reintentar</button>
          )}
        </div>
      )}

      {isLoading && donations.length === 0 ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : donations.length === 0 ? (
        !loadError && <p className="text-[#222222]/50">Todavía no hay donaciones registradas.</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {['Donante', 'Correo', 'Monto', 'Método', 'Fecha', 'Acciones'].map(h => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-medium text-[#222222]/50 uppercase tracking-wider ${h === 'Monto' ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/30">
                {donations.map(donation => (
                  <tr key={donation.id} className={`transition-colors duration-250 ${donation.isVoided ? 'bg-[#F8F8F8]/60 text-[#222222]/40' : 'hover:bg-[#F8F8F8]/60'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#20A83E]/10 rounded-lg">
                          <Gift size={14} className="text-[#20A83E]" />
                        </div>
                        <div>
                          <span className={`font-medium text-sm ${donation.isVoided ? 'line-through' : 'text-[#222222]'}`}>{donation.donorName}</span>
                          {donation.isVoided && (
                            <div className="text-xs text-red-500/80" title={donation.voidReason ?? undefined}>
                              Anulada{donation.voidReason ? `: ${donation.voidReason}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222]/70 text-sm">{donation.donorEmail || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium text-sm whitespace-nowrap ${donation.isVoided ? 'line-through' : 'text-[#222222]'}`}>Q{donation.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222]/70 text-sm">{paymentMethodLabel(donation.paymentMethod)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm whitespace-nowrap">{formatDateOnly(donation.donationDate, {})}</span>
                    </td>
                    <td className="px-6 py-4">
                      {!donation.isVoided && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModalState({ mode: 'edit', donation })}
                            aria-label={`Editar donación de ${donation.donorName}`}
                            className="p-2 text-[#20A83E] hover:bg-[#20A83E]/10 rounded-lg transition-all duration-250 cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleVoid(donation)}
                            aria-label={`Anular donación de ${donation.donorName}`}
                            title="Anular"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-250 cursor-pointer"
                          >
                            <Ban size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

      {modalState && (
        <DonationFormModal
          mode={modalState.mode}
          initialData={modalState.donation}
          onSubmit={handleFormSubmit}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
