import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Share2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

export function CastrationConfirmation() {
  const confirmationData = {
    municipality: 'Guatemala',
    date: '2026-06-15',
    time: '9:00 AM',
    petName: 'Firulais'
  };

  const handleAddToCalendar = () => alert('Evento agregado al calendario (demo)');

  const handleShareWhatsApp = () => {
    const message = `¡Cita confirmada!\nMunicipio: ${confirmationData.municipality}\nFecha: ${confirmationData.date}\nHora: ${confirmationData.time}\nMascota: ${confirmationData.petName}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-white text-2xl font-bold">Jornadas de Castración</h1>
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 py-8 pb-16">
          <div className="bg-white rounded-[16px] p-7 mb-5 shadow-sm border border-[#D9D9D9]/50 text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-[#20A83E]/10 p-4 rounded-full">
                <CheckCircle size={40} className="text-[#20A83E]" />
              </div>
            </div>
            <h2 className="text-[#222222] mb-1.5 text-xl font-bold">¡Inscripción exitosa!</h2>
            <p className="text-[#222222]/50 text-sm mb-5">Tu cita ha sido confirmada</p>

            <div className="bg-[#F8F8F8] rounded-[12px] p-5 text-left mb-5 border border-[#D9D9D9]/50">
              <div className="space-y-3">
                {[
                  { label: 'Municipio', value: confirmationData.municipality },
                  { label: 'Fecha', value: confirmationData.date },
                  { label: 'Hora', value: confirmationData.time },
                  { label: 'Mascota', value: confirmationData.petName },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? 'border-b border-[#D9D9D9]/50' : ''}`}
                  >
                    <span className="text-[#222222]/50 text-sm">{row.label}</span>
                    <span className="text-[#222222] font-medium text-sm">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <PrimaryButton variant="primary" fullWidth onClick={handleAddToCalendar} className="flex items-center justify-center gap-2">
                <Calendar size={18} />
                Agregar al calendario
              </PrimaryButton>
              <PrimaryButton variant="accent" fullWidth onClick={handleShareWhatsApp} className="flex items-center justify-center gap-2">
                <Share2 size={18} />
                Compartir por WhatsApp
              </PrimaryButton>
              <Link to="/home">
                <PrimaryButton variant="ghost" fullWidth>Volver al inicio</PrimaryButton>
              </Link>
            </div>

            <p className="text-[#222222]/40 text-sm mt-5 bg-[#F8F8F8] border border-[#D9D9D9]/50 rounded-xl p-4">
              Recibirás un recordatorio antes de tu cita
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
