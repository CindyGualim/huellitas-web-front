import { useState, FormEvent } from 'react';
import { Mail, Phone, Calendar, Shield, Clock, Eye, EyeOff, X } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { apiUpdateProfile, apiChangePassword } from '../../lib/api';

const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

function formatDate(value: string | null) {
  if (!value) return 'Nunca';
  return new Date(value).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('La confirmación no coincide con la nueva contraseña');
      return;
    }

    if (!token) return;
    setIsSubmitting(true);

    try {
      await apiChangePassword(token, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50">
          <h2 className="text-[#222222] text-xl font-medium">Cambiar contraseña</h2>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {success ? (
          <div className="p-6">
            <div className="px-4 py-3 rounded-xl bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm mb-6">
              Tu contraseña se actualizó correctamente.
            </div>
            <PrimaryButton type="button" variant="primary" fullWidth onClick={onClose}>
              Listo
            </PrimaryButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <p className="text-xs text-[#222222]/50">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>

            <div>
              <label className={labelClass}>Contraseña actual <span className="text-red-500">*</span></label>
              <input
                type={showPasswords ? 'text' : 'password'} required
                value={formData.currentPassword}
                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Nueva contraseña <span className="text-red-500">*</span></label>
              <input
                type={showPasswords ? 'text' : 'password'} required minLength={8}
                value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                className={inputClass}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className={labelClass}>Confirmar nueva contraseña <span className="text-red-500">*</span></label>
              <input
                type={showPasswords ? 'text' : 'password'} required minLength={8}
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-2 text-[#222222]/50 hover:text-[#222222] text-sm transition-colors cursor-pointer"
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPasswords ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
            </button>

            <div className="flex gap-3 pt-2">
              <PrimaryButton type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </PrimaryButton>
              <PrimaryButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AdminProfile() {
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const infoRows = [
    { icon: Mail, label: 'Correo electrónico', value: user.email },
    { icon: Phone, label: 'Teléfono', value: user.phone },
    { icon: Calendar, label: 'Miembro desde', value: formatDate(user.createdAt) }
  ];

  const startEditing = () => {
    setFormData({ name: user.name, phone: user.phone });
    setError(null);
    setIsEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const updated = await apiUpdateProfile(token, formData);
      updateUser(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1 text-3xl">Mi Perfil</h1>
        <p className="text-[#222222]/50">Información de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] p-8 shadow-sm border border-[#D9D9D9]/50 mb-5">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#D9D9D9]/40">
              <div className="w-20 h-20 rounded-full bg-[#20A83E] flex items-center justify-center text-2xl font-medium text-white shrink-0">
                {initials}
              </div>
              <div>
                <h2 className="text-[#222222] mb-1 text-2xl">{user.name}</h2>
                <div className="flex items-center gap-2 text-[#222222]/50 text-sm">
                  <Shield size={14} />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-[#222222]/50">
                  <span className="text-red-500">*</span> Campos obligatorios
                </p>

                <div>
                  <label className={labelClass}>Nombre completo <span className="text-red-500">*</span></label>
                  <input
                    required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
                  <input
                    required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <PrimaryButton type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </PrimaryButton>
                  <PrimaryButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-5">
                  {infoRows.map(row => (
                    <div key={row.label} className="flex items-start gap-4">
                      <div className="p-3 bg-[#20A83E]/10 rounded-xl shrink-0">
                        <row.icon size={18} className="text-[#20A83E]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#222222]/40 mb-0.5">{row.label}</div>
                        <div className="text-[#222222] font-medium text-sm">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-[#D9D9D9]/40">
                  <PrimaryButton variant="primary" onClick={startEditing}>Editar Perfil</PrimaryButton>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <h3 className="text-[#222222] mb-4 text-lg font-medium">Información de Sesión</h3>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#222222]/30 mt-0.5" />
              <div>
                <div className="text-xs text-[#222222]/40 mb-1">Último inicio de sesión</div>
                <div className="text-sm text-[#222222]">{formatDate(user.lastLoginAt)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#D9D9D9]/50">
            <h3 className="text-[#222222] mb-4 text-lg font-medium">Configuración de Cuenta</h3>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full text-left px-4 py-3 bg-[#F8F8F8] rounded-xl hover:bg-[#20A83E]/5 transition-all duration-250 text-sm text-[#222222] border border-transparent hover:border-[#20A83E]/20 cursor-pointer"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
    </div>
  );
}
