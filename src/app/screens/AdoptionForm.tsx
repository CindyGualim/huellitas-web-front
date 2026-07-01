import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

export function AdoptionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const petId = location.state?.petId;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20">
          <div className="bg-white rounded-[16px] p-12 text-center shadow-sm border border-[#E7D7B1]/50">
            <div className="flex justify-center mb-6">
              <div className="bg-[#178C2E]/10 p-6 rounded-full">
                <CheckCircle size={56} className="text-[#178C2E]" />
              </div>
            </div>
            <h1 className="text-[#4A2E1F] mb-4 text-3xl">¡Solicitud enviada!</h1>
            <p className="text-[#4A2E1F]/80 mb-8 max-w-md mx-auto leading-relaxed">
              Hemos recibido tu solicitud de adopción. Nos pondremos en contacto contigo
              en las próximas 48 horas para coordinar una visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link to="/adoptions" className="flex-1">
                <PrimaryButton variant="primary" fullWidth>
                  Ver más perritos
                </PrimaryButton>
              </Link>
              <Link to="/home" className="flex-1">
                <PrimaryButton variant="ghost" fullWidth>
                  Volver al inicio
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-16">
        <Link
          to={petId ? `/adoptions/${petId}` : '/adoptions'}
          className="flex items-center gap-2 text-[#178C2E] mb-8 hover:text-[#136e24]"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </Link>

        <div className="bg-white rounded-[16px] p-8 md:p-10 shadow-sm border border-[#E7D7B1]/50">
          <h1 className="text-[#4A2E1F] mb-2 text-3xl">Formulario de Adopción</h1>
          <p className="text-[#4A2E1F]/70 mb-8">Completa la información a continuación</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-[#4A2E1F] mb-2 font-medium">
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-[#4A2E1F] mb-2 font-medium">
                Número de teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
                placeholder="+502 1234-5678"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-[#4A2E1F] mb-2 font-medium">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
                placeholder="Ciudad de Guatemala"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-[#4A2E1F] mb-2 font-medium">
                ¿Por qué quieres adoptar?
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                rows={5}
                className="w-full px-5 py-4 bg-[#FFF9F1] rounded-[12px] text-[#4A2E1F] focus:outline-none focus:ring-2 focus:ring-[#178C2E] resize-none border border-[#E7D7B1] transition-all duration-250 hover:border-[#178C2E]/50"
                placeholder="Cuéntanos por qué quieres darle un hogar a este perrito..."
              />
            </div>

            <PrimaryButton type="submit" variant="primary" fullWidth className="mt-8">
              Enviar solicitud
            </PrimaryButton>
          </form>
        </div>
      </div>
    </Layout>
  );
}
