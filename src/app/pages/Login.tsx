import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import logoImg from '../../imports/huellitaslogo.png';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[12px] text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#D9D9D9]/50">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Huellitas" className="h-16 w-16 object-contain mb-4" />
          <h1 className="text-[#222222] text-2xl">Panel de Administración</h1>
          <p className="text-[#222222]/50 mt-1 text-sm">Huellitas de la Calle</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[#222222] mb-2 font-medium text-sm">
              Correo electrónico
            </label>
            <input
              type="email" id="email" name="email" required
              value={formData.email} onChange={handleChange}
              className={inputClass} placeholder="tucorreo@huellitas.org"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-[#222222] font-medium text-sm">
                Contraseña
              </label>
              <Link to="/forgot-password" className="text-[#20A83E] text-sm hover:text-[#146B27] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} id="password" name="password" required
                value={formData.password} onChange={handleChange}
                className={`${inputClass} pr-12`} placeholder="••••••••"
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
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
