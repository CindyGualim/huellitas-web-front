import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

export function AdoptionRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', city: '', reason: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20">
          <div className="bg-white rounded-[20px] p-12 text-center shadow-sm border border-[#D9D9D9]/50">
            <div className="flex justify-center mb-6">
              <div className="bg-[#20A83E]/10 p-6 rounded-full">
                <CheckCircle size={56} className="text-[#20A83E]" />
              </div>
            </div>
            <h1 className="text-[#222222] mb-4 text-3xl">¡Solicitud enviada!</h1>
            <p className="text-[#222222]/60 mb-8 max-w-md mx-auto leading-relaxed">
              Hemos recibido tu solicitud de adopción. Nos pondremos en contacto contigo
              en las próximas 48 horas para coordinar una visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link to="/adoptions" className="flex-1">
                <PrimaryButton variant="primary" fullWidth>Ver más perritos</PrimaryButton>
              </Link>
              <Link to="/home" className="flex-1">
                <PrimaryButton variant="ghost" fullWidth>Volver al inicio</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const inputClass = "w-full px-5 py-4 bg-[#F8F8F8] rounded-[12px] text-[#222222] placeholder-[#222222]/30 focus:outline-none focus:ring-2 focus:ring-[#20A83E] border border-[#D9D9D9] transition-all duration-250 hover:border-[#20A83E]/50";

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-14">
          <div className="mx-auto max-w-2xl">
            <Link to="/adoptions" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-250 mb-4">
              <ArrowLeft size={18} />
              <span className="text-sm">Volver</span>
            </Link>
            <h1 className="text-white text-3xl">Formulario de Adopción</h1>
            <p className="text-white/60 mt-1">Completa la información a continuación</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-10 pb-16">
          <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-sm border border-[#D9D9D9]/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-[#222222] mb-2 font-medium text-sm">
                  Nombre completo
                </label>
                <input
                  type="text" id="fullName" name="fullName" required
                  value={formData.fullName} onChange={handleChange}
                  className={inputClass} placeholder="Ingresa tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[#222222] mb-2 font-medium text-sm">
                  Número de teléfono
                </label>
                <input
                  type="tel" id="phone" name="phone" required
                  value={formData.phone} onChange={handleChange}
                  className={inputClass} placeholder="+502 1234-5678"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-[#222222] mb-2 font-medium text-sm">
                  Ciudad
                </label>
                <input
                  type="text" id="city" name="city" required
                  value={formData.city} onChange={handleChange}
                  className={inputClass} placeholder="Ciudad de Guatemala"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-[#222222] mb-2 font-medium text-sm">
                  ¿Por qué quieres adoptar?
                </label>
                <textarea
                  id="reason" name="reason" required
                  value={formData.reason} onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Cuéntanos por qué quieres darle un hogar a este perrito..."
                />
              </div>

              <PrimaryButton type="submit" variant="primary" fullWidth className="mt-4">
                Enviar solicitud
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
