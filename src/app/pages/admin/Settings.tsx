import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Globe } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { useAuth } from '../../context/AuthContext';
import { apiGetSiteSettings, apiUpdateSiteSettings } from '../../lib/api';

const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#20A83E] transition-all duration-250 text-sm";

export function AdminSettings() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [instagramHandle, setInstagramHandle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiGetSiteSettings()
      .then(settings => {
        setInstagramHandle(settings.instagramHandle);
        setContactEmail(settings.contactEmail);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudo cargar la configuración'))
      .finally(() => setIsLoading(false));
  }, []);

  if (!hasAccess) return <RestrictedAccess />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await apiUpdateSiteSettings(token, { instagramHandle, contactEmail });
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
        <p className="text-[#222222]/50">Ajustes del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
              <h2 className="text-[#222222] text-lg font-medium">Sitio Web</h2>
              <p className="text-xs text-[#222222]/40">Configuración del sitio público</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-[#222222]/50">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="px-4 py-2.5 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">
                  Configuración guardada correctamente
                </div>
              )}

              <div>
                <label className="block text-sm text-[#222222]/60 mb-2">Instagram</label>
                <input
                  value={instagramHandle}
                  onChange={e => setInstagramHandle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-[#222222]/60 mb-2">Email de contacto</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <PrimaryButton type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </PrimaryButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
