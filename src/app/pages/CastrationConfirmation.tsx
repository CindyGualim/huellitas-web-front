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
        <div className="bg-[#146B27] px-6 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-white text-3xl">Jornadas de Castración</h1>
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 py-12 pb-16">
          <div className="bg-white rounded-[20px] p-10 mb-6 shadow-sm border border-[#D9D9D9]/50 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[#20A83E]/10 p-6 rounded-full">
                <CheckCircle size={52} className="text-[#20A83E]" />
              </div>
            </div>
            <h2 className="text-[#222222] mb-2 text-3xl">¡Inscripción exitosa!</h2>
            <p className="text-[#222222]/50 mb-8">Tu cita ha sido confirmada</p>

            <div className="bg-[#F8F8F8] rounded-[14px] p-6 text-left mb-8 border border-[#D9D9D9]/50">
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

            <p className="text-[#222222]/40 text-sm mt-8 bg-[#F8F8F8] border border-[#D9D9D9]/50 rounded-xl p-4">
              Recibirás un recordatorio antes de tu cita
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
