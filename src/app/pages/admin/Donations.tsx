import { useEffect, useState } from 'react';
import { Plus, Edit2, Gift } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DonationFormModal } from '../../components/admin/DonationFormModal';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetDonations, apiCreateDonation, apiUpdateDonation, ApiDonation, DonationPayload } from '../../lib/api';
import { paymentMethodLabel } from '../../lib/eventMappings';

export function AdminDonations() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [donations, setDonations] = useState<ApiDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ mode: 'create' | 'edit'; donation?: ApiDonation } | null>(null);

  useEffect(() => {
    if (!token || !hasAccess) return;

    apiGetDonations(token)
      .then(setDonations)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar las donaciones'))
      .finally(() => setIsLoading(false));
  }, [token, hasAccess]);

  if (!hasAccess) return <RestrictedAccess />;

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  const handleFormSubmit = async (payload: DonationPayload) => {
    if (!token) throw new Error('No autorizado');

    if (modalState?.mode === 'edit' && modalState.donation) {
      const updated = await apiUpdateDonation(token, modalState.donation.id, payload);
      setDonations(donations.map(d => (d.id === updated.id ? updated : d)));
    } else {
      const created = await apiCreateDonation(token, payload);
      setDonations([created, ...donations]);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Donaciones</h1>
          <p className="text-[#222222]/50">
            {donations.length > 0 ? `Q${total.toFixed(2)} recaudados en total` : 'Gestiona las donaciones recibidas'}
          </p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setModalState({ mode: 'create' })}>
          <Plus size={18} />
          Registrar donación
        </PrimaryButton>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : donations.length === 0 ? (
        <p className="text-[#222222]/50">Todavía no hay donaciones registradas.</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#D9D9D9]/50">
                <tr>
                  {['Donante', 'Correo', 'Monto', 'Método', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#222222]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/30">
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-[#F8F8F8]/60 transition-colors duration-250">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#20A83E]/10 rounded-lg">
                          <Gift size={14} className="text-[#20A83E]" />
                        </div>
                        <span className="text-[#222222] font-medium text-sm">{donation.donorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222]/70 text-sm">{donation.donorEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222] font-medium text-sm">Q{Number(donation.amount).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222]/70 text-sm">{paymentMethodLabel(donation.paymentMethod)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#222222] text-sm">{new Date(donation.donationDate).toLocaleDateString('es-GT')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModalState({ mode: 'edit', donation })}
                        className="p-2 text-[#20A83E] hover:bg-[#20A83E]/10 rounded-lg transition-all duration-250 cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
