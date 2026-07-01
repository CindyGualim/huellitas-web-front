import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Share2 } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PrimaryButton } from '../../components/PrimaryButton';

export function CastrationConfirmation() {
  const navigate = useNavigate();
  const [municipality, setMunicipality] = useState<any>(null);
  const [time, setTime] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const savedMunicipality = sessionStorage.getItem('castration_municipality');
    const savedTime = sessionStorage.getItem('castration_time');
    const savedForm = sessionStorage.getItem('castration_form');

    if (!savedMunicipality || !savedTime || !savedForm) {
      navigate('/castration/step-1');
    } else {
      setMunicipality(JSON.parse(savedMunicipality));
      setTime(savedTime);
      setFormData(JSON.parse(savedForm));
    }
  }, [navigate]);

  const handleAddToCalendar = () => {
    alert('Evento agregado al calendario (demo)');
  };

  const handleShareWhatsApp = () => {
    const message = `¡Cita confirmada! 🐾\nMunicipio: ${municipality?.name}\nFecha: ${municipality?.date}\nHora: ${time}\nMascota: ${formData?.petName}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFinish = () => {
    sessionStorage.removeItem('castration_municipality');
    sessionStorage.removeItem('castration_time');
    sessionStorage.removeItem('castration_form');
    navigate('/home');
  };

  if (!municipality || !formData) return null;

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 pb-16">
        <div className="text-center">
          <div className="bg-white rounded-[16px] p-10 mb-6 shadow-sm border border-[#E7D7B1]/50">
            <div className="flex justify-center mb-6">
              <div className="bg-[#178C2E]/10 p-6 rounded-full">
                <CheckCircle size={56} className="text-[#178C2E]" />
              </div>
            </div>
            <h2 className="text-[#4A2E1F] mb-4 text-3xl">¡Inscripción exitosa!</h2>
            <p className="text-[#4A2E1F]/70 mb-8">Tu cita ha sido confirmada</p>

            <div className="bg-[#FFF9F1] rounded-[12px] p-6 text-left mb-8 border border-[#E7D7B1]/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#E7D7B1]/50">
                  <span className="text-[#4A2E1F]/70">Municipio</span>
                  <span className="text-[#4A2E1F] font-medium">{municipality.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#E7D7B1]/50">
                  <span className="text-[#4A2E1F]/70">Fecha</span>
                  <span className="text-[#4A2E1F] font-medium">{municipality.date}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#E7D7B1]/50">
                  <span className="text-[#4A2E1F]/70">Hora</span>
                  <span className="text-[#4A2E1F] font-medium">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4A2E1F]/70">Mascota</span>
                  <span className="text-[#4A2E1F] font-medium">{formData.petName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <PrimaryButton
                variant="primary"
                fullWidth
                onClick={handleAddToCalendar}
                className="flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Agregar al calendario
              </PrimaryButton>
              <PrimaryButton
                variant="accent"
                fullWidth
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Compartir por WhatsApp
              </PrimaryButton>
              <PrimaryButton variant="ghost" fullWidth onClick={handleFinish}>
                Volver al inicio
              </PrimaryButton>
            </div>

            <p className="text-[#4A2E1F]/60 text-sm mt-8 bg-[#F4C542]/5 border border-[#F4C542]/20 rounded-lg p-4">
              Recibirás un recordatorio antes de tu cita
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
