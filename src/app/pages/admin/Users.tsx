import { useEffect, useState, FormEvent } from 'react';
import { Plus, X, Shield } from 'lucide-react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RestrictedAccess } from '../../components/admin/RestrictedAccess';
import { Pagination } from '../../components/admin/Pagination';
import { useAuth } from '../../context/AuthContext';
import { apiGetUsers, apiCreateUser, AuthUser, UserRole, ApiPagination } from '../../lib/api';

const ROLE_OPTIONS: UserRole[] = ['Superadministrador', 'Voluntario', 'Operador'];

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (user: AuthUser) => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'Voluntario' as UserRole });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full px-4 py-3 bg-[#F8F8F8] rounded-xl text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 text-sm";
  const labelClass = "block text-[#222222] mb-1.5 font-medium text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await apiCreateUser(token, formData);
      onCreated(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-lg border border-[#D9D9D9]/50">
        <div className="flex items-center justify-between p-6 border-b border-[#D9D9D9]/50">
          <h2 className="text-[#222222] text-xl font-medium">Agregar usuario</h2>
          <button type="button" onClick={onClose} className="text-[#222222]/50 hover:text-[#222222] cursor-pointer">
            <X size={22} />
          </button>
        </div>

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
            <label className={labelClass}>Nombre completo <span className="text-red-500">*</span></label>
            <input name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Correo electrónico <span className="text-red-500">*</span></label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
            <input name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Contraseña <span className="text-red-500">*</span></label>
            <input name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className={inputClass} placeholder="Mínimo 8 caracteres" />
          </div>

          <div>
            <label className={labelClass}>Rol <span className="text-red-500">*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <PrimaryButton type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creando...' : 'Crear usuario'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const { token, user } = useAuth();
  const hasAccess = user?.role === 'Superadministrador';
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token || !hasAccess) return;

    setIsLoading(true);
    apiGetUsers(token, { page })
      .then(({ items, pagination }) => {
        setUsers(items);
        setPagination(pagination);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios'))
      .finally(() => setIsLoading(false));
  }, [token, hasAccess, page]);

  if (!hasAccess) return <RestrictedAccess />;

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1 text-3xl">Usuarios</h1>
          <p className="text-[#222222]/50">Gestiona el acceso de tu equipo al panel</p>
        </div>
        <PrimaryButton variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Agregar usuario
        </PrimaryButton>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-[#222222]/50">Cargando...</p>
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-[#D9D9D9]/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F8] text-left text-[#222222]/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Correo</th>
                <th className="px-6 py-3 font-medium">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-[#D9D9D9]/40">
                  <td className="px-6 py-4 text-[#222222] font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-[#222222]/70">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#20A83E]/10 text-[#146B27] px-3 py-1 rounded-full text-xs font-medium">
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

      {isModalOpen && (
        <CreateUserModal
          onClose={() => setIsModalOpen(false)}
          onCreated={(user) => setUsers([user, ...users])}
        />
      )}
    </div>
  );
}
