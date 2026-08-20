import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { apiResetPassword } from '../lib/api';
import logoImg from '../../imports/huellitaslogo.png';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[12px] text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiResetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#D9D9D9]/50 text-center">
          <p className="text-[#222222] mb-6">El enlace de recuperación no es válido.</p>
          <Link to="/forgot-password" className="text-[#20A83E] hover:text-[#146B27] font-medium">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#D9D9D9]/50">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Huellitas" className="h-16 w-16 object-contain mb-4" />
          <h1 className="text-[#222222] text-2xl">Nueva contraseña</h1>
          <p className="text-[#222222]/50 mt-1 text-sm">Elegí una nueva contraseña para tu cuenta</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-[#222222] mb-2 font-medium text-sm">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} id="password" name="password" required minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`} placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#222222]/40 hover:text-[#222222] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <PrimaryButton type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
