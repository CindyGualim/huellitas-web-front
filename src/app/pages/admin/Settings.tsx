import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Globe, Banknote, Package, Plus, X } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetSiteSettings, apiUpdateSiteSettings, ApiSiteSettings } from '../../lib/api';
import { setSiteSettingsCache } from '../../lib/useSiteSettings';

const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E] transition-all duration-250 text-sm";
const labelClass = "block text-sm text-[#222222]/60 mb-2";

const EMPTY_SETTINGS: ApiSiteSettings = {
  instagramHandle: '',
  contactEmail: '',
  whatsappNumber: '',
  bankName: '',
  bankAccountType: '',
  bankAccountNumber: '',
  bankAccountHolder: '',
  donationDropoffAddress: '',
  donationDropoffHours: '',
  neededSupplies: []
};

export function AdminSettings() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [settings, setSettings] = useState<ApiSiteSettings>(EMPTY_SETTINGS);
  const [newSupply, setNewSupply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiGetSiteSettings()
      .then(setSettings)
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudo cargar la configuración'))
      .finally(() => setIsLoading(false));
  }, []);

  if (!hasAccess) return <RestrictedAccess />;

  const update = <K extends keyof ApiSiteSettings>(key: K, value: ApiSiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addSupply = () => {
    const value = newSupply.trim();
    if (!value) return;
    update('neededSupplies', [...settings.neededSupplies, value]);
    setNewSupply('');
  };

  const removeSupply = (index: number) => {
    update('neededSupplies', settings.neededSupplies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const saved = await apiUpdateSiteSettings(token, settings);
      setSettings(saved);
      setSiteSettingsCache(saved);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Configuración</h1>
        <p className="text-[#222222]/50">Ajustes del sistema y del sitio público</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#20A83E]/10 rounded-xl">
              <Lock size={22} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 className="text-[#222222] text-lg font-medium">Seguridad</h2>
              <p className="text-xs text-[#222222]/40">Opciones de seguridad de la cuenta</p>
            </div>
          </div>
          <p className="text-sm text-[#222222]/70 mb-4">
            El cambio de contraseña y los datos de tu cuenta se gestionan desde tu perfil.
          </p>
          <Link
            to="/admin/profile"
            className="inline-block px-4 py-2.5 bg-[#F8F8F8] rounded-xl text-[#222222] text-sm border border-[#D9D9D9] hover:bg-[#20A83E]/5 hover:border-[#20A83E]/20 transition-all duration-250"
          >
            Ir a mi perfil
          </Link>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#20A83E]/10 rounded-xl">
              <Globe size={22} className="text-[#20A83E]" />
            </div>
            <div>
              <h2 className="text-[#222222] text-lg font-medium">Contacto</h2>
              <p className="text-xs text-[#222222]/40">Datos que se muestran en el sitio público</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-[#222222]/50">Cargando...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Instagram</label>
                <input value={settings.instagramHandle} onChange={e => update('instagramHandle', e.target.value)} className={inputClass} placeholder="@huellitasdelacalleong" />
              </div>
              <div>
                <label className={labelClass}>Email de contacto</label>
                <input type="email" value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp (solo dígitos, con código de país)</label>
                <input value={settings.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} className={inputClass} placeholder="50212345678" />
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="px-4 py-2.5 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">
            Configuración guardada correctamente
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#20A83E]/10 rounded-xl">
                  <Banknote size={22} className="text-[#20A83E]" />
                </div>
                <div>
                  <h2 className="text-[#222222] text-lg font-medium">Cuenta para donaciones</h2>
                  <p className="text-xs text-[#222222]/40">Se muestra en "Quiero Ayudar" al hacer clic en el botón</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Banco</label>
                  <input value={settings.bankName} onChange={e => update('bankName', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tipo de cuenta</label>
                  <input value={settings.bankAccountType} onChange={e => update('bankAccountType', e.target.value)} className={inputClass} placeholder="Cuenta Monetaria" />
                </div>
                <div>
                  <label className={labelClass}>Número de cuenta</label>
                  <input value={settings.bankAccountNumber} onChange={e => update('bankAccountNumber', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>A nombre de</label>
                  <input value={settings.bankAccountHolder} onChange={e => update('bankAccountHolder', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#20A83E]/10 rounded-xl">
                  <Package size={22} className="text-[#20A83E]" />
                </div>
                <div>
                  <h2 className="text-[#222222] text-lg font-medium">Donaciones en especie</h2>
                  <p className="text-xs text-[#222222]/40">Centro de acopio e insumos necesitados</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Dirección del centro de acopio</label>
                  <input value={settings.donationDropoffAddress} onChange={e => update('donationDropoffAddress', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Horario de atención</label>
                  <input value={settings.donationDropoffHours} onChange={e => update('donationDropoffHours', e.target.value)} className={inputClass} placeholder="Lunes a sábado de 9:00 AM a 4:00 PM" />
                </div>
                <div>
                  <label className={labelClass}>Insumos más necesitados</label>
                  <div className="space-y-2 mb-3">
                    {settings.neededSupplies.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-[#F8F8F8] rounded-lg text-sm text-[#222222] border border-[#D9D9D9]">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeSupply(i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Quitar ${item}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={newSupply}
                      onChange={e => setNewSupply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSupply(); } }}
                      className={inputClass}
                      placeholder="Ej: Vitaminas"
                    />
                    <button
                      type="button"
                      onClick={addSupply}
                      className="p-3 bg-[#20A83E]/10 text-[#20A83E] rounded-xl hover:bg-[#20A83E]/20 transition-colors shrink-0"
                      aria-label="Agregar insumo"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
          <PrimaryButton type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </PrimaryButton>
        )}
      </form>
    </div>
  );
}
