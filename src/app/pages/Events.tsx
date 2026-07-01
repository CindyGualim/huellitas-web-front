import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/PrimaryButton';
import { events, type AppEvent, type EventCategory } from '../data/events';

function EventCard({ event }: { event: AppEvent }) {
  const isCastration = event.category === 'Jornadas de Castración';
  const isFull = isCastration && event.slotsTotal > 0 && event.slotsUsed >= event.slotsTotal;

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#D9D9D9]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4 gap-2">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
          event.category === 'Jornadas de Castración' ? 'bg-[#20A83E] text-white' : 
          event.category === 'Jornadas de Adopción' ? 'bg-[#146B27] text-white' : 
          'bg-[#D9D9D9] text-[#222222]'
        }`}>
          {event.category}
        </span>
        {isCastration && event.slotsTotal > 0 && (
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
            isFull ? 'bg-red-50 text-red-600 border-red-200' : 'bg-[#20A83E]/10 text-[#20A83E] border-[#20A83E]/20'
          }`}>
            {isFull ? 'Lleno' : 'Cupos disponibles'}
          </span>
        )}
      </div>

      <h3 className="text-[#222222] text-xl font-bold mb-3">{event.title}</h3>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
          <Calendar size={16} className="text-[#20A83E]" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
          <MapPin size={16} className="text-[#20A83E]" />
          <span>{event.municipality}</span>
        </div>
      </div>

      <p className="text-[#222222]/70 text-sm mb-6 flex-1 line-clamp-3">
        {event.description}
      </p>

      {isCastration && event.slotsTotal > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#222222]/60 mb-1.5 font-medium">
            <span>Cupos disponibles</span>
            <span>{event.slotsTotal - event.slotsUsed} de {event.slotsTotal}</span>
          </div>
          <div className="w-full bg-[#D9D9D9]/40 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-[#20A83E]'}`}
              style={{ width: `${Math.min((event.slotsUsed / event.slotsTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto">
        {isCastration ? (
          <Link to={`/events/register/${event.id}`}>
            <PrimaryButton 
              variant={isFull ? "ghost" : "primary"} 
              fullWidth 
              disabled={isFull}
            >
              {isFull ? 'Sin cupos disponibles' : 'Inscribirse ahora'}
            </PrimaryButton>
          </Link>
        ) : (
          <button className="w-full bg-[#F8F8F8] text-[#222222] py-3 rounded-xl font-medium border border-[#D9D9D9] hover:border-[#20A83E]/50 transition-colors flex items-center justify-center gap-2">
            Ver detalles <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Events() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'Todas'>('Todas');

  const categories: (EventCategory | 'Todas')[] = [
    'Todas',
    'Jornadas de Castración',
    'Jornadas de Vacunación',
    'Jornadas de Adopción'
  ];

  const filteredEvents = events.filter(e => activeCategory === 'Todas' || e.category === activeCategory);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-[#146B27] px-6 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#20A83E]/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="mx-auto max-w-6xl relative z-10 text-center md:text-left">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Próximos Eventos</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Únete a nosotros en nuestras jornadas de salud, castración y adopción en distintos municipios. Tu participación hace la diferencia.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 pb-24">
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl transition-all duration-250 cursor-pointer text-sm font-medium whitespace-nowrap transform hover:scale-[1.02] active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-[#20A83E] text-white shadow-md'
                    : 'bg-[#F8F8F8] text-[#222222] hover:bg-[#D9D9D9]/50 border border-[#D9D9D9]/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F8F8F8] rounded-[24px] border border-[#D9D9D9]/50">
              <div className="text-6xl mb-4 opacity-50">📅</div>
              <h3 className="text-[#222222] mb-2 text-xl font-medium">No hay eventos programados</h3>
              <p className="text-[#222222]/60">Pronto anunciaremos nuevas fechas para esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}