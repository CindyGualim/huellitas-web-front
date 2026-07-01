import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';

const upcomingEvents = [
  { id: 1, municipality: 'Guatemala', date: '2026-06-15', available: true, slotsUsed: 12, slotsTotal: 30 },
  { id: 2, municipality: 'Mixco', date: '2026-06-18', available: true, slotsUsed: 8, slotsTotal: 25 },
  { id: 3, municipality: 'Villa Nueva', date: '2026-06-20', available: false, slotsUsed: 20, slotsTotal: 20 },
  { id: 4, municipality: 'San Miguel Petapa', date: '2026-06-22', available: true, slotsUsed: 5, slotsTotal: 30 }
];

export function Castration() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 pb-16">
        <div className="mb-12 text-center">
          <h1 className="text-[#4A2E1F] mb-4 text-3xl md:text-4xl">Jornadas de Castración</h1>
          <p className="text-[#4A2E1F]/70 text-lg max-w-2xl mx-auto">
            Servicio gratuito de esterilización para tu mascota
          </p>
        </div>

        <div className="bg-white rounded-[16px] p-8 mb-8 shadow-sm border border-[#E7D7B1]/50">
          <h2 className="text-[#4A2E1F] mb-4 text-xl">¿Por qué es importante?</h2>
          <p className="text-[#4A2E1F]/80 mb-4 leading-relaxed">
            La esterilización ayuda a controlar la población de animales en la calle, previene enfermedades
            y mejora la calidad de vida de tu mascota. Ofrecemos este servicio completamente gratuito
            en diferentes municipios de Guatemala.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-[#4A2E1F] mb-6 text-2xl">Próximas Jornadas</h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E7D7B1]/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-[#4A2E1F] text-lg font-medium">{event.municipality}</h3>
                    <div className="flex items-center gap-2 text-[#4A2E1F]/70 mt-1">
                      <Calendar size={18} />
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      event.available
                        ? 'bg-[#178C2E]/10 text-[#178C2E] border border-[#178C2E]/20'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {event.available ? 'Cupos disponibles' : 'Lleno'}
                  </span>
                </div>
                <div className="text-sm text-[#4A2E1F]/60 mb-4">
                  {event.slotsUsed}/{event.slotsTotal} cupos ocupados
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/castration/step-1">
          <PrimaryButton variant="primary" fullWidth className="flex items-center justify-center gap-2">
            Inscribir mi mascota
            <ArrowRight size={20} />
          </PrimaryButton>
        </Link>
      </div>
    </Layout>
  );
}
