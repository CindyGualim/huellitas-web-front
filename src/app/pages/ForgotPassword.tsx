import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { apiForgotPassword } from '../lib/api';
import logoImg from '../../imports/huellitaslogo.png';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[12px] text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await apiForgotPassword(email);
      setMessage('Si el correo existe en el sistema, se envió un enlace de recuperación.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#D9D9D9]/50">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Huellitas" className="h-16 w-16 object-contain mb-4" />
          <h1 className="text-[#222222] text-2xl">Recuperar contraseña</h1>
          <p className="text-[#222222]/50 mt-1 text-sm text-center">
            Ingresá tu correo y te enviaremos un enlace para restablecerla
          </p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-[12px] bg-[#20A83E]/10 border border-[#20A83E]/30 text-[#146B27] text-sm">
            {message}
          </div>
        )}

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
              value={email} onChange={(e) => setEmail(e.target.value)}
              className={inputClass} placeholder="tucorreo@huellitas.org"
            />
          </div>

          <PrimaryButton type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </PrimaryButton>
        </form>

        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-[#146B27] hover:text-[#20A83E] transition-colors text-sm">
          <ArrowLeft size={16} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
