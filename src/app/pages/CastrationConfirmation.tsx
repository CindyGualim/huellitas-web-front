import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Share2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { formatEventDate } from '../lib/dateUtils';

interface ConfirmationState {
  petName: string;
  eventTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  time: string;
}

// Fecha en formato de Google Calendar (UTC, sin separadores).
function toCalendarDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function CastrationConfirmation() {
  const { state } = useLocation() as { state: ConfirmationState | null };

  // Sin datos de una inscripción real (p. ej. al recargar o entrar directo) no hay nada que confirmar.
  if (!state) {
    return <Navigate to="/events" replace />;
  }

  const confirmationData = {
    eventTitle: state.eventTitle,
    location: state.location,
    date: formatEventDate(state.startDate),
    time: state.time,
    petName: state.petName
  };

  const handleAddToCalendar = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${state.eventTitle} — ${state.petName}`,
      dates: `${toCalendarDate(state.startDate)}/${toCalendarDate(state.endDate)}`,
      details: `Horario asignado: ${state.time}`,
      location: state.location
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const message = `¡Cita confirmada!\nJornada: ${confirmationData.eventTitle}\nLugar: ${confirmationData.location}\nFecha: ${confirmationData.date}\nHora: ${confirmationData.time}\nMascota: ${confirmationData.petName}`;
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
                  { label: 'Jornada', value: confirmationData.eventTitle },
                  { label: 'Lugar', value: confirmationData.location },
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
